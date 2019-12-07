import { action } from './dpagent.mjs';

export default class GridWorld {
  constructor (config) {
    this.config = config;
    this.reset();
  }

  // allowedActions :: State -> [Actions]
  allowedActions (s) {
    const x = this.sToX(s);
    const y = this.sToY(s);
    const as = [];
    if (x > 0) { as.push(action.left); }
    if (y > 0) { as.push(action.up); }
    if (x < this.cols - 1) { as.push(action.right); }
    if (y < this.rows - 1) { as.push(action.down); }
    return as;
  }

  // getMaxNumActions :: ActionObject -> Int
  getMaxNumActions (actions) { return Object.keys(actions).length; }

  // getNumStates :: -> Int
  getNumStates () { return this.gs; }

  // goalState :: -> State
  goalState () { return this.goal; }

  // nextState :: State -> Action -> State?
  nextState (s, a) {
    if (this.cells[s] === false) { return; } // wall: undefined
    let ns;
    if (s === this.goalState()) {
      ns = this.startState();
      while (this.cells[ns] === false) { ns = this.randomState(); }
    } else {
      let nx, ny;
      const x = this.sToX(s);
      const y = this.sToY(s);
      if (a === action.left) { nx = x - 1; ny = y; } else if (a === action.up) { nx = x; ny = y - 1; } else if (a === action.right) { nx = x + 1; ny = y; } else if (a === action.down) { nx = x; ny = y + 1; }
      ns = this.XYToS(nx, ny);
      if (this.cells[ns] === false) { ns = s; } // stay in the old state
    }
    return ns;
  }

  // randomState :: -> State
  randomState () { return Math.floor(Math.random() * this.gs); }

  // reset :: Object ->
  reset (config = this.config) {
    this.rows = config.rows;
    this.cols = config.cols;
    this.gs = this.rows * this.cols;
    this.start = config.start;
    this.goal = config.goal;
    this.rewardDiscount = config.rewardDiscount;
    this.rewards = new Array(this.gs).fill(0);
    this.cells = new Array(this.gs).fill(true);
    Object.entries(config).map(([key, value]) => {
      const index = parseInt(key, 10);
      const intValue = parseInt(value, 10);
      if (!isNaN(index) && !isNaN(intValue)) { this.rewards[index] = intValue; } else if (!isNaN(index) && typeof (value) === 'boolean') { this.cells[index] = value; }
    });
  }

  // reward :: State -> Reward
  reward (s) { return this.rewards[s]; }

  // sampleNextState :: State -> Action -> OutObject
  sampleNextState (s, a) {
    const ns = this.nextState(s, a);
    let reward = this.rewards[s];
    reward -= this.rewardDiscount; // TODO as in the original code where reward is var-scoped this only takes the discount off once per call, not cumulative
    const out = { ns: ns, r: reward, reset_episode: false };
    if (s === this.goalState() && ns === this.startState()) { out.reset_episode = true; }
    return out;
  }

  // startState :: -> State
  startState () { return this.start; }

  // sToX :: State -> Int
  sToX (s) { return s % this.cols; }

  // sToY :: State -> Int
  sToY (s) { return Math.floor(s / this.cols); }

  // XYToS :: Int -> Int -> State
  XYToS (x, y) { return y * this.cols + x; }
}
