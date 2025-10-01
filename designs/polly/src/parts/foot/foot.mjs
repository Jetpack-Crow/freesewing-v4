import { leg } from '../leg/leg.mjs'

function draftPollyFoot({
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
}) {
  points.center = new Point(0, 0)

  const circumference = store.get('legBottomLength')

  points.center.addCircle(circumference / (2 * 3.14))

  macro('title', { at: points.center, nr: 4, title: 'foot', scale: options.totalSize })

  //console.log({ points: JSON.parse(JSON.stringify(points)), paths: JSON.parse(JSON.stringify(paths)) })

  return part
}

export const foot = {
  name: 'polly.foot',
  draft: draftPollyFoot,

  after: leg,

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
