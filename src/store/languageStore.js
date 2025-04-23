import { defineStore } from 'pinia';

export const useLanguageStore = defineStore('language', {
  state: () => ({
    languagePreference: localStorage.getItem('language_pref') || 'en',
  }),
  actions: {
    setLanguagePreference(pref) {
      this.languagePreference = pref;
      localStorage.setItem('language_pref', pref);
    },
  },
});