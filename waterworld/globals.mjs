import { action, DQNAgent }  from "./dqnagent.mjs";
import WaterWorld from "./waterworld.mjs";

// hack, as p5.js does not support ES6 modules
// when it does, move the above imports into sketch.js and remove this file
window.action = action;
window.DQNAgent = DQNAgent;
window.WaterWorld = WaterWorld;
