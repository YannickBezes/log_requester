<template>
  <div class="log-table">
    <div class="table-container">
      <div class="row" v-for="log in result">
        <code>{{ JSON.stringify(log) }}</code>
      </div>
    </div>
  </div>
</template>

<script setup>
import { userLogRequest } from '@/stores/query';
import { storeToRefs } from 'pinia';

const logStore = userLogRequest();
const { result } = storeToRefs(logStore);

</script>

<style scoped>
.table-container {
  border: 1px solid var(--color-white-soft);
  display: flex;
  flex-direction: column;
}

.row {
  padding: 5px;
  flex: 1;
  display: flex;
  color: var(--color-white);
}

.row:nth-child(2n) {
  background: var(--color-background-mute);
}

.row:not(:last-child) {
  border-bottom: 1px solid var(--color-white-soft);
}
</style>
