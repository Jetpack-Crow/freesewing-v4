import { pctBasedOn } from '@freesewing/core'
import { draft_path85 } from './paths/draft_path85.mjs'
import { body_front } from '../body_front/body_front.mjs'

function draftPollyBody_back({
  Path,
  Point,
  paths,
  points,
  measurements,
  options,
  utils,
  macro,
  part,
  sa,
  store,
  log,
  Snippet,
  snippets,
}) {
  draft_path85(Path, Point, paths, points, measurements, options, utils, macro, part, store, log)

  if (options.helpText) {
    paths.backHipCurve = new Path().move(points.hipOuter_ep).line(points.hipBack_ep)

    paths.backHipCurve.addText('C C C C C C C C C C C C C C C C C C ')
    paths.backHipCurve.attributes.add('data-text-class', 'bold fill-note')
  }

  points.title = points.armpitBottom_ep.shiftFractionTowards(points.crotchCenter_ep, 0.5)
  macro('title', { at: points.title, nr: 2, title: 'body_back', scale: options.totalSize })

  if (sa) {
    paths.saBasis = paths.path85.reverse()
    paths.sa = paths.saBasis.offset(sa).trim().attr('class', 'fabric sa')
  }

  snippets.backRaglanNotch = new Snippet('bnotch', points.armpitNotch_ep)

  macro('pd', {
    path: paths.armpitCurveBack,
    //d: 15,
  })

  macro('pd', {
    path: paths.neckCurve,
    ////d: 15,
  })

  return part
}

export const body_back = {
  name: 'polly.body_back',
  draft: draftPollyBody_back,
  after: body_front,

  measurements: [
    // Enter the measurements your design needs here. See https://freesewing.dev/reference/measurements .
  ],
  options: {
    // Enter your pattern options here. Example:
    /*
        extraLength: {
            pct: 10,
            min: 5,
            max: 20,
            label: 'Extra length',
            menu: 'fit',
            ...pctBasedOn('neck')
        }
        */
  },
}
