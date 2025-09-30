import { Design } from '@freesewing/core'
import about from '../about.json' with { type: 'json' }
import { box } from './box.mjs'

import { head_back } from './parts/head_back/head_back.mjs'
import { face } from './parts/face/face.mjs'
import { body_back } from './parts/body_back/body_back.mjs'
import { body_front } from './parts/body_front/body_front.mjs'
import { arm_bottom } from './parts/arm_bottom/arm_bottom.mjs'
import { arm_top } from './parts/arm_top/arm_top.mjs'
import { leg } from './parts/leg/leg.mjs'
import { foot } from './parts/foot/foot.mjs'

import { i18n } from '../i18n/index.mjs'

// Setup our new design
const Polly = new Design({
  data: about,
  parts: [box, head_back, face, body_back, body_front, arm_bottom, arm_top, leg, foot],
})

// Named exports
export {
  box,
  head_back,
  face,
  body_back,
  body_front,
  arm_bottom,
  arm_top,
  leg,
  foot,
  Polly,
  i18n,
  about,
}
