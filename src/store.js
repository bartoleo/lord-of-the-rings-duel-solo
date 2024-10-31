import { reactive } from 'vue';

export const store = reactive({
  initialized: false,
  leader: 0,
  turn: 0,
  currentCard: 0,
  deck: [],
  discardDeck: [],
  audio: true,
  audioVolume: 0.5,
  reset() {
    this.setValues({
      initialized: false,
      leader: 0,
      turn: 0,
      currentCard: 0,
      deck: [],
      discardDeck: [],
    });
  },
  load() {
    console.log('store load');
    var values = localStorage.store;
    if (values != null) {
      this.setValues(JSON.parse(values));
    } else {
      this.initialized = true;
    }
    console.log('store load:', this);
  },
  setValues(obj) {
    if (obj != null) {
      for (var k in obj) {
        this[k] = obj[k];
      }
    }
    console.log('store save');
    localStorage.store = JSON.stringify(this);
  },
});
