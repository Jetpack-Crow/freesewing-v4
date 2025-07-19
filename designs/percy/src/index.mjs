import { Design, mergeI18n } from '@freesewing/core'
import { i18n as titanI18n } from '@freesewing/titan'
import { i18n as percyI18n } from '../i18n/index.mjs'
import { front } from './front.mjs'
import { back } from './back.mjs'
import about from '../about.json' with { type: 'json' }

// Setup our new design
const Percy = new Design({
  data: about,
  parts: [front, back],
})

// Merge translations
const i18n = mergeI18n([titanI18n, percyI18n])

// Named exports
export { front, back, Percy, i18n, about }
