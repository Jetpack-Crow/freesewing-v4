import { draft_path4 } from './paths/draft_path4.mjs'
import { faceForelock } from '../faceForelock/faceForelock.mjs'

import { arm_top } from '../../arm_top/arm_top.mjs'
import { body_back } from '../../body_back/body_back.mjs'

function draftPollyNeckback({
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
}) {
  if (options.faceType != 'hairline') {
    return part
  }

  draft_path4(Path, Point, paths, points, measurements, options, utils, macro, part, store, log)

  macro('title', { at: points.title, nr: '8b', title: 'neckBack', scale: options.totalSize * 0.5 })

  return part
}

export const neckBack = {
  name: 'Polly.neckBack',
  draft: draftPollyNeckback,
  after: [arm_top, body_back, faceForelock],

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
