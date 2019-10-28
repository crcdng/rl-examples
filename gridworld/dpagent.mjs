const action = {
  left: 0,
  up: 1,
  right: 2,
  down: 3
};

class DPAgent {
  constructor (env, gamma = 0.75) {
    this.env = env;
    this.gamma = gamma;
    this.reset();
  }

  act () {
    throw "Not implemented yet";
  }

  // evaluatePolicy :: ->
  evaluatePolicy () {
    const newValues = new Array(this.ns).fill(0);
    for (let s = 0; s < this.ns; s++) {
      let v = 0.0;
      for (const a of this.env.allowedActions(s)) {
        const prob = this.policies[a * this.ns + s];
        if (prob === 0) { continue; }
        const nextState = this.env.nextState(s, a);
        if (nextState == null) { continue; } // nextState returns undefined for walls
        const reward = this.env.reward(s); // the original code has more parameters which are ignored by the environment
        v += prob * (reward + this.gamma * this.values[nextState]);
      }
      newValues[s] = v;
    }
    this.values = newValues;
  }

  // learn :: ->
  learn () {
    this.evaluatePolicy();
    this.updatePolicy();
  }

  // reset :: ->
  reset () {
    this.ns = this.env.getNumStates();
    this.na = this.env.getMaxNumActions(action);
    this.values = new Array(this.ns).fill(0);
    this.policies = new Array(this.ns * this.na).fill(0);
    for (let s = 0; s < this.ns; s++) {
      const possibleActions = this.env.allowedActions(s);
      const n = possibleActions.length;
      for (let i = 0; i < n; i++) {
        this.policies[possibleActions[i] * this.ns + s] = 1.0 / n;
      }
    }
  }

  // updatePolicy :: ->
  updatePolicy () {
    for (let s = 0; s < this.ns; s++) {
      const possibleActions = this.env.allowedActions(s);
      let vmax, nmax; // initialized in line 71
      const vs = [];
      const n = possibleActions.length;
      for (let i = 0; i < n; i++) {
        const a = possibleActions[i];
        const nextState = this.env.nextState(s, a);
        const reward = this.env.reward(s); // the original code has more parameters which are ignored by the environment
        const v = reward + this.gamma * this.values[nextState];
        vs.push(v);
        if (i === 0 || v > vmax) { vmax = v; nmax = 1; } else if (v === vmax) { nmax += 1; }
      }
      for (let i = 0; i < n; i++) {
        const a = possibleActions[i];
        this.policies[a * this.ns + s] = (vs[i] === vmax) ? 1.0 / nmax : 0.0;
      }
    }
  }
}

export { action, DPAgent };
