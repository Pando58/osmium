import type { EventHandler } from "@/communication/eventHandler";
import { getNextId } from "@/misc/getNextId";
import { Err, Ok, type Result } from "@/misc/Result";
import { Graph } from "./classes/Graph";
import { Section } from "./classes/Section";
import { Track } from "./classes/Track";
import type {
  CoreEventMap,
  HandlerCoreSection,
} from "./communication/handlers";

export class CoreManager {
  tracks: Map<number, Track>;
  sections: Map<number, Section>;
  graphs: Map<number, Graph>;
  evtsCore: EventHandler<CoreEventMap>;

  constructor(evtsCore: EventHandler<CoreEventMap>) {
    this.evtsCore = evtsCore;

    this.tracks = new Map();
    this.sections = new Map();
    this.graphs = new Map();
  }

  newTrack() {
    const id = getNextId(this.tracks);
    const track = new Track();

    track.name = "Track " + id;

    this.tracks.set(id, track);

    this.evtsCore.emit("update_tracks", null);
  }

  getTrack(id: number): Result<Track, string> {
    const track = this.tracks.get(id);

    if (!track) {
      return Err(`Track with id ${id} does not exist`);
    }

    return Ok(track);
  }

  newSection(trackId: number): Result<null, string> {
    const track = this.tracks.get(trackId);

    if (!track) {
      return Err(`Track with id ${trackId} does not exist`);
    }

    const id = getNextId(this.sections);
    const section = new Section();

    track.sectionIds = [...track.sectionIds, id];

    this.sections.set(id, section);

    this.evtsCore.emit("update_track", { id: trackId });

    return Ok(null);
  }

  getSection(id: number): Result<Section, string> {
    const section = this.sections.get(id);

    if (!section) {
      return Err(`Section with id ${id} does not exist`);
    }

    return Ok(section);
  }

  updateSection(
    id: number,
    props: Partial<Omit<HandlerCoreSection, "id">>
  ): Result<null, string> {
    const sectionResult = this.getSection(id);

    if (!sectionResult.ok) return sectionResult;

    if ("position" in props) sectionResult.value.position = props.position!;
    if ("length" in props) sectionResult.value.length = props.length!;

    this.evtsCore.emit("update_section", { id });

    return Ok(null);
  }

  newGraph() {
    const id = getNextId(this.graphs);
    const graph = new Graph();

    graph.name = "Graph " + id;

    this.graphs.set(id, graph);

    this.evtsCore.emit("update_graphs", null);
  }

  getGraph(id: number) {
    const graph = this.graphs.get(id);

    if (!graph) {
      return Err(`Graph with id ${id} does not exist`);
    }

    return Ok(graph);
  }
}
