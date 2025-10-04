import { pctBasedOn } from '@freesewing/core'
import { draft_path127 } from './paths/draft_path127.mjs'

import { arm_top } from '../arm_top/arm_top.mjs'
import { body_back } from '../body_back/body_back.mjs'

function draftPollyHead_back({
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
  log,
  store,
}) {
  draft_path127(Path, Point, paths, points, measurements, options, utils, macro, part, log, store)

  points.title = points.headTip_ep.shiftFractionTowards(points.neckOuter_ep, 0.5)
  macro('title', { at: points.title, nr: 8, title: 'head_back', scale: options.totalSize })

  macro('pd', {
    path: paths.neckCurve.reverse(),
    id: 'neckCurvePd',
    d: 10,
  })

  if (sa) {
    paths.saBasis = paths.path127
    paths.sa = paths.saBasis.offset(sa).trim().attr('class', 'fabric sa')
  }

  return part
}

export const head_back = {
  name: 'polly.head_back',
  draft: draftPollyHead_back,
  after: [arm_top, body_back],
  measurements: [
    // Enter the measurements your design needs here. See https://freesewing.dev/reference/measurements .
  ],
  options: {
    headScale: { pct: 100, min: 50, max: 200, menu: 'style' },
  },
}
