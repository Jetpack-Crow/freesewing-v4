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
}) {
  draft_path85(Path, Point, paths, points, measurements, options, utils, macro, part)

  return part
}

export const body_back = {
  name: 'Polly.body_back',
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
