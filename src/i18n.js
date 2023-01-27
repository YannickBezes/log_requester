import { createI18n } from 'vue-i18n';

function loadLocaleMessages() {
  const locales = import.meta.glob('./locales/*json', { eager: true, import: 'default' });
  const messages = {};
  Object.keys(locales).forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);

    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales[key];
    }
  });
  return messages;
}

export default createI18n({
  locale: 'en',
  allowComposition: true,
  messages: loadLocaleMessages()
});
