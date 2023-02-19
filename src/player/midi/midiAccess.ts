import { err, ok, type Result } from "@/misc/Result";

export async function requestMidiAccess(
  onStateChange: (midiAccess: WebMidi.MIDIAccess) => void
) {
  const midiAccess: Result<WebMidi.MIDIAccess, string> = await window.navigator
    .requestMIDIAccess()
    .then((access) => {
      access.addEventListener("statechange", (e) => {
        if (e.port.type !== "output") return;

        onStateChange(access);
      });

      return ok(access);
    })
    .catch((error: string) => {
      return err(error);
    });

  return midiAccess;
}
