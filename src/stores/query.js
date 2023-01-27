import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useQueryStore = defineStore('query', () => {
  const lastQuery = ref(null);

  return { lastQuery };
});
