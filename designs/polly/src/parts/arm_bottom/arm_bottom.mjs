import { pctBasedOn } from '@freesewing/core'
import { draft_path64 } from './paths/draft_path64.mjs'

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
}) {
  draft_path64(Path, Point, paths, points, measurements, options, utils, macro, part)

  return part
}

export const arm_bottom = {
  name: 'polly.arm_bottom',
  draft: draftPollyArm_bottom,

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
