<template>
  <div class="import-file-container">
    <h1>{{ t('import-file.title') }}</h1>

    <div class="button-import">
      <button class="button" @click="openFile">{{ t('import-file.button') }}</button>
      <input type="file" ref="input" class="input-file" accept="application/json" @change="onFileChange">
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import DatabaseService from '@/services/database.service';

const router = useRouter();
const { t } = useI18n();

// Ref
const input = ref(null);

function openFile() {
  input.value.click();
}

function onFileChange() {
  const file = input.value.files[0];

  DatabaseService.loadDatabase(file).then(() => {
    router.push({ name: 'logs' });
  }).catch(err => {
    alert(err);
  });
}
</script>

<style scoped>
.import-file-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.input-file {
  display: none;
}

.button-import {
  margin-left: 50px;
}

.button {
  border: none;
  padding: 10px 20px;
  border-radius: var(--border-radius);
  background: var(--color-green);
  cursor: pointer;
  font-weight: bold;
  text-transform: uppercase;
  color: var(--color-black);
}

.button:hover {
  background: var(--color-green-hover);
}
</style>
