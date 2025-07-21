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
  const width = options.waistbandWidth * measurements.waistToFloor

  const length_percentage = bottom_length / store.get('garment_top_circumference')
  const top_length = length_percentage * store.get('waistband_top_circumference')

  const lengths_ratio = top_length / bottom_length
  log.info('Ratio between top and bottom of back piece is ' + lengths_ratio)
  log.info('Waistband height of ' + width + ' is ' + (1 - lengths_ratio) + ' of waistband radius')
  const circle_outer_radius = width / (1 - lengths_ratio)
  const circle_inner_radius = circle_outer_radius - width
  log.info('Circle total radius is ' + circle_outer_radius)
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
  points.topLeft = points.topCenter.rotate(circle_angle / 2, points.circleCenter)
  points.topRight = points.topCenter.rotate(-circle_angle / 2, points.circleCenter)

  points.bottomLeft = points.bottomCenter.rotate(circle_angle / 2, points.circleCenter)
  points.bottomRight = points.bottomCenter.rotate(-circle_angle / 2, points.circleCenter)

  const curveFactor = 2
  points.bottomLeftCp1 = points.bottomLeft.shift(
    circle_angle / 2 + 180,
    circle_outer_radius * circle_percentage * curveFactor
  )
  points.bottomRightCp2 = points.bottomRight.shift(
    -circle_angle / 2,
    circle_outer_radius * circle_percentage * curveFactor
  )

  points.topLeftCp1 = points.topLeft.shift(
    circle_angle / 2 + 180,
    circle_inner_radius * circle_percentage * curveFactor
  )
  points.topRightCp2 = points.topRight.shift(
    -circle_angle / 2,
    circle_inner_radius * circle_percentage * curveFactor
  )

  paths.seam = new Path()
    .move(points.topLeft)
    .line(points.bottomLeft)
    .curve(points.bottomLeftCp1, points.bottomRightCp2, points.bottomRight)
    .line(points.topRight)
    .curve(points.topRightCp2, points.topLeftCp1, points.topLeft)
    .close()
    .reverse()

  if (sa) {
    paths.saBase = paths.seam
    paths.sa = paths.saBase.offset(sa).setClass('sa')
  }

  points.titleAnchor = points.topCenter.shiftFractionTowards(points.bottomRight, 0.5)
  macro('title', {
    nr: 6,
    title: 'waist_back',
    at: points.titleAnchor,
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
