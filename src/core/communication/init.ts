import { evtsUI } from "@/ui/communication/handlers";
import type { CoreManager } from "../CoreManager";
import { cmdsCore, evtsCore } from "./handlers";

export function init(coreManager: CoreManager) {
  cmdsCore.take("track_ids", () => [...coreManager.tracks.keys()]);
  cmdsCore.take("track", ({ id }) => {
    const { sectionIds, name } = coreManager.tracks.get(id)!;

    return {
      id,
      sectionIds,
      name,
    };
  });
  cmdsCore.take("section", ({ id }) => {
    const { position, length } = coreManager.sections.get(id)!;

    return {
      id,
      position,
      length,
    };
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

    if (!section) return;

    if ("position" in props) section.position = props.position!;
    if ("length" in props) section.length = props.length!;

    evtsCore.emit("update_section", { id: sectionId });
  });
}
