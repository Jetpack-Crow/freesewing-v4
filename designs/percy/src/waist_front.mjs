import { front } from './front.mjs'
import { back } from './back.mjs'
import { pctBasedOn } from '@freesewing/core'

function draftPercyWaistFront({
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
  //Total width of garment at top of body pieces

  const garment_top_circumference =
    (store.get('back_waist_width') + store.get('front_waist_width')) * 2

  const seat_height_circumference = measurements.seat * (1 + options.seatEase)
  const waist_height_circumference = measurements.waist * (1 + options.waistEase)
  const waist_to_seat_slope =
    (seat_height_circumference - waist_height_circumference) / measurements.waistToSeat

  //Total cicumference of top of waistband
  const waistband_top_circumference =
    waist_height_circumference +
    waist_to_seat_slope * measurements.waistToHips * (1 - options.waistHeight)

  store.set('garment_top_circumference', garment_top_circumference)
  store.set('waistband_top_circumference', waistband_top_circumference)

  const length = store.get('front_panel_width')
  log.info('Front panel length is ' + length)
  const width = options.waistbandWidth * measurements.waistToFloor
  store.set('waistband_width', width)

  const waistband_top_ratio = waistband_top_circumference / garment_top_circumference
  store.set('waistband_top_ratio', waistband_top_ratio)

  const top_length = length * waistband_top_ratio

  const circle_outer_radius = width / (1 - waistband_top_ratio)
  store.set('waistband_outer_radius', circle_outer_radius)
  const circle_inner_radius = circle_outer_radius - width
  store.set('waistband_inner_radius', circle_inner_radius)

  const circle_percentage = length / (2 * 3.14 * circle_outer_radius)
  const circle_angle = circle_percentage * 360
  log.info(
    'side waistband is ' + circle_percentage + ' of total circle, or ' + circle_angle + ' degrees'
  )

  points.circleCenter = new Point(0, 0)
  points.topCenter = new Point(0, circle_inner_radius)
  points.bottomCenter = new Point(0, circle_outer_radius)
  paths.centerLine = new Path()
    .move(points.topCenter)
    .line(points.bottomCenter)
    .setClass('note help')

  paths.seam = new Path()
    .move(points.bottomCenter)
    .circleSegment(circle_angle / 2, points.circleCenter)

  points.bottomRight = paths.seam.end()
  points.topRight = points.bottomRight.shiftTowards(points.circleCenter, width)

  paths.seam = paths.seam.line(points.topRight).circleSegment(-circle_angle, points.circleCenter)

  points.topLeft = paths.seam.end()
  points.bottomLeft = points.topLeft.shiftTowards(points.circleCenter, -width)

  paths.seam = paths.seam
    .line(points.bottomLeft)
    .circleSegment(circle_angle / 2, points.circleCenter)
    .close()

  paths.bottomCurve = new Path()
    .move(points.bottomLeft)
    .circleSegment(circle_angle, points.circleCenter)
    .hide()

  paths.topCurve = new Path()
    .move(points.topLeft)
    .circleSegment(circle_angle, points.circleCenter)
    .hide()

  if (sa) {
    paths.saBase = paths.seam
    paths.sa = paths.saBase.offset(sa).setClass('sa')
  }

  if (options.frontPleat) {
    const centerToPleat = store.get('centerToPleat')
    points.pleatLeft = paths.bottomCurve.shiftAlong(paths.bottomCurve.length() / 2 + centerToPleat)
    points.pleatRight = paths.bottomCurve.shiftAlong(paths.bottomCurve.length() / 2 - centerToPleat)
    snippets['pleatLeftNotch'] = new Snippet('notch', points.pleatLeft)
    snippets['pleatRightNotch'] = new Snippet('notch', points.pleatRight)
  }

  //draw the buttonholes
  let overlap = store.get('frontPanelOverlap') / 2
  points.overlapBottomRight = paths.bottomCurve.reverse().shiftAlong(overlap)
  points.overlapTopRight = paths.topCurve.reverse().shiftAlong(overlap * waistband_top_ratio)
  //points.overlapTopRightRight = new Point(waistband_top_ratio * (bottom_length / 2 - overlap), 0)
  paths.overlapRight = new Path()
    .move(points.overlapTopRight)
    .line(points.overlapBottomRight)
    .setClass('sa')
    .hide()

  points.overlapBottomLeft = paths.bottomCurve.shiftAlong(overlap)
  points.overlapTopLeft = paths.topCurve.shiftAlong(overlap * waistband_top_ratio)
  paths.overlapLeft = new Path()
    .move(points.overlapTopLeft)
    .line(points.overlapBottomLeft)
    .setClass('sa')
    .hide()

  overlap = Math.min(overlap, paths.overlapRight.length() / 3)

  snippets['buttonhole_0'] = new Snippet(
    'buttonhole',
    paths.overlapRight.shiftAlong(overlap)
  ).rotate(90)
  snippets['buttonhole_1'] = new Snippet(
    'buttonhole',
    paths.overlapRight.reverse().shiftAlong(overlap)
  ).rotate(90)
  snippets['buttonhole_2'] = new Snippet(
    'buttonhole',
    paths.overlapLeft.shiftAlong(overlap)
  ).rotate(90)
  snippets['buttonhole_3'] = new Snippet(
    'buttonhole',
    paths.overlapLeft.reverse().shiftAlong(overlap)
  ).rotate(90)

  if (sa) {
    paths.saBase = paths.seam
    paths.sa = paths.saBase.offset(sa).setClass('sa')
  }

  store.cutlist.addCut()

  points.titleAnchor = points.topCenter.shiftFractionTowards(points.bottomLeft, 0.5)

  macro('title', {
    nr: 4,
    title: 'waist_front',
    at: points.titleAnchor,
    scale: 0.8,
  })

  macro('hd', {
    id: 'topLength',
    from: points.topLeft,
    to: points.topRight,
    y: points.topRight.y,
  })
  macro('hd', {
    id: 'bottomLength',
    from: points.bottomLeft,
    to: points.bottomRight,
    y: points.bottomRight.y,
  })

  macro('vd', {
    id: 'height',
    from: points.topLeft.shiftFractionTowards(points.topRight, 0.5),
    to: points.bottomLeft.shiftFractionTowards(points.bottomRight, 0.5),
    x: points.bottomLeft.shiftFractionTowards(points.bottomRight, 0.5).x + sa + 15,
  })

  macro('vd', {
    id: 'topOffset',
    from: points.topLeft.shiftFractionTowards(points.topRight, 0.5),
    to: points.topCenter,
    x: points.bottomLeft.shiftFractionTowards(points.bottomRight, 0.5).x,
  })
  macro('vd', {
    id: 'bottomOffset',
    from: points.bottomCenter,
    to: points.bottomLeft.shiftFractionTowards(points.bottomRight, 0.5),
    x: points.bottomLeft.shiftFractionTowards(points.bottomRight, 0.5).x,
  })

  macro('ld', {
    id: 'diagonalLeft',
    from: points.bottomLeft,
    to: points.topLeft,
    d: -15,
  })
  macro('ld', {
    id: 'diagonalRight',
    to: points.bottomRight,
    from: points.topRight,
    d: -15,
  })

  macro('hd', {
    id: 'hLeft',
    to: points.bottomLeft,
    from: points.topLeft,
    y: points.topLeft.y,
  })
  macro('vd', {
    id: 'vLeft',
    to: points.bottomLeft,
    from: points.topLeft,
    x: points.bottomLeft.x,
  })

  macro('hd', {
    id: 'hRight',
    from: points.bottomRight,
    to: points.topRight,
    y: points.topRight.y,
  })
  macro('vd', {
    id: 'vRight',
    from: points.bottomRight,
    to: points.topRight,
    x: points.bottomRight.x,
  })
  macro('pd', {
    id: 'lengthBottom',
    path: paths.bottomCurve,
    d: 15 + sa,
  })

  return part
}

export const waist_front = {
  name: 'percy.waist_front',
  measurements: [],
  after: [front, back],
  options: {},
  draft: draftPercyWaistFront,
}
