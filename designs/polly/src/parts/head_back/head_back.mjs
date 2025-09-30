import { pctBasedOn } from '@freesewing/core'
import { draft_path127 } from './paths/draft_path127.mjs'

function draftPollyHead_back({
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
  draft_path127(Path, Point, paths, points, measurements, options, utils, macro, part)

  return part
}

export const head_back = {
  name: 'polly.head_back',
  draft: draftPollyHead_back,

  measurements: [
    // Enter the measurements your design needs here. See https://freesewing.dev/reference/measurements .
  ],
  options: {
    totalsize: { pct: 25, min: 5, max: 200, menu: 'scale' },
  },
}
