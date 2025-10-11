import { draft_path2 } from './paths/draft_path2.mjs'

function draftPollyHairback({
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
  if (options.faceType != 'hairline') {
    return part
  }

  draft_path2(Path, Point, paths, points, measurements, options, utils, macro, part, store)

  macro('title', { at: points.title, nr: '8a', title: 'hairBack', scale: options.totalSize })

  if (sa) {
    paths.saBasis = paths.path2
    paths.sa = paths.saBasis.offset(sa).trim().attr('class', 'fabric sa')
  }

  return part
}

export const hairBack = {
  name: 'polly.hairBack',
  draft: draftPollyHairback,

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
