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
  
  store.setValues({
    currentCard: 0,
    deck: newDeck,
    discardDeck: [],
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
  let currentCard = store.deck[0];
  
  let newDeck = store.deck;
  newDeck = newDeck.splice(1, newDeck.length - 1);

  let newDiscardDeck = store.discardDeck;
  if (store.currentCard>0){
    newDiscardDeck.push(store.currentCard);
  } 
  
  let turn = store.turn;
  turn++;

  store.setValues({
    turn: turn,
    deck: newDeck,
    discardDeck: newDiscardDeck,
    currentCard: currentCard,
  });

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
              const audioFile = new Audio('sounds/double_turn.mp3');
              audioFile.volume = store.audioVolume;
              audioFile.play();
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
        <button class="btn btn-primary-outline" type="button" @click="toggleAudio"><i v-if="audio==true" class="fas fa-volume-high"></i><i v-if="audio==false" class="fas fa-volume-xmark"></i></button>
        <button class="btn btn-danger" type="button" @click="reset"><i class="fas fa-circle-xmark"></i> Reset</button>
      </span>
    </div>
  </nav>

  {{ store.deck.length }} cards in deck

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
        <div  v-bind:class="'cardAutoma cardAutoma-'+store.currentCard">
          <span v-if="doubleTurn" class="double-turn blink_me"><span class="text">The bot takes another turn after this</span></span>
        </div> 
        <div class="debug">{{ store.currentCard }}</div>
    </div>
  </div>

  <div class="debug">
    doubleTurn: {{doubleTurn}}
  </div>

  <button  type="button" @click="openBotRaceEffects()"  class="btn btn btn-info game-button">
    <i class="fas fa-solid fa-info-circle"></i>Bot Race Effects Rules
  </button>
  
  <button  type="button" @click="openBotEffects()"  class="btn btn btn-info game-button">
    <i class="fas fa-solid fa-info-circle"></i>Bot Landark And Quest Effects Rules
  </button>

</template>
