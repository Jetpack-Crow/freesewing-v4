import { front } from './front.mjs'
import { dim } from './shared.mjs'

export const frontFacing = {
  name: 'devon.frontFacing',
  from: front,
  hide: {
    self: false,
    from: true,
    inherited: true,
  },
  options: {
    // Constants
    // Parameters
  },
  draft: ({ points, Path, paths, macro, sa, store, part }) => {
    macro('rmcutonfold')
    for (const i in paths) {
      if (['frontCollar', 'collarFacing'].indexOf(i) === -1) delete paths[i]
    }

    console.log({ frontpoints: JSON.parse(JSON.stringify(points)) })
    console.log({ p: points.frontCollarPoint })
    console.log({ s: paths.frontCollar.split(points.frontCollarPoint), p: points.frontCollarPoint })

    paths.seam = new Path()
      .move(points.facingHem)
      .line(points.facingYoke)
      .curve(points.facingYokeCp1, points.facingCollarCp2, points.facingCollar)
      .join(paths.collarFacing)
      .line(points.frontNeck)
      .line(points.frontYoke)
      .line(points.frontHem)
      .line(points.facingHem)
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

    points.title = points.frontNeck.shiftFractionTowards(points.facingYoke, 0.5)
    macro('title', { nr: 12, title: 'frontFacing', at: points.title, scale: 0.5, rotation: 90 })

    dim(part, [
      ['h', 'frontNeck', 'facingCollar', 'facingCollar', -15],
      ['h', 'frontNeck', 'cfNeck', 'cfNeck', -15],
      ['h', 'frontHem', 'facingHem', 'facingHem', 15],
      ['v', 'frontHem', 'frontNeck', 'frontNeck', -15],
      ['v', 'facingNeck', 'facingCollar', 'frontNeck', -15],
      ['v', 'facingHem', 'facingCollar', 'facingCollar', 15],
      ['v', 'facingHem', 'facingYoke', 'facingYoke', 15],
    ])

    return part
  },
}
