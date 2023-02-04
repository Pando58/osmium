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
    const { start, end } = coreManager.sections.get(id)!;

    return {
      id,
      start,
      end,
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

    if ("start" in props) section.start = props.start!;
    if ("end" in props) section.end = props.end!;

    evtsCore.emit("update_section", { id: sectionId });
  });
}
