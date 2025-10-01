import { pctBasedOn } from '@freesewing/core'
import { draft_path254 } from './paths/draft_path254.mjs'

function draftPollyFace({ Path, Point, paths, points, measurements, options, utils, macro, part }) {
  draft_path254(Path, Point, paths, points, measurements, options, utils, macro, part)

  macro('mirror', {
    clone: true,
    mirror: [points.faceTop_ep, points.chinCenter],
    paths: Object.keys(paths),
  })

  return part
}

export const face = {
  name: 'polly.face',
  draft: draftPollyFace,

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
