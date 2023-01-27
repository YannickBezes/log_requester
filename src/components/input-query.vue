<template>
  <div class="input-query-log">
    <div class="input-container">
      <div class="input" @click="focusInput">
        <search-icon />
        <input
          name="query"
          type="text"
          class="input-text"
          ref="input"
          @input="onInputChange"
          @keyup.down="onKeyUpArrowDown"
          @keyup.up="onKeyUpArrowUp"
          @keyup.enter="onKeyUpEnter"
          @focusin="onFocusIn"
          v-click-outside="onFocusOut"
          spellcheck="false"
        >
      </div>

      <div
        class="input-autocomplete "
        v-if="suggestions.length > 0 && inputFocused"
      >
        <div
          v-for="(suggestion, index) in suggestions"
          class="suggestion do-not-clear-input-focus"
          :class="{ 'selected': index === selectedItem }"
          :key="suggestion"
          @click="() => onSuggestionClick(suggestion)"
        >
          {{ suggestion }}
        </div>
      </div>
    </div>

    <button class="input-button">{{ t('input-query.button') }}</button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import DatabaseService from '@/services/database.service';
import SearchIcon from '@/components/icons/search-icon.vue';
const { t } = useI18n();

const input = ref(null);
const suggestions = ref([]);
const selectedItem = ref(-1);
const inputFocused = ref(false);

function onSuggestionClick(suggestion) {
  input.value.value = suggestion;
  suggestions.value = [];
}

function focusInput() {
  input.value.focus();
}

function onFocusIn() {
  inputFocused.value = true;
}

function onFocusOut(e) {
  if (!e.target.className.includes('do-not-clear-input-focus')) {
    inputFocused.value = false;
  }
}

function onKeyUpEnter() {
  if (selectedItem.value !== -1) {
    onSuggestionClick(suggestions.value[selectedItem.value]);
  }
}

function onInputChange() {
  // Reset selected item
  selectedItem.value = -1;

  if (input.value.value.length >= 3) {
    suggestions.value = DatabaseService.searchInKeys(input.value.value);
  } else {
    suggestions.value = [];
  }
}

function onKeyUpArrowDown(e) {
  e.preventDefault();
  if (selectedItem.value < suggestions.value.length - 1) {
    selectedItem.value++;
  }
}

function onKeyUpArrowUp(e) {
  e.preventDefault();
  if (selectedItem.value > 0) {
    selectedItem.value--;
  }
}
</script>

<style scoped>
.input-query-log {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 700;
}

.input-container {
  flex: 1;
  display: flex;
  position: relative;
}

.input,
.input-autocomplete {
  background: var(--color-white-mute);
  border: 1px solid var(--color-border);
  color: var(--color-black-mute);
}

.input {
  flex: 1;
  display: flex;
  border-radius: var(--border-radius);
  align-items: center;
  cursor: text;
  margin-right: 15px;
  padding: 5px;
}

.input-text {
  cursor: inherit;
  font-size: inherit;
  font-family: inherit;
  height: 23px;
}

.input-text {
  margin-left: 5px;
  flex: 1;
  border: none;
  background: none;
  outline: none;
  padding: 0;
  color: inherit;
  font-weight: 600;
}

.input-button {
  padding: 0 10px;
  height: 36px;
  border-radius: var(--border-radius);
  border: none;
  background: var(--color-green);
  font-weight: inherit;
  font-size: inherit;
  cursor: pointer;
}
.input-button:hover {
  background: var(--color-green-hover);
}

.input-autocomplete {
  position: absolute;
  width: calc(100% - 15px);
  z-index: 1;
  border-top: none;
  top: 34px;
}

.suggestion {
  cursor: pointer;
  padding: 2px 5px;
  font-weight: 600;
  font-family: inherit;
  color: inherit;
}

.suggestion:hover,
.suggestion.selected {
  background: var(--color-divider-dark-2);
}

</style>
