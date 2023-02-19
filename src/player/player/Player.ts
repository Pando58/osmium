import type {
  HandlerCoreGraph,
  HandlerCoreSection,
  HandlerCoreTrack,
} from "@/core/communication/handlers";
import type { PlayerManager } from "./playerManager";

const stepTime = 60 / 126 / 4; // 60 mins / BPM / subdivision

export class Player {
  private pm: PlayerManager;
  private ctx: AudioContext | null = null;
  private tracks: Map<number, HandlerCoreTrack> = new Map();
  private sections: Map<number, HandlerCoreSection> = new Map();
  private graphs: Map<number, HandlerCoreGraph> = new Map();
  private playing = false;

  constructor(pm: PlayerManager) {
    this.pm = pm;
  }

  async play() {
    if (this.playing) return;

    this.playing = true;

    if (!this.ctx) {
      this.ctx = new AudioContext();
    }

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    this.updateState();

    this.scheduleStep(0, this.ctx!.currentTime);
  }

  private scheduleStep(pos: number, startTime: number) {
    if (!this.playing) return;

    this.step(pos);

    const nextTime =
      (startTime + (pos + 1) * stepTime - this.ctx!.currentTime) * 1000;

    setTimeout(() => this.scheduleStep(pos + 1, startTime), nextTime);
  }

  private async step(pos: number) {
    for (const section of [...this.sections.values()]) {
      const { position, length } = section;

      play: if (pos >= position && pos <= position + length) {
        const graph = this.graphs.get(section.graphId!);
        if (!graph) break play;

        if (pos === position + length) {
          this.pm.evtsPlayer.emit("graph_stop", {
            id: graph.id,
            instanceId: section.id,
          });

          break play;
        }

        if (pos === position) {
          this.pm.evtsPlayer.emit("graph_play", {
            id: graph.id,
            instanceId: section.id,
          });
        }

        const data = await this.pm.cmdsCore.request("graph_step", {
          id: graph.id,
          instanceId: section.id,
        });
      }
    }
  }

  async updateState() {
    const tracks = await this.getTracks();

    const sections: Map<number, HandlerCoreSection> = new Map();

    for (const track of [...tracks.values()]) {
      const trackSections = await this.getSections(track);

      for (const [sectionId, section] of [...trackSections]) {
        sections.set(sectionId, section);
      }
    }

    const graphs: Map<number, HandlerCoreGraph> = new Map();

    for (const section of [...sections.values()]) {
      if (section.graphId === null) continue;

      const graph = await this.getGraph(section.graphId);

      if (graph) {
        graphs.set(section.graphId, graph);
      }
    }

    this.tracks = tracks;
    this.sections = sections;
    this.graphs = graphs;
  }

  private async getTracks() {
    const trackIds = await this.pm.cmdsCore
      .request("track_ids", null)
      .catch((err) => {
        console.error(err);
        return [];
      });

    const tracks: Map<number, HandlerCoreTrack> = new Map();

    for (const id of trackIds) {
      const track = await this.pm.cmdsCore
        .request("track", { id })
        .catch((err) => {
          console.error(err);
          return null;
        });

      if (track) {
        tracks.set(id, track);
      }
    }

    return tracks;
  }

  private async getSections(track: HandlerCoreTrack) {
    const sections: Map<number, HandlerCoreSection> = new Map();

    for (const id of track.sectionIds) {
      const section = await this.pm.cmdsCore
        .request("section", { id })
        .catch((err) => {
          console.error(err);
          return null;
        });

      if (section) {
        sections.set(id, section);
      }
    }

    return sections;
  }

  private async getGraph(id: number) {
    const graph = await this.pm.cmdsCore
      .request("graph", { id })
      .catch((err) => {
        console.error(err);
        return null;
      });

    return graph;
  }
}
