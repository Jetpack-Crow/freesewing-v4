import { scaleAllPoints } from '../../shared.mjs'
import { leg } from '../leg/leg.mjs'
import { anthro_leg_outer } from './anthro_leg_outer.mjs'

function draftPollyAnthroFootUpper({
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

  // Path: path6
  // M 8.5086 -2.18695
  points.path6_p1 = new Point(8.5, -2.2)
  // C 25.551 115.655 62.4745 237.806 140.786 296.677
  points.path6_p2_cp1 = new Point(25.6, 115.7)
  points.path6_p2_cp2 = new Point(62.5, 237.8)
  points.path6_p2_ep = new Point(140.8, 296.7)
  // c 62.6239 -45.4428 79.2449 -88.7963 93.4208 -150.465
  points.path6_p3_cp1 = new Point(203.6, 251.6)
  points.path6_p3_cp2 = new Point(220.2, 208.2)
  points.path6_p3_ep = new Point(234.4, 146.5)
  // c 11.4449 47.5881 21.6804 100.654 94.2476 150.465
  points.path6_p4_cp1 = new Point(245.4, 193.6)
  points.path6_p4_cp2 = new Point(255.7, 246.7)
  points.path6_p4_ep = new Point(328.2, 296.5)
  // c 85.0408 -65.6025 124.16 -187.674 134.344 -301.757
  points.path6_p5_cp1 = new Point(413, 230.4)
  points.path6_p5_cp2 = new Point(452.2, 108.3)
  points.path6_p5_ep = new Point(462.3, -5.8)
  // C 402.047 20.3661 314.311 37.5945 238.006 38.2054
  points.path6_p6_cp1 = new Point(402, 20.4)
  points.path6_p6_cp2 = new Point(314.3, 37.6)
  points.path6_p6_ep = new Point(238, 38.2)
  // C 160.333 38.8273 49.248 16.0266 8.5086 -2.18695
  points.path6_p7_cp1 = new Point(160.3, 38.8)
  points.path6_p7_cp2 = new Point(49.2, 16)
  points.path6_p7_ep = new Point(8.5, -2.2)
  // Z

  scaleAllPoints(part, options.totalSize * store.get('anthroLegScale'))

  paths.path6 = new Path()
    // inkex.paths.Move: M 8.5086 -2.18695
    .move(points.path6_p1)
    // inkex.paths.Curve: C 25.551 115.655 62.4745 237.806 140.786 296.677
    .curve(points.path6_p2_cp1, points.path6_p2_cp2, points.path6_p2_ep)
    // inkex.paths.curve: c 62.6239 -45.4428 79.2449 -88.7963 93.4208 -150.465
    .curve(points.path6_p3_cp1, points.path6_p3_cp2, points.path6_p3_ep)
    // inkex.paths.curve: c 11.4449 47.5881 21.6804 100.654 94.2476 150.465
    .curve(points.path6_p4_cp1, points.path6_p4_cp2, points.path6_p4_ep)
    // inkex.paths.curve: c 85.0408 -65.6025 124.16 -187.674 134.344 -301.757
    .curve(points.path6_p5_cp1, points.path6_p5_cp2, points.path6_p5_ep)
    // inkex.paths.Curve: C 402.047 20.3661 314.311 37.5945 238.006 38.2054
    .curve(points.path6_p6_cp1, points.path6_p6_cp2, points.path6_p6_ep)
    // inkex.paths.Curve: C 160.333 38.8273 49.248 16.0266 8.5086 -2.18695
    .curve(points.path6_p7_cp1, points.path6_p7_cp2, points.path6_p7_ep)
    // inkex.paths.ZoneClose: Z
    .line(points.path6_p1)

  return part
}

export const anthro_foot_upper = {
  name: 'polly.anthro_foot_upper',
  draft: draftPollyAnthroFootUpper,
  after: [leg, anthro_leg_outer],

  measurements: [],
  options: {},
}
