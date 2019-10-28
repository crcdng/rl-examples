import { action, DPAgent }  from "./dpagent.mjs";
import GridWorld from "./gridworld.mjs";

// hack, as p5.js does not support ES6 modules
// when it does, move the above imports into sketch.js and remove this file
window.action = action;
window.DPAgent = DPAgent;
window.GridWorld = GridWorld;
