import { pctBasedOn } from '@freesewing/core'
import { draft_path93 } from './paths/draft_path93.mjs'

function draftPollyArm_top({
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
  draft_path93(Path, Point, paths, points, measurements, options, utils, macro, part)

  macro('mirror', {
    clone: true,
    mirror: [points.neckCenter_ep, points.armBottom_ep],
    paths: Object.keys(paths),
  })

  if (sa) {
    paths.saBasis = paths.path93.join(paths.mirroredPath93.reverse()).reverse()
    paths.sa = paths.saBasis.offset(sa).trim().attr('class', 'fabric sa')
  }

  points.title = points.neckCenter_ep.shiftFractionTowards(points.armBottom_ep, 0.5)
  macro('title', { at: points.title, nr: 5, title: 'arm_top', scale: options.totalSize })

  return part
}

export const arm_top = {
  name: 'polly.arm_top',
  draft: draftPollyArm_top,

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
