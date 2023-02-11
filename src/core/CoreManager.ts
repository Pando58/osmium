import type { EventHandler } from "@/communication/eventHandler";
import { getNextId } from "@/misc/getNextId";
import { err, ok, type Result } from "@/misc/Result";
import { Graph } from "./classes/Graph";
import type { GraphNode } from "./classes/GraphNode";
import {
  nodeFactories,
  type NodeFactory,
} from "./classes/nodes/factory/nodeFactories";
import { Section } from "./classes/Section";
import { Track } from "./classes/Track";
import type { CoreEventMap } from "./communication/handlers";

export class CoreManager {
  evtsCore: EventHandler<CoreEventMap>;
  tracks: Map<number, Track>;
  sections: Map<number, Section>;
  graphs: Map<number, Graph>;
  nodes: Map<number, GraphNode>;

  constructor(evtsCore: EventHandler<CoreEventMap>) {
    this.evtsCore = evtsCore;

    this.tracks = new Map();
    this.sections = new Map();
    this.graphs = new Map();
    this.nodes = new Map();
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
      return err(`Track with id ${id} does not exist`);
    }

    return ok(track);
  }

  newSection(trackId: number): Result<null, string> {
    const track = this.tracks.get(trackId);

    if (!track) {
      return err(`Track with id ${trackId} does not exist`);
    }

    const id = getNextId(this.sections);
    const section = new Section();

    track.sectionIds = [...track.sectionIds, id];

    this.sections.set(id, section);

    this.evtsCore.emit("update_track", { id: trackId });

    return ok(null);
  }

  getSection(id: number): Result<Section, string> {
    const section = this.sections.get(id);

    if (!section) {
      return err(`Section with id ${id} does not exist`);
    }

    return ok(section);
  }

  newGraph() {
    const id = getNextId(this.graphs);
    const graph = new Graph(id, this);

    graph.name = "Graph " + id;

    this.graphs.set(id, graph);

    this.evtsCore.emit("update_graphs", null);

    graph.init();
  }

  getGraph(id: number): Result<Graph, string> {
    const graph = this.graphs.get(id);

    if (!graph) {
      return err(`Graph with id ${id} does not exist`);
    }

    return ok(graph);
  }

  newNode(
    graphId: number,
    name: NodeFactory["name"]
  ): Result<GraphNode, string> {
    const graph = this.graphs.get(graphId);

    if (!graph) {
      return err(`Graph with id ${graphId} does not exist`);
    }

    const id = getNextId(this.nodes);

    const nodeFactory = nodeFactories.find((i) => i.name === name);

    if (!nodeFactory) {
      return err(`Node factory "${name}" does not exist`);
    }

    const node = nodeFactory.create();

    graph.nodeIds = [...graph.nodeIds, id];

    this.nodes.set(id, node);

    this.evtsCore.emit("update_graph", { id: graphId });

    return ok(
      new Proxy(node, {
        set: (...args) => {
          const r = Reflect.set(...args);

          this.evtsCore.emit("update_node", { id });

          return r;
        },
      })
    );
  }

  getNode(id: number): Result<GraphNode, string> {
    const node = this.nodes.get(id);

    if (!node) {
      return err(`Node with id ${id} does not exist`);
    }

    return ok(node);
  }
}
