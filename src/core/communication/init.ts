import { evtsUI } from "@/ui/communication/handlers";
import type { CoreManager } from "../CoreManager";
import {
  cmdsCore,
  evtsCore,
  type HandlerCoreSection,
  type HandlerCoreTrack,
} from "./handlers";

export function init(coreManager: CoreManager) {
  cmdsCore.take("tracks", () => getMsgTracks());
  cmdsCore.take("sections", ({ trackId }) => getMsgSections(trackId));

  evtsUI.on("create_track", () => {
    coreManager.newTrack();

    evtsCore.emit("update_tracks", null);
  });

  evtsUI.on("create_section", ({ trackId }) => {
    coreManager.newSection(trackId);

    evtsCore.emit("update_sections", null);
  });

  //
  function getMsgTracks(): HandlerCoreTrack[] {
    return [...coreManager.tracks.entries()].map(([trackId, track]) => ({
      id: trackId,
      name: track.name,
      sections: [...coreManager.sections.keys()],
    }));
  }

  function getMsgSections(trackId: number): HandlerCoreSection[] {
    return [...coreManager.sections.entries()]
      .filter(([_, section]) => section.trackId === trackId)
      .map(([sectionId, section]) => ({
        id: sectionId,
        start: section.start,
        end: section.end,
      }));
  }
}
