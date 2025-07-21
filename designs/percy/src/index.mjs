import { Design, mergeI18n } from '@freesewing/core'
import { i18n as titanI18n } from '@freesewing/titan'
import { i18n as percyI18n } from '../i18n/index.mjs'
import { front } from './front.mjs'
import { back } from './back.mjs'
import { waist_front } from './waist_front.mjs'
import { waist_side } from './waist_side.mjs'
import { waist_back } from './waist_back.mjs'
import { cuff } from './cuff.mjs'
import { pocket } from './pocket.mjs'
import { pocket_facing } from './pocket_facing.mjs'
import about from '../about.json' with { type: 'json' }

// Setup our new design
const Percy = new Design({
  data: about,
  parts: [front, back, cuff, waist_front, waist_side, waist_back, pocket, pocket_facing],
})

// Merge translations
const i18n = mergeI18n([titanI18n, percyI18n])

// Named exports
export {
  front,
  back,
  cuff,
  waist_front,
  waist_side,
  waist_back,
  pocket,
  pocket_facing,
  Percy,
  i18n,
  about,
}
