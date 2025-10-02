import { pctBasedOn, Store } from '@freesewing/core'
import { draft_path93 } from './paths/draft_path93.mjs'
import { body_front } from '../body_front/body_front.mjs'

function draftPollyArm_top({
  Path,
  Point,
  paths,
  points,
  measurements,
  options,
  utils,
  macro,
  part,
  sa,
  store,
  Snippet,
  snippets,
}) {
  draft_path93(Path, Point, paths, points, measurements, options, utils, macro, part)

  const raglanLength = store.get('raglanLengthFront')
  points.raglanNotch = paths.armCurve.reverse().shiftAlong(raglanLength)

  snippets.raglanNotch = new Snippet('notch', points.raglanNotch)

  store.set('armVerticalLength', points.armBottom_ep.y - points.raglanNotch.y)

  store.set('armTopCurve', paths.armCurve.length() - raglanLength)

  paths.lowerArmCurve = paths.armCurve.split(points.raglanNotch)[0]

  macro('pd', {
    path: paths.lowerArmCurve.reverse(),
    d: 15,
  })

  macro('mirror', {
    clone: true,
    mirror: [points.neckCenter_ep, points.armBottom_ep],
    paths: Object.keys(paths),
  })

  snippets.backRaglanNotch = new Snippet('notch', points.raglanNotch)

  if (sa) {
    paths.saBasis = paths.path93.join(paths.mirroredPath93.reverse()).reverse()
    paths.sa = paths.saBasis.offset(sa).trim().attr('class', 'fabric sa')
  }

  points.title = points.neckCenter_ep.shiftFractionTowards(points.armBottom_ep, 0.5)
  macro('title', { at: points.title, nr: 5, title: 'arm_top', scale: options.totalSize })

  return part
}

export const arm_top = {
  name: 'polly.arm_top',
  draft: draftPollyArm_top,
  after: body_front,

  measurements: [
    // Enter the measurements your design needs here. See https://freesewing.dev/reference/measurements .
  ],
  options: {
    armLength: {
      pct: 100,
      min: 50,
      max: 200,
      label: 'Arm length',
      menu: 'style',
    },
  },
}
