<template>
  <div class="logs-view">
    <input-query />

    <div class="counter-logs" v-if="logs.length > 0">
      <h3>{{ logs.length }}</h3>
    </div>
  </div>
</template>

<script setup>
import InputQuery from '@/components/input-query.vue';
import { userLogRequest } from '@/stores/query';
import { reactive, ref } from 'vue';

const logs = reactive(userLogRequest().result);
</script>

<style scoped>
</style>
