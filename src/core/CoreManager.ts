import type { EventHandler } from "@/communication/eventHandler";
import { getNextId } from "@/misc/getNextId";
import { err, ok, type Result } from "@/misc/Result";
import { Graph } from "./classes/Graph";
import type { GraphNode } from "./classes/GraphNode";
import {
  nodeFactories,
  type NodeFactory,
} from "./classes/nodes/factory/nodeFactories";
import { Pin } from "./classes/Pin";
import type {
  PinDataType,
  PinIOType,
} from "./classes/pinDataTypes/pinDataTypes";
import { Section } from "./classes/Section";
import { Track } from "./classes/Track";
import type { CoreEventMap } from "./communication/handlers";

export class CoreManager {
  evtsCore: EventHandler<CoreEventMap>;
  tracks: Map<number, Track>;
  sections: Map<number, Section>;
  graphs: Map<number, Graph>;
  nodes: Map<number, GraphNode>;
  pins: Map<number, Pin>;

  constructor(evtsCore: EventHandler<CoreEventMap>) {
    this.evtsCore = evtsCore;

    this.tracks = new Map();
    this.sections = new Map();
    this.graphs = new Map();
    this.nodes = new Map();
    this.pins = new Map();
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

    const node = nodeFactory.create(id, this);

    graph.nodeIds = [...graph.nodeIds, id];

    this.nodes.set(id, node);

    this.evtsCore.emit("update_graph", { id: graphId });

    node.init();

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

  deleteNode(id: number) {
    const node = this.nodes.get(id);

    if (!node) {
      return err(`Node with id ${id} does not exist`);
    }

    let graphId = -1;

    for (const [gId, graph] of [...this.graphs]) {
      if (graph.nodeIds.includes(id)) {
        graph.nodeIds = graph.nodeIds.filter((i) => i !== id);
        graphId = gId;
        break;
      }
    }

    for (const pinId of node.pinIds) {
      this.deletePin(pinId);
    }

    this.nodes.delete(id);

    this.evtsCore.emit("update_graph", { id: graphId });
  }

  getNode(id: number): Result<GraphNode, string> {
    const node = this.nodes.get(id);

    if (!node) {
      return err(`Node with id ${id} does not exist`);
    }

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

  newPin<T extends PinDataType, U extends PinIOType>(
    nodeId: number,
    dataType: T,
    ioType: U
  ): Result<Pin<T, U>, string> {
    const node = this.nodes.get(nodeId);

    if (!node) {
      return err(`Node with id ${nodeId} does not exist`);
    }

    const id = getNextId(this.pins);

    const pin = new Pin(dataType, ioType, id);

    node.pinIds = [...node.pinIds, id];

    this.pins.set(id, pin);

    this.evtsCore.emit("update_node", { id: nodeId });

    return ok(
      new Proxy(pin, {
        set: (...args) => {
          const r = Reflect.set(...args);

          this.evtsCore.emit("update_node", { id: nodeId });

          return r;
        },
      })
    );
  }

  deletePin(id: number) {
    const pin = this.pins.get(id);

    if (!pin) {
      return err(`Pin with id ${id} does not exist`);
    }

    let nodeId = -1;

    for (const [nId, node] of [...this.nodes]) {
      if (node.pinIds.includes(id)) {
        node.pinIds = node.pinIds.filter((i) => i !== id);
        nodeId = nId;
        break;
      }
    }

    if (pin.canHaveConnectedPin()) {
      if (pin.connectedPin) {
        pin.disconnect();
      }
    } else {
      for (const p of [...this.pins.values()]) {
        if (p.connectedPin?.id === id) {
          p.disconnect();
        }
      }
    }

    this.pins.delete(id);

    this.evtsCore.emit("update_node", { id: nodeId });
  }

  getPin(id: number): Result<Pin, string> {
    const pin = this.pins.get(id);

    if (!pin) {
      return err(`Pin with id ${id} does not exist`);
    }

    return ok(
      new Proxy(pin, {
        set: (...args) => {
          const r = Reflect.set(...args);

          const nodeId = [...this.nodes].find(([k, v]) =>
            v.pinIds.includes(id)
          );

          if (nodeId !== undefined) {
            this.evtsCore.emit("update_node", { id: nodeId[0] });
          }

          return r;
        },
      })
    );
  }
}
