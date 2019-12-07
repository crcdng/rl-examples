import { DQNAgent } from "./dqnagent.mjs";

class World {
  constructor(
    area = { w: 1000, h: 1000 },
    agent = new Agent(new DQNAgent()),
    items = [],
  ) {
    this.area = area;
    this.agent = agent;
    this.items = items;

    if (Array.isArray(this.items) && this.items.length === 0) {
      this.setupItems(50);
    }
  }

  // setupItems :: Int ->
  setupItems(n = 50) {
    for (let i = 0; i < n; i++) {
      let x = random(20, width - 20);
      let y = random(20, height - 20);
      let vx = random() * 5 - 2.5;
      let vy = random() * 5 - 2.5;
      let radius = 10;
      let type = random(["food", "poison"]);
      this.items.push(
        new Item(type, { x: x, y: y }, { x: vx, y: vy }, radius, this.area)
      );
    }
  }

  update() {
    // collision agent / item
    // update agent
    for (const item of this.items) {
      item.update();
    }
  }
}

class Item {
  constructor(type, pos, vel, radius, area) {
    this.pos = { x: pos.x, y: pos.y };
    this.vel = { x: vel.x, y: vel.y };
    this.type = type;
    this.radius = radius;
    this.area = area;
  }

  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    if (this.pos.x < 1) {
      this.pos.x = 1;
      this.vel.x *= -1;
    }
    if (this.pos.x > this.area.w - 1) {
      this.pos.x = this.area.w - 1;
      this.vel.x *= -1;
    }
    if (this.pos.y < 1) {
      this.pos.y = 1;
      this.vel.y *= -1;
    }
    if (this.pos.y > this.area.h - 1) {
      this.pos.y = this.area.h - 1;
      this.vel.y *= -1;
    }
  }
}

class Wall {
  constructor(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
  }
}

class Agent {
  constructor(brain) {
    // positional information
    this.p = { x: 300, y: 300 };
    this.v = { x: 0, y: 0 };
    this.op = this.p; // old position
    this.angle = 0; // direction facing

    this.actions = [0, 1, 2, 3];

    // properties
    this.rad = 10;
    this.eyes = [];
    for (let k = 0; k < 30; k++) {
      this.eyes.push(new Eye(k * 0.21));
    }

    this.brain = brain;

    this.reward_bonus = 0.0;
    this.digestion_signal = 0.0;

    this.apples = 0;
    this.poison = 0;

    // outputs on world
    this.action = 0;

    this.prevactionix = -1;
    this.num_states = this.eyes.length * 5 + 2;
  }
}

class Eye {
  constructor(angle) {
    this.angle = angle; // angle relative to agent its on
    this.max_range = 120;
    this.sensed_proximity = 120; // what the eye is seeing. will be set in world.tick()
    this.sensed_type = -1; // what does the eye see?
    this.vx = 0; // sensed velocity
    this.vy = 0;
  }
}

export { Agent, World };
