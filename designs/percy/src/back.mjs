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

  delete paths.hint

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

  paths.crossSeam = new Path()
    .move(points.styleWaistInNoAngle)
    .line(points.crossSeamCurveStart)
    .curve(points.crossSeamCurveCp1, points.crossSeamCurveCp2, points.fork)

  paths.waist = new Path().move(points.styleWaistIn).line(points.styleWaistOut).setClass('various')

  if (options.spread) {
    const totalSlashIterations = Math.floor(options.slashIterations * 2)

    points.hemcenter = points.outseamShiftUpwards.shiftFractionTowards(
      points.inseamShiftUpwards,
      0.5
    )

    points.waistcenter = points.styleWaistOut.shiftFractionTowards(points.styleWaistIn, 0.5)
    points.crossSeamCenter = paths.crossSeam.shiftFractionAlong(0.5)
    points.topCenter = points.waistcenter.shiftFractionTowards(points.crossSeamCenter, 0.5)

    const rotationradius = points.hemcenter.dist(points.topCenter)

    const targethemlength = originalHemLength * options.hemRatio
    const totalRotationAmount = (50 * (targethemlength - originalHemLength)) / rotationradius
    const rotationAmount = Math.min(totalRotationAmount, 90) / totalSlashIterations

    points.crossSeamDrop = paths.shortshem.intersectsX(points.styleWaistInNoAngle.x)[0]

    const crossSeamRatio =
      points.inseamShiftUpwards.dist(points.crossSeamDrop) / paths.shortshem.length()
    const crossSeamSlashCount = Math.floor(totalSlashIterations * crossSeamRatio)
    const waistSlashCount = totalSlashIterations - crossSeamSlashCount

    //Slash and spread time
    let slashPointsHem = []
    let slashPointsWaist = []

    //Define all the initial cut points for the waist
    for (let i = 1; i <= crossSeamSlashCount; i++) {
      points['slashPointsWaist' + i] = paths.crossSeam
        .reverse()
        .shiftFractionAlong(i / crossSeamSlashCount)
      slashPointsWaist.push(points['slashPointsWaist' + i])
    }
    for (let i = crossSeamSlashCount + 1; i <= totalSlashIterations; i++) {
      points['slashPointsWaist' + i] = paths.waist.shiftFractionAlong(
        (i - crossSeamSlashCount) / waistSlashCount
      )
      slashPointsWaist.push(points['slashPointsWaist' + i])
    }

    //Define all the initial cut points for the hem
    for (let i = 1; i <= totalSlashIterations; i++) {
      points['slashPointsHem' + i] = points.outseamShiftUpwards.shiftFractionTowards(
        points.inseamShiftUpwards,
        1 - i / (totalSlashIterations + 1)
      )

      slashPointsHem.push(points['slashPointsHem' + i])
    }

    //slashPointsInner starts as a copy of all the hem points
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

    for (let i = 0; i < totalSlashIterations; i++) {
      //Rotate all the waist points to the left of the active point
      for (let j = i; j < totalSlashIterations; j++) {
        slashPointsWaist[j] = points['slashPointsWaist' + j] = slashPointsWaist[j].rotate(
          rotationAmount,
          slashPointsWaist[i]
        )
      }
      if (i < crossSeamSlashCount) {
        points.styleWaistIn = points.styleWaistIn.rotate(rotationAmount, slashPointsWaist[i])
        points.waistIn = points.waistIn.rotate(rotationAmount, slashPointsWaist[i])
        points.styleWaistInNoAngle = points.styleWaistInNoAngle.rotate(
          rotationAmount,
          slashPointsWaist[i]
        )
      }

      //Rotate all the hem points to the left of the active point
      for (let j = i; j < totalSlashIterations; j++) {
        slashPointsHem[j] = points['slashPointsHem' + j] = slashPointsHem[j].rotate(
          rotationAmount,
          slashPointsWaist[i]
        )
      }
      for (let j = i + 1; j < totalSlashIterations; j++) {
        slashPointsInner[j] = points['slashPointsInner' + j] = slashPointsInner[j].rotate(
          rotationAmount,
          slashPointsWaist[i]
        )
      }

      //rotate the outseam
      paths.newOutseam = paths.newOutseam.rotate(rotationAmount, slashPointsWaist[i])
      //paths.hint = paths.hint.rotate(rotationAmount, slashPointsWaist[i]).setClass('note help')
      for (let p of outseamRotatePoints) {
        points[p] = points[p].rotate(rotationAmount, slashPointsWaist[i])
      }
    }

    let pointsCrossOnly = slashPointsWaist.slice(0, crossSeamSlashCount)
    let pointsWaistOnly = slashPointsWaist.slice(crossSeamSlashCount)

    //draw the new curved cross seam
    log.info(pointsCrossOnly.length + ' points in pointsCrossOnly')
    //paths.crossSeam = new Path().move(points.fork)
    paths.crossSeam = paths.crossSeam.reverse()

    for (let i = 0; i < crossSeamSlashCount; i++) {
      points.crossSeamRotationPoint = paths.crossSeam.shiftFractionAlong(
        (i + 0.5) / crossSeamSlashCount
      )

      let halves = paths.crossSeam.split(
        paths.crossSeam.shiftFractionAlong((i + 0.5) / crossSeamSlashCount)
      )

      paths.crossSeam = halves[0].join(
        halves[1].rotate(rotationAmount, points.crossSeamRotationPoint)
      )
    }
    //paths.crossSeam = paths.crossSeam.line(points.styleWaistIn)

    //draw the new curved waist
    log.info(pointsWaistOnly.length + ' points in pointsWaistOnly')
    paths.waist = new Path().move(paths.crossSeam.end())
    for (let i = 0; i < waistSlashCount; i++) {
      paths.waist = paths.waist.line(pointsWaistOnly[i])
    }
    paths.waist = paths.waist.line(points.styleWaistOut)

    //draw the new curved hem
    paths.shortshem = new Path().move(points.inseamShiftUpwards)
    for (let i = 0; i < totalSlashIterations; i++) {
      paths.shortshem = paths.shortshem.line(slashPointsInner[i]).line(slashPointsHem[i])
    }
    paths.shortshem = paths.shortshem.line(points.outseamShiftUpwards)

    //rotation correction

    const rotationCorrection = 180 - points.outseamShiftUpwards.angle(points.inseamShiftUpwards)

    for (const p in paths) {
      paths[p] = paths[p].rotate(rotationCorrection, points.styleWaistOut)
    }
    paths.inseam.hide()
    paths.outseam.hide()
    if (paths.hint) {
      paths.hint.setClass('note help')
    }
    for (const p in points) {
      points[p] = points[p].rotate(rotationCorrection, points.styleWaistOut)
    }
  }

  store.set('back_waist_width', paths.waist.length())

  snippets['backNotch'] = new Snippet('bnotch', paths.waist.shiftFractionAlong(0.33))

  paths.seam = paths.newInseam
    .join(paths.shortshem)
    .join(paths.newOutseam)
    .join(paths.waist.reverse())
    .join(paths.crossSeam)
    .close()
    .hide()

  if (sa) {
    paths.saBase = paths.seam
    paths.sa = paths.saBase.offset(sa).setClass('sa')
  }
  if (paths.hemBase) delete paths.hemBase

  //remove all broken paperless macros
  macro('rmVd', 'hHemToSideWaist')
  macro('rmVd', 'hFull')
  macro('rmVd', 'hHemToFork')
  macro('rmHd', 'wHem')
  macro('rmHd', 'wHemLeft')
  macro('rmHd', 'wHemRight')
  macro('rmHd', 'wPleatToSideWaist')
  macro('rmHd', 'wPleatToSideWaistAlt')
  macro('rmHd', 'wForkToPleat')
  macro('rmHd', 'wForkProjectionToPleat')
  macro('rmHd', 'wStartCrotchCurveToPleat')
  macro('rmHd', 'wCbWaistToPleat')
  macro('rmVd', 'hStartCrotchCurveToCbWaist')
  macro('rmVd', 'hForkToCbWaist')

  points.hemLowestPoint = paths.shortshem.shiftFractionAlong(0.5)
  let x = 0
  let ary = paths.shortshem.intersectsY(points.hemLowestPoint.y + 1)
  while (ary.length > 0 && x < measurements.waistToSeat) {
    log.info('Hem intersects ' + ary.length + ' times at y ' + points.hemLowestPoint.y)

    points.hemLowestPoint = ary[0]
    x = x + 1
    ary = paths.shortshem.intersectsY(points.hemLowestPoint.y + 1)
  }
  //snippets['hemLowestPoint'] = new Snippet('notch', points.hemLowestPoint)

  points.waistLowestPoint = paths.waist.shiftFractionAlong(0.5)
  x = 0
  ary = paths.waist.intersectsY(points.waistLowestPoint.y + 2)
  while (ary.length > 0 && x < measurements.waistToFloor) {
    log.info('Waist intersects ' + ary.length + ' times at y ' + points.waistLowestPoint.y)

    points.waistLowestPoint = ary[0]
    x = x + 2
    ary = paths.waist.intersectsY(points.waistLowestPoint.y + 2)
  }
  //snippets['waistLowestPoint'] = new Snippet('notch', points.waistLowestPoint)

  macro('pd', {
    id: 'lengthHem',
    path: paths.shortshem,
    d: -15,
  })
  macro('hd', {
    id: 'wHem',
    from: points.inseamShiftUpwards,
    to: points.outseamShiftUpwards,
    y: points.hemLowestPoint.y + 30 + sa,
  })
  macro('hd', {
    id: 'wHemLeft',
    from: points.inseamShiftUpwards,
    to: points.hemLowestPoint,
    y: points.hemLowestPoint.y + 15 + sa,
  })
  macro('hd', {
    id: 'wHemRight',
    from: points.hemLowestPoint,
    to: points.outseamShiftUpwards,
    y: points.hemLowestPoint.y + 15 + sa,
  })

  macro('vd', {
    id: 'floorToOutseam',
    from: points.hemLowestPoint,
    to: points.outseamShiftUpwards,
    x: points.outseamShiftUpwards.x + 15 + sa,
  })
  macro('vd', {
    id: 'floorToInseam',
    from: points.hemLowestPoint,
    to: points.inseamShiftUpwards,
    x: points.inseamShiftUpwards.x - 15 - sa,
  })

  macro('pd', {
    path: paths.newOutseam.reverse(),
    d: -15 - sa,
  })

  macro('vd', {
    id: 'vWaistToInseam',
    from: points.styleWaistOut,
    to: points.outseamShiftUpwards,
    x: points.outseamShiftUpwards.x + 15 + sa,
  })
  macro('hd', {
    id: 'hWaistToInseam',
    from: points.styleWaistOut,
    to: points.outseamShiftUpwards,
    y: points.styleWaistOut.y - 15 - sa,
  })
  macro('vd', {
    id: 'heightWaistOut',
    from: points.styleWaistOut,
    to: points.hemLowestPoint,
    x: points.styleWaistOut.x,
  })
  macro('vd', {
    id: 'heightWaistIn',
    from: points.styleWaistIn,
    to: points.hemLowestPoint,
    x: points.styleWaistIn.x,
  })

  macro('pd', {
    id: 'lengthWaist',
    path: paths.waist,
    d: -15 - sa,
  })

  macro('hd', {
    id: 'wWaist',
    to: points.styleWaistOut,
    from: points.styleWaistIn,
    y: points.styleWaistIn.y - 15 - sa,
  })

  macro('vd', {
    id: 'vWaistLowestPoint',
    to: points.waistLowestPoint,
    from: points.hemLowestPoint,
    x: points.waistLowestPoint.x,
  })

  macro('vd', {
    id: 'vInseam',
    from: points.inseamShiftUpwards,
    to: points.fork,
    x: points.inseamShiftUpwards.x - sa - 15,
  })

  macro('hd', {
    id: 'hInseam',
    from: points.inseamShiftUpwards,
    to: points.fork,
    y: points.fork.y - sa - 15,
  })

  macro('pd', {
    id: 'lengthInseam',
    path: paths.newInseam,
    d: -15 - sa,
  })

  macro('pd', {
    id: 'lengthCrossSeam',
    path: paths.crossSeam.reverse(),
    d: -15 - sa,
  })
  macro('hd', {
    id: 'hCrossSeam',
    to: points.styleWaistIn,
    from: points.fork,
    y: points.styleWaistIn.y - sa - 15,
  })
  macro('vd', {
    id: 'vCrossSeam',
    to: points.styleWaistIn,
    from: points.fork,
    x: points.fork.x,
  })
  macro('hd', {
    id: 'hWaistToLowestLeft',
    from: points.styleWaistIn,
    to: points.waistLowestPoint,
    y: points.waistLowestPoint.y + 15,
  })
  macro('hd', {
    id: 'hWaistToLowestRight',
    from: points.waistLowestPoint,
    to: points.styleWaistOut,
    y: points.waistLowestPoint.y + 15,
  })

  points.titleAnchor = points.styleWaistOut.shiftFractionTowards(points.inseamShiftUpwards, 0.5)
  macro('title', {
    nr: 1,
    title: 'back',
    at: points.titleAnchor,
  })

  macro('rmGrainline', 'grainline')
  points.grainlineBottom = paths.shortshem.shiftFractionAlong(0.5)
  points.grainlineTop = paths.waist.shiftFractionAlong(0.5)
  macro('grainline', {
    from: points.grainlineTop,
    to: points.grainlineBottom,
  })

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
