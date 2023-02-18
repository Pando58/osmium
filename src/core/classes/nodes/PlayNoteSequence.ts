import type { CoreManager } from "@/core/CoreManager";
import { GraphNode } from "../GraphNode";
import type { Pin } from "../Pin";
import type { NoteEvent } from "../pinDataTypes/pinDataTypes";

export class PlayNoteSequence extends GraphNode {
  piPlay: Pin<"execution", "input"> = null!;
  piNoteSequence: Pin<"noteSequence", "input"> = null!;
  piLoop: Pin<"boolean", "input"> = null!;
  poOutNotes: Pin<"noteEvents", "output"> = null!;
  states: Map<
    number,
    {
      playing: boolean;
      position: number;
    }
  > = new Map();

  constructor(id: number, coreManager: CoreManager) {
    super(id, coreManager);

    this.name = "Play Note Sequence";
  }

  createState(instanceId: number) {
    this.states.set(instanceId, { playing: false, position: 0 });
  }

  init() {
    const { coreManager: cm, id } = this;

    this.piPlay = cm.newPin(id, "execution", "input").unwrap()!;
    this.piNoteSequence = cm.newPin(id, "noteSequence", "input").unwrap()!;
    this.piLoop = cm.newPin(id, "boolean", "input").unwrap()!;
    this.poOutNotes = cm.newPin(this.id, "noteEvents", "output").unwrap()!;

    this.piPlay.name = "Play";
    this.piNoteSequence.name = "Note Sequence";
    this.piLoop.name = "Loop";
    this.poOutNotes.name = "Note Events";

    this.piPlay.onTrigger((instanceId) => {
      const state = this.states.get(instanceId);
      if (!state) return;

      state.playing = true;
    });
  }

  stop(instanceId: number) {
    const state = this.states.get(instanceId);
    if (!state) return;

    state.playing = false;
    state.position = 0;
  }

  step(instanceId: number) {
    const state = this.states.get(instanceId);
    if (!state) return;

    const noteSequence = this.piNoteSequence.trigger(instanceId);
    if (!noteSequence) return;

    const loop = this.piLoop.trigger(instanceId);
    if (typeof loop !== "boolean") return;

    const outNotes: NoteEvent[] = [];

    if (state.position >= noteSequence.length) {
      state.position = 0;
      state.playing = loop;

      outNotes.push({ type: "all_notes_off" });
    }

    if (state.playing) {
      for (const note of noteSequence.notes) {
        if (note.position !== state.position) continue;

        outNotes.push({ ...note });
      }

      state.position++;
    }

    this.poOutNotes.setValue(instanceId, outNotes);
  }
}
