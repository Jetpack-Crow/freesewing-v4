import { front, back as titanBack } from '@freesewing/titan'

function draftPercyBack({
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
  /*
   * Helper method to draw the inseam path
   */
  const drawInseam = () =>
    options.fitKnee
      ? new Path()
          .move(points.fork)
          .curve(points.forkCp2, points.kneeInCp1, points.kneeIn)
          .line(points.floorIn)
      : new Path().move(points.fork).curve(points.forkCp2, points.kneeInCp1, points.floorIn)
  /*
   * Helper method to draw the outseam path
   */
  const drawOutseam = () => {
    let waistOut = points.styleWaistOut || points.waistOut
    if (options.fitKnee) {
      if (points.waistOut.x > points.seatOut.x)
        return new Path()
          .move(points.floorOut)
          .line(points.kneeOut)
          .curve(points.kneeOutCp2, points.seatOut, waistOut)
      else
        return new Path()
          .move(points.floorOut)
          .line(points.kneeOut)
          .curve(points.kneeOutCp2, points.seatOutCp1, points.seatOut)
          .curve_(points.seatOutCp2, waistOut)
    } else {
      if (points.waistOut.x > points.seatOut.x)
        return new Path().move(points.floorOut).curve(points.kneeOutCp2, points.seatOut, waistOut)
      else
        return new Path()
          .move(points.floorOut)
          .curve(points.kneeOutCp2, points.seatOutCp1, points.seatOut)
          .curve_(points.seatOutCp2, waistOut)
    }
  }

  paths.outseam = drawOutseam().setClass('lining').hide()
  paths.inseam = drawInseam().setClass('lining').hide()

  points.inseamShiftUpwards = paths.inseam.shiftFractionAlong(options.inseamPercent)
  const inseamShiftAmount = paths.inseam.length() * (1 - options.inseamPercent)
  const seamLengthDifference = 0

  points.outseamShiftUpwards = paths.outseam.shiftAlong(inseamShiftAmount + seamLengthDifference)

  paths.shortshem = new Path().move(points.inseamShiftUpwards).line(points.outseamShiftUpwards)

  paths.newInseam = paths.inseam.split(points.inseamShiftUpwards)[0]
  paths.newOutseam = paths.outseam.split(points.outseamShiftUpwards)[1]

  let waistIn = points.styleWaistIn || points.waistIn
  paths.seam = paths.newInseam
    .line(points.outseamShiftUpwards)
    .join(paths.newOutseam)
    .line(waistIn)
    .line(points.crossSeamCurveStart)
    .curve(points.crossSeamCurveCp1, points.crossSeamCurveCp2, points.fork)
    .close()

  macro('rmGrainline', 'grainline')
  macro('rmScaleBox')

  return part
}

export const back = {
  from: titanBack,
  name: 'percy.back',
  hide: { from: true },
  //after: front,
  options: {},
  draft: draftPercyBack,
}
