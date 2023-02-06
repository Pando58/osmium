import { Err, Ok, type Result } from "@/misc/Result";
import { evtsUI } from "@/ui/communication/handlers";
import type { CoreManager } from "../CoreManager";
import {
  cmdsCore,
  evtsCore,
  type HandlerCoreGraph,
  type HandlerCoreSection,
  type HandlerCoreTrack,
} from "./handlers";

export function init(coreManager: CoreManager) {
  cmdsCore.take("track_ids", () => {
    return Ok([...coreManager.tracks.keys()]);
  });

  cmdsCore.take("track", ({ id }): Result<HandlerCoreTrack, string> => {
    const track = coreManager.getTrack(id);

    if (!track.ok) return Err(track.error);

    const { sectionIds, name } = track.value;

    return Ok({
      id,
      sectionIds: [...sectionIds],
      name,
    });
  });

  cmdsCore.take("section", ({ id }): Result<HandlerCoreSection, string> => {
    const section = coreManager.getSection(id);

    if (!section.ok) return Err(section.error);

    const { position, length } = section.value;

    return Ok({
      id,
      position,
      length,
    });
  });

  cmdsCore.take("graph_ids", () => {
    return Ok([...coreManager.graphs.keys()]);
  });

  cmdsCore.take("graph", ({ id }): Result<HandlerCoreGraph, string> => {
    const graph = coreManager.getGraph(id);

    if (!graph.ok) return Err(graph.error);

    const { name } = graph.value;

    return Ok({
      id,
      name,
    });
  });

  evtsUI.on("create_track", () => {
    coreManager.newTrack();

    evtsCore.emit("update_tracks", null);
  });

  evtsUI.on("create_section", ({ trackId }) => {
    coreManager.newSection(trackId);

    evtsCore.emit("update_track", { id: trackId });
  });

  evtsUI.on("update_section", ({ sectionId, props }) => {
    const section = coreManager.getSection(sectionId);

    if (!section.ok) {
      console.error(section.error);
      return;
    }

    if ("position" in props) section.value.position = props.position!;
    if ("length" in props) section.value.length = props.length!;

    evtsCore.emit("update_section", { id: sectionId });
  });

  evtsUI.on("create_graph", () => {
    coreManager.newGraph();

    evtsCore.emit("update_graphs", null);
  });
}
