import { pctBasedOn, Store } from '@freesewing/core'
import { draft_armTopCurve } from './paths/draft_armTopCurve.mjs'
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
  draft_armTopCurve(Path, Point, paths, points, measurements, options, utils, macro, part, store)

  const raglanLength = store.get('raglanLengthFront')
  points.raglanNotch = paths.armCurve.reverse().shiftAlong(raglanLength)

  snippets.raglanNotch = new Snippet('notch', points.raglanNotch)
  snippets.bottom = new Snippet('bnotch', points.armBottom_ep)

  store.set('armVerticalLength', points.armBottom_ep.y - points.raglanNotch.y)

  store.set('armTopCurve', paths.armCurve.length() - raglanLength)

  paths.lowerArmCurve = paths.armCurve.split(points.raglanNotch)[0]
  paths.raglanCurve = paths.armCurve.split(points.raglanNotch)[1]

  macro('pd', {
    id: 'lowerArmCurve',
    path: paths.lowerArmCurve.reverse(),
    //d: 15,
  })

  macro('mirror', {
    clone: true,
    mirror: [points.neckCenter_ep, points.armBottom_ep],
    paths: Object.keys(paths),
  })

  if (options.helpText) {
    paths.raglanCurve = paths.raglanCurve.reverse()
    macro('banner', {
      id: 'seamAlignE',
      path: paths.raglanCurve,
      text: 'polly:seamAlignE',
      spaces: 2,
    })

    macro('banner', {
      id: 'seamAlignF',
      path: paths.mirroredRaglanCurve,
      text: 'polly:seamAlignF',
      spaces: 2,
    })
  }

  points.backRaglanNotch = paths.mirroredArmCurve.reverse().shiftAlong(raglanLength)
  snippets.backRaglanNotch = new Snippet('bnotch', points.backRaglanNotch)

  if (sa) {
    paths.saBasis = paths.armTopCurve.join(paths.mirroredArmTopCurve.reverse()).reverse()
    paths.sa = paths.saBasis.offset(sa).trim().attr('class', 'fabric sa')
  }

  points.title = points.neckCenter_ep.shiftFractionTowards(points.armBottom_ep, 0.5)
  macro('title', { at: points.title, nr: 6, title: 'arm_top', scale: options.totalSize })

  macro('pd', {
    id: 'neckCurveJoined',
    path: paths.neckCurve.join(paths.mirroredNeckCurve.reverse()),
    ////d: 15,
  })

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
