import { pctBasedOn } from '@freesewing/core'
import { draft_path127 } from './paths/draft_path127.mjs'

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
}) {
  draft_path127(Path, Point, paths, points, measurements, options, utils, macro, part)

  points.title = points.headTip_ep.shiftFractionTowards(points.neckOuter_ep, 0.5)
  macro('title', { at: points.title, nr: 8, title: 'head_back', scale: options.totalSize })

  if (sa) {
    paths.saBasis = paths.path127
    paths.sa = paths.saBasis.offset(sa).trim().attr('class', 'fabric sa')
  }

  return part
}

export const head_back = {
  name: 'polly.head_back',
  draft: draftPollyHead_back,

  measurements: [
    // Enter the measurements your design needs here. See https://freesewing.dev/reference/measurements .
  ],
  options: {
    totalSize: { pct: 25, min: 5, max: 200, menu: 'scale' },
  },
}
