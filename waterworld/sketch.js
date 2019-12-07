let agent, env;
let epsilonSld, intervalId, loadBtn, reinitBtn, speedSel;

function setup () {
  setupUI();
  const environmentConfig = {

  };
  env = new WaterWorld(environmentConfig);
  agent = new DQNAgent(env, 0.9);
}

function draw () {
  background(243);
}

function load () {
  console.log("load");
}

function reinit () {
  console.log("reinit");
}

function selectSpeed () {
  const item = speedSel.value();
  console.log(item);
  switch(item) {
  case "very fast":
    break;
  case "fast":
    break;
  case "normal":
    break;
  case "slow":
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
