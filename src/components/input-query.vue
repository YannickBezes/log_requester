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

    <button class="input-button" @click="queryLogs">{{ t('input-query.button') }}</button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import DatabaseService from '@/services/database.service';
import SearchIcon from '@/components/icons/search-icon.vue';
import { QUERY_TYPE } from '@/constants';
import { BadFormatException } from '@/exceptions/bad-format.exception';
import { userLogRequest } from '@/stores/query';
const { t } = useI18n();

const input = ref(null);
const suggestions = ref([]);
const selectedItem = ref(-1);
const inputFocused = ref(false);

function onSuggestionClick(suggestion) {
  const existingQueries = getQueries();

  if (existingQueries !== null) {
    input.value.value = [ ...getQueries(), suggestion].join(' ');
  } else {
    input.value.value = suggestion;
  }

  focusInput();
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

  const queries = getQueries();
  let currentKey = input.value.value;
  if (queries !== null) {
    currentKey = (input.value.value.replace(queries.join(' '), '')).trim();
  }

  if (currentKey.length >= 3) {
    suggestions.value = DatabaseService.searchInKeys(currentKey);
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

function queryLogs() {
  try {
    let queries = getQueries();

    if (queries.length === 0) {
      throw new BadFormatException('Query is invalid');
    }

    queries = queries.map(keyValue => {
      return parseQuery(keyValue);
    });

    const logRequest = userLogRequest();
    logRequest.result = DatabaseService.find(queries);
  } catch (e) {
    if (e instanceof BadFormatException) {
      // TODO: display error message
      console.log('bad format');
    } else {
      console.error(e);
    }
  }
}

function parseQuery(keyValue) {
  const splitKeyValue= keyValue.split(':');

  if (splitKeyValue.length !== 2) {
    throw new BadFormatException('Query is invalid');
  }

  // Get key and value
  const key = splitKeyValue[0].replace(/['"]/g, '').trim();
  let value = splitKeyValue[1].trim();

  // Check if the key and value is valid
  if (!/^-?["'*].+['"*]$/.test(value) || !DatabaseService.databaseKeys.includes(key)) {
    throw new BadFormatException('Query is invalid');
  }

  let type = QUERY_TYPE.EQUAL;

  // If we have a '-' it's a negation
  let not = false;
  if (value[0] === '-') {
    value = value.slice(1); // Remove '-'
    not =true;
  }

  if (
    (value[0] === '"' && value[value.length -1] === '"') ||
    (value[0] === '\'' && value[value.length -1] === '\'')
  ) {
    type = not ? QUERY_TYPE.NOT_EQUAL: QUERY_TYPE.EQUAL;
  } else if (value[0] === '*' && value[value.length -1] === '*') {
    type = not ? QUERY_TYPE.DO_NOT_CONTAINS: QUERY_TYPE.CONTAINS;
  }
  value = value.slice(1, value.length -1);

  return { key, value, type };
}

function getQueries() {
  // Query
  const query = input.value.value;
  return query.match(/((['"]?[\w_\-]+['"]?):(-?['"*][\w_\s\-]+['"*]))+/g);
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
