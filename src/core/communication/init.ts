import { err, ok, type Result } from "@/misc/Result";
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

    const { sectionIds, name } = track.value;

    return ok({
      id,
      sectionIds: [...sectionIds],
      name,
    });
  });

  cmdsCore.take("section", ({ id }): Result<HandlerCoreSection, string> => {
    const section = coreManager.getSection(id);

    if (!section.ok) return err(section.error);

    const { position, length } = section.value;

    return ok({
      id,
      position,
      length,
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

    const { name, dataType, ioType, connectedPin } = pin.value;

    return ok({
      id,
      name,
      dataType,
      ioType,
      connectedPinId: connectedPin ? connectedPin.id : null,
    });
  });

  evtsUI.on("create_track", () => {
    coreManager.newTrack();
  });

  evtsUI.on("create_section", ({ trackId }) => {
    coreManager.newSection(trackId);
  });

  evtsUI.on("update_section", ({ sectionId, props }) => {
    const section = coreManager.getSection(sectionId);

    if (!section.ok) return console.error(section.error);

    if ("position" in props) section.value.position = props.position!;
    if ("length" in props) section.value.length = props.length!;

    evtsCore.emit("update_section", { id: sectionId });
  });

  evtsUI.on("create_graph", () => {
    coreManager.newGraph();
  });
}
