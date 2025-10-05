import { draft_legPath } from './paths/draft_legPath.mjs'
import { body_back } from '../body_back/body_back.mjs'

function draftPollyLeg({
  Path,
  Point,
  paths,
  points,
  measurements,
  options,
  utils,
  macro,
  part,
  store,
  sa,
  log,
  Snippet,
  snippets,
}) {
  draft_legPath(Path, Point, paths, points, measurements, options, utils, macro, part, store, log)

  snippets.hipCurveNotch = new Snippet('bnotch', points.hipCurveSnippet)
  snippets.hipCornerNotch = new Snippet('notch', points.hipCornerNotch)

  points.title = points.legEndRight_ep.shiftFractionTowards(points.legTopLeft_ep, 0.5)
  macro('title', { at: points.title, nr: 3, title: 'leg', scale: options.totalSize })

  if (sa) {
    paths.saBasis = paths.legPath
    paths.sa = paths.saBasis.offset(sa).attr('class', 'fabric sa')
  }

  if (options.helpText) {
    paths.legSectionC = paths.hipCurve.split(points.hipCurveSnippet)[0]
    macro('banner', {
      id: 'seamAlignC',
      path: paths.legSectionC,
      text: 'polly:seamAlignC',
      spaces: 3,
    })

    paths.legSectionB = paths.hipCurve
      .split(points.hipCurveSnippet)[1]
      .split(points.hipCornerNotch)[0]
    macro('banner', {
      id: 'seamAlignB',
      path: paths.legSectionB,
      text: 'polly:seamAlignB',
      spaces: 3,
    })

    paths.legSectionA = paths.hipCurve.split(points.hipCornerNotch)[1]
    macro('banner', {
      id: 'seamAlignA',
      path: paths.legSectionA,
      text: 'polly:seamAlignA',
      spaces: 3,
    })
  }

  return part
}

export const leg = {
  name: 'polly.leg',
  draft: draftPollyLeg,
  after: body_back,

  measurements: [
    // Enter the measurements your design needs here. See https://freesewing.dev/reference/measurements .
  ],
  options: {
    legFlare: {
      pct: 100,
      min: 20,
      max: 200,
      menu: 'style',
    },
    legLength: {
      pct: 100,
      min: 50,
      max: 150,
      menu: 'style',
    },
  },
}
