// src/boot/i18n.js
import { defineBoot } from '#q-app/wrappers'
import { createI18n } from 'vue-i18n'
import { Quasar } from 'quasar'
import messages from 'src/i18n'

// IMPORTA OS LANG PACKS SEM ".mjs"
import enUS from 'quasar/lang/en-US'
import ptBR from 'quasar/lang/pt-BR'

const STORAGE_KEY = 'app.locale'
const PACKS = { 'en-US': enUS, 'pt-BR': ptBR }

function pickInitial () {
  const saved = localStorage.getItem(STORAGE_KEY)
  const browser = navigator.language || 'en-US'
  if (PACKS[saved]) return saved
  if (PACKS[browser]) return browser
  // fallback: tenta só o prefixo do navegador (pt -> pt-BR, en -> en-US)
  const prefix = browser.slice(0, 2)
  if (prefix === 'pt') return 'pt-BR'
  return 'en-US'
}

function htmlLang (locale) {
  return locale.startsWith('pt') ? 'pt' : 'en'
}

let i18n // referência para trocar em runtime

export function setLocale (locale) {
  if (!PACKS[locale]) return
  i18n.global.locale.value = locale
  localStorage.setItem(STORAGE_KEY, locale)
  document.documentElement.setAttribute('lang', htmlLang(locale))
  Quasar.lang.set(PACKS[locale])
  // opcional: cookie para backend (emails, etc.)
  // document.cookie = `locale=${locale}; path=/; max-age=${60*60*24*365}`
}

export default defineBoot(({ app }) => {
  const initial = pickInitial()

  i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: initial,          // lido do localStorage/navegador
    fallbackLocale: 'en-US',
    messages                  // certifique-se de ter chaves 'en-US' e 'pt-BR'
  })

  app.use(i18n)

  // aplica idioma inicial ao Quasar e ao <html lang="">
  Quasar.lang.set(PACKS[initial])
  document.documentElement.setAttribute('lang', htmlLang(initial))

  // atalho global para trocar idioma nos componentes
  app.config.globalProperties.$setLocale = setLocale
})
