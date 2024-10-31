<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { store } from '../store.js';

const exit = (players) => {
  if (store.leader != '0') {
    window.location.hash = '/game';
  } else {
    window.location.hash = '/';
  }
};

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

  <img class="img-rules" src="../assets/bot_effects.png">

</template>

<style scoped>

</style>
