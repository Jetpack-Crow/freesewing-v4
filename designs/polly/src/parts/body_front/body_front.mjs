import { draft_body_front } from './paths/draft_body_front.mjs'

function draftPollyBody_front({
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
  log,
  Snippet,
  snippets,
}) {
  draft_body_front(
    Path,
    Point,
    paths,
    points,
    measurements,
    options,
    utils,
    macro,
    part,
    store,
    log
  )

  if (options.helpText) {
    paths.hipToCorner.unhide()
    macro('banner', {
      id: 'seamBetweenLegs',
      path: paths.hipToCorner,
      text: 'polly:seamBetweenLegs',
      spaces: 2,
    })

    paths.cornerToSide = paths.hipCurve.split(points.hipCorner_ep)[1]
    macro('banner', {
      id: 'seamLegsFront',
      path: paths.cornerToSide,
      text: 'polly:seamLegsFront',
      spaces: 2,
    })

    paths.armpitCurve.unhide()
    macro('banner', {
      id: 'seamArmscye',
      path: paths.armpitCurve,
      text: 'polly:seamArmscye',
      spaces: 2,
    })

    paths.raglanLength = new Path().move(points.armpitNotch_ep).line(points.neckOuter_ep)
    macro('banner', {
      id: 'seamRaglanFront',
      path: paths.raglanLength,
      text: 'polly:seamRaglanFront',
      spaces: 2,
    })
  }

  snippets.hipCornerNotch = new Snippet('notch', points.hipCorner_ep)
  snippets.armpitNotch = new Snippet('notch', points.armpitNotch_ep)

  macro('pd', {
    id: 'armpitCurveLength',
    path: paths.armpitCurve.reverse(),
    //d: 15,
  })

  macro('mirror', {
    clone: true,
    mirror: [points.neckCenter_ep, points.crotchCenter],
    paths: Object.keys(paths),
  })

  points.armpitNotchMirrored = paths.mirroredArmpitCurve.end()
  snippets.armpitNotchMirrored = new Snippet('notch', points.armpitNotchMirrored)

  points.hipNotchMirrored = paths.mirroredHipToCorner.end()
  snippets.hipNotchMirrored = new Snippet('notch', points.hipNotchMirrored)

  if (sa) {
    paths.saBasis = paths.path190.join(paths.mirroredPath190.reverse())
    paths.sa = paths.saBasis.offset(sa).trim().attr('class', 'fabric sa')
  }

  points.title = points.neckCenter_ep.shiftFractionTowards(points.crotchCenter, 0.5)
  macro('title', { at: points.title, nr: 1, title: 'body_front', scale: options.totalSize })

  macro('pd', {
    id: 'neckCurveJoined',
    path: paths.neckCurve.join(paths.mirroredNeckCurve.reverse()).reverse(),
    ////d: 15,
  })

  return part
}

export const body_front = {
  name: 'polly.body_front',
  draft: draftPollyBody_front,

  measurements: [
    // Enter the measurements your design needs here. See https://freesewing.dev/reference/measurements .
  ],
  options: {
    hipExtraWidth: {
      pct: 0,
      min: 0,
      max: 50,
      label: 'Hip extra width',
      menu: 'style',
    },
    torsoLength: {
      pct: 0,
      min: -50,
      max: 50,
      label: 'Torso length',
      menu: 'style',
    },
    totalSize: {
      pct: 37.5,
      min: 5,
      max: 200,
      menu: 'scale',
      toAbs: function (value, settings) {
        return 813 * value
      },
    },
    helpText: { bool: false, menu: 'help' },
  },
}
