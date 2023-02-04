import { getNextId } from "@/misc/getNextId";
import { Section } from "./classes/Section";
import { Track } from "./classes/Track";

export class CoreManager {
  tracks: Map<number, Track>;
  sections: Map<number, Section>;

  constructor() {
    this.tracks = new Map();
    this.sections = new Map();
  }

  newTrack() {
    const trackId = getNextId(this.tracks);
    const track = new Track();

    track.name = "Track " + trackId;

    this.tracks.set(trackId, track);
  }

  newSection(trackId: number) {
    const track = this.tracks.get(trackId);

    if (!track) {
      console.error(`Track with id '${trackId}' does not exist`);
      return;
    }

    const sectionId = getNextId(this.sections);
    const section = new Section();

    track.sectionIds = [...track.sectionIds, sectionId];

    this.sections.set(sectionId, section);
  }
}
