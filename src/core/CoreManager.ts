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
    if (!this.tracks.has(trackId)) {
      console.error(`Track with id '${trackId}' does not exist`);
      return;
    }

    const sectionId = getNextId(this.sections);
    const section = new Section();

    section.trackId = trackId;

    this.sections.set(sectionId, section);
  }
}

function getNextId(map: Map<number, unknown>) {
  for (let i = 0; i < map.size; i++) {
    if (!map.has(i)) {
      return i;
    }
  }

  return map.size;
}
