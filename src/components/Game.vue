<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { store } from '../store.js';
import { leaders } from '../const.js';
import { cards } from '../const.js';

defineProps({
  title: String,
});

const audio = ref(store.audio);
const leader = store.leader;
const doubleTurn = ref(false);
const viewHistory = ref(store.viewHistory);
let currentCardCssClass = ref('');

const diceValueSymbol = computed(() => {
  switch (store.diceValue) {
    case 1:
    return "fa-dice-one";
    case 2:
    return "fa-dice-two";
    case 3:
    return "fa-dice-three";   
    case 4:
    return "fa-dice-four";
    case 5:
    return "fa-dice-five";  
    case 6:
    return "fa-dice-six";
  }
  return "";
});

const isShuffleDeckDisabled = computed(() => {
  return store.deck.length > 0;
});

const isDrawCardDisabled = computed(() => {
  return store.deck.length == 0;
});

const shuffle = (array) => {
  let currentIndex = array.length,
  randomIndex;
  
  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
    array[randomIndex],
    array[currentIndex],
    ];
  }
  
  return array;
};

const shuffleDeck = (draw) => {
  let newDeck = store.deck;
  
  newDeck = newDeck.concat(store.discardDeck);
  
  if (store.currentCard>0){
    newDeck.push(store.currentCard);
  }
  
  newDeck = shuffle(newDeck);
  
  
  let historyNew = store.history;
  if (!historyNew){
    historyNew = []
  }
  // don't add to history first shuffle
  if (store.turn>0){
    historyNew.push(-1);
  }
  
  store.setValues({
    currentCard: 0,
    deck: newDeck,
    discardDeck: [],
    history: historyNew
  });
  
  if (draw){
    drawCard(false);
  }
  
  try {
    if (store.audio){
      const audioFile = new Audio('sounds/shuffle.wav');
      audioFile.volume = store.audioVolume;
      audioFile.play();
    }
  } catch (ex){
    //do nothing
    console.error(ex);
  }
  
  recalculateValues();
};

const drawCard = (playAudio) => {

  currentCardCssClass.value = "card-fade-out";
  
  setTimeout(function(){
      
    let currentCard = store.deck[0];
    
    let newDeck = store.deck;
    newDeck = newDeck.splice(1, newDeck.length - 1);
    
    let newDiscardDeck = store.discardDeck;
    if (store.currentCard>0){
      newDiscardDeck.push(store.currentCard);
    } 
    
    let turn = store.turn;
    turn++;
    
    let historyNew = store.history;
    if (!historyNew){
      historyNew = []
    }
    historyNew.push(currentCard);
    
    currentCardCssClass.value = "card-fade-in";

    store.setValues({
      turn: turn,
      deck: newDeck,
      discardDeck: newDiscardDeck,
      currentCard: currentCard,
      history: historyNew
    });
        
    launchDice(false);
    
    recalculateValues();

  }, 300);
    
  try {
    if (playAudio && store.audio){
      const audioFile = new Audio('sounds/draw.wav');
      audioFile.volume = store.audioVolume;
      audioFile.play();
    }
  } catch (ex){
    //do nothing
    console.error(ex);
  }
  
  recalculateValues();
  
};

const launchDice = (playAudio) => {
  
  const dice = Math.floor(Math.random() * (6))+1;
  
  store.setValues({
    diceValue: dice,
  });
  
  const launches = Math.floor(Math.random() * (4))+3;
  for (let i=1;i<launches;i++){
    setTimeout(function(){
      if (store.audio){
        try {
          const dice2 = Math.floor(Math.random() * (6))+1;
          
          store.setValues({
            diceValue: dice2,
          });
        } catch (ex){
          //do nothing
          console.error(ex);
        }
      }
    }, i*100);
  }
  
  if (playAudio){
    try {
      if (store.audio){
        const audioFile = new Audio('sounds/rolling_dice.mp3');
        audioFile.volume = store.audioVolume;
        audioFile.play();
      }
    } catch (ex){
      //do nothing
      console.error(ex);
    }
  }
  
};

const toggleViewHistory = () => {
  viewHistory.value = !viewHistory.value;
  store.setValues({
    viewHistory: viewHistory.value
  });
}

const reset = () => {
  if (window.confirm('Confirm reset?')) {
    store.reset();
    window.location.hash = '/';
  }
};

const toggleAudio = () => {
  audio.value = !audio.value;
  store.setValues({
    audio: audio.value
  });
}

const config = () => {
  window.location.hash = '/config';
}

