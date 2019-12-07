let agent, env;
let evalBtn, intervalId, resetBtn, rewardSld, valueIterationSwi, selectedCell, updateBtn;

function setup () {
  setupUI();
  const environmentConfig = {
    rows: 10,
    cols: 10,
    start: 0,
    goal: 55,
    rewardDiscount: 0.01,
    21: false,
    22: false,
    23: false,
    24: false,
    26: false,
    27: false,
    28: false,
    33: -1,
    34: false,
    44: false,
    45: -1,
    46: -1,
    54: false,
    55: 1,
    56: -1,
    58: -1,
    64: false,
    68: -1,
    73: -1,
    74: false,
    75: -1,
    76: -1
  };
  env = new GridWorld(environmentConfig);
  agent = new DPAgent(env, 0.9);
}

function draw () {
  background(243);
  drawGrid();
}

function drawGrid () {
  for (let row = 0; row < env.rows; row++) {
    for (let col = 0; col < env.cols; col++) {
      drawCell(row, col);
    }
  }
}

function drawCell (row, col) {
  const cs = Math.min(height / env.rows, width / env.cols);
  const index = env.XYToS(col, row);
  const isWall = (env.cells[index] === false);
  if (isWall) { fill(51); }
  else if (index === env.goalState()) { fill(23, 254, 12); }
  else if (index === env.startState()) { fill(23, 254, 254); }
  else {
    const tint = agent.values[index] * 100;
    if (tint > 0) { fill(255 - tint, 255, 255 - tint); }
    else if (tint < 0) { fill(255, 255 + tint, 255 + tint); }
    else { noFill(); }
  }
  if (index === selectedCell) { strokeWeight(5); } else { strokeWeight(1); }
  push();
  translate(col * cs, row * cs);
  square(0, 0, cs);
  if (isWall) { pop(); return; }
  const actions = env.allowedActions(index);
  angleMode(DEGREES);
  for (const a of actions) {
    const probability = agent.policies[a * env.gs + index];
    if (probability > 0) { drawArrow(a, cs); }
  }
  const reward = env.rewards[index];
  fill(0);
  textSize(cs / 3.8);
  text(nf(agent.values[index], 1, 1), cs / 10, 3 * cs / 10);
  textSize(cs / 5);
  if (reward !== 0) { text("R: " + reward, cs / 10, 9 * cs / 10); }
  pop();
}

function drawArrow (a, cs) {
  let rot;
  if (a === action.left) { rot = 180; } else if (a === action.up) { rot = 270; } else if (a === action.right) { rot = 0; } else if (a === action.down) { rot = 90; }
  push();
  translate(cs / 2, cs / 2);
  rotate(rot); // clockwise
  translate(cs / 10, 0);
  noFill();
  strokeWeight(cs / 26);
  strokeJoin(MITER);
  beginShape();
  vertex(0, -cs / 15);
  vertex(cs / 15, 0);
  vertex(0, cs / 15);
  endShape();
  pop();
}

function evaluate () {
  agent.evaluatePolicy();
}

function mouseClicked () {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) { return true; }
  const cs = Math.min(height / env.rows, width / env.cols);
  const col = Math.floor(mouseX / cs);
  const row = Math.floor(mouseY / cs);
  const index = env.XYToS (col, row);
  selectedCell = selectCell(index, selectedCell);
  let text;
  if (selectedCell != null) {
    text = `Cell Reward: ${nf(agent.values[index], 1, 1)} `;
  } else {
    text = "Cell Reward: (select a cell) ";
  }
  select("#rewardtext").html(text);
}

function reset () {
  env.reset();
  agent.reset();
}

function selectCell (index, current) {
  return selected = (current === index) ? null : index;
}

function setCellReward () {
  if (selectedCell == null) { return; }
  const value = rewardSld.value();
  const text = `Cell Reward: ${nf(value, 1, 1)} `;
  select("#rewardtext").html(text);
  agent.values[selectedCell] = value;
}

function setupUI () {
  const container = createDiv().class("container");
  const row1 = createDiv().class("row").parent(container);
  const col1 = createDiv().class("col s12").parent(row1);
  createElement("h5", "GridWorld: Dynamic Programming Demo").parent(col1);

  const row2 = createDiv().class("row").parent(container);
  const col21 = createDiv().class("col s7").parent(row2);
  evalBtn = createButton("Policy Evaluation (1 sweep)").parent(col21).class("btn");
  evalBtn.mousePressed(evaluate);
  createSpan("&nbsp;").parent(col21);
  updateBtn = createButton("Policy Update").parent(col21).class("btn orange darken-1");
  updateBtn.mousePressed(update);
  const col22 = createDiv().class("col s3").parent(row2);
  createDiv("Value Iteration").parent(col22);
  valueIterationSwi = createSpan("<label>Off<input id='valueiteration' type='checkbox'><span class='lever'></span>On</label>").class("switch").parent(col22);
  valueIterationSwi.changed(toggleValueIteration);
  const col23 = createDiv().class("col s2").parent(row2);
  resetBtn = createButton("Reset").parent(col23).class("waves-effect waves-light btn red lighten-1");
  resetBtn.mousePressed(reset);

  const row3 = createDiv().class("row").parent(container);
  const col3 = createDiv().class("col s12").parent(row3);
  createCanvas(600, 600).parent(col3);

  const row4 = createDiv().class("row").parent(container);
  const col41 = createDiv().class("col s4").parent(row4);
  createSpan("Cell Reward: (select a cell) ").parent(col41).id("rewardtext");
  const col42 = createDiv().class("col s3").parent(row4);
  rewardSld = createSlider(-5, 5, 0, 0.1).parent(col42).size(200);
  rewardSld.elt.oninput = setCellReward;
}

function toggleValueIteration () {
  const element = select("#valueiteration");
  if (element && element.elt && element.elt.checked === true) {
    intervalId = setInterval(() => { evaluate(); update(); }, 100);
  } else { clearInterval(intervalId); }
}

function update () {
  agent.updatePolicy();
}
