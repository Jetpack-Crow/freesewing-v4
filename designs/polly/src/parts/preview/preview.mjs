import { pctBasedOn } from '@freesewing/core'
import { draft_head } from './paths/draft_head.mjs'
import { draft_leg } from './paths/draft_leg.mjs'
import { draft_body } from './paths/draft_body.mjs'
import { draft_arm } from './paths/draft_arm.mjs'
import { draft_darts } from './paths/draft_darts.mjs'
import { draft_armSeam } from './paths/draft_armSeam.mjs'

import { scaleAllPoints } from '../../shared.mjs'

function draftPollyPreview({
  Path,
  Point,
  paths,
  points,
  measurements,
  options,
  utils,
  macro,
  part,
}) {
  if (options.proportionPreview == false) {
    return part
  }
  // Path: head
  points.headTop = new Point(375, 26.6)
  points.upperDartPoint_cp1 = new Point(441.4, 30.3)
  points.upperDartPoint_cp2 = new Point(474.3, 58.2)
  points.upperDartPoint_ep = new Point(501.2, 97.9)
  points.head_p3_cp1 = new Point(518.8, 124.2)
  points.head_p3_cp2 = new Point(518.9, 160.9)
  points.head_p3_ep = new Point(513.9, 192.3)
  points.lowerDartPoint_cp1 = new Point(508.8, 224.6)
  points.lowerDartPoint_cp2 = new Point(494.4, 258.1)
  points.lowerDartPoint_ep = new Point(470.7, 281.2)
  points.chinBottom_cp1 = new Point(446.1, 305.3)
  points.chinBottom_cp2 = new Point(424.8, 323.9)
  points.chinBottom_ep = new Point(375.9, 324)

  // Path: arm
  points.arm_p1 = new Point(425, 315.3)
  points.arm_p2_cp1 = new Point(459.2, 349.3)
  points.arm_p2_cp2 = new Point(541.4, 398.7)
  points.arm_p2_ep = new Point(594.1, 447)
  points.arm_p3_cp1 = new Point(624.6, 475)
  points.arm_p3_cp2 = new Point(664, 499.2)
  points.arm_p3_ep = new Point(678.8, 537.9)
  points.armEnd_cp1 = new Point(684.8, 553.1)
  points.armEnd_cp2 = new Point(688.3, 574)
  points.armEnd_ep = new Point(678, 586.5)
  points.arm_p5_cp1 = new Point(665.4, 601.3)
  points.arm_p5_cp2 = new Point(638.9, 603.9)
  points.arm_p5_ep = new Point(619.8, 598.7)
  points.arm_p6_cp1 = new Point(549.7, 580.3)
  points.arm_p6_cp2 = new Point(479.4, 477)
  points.arm_p6_ep = new Point(460, 451.4)

  // Path: body
  points.body_p1 = new Point(409.9, 321.3)
  points.armpitNotch_cp1 = new Point(426.4, 341.6)
  points.armpitNotch_cp2 = new Point(464.4, 402.5)
  points.armpitNotch_ep = new Point(469.1, 408)
  points.body_p3_cp1 = new Point(460.6, 422)
  points.body_p3_cp2 = new Point(456.6, 490)
  points.body_p3_ep = new Point(461.8, 528.5)
  points.body_p4_cp1 = new Point(466.7, 562.7)
  points.body_p4_cp2 = new Point(489.4, 629.6)
  points.hipOuter = new Point(489.4, 629.6)
  points.hipCurveNotch_cp1 = new Point(463.2, 632.8)
  points.hipCurveNotch_cp2 = new Point(430.1, 631.7)
  points.hipCurveNotch_ep = new Point(411.4, 650.9)
  points.body_p6_cp1 = new Point(394, 668.5)
  points.body_p6_cp2 = new Point(398, 681.3)
  points.hipInner = new Point(393.8, 722.2)
  points.crotchCenter = new Point(375, 722)

  // Path: armSeam
  points.armSeam_p2_cp2 = new Point(610, 543)
  points.armSeam_p2_ep = new Point(574.8, 512.5)
  points.armSeam_p3_cp1 = new Point(540, 482.2)

  // Path: lowerDart
  points.lowerDart_p1 = new Point(432.3, 239.5)
  // Path: upperDart
  points.upperDart_p1 = new Point(447.7, 130.1)

  // Path: leg
  points.legPegOuter = new Point(612, 1011.7)
  points.legPegInner_cp1 = new Point(601.6, 1055.3)
  points.legPegInner_cp2 = new Point(514.4, 1081.8)
  points.legPegInner_ep = new Point(480.9, 1040.2)

  scaleAllPoints(part, options.totalSize * (11.73 / 13.35))

  //Style: match head scale option
  const headScalePoints = [
    'headTop',
    'upperDartPoint_cp1',
    'upperDartPoint_cp2',
    'upperDartPoint_ep',
    'head_p3_cp1',
    'head_p3_cp2',
    'head_p3_ep',
    'lowerDartPoint_cp1',
    'lowerDartPoint_cp2',
    'lowerDartPoint_ep',
    'chinBottom_cp1',
    'chinBottom_cp2',
    'lowerDart_p1',
    'upperDart_p1',
  ]
  for (let p of headScalePoints) {
    points[p] = points[p].shiftFractionTowards(points.chinBottom_ep, 1 - options.headScale)
  }

  //Style: match arm length
  const armScalePoints = [
    //'arm_p2_cp2',
    'arm_p2_ep',
    'arm_p3_cp1',
    'arm_p3_cp2',
    'arm_p3_ep',
    'armEnd_cp1',
    'armEnd_cp2',
    'armEnd_ep',
    'arm_p5_cp1',
    'arm_p5_cp2',
    'arm_p5_ep',
    'arm_p6_cp1',
    'armSeam_p3_cp1',
    'armSeam_p2_ep',
    'armSeam_p2_cp2',
  ]
  for (let p of armScalePoints) {
    points[p] = points[p].shift(-45, -(1 - options.armLength) * options.totalSize * 300) //.shiftFractionTowards(points.armpitNotch_ep, (1-options.armLength) * 1.25)
  }

  //Style: hip shift
  const hipShiftPoints = [
    'hipOuter',
    'legPegOuter',
    'legPegInner_cp1',
    'legPegInner_cp2',
    'legPegInner_ep',
    'hipInner',
    'body_p6_cp2',
    'body_p6_cp1',
    'hipCurveNotch_ep',
    'hipCurveNotch_cp1',
    'hipCurveNotch_cp2',
    'body_p4_cp1',
    'body_p4_cp2',
  ]
  for (let p of hipShiftPoints) {
    points[p] = points[p].shift(0, options.totalSize * options.hipExtraWidth * 106)
  }
  points.body_p3_ep = points.body_p3_ep.shift(0, options.totalSize * options.hipExtraWidth * 53)
  points.body_p3_cp2 = points.body_p3_cp2.shift(0, options.totalSize * options.hipExtraWidth * 53)

  //style: leg length
  const legEndPoints = ['legPegOuter', 'legPegInner_cp1', 'legPegInner_cp2', 'legPegInner_ep']
  for (let p of legEndPoints) {
    points[p] = points[p].shift(-70, -options.totalSize * (1 - options.legLength) * 300)
  }

  //style: leg flare
  points.legTip = points.legPegInner_ep.shiftFractionTowards(points.legPegOuter, 0.5)
  const legFlarePoints = ['legPegOuter_ep', 'legPegInner_cp1', 'legPegInner_cp2', 'legPegInner_ep']
  for (let p of legEndPoints) {
    points[p] = points[p].shiftFractionTowards(points.legTip, 1 - options.legFlare)
  }

  //style: torso length
  const torsoExtraPoints = ['crotchCenter']
  const torsoLengthPoints = hipShiftPoints.concat(torsoExtraPoints)

  for (let p of torsoLengthPoints) {
    points[p] = points[p].shift(90, -options.totalSize * options.torsoLength * 100)
  }

  draft_head(Path, Point, paths, points, measurements, options, utils, macro, part)
  draft_leg(Path, Point, paths, points, measurements, options, utils, macro, part)
  draft_body(Path, Point, paths, points, measurements, options, utils, macro, part)
  draft_arm(Path, Point, paths, points, measurements, options, utils, macro, part)
  draft_darts(Path, Point, paths, points, measurements, options, utils, macro, part)
  draft_armSeam(Path, Point, paths, points, measurements, options, utils, macro, part)

  macro('ld', {
    id: 'legLength',
    from: points.hipCurveNotch_ep,
    to: points.legTip,
  })
  macro('ld', {
    id: 'faceDartDistance',
    from: points.upperDart_p1,
    to: points.lowerDart_p1,
  })
  macro('ld', {
    id: 'armLength',
    from: points.armpitNotch_ep,
    to: points.armEnd_ep,
  })

  macro('mirror', {
    clone: true,
    mirror: [points.headTop, points.crotchCenter],
    paths: Object.keys(paths),
  })

  return part
}

export const preview = {
  name: 'polly.preview',
  draft: draftPollyPreview,

  measurements: [
    // Enter the measurements your design needs here. See https://freesewing.dev/reference/measurements .
  ],
  options: {
    proportionPreview: {
      bool: false,
      menu: 'help',
    },
  },
}
