import { front } from './front.mjs'
import { dim } from './shared.mjs'

export const pocket = {
  name: 'devon.pocket',
  from: front,
  hide: {
    self: false,
    from: true,
    inherited: true,
  },
  options: {},
  draft: ({ Point, points, Path, paths, macro, options, sa, store, part }) => {
    for (const i in paths) {
      delete paths[i]
    }
    for (const i in points) {
      if (null == i.match('pocket')) {
        delete points[i]
      }
    }
    console.log({ pocketpoints: JSON.parse(JSON.stringify(points)) })

    paths.seam = new Path()
      .move(points.pocketTopLeft)
      .line(points.pocketBottomLeft)
      .line(points.pocketBottomMiddle)
      .line(points.pocketBottomRight)
      .line(points.pocketTopRight)
      .line(points.pocketTopLeft)
      .close()
      .attr('class', 'fabric')

    // Seam allowance
    if (sa) {
      paths.sa = paths.seam.offset(sa).attr('class', 'fabric sa')
    }

    /*
     * Annotatinos
     */
    store.cutlist.addCut({ cut: 2, from: 'fabric', onFold: false })

    points.title = points.pocketTopLeft.shiftFractionTowards(points.pocketBottomMiddle, 0.3)
    macro('title', { nr: 10, title: 'pocket', at: points.title, scale: 0.6 })

    dim(part, [
      ['h', 'pocketTopLeft', 'pocketTopRight', 'pocketTopLeft', -15],
      ['h', 'pocketBottomLeft', 'pocketBottomRight', 'pocketBottomMiddle', 15],
      ['h', 'pocketTopLeft', 'pocketBottomLeft', 'pocketBottomMiddle', 15],
      ['h', 'pocketBottomRight', 'pocketTopRight', 'pocketBottomMiddle', 15],
      ['v', 'pocketBottomLeft', 'pocketTopLeft', 'pocketTopLeft', -15],
      ['v', 'pocketBottomMiddle', 'pocketTopRight', 'pocketTopRight', 15],
    ])

    return part
  },
}
