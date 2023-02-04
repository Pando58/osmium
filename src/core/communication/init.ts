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
}
