import { defineStore } from 'pinia';
import { ref } from 'vue';

export const userLogRequest = defineStore('logRequest', () => {
  let lastQuery = ref(null);
  const result = ref([]);

  function setLastQuery(query) {
    lastQuery = query;
  }

  return { lastQuery, result, setLastQuery };
});
