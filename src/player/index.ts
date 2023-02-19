import { cmdsCore } from "@/core/communication/handlers";
import { evtsPlayer } from "./communication/handlers";
import { init } from "./communication/init";
import { Player } from "./player/Player";

const player = new Player({ evtsPlayer, cmdsCore });

init(player);
