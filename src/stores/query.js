import { defineStore } from 'pinia';
import { ref } from 'vue';

export const userLogRequest = defineStore('logRequest', () => {
  const lastQuery = ref(null);
  const result = ref([]);

  return { lastQuery, result };
});
