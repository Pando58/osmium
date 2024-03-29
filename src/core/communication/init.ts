import { err, ok, type Result } from "@/misc/Result";
import { evtsPlayer } from "@/player/communication/handlers";
import { evtsUI } from "@/ui/communication/handlers";
import type { CoreManager } from "../CoreManager";
import {
  cmdsCore,
  evtsCore,
  type HandlerCoreGraph,
  type HandlerCoreNode,
  type HandlerCorePin,
  type HandlerCoreSection,
  type HandlerCoreTrack,
} from "./handlers";

export function init(coreManager: CoreManager) {
  cmdsCore.take("track_ids", () => {
    return ok([...coreManager.tracks.keys()]);
  });

  cmdsCore.take("track", ({ id }): Result<HandlerCoreTrack, string> => {
    const track = coreManager.getTrack(id);

    if (!track.ok) return err(track.error);

    const { sectionIds, name, midiOutputId, midiOutputChannel } = track.value;

    return ok({
      id,
      sectionIds: [...sectionIds],
      name,
      midiOutputId,
      midiOutputChannel,
    });
  });

  cmdsCore.take("section", ({ id }): Result<HandlerCoreSection, string> => {
    const section = coreManager.getSection(id);

    if (!section.ok) return err(section.error);

    const { position, length, graphId } = section.value;

    return ok({
      id,
      position,
      length,
      graphId,
    });
  });

  cmdsCore.take("graph_ids", () => {
    return ok([...coreManager.graphs.keys()]);
  });

  cmdsCore.take("graph", ({ id }): Result<HandlerCoreGraph, string> => {
    const graph = coreManager.getGraph(id);

    if (!graph.ok) return err(graph.error);

    const { nodeIds, name } = graph.value;

    return ok({
      id,
      nodeIds: [...nodeIds],
      name,
    });
  });

  cmdsCore.take("node", ({ id }): Result<HandlerCoreNode, string> => {
    const node = coreManager.getNode(id);

    if (!node.ok) return err(node.error);

    const { pinIds, name, x, y } = node.value;

    return ok({
      id,
      pinIds: [...pinIds],
      name,
      x,
      y,
    });
  });

  cmdsCore.take("pin", ({ id }): Result<HandlerCorePin, string> => {
    const pin = coreManager.getPin(id);

    if (!pin.ok) return err(pin.error);

    const { name, dataType, ioType, connectedPin, defaultValue } = pin.value;

    return ok({
      id,
      name,
      dataType,
      ioType,
      connectedPinId: connectedPin ? connectedPin.id : null,
      defaultValue,
    });
  });

  evtsUI.on("create_track", () => {
    coreManager.newTrack();
  });

  evtsUI.on("update_track_midi_output_id", ({ id, outputId }) => {
    const result = coreManager.getTrack(id);

    if (!result.ok) return console.error(result.error);

    const track = result.value;

    track.midiOutputId = outputId;

    evtsCore.emit("update_track", { id });
  });

  evtsUI.on("update_track_midi_output_channel", ({ id, channel }) => {
    if (channel < 0 || channel > 15) {
      return console.error("Midi channels must have a value between 0 and 15");
    }

    const result = coreManager.getTrack(id);

    if (!result.ok) return console.error(result.error);

    const track = result.value;

    track.midiOutputChannel = channel;

    evtsCore.emit("update_track", { id });
  });

  evtsUI.on("create_section", ({ trackId }) => {
    coreManager.newSection(trackId);
  });

  evtsUI.on("update_section", ({ sectionId, props }) => {
    const section = coreManager.getSection(sectionId);

    if (!section.ok) return console.error(section.error);

    if ("position" in props)
      section.value.position = Math.max(0, Math.floor(props.position!));
    if ("length" in props)
      section.value.length = Math.max(1, Math.floor(props.length!));

    evtsCore.emit("update_section", { id: sectionId });
  });

  evtsUI.on("update_section_graph", ({ id, graphId }) => {
    const sectionRes = coreManager.getSection(id);

    if (!sectionRes.ok) return console.error(sectionRes.error);

    const section = sectionRes.value;

    if (section.graphId !== null) {
      const graph = coreManager.getGraph(section.graphId).unwrap()!;
      graph.deleteInstance(id);
    }

    if (graphId !== null) {
      const graph = coreManager.getGraph(graphId).unwrap()!;
      graph.instance(id);
    }

    section.graphId = graphId;
  });

  evtsUI.on("create_graph", () => {
    coreManager.newGraph();
  });

  evtsUI.on("create_node", ({ graphId, type, x, y }) => {
    const result = coreManager.newNode(graphId, type);

    if (!result.ok) return console.error(result.error);

    const node = result.value;

    node.x = x;
    node.y = y;
  });

  evtsUI.on("delete_node", ({ id }) => {
    coreManager.deleteNode(id);
  });

  evtsUI.on("move_node", ({ id, x, y }) => {
    const result = coreManager.getNode(id);

    if (!result.ok) return console.error(result.error);

    const node = result.value;

    node.x = x;
    node.y = y;

    // evtsCore.emit("update_node", { id });
  });

  evtsUI.on("connect_pins", ({ id1, id2 }) => {
    const result1 = coreManager.getPin(id1);
    const result2 = coreManager.getPin(id2);

    if (!result1.ok) return console.error(result1.error);
    if (!result2.ok) return console.error(result2.error);

    const pin1 = result1.value;
    const pin2 = result2.value;

    pin1.connect(pin2);

    const otherPinId = pin1.canHaveConnectedPin() ? pin2.id : pin1.id;

    const node = [...coreManager.nodes.values()].find(({ pinIds }) =>
      pinIds.includes(otherPinId)
    );

    if (!node) return;

    evtsCore.emit("update_node", { id: node.id });
  });

  evtsUI.on("disconnect_pin", ({ id }) => {
    const pin = coreManager.getPin(id);

    if (!pin.ok) return console.error(pin.error);

    const otherPinId = pin.value.connectedPin?.id;

    pin.value.disconnect();

    if (otherPinId === undefined) return;

    const node = [...coreManager.nodes.values()].find(({ pinIds }) =>
      pinIds.includes(otherPinId)
    );

    if (!node) return;

    evtsCore.emit("update_node", { id: node.id });
  });

  evtsUI.on("update_pin_default_value", ({ id, value }) => {
    const result = coreManager.getPin(id);

    if (!result.ok) return console.error(result.error);

    const pin = result.value;

    pin.setDefaultValue(value);
  });

  //

  cmdsCore.take("graph_step", ({ id, instanceId }) => {
    const result = coreManager.getGraph(id);
    if (!result.ok) return err(result.error);

    const graph = result.value;

    const data = graph.step(instanceId);

    return ok(data);
  });

  evtsPlayer.on("graph_play", ({ id, instanceId }) => {
    const result = coreManager.getGraph(id);
    if (!result.ok) return console.error(result.error);

    const graph = result.value;

    graph.play(instanceId);
  });

  evtsPlayer.on("graph_stop", ({ id, instanceId }) => {
    const result = coreManager.getGraph(id);
    if (!result.ok) return console.error(result.error);

    const graph = result.value;

    graph.stop(instanceId);
  });
}
