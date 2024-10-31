<script setup>
import { ref } from 'vue';
import { store } from '../store.js';
import { leaders } from '../const.js';
import { cards } from '../const.js';

defineProps({
  title: String,
});

const audio = ref(store.audio);

const config = () => {
  window.location.hash = '/config';
}

const startGame = (leader) => {
  let deck = [];
  for (let key in cards){
    const card = cards[key];
    if (card.id>0){
      deck.push(card.id);
    }
  }

  store.setValues({
    initialized: true,
    leader: leader,
    deck: deck,
  });

  if (store.audio){
    const audioFile = new Audio('sounds/click.wav');
    audioFile.volume = store.audioVolume;
    audioFile.play();
  }

  window.location.hash = '/game';
};

const toggleAudio = () => {
  audio.value = !audio.value;
  store.setValues({
    audio: audio.value
  });
}


const startGameRandomLeader = () => {
  const leader = Math.floor(Math.random() * (leaders.length-1))+1;
  startGame(leader);
};

const count = ref(0);
</script>

<template>
  <nav class="navbar sticky-top bg-dark">
    <div class="container-fluid">
        <span class="fs-4 text-light">LOTR : Duel for Middle-earth - UNOFFICIAL SOLO VARIANT by Tommaso Martinoli</span>
        <span class="game-button-bar">
          <button class="btn btn-primary-outline" type="button" @click="config"><i class="fas fa-gear"></i></button>
          <button class="btn btn-primary-outline" type="button" @click="toggleAudio"><i v-if="audio==true" class="fas fa-volume-high"></i><i v-if="audio==false" class="fas fa-volume-xmark"></i></button>
        </span>
    </div>
  </nav>

  <div class="card">
    <div class="card-body new-game-info" >
      This app is based upon <a href="https://boardgamegeek.com/filepage/287485/lotr-duel-for-middle-earth-unofficial-solo-variant" target="_blank">UNOFFICIAL SOLO VARIANT</a> by <a href="https://boardgamegeek.com/user/Tommaso_Martinoli" target="_blank">Tommaso Martinoli</a>
      <br/>
      Version 1.3
    </div> 
  </div>

  <div class="card">
    <div class="card-body new-game-info new-game-buttons" >
       Choose a leader or <button class="btn btn-primary" @click="startGameRandomLeader()">get a random one</button> to start the game
    </div> 

    <div class="leader-choice">
    <div v-for="index in 9" class="cardLeaderWrapper">
      <div  v-bind:class="'cardLeader clickable cardLeader-'+index" @click="startGame(index)" v-bind:title="leaders[index].name"/>
    </div>
  </div>

  </div>

</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
