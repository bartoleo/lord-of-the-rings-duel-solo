
<script setup>
import { ref, defineProps, onMounted, computed } from 'vue';
import { store } from './store.js';
import NewGame from './components/NewGame.vue';
import Game from './components/Game.vue';
import Config from './components/Config.vue';
import Effects from './components/Effects.vue';
import RaceEffects from './components/RaceEffects.vue';
import Deck from './components/Deck.vue';
import NotFound from './components/NotFound.vue';

const routes = {
  '/': NewGame,
  '/game': Game,
  '/config': Config,
  '/effects': Effects,
  '/raceEffects': RaceEffects,
  '/deck': Deck,
  //'/about': About,
};

const currentPath = ref('');

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/'] || NotFound;
});

onMounted(() => {

  if (!store.initialized){
    store.load();
  }

  if (store.leader != 0) {
    window.location.hash = '/game';
  } else {
    window.location.hash = '/';
  }

  if (window.location.search.indexOf("debug")>=0){
    document.getElementById("app").classList.add('debugEnabled');
  }

  currentPath.value = window.location.hash;
  window.addEventListener('hashchange', () => {
    document.getElementById("app").classList.remove('fade-in');
    document.getElementById("app").classList.add('fade-out');
    setTimeout(function(){
      document.getElementById("app").classList.remove('fade-out');
      document.getElementById("app").classList.add('fade-in');
      currentPath.value = window.location.hash;
    }, 300);
  });
});
</script>

<template>
<component :is="currentView" />
</template>

<style scoped></style>
