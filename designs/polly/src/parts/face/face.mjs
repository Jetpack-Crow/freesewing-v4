import { draft_path254 } from './paths/draft_path254.mjs'

function draftPollyFace({
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
  draft_path254(Path, Point, paths, points, measurements, options, utils, macro, part)

  macro('mirror', {
    clone: true,
    mirror: [points.faceTop_ep, points.chinCenter],
    paths: Object.keys(paths),
  })

  points.title = points.chinCenter.shiftFractionTowards(points.faceTop_ep, 0.5)
  macro('title', { at: points.title, nr: 7, title: 'face', scale: options.totalSize })

  if (sa) {
    paths.saBasis = paths.path254.join(paths.mirroredPath254.reverse())
    paths.sa = paths.saBasis.offset(sa).trim().attr('class', 'fabric sa')
  }

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
