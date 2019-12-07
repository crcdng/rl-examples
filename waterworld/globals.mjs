import { DQNAgent }  from "./dqnagent.mjs";
import { Agent, World } from "./waterworld.mjs";

// hack, as p5.js does not support ES6 modules
// when it does, move the above imports into sketch.js and remove this file

window.Agent = Agent;
window.DQNAgent = DQNAgent;
window.WaterWorld = World;
