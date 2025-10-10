import { draft_path6 } from './paths/draft_path6.mjs'

function draftPollyFaceforelock({
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
}) {
  if (options.faceType != 'hairline') {
    return part
  }

  draft_path6(Path, Point, paths, points, measurements, options, utils, macro, part, store)

  return part
}

export const faceForelock = {
  name: 'Polly.faceForelock',
  draft: draftPollyFaceforelock,

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
