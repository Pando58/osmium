import { getNextId } from "@/misc/getNextId";
import { Err, Ok, type Result } from "@/misc/Result";
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
    const id = getNextId(this.tracks);
    const track = new Track();

    track.name = "Track " + id;

    this.tracks.set(id, track);
  }

  getTrack(id: number): Result<Track, string> {
    const track = this.tracks.get(id);

    if (!track) {
      return Err(`Track with id ${id} does not exist`);
    }

    return Ok(track);
  }

  newSection(trackId: number): Result<unknown, string> {
    const track = this.tracks.get(trackId);

    if (!track) {
      return Err(`Track with id ${trackId} does not exist`);
    }

    const id = getNextId(this.sections);
    const section = new Section();

    track.sectionIds = [...track.sectionIds, id];

    this.sections.set(id, section);

    return Ok(null);
  }

  getSection(id: number): Result<Section, string> {
    const section = this.sections.get(id);

    if (!section) {
      return Err(`Section with id ${id} does not exist`);
    }

    return Ok(section);
  }
}
