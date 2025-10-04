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

  paths.mirror = new Path().move(points.neckCenter_ep).line(points.crotchCenter).hide()

  snippets.hipCornerNotch = new Snippet('notch', points.hipCorner_ep)

  macro('mirror', {
    clone: true,
    mirror: [points.neckCenter_ep, points.crotchCenter],
    paths: Object.keys(paths),
  })

  if (sa) {
    paths.saBasis = paths.path190.join(paths.mirroredPath190.reverse())
    paths.sa = paths.saBasis.offset(sa).trim().attr('class', 'fabric sa')
  }

  points.title = points.neckCenter_ep.shiftFractionTowards(points.crotchCenter, 0.5)
  macro('title', { at: points.title, nr: 1, title: 'body_front', scale: options.totalSize })

  macro('pd', {
    path: paths.armpitCurve.reverse(),
    //d: 15,
  })

  macro('pd', {
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
    totalSize: { pct: 25, min: 5, max: 200, menu: 'scale' },
  },
}
