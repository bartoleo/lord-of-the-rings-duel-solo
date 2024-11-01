<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { store } from '../store.js';
import { cards } from '../const.js';

const exit = (players) => {
  if (store.leader != '0') {
    window.location.hash = '/game';
  } else {
    window.location.hash = '/';
  }
};

const undrawnCards = ref([]);
const drawnCards = ref([]);

onMounted(() => {
  
  for (let key in cards){
    const card = cards[key];
    store.deck.forEach(deckCard => {
      if (deckCard==card.id){
        undrawnCards.value.push(deckCard);
      }
    });
  }
  
  if (store.currentCard>0){
    drawnCards.value.push(store.currentCard);
  }
  
  store.discardDeck.forEach(deckCard => {
    drawnCards.value.push(deckCard);
  });
  
});

</script>

<template>
  <nav class="navbar sticky-top bg-dark">
    <div class="container-fluid">
      <span class="fs-4 text-light">LOTR : Duel for Middle-earth - UNOFFICIAL SOLO VARIANT by Tommaso Martinoli</span>
      <span class="game-button-bar">
        <button class="btn btn-primary" type="button" @click="exit()">Ok</button>
      </span>
    </div>
  </nav>
  
  <div class="card m-1" >
    <h3>Undrawn cards (not in deck order)</h3>
    <div class="deck-container undrawn">
      <div v-for="(item, index) in undrawnCards" class="undrawn-card">
        <div  v-bind:class="'cardAutoma cardAutoma-'+item">
        </div>
      </div>
    </div>
  </div>
  
  <div class="card m-1" >
    <h3>Drawn cards (in order)</h3>
      <div class="deck-container drawn">
        <div v-for="(item, index) in drawnCards" class="undrawn-card">
          <div  v-bind:class="'cardAutoma cardAutoma-'+item">
          </div>
        </div>
      </div>
    </div>
    
  </template>
  
  <style scoped>
  
</style>
