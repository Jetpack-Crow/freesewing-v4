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
    const totalSlashIterations = Math.floor(options.slashIterations * 1.5)

    points.hemcenter = points.outseamShiftUpwards.shiftFractionTowards(
      points.inseamShiftUpwards,
      0.5
    )

    points.waistcenter = points.styleWaistOut.shiftFractionTowards(points.styleWaistIn, 0.5)
    const rotationradius = points.hemcenter.dist(points.waistcenter)
    const targethemlength = originalHemLength * options.hemRatio

    const totalRotationAmount = (50 * (targethemlength - originalHemLength)) / rotationradius

    const rotationAmount = Math.min(totalRotationAmount, 90) / totalSlashIterations

    //Slash and spread time
    let slashPointsHem = []
    let slashPointsWaist = []

    //Define all the initial cut points
    for (let i = 1; i <= totalSlashIterations; i++) {
      points['slashPointsHem' + i] = points.outseamShiftUpwards.shiftFractionTowards(
        points.inseamShiftUpwards,
        1 - i / (totalSlashIterations + 1)
      )

      slashPointsHem.push(points['slashPointsHem' + i])

      points['slashPointsWaist' + i] = points.styleWaistOut.shiftFractionTowards(
        points.styleWaistIn,
        1 - i / (totalSlashIterations + 1)
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

    for (let i = 0; i < totalSlashIterations; i++) {
      //Rotate all the waist points to the left of the active point
      for (let j = i; j < totalSlashIterations; j++) {
        slashPointsWaist[j] = points['slashPointsWaist' + j] = slashPointsWaist[j].rotate(
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
    paths.waist = new Path().move(points.styleWaistIn)
    for (let c in slashPointsWaist) {
      paths.waist = paths.waist.line(slashPointsWaist[c])
    }
    paths.waist = paths.waist.line(points.styleWaistOut)

    paths.shortshem = new Path().move(points.inseamShiftUpwards)
    for (let i = 0; i < totalSlashIterations; i++) {
      paths.shortshem = paths.shortshem.line(slashPointsInner[i]).line(slashPointsHem[i])
    }
    paths.shortshem = paths.shortshem.line(points.outseamShiftUpwards)

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

  snippets['backNotch'] = new Snippet('bnotch', paths.waist.shiftFractionAlong(0.5))

  paths.crossSeam = new Path()
    .move(points.styleWaistInNoAngle)
    .line(points.crossSeamCurveStart)
    .curve(points.crossSeamCurveCp1, points.crossSeamCurveCp2, points.fork)

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
  macro('rmHd', 'wForkToPleat')
  macro('rmHd', 'wForkProjectionToPleat')
  macro('rmHd', 'wStartCrotchCurveToPleat')
  macro('rmHd', 'wCbWaistToPleat')
  macro('rmVd', 'hStartCrotchCurveToCbWaist')
  macro('rmVd', 'hForkToCbWaist')

  points.hemLowestPoint = points.outseamShiftUpwards
  let x = 0
  let ary = paths.shortshem.intersectsY(points.hemLowestPoint.y + 2)
  while (ary.length > 0 && x < measurements.waistToSeat) {
    log.info('Hem intersects ' + ary.length + ' times at y ' + points.hemLowestPoint.y)

    points.hemLowestPoint = ary[0]
    x = x + 2
    ary = paths.shortshem.intersectsY(points.hemLowestPoint.y + 2)
  }
  //snippets['hemLowestPoint'] = new Snippet('notch', points.hemLowestPoint)

  points.waistLowestPoint = points.styleWaistIn
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
