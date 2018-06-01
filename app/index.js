class Currency {
  constructor(id, unit, count, cp, increment) {
    this.id = id; //is based on html id
    this.unit = unit
    this.count = count;
    this.cp = [];
    for (let i = 0; i < cp; i++) {
      this.cp[i] = false;
    }
    this.increment = increment;
  }

  increase() {
    this.count += this.increment;
    document.getElementById(this.id).innerHTML = `${this.count}${this.unit}`
  }

  decrease(num) {
    if (this.count - num >= 0) {
      this.count -= num;
      document.getElementById(this.id).innerHTML = `${this.count}${this.unit}`
      return true;
    }
    return false;
  }
}

let universe = {
  "size": 0,
  "cp1": false,
  "cp2": false,
  "cp3": false,
  "cp4": false
};
let atmosphereBool = false;
let fib = []
let clickCounter = {
  "expandUniv": 0,
  "lanscape": 0,
  "resource": 0,
  "human": 0,
  "advTech": 0
}
let human = {
  "count": 2,
  "cost": 20,
  "harvested": 0,
  "cp": false
}
let energy = new Currency("energyCount", "J", 0, 1, 1);
let resource = new Currency("resourceCount", "R", 0, 1, 1);
let resourceCost = 10;
let memos = ['Welcome', '', '', '', '', '', '', '', '', '']
let technology = ['the wheel', 'the nail', 'the compass', 'paper', 'gunpowder', 'electricity', 'the steam engine', 'the combustion engine', 'the telephone', 'the car', 'rockets', 'nuclear fission', 'the computer', 'the internet']
let bbCp = false

// NOTE: onload
window.onload = () => {
  console.log("loading...");
  try {
    const loadedData = JSON.parse(localStorage.getItem("save"))
    console.log("loading complete");
    if (typeof loadedData.energyCount !== "undefined") {
      energy.count = loadedData.energyCount;
    }
    if (typeof loadedData.energyCp !== "undefined") {
      energy.cp = loadedData.energyCp;
      if (energy.cp[0]) {
        enableElement("createBB");
        enableElement("createBBLabel");
      }
    }
    if (typeof loadedData.resourceCount !== "undefined") {
      resource.count = loadedData.resourceCount
    }
    if (typeof loadedData.resourceCp !== "undefined") {
      resource.cp = loadedData.resourceCp
    }
    if (typeof loadedData.universeSize !== "undefined") {
      universe.size = loadedData.universeSize
    }
    if (typeof loadedData.bbCp !== "undefined") {
      bbCp = loadedData.bbCp
      if (bbCp) {
        createBB();
      }
    }
    if (typeof loadedData.atmosphereBool !== "undefined") {
      atmosphereBool = loadedData.atmosphereBool
    }
    if (typeof loadedData.clickCounter !== "undefined") {
      clickCounter = loadedData.clickCounter
      expandUniverse();
      if (atmosphereBool) formAtmosphere();
      landscape();
      document.getElementById('techCost').innerHTML = `${30+clickCounter.advTech*10}H`
    }
    if (typeof loadedData.resourceCost !== "undefined") {
      resourceCost = loadedData.resourceCost
      document.getElementById('resourceCost').innerHTML = `${resourceCost}J`
    }
    if (typeof loadedData.human !== "undefined") {
      human = loadedData.human
      if(clickCounter.human >= 1){
        enableElement('phumanCount');
        enableElement('harvest');
        enableElement('pharvested');
      }
      createHuman()
      if(human.cp) tenMillionHumans();
      document.getElementById('harvested').innerHTML = `${human.harvested}H`;
    }
    if (typeof loadedData.healthBar !== "undefined") {
      document.getElementById('healthBar').style.width = `${loadedData.healthBar}pt`
    }
  } catch (e) {
    console.error(e);
  }
}

// NOTE: COLLECT ENERGY
document.getElementById("collectEnergy").addEventListener(
  'click', () => {
    collectEnergy();
  }
)

function collectEnergy() {
  energy.increase();
  if (energy.count >= 10 && !energy.cp[0]) {
    enableElement("createBB");
    enableElement("createBBLabel");
    energy.cp[0] = true;
  }
}

// NOTE: CREATE BIG BANG
document.getElementById("createBB").addEventListener(
  'click', () => {
    if (energy.decrease(200)) {
      createBB()
      bbCp = true
      memo('Big bang created')
    }
  }
);

function createBB() {
  disableElement("createBB");
  disableElement("createBBLabel");
  enableElement("expandUniverse");
  enableElement("expandUniverseCost");
  enableElement("puniverseSize");
}

// NOTE: EXPAND UNIVERSE
document.getElementById("expandUniverse").addEventListener(
  'click', () => {
    if (energy.decrease(20 + 10 * clickCounter.expandUniv)) {
      clickCounter.expandUniv++;
      universe.size = fibonacci(clickCounter.expandUniv, fib);
      memo('The universe is ' + universe.size + ' billion light years large')
      expandUniverse();
    }
  }
);

