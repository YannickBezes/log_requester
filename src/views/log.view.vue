<template>
  <div class="logs-view">
    <input-query />

    <template v-if="lastQuery !== null">
      <div class="counter-logs">
        <h3>{{ t('log.nb-logs', { number: result.length }) }}</h3>
      </div>

      <log-table class="log-table" />
    </template>

  </div>
</template>

<script setup>
import InputQuery from '@/components/input-query.vue';
import { userLogRequest } from '@/stores/query';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import LogTable from '@/components/log-table.vue';
const { t } = useI18n();

const logStore = userLogRequest();
const { result, lastQuery } = storeToRefs(logStore)
</script>

<style scoped>
.counter-logs {
  margin-top: 20px;
  font-family: 'DM Sans', sans-serif;
  font-weight: bold;
  font-size: 18px;
}

.log-table {
  margin-top: 20px;
}
</style>
