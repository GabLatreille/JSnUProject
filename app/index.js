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
  "human": 0
}
let human = {"count": 2, "cost": 20, "harvested": 0, "cp": false}
let energy = new Currency("energyCount", "J", 0, 1, 1);
let resource = new Currency("resourceCount", "N", 0, 1, 1);
let resourceCost = 10;
let timer = {"mins": 2, "secs": 0}

// NOTE: onload
// window.onload = () => {
//   console.log("loading game...")
//   try {
//     const loadedData = JSON.parse(localStorage.getItem("save"))
//     console.log("loading complete");
//     if (typeof loadedData.energy !== "undefined") {
//       energy.count = loadedData.energy;
//     }
//   } catch (e) {
//     console.error(e);
//   }
// }

// NOTE: COLLECT ENERGY
document.getElementById("collectEnergy").addEventListener(
  'click', () => {
    energy.increase();
    if (energy.count >= 10 && !energy.cp[0]) {
      enableElement("createBB");
      enableElement("createBBLabel");
      energy.cp[0] = true;
    }
  }
)

// NOTE: CREATE BIG BANG
document.getElementById("createBB").addEventListener(
  'click', () => {
    if (energy.decrease(20)) {
      disableElement("createBB");
      disableElement("createBBLabel");
      enableElement("expandUniverse");
      enableElement("expandUniverseCost");
      enableElement("universeSize");
    }
  }
);

// NOTE: EXPAND UNIVERSE
document.getElementById("expandUniverse").addEventListener(
  'click', () => {
    if (energy.decrease(20 + 10 * clickCounter.expandUniv)) {
      clickCounter.expandUniv++;
      universe.size = fibonacci(clickCounter.expandUniv, fib);
      document.getElementById("expandUniverseCost").innerHTML = `${20+10*clickCounter.expandUniv}J energy`;
      // IDEA: format number to be in format 123,456 or 123 456
      document.getElementById("universeSize").innerHTML = `${universe.size} km${"2".sup()}`;
      if (clickCounter.expandUniv == 15 && !universe.cp1) {
        enableElement("formAtmosphere");
        enableElement("atmosphereCost");
        universe.cp1 = !universe.cp1;
      } else if (clickCounter.expandUniv >= 25 && universe.cp1 && !universe.cp2 && atmosphereBool) {
        enableElement("landscaping");
        enableElement("landscapeCost");
        enableElement("waterPerc");
        universe.cp2 = !universe.cp2;
      } else if (clickCounter.expandUniv >= 45 && universe.cp1 && universe.cp2 && !universe.cp3 && atmosphereBool) {
        enableElement("addResource");
        enableElement("resourceCount");
        enableElement("resourceCost");
        universe.cp3 = !universe.cp3;
        resource.cp[0] = true;
      } else if (clickCounter.expandUniv == 60 && universe.cp1 && universe.cp2 && universe.cp3 && !universe.cp4 && atmosphereBool) {
        enableElement("createHuman");
        enableElement("humanCost");
        universe.cp4 = !universe.cp4;
      }

      if (clickCounter.expandUniv == 60) {
        document.getElementById("expandUniverse").disabled = true;
        document.getElementById("expandUniverseCost").innerHTML = "MAX SIZE";
      }
    }
  }
);

// https://medium.com/developers-writing/fibonacci-sequence-algorithm-in-javascript-b253dc7e320e
function fibonacci(num, memo) {
  memo = memo || {};
  if (memo[num]) return memo[num];
  if (num <= 1) return 1;
  return memo[num] = fibonacci(num - 1, memo) + fibonacci(num - 2, memo);
}


// NOTE: FORM ATMOSPHERE
document.getElementById("formAtmosphere").addEventListener(
  // TODO: if flood is clicked, check to see if any onther buttons should be activated
  'click', () => {
    if (energy.decrease(200)) {
      if (clickCounter.expandUniv == 60) {
        enableElement("createHuman");
        enableElement("humanCost");
      }
      if (clickCounter.expandUniv >= 45) {
        enableElement("addResource");
        enableElement("resourceCost");
        enableElement("resourceCount");
        resource.cp[0] = true;
      }
      if (clickCounter.expandUniv >= 25) {
        enableElement("landscaping");
        enableElement("landscapeCost");
        enableElement("waterPerc");
      }
      atmosphereBool = true;
      document.getElementById('memo').innerHTML += `</br>Atmosphere Created`;
      document.getElementById('formAtmosphere').disabled = true;
      disableElement('atmosphereCost');
    }
  }
);

// NOTE: LANSCAPE
document.getElementById("landscaping").addEventListener(
  'click', () => {
    if (clickCounter.lanscape < 71) {
      if (energy.decrease(10 * (clickCounter.lanscape + 1))) {
        clickCounter.lanscape++;
        document.getElementById('landscapeCost').innerHTML = `${10*(clickCounter.lanscape+1)}J energy`;
        document.getElementById('waterPerc').innerHTML = `${clickCounter.lanscape}%`;
        if (clickCounter.lanscape == 71) {
          disableElement('landscapeCost');
          document.getElementById('landscaping').disabled = true;
        }
      }
    }
  }
);

