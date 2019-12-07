const defaultConfig = {}

class DQNAgent {
  constructor(config = defaultConfig) {
    this.config = config;
    this.reset();
  }

  act() {}

  // learn :: ->
  learn() {}

  // reset :: ->
  reset() {}
}

export { DQNAgent };
