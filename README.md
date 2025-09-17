# Gerenciador de Tarefas Frontend - Quasar (Vue 3 + Vite + vue-i18n)

O frontend é construído com Quasar Framework (Vue 3 + Pinia) e funciona como SPA (Single Page Application) que consome a API Laravel. Ele oferece:

- [x] 🔐 Autenticação integrada via cookies/Sanctum.
--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^
- [x] 📋 Dashboard Kanban interativo (drag-and-drop) para gerenciar tarefas em todo/doing/done.
--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^
- [x] 👥 Interface para equipes e atribuição de tarefas.
--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^
- [x] 🌐 Suporte multilíngue (en-US/pt-BR) com persistência da escolha de idioma.
--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^--^
- [x] 📅 Formulário de tarefas com datas adaptadas ao locale e alerta automático em feriados (via API de feriados).

## =================== ⚙️ Stack ===============
- Node 18+
- Quasar (Vue 3 + Vite)
- Axios (com cookies)
- vue-i18n (persistência + Quasar.lang)
- dayjs (datas por locale)

## ============ 🚀 Subir localmente ============

- instalar Quasar CLI globalmente ^(^^se^ ^ainda^ ^não^ ^tiver^^)^
```
npm install -g @quasar/cli

quasar dev   # http://localhost:9000
```

## ========== 🗣️ i18n + Quasar.lang ===========

- ##### Persiste locale em localStorage (en-US, pt-BR)

- ##### Sincroniza vue-i18n + Quasar.lang

- ##### 🗓️ Datas (locale-aware)
- [x] en-US → MM/DD/YYYY
- [x] pt-BR → DD/MM/YYYY

- ##### Conversão display ⇄ ISO com dayjs (parse estrito).


## ========= ✅ Teste rápido (feriado) ===========



## ============ 🐞 Troubleshooting ===============
CORS/CSRF → withCredentials: true, SANCTUM_STATEFUL_DOMAINS, SESSION_DOMAIN.

Idioma não persiste → checar localStorage e boot/i18n.js.

Máscara de data → revisar dateMask, displayToISO, isoToDisplay.