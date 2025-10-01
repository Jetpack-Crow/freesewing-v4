import { pctBasedOn } from '@freesewing/core'
import { draft_path85 } from './paths/draft_path85.mjs'

function draftPollyBody_back({
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
  draft_path85(Path, Point, paths, points, measurements, options, utils, macro, part)

  points.title = points.armpitBottom_ep.shiftFractionTowards(points.crotchCenter_ep, 0.5)
  macro('title', { at: points.title, nr: 2, title: 'body_back', scale: options.totalSize })

  if (sa) {
    paths.saBasis = paths.path85.reverse()
    paths.sa = paths.saBasis.offset(sa).attr('class', 'fabric sa')
  }

  return part
}

export const body_back = {
  name: 'polly.body_back',
  draft: draftPollyBody_back,

  measurements: [
    // Enter the measurements your design needs here. See https://freesewing.dev/reference/measurements .
  ],
  options: {
    // Enter your pattern options here. Example:
    /*
        extraLength: {
            pct: 10,
            min: 5,
            max: 20,
            label: 'Extra length',
            menu: 'fit',
            ...pctBasedOn('neck')
        }
        */
  },
}
