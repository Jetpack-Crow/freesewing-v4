import { pctBasedOn } from '@freesewing/core'
import { draft_path38 } from './paths/draft_path38.mjs'

function draftPollyFoot({ Path, Point, paths, points, measurements, options, utils, macro, part }) {
  draft_path38(Path, Point, paths, points, measurements, options, utils, macro, part)

  return part
}

export const foot = {
  name: 'polly.foot',
  draft: draftPollyFoot,

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
