import { draft_path3 } from './paths/draft_path3.mjs'

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
  sa,
}) {
  if (options.faceType != 'hairline') {
    return part
  }

  draft_path3(Path, Point, paths, points, measurements, options, utils, macro, part, store, log)

  macro('title', {
    at: points.title,
    nr: '7a',
    title: 'hairForelockTriangle',
    scale: options.totalSize * 1,
  })

  if (sa) {
    paths.saBasis = paths.path3
    paths.sa = paths.saBasis.offset(sa).attr('class', 'fabric sa')
  }

  return part
}

export const hairForelockTriangle = {
  name: 'polly.hairForelockTriangle',
  draft: draftPollyHairforelocktriangle,

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
