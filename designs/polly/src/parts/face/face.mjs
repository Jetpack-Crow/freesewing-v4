import { draft_face_mirrored } from './paths/draft_face_mirrored.mjs'
import { draft_face_split } from './paths/draft_face_split.mjs'

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
  if (options.faceMirrored) {
    draft_face_mirrored(Path, Point, paths, points, measurements, options, utils, macro, part)
    macro('mirror', {
      clone: true,
      mirror: [points.headTopCenter, points.neckCenter],
      paths: Object.keys(paths),
    })
    paths.saBasis = paths.face_path.join(paths.mirroredFace_path.reverse()).hide()
  } else {
    draft_face_split(Path, Point, paths, points, measurements, options, utils, macro, part)
    paths.saBasis = paths.face_path.reverse().hide()
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

  measurements: [
    // Enter the measurements your design needs here. See https://freesewing.dev/reference/measurements .
  ],
  options: {
    faceMirrored: {
      bool: true,
      label: 'Face on the fold',
      menu: 'construction',
    },
  },
}
