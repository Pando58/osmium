import { ok } from "@/misc/Result";
import { evtsUI } from "@/ui/communication/handlers";
import { requestMidiAccess } from "../midi/midiAccess";
import type { Player } from "../player/Player";
import { cmdsPlayer, evtsPlayer } from "./handlers";

export async function init(player: Player) {
  const midiAccessResult = await requestMidiAccess((_access) => {
    evtsPlayer.emit("update_midi_outputs", null);
  });

  if (!midiAccessResult.ok) return console.error(midiAccessResult.error);

  const midi = midiAccessResult.value;

  cmdsPlayer.take("midi_outputs", () => {
    return ok(
      [...midi.outputs].map(([id, output]) => ({
        id,
        name: output.name || "unnamed port",
      }))
    );
  });

  evtsUI.on("play", () => {
    player.play();
  });
}
