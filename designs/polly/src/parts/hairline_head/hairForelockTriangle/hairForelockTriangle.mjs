import { draft_path3 } from './paths/draft_path3.mjs'
import { faceForelock } from '../faceForelock/faceForelock.mjs'

function draftPollyHairforelocktriangle({
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
  log,
}) {
  if (options.faceType != 'hairline') {
    return part
  }

  draft_path3(Path, Point, paths, points, measurements, options, utils, macro, part, store, log)

  return part
}

export const hairForelockTriangle = {
  name: 'Polly.hairForelockTriangle',
  draft: draftPollyHairforelocktriangle,
  after: faceForelock,

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
