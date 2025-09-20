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
  expand,
  measurements,
  store,
  macro,
  utils,
  units,
  snippets,
  Snippet,
  sa,
  log,
  part,
}) {
  const l = Number(store.get('original_hem_back')) + Number(store.get('original_hem_front'))
  log.info('Cuff length is ' + l)
  const w = options.cuffWidth * measurements.waistToFloor * 2

  if (!expand) {
    // Expand is off, do not draw the part but flag this to the user

    store.flag.note({
      msg: `percy:cutCuff`,

      replace: {
        width: units(w),
        length: units(l),
      },
      suggest: {
        text: 'flag:show',
        icon: 'expand',
        update: {
          settings: ['expand', 1],
        },
      },
    })
    // Also hint about expand
    store.flag.preset('expand')
    return part.hide()
  }

  points.topLeft = new Point(0, 0)
  points.bottomLeft = new Point(0, w)
  points.bottomRight = new Point(l, w)
  points.topRight = new Point(l, 0)

  points.centerLeft = new Point(0, w / 2)
  points.centerRight = new Point(l, w / 2)

  paths.foldHere = new Path().move(points.centerLeft).line(points.centerRight).setClass('note help')

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

  store.cutlist.addCut({ identical: true })
  points.titleAnchor = points.topLeft.shiftFractionTowards(points.bottomRight, 0.5)
  macro('title', {
    nr: 3,
    title: 'cuff',
    at: points.titleAnchor,
  })

  macro('hd', {
    id: 'length',
    from: points.topLeft,
    to: points.topRight,
    y: points.topRight.y - 15 - sa,
  })

  macro('vd', {
    id: 'width',
    from: points.topLeft,
    to: points.bottomLeft,
    x: points.topLeft.x - 15 - sa,
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
