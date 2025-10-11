import { draft_path6 } from './paths/draft_path6.mjs'

import { neckBack } from '../neckBack/neckBack.mjs'

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
  log,
  sa,
}) {
  if (options.faceType != 'hairline') {
    return part
  }

  draft_path6(Path, Point, paths, points, measurements, options, utils, macro, part, store, log)

  macro('title', { at: points.title, nr: '7b', title: 'faceForelock', scale: options.totalSize })

  if (sa) {
    paths.saBasis = paths.path6
    paths.sa = paths.saBasis.offset(sa).trim().attr('class', 'fabric sa')
  }

  return part
}

export const faceForelock = {
  name: 'polly.faceForelock',
  draft: draftPollyFaceforelock,
  after: neckBack,

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
