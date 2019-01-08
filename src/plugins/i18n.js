import Vue from 'vue'
import VueI18n from 'vue-i18n'
import en from '@/lang/en.json'
import vn from '@/lang/vn.json'

Vue.use(VueI18n)
export const i18n = new VueI18n({
    locale: process.env.VUE_APP_LANGUAGE,
    fallbackLocale: 'en',
    messages: { en, vn }
})