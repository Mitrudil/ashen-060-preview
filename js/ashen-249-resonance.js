/* ASHEN 249 — symulator liczb rezonansu, NIE nalicza efektow w grze. */
(function(root,factory){
 const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;
 else root.Ashen249Resonance=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const catalog=Object.freeze({
  "Niszczycielski": {
    "category": "Broń biała 1H",
    "at3": [
      {
        "stat": "Obrażenia broni",
        "value": 4,
        "unit": "%"
      },
      {
        "stat": "Celność",
        "value": 2,
        "unit": "pkt"
      }
    ],
    "at6": [
      {
        "stat": "Obrażenia broni",
        "value": 9,
        "unit": "%"
      },
      {
        "stat": "Celność",
        "value": 4,
        "unit": "pkt"
      }
    ],
    "mode": "simulation-only"
  },
  "Żelazny": {
    "category": "Broń biała 2H",
    "at3": [
      {
        "stat": "Obrażenia broni",
        "value": 5,
        "unit": "%"
      },
      {
        "stat": "Wytrzymałość",
        "value": 2,
        "unit": "pkt"
      }
    ],
    "at6": [
      {
        "stat": "Obrażenia broni",
        "value": 11,
        "unit": "%"
      },
      {
        "stat": "Wytrzymałość",
        "value": 4,
        "unit": "pkt"
      }
    ],
    "mode": "simulation-only"
  },
  "Refleksyjny": {
    "category": "Broń palna 1H",
    "at3": [
      {
        "stat": "Celność",
        "value": 3,
        "unit": "pkt"
      },
      {
        "stat": "Unik",
        "value": 2,
        "unit": "pkt"
      }
    ],
    "at6": [
      {
        "stat": "Celność",
        "value": 7,
        "unit": "pkt"
      },
      {
        "stat": "Unik",
        "value": 4,
        "unit": "pkt"
      }
    ],
    "mode": "simulation-only"
  },
  "Techniczny": {
    "category": "Broń palna 2H",
    "at3": [
      {
        "stat": "Celność",
        "value": 3,
        "unit": "pkt"
      },
      {
        "stat": "Przebicie pancerza",
        "value": 2,
        "unit": "pkt"
      }
    ],
    "at6": [
      {
        "stat": "Celność",
        "value": 6,
        "unit": "pkt"
      },
      {
        "stat": "Przebicie pancerza",
        "value": 5,
        "unit": "pkt"
      }
    ],
    "mode": "simulation-only"
  },
  "Tropicielski": {
    "category": "Broń dystansowa",
    "at3": [
      {
        "stat": "Celność",
        "value": 2,
        "unit": "pkt"
      },
      {
        "stat": "Percepcja",
        "value": 2,
        "unit": "pkt"
      }
    ],
    "at6": [
      {
        "stat": "Celność",
        "value": 5,
        "unit": "pkt"
      },
      {
        "stat": "Percepcja",
        "value": 4,
        "unit": "pkt"
      }
    ],
    "mode": "simulation-only"
  },
  "Osłonowy": {
    "category": "Uniwersalna obrona",
    "at3": [
      {
        "stat": "Pancerz",
        "value": 4,
        "unit": "pkt"
      },
      {
        "stat": "Maks. PŻ",
        "value": 8,
        "unit": "pkt"
      }
    ],
    "at6": [
      {
        "stat": "Pancerz",
        "value": 10,
        "unit": "pkt"
      },
      {
        "stat": "Maks. PŻ",
        "value": 20,
        "unit": "pkt"
      }
    ],
    "mode": "simulation-only"
  },
  "Nomadyczny": {
    "category": "Eksploracja",
    "at3": [
      {
        "stat": "Szczęście",
        "value": 1,
        "unit": "pkt"
      },
      {
        "stat": "Surowce ze Strefy",
        "value": 3,
        "unit": "%"
      }
    ],
    "at6": [
      {
        "stat": "Szczęście",
        "value": 3,
        "unit": "pkt"
      },
      {
        "stat": "Surowce ze Strefy",
        "value": 7,
        "unit": "%"
      }
    ],
    "mode": "simulation-only"
  },
  "Anomalny": {
    "category": "Uniwersalny styl hybrydowy",
    "at3": [
      {
        "stat": "Celność",
        "value": 2,
        "unit": "pkt"
      },
      {
        "stat": "Unik",
        "value": 2,
        "unit": "pkt"
      }
    ],
    "at6": [
      {
        "stat": "Celność",
        "value": 4,
        "unit": "pkt"
      },
      {
        "stat": "Unik",
        "value": 4,
        "unit": "pkt"
      }
    ],
    "mode": "simulation-only"
  }
});
 function evaluate(family,distinctNames){
  const config=catalog[family];if(!config)throw Error('Nieznana rodzina artefaktów');
  if(!Array.isArray(distinctNames))throw Error('Oczekiwano listy osadzonych artefaktów');
  const count=new Set(distinctNames.filter(x=>typeof x==='string'&&x.trim())).size;
  const tier=count>=6?6:count>=3?3:0;
  return {family,count,tier,category:config.category,bonuses:tier===6?config.at6:tier===3?config.at3:[],simulated:true};
 }
 return Object.freeze({catalog,evaluate});
});
