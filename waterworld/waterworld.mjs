import { action } from './dqnagent.mjs';

export default class WaterWorld {
  constructor (config) {
    this.config = config;
    this.reset();
  }

  // allowedActions :: State -> [Actions]
  allowedActions (s) {
  }

  // getMaxNumActions :: ActionObject -> Int
  getMaxNumActions (actions) { return Object.keys(actions).length; }

  // reset :: Object ->
  reset (config = this.config) {
  }

  // reward :: State -> Reward
  reward (s) { return this.rewards[s]; }

}
