import { getNextId } from "@/misc/getNextId";
import { Err, Ok, type Result } from "@/misc/Result";
import { Graph } from "./classes/Graph";
import { Section } from "./classes/Section";
import { Track } from "./classes/Track";

export class CoreManager {
  tracks: Map<number, Track>;
  sections: Map<number, Section>;
  graphs: Map<number, Graph>;

  constructor() {
    this.tracks = new Map();
    this.sections = new Map();
    this.graphs = new Map();
  }

  newTrack() {
    const id = getNextId(this.tracks);
    const track = new Track();

    track.name = "Track " + id;

    this.tracks.set(id, track);
  }

  getTrack(id: number): Result<Track, string> {
    const track = this.tracks.get(id);

    if (!track) {
      return Err(`Track with id ${id} does not exist`);
    }

    return Ok(track);
  }

  newSection(trackId: number): Result<unknown, string> {
    const track = this.tracks.get(trackId);

    if (!track) {
      return Err(`Track with id ${trackId} does not exist`);
    }

    const id = getNextId(this.sections);
    const section = new Section();

    track.sectionIds = [...track.sectionIds, id];

    this.sections.set(id, section);

    return Ok(null);
  }

  getSection(id: number): Result<Section, string> {
    const section = this.sections.get(id);

    if (!section) {
      return Err(`Section with id ${id} does not exist`);
    }

    return Ok(section);
  }

  newGraph() {
    const id = getNextId(this.graphs);
    const graph = new Graph();

    graph.name = "Graph " + id;

    this.graphs.set(id, graph);
  }

  getGraph(id: number) {
    const graph = this.graphs.get(id);

    if (!graph) {
      return Err(`Graph with id ${id} does not exist`);
    }

    return Ok(graph);
  }
}