const recalculateValues = () => {
  var newDoubleTurn = false;
  const currentCard = Number(store.currentCard);
  if (currentCard==0){
    // nothing
  } else {
    const card = cards[currentCard];
    if (card.symbol == 0){
      //nothing
    } else if (leaders[leader].symbols.length==0){
      //nothing
    } else {
      leaders[leader].symbols.forEach((leaderSymbol) => {
        if (leaderSymbol == card.symbol){
          newDoubleTurn = true;
        }
      });
    }
    
    if (newDoubleTurn != doubleTurn.value){
      doubleTurn.value = newDoubleTurn;
      
      if (newDoubleTurn){
        try {
          
          setTimeout(function(){
            if (store.audio){
              try {
                const audioFile = new Audio('sounds/double_turn.mp3');
                audioFile.volume = store.audioVolume;
                audioFile.play();
              } catch (ex){
                //do nothing
                console.error(ex);
              }
            }
          }, 300);
          
        } catch (ex){
          //do nothing
          console.error(ex);
        }
      }
    }
    
    
  }
  
}

const openBotRaceEffects = () => {
  window.location.hash = '/raceEffects';
}

const openBotEffects = () => {
  window.location.hash = '/effects';
}

const openDeck = () => {
  window.location.hash = '/deck';
}

onMounted(() => {
  if (store.turn==0){
    shuffleDeck(false);
  } else {
    recalculateValues();
  }
});

</script>

<template>
  
  <nav class="navbar sticky-top bg-dark">
    <div class="container-fluid">
      <span class="fs-4 text-light">LOTR : Duel for Middle-earth - UNOFFICIAL SOLO VARIANT by Tommaso Martinoli</span>
      <span class="fs-4 text-light header-small">Leader: <span class="value">{{ leaders[leader].name }}</span> - Turn: <span class="value">{{ store.turn }}</span></span>
      <span class="game-button-bar">
        <button class="btn btn-primary-outline" type="button" @click="config"><i class="fas fa-gear"></i></button>
        <button class="btn btn-primary-outline" type="button" @click="toggleViewHistory" title="Show/Hide history of cards"><i v-if="viewHistory==true" class="fas fa-table-list"></i><i v-if="viewHistory==false" class="fas fa-table-list icon-crossed"></i></button>
        <button class="btn btn-primary-outline" type="button" @click="toggleAudio"><i v-if="audio==true" class="fas fa-volume-high"></i><i v-if="audio==false" class="fas fa-volume-xmark"></i></button>
        <button class="btn btn-danger" type="button" @click="reset"><i class="fas fa-circle-xmark"></i> Reset</button>
      </span>
    </div>
  </nav>
  
  <button class="btn btn-info game-button" v-bind:title="store.diceValue" @click="launchDice(true)">
    D6: <i v-bind:class="'fas dice-value '+diceValueSymbol"></i>
  </button>
  
  <button class="btn btn-info game-button" title="Show draw and undrawn cards" @click="openDeck()">
    {{ store.deck.length }} cards in deck
  </button>
  
  <button :disabled="isDrawCardDisabled" type="button" @click="drawCard(true)"  class="btn btn-primary game-button">
    <i class="fas fa-copy"></i> Draw card
  </button>
  
  <button :disabled="isShuffleDeckDisabled" type="button" @click="shuffleDeck(true)"  class="btn btn btn-success game-button">
    <i class="fas fa-solid fa-forward"></i> Shuffle and draw card
  </button>
  
  <div class="debug">
    deck: {{ store.deck }}
    discardDeck: {{ store.discardDeck }}
  </div>
  
  <div class="gameCardsContainer">
    <div class="cardLeaderWrapper">
      <div  v-bind:class="'cardLeader cardLeader-'+leader" v-bind:title="leaders[leader].name"/>
    </div>
    
    <div class="cardWrapper">
      <div  v-bind:class="'cardAutoma cardAutoma-'+store.currentCard+' '+currentCardCssClass">
        <span v-if="doubleTurn" class="double-turn blink_me"><span class="text">The bot takes another turn after this</span></span>
      </div> 
      <div class="debug">{{ store.currentCard }}</div>
    </div>
  </div>
  
  <div class="debug">
    doubleTurn: {{doubleTurn}}
  </div>
  
  <button  type="button" @click="openBotRaceEffects()"  class="btn btn btn-info game-button">
    <i class="fas fa-solid fa-info-circle"></i> Bot Race Effects Rules
  </button>
  
  <button  type="button" @click="openBotEffects()"  class="btn btn btn-info game-button">
    <i class="fas fa-solid fa-info-circle"></i> Bot Landark And Quest Effects Rules
  </button>
  
  
  <div class="card m-1 history-container" v-if="viewHistory">
    History of the cards drawn:
    <div class="history-cards">
      <div v-for="(historyItem, index) in store.history" class="history-card">
        <div v-if="historyItem==-1" class="history-shuffled">Shuffled</div>
        <div v-if="historyItem>0">     
          <div  v-bind:class="'cardAutoma cardAutoma-'+historyItem">
          </div> 
          <div class="debug">{{ historyItem }}</div></div>
        </div>
      </div>
    </div>
    
  </template>
  