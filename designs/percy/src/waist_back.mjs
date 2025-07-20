import { back } from './back.mjs'
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
  const length = store.get('back_waist_width') * 2
  log.info('back panel length is ' + length)
  const width = options.waistbandWidth * measurements.waistToFloor

  const length_percentage = length / store.get('garment_top_circumference')
  const top_length = length_percentage * store.get('waistband_top_circumference')

  points.topLeft = new Point(-top_length / 2, 0)
  points.bottomLeft = new Point(-length / 2, width)
  points.bottomRight = new Point(length / 2, width)
  points.topRight = new Point(top_length / 2, 0)

  points.topCenter = new Point(0, 0)
  points.bottomCenter = new Point(0, width)
  paths.centerMark = new Path().move(points.topCenter).line(points.bottomCenter).setClass('sa')

  paths.seam = new Path()
    .move(points.topLeft)
    .line(points.bottomLeft)
    .line(points.bottomRight)
    .line(points.topRight)
    .line(points.topLeft)
    .close()

  if (sa) {
    paths.saBase = paths.seam.offset(sa).hide()
    paths.sa = paths.saBase.offset(sa).setClass('sa')
  }

  points.titleAnchor = points.topLeft.shiftFractionTowards(points.bottomRight, 0.5)
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
  after: [back],
  options: {},
  draft: draftPercyWaistBack,
}
