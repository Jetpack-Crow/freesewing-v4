import { front } from './front.mjs'
import { waist_front } from './waist_front.mjs'

function draftPercyWaistSide({
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
  const length = store.get('side_panel_width')
  log.info('Side panel length is ' + length)
  const width = options.waistbandWidth * measurements.waistToFloor

  const length_percentage = length / store.get('garment_top_circumference')

  const top_length = length_percentage * store.get('waistband_top_circumference')

  points.topLeft = new Point(-top_length / 2, 0)
  points.bottomLeft = new Point(-length / 2, width)
  points.bottomRight = new Point(length / 2, width)
  points.topRight = new Point(top_length / 2, 0)

  paths.seam = new Path()
    .move(points.topLeft)
    .line(points.bottomLeft)
    .line(points.bottomRight)
    .line(points.topRight)
    .line(points.topLeft)
    .close()

  if (sa) {
    paths.saBase = paths.seam
    paths.sa = paths.saBase.offset(sa).setClass('sa')
  }

  points.titleAnchor = points.topLeft.shiftFractionTowards(points.bottomRight, 0.5)
  macro('title', {
    nr: 5,
    title: 'waist_side',
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
    from: points.topLeft.shiftFractionTowards(points.topRight, 0.5),
    to: points.bottomLeft.shiftFractionTowards(points.bottomRight, 0.5),
    //x: points.bottomLeft.shiftFractionTowards(points.bottomRight).x
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

export const waist_side = {
  name: 'percy.waist_side',
  measurements: [],
  after: [front, waist_front],
  options: {},
  draft: draftPercyWaistSide,
}