function expandUniverse() {
  document.getElementById("expandUniverseCost").innerHTML = `${20+10*clickCounter.expandUniv}J`;
  document.getElementById("universeSize").innerHTML = `${universe.size} billion light years`;
  if (clickCounter.expandUniv >= 15 && !universe.cp1) {
    enableElement("formAtmosphere");
    enableElement("atmosphereCost");
    universe.cp1 = !universe.cp1;
  }
  if (clickCounter.expandUniv >= 25 && universe.cp1 && !universe.cp2 && atmosphereBool) {
    enableElement("landscaping");
    enableElement("landscapeCost");
    enableElement("pwaterPerc");
    universe.cp2 = !universe.cp2;
  }
  if (clickCounter.expandUniv >= 45 && universe.cp1 && universe.cp2 && !universe.cp3 && atmosphereBool) {
    enableElement("addResource");
    enableElement("presourceCount");
    enableElement("resourceCost");
    universe.cp3 = !universe.cp3;
    resource.cp[0] = true;
  }
  if (clickCounter.expandUniv == 60 && universe.cp1 && universe.cp2 && universe.cp3 && !universe.cp4 && atmosphereBool) {
    enableElement("createHuman");
    enableElement("humanCost");
    universe.cp4 = !universe.cp4;
  }

  if (clickCounter.expandUniv == 60) {
    memo("Let's put a pause on the universe expansion")
    document.getElementById("expandUniverse").disabled = true;
    document.getElementById("expandUniverseCost").innerHTML = "MAX SIZE";
  }
}

// https://medium.com/developers-writing/fibonacci-sequence-algorithm-in-javascript-b253dc7e320e
function fibonacci(num, fibon) {
  fibon = fibon || {};
  if (fibon[num]) return fibon[num];
  if (num <= 1) return 1;
  return fibon[num] = fibonacci(num - 1, fibon) + fibonacci(num - 2, fibon);
}


// NOTE: FORM ATMOSPHERE
document.getElementById("formAtmosphere").addEventListener(
  'click', () => {
    if (energy.decrease(200)) {
      formAtmosphere();
      memo("The atmosphere was created on a planet");
    }
  }
);

function formAtmosphere() {
  if (clickCounter.expandUniv == 60) {
    enableElement("createHuman");
    enableElement("humanCost");
    universe.cp4 = !universe.cp4;
  }
  if (clickCounter.expandUniv >= 45) {
    enableElement("addResource");
    enableElement("resourceCost");
    enableElement("presourceCount");
    resource.cp[0] = true;
  }
  if (clickCounter.expandUniv >= 25) {
    enableElement("landscaping");
    enableElement("landscapeCost");
    enableElement("pwaterPerc");
    universe.cp2 = !universe.cp2;
  }
  atmosphereBool = true;
  document.getElementById('formAtmosphere').disabled = true;
  disableElement('atmosphereCost');
}

// NOTE: LANSCAPE
document.getElementById("landscaping").addEventListener(
  'click', () => {
    if (clickCounter.lanscape < 71) {
      if (energy.decrease(10 * (clickCounter.lanscape + 1))) {
        clickCounter.lanscape++;
        landscape();
        memo('The planet is ' + clickCounter.lanscape + '% covered in water')
      }
    }
  }
);

function landscape() {
  document.getElementById('landscapeCost').innerHTML = `${10*(clickCounter.lanscape+1)}J`;
  document.getElementById('waterPerc').innerHTML = `${clickCounter.lanscape}%`;
  if (clickCounter.lanscape == 71) {
    disableElement('landscapeCost');
    document.getElementById('landscaping').disabled = true;
    memo("Wow there mate. Let's not drown the planet")
  }

}

// NOTE: RESOURCES
document.getElementById("addResource").addEventListener(
  'click', () => {
    addResource();
  }
)

function addResource() {
  if (energy.decrease(resourceCost)) {
    clickCounter.resource++;
    resource.increment++;
    resourceCost *= 2;
    document.getElementById('resourceCost').innerHTML = `${resourceCost}J`
  }
}

// NOTE: HUMANS
document.getElementById("createHuman").addEventListener(
  'click', () => {
    if (resource.decrease(human.cost * clickCounter.human)) {
      clickCounter.human++;
      if (clickCounter.human == 1) {
        memo('THE FIRST HUMANS HAVE ARRIVED FROM ANOTHER PLANET AND THEIR SHIP CRASHES AND THEY ARE LEFT WITH NOTHING BUT THEMSLEVES')
        enableElement('phumanCount');
        enableElement('harvest');
        enableElement('pharvested');
        // you can only harvest as many resources as you have humans
      } else {
        human.count = Math.ceil(human.count ** 1.5);
      }
      createHuman();
    }
  }
);

function createHuman() {
  document.getElementById('humanCost').innerHTML = `${human.cost * clickCounter.human}R`
  document.getElementById('humanCount').innerHTML = human.count;
  if (human.count >= 10000000 && !human.cp) {
    memo('Humans have taken over the planet and it has started dying. Get them out before the planet dies. Be quick')
    tenMillionHumans();
    human.cp = true;
  }
}

