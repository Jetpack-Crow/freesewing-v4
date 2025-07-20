import { front as titanFront } from '@freesewing/titan'

function draftPercyFront({
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
   * Helper method to draw the outseam path
   */
  const drawOutseam = () => {
    let waistOut = points.styleWaistOut || points.waistOut
    if (options.fitKnee) {
      if (points.waistOut.x < points.seatOut.x)
        return new Path()
          .move(waistOut)
          .curve(points.seatOut, points.kneeOutCp1, points.kneeOut)
          .line(points.floorOut)
      else
        return new Path()
          .move(waistOut)
          ._curve(points.seatOutCp1, points.seatOut)
          .curve(points.seatOutCp2, points.kneeOutCp1, points.kneeOut)
          .line(points.floorOut)
    } else {
      if (points.waistOut.x < points.seatOut.x)
        return new Path().move(waistOut).curve(points.seatOut, points.kneeOutCp1, points.floorOut)
      else
        return new Path()
          .move(waistOut)
          ._curve(points.seatOutCp1, points.seatOut)
          .curve(points.seatOutCp2, points.kneeOutCp1, points.floorOut)
    }
  }

  /*
   * Helper method to draw the inseam path
   */
  const drawInseam = () =>
    options.fitKnee
      ? new Path()
          .move(points.floorIn)
          .line(points.kneeIn)
          .curve(points.kneeInCp2, points.forkCp1, points.fork)
      : new Path().move(points.floorIn).curve(points.kneeInCp2, points.forkCp1, points.fork)

  paths.outseam = drawOutseam().setClass('lining').hide()
  paths.inseam = drawInseam().setClass('lining').hide()

  points.inseamShiftUpwards = paths.inseam.shiftFractionAlong(1 - options.inseamPercent)
  const inseamShiftAmount = paths.inseam.length() * options.inseamPercent
  const seamLengthDifference = paths.outseam.length() - paths.inseam.length()

  points.outseamShiftUpwards = paths.outseam.shiftAlong(inseamShiftAmount + seamLengthDifference)

  paths.shortshem = new Path()
    .move(points.inseamShiftUpwards)
    .line(points.outseamShiftUpwards)
    .setClass('various')

  const originalHemLength = paths.shortshem.length()

  paths.newInseam = paths.inseam.split(points.inseamShiftUpwards)[1]
  paths.newOutseam = paths.outseam.split(points.outseamShiftUpwards)[0]

  paths.waist = new Path().move(points.styleWaistIn).line(points.styleWaistOut).setClass('lining')

  if (options.spread) {
    const rotationAmount = (options.angle * 100) / options.slashIterations

    //Slash and spread time
    let slashPointsHem = []
    let slashPointsWaist = []

    //Define all the initial cut points
    for (let i = 1; i <= options.slashIterations; i++) {
      log.info('slash point ' + i + ' of ' + options.slashIterations)

      points['slashPointsHem' + i] = points.outseamShiftUpwards.shiftFractionTowards(
        points.inseamShiftUpwards,
        i / (Number(options.slashIterations) + 1)
      )

      slashPointsHem.push(points['slashPointsHem' + i])

      points['slashPointsWaist' + i] = points.styleWaistOut.shiftFractionTowards(
        points.styleWaistIn,
        i / (Number(options.slashIterations) + 1)
      )
      slashPointsWaist.push(points['slashPointsWaist' + i])
    }

    let slashPointsInner = slashPointsHem.slice()

    const outseamRotatePoints = [
      'styleWaistOut',
      'seatOutCp1',
      'seatOut',
      'seatY',
      'upperLegY',
      'seatOutCp2',
      'outseamShiftUpwards',
    ]
    const inseamRotatePoints = [
      'styleWaistIn',
      'styleWaistInNoAngle',
      'crotchSeamCurveStart',
      'cfSeat',
      'cfWaist',
      'crotchSeamCurveCp2',
      'crotchSeamCurveMax',
      'crotchSeamCurveCp1',
      'fork',
      'forkCp1',
      'inseamShiftUpwards',
      'waistIn',
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
      paths.newInseam = paths.newInseam.rotate(rotationAmount, slashPointsWaist[i])
      paths.hint = paths.hint.rotate(rotationAmount, slashPointsWaist[i]).setClass('note help')
      for (let p of inseamRotatePoints) {
        points[p] = points[p].rotate(rotationAmount, slashPointsWaist[i])
      }
    }

    //draw the slash point snippets after all the rotation
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

    //draw the new curved waist
    paths.waist = new Path().move(points.styleWaistOut)
    for (let c in slashPointsWaist) {
      paths.waist = paths.waist.line(slashPointsWaist[c])
    }
    paths.waist = paths.waist.line(points.styleWaistIn).reverse().hide()

    paths.shortshem = new Path().move(points.outseamShiftUpwards).setClass('various')
    for (let i = 0; i < options.slashIterations; i++) {
      paths.shortshem = paths.shortshem.line(slashPointsInner[i]).line(slashPointsHem[i])
    }
  }

  //draw the seam
  let waistIn = points.styleWaistIn || points.waistIn
  let waistOut = points.styleWaistOut || points.waistOut
  paths.seam = paths.newOutseam
    .join(paths.shortshem)
    .join(paths.newInseam)
    .curve(points.crotchSeamCurveCp1, points.crotchSeamCurveCp2, points.crotchSeamCurveStart)
    .line(waistIn)
    .join(paths.waist)
    .close()

  macro('rmGrainline', 'grainline')
  return part
}

export const front = {
  from: titanFront,
  name: 'percy.front',
  hide: { from: true },
  measurements: [],
  options: {
    lengthBonus: 0,
    inseamPercent: { pct: 20, min: 5, max: 100, menu: 'style' },
    slashIterations: { count: 4, min: 1, max: 8, menu: 'construction' },
    hemRatio: { pct: 200, min: 100, max: 400, menu: 'style' },
    angle: { pct: 50, max: 90, min: 0, menu: 'style' },
    spread: { bool: true, menu: 'style' },
  },
  draft: draftPercyFront,
}
