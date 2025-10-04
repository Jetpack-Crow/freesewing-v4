import { draft_face_mirrored } from './paths/draft_face_mirrored.mjs'
import { draft_face_split } from './paths/draft_face_split.mjs'

import { head_back } from '../head_back/head_back.mjs'

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
  log,
}) {
  if (options.faceType == 'mirrored') {
    draft_face_mirrored(Path, Point, paths, points, measurements, options, utils, macro, part, log)
    macro('mirror', {
      clone: true,
      mirror: [points.headTopCenter, points.neckCenter],
      paths: Object.keys(paths),
    })
    paths.saBasis = paths.face_path.join(paths.mirroredFace_path.reverse()).hide()
  } else if (options.faceType == 'split') {
    draft_face_split(Path, Point, paths, points, measurements, options, utils, macro, part, log)
    paths.saBasis = paths.face_path.reverse().hide()
  } else {
    //We're drafting the face with the snout, nothing more to do here
    return part
  }

  log.info('Face neck length is ' + paths.neck_path.length())

  points.title = points.neckCenter.shiftFractionTowards(points.headTopCenter, 0.5)
  macro('title', { at: points.title, nr: 7, title: 'face', scale: options.totalSize })
  if (sa) {
    paths.sa = paths.saBasis.offset(sa).trim().attr('class', 'fabric sa')
  }

  return part
}

export const face = {
  name: 'polly.face',
  draft: draftPollyFace,
  after: head_back,

  measurements: [
    // Enter the measurements your design needs here. See https://freesewing.dev/reference/measurements .
  ],
  options: {
    faceType: {
      menu: 'parts',
      dflt: 'split',
      list: ['split', 'mirrored', 'snout'],
    },
  },
}
