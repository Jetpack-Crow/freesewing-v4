import { front } from './front.mjs'

function draftJettPocketWelt({
  options,
  Point,
  Path,
  points,
  paths,
  Snippet,
  snippets,
  sa,
  macro,
  part,
  measurements,
  store,
  log,
  expand,
  units,
}) {
  if (!options.frontWeltPockets) {
    part.hide()
    return part
  }
  log.info('Pocket length is ' + store.get('pocketLength'))

  const width = store.get('pocketLength')
  const length = store.get('pocketWidth') * 2

  if (expand) {
    store.flag.preset('expandIsOn')
  } else {
    // Expand is off, do not draw the part but flag this to the user
    const extraSa = sa ? 2 * sa : 0

    store.flag.note({
      msg: `jett:cutPocketWelt`,
      notes: [sa ? 'flag:saIncluded' : 'flag:saExcluded', 'flag:partHiddenByExpand'],
      replace: {
        w: units(2 * width + extraSa),
        l: units(length + extraSa),
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
    store.flag.preset('expandIsOff')

    return part.hide()
  }

  points.topLeft = new Point(0, 0)
  points.topRight = new Point(width, 0)
  points.bottomRight = new Point(width, length)
  points.bottomLeft = new Point(0, length)

  paths.seam = new Path()
    .move(points.topLeft)
    .line(points.topRight)
    .line(points.bottomRight)
    .line(points.bottomLeft)
    .line(points.topLeft)
    .reverse()

  if (sa) {
    paths.sa = paths.seam.offset(sa).setClass('fabric sa')
    paths.sa.line(paths.sa.start())
  }

  store.cutlist.setCut({ cut: 2, from: 'fabric' })
  points.title = points.topLeft.shiftFractionTowards(points.bottomRight, 0.5)

  macro('title', {
    at: points.title,
    nr: 10,
    title: 'pocket_welt',
    scale: 0.3,
  })

  macro('hd', {
    id: 'wTotal',
    from: points.topLeft,
    to: points.topRight,
    y: points.bottomLeft.y + sa + 15,
  })

  macro('vd', {
    id: 'hTotal',
    from: points.topLeft,
    to: points.bottomLeft,
    x: points.bottomLeft.x - sa - 15,
  })

  return part
}

export const pocket_welt = {
  name: 'jett.pocket_welt',
  after: front,
  options: {},
  draft: draftJettPocketWelt,
}
