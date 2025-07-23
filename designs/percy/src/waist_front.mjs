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

  const waistband_top_ratio = waistband_top_circumference / garment_top_circumference

  const top_length = length * waistband_top_ratio

  points.topLeft = new Point(-top_length / 2, 0)
  points.bottomLeft = new Point(-length / 2, width)
  points.bottomRight = new Point(length / 2, width)
  points.topRight = new Point(top_length / 2, 0)

  points.topCenter = new Point(0, 0)
  points.bottomCenter = new Point(0, width)
  /*paths.centerMark = new Path()
    .move(points.topCenter)
    .line(points.bottomCenter)
    .setClass('note help')
    */

  paths.seam = new Path()
    .move(points.topLeft)
    .line(points.bottomLeft)
    .line(points.bottomRight)
    .line(points.topRight)
    .line(points.topLeft)
    .close()

  if (options.frontPleat) {
    const centerToPleat = store.get('centerToPleat')
    points.pleatLeft = new Point(-centerToPleat, width)
    points.pleatRight = new Point(centerToPleat, width)
    snippets['pleatLeftNotch'] = new Snippet('notch', points.pleatLeft)
    snippets['pleatRightNotch'] = new Snippet('notch', points.pleatRight)
  }

  //draw the buttonholes
  let overlap = store.get('frontPanelOverlap') / 2
  points.overlapTopLeft = new Point(-waistband_top_ratio * (length / 2 - overlap), 0)
  points.overlapTopRight = new Point(waistband_top_ratio * (length / 2 - overlap), 0)
  points.overlapBottomLeft = new Point(-(length / 2 - overlap), width)
  points.overlapBottomRight = new Point(length / 2 - overlap, width)
  paths.overlapLeft = new Path().move(points.overlapTopLeft).line(points.overlapBottomLeft).hide()
  paths.overlapRight = new Path()
    .move(points.overlapTopRight)
    .line(points.overlapBottomRight)
    .hide()

  overlap = Math.min(overlap, paths.overlapRight.length() / 3)
  snippets['buttonhole_0'] = new Snippet(
    'buttonhole',
    paths.overlapLeft.shiftAlong(overlap)
  ).rotate(90)
  snippets['buttonhole_1'] = new Snippet(
    'buttonhole',
    paths.overlapRight.shiftAlong(overlap)
  ).rotate(90)
  snippets['buttonhole_2'] = new Snippet(
    'buttonhole',
    paths.overlapLeft.reverse().shiftAlong(overlap)
  ).rotate(90)
  snippets['buttonhole_3'] = new Snippet(
    'buttonhole',
    paths.overlapRight.reverse().shiftAlong(overlap)
  ).rotate(90)

  if (sa) {
    paths.saBase = paths.seam
    paths.sa = paths.saBase.offset(sa).setClass('sa')
  }

  store.cutlist.addCut()

  points.titleAnchor = new Point(-length / 4, width / 2)
  macro('title', {
    nr: 4,
    title: 'waist_front',
    at: points.titleAnchor,
  })

  macro('hd', {
    id: 'topLength',
    from: points.topLeft,
    to: points.topRight,
    y: points.topRight.y - 15 - sa,
  })
  macro('hd', {
    id: 'bottomLength',
    from: points.bottomLeft,
    to: points.bottomRight,
    y: points.bottomRight.y + 15 + sa,
  })
  macro('vd', {
    id: 'height',
    from: points.topCenter,
    to: points.bottomCenter,
    x: points.bottomCenter.x,
  })
  macro('ld', {
    id: 'diagonalLeft',
    from: points.bottomLeft,
    to: points.topLeft,
    d: 15,
  })
  macro('ld', {
    id: 'diagonalRight',
    to: points.bottomRight,
    from: points.topRight,
    d: 15,
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