function tenMillionHumans() {
  document.getElementById('healthBar').style.visibility = 'visible'
  enableElement('advTech');
  enableElement('techCost');
}

// NOTE: HARVEST resrouces
document.getElementById('harvest').addEventListener(
  'click', () => {
    harvest();
  }
)

function harvest() {
  // you can only harvest as many resources as you have humans
  if (resource.count - human.count >= 0) {
    human.harvested += human.count;
    resource.count -= human.count;
  } else {
    human.harvested += resource.count;
    resource.count = 0;
  }
  memo('The humans have harvested resources')
  document.getElementById('harvested').innerHTML = `${human.harvested}H`;
  document.getElementById('resourceCount').innerHTML = resource.count;
}

// NOTE: TECHNOLOGY advancements
document.getElementById('advTech').addEventListener(
  'click', () => {
    advTech();
  }
)

function advTech() {
  if (human.harvested - (30 + clickCounter.advTech * 10) >= 0) {
    human.harvested -= (30 + clickCounter.advTech * 10)
    if (clickCounter.advTech < 14) {
      memo('You have created ' + technology[clickCounter.advTech])
    } else if (clickCounter.advTech == 14) {
      memo('The first space exploration has been launched: Rover 1')
    } else if (clickCounter.advTech == 15) {
      memo('Rover 1 has found a habitable planet')
    } else if (clickCounter.advTech == 16) {
      memo('You have built the first passenger space ship')
    } else {
      win(true)
    }
    clickCounter.advTech++;
    document.getElementById('techCost').innerHTML = `${30+clickCounter.advTech*10}H`
    document.getElementById('harvested').innerHTML = `${human.harvested}H`
  }
}

// NOTE: CHEAT codes
document.getElementById("cheat").addEventListener(
  'click', () => {
    let cheatCode = prompt('Enter a cheat code');
    console.log(cheatCode);
    if(cheatCode == 'E'){
      energy.count += 1000000;
      document.getElementById('energyCount').innerHTML = `${energy.count}J`
    } else if (cheatCode=='R' && resource.cp[0]){
      resource.count += 1000000;
      document.getElementById('resourceCount').innerHTML = `${resource.count}R`
    }
  }
)

// NOTE: SAVE THE GAME
document.getElementById("save").addEventListener(
  'click', () => {
    saveGame();
  }
);

function saveGame() {
  console.log("attempting to save")
  let save = {
    energyCount: energy.count,
    energyCp: energy.cp,
    resourceCount: resource.count,
    resourceCp: resource.cp,
    universeSize: universe.size,
    bbCp: bbCp,
    clickCounter: clickCounter,
    atmosphereBool: atmosphereBool,
    resourceCost: resourceCost,
    human: human,
    healthBar: parseInt(document.getElementById('healthBar').style.width)
  }
  try {
    localStorage.setItem("save", JSON.stringify(save));
    console.log("saved")
  } catch (e) {
    console.error(e);
  }
}


// NOTE: ENABLE AND DISABLE elements
function enableElement(elementID) {
  document.getElementById(elementID).style.display = "inline";
}

function disableElement(elementID) {
  document.getElementById(elementID).style.display = "none";
}

// NOTE: WIN OR LOSE message
function win(status) {
  disableElement('all')
  document.getElementById('memo').innerHTML = status ? 'You can now succesfully move to the new planet<br>YOU WIN!!!' : 'you lose...'
  document.getElementById('finish').innerHTML = status ? 'YEAH' : 'try again?'
  enableElement('finish')
}

// NOTE: RESET everything to 0
document.getElementById("reset").addEventListener(
  'click', () => {
    reset();
  }
);

document.getElementById("finish").addEventListener(
  'click', () => {
    reset();
  }
);

function reset() {
  let save = {}
  localStorage.setItem("save", JSON.stringify(save));
  location.reload();
}

// NOTE: BOTTOM MEMOS
function memo(message) {
  for (let i = 9; i > 0; i--) {
    memos[i] = memos[i - 1]
  }
  memos[0] = message
  let str = ''
  for (let i = 0; i < 10; i++) {
    str += `<br>${memos[i]}`
  }
  document.getElementById('memo').innerHTML = str
}

// NOTE: 1 second interval that increments all things
setInterval(() => {
  energy.increase();
  if (resource.cp[0]) {
    resource.increase();
  }
  if (clickCounter.human > 1) {
    // chance it on whether there are more deaths or births
    if (human.count <= 5 || Math.floor(Math.random() * 4) >= 1) {
      human.count++;
    } else {
      human.count--;
    }
    document.getElementById('humanCount').innerHTML = human.count;
  }
  if (human.cp) {
    document.getElementById('healthBar').style.width = `${parseInt(document.getElementById('healthBar').style.width)-1}pt`
    if (document.getElementById('healthBar').style.width == "0pt") {
      win(false);
    }
  }
}, 1000);
