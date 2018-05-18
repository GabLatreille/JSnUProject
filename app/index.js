// NOTE: cp means checkpoint
let energy = {"current": 0, "total": 0, "cp": 10, "cpBool": false, "interval": 2000};
let universe = {"size": 0, "cp1":false, "cp2": false, "cp3": false, "cp4": false};
let atmosphereBool = false;
let resource = {"current": 0, "total": 0};
let fib = []
let clickCounter = {"expandUniv": 0, "lanscape": 0, "human": 0}
let humanCost = 20;


// NOTE: COLLECT ENERGY
document.getElementById("collectEnergy").addEventListener (
  'click', () => {
      increaseEnergy();
  }
);

function increaseEnergy() {
  energy.current++;
  energy.total++;
  document.getElementById('energyCount').innerHTML = energy.current;
  if(energy.current >= energy.cp && !energy.cpBool){
    enableElement("createBB", "inline");
    enableElement("createBBLabel", "inline");
    energy.cpBool = !energy.cpBool;
  }
}

function decreaseEnergy(num) {
  if(energy.current - num >= 0){
    energy.current -= num;
    document.getElementById('energyCount').innerHTML = energy.current;
    return true;
  }
  return false;
}

setInterval(() => {
  increaseEnergy();
}, energy.interval);

// NOTE: CREATE BIG BANG
document.getElementById("createBB").addEventListener (
  'click', () => {
    if(decreaseEnergy(20)){
      disableElement("createBB");
      disableElement("createBBLabel");
      enableElement("expandUniverse", "inline");
      enableElement("expandUniverseCost", "inline");
      enableElement("universeSize", "inline");
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
        enableElement("formAtmosphere", "inline");
        enableElement("atmosphereCost", "inline");
        universe.cp1 = !universe.cp1;
      } else if(clickCounter.expandUniv >= 25 && universe.cp1 && !universe.cp2 && atmosphereBool){
        enableElement("landscaping", "inline");
        enableElement("landscapeCost", "inline");
        enableElement("waterPerc", "inline");
        universe.cp2 = !universe.cp2;
      } else if(clickCounter.expandUniv >= 45 && universe.cp1 && universe.cp2 && !universe.cp3 && atmosphereBool){
        enableElement("addResource", "inline");
        enableElement("resourceCost", "inline");
        universe.cp3 = !universe.cp3;
      } else if (clickCounter.expandUniv == 60 && universe.cp1 && universe.cp2 && universe.cp3 && !universe.cp4 && atmosphereBool) {
        enableElement("createHuman", "inline");
        enableElement("humanCost", "inline");
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
        enableElement("createHuman", "inline");
        enableElement("humanCost", "inline");
      } if(clickCounter.expandUniv >= 45){
        enableElement("addResource", "inline");
        enableElement("resourceCost", "inline");
      } if(clickCounter.expandUniv >= 25){
        enableElement("landscaping", "inline");
        enableElement("landscapeCost", "inline");
        enableElement("waterPerc", "inline");
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

// NOTE: HUMANS
document.getElementById("createHuman").addEventListener (
  'click', () => {
    if(decreaseEnergy(humanCost*clickCounter.human)){
      clickCounter.human++;
      if(clickCounter.human == 1){
        document.getElementById('memo').innerHTML = "THE FIRST HUMANS HAVE ARRIVED FROM ANOTHER PLANET AND THEIR SHIP CRASHES AND THEY ARE LEFT WITH NOTHING BUT THEMSLEVES"
        // TODO: allow harvest resources
      }

      console.log("clicked");
    }
  }
);

// NOTE: CHEAT
document.getElementById("cheat").addEventListener (
  'click', () => {
    energy.current = 1000000;
    increaseEnergy();
    clickCounter.expandUniv = 14;
  }
);

// NOTE: ENABLE AND DISABLE
function enableElement(elementID, place) {
  document.getElementById(elementID).style.display = place;
}

function disableElement(elementID) {
  document.getElementById(elementID).style.display = "none";
}
