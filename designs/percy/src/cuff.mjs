import { front } from './front.mjs'
import { back } from './back.mjs'
import { pctBasedOn } from '@freesewing/core'

function draftPercyCuff({
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
  const length = Number(store.get('original_hem_back')) + Number(store.get('original_hem_front'))
  log.info('Cuff length is ' + length)
  const width = options.cuffWidth * measurements.waistToFloor * 2

  points.topLeft = new Point(0, 0)
  points.bottomLeft = new Point(0, width)
  points.bottomRight = new Point(length, width)
  points.topRight = new Point(length, 0)

  paths.seam = new Path()
    .move(points.topLeft)
    .line(points.bottomLeft)
    .line(points.bottomRight)
    .line(points.topRight)
    .line(points.topLeft)
    .close()

  if (sa) {
    paths.sa = paths.seam.offset(sa).setClass('sa')
  }

  points.titleAnchor = points.topLeft.shiftFractionTowards(points.bottomRight, 0.5)
  macro('title', {
    nr: 3,
    title: 'cuff',
    at: points.titleAnchor,
  })

  return part
}

export const cuff = {
  name: 'percy.cuff',
  measurements: [],
  after: [front, back],
  options: {
    cuffWidth: {
      pct: 5,
      min: 1,
      max: 15,
      ...pctBasedOn('waistToFloor'),
      menu: 'style',
    },
  },
  draft: draftPercyCuff,
}
