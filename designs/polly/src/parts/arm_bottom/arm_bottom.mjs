import { pctBasedOn } from '@freesewing/core'
import { draft_path64 } from './paths/draft_path64.mjs'
import { body_front } from '../body_front/body_front.mjs'
import { arm_top } from '../arm_top/arm_top.mjs'

function draftPollyArm_bottom({
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
  store,
  log,
}) {
  draft_path64(Path, Point, paths, points, measurements, options, utils, macro, part, store, log)

  macro('pd', {
    path: paths.armCurvePath.reverse(),
    //d: 15,
  })

  macro('mirror', {
    clone: true,
    mirror: [points.armpitCenter_ep, points.curveBottom],
    paths: Object.keys(paths),
  })

  if (sa) {
    paths.saBasis = paths.path64.join(paths.mirroredPath64.reverse()).reverse()
    paths.sa = paths.saBasis.offset(sa).attr('class', 'fabric sa')
  }

  points.title = points.armpitCenter_ep.shiftFractionTowards(points.curveBottom, 0.5)
  macro('title', { at: points.title, nr: 6, title: 'arm_bottom', scale: options.totalSize })

  return part
}

export const arm_bottom = {
  name: 'polly.arm_bottom',
  draft: draftPollyArm_bottom,
  after: [body_front, arm_top],

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
