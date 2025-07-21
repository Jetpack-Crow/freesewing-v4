import { front } from './front.mjs'

function draftPercyPocket({
  points,
  Point,
  paths,
  Path,
  options,
  complete,
  measurements,
  store,
  macro,
  utils,
  snippets,
  Snippet,
  sa,
  log,
  part,
}) {
  paths.shortOutseam.unhide()
  paths.waist.unhide()
  paths.pocketCutout.setClass('note help')

  const pocketDepth =
    (measurements.waistToKnee -
      options.waistbandWidth * measurements.waistToFloor -
      (1 - options.waistHeight) * measurements.waistToHips) *
    options.pocketDepth

  points.pocketSideSeamIntercept = paths.shortOutseam.shiftAlong(pocketDepth)
  //snippets['pocketSideSeamIntercept'] = new Snippet('notch', points.pocketSideSeamIntercept)

  points.pocketInnerCorner = points.pocketFacingEdge.shift(
    points.styleWaistOut.angle(points.styleWaistIn) - 90,
    pocketDepth
  )
  //snippets['pocketInnerCorner'] = new Snippet('notch', points.pocketInnerCorner)

  points.pocketSideSeamInterceptHalfway = points.pocketSideSeamIntercept.shiftFractionTowards(
    points.pocketInnerCorner,
    options.pocketCurveControl
  )
  points.pocketSideSeamInterceptCp1 = points.pocketSideSeamInterceptHalfway.shiftFractionTowards(
    points.pocketInnerCorner,
    options.pocketCurveControl
  )
  points.pocketFacingEdgeHalfway = points.pocketFacingEdge.shiftFractionTowards(
    points.pocketInnerCorner,
    options.pocketCurveControl
  )
  points.pocketFacingEdgeCp2 = points.pocketFacingEdgeHalfway.shiftFractionTowards(
    points.pocketInnerCorner,
    options.pocketCurveControl
  )

  paths.pocketBottomEdge = new Path()
    .move(points.pocketSideSeamIntercept)
    .line(points.pocketSideSeamInterceptHalfway)
    .curve(
      points.pocketSideSeamInterceptCp1,
      points.pocketFacingEdgeCp2,
      points.pocketFacingEdgeHalfway
    )
    .line(points.pocketFacingEdge)

  delete paths.seam
  delete paths.shortHem
  delete paths.shortInseam
  delete paths.hint
  delete paths.crotchseam
  delete snippets['opening_notch']
  delete snippets['logo']

  paths.outseamTop = paths.shortOutseam.split(points.pocketSideSeamIntercept)[0]
  delete paths.shortOutseam
  delete paths.trimmedOutseam

  delete paths.trimmedWaist

  paths.pocketWaistEdge = paths.waist.split(points.pocketFacingEdge)[1]
  delete paths.waist

  paths.seam = paths.pocketWaistEdge.join(paths.outseamTop).join(paths.pocketBottomEdge).close()
  if (sa) {
    paths.saBase = paths.seam
    paths.sa = paths.saBase.offset(sa).setClass('sa')
  }
  if (paths.hemBase) delete paths.hemBase

  points.titleAnchor = points.styleWaistOut.shiftFractionTowards(points.pocketInnerCorner, 0.5)
  macro('title', {
    nr: 7,
    title: 'pocket',
    at: points.titleAnchor,
  })

  return part
}

export const pocket = {
  name: 'percy.pocket',
  measurements: [],
  from: front,
  options: {
    pocketDepth: {
      pct: 50,
      max: 60,
      min: 10,
      menu: 'style',
    },
    pocketCurveControl: {
      pct: 50,
      max: 100,
      min: 10,
      menu: 'style.panel.advanced',
    },
  },
  draft: draftPercyPocket,
}
