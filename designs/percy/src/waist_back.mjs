import { back } from './back.mjs'
import { waist_front } from './waist_front.mjs'
import { pctBasedOn } from '@freesewing/core'

function draftPercyWaistBack({
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
  const bottom_length = store.get('back_waist_width') * 2
  log.info('back panel length is ' + bottom_length)
  const width = store.get('waistband_width')

  const length_percentage = bottom_length / store.get('garment_top_circumference')
  const top_length = length_percentage * store.get('waistband_top_circumference')

  const lengths_ratio = store.get('waistband_top_ratio')

  const circle_outer_radius = store.get('waistband_outer_radius')
  const circle_inner_radius = store.get('waistband_inner_radius')

  const circle_percentage = bottom_length / (2 * 3.14 * circle_outer_radius)
  const circle_angle = circle_percentage * 360
  log.info(
    'back waistband is ' + circle_percentage + ' of total circle, or ' + circle_angle + ' degrees'
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

  store.cutlist.addCut()
  store.cutlist.addCut({ cut: 1, material: 'interfacing' })

  points.titleAnchor = points.topCenter
    .shiftFractionTowards(points.bottomCenter, 0.5)
    .shiftFractionTowards(points.bottomLeft, 0.4)
  macro('title', {
    nr: 6,
    title: 'waist_back',
    at: points.titleAnchor,
  })

  snippets['backNotch1'] = new Snippet('bnotch', paths.bottomCurve.shiftFractionAlong(0.33))
  snippets['backNotch2'] = new Snippet('bnotch', paths.bottomCurve.shiftFractionAlong(0.67))

  points.grainlineBottom = points.bottomCenter
  points.grainlineTop = points.topCenter
  macro('grainline', {
    from: points.grainlineTop,
    to: points.grainlineBottom,
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
    to: points.grainlineTop,
    x: points.bottomLeft.shiftFractionTowards(points.bottomRight, 0.5).x,
  })
  macro('vd', {
    id: 'bottomOffset',
    from: points.grainlineBottom,
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

export const waist_back = {
  name: 'percy.waist_back',
  measurements: [],
  after: [back, waist_front],
  options: {},
  draft: draftPercyWaistBack,
}
