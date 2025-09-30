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
}) {
  draft_path93(Path, Point, paths, points, measurements, options, utils, macro, part)

  return part
}

export const arm_top = {
  name: 'Polly.arm_top',
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
