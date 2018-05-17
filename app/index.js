let starDust = {"current": 0, "total": 0, "cp": 10, "cpBool": false, "interval": 2000};
let planet = {"size": 0, "cp1":false, "cp2": false, "cp3": false, "cp4": false};
let floodBool = false;
let resource = {"current": 0, "total": 0};
const planetCheckpoint = [15, 25, 40, 60];
let fib = []
let clickCounter = {"growPlanet": 0, "elevateEarth": 0, "human": 0}
let humanCost = 20;

// COLLECT STAR DUST
document.getElementById("collectStarDust").addEventListener (
  'click', () => {
      increaseStarDust();
  }
);

function increaseStarDust() {
  starDust.current++;
  starDust.total++;
  document.getElementById('starDustCount').innerHTML = starDust.current;
  if(starDust.current >= starDust.cp && !starDust.cpBool){
    enableElement("createPlanet", "inline");
    enableElement("createPlanetLabel", "inline");
    starDust.cpBool = !starDust.cpBool;
  }
}

function decreaseStarDust(num) {
  if(starDust.current - num >= 0){
    starDust.current -= num;
    document.getElementById('starDustCount').innerHTML = starDust.current;
    return true;
  }
  return false;
}

setInterval(() => {
  increaseStarDust();
}, starDust.interval);


//CREATE PLANET
document.getElementById("createPlanet").addEventListener (
  'click', () => {
    if(decreaseStarDust(20)){
      disableElement("createPlanet");
      disableElement("createPlanetLabel");
      enableElement("growPlanet", "inline");
      enableElement("growPlanetCost", "inline");
      enableElement("planetSize", "block");
    }
  }
);

//GROW PLANET
document.getElementById("growPlanet").addEventListener (
  'click', () => {
    if(decreaseStarDust(20+10*clickCounter.growPlanet)){
      clickCounter.growPlanet++;
      planet.size = fibonacci(clickCounter.growPlanet, fib);
      document.getElementById("growPlanetCost").innerHTML = `${20+10*clickCounter.growPlanet}g star dust`;
      // TODO: format number to be in format 123,456 or 123 456
      document.getElementById("planetSize").innerHTML = `${planet.size} km${"2".sup()}`;
      if(clickCounter.growPlanet == 15 && !planet.cp1){
        enableElement("flood", "inline");
        enableElement("floodCost", "inline");
        planet.cp1 = !planet.cp1;
      } else if(clickCounter.growPlanet >= 25 && planet.cp1 && !planet.cp2 && floodBool){
        enableElement("elevateEarth", "inline");
        enableElement("elevateCost", "inline");
        enableElement("elevatePercentage", "inline");
        planet.cp2 = !planet.cp2;
      } else if(clickCounter.growPlanet >= 45 && planet.cp1 && planet.cp2 && !planet.cp3 && floodBool){
        enableElement("addResource", "inline");
        enableElement("resourceCost", "inline");
        planet.cp3 = !planet.cp3;
      } else if (clickCounter.growPlanet == 60 && planet.cp1 && planet.cp2 && planet.cp3 && !planet.cp4 && floodBool) {
        enableElement("createHuman", "inline");
        enableElement("humanCost", "inline");
        planet.cp4 = !planet.cp4;
      }

      if(clickCounter.growPlanet == 60){
        document.getElementById("growPlanet").disabled = true;
        document.getElementById("growPlanetCost").innerHTML = "MAX SIZE";
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


//FLOOD
document.getElementById("flood").addEventListener (
  // TODO: if flood is clicked, check to see if any onther buttons should be activated
  'click', () => {
    if(decreaseStarDust(200)){
      if(clickCounter.growPlanet == 60){
        enableElement("createHuman", "inline");
        enableElement("humanCost", "inline");
      } if(clickCounter.growPlanet >= 45){
        enableElement("addResource", "inline");
        enableElement("resourceCost", "inline");
      } if(clickCounter.growPlanet >= 25){
        enableElement("elevateEarth", "inline");
        enableElement("elevateCost", "inline");
        enableElement("elevatePercentage", "inline");
      }
      floodBool = true;
      document.getElementById('memo').innerHTML = "Planet flooded";
      document.getElementById('flood').disabled = true;
      disableElement('floodCost');
    }
  }
);


// ELEVATE EARTH
document.getElementById("elevateEarth").addEventListener (
  'click', () => {
    if(clickCounter.elevateEarth < 71){
      if(decreaseStarDust(10*(clickCounter.elevateEarth+1))) {
        clickCounter.elevateEarth++;
        document.getElementById('elevateCost').innerHTML = `${10*(clickCounter.elevateEarth+1)}g star dust`;
        document.getElementById('elevatePercentage').innerHTML = `${clickCounter.elevateEarth}%`;
        if(clickCounter.elevateEarth == 71){
          disableElement('elevateCost');
          document.getElementById('elevateEarth').disabled = true;
        }
      }
    }
  }
);

// ADD HUMANS
document.getElementById("createHuman").addEventListener (
  'click', () => {
    if(decreaseStarDust(humanCost*clickCounter.human)){
      clickCounter.human++;
      if(clickCounter.human == 1){
        document.getElementById('memo').innerHTML = "THE FIRST HUMANS HAVE ARRIVED FROM ANOTHER PLANET AND THEIR SHIP CRASHES AND THEY ARE LEFT WITH NOTHING BUT THEMSLEVES"
      }

      console.log("clicked");
    }
  }
);

//CHEAT
document.getElementById("cheat").addEventListener (
  'click', () => {
    starDust.current = 1000000;
    increaseStarDust();
    clickCounter.growPlanet = 14;
    // enableElement("createHuman", "inline");
    // enableElement("humanCost", "inline");
    // enableElement("addResource", "inline");
    // enableElement("resourceCost", "inline");
    // enableElement("elevateEarth", "inline");
    // enableElement("elevateCost", "inline");
  }
);


//ENABLE AND DISABLE
function enableElement(elementID, place) {
  document.getElementById(elementID).style.display = place;
}

function disableElement(elementID) {
  document.getElementById(elementID).style.display = "none";
}
