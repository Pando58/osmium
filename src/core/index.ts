import { evtsCore } from "./communication/handlers";
import { init } from "./communication/init";
import { CoreManager } from "./CoreManager";

const coreManager = new CoreManager(evtsCore);

init(coreManager);
