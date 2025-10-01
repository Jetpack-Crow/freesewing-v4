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
  sa,
}) {
  draft_path190(Path, Point, paths, points, measurements, options, utils, macro, part)

  paths.mirror = new Path().move(points.neckCenter_ep).line(points.crotchCenter).hide()

  macro('mirror', {
    clone: true,
    mirror: [points.neckCenter_ep, points.crotchCenter],
    paths: Object.keys(paths),
  })

  if (sa) {
    paths.saBasis = paths.path190.join(paths.mirroredPath190.reverse())
    paths.sa = paths.saBasis.offset(sa).trim().attr('class', 'fabric sa')
  }

  points.title = points.neckCenter_ep.shiftFractionTowards(points.crotchCenter, 0.5)
  macro('title', { at: points.title, nr: 1, title: 'body_front', scale: options.totalSize })

  console.log({
    points: JSON.parse(JSON.stringify(points)),
    paths: JSON.parse(JSON.stringify(paths)),
  })

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
