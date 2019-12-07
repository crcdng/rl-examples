let dqnAgentConfig, world;
let epsilonSld, intervalId, loadBtn, reinitBtn, speedSel;

function setup () {
  setupUI();

  dqnAgentConfig = {
    update: "qlearn", // qlearn | sarsa
    gamma: 0.9, // discount factor, [0, 1)
    epsilon: 0.2, // initial epsilon for epsilon-greedy policy, [0, 1)
    alpha: 0.005, // value function learning rate
    experience_add_every: 5, // number of time steps before we add another experience to replay memory
    experience_size: 10000, // size of experience
    learning_steps_per_iteration: 5,
    tderror_clamp: 1.0, // for robustness
    num_hidden_units: 100 // number of neurons in hidden layer
  };

  world = new WaterWorld({w: width, h: height}, new Agent(new DQNAgent(dqnAgentConfig)));
  console.log(world);
}

function draw () {
  background(243);
  world.update();
  for (const item of world.items) {
    fill(item.type === "food" ? "green" : "red");
    circle(item.pos.x, item.pos.y, item.radius);
  }
}

function load () {
  console.log("load: not implemented yet"); // TODO
}

function reinit () { // implants a fresh brain
  console.log("reinit");
  world.agent.brain = new DQNAgent(dqnAgentConfig);
}

function selectSpeed () {
  const item = speedSel.value();
  console.log(item);
  switch(item) {
  case "very fast":
    console.log("very fast: not implemented yet"); // TODO
    break;
  case "fast":
    console.log("fast: not implemented yet"); // TODO
    break;
  case "normal":
    frameRate(60);
    break;
  case "slow":
    frameRate(15);
    break;
  default:
    break;
  }

  // if () {
  //  intervalId = setInterval(() => { evaluate(); update(); }, 100);
  // } else { clearInterval(intervalId); }
}

function setEpsilon () {
  const value = epsilonSld.value();
  console.log(value);
  world.agent.brain.epsilon = value;
}

function setupUI () {
  const container = createDiv().class("container");
  const row1 = createDiv().class("row").parent(container);
  const col1 = createDiv().class("col s12").parent(row1);
  createElement("h5", "WaterWorld: DQN Demo").parent(col1);

  const row2 = createDiv().class("row").parent(container);
  const col21 = createDiv().class("col s3").parent(row2);
  reinitBtn = createButton("Reinit Agent").parent(col21).class("btn");
  reinitBtn.mousePressed(reinit);
  const col22 = createDiv().class("col s4").parent(row2);
  speedSel = createSelect().parent(col22);
  speedSel.option('Choose your option');
  speedSel.option('very fast');
  speedSel.option('fast');
  speedSel.option('normal');
  speedSel.option('slow');
  speedSel.changed(selectSpeed)
  const elems = document.querySelectorAll('select');
  const instances = M.FormSelect.init(elems);

  const row3 = createDiv().class("row").parent(container);
  const col3 = createDiv().class("col s12").parent(row3);
  createCanvas(600, 480).parent(col3);

  const row4 = createDiv().class("row").parent(container);
  const col41 = createDiv().class("col s6").parent(row4);
  loadBtn = createButton("Load a Pretrained Agent").parent(col41).class("waves-effect waves-light btn lighten-1");
  loadBtn.mousePressed(load);

  const row5 = createDiv().class("row").parent(container);
  const col51 = createDiv().class("col s2").parent(row5);
  createSpan("Exploration epsilon: ").parent(col51).id("epsilontext");
  const col52 = createDiv().class("col s10").parent(row5);
  epsilonSld = createSlider(0, 1, 0.05, 0.01).parent(col52).size(200);
  epsilonSld.elt.oninput = setEpsilon;
}

function update () {
}
