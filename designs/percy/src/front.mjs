import { front as titanFront } from '@freesewing/titan'
import { pctBasedOn, hidePresets } from '@freesewing/core'

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
        return (
          new Path()
            .move(waistOut)
            //This is a problem point - the curve can go too high up past the waistband. need to tweak
            //points.seatOutCp1 down
            //.curve(points.seatOutCp1, points.seatOut)
            .line(points.seatOut)
            .curve(points.seatOutCp2, points.kneeOutCp1, points.kneeOut)
            .line(points.floorOut)
        )
    } else {
      if (points.waistOut.x < points.seatOut.x)
        return new Path().move(waistOut).curve(points.seatOut, points.kneeOutCp1, points.floorOut)
      else
        return (
          new Path()
            .move(waistOut)
            //._curve(points.seatOutCp1, points.seatOut)
            .line(points.seatOut)
            .curve(points.seatOutCp2, points.kneeOutCp1, points.floorOut)
        )
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
  paths.crotchseam = new Path()
    .move(points.fork)
    .curve(points.crotchSeamCurveCp1, points.crotchSeamCurveCp2, points.crotchSeamCurveStart)
    .line(points.styleWaistIn)

  points.inseamShiftUpwards = paths.inseam.shiftFractionAlong(1 - options.inseamPercent)
  const inseamShiftAmount = paths.inseam.length() * options.inseamPercent
  const seamLengthDifference = paths.outseam.length() - paths.inseam.length()

  points.outseamShiftUpwards = paths.outseam.shiftAlong(inseamShiftAmount + seamLengthDifference)

  paths.shortHem = new Path()
    .move(points.inseamShiftUpwards)
    .line(points.outseamShiftUpwards)
    .reverse()
    .setClass('various')

  const originalHemLength = paths.shortHem.length()
  store.set('original_hem_front', originalHemLength)

  paths.shortInseam = paths.inseam.split(points.inseamShiftUpwards)[1]
  paths.shortOutseam = paths.outseam.split(points.outseamShiftUpwards)[0]

  paths.waist = new Path().move(points.styleWaistIn).line(points.styleWaistOut).setClass('lining')

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

    //For each active point ...
    for (let i = 0; i < options.slashIterations; i++) {
      //Rotate all the waist points to the left of the active point
      for (let j = i; j < options.slashIterations; j++) {
        slashPointsWaist[j] = points['slashPointsWaist' + j] = slashPointsWaist[j].rotate(
          rotationAmount,
          slashPointsWaist[i]
        )
      }

      //Rotate all the hem points to the left of the active point
      for (let j = i; j < options.slashIterations; j++) {
        slashPointsHem[j] = points['slashPointsHem' + j] = slashPointsHem[j].rotate(
          rotationAmount,
          slashPointsWaist[i]
        )
      }

      for (let j = i + 1; j < options.slashIterations; j++) {
        slashPointsInner[j] = points['slashPointsInner' + j] = slashPointsInner[j].rotate(
          rotationAmount,
          slashPointsWaist[i]
        )
      }

      //rotate the inseam
      paths.shortInseam = paths.shortInseam.rotate(rotationAmount, slashPointsWaist[i])
      if (paths.hint) {
        paths.hint = paths.hint.rotate(rotationAmount, slashPointsWaist[i]).setClass('note help')
      }
      paths.crotchseam = paths.crotchseam.rotate(rotationAmount, slashPointsWaist[i])
      for (let p of inseamRotatePoints) {
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
    paths.waist = new Path().move(points.styleWaistOut)
    for (let c in slashPointsWaist) {
      paths.waist = paths.waist.line(slashPointsWaist[c])
    }
    paths.waist = paths.waist.line(points.styleWaistIn).reverse().hide()

    paths.shortHem = new Path().move(points.outseamShiftUpwards).setClass('various')
    for (let i = 0; i < options.slashIterations; i++) {
      paths.shortHem = paths.shortHem.line(slashPointsInner[i]).line(slashPointsHem[i])
    }
    paths.shortHem = paths.shortHem.line(points.inseamShiftUpwards)

    //rotate all the paths back
    for (const p in paths) {
      //log.info(paths[p].asRenderProps().name)
      paths[p] = paths[p].rotate(totalRotationAmount / -2, points.styleWaistOut)
    }
    paths.inseam.hide()
    paths.outseam.hide()
    if (paths.hint) {
      paths.hint.setClass('note help')
    }
    for (const p in points) {
      points[p] = points[p].rotate(totalRotationAmount / -2, points.styleWaistOut)
    }
  }

  //Calculate how deep the pocket opening has to go
  const waistCircum = measurements.waist * (1 + options.waistEase)
  log.info('The circumference of the garment at the waist is ' + waistCircum)
  const seatCircum = measurements.seat * (1 + options.seatEase)
  log.info('The circumference of the garment at the seat is ' + seatCircum)
  const seatDifferential = seatCircum - waistCircum
  log.info('The garment is ' + seatDifferential + ' mm wider at the seat than at the waist')
  const seatSlope = seatDifferential / measurements.waistToSeat
  log.info('The garment gets wider by ' + seatSlope + ' for every mm down from the waist')

  const seatMinusWaistEase = measurements.seat - waistCircum
  log.info('The body measurement at the seat is ' + measurements.seat)
  log.info('The seat is ' + measurements.waistToSeat + ' down from the body waist')
  log.info(
    'This pattern needs ' +
      seatMinusWaistEase +
      ' extra in the garment waist to fit the seat through'
  )
  const openingYBelowWaist = seatMinusWaistEase / seatSlope
  log.info(
    'The garment is ' +
      seatMinusWaistEase +
      ' mm wider than the waist at a point ' +
      openingYBelowWaist +
      ' down from the waist'
  )

  log.info('The waistband is ' + options.waistbandWidth * measurements.waistToFloor + ' wide')
  log.info(
    "The front center point is below the body's waist by " +
      (options.waistbandWidth * measurements.waistToFloor +
        (1 - options.waistHeight) * measurements.waistToHips)
  )

  const openingDepth =
    openingYBelowWaist -
    (options.waistbandWidth * measurements.waistToFloor +
      (1 - options.waistHeight) * measurements.waistToHips)
  store.set('openingDepth', openingDepth)

  log.info('The opening needs to go down the front piece by ' + openingDepth)

  //Draw the pocket cutout
  points.pocketInnerEdge = paths.waist.shiftFractionAlong(options.frontPanelPercentage)
  log.info('Waist front panel width is ' + paths.waist.length() * options.frontPanelPercentage * 2)

  //Send the front panel width to the store
  store.set('front_panel_width', paths.waist.length() * options.frontPanelPercentage * 2)

  points.pocketFacingEdge = paths.waist.shiftFractionAlong(
    options.frontPanelPercentage * options.pocketFacingUnderlap
  )
  //snippets['pocket_facing_notch'] = new Snippet('notch', points.pocketFacingEdge)

  //send the side panel width to the store
  store.set(
    'side_panel_width',
    paths.waist.length() * (1 - options.frontPanelPercentage) +
      (1 - options.pocketFacingUnderlap) * paths.waist.length() * options.frontPanelPercentage
  )

  //send the panel overlap to the store
  store.set('frontPanelOverlap', points.pocketInnerEdge.dist(points.pocketFacingEdge))

  //send the total waist width to the store
  store.set('front_waist_width', paths.waist.length())

  const pocketCutoutDepth = Math.max(measurements.waist * options.pocketOpeningDepth, openingDepth)
  points.pocketBottomEdge = paths.outseam.shiftAlong(pocketCutoutDepth)

  points.pocketBottomEdgeCp1 = points.pocketBottomEdge.shift(
    points.styleWaistOut.angle(points.outseamShiftUpwards) + 90,
    paths.waist.length() * (1 - options.frontPanelPercentage) * options.pocketBottomCurve
  )

  points.pocketInnerEdgeCp2 = points.pocketInnerEdge.shift(
    points.styleWaistOut.angle(points.styleWaistIn) - 90,
    paths.waist.length() / 4
  )

  paths.pocketCutout = new Path()
    .move(points.pocketBottomEdge)
    .curve(points.pocketBottomEdgeCp1, points.pocketInnerEdgeCp2, points.pocketInnerEdge)
    .reverse()

  //Draw the pocket opening depth on the pocket path
  if (openingDepth < 0) {
    log.info('This garment does not need a front opening deeper than the waistband.')
  } else {
    points.openingDepthDisplay = paths.pocketCutout.shiftAlong(openingDepth)
  }

  //Cut the waist and the outseam to account for the pocket chunk
  paths.trimmedOutseam = paths.shortOutseam.split(points.pocketBottomEdge)[1]
  paths.shortOutseam.hide()
  paths.trimmedWaist = paths.waist.split(points.pocketInnerEdge)[0].setClass('lining')
  paths.waist.hide()

  if (options.frontPleat) {
    //add front pleat
    const frontPleatShiftDistance = paths.trimmedWaist.length() * options.frontPleatPosition //* options.pocketFacingUnderlap
    const frontPleatWaistRatio = frontPleatShiftDistance / paths.waist.length()

    points.topPleatPoint = paths.trimmedWaist.shiftAlong(frontPleatShiftDistance)
    points.bottomPleatPoint = paths.shortHem.shiftFractionAlong(1 - frontPleatWaistRatio)

    const pleatAngle =
      (paths.trimmedWaist.angleAt(points.topPleatPoint) +
        paths.shortHem.angleAt(points.bottomPleatPoint)) /
        2 -
      90
    const pleatOffset = measurements.waist * options.frontPleatWidth
    log.info('Pleat offset by ' + pleatOffset + ' mm at ' + pleatAngle + ' degrees')

    points.pleatShiftByAngle = points.topPleatPoint.shift(pleatAngle, pleatOffset)

    const pleatShiftX = points.pleatShiftByAngle.x - points.topPleatPoint.x
    const pleatShiftY = points.pleatShiftByAngle.y - points.topPleatPoint.y

    //Shift the inseam points accordingly
    for (let p of inseamRotatePoints) {
      points[p] = points[p].translate(pleatShiftX, pleatShiftY)
    }

    //shift the inseam paths accordingly
    paths.shortInseam = paths.shortInseam.translate(pleatShiftX, pleatShiftY)
    if (paths.hint) {
      paths.hint = paths.hint.translate(pleatShiftX, pleatShiftY).setClass('note help')
    }
    paths.crotchseam = paths.crotchseam.translate(pleatShiftX, pleatShiftY)

    store.set('centerToPleat', paths.trimmedWaist.split(points.topPleatPoint)[0].length())

    //Cut and reconnect the waist and hem paths
    paths.trimmedWaist = paths.trimmedWaist
      .split(points.topPleatPoint)[0]
      .translate(pleatShiftX, pleatShiftY)
      .join(paths.trimmedWaist.split(points.topPleatPoint)[1])
    paths.shortHem = paths.shortHem
      .split(points.bottomPleatPoint)[0]
      .join(paths.shortHem.split(points.bottomPleatPoint)[1].translate(pleatShiftX, pleatShiftY))

    //Draw the pleat marking
    const pleatMarkingLength = options.frontPleatDisplayLength * measurements.waist
    log.info('Pleat marking length is ' + pleatMarkingLength)
    points.pleatInnerBottom = points.topPleatPoint.shift(pleatAngle - 90, pleatMarkingLength)
    points.pleatOuterBottom = points.pleatShiftByAngle.shift(pleatAngle - 90, pleatMarkingLength)
    points.pleatCenterBottom = points.pleatInnerBottom.shiftFractionTowards(
      points.pleatOuterBottom,
      0.5
    )
    points.pleatCenterTop = points.topPleatPoint.shiftFractionTowards(points.pleatShiftByAngle, 0.5)

    paths.pleatInner = new Path()
      .move(points.topPleatPoint)
      .line(points.pleatInnerBottom)
      .setClass('sa')

    paths.pleatOuter = new Path()
      .move(points.pleatShiftByAngle)
      .line(points.pleatOuterBottom)
      .setClass('sa')

    paths.pleatCenter = new Path()
      .move(points.pleatCenterTop)
      .line(points.pleatCenterBottom)
      .setClass('sa')
  }

  //draw the seam
  //let waistIn = points.styleWaistIn || points.waistIn
  //let waistOut = points.styleWaistOut || points.waistOut
  paths.seam = paths.trimmedOutseam
    .join(paths.shortHem)
    .join(paths.shortInseam)
    .curve(points.crotchSeamCurveCp1, points.crotchSeamCurveCp2, points.crotchSeamCurveStart)
    //.line(waistIn)
    .join(paths.trimmedWaist)
    .join(paths.pocketCutout)
    .close()

  if (sa) {
    paths.saBase = paths.seam
    paths.sa = paths.saBase.offset(sa).setClass('sa')
  }
  if (paths.hemBase) delete paths.hemBase

  points.titleAnchor = points.styleWaistIn.shiftFractionTowards(points.outseamShiftUpwards, 0.6)
  macro('title', {
    nr: 2,
    title: 'front',
    at: points.titleAnchor,
  })

  //Remove all broken paperless macros
  macro('rmVd', 'hHemToSideWaist')
  macro('rmVd', 'hHemToFork')
  macro('rmVd', 'hForkToCfWaist')
  macro('rmVd', 'hStartCrotchCurveToCfWaist')
  macro('rmHd', 'wHem')
  macro('rmHd', 'wHemLeftToPleat')
  macro('rmHd', 'wHemRightToPleat')
  macro('rmHd', 'wSideWaistToPleat')
  macro('rmHd', 'wPleatToCfWaist')
  macro('rmHd', 'wPleastToFork')
  macro('rmHd', 'wPleastToCrotchProjection')
  macro('rmHd', 'hForkToCfWaist')
  macro('rmHd', 'wPleastToStartCrotchCurve')

  macro('rmGrainline', 'grainline')
  points.grainlineBottom = paths.shortHem.shiftFractionAlong(0.5)
  points.grainlineTop = points.styleWaistOut
    .shiftFractionTowards(points.styleWaistIn, 0.5)
    .shiftFractionTowards(points.grainlineBottom, 0.1)
  macro('grainline', {
    from: points.grainlineTop,
    to: points.grainlineBottom,
  })

  points.hemLowestPoint = paths.shortHem.shiftFractionAlong(0.5)
  let x = 0
  let ary = paths.shortHem.intersectsY(points.hemLowestPoint.y + 1)

  while (ary.length > 0 && x < measurements.waistToFloor) {
    log.info('Hem intersects ' + ary.length + ' times at y ' + points.hemLowestPoint.y)

    points.hemLowestPoint = ary[0]
    x = x + 1
    ary = paths.shortHem.intersectsY(points.hemLowestPoint.y + 1)
  }
  //snippets['hemLowestPoint'] = new Snippet('notch', points.hemLowestPoint)

  points.waistLowestPoint = paths.trimmedWaist.shiftFractionAlong(0.5)
  x = 0
  ary = paths.waist.intersectsY(points.waistLowestPoint.y + 2)
  while (ary.length > 0 && x < measurements.waistToSeat) {
    log.info('Waist intersects ' + ary.length + ' times at y ' + points.waistLowestPoint.y)

    points.waistLowestPoint = ary[0]
    x = x + 1
    ary = paths.waist.intersectsY(points.waistLowestPoint.y + 1)
  }
  //snippets['waistLowestPoint'] = new Snippet('notch', points.waistLowestPoint)

  macro('pd', {
    id: 'lengthHem',
    path: paths.shortHem,
    d: -15,
  })
  macro('hd', {
    id: 'wHem',
    to: points.inseamShiftUpwards,
    from: points.outseamShiftUpwards,
    y: points.hemLowestPoint.y + 30 + sa,
  })
  macro('hd', {
    id: 'wHemLeft',
    to: points.inseamShiftUpwards,
    from: points.hemLowestPoint,
    y: points.hemLowestPoint.y + 15 + sa,
  })
  macro('hd', {
    id: 'wHemRight',
    to: points.hemLowestPoint,
    from: points.outseamShiftUpwards,
    y: points.hemLowestPoint.y + 15 + sa,
  })

  macro('vd', {
    id: 'floorToOutseam',
    from: points.hemLowestPoint,
    to: points.outseamShiftUpwards,
    x: points.outseamShiftUpwards.x - 15 - sa,
  })
  macro('vd', {
    id: 'floorToInseam',
    from: points.hemLowestPoint,
    to: points.inseamShiftUpwards,
    x: points.inseamShiftUpwards.x + 15 + sa,
  })

  macro('pd', {
    path: paths.trimmedOutseam.reverse(),
    d: -15 - sa,
  })

  macro('vd', {
    id: 'vWaistToInseam',
    from: points.pocketBottomEdge,
    to: points.outseamShiftUpwards,
    x: points.outseamShiftUpwards.x - 15 - sa,
  })
  macro('hd', {
    id: 'hWaistToInseam',
    to: points.pocketBottomEdge,
    from: points.outseamShiftUpwards,
    y: points.pocketBottomEdge.y,
  })

  macro('vd', {
    id: 'heightWaistOut',
    from: points.pocketBottomEdge,
    to: points.hemLowestPoint,
    x: points.pocketBottomEdge.x,
  })
  macro('vd', {
    id: 'heightPocketInner',
    from: points.pocketInnerEdge,
    to: points.hemLowestPoint,
    x: points.pocketInnerEdge.x,
  })
  macro('vd', {
    id: 'heightWaistIn',
    from: points.styleWaistIn,
    to: points.hemLowestPoint,
    x: points.styleWaistIn.x,
  })
  macro('vd', {
    id: 'heightWaistLowest',
    from: points.waistLowestPoint,
    to: points.hemLowestPoint,
    x: points.waistLowestPoint.x,
  })

  macro('pd', {
    id: 'lengthWaist',
    path: paths.trimmedWaist.reverse(),
    d: -15 - sa,
  })

  macro('hd', {
    id: 'waistLowestLeft',
    from: points.pocketInnerEdge,
    to: points.waistLowestPoint,
    y: points.waistLowestPoint.y + 15,
  })

  macro('hd', {
    id: 'waistLowestRight',
    from: points.waistLowestPoint,
    to: points.styleWaistIn,
    y: points.waistLowestPoint.y + 15,
  })

  macro('pd', {
    id: 'lengthPocket',
    path: paths.pocketCutout,
    d: -15 - sa,
  })

  macro('vd', {
    id: 'vPocket',
    to: points.pocketInnerEdge,
    from: points.pocketBottomEdge,
    x: points.pocketBottomEdge.x,
  })
  macro('hd', {
    id: 'hPocket',
    to: points.pocketInnerEdge,
    from: points.pocketBottomEdge,
    y: points.pocketInnerEdge.y,
  })

  macro('vd', {
    id: 'vInseam',
    from: points.inseamShiftUpwards,
    to: points.fork,
    x: points.inseamShiftUpwards.x + sa + 15,
  })

  macro('hd', {
    id: 'hInseam',
    to: points.inseamShiftUpwards,
    from: points.fork,
    y: points.fork.y - sa - 15,
  })

  macro('pd', {
    id: 'lengthInseam',
    path: paths.shortInseam,
    d: -15 - sa,
  })

  macro('pd', {
    id: 'lengthCrossSeam',
    path: paths.crotchseam.reverse(),
    d: -15 - sa,
  })
  macro('hd', {
    id: 'hCrossSeam',
    from: points.styleWaistIn,
    to: points.fork,
    y: points.styleWaistIn.y - sa - 15,
  })
  macro('vd', {
    id: 'vCrossSeam',
    to: points.styleWaistIn,
    from: points.fork,
    x: points.fork.x,
  })
  macro('hd', {
    id: 'hWaist',
    to: points.styleWaistIn,
    from: points.pocketInnerEdge,
    y: points.styleWaistIn.y - sa - 15,
  })

  if (options.frontPleat) {
    macro('ld', {
      id: 'pleatWidth',
      from: points.topPleatPoint,
      to: points.pleatShiftByAngle,
      d: 7,
    })

    macro('ld', {
      id: 'pleatFromCenter',
      from: points.pleatShiftByAngle,
      to: points.styleWaistIn,
      d: 7,
    })
  }

  return part
}

export const front = {
  from: titanFront,
  name: 'percy.front',
  hide: { from: true },
  measurements: ['inseam'],
  options: {
    lengthBonus: 0,
    inseamPercent: { pct: 25, min: 5, max: 100, menu: 'style', ...pctBasedOn('inseam') },
    slashIterations: { count: 8, min: 1, max: 24, menu: 'style.spread' },
    hemRatio: { pct: 250, min: 100, max: 400, menu: 'style.spread' },
    spread: { bool: true, menu: 'style.spread' },

    frontPleat: { bool: true, menu: 'style.pleat' },
    frontPleatPosition: { pct: 50, min: 10, max: 90, menu: 'style.pleat' },
    frontPleatWidth: { pct: 6.4, min: 0, max: 10, menu: 'style.pleat', ...pctBasedOn('waist') },
    frontPleatDisplayLength: {
      pct: 8,
      min: 1,
      max: 20,
      menu: 'style.pleat',
      ...pctBasedOn('waist'),
    },

    waistHeight: { pct: 75, min: 0, max: 100, menu: 'style' },
    waistbandWidth: {
      pct: 10,
      min: 4,
      max: 20,
      //snap: elastics,
      ...pctBasedOn('waistToFloor'),
      menu: 'style.panel',
    },

    frontPanelPercentage: {
      pct: 50,
      min: 33,
      max: 75,
      menu: 'style.panel',
    },
    pocketOpeningDepth: {
      pct: 11,
      min: 5,
      max: 25,
      menu: 'style.panel',
    },
    pocketFacingUnderlap: {
      pct: 50,
      min: 25,
      max: 80,
      menu: 'style.panel.advanced',
    },
    pocketBottomCurve: {
      pct: 30,
      min: 10,
      max: 75,
      menu: 'style.panel.advanced',
    },
    seatEase: {
      pct: 7,
      min: 2,
      max: 12,
      menu: 'fit',
    },
  },
  draft: draftPercyFront,
}