// NOTE: RESOURCES
document.getElementById("addResource").addEventListener(
  'click', () => {
    if (energy.decrease(resourceCost)) {
      clickCounter.resource++;
      resource.increment++;
      resourceCost *= 2;
      document.getElementById('resourceCost').innerHTML = `${resourceCost}J energy`
    }
  }
)

// NOTE: HUMANS
document.getElementById("createHuman").addEventListener(
  'click', () => {
    if (resource.decrease(human.cost * clickCounter.human)) {
      clickCounter.human++;
      if (clickCounter.human == 1) {
        document.getElementById('memo').innerHTML += "</br>THE FIRST HUMANS HAVE ARRIVED FROM ANOTHER PLANET AND THEIR SHIP CRASHES AND THEY ARE LEFT WITH NOTHING BUT THEMSLEVES"
        enableElement('humanCount');
        enableElement('harvest');
        enableElement('harvested');
        // you can only harvest as many resources as you have humans
      } else {
        human.count = Math.ceil(human.count**1.5);
      }
      document.getElementById('humanCost').innerHTML = `${human.cost * clickCounter.human}`
      document.getElementById('humanCount').innerHTML = human.count;
      if(human.count>=10000000 && !human.cp){
        human.cp = true;
        document.getElementById('healthBar').style.visibility = 'visible'
        enableElement('advTech');
        enableElement('techCost');
      }
    }
  }
);

// NOTE: HARVEST
document.getElementById('harvest').addEventListener(
  'click', ()=> {
    if(resource.count-human.count>=0){
      human.harvested += human.count;
      resource.count -= human.count;
    } else {
      human.harvested += resource.count;
      resource.count = 0;
    }
    document.getElementById('harvested').innerHTML = human.harvested;
    document.getElementById('resourceCount').innerHTML = resource.count;
  }
)

// NOTE: TECHNOLOGY
document.getElementById('advTech').addEventListener(
  'click', ()=> {

  }
)
// fire, wheel, nails, compass, paper, gunpowder, electricity,
// steam engine, combustion engine, telephone, car, airplane,
// rockets, nuclear fission, computers, the internet,
// the first space exploration to space is launched
// it finds a habitable planet

// NOTE: CHEAT
document.getElementById("cheat").addEventListener(
  'click', () => {
    energy.count += 1000000;
    energy.increase();
    energy.cp[0] = true;
    enableElement("expandUniverse");
    enableElement("expandUniverseCost");
    enableElement("universeSize");
    clickCounter.expandUniverse = 60;
    universe.size = fibonacci(clickCounter.expandUniv, fib);
    document.getElementById("universeSize").innerHTML = `${universe.size} km${"2".sup()}`;
    enableElement("formAtmosphere");
    universe.cp1 = !universe.cp1;
    enableElement("landscaping");
    enableElement("landscapeCost");
    enableElement("waterPerc");
    universe.cp2 = !universe.cp2;
    enableElement("addResource");
    enableElement("resourceCount");
    enableElement("resourceCost");
    universe.cp3 = !universe.cp3;
    resource.cp[0] = true;
    enableElement("createHuman");
    enableElement("humanCost");
    universe.cp4 = !universe.cp4;
    document.getElementById("expandUniverse").disabled = true;
    document.getElementById("expandUniverseCost").innerHTML = "MAX SIZE";
    atmosphereBool = true;
    document.getElementById('memo').innerHTML += `</br>Atmosphere Created`;
    document.getElementById('formAtmosphere').disabled = true;
  }
);

// NOTE: SAVE
// document.getElementById("save").addEventListener (
//   'click', () => {
//     saveGame();
//   }
// );
//
// function saveGame(){
//   console.log()
//   let save = {
//     energy: energy.count
//   }
//   try {
//     localStorage.setItem("save", JSON.stringify(save));
//     console.log("saved")
//   } catch (e) {
//
//   }
// }

// NOTE: ENABLE AND DISABLE
function enableElement(elementID) {
  document.getElementById(elementID).style.display = "inline";
}

function disableElement(elementID) {
  document.getElementById(elementID).style.display = "none";
}

// NOTE: 1 second interval
setInterval(() => {
  energy.increase();
  if (resource.cp[0]) {
    resource.increase();
  }
  if(clickCounter.human>1){
    // chance it on whether there are more deaths or births
    if(human.count<=5 || Math.floor(Math.random()*4)>=1){
      human.count++;
    } else {
      human.count--;
    }
    document.getElementById('humanCount').innerHTML = human.count;
  }
  if(human.cp){
    document.getElementById('healthBar').style.width = `${parseInt(document.getElementById('healthBar').style.width)-1}pt`
    if(document.getElementById('healthBar').style.width=="0pt"){
      console.log("finished");
    }
  }
}, 1000);
