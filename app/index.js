// NOTE: cp means checkpoint
let energy = {"count": 0, "cp": 10, "cpBool": false, "interval": 1000};
let universe = {"size": 0, "cp1":false, "cp2": false, "cp3": false, "cp4": false};
let atmosphereBool = false;
let resource = {"count": 0, "increment": 1, "createBool": false, "price": 100};
let fib = []
let clickCounter = {"expandUniv": 0, "lanscape": 0, "resource": 0, "human": 0}
const humanCost = 20;

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
document.getElementById("collectEnergy").addEventListener (
  'click', () => {
      increaseEnergy();
  }
);

function increaseEnergy() {
  energy.count++;
  document.getElementById('energyCount').innerHTML = energy.count;
  if(energy.count >= energy.cp && !energy.cpBool){
    enableElement("createBB");
    enableElement("createBBLabel");
    energy.cpBool = !energy.cpBool;
  }
}

function decreaseEnergy(num) {
  if(energy.count - num >= 0){
    energy.count -= num;
    document.getElementById('energyCount').innerHTML = energy.count;
    return true;
  }
  return false;
}

// NOTE: CREATE BIG BANG
document.getElementById("createBB").addEventListener (
  'click', () => {
    if(decreaseEnergy(20)){
      disableElement("createBB");
      disableElement("createBBLabel");
      enableElement("expandUniverse");
      enableElement("expandUniverseCost");
      enableElement("universeSize");
    }
  }
);

// NOTE: EXPAND UNIVERSE
document.getElementById("expandUniverse").addEventListener (
  'click', () => {
    if(decreaseEnergy(20+10*clickCounter.expandUniv)){
      clickCounter.expandUniv++;
      universe.size = fibonacci(clickCounter.expandUniv, fib);
      document.getElementById("expandUniverseCost").innerHTML = `${20+10*clickCounter.expandUniv}g energy`;
      // TODO: format number to be in format 123,456 or 123 456
      document.getElementById("universeSize").innerHTML = `${universe.size} km${"2".sup()}`;
      if(clickCounter.expandUniv == 15 && !universe.cp1){
        enableElement("formAtmosphere");
        enableElement("atmosphereCost");
        universe.cp1 = !universe.cp1;
      } else if(clickCounter.expandUniv >= 25 && universe.cp1 && !universe.cp2 && atmosphereBool){
        enableElement("landscaping");
        enableElement("landscapeCost");
        enableElement("waterPerc");
        universe.cp2 = !universe.cp2;
      } else if(clickCounter.expandUniv >= 45 && universe.cp1 && universe.cp2 && !universe.cp3 && atmosphereBool){
        enableElement("addResource");
        enableElement("resourceCount");
        enableElement("resourceCost");
        universe.cp3 = !universe.cp3;
        resource.createBool = true;
      } else if (clickCounter.expandUniv == 60 && universe.cp1 && universe.cp2 && universe.cp3 && !universe.cp4 && atmosphereBool) {
        enableElement("createHuman");
        enableElement("humanCost");
        universe.cp4 = !universe.cp4;
      }

      if(clickCounter.expandUniv == 60){
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
document.getElementById("formAtmosphere").addEventListener (
  // TODO: if flood is clicked, check to see if any onther buttons should be activated
  'click', () => {
    if(decreaseEnergy(200)){
      if(clickCounter.expandUniv == 60){
        enableElement("createHuman");
        enableElement("humanCost");
      } if(clickCounter.expandUniv >= 45){
        enableElement("addResource");
        enableElement("resourceCost");
        enableElement("resourceCount");
        resource.createBool = true;
      } if(clickCounter.expandUniv >= 25){
        enableElement("landscaping");
        enableElement("landscapeCost");
        enableElement("waterPerc");
      }
      atmosphereBool = true;
      document.getElementById('memo').innerHTML = "Atmosphere Created";
      document.getElementById('formAtmosphere').disabled = true;
      disableElement('atmosphereCost');
    }
  }
);


// NOTE: LANSCAPE
document.getElementById("landscaping").addEventListener (
  'click', () => {
    if(clickCounter.lanscape < 71){
      if(decreaseEnergy(10*(clickCounter.lanscape+1))) {
        clickCounter.lanscape++;
        document.getElementById('landscapeCost').innerHTML = `${10*(clickCounter.lanscape+1)}g energy`;
        document.getElementById('waterPerc').innerHTML = `${clickCounter.lanscape}%`;
        if(clickCounter.lanscape == 71){
          disableElement('landscapeCost');
          document.getElementById('landscaping').disabled = true;
        }
      }
    }
  }
);

// NOTE: RESOURCES
document.getElementById("addResource").addEventListener (
  'click', () => {
    if(decreaseEnergy(resource.price)){
      clickCounter.resource++;
      resource.increment++;
      resource.price*=2;
      document.getElementById('resourceCost').innerHTML = `${resource.price}J energy`
    }
  }
)

// NOTE: HUMANS
document.getElementById("createHuman").addEventListener (
  'click', () => {
    if(decreaseEnergy(humanCost*clickCounter.human)){
      clickCounter.human++;
      if(clickCounter.human == 1){
        document.getElementById('memo').innerHTML = "THE FIRST HUMANS HAVE ARRIVED FROM ANOTHER PLANET AND THEIR SHIP CRASHES AND THEY ARE LEFT WITH NOTHING BUT THEMSLEVES"
        // TODO: allow harvest resources
      }
    }
  }
);

// NOTE: CHEAT
document.getElementById("cheat").addEventListener (
  'click', () => {
    energy.count += 1000000;
    increaseEnergy();
    clickCounter.expandUniv = 14;
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

setInterval(() => {
  increaseEnergy();
  if(resource.createBool){
    resource.count+=resource.increment;
    document.getElementById('resourceCount').innerHTML = resource.count;
  }
}, 1000);
