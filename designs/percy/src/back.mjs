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
  const originalHemLength = paths.shortshem.length()
  store.set('original_hem_back', originalHemLength)

  paths.newInseam = paths.inseam.split(points.inseamShiftUpwards)[0]
  paths.newOutseam = paths.outseam.split(points.outseamShiftUpwards)[1]

  paths.waist = new Path().move(points.styleWaistIn).line(points.styleWaistOut).setClass('various')

  if (options.spread) {
    points.hemcenter = points.outseamShiftUpwards.shiftFractionTowards(
      points.inseamShiftUpwards,
      0.5
    )

    points.waistcenter = points.styleWaistOut.shiftFractionTowards(points.styleWaistIn, 0.5)
    const rotationradius = points.hemcenter.dist(points.waistcenter)
    const targethemlength = originalHemLength * options.hemRatio

    const totalRotationAmount = (50 * (targethemlength - originalHemLength)) / rotationradius

    const rotationAmount = Math.min(totalRotationAmount, 90) / options.slashIterations

    //Slash and spread time
    let slashPointsHem = []
    let slashPointsWaist = []

    //Define all the initial cut points
    for (let i = 1; i <= options.slashIterations; i++) {
      log.info('slash point ' + i + ' of ' + options.slashIterations)

      points['slashPointsHem' + i] = points.outseamShiftUpwards.shiftFractionTowards(
        points.inseamShiftUpwards,
        1 - i / (Number(options.slashIterations) + 1)
      )

      slashPointsHem.push(points['slashPointsHem' + i])

      points['slashPointsWaist' + i] = points.styleWaistOut.shiftFractionTowards(
        points.styleWaistIn,
        1 - i / (Number(options.slashIterations) + 1)
      )
      slashPointsWaist.push(points['slashPointsWaist' + i])
    }

    let slashPointsInner = slashPointsHem.slice()

    const outseamRotatePoints = [
      'styleWaistOut',
      'waistOut',
      'seatOutCp1',
      'seatOutCp2',
      'seatOut',
      'seatY',
      'upperLegY',
      'outseamShiftUpwards',
    ]

    for (let i = 0; i < options.slashIterations; i++) {
      //Rotate all the waist points to the left of the active point
      for (let j = i; j < options.slashIterations; j++) {
        slashPointsWaist[j] = slashPointsWaist[j].rotate(rotationAmount, slashPointsWaist[i])
      }

      //Rotate all the hem points to the left of the active point
      for (let j = i; j < options.slashIterations; j++) {
        slashPointsHem[j] = slashPointsHem[j].rotate(rotationAmount, slashPointsWaist[i])
      }

      for (let j = i + 1; j < options.slashIterations; j++) {
        slashPointsInner[j] = slashPointsInner[j].rotate(rotationAmount, slashPointsWaist[i])
      }

      //rotate the inseam
      paths.newOutseam = paths.newOutseam.rotate(rotationAmount, slashPointsWaist[i])
      //paths.hint = paths.hint.rotate(rotationAmount, slashPointsWaist[i]).setClass('note help')
      for (let p of outseamRotatePoints) {
        points[p] = points[p].rotate(rotationAmount, slashPointsWaist[i])
      }
    }

    //draw the slash point snippets after all the rotation
    /*
    snippets['button_0'] = new Snippet('button', slashPointsHem[0]).scale(2)
    for (let b in slashPointsHem) {
      snippets[b + '_button'] = new Snippet('button', slashPointsHem[b])
    }

    snippets['notch_0'] = new Snippet('notch', slashPointsWaist[0]).scale(2)
    for (let c in slashPointsWaist) {
      snippets[c + '_notch'] = new Snippet('notch', slashPointsWaist[c])
    }
    for (let c in slashPointsInner) {
      snippets[c + '_notch'] = new Snippet('notch', slashPointsInner[c]).scale(0.5)
    }
    */

    //draw the new curved waist
    paths.waist = new Path().move(points.styleWaistIn).setClass('various')
    for (let c in slashPointsWaist) {
      paths.waist = paths.waist.line(slashPointsWaist[c])
    }
    paths.waist = paths.waist.line(points.styleWaistOut)

    paths.shortshem = new Path().move(points.inseamShiftUpwards).setClass('various')
    for (let i = 0; i < options.slashIterations; i++) {
      paths.shortshem = paths.shortshem.line(slashPointsInner[i]).line(slashPointsHem[i])
    }
  }

  store.set('back_waist_width', paths.waist.length())

  let waistIn = points.styleWaistIn || points.waistIn
  paths.seam = paths.newInseam
    .join(paths.shortshem)
    .join(paths.newOutseam)
    .join(paths.waist.reverse())
    .line(points.crossSeamCurveStart)
    .curve(points.crossSeamCurveCp1, points.crossSeamCurveCp2, points.fork)
    .close()

  if (sa) {
    paths.saBase = paths.seam.offset(sa).hide()
    paths.sa = paths.saBase.offset(sa).setClass('sa')
  }

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
