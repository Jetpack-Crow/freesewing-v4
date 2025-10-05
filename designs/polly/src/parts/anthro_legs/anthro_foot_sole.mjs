import { scaleAllPoints } from '../../shared.mjs'
import { leg } from '../leg/leg.mjs'
import { anthro_leg_outer } from './anthro_leg_outer.mjs'

function draftPollyAnthroFootSole({
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
  if (options.legType != 'anthro') return part

  // Path: path3
  // m 56.1169 39.0665
  points.path3_p1 = new Point(56.1, 39.1)
  // c -31.8376 81.7548 -41.0956 201.488 4.91045 230.139
  points.path3_p2_cp1 = new Point(24.2, 120.8)
  points.path3_p2_cp2 = new Point(14.9, 240.5)
  points.path3_p2_ep = new Point(60.9, 269.1)
  // c 15.8829 9.89111 37.6033 14.6045 58.4811 13.3672
  points.path3_p3_cp1 = new Point(76.9, 278.9)
  points.path3_p3_cp2 = new Point(98.6, 283.6)
  points.path3_p3_ep = new Point(119.5, 282.4)
  // c 20.8778 -1.2373 40.9131 -8.42527 53.4258 -22.3369
  points.path3_p4_cp1 = new Point(140.9, 280.8)
  points.path3_p4_cp2 = new Point(160.9, 273.6)
  points.path3_p4_ep = new Point(173.4, 259.7)
  // C 223.163 204.39 184.026 75.1775 167.121 34.9776
  points.path3_p5_cp1 = new Point(223.2, 204.4)
  points.path3_p5_cp2 = new Point(184, 75.2)
  points.path3_p5_ep = new Point(167.1, 35)
  // C 161.518 21.6559 130.797 20.9726 111.853 21.5999
  points.path3_p6_cp1 = new Point(161.5, 21.7)
  points.path3_p6_cp2 = new Point(130.8, 21)
  points.path3_p6_ep = new Point(111.9, 21.6)
  // C 92.3939 22.2443 62.4497 22.8048 56.1169 39.0665
  points.path3_p7_cp1 = new Point(92.4, 22.2)
  points.path3_p7_cp2 = new Point(62.4, 22.8)
  points.path3_p7_ep = new Point(56.1, 39.1)
  // Z

  scaleAllPoints(part, options.totalSize * store.get('anthroLegScale'))

  paths.path3 = new Path()
    // inkex.paths.move: m 56.1169 39.0665
    .move(points.path3_p1)
    // inkex.paths.curve: c -31.8376 81.7548 -41.0956 201.488 4.91045 230.139
    .curve(points.path3_p2_cp1, points.path3_p2_cp2, points.path3_p2_ep)
    // inkex.paths.curve: c 15.8829 9.89111 37.6033 14.6045 58.4811 13.3672
    .curve(points.path3_p3_cp1, points.path3_p3_cp2, points.path3_p3_ep)
    // inkex.paths.curve: c 20.8778 -1.2373 40.9131 -8.42527 53.4258 -22.3369
    .curve(points.path3_p4_cp1, points.path3_p4_cp2, points.path3_p4_ep)
    // inkex.paths.Curve: C 223.163 204.39 184.026 75.1775 167.121 34.9776
    .curve(points.path3_p5_cp1, points.path3_p5_cp2, points.path3_p5_ep)
    // inkex.paths.Curve: C 161.518 21.6559 130.797 20.9726 111.853 21.5999
    .curve(points.path3_p6_cp1, points.path3_p6_cp2, points.path3_p6_ep)
    // inkex.paths.Curve: C 92.3939 22.2443 62.4497 22.8048 56.1169 39.0665
    .curve(points.path3_p7_cp1, points.path3_p7_cp2, points.path3_p7_ep)
    // inkex.paths.ZoneClose: Z
    .line(points.path3_p1)

  return part
}

export const anthro_foot_sole = {
  name: 'polly.anthro_foot_sole',
  draft: draftPollyAnthroFootSole,
  after: [leg, anthro_leg_outer],

  measurements: [],
  options: {},
}
