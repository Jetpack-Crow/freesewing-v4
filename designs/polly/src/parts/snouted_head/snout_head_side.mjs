import { scaleAllPoints } from '../../shared.mjs'
import { snout_forehead } from './snout_forehead.mjs'

function draftPollySnoutHeadSide({
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
  log,
  store,
}) {
  const drawNeckCurve = () => {
    return new Path()
      .move(points.neckCenter_ep)
      .curve(points.neckSide_cp1, points.neckSide_cp2, points.neckSide_ep)
  }

  if (options.faceType != 'snout') {
    return part
  }

  // Path: path5
  // m 114.957 300.386
  points.path5_p1 = new Point(115, 300.4)
  // c -11.5922 20.8438 -78.4606 115.448 -65.7551 169.729
  points.foreheadCurve_cp1 = new Point(103.4, 320.8)
  points.foreheadCurve_cp2 = new Point(36.5, 415.4)
  points.foreheadCurve_ep = new Point(49.2, 469.7)
  // c 12.7055 54.2807 49.8562 98.5364 73.5229 128.622
  points.noseEdge_cp1 = new Point(61.7, 524.3)
  points.noseEdge_cp2 = new Point(98.9, 568.5)
  points.noseEdge_ep = new Point(122.5, 598.6)
  // c -2.23248 21.4916 -8.36773 65.6378 -11.315 88.9067
  points.noseNotch_cp1 = new Point(119.8, 620.5)
  points.noseNotch_cp2 = new Point(113.6, 664.6)
  points.noseNotch_ep = new Point(110.7, 687.9)
  // C 89.2103 714.539 54.7143 758.125 47.2202 790.2
  points.noseCenter_cp1 = new Point(89.2, 714.5)
  points.noseCenter_cp2 = new Point(54.7, 758.1)
  points.noseCenter_ep = new Point(47.2, 790.2)
  // C 166.975 848.443 269.655 818.988 385.445 783.273
  points.neckCenter_cp1 = new Point(167, 848.4)
  points.neckCenter_cp2 = new Point(269.7, 819)
  points.neckCenter_ep = new Point(385.4, 783.3)
  // C 366.712 730.973 390.717 670.911 433.19 651.675
  points.neckSide_cp1 = new Point(366.7, 731)
  points.neckSide_cp2 = new Point(390.7, 670.9)
  points.neckSide_ep = new Point(433.2, 651.7)
  // C 361.744 507.453 262.663 377.136 114.957 300.386
  points.foreheadOuter_cp1 = new Point(361.7, 507.5)
  points.foreheadOuter_cp2 = new Point(262.7, 377.1)
  points.foreheadOuter_ep = new Point(115, 300.4)
  // Z

  points.neckScalePoint = new Point(470, 750)

  points.origin = new Point(0, 0)
  for (let p in points) points[p] = points[p].rotate(-70, points.origin)

  const snoutHeadScale = store.get('snoutHeadScale')
  scaleAllPoints(part, options.totalSize * snoutHeadScale * options.headScale)

  //Match neck curve to necessary length to fit the body

  paths.neckCurve = drawNeckCurve()
  const neckAdjustmentPoints = ['neckCenter_ep', 'neckSide_cp1', 'neckSide_cp2', 'neckSide_ep']
  const neckLengthHalf = store.get('neckLengthHalf')

  let neckCurveDelta = neckLengthHalf / 2 - paths.neckCurve.length()
  let neckCurveIterations = 0

  while (neckCurveIterations < 5 && Math.abs(neckCurveDelta) > 0.001 * options.totalSize) {
    log.debug('Snout face iteration ' + neckCurveIterations + ', delta ' + neckCurveDelta)

    for (let p of neckAdjustmentPoints) {
      points[p] = points[p].shiftTowards(points.neckScalePoint, -neckCurveDelta * 0.675)
    }

    paths.neckCurve = drawNeckCurve()
    neckCurveDelta = neckLengthHalf / 2 - paths.neckCurve.length()

    neckCurveIterations = neckCurveIterations + 1
  }
  //Neck curve matching done!

  const foreheadTopSeamLength = store.get('foreheadTopSeamLength')
  paths.headSideSeam = new Path()
    .move(points.neckSide_ep)
    .curve(points.foreheadOuter_cp1, points.foreheadOuter_cp2, points.foreheadOuter_ep)
  const totalSideSeamLength = foreheadTopSeamLength + paths.headSideSeam.length()
  log.debug('Snouted head side seam length is ' + totalSideSeamLength)

  paths.path5 = new Path()
    // inkex.paths.move: m 114.957 300.386
    .move(points.path5_p1)
    // inkex.paths.curve: c -11.5922 20.8438 -78.4606 115.448 -65.7551 169.729
    .curve(points.foreheadCurve_cp1, points.foreheadCurve_cp2, points.foreheadCurve_ep)
    // inkex.paths.curve: c 12.7055 54.2807 49.8562 98.5364 73.5229 128.622
    .curve(points.noseEdge_cp1, points.noseEdge_cp2, points.noseEdge_ep)
    // inkex.paths.curve: c -2.23248 21.4916 -8.36773 65.6378 -11.315 88.9067
    .curve(points.noseNotch_cp1, points.noseNotch_cp2, points.noseNotch_ep)
    // inkex.paths.Curve: C 89.2103 714.539 54.7143 758.125 47.2202 790.2
    .curve(points.noseCenter_cp1, points.noseCenter_cp2, points.noseCenter_ep)
    // inkex.paths.Curve: C 166.975 848.443 269.655 818.988 385.445 783.273
    .curve(points.neckCenter_cp1, points.neckCenter_cp2, points.neckCenter_ep)
    // inkex.paths.Curve: C 366.712 730.973 390.717 670.911 433.19 651.675
    .curve(points.neckSide_cp1, points.neckSide_cp2, points.neckSide_ep)
    .join(paths.headSideSeam)
    // inkex.paths.ZoneClose: Z
    .line(points.path5_p1)

  points.title = points.noseEdge_ep.shiftFractionTowards(points.neckCenter_ep, 0.3)
  macro('title', { at: points.title, nr: '7c', title: 'snout_head_side', scale: options.totalSize })
  if (sa) {
    paths.sa = paths.path5.close().offset(sa).trim().attr('class', 'fabric sa')
  }

  macro('pd', {
    path: paths.neckCurve,
    id: 'neckCurvePd',
    d: 10,
  })

  return part
}

export const snout_head_side = {
  name: 'polly.snout_head_side',
  draft: draftPollySnoutHeadSide,
  after: snout_forehead,

  measurements: [],
  options: {},
}
