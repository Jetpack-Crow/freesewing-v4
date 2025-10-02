import { pctBasedOn } from '@freesewing/core'
import { draft_path128 } from './paths/draft_path128.mjs'

function draftPollyLeg({
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
  sa,
}) {
  draft_path128(Path, Point, paths, points, measurements, options, utils, macro, part, store)

  points.title = points.legEndRight_ep.shiftFractionTowards(points.legTopLeft_ep, 0.5)
  macro('title', { at: points.title, nr: 3, title: 'leg', scale: options.totalSize })

  if (sa) {
    paths.saBasis = paths.path128
    paths.sa = paths.saBasis.offset(sa).attr('class', 'fabric sa')
  }

  return part
}

export const leg = {
  name: 'polly.leg',
  draft: draftPollyLeg,

  measurements: [
    // Enter the measurements your design needs here. See https://freesewing.dev/reference/measurements .
  ],
  options: {
    legFlare: {
      pct: 100,
      min: 20,
      max: 200,
      menu: 'style',
    },
    legLength: {
      pct: 100,
      min: 50,
      max: 150,
      menu: 'style',
    },
  },
}
