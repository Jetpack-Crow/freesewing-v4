import { pctBasedOn } from '@freesewing/core'
import { draft_path190 } from './paths/draft_path190.mjs'

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
}) {
  draft_path190(Path, Point, paths, points, measurements, options, utils, macro, part)

  return part
}

export const body_front = {
  name: 'polly.body_front',
  draft: draftPollyBody_front,

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
