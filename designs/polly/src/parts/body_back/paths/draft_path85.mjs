import { scaleAllPoints } from '../../../shared.mjs'

function draft_path85(
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
  log
) {
  // Path: path85
  // m 472.983 12.8617
  points.path85_p1 = new Point(472.9833, 12.8617)
  // c 14.0074 3.04588 19.5758 4.49088 29.7218 4.18197
  points.neckCenter_cp1 = new Point(487.0074, 16.0459)
  points.neckCenter_cp2 = new Point(492.5758, 17.4909)
  points.neckCenter_ep = new Point(502.7218, 17.182)
  // c -1.05206 13.276 -4.52225 49.6723 -5.9235 74.5668
  points.path85_p3_cp1 = new Point(501.9479, 30.276)
  points.path85_p3_cp2 = new Point(498.4778, 66.6723)
  points.path85_p3_ep = new Point(497.0765, 91.5668)
  // c -1.84297 32.7422 -4.51459 65.5577 -3.26408 98.3279
  points.path85_p4_cp1 = new Point(495.157, 124.7422)
  points.path85_p4_cp2 = new Point(492.4854, 157.5577)
  points.path85_p4_ep = new Point(493.7359, 190.3279)
  // c 0.98504 25.8136 6.7667 51.2569 8.46643 77.0333
  points.path85_p5_cp1 = new Point(494.985, 215.8136)
  points.path85_p5_cp2 = new Point(500.7667, 241.2569)
  points.path85_p5_ep = new Point(502.4664, 267.0333)
  // c 1.56038 23.6633 2.36966 37.1077 1.58105 71.1265
  points.crotchCenter_cp1 = new Point(503.5604, 290.6633)
  points.crotchCenter_cp2 = new Point(504.3697, 304.1077)
  points.crotchCenter_ep = new Point(503.5811, 338.1265)
  // c -8.98283 1.59062 -21.0562 2.86232 -22.5996 3.15588
  points.hipBack_cp1 = new Point(495.0172, 339.5906)
  points.hipBack_ep = new Point(481.4004, 341.1559)
  // c -12.6733 -5.80867 -90.9351 -36.2156 -100.681 -42.5527
  points.hipOuter_ep = new Point(380.3191, 298.4473)
  // c 0.72791 -27.6323 10.2584 -153.571 11.3966 -172.052
  points.armpitBottom_ep = new Point(391.3966, 125.9482)
  // c 6.93293 -0.91312 14.0859 -0.90912 18.9692 -5.29678
  points.path85_p10_cp1 = new Point(397.9329, 125.0869)
  points.path85_p10_cp2 = new Point(405.0859, 125.0909)
  points.path85_p10_ep = new Point(409.9692, 120.7032)
  // c 5.7208 -5.14013 6.97822 -13.9033 8.53921 -21.4341
  points.path85_p11_cp1 = new Point(415.7208, 115.8599)
  points.path85_p11_cp2 = new Point(416.9782, 107.0967)
  points.path85_p11_ep = new Point(418.5392, 99.5659)
  // c 1.28046 -6.17736 0.19109 -9.78193 0.56118 -18.9177
  points.armpitNotch_cp1 = new Point(420.2805, 93.8226)
  points.armpitNotch_cp2 = new Point(419.1911, 90.2181)
  points.armpitNotch_ep = new Point(419.5612, 81.0823)
  // c 9.07933 -10.7691 42.836 -58.6974 53.2326 -68.1394
  points.shoulder_ep = new Point(473.2326, 12.8606)
  // z

  scaleAllPoints(part, options.totalSize)

  let sideSeamBackLength = points.armpitBottom_ep.dist(points.hipOuter_ep)
  const sideSeamFrontLength = store.get('sideSeamFrontLength')
  log.info('Side seam back length is ' + sideSeamBackLength + ' mm')

  let delta = sideSeamFrontLength - sideSeamBackLength

  let iteration = 0

  while (iteration < 5 && delta > 0.001 * options.totalSize) {
    log.info('Iteration ' + iteration + ', delta = ' + delta)

    points.hipOuter_ep = points.hipOuter_ep.shift(-90, delta)

    let sideSeamBackLength = points.armpitBottom_ep.dist(points.hipOuter_ep)
    delta = sideSeamFrontLength - sideSeamBackLength

    iteration = iteration + 1
  }

  paths.path85 = new Path()
    // inkex.paths.move: m 472.983 12.8617
    .move(points.path85_p1)
    // inkex.paths.curve: c 14.0074 3.04588 19.5758 4.49088 29.7218 4.18197
    .curve(points.neckCenter_cp1, points.neckCenter_cp2, points.neckCenter_ep)
    // inkex.paths.curve: c -1.05206 13.276 -4.52225 49.6723 -5.9235 74.5668
    .curve(points.path85_p3_cp1, points.path85_p3_cp2, points.path85_p3_ep)
    // inkex.paths.curve: c -1.84297 32.7422 -4.51459 65.5577 -3.26408 98.3279
    .curve(points.path85_p4_cp1, points.path85_p4_cp2, points.path85_p4_ep)
    // inkex.paths.curve: c 0.98504 25.8136 6.7667 51.2569 8.46643 77.0333
    .curve(points.path85_p5_cp1, points.path85_p5_cp2, points.path85_p5_ep)
    // inkex.paths.curve: c 1.56038 23.6633 2.36966 37.1077 1.58105 71.1265
    .curve(points.crotchCenter_cp1, points.crotchCenter_cp2, points.crotchCenter_ep)
    // inkex.paths.curve: c -8.98283 1.59062 -21.0562 2.86232 -22.5996 3.15588
    .line(points.hipBack_ep)
    // inkex.paths.curve: c -12.6733 -5.80867 -90.9351 -36.2156 -100.681 -42.5527
    .line(points.hipOuter_ep)
    // inkex.paths.curve: c 0.72791 -27.6323 10.2584 -153.571 11.3966 -172.052
    .line(points.armpitBottom_ep)
    // inkex.paths.curve: c 6.93293 -0.91312 14.0859 -0.90912 18.9692 -5.29678
    .curve(points.path85_p10_cp1, points.path85_p10_cp2, points.path85_p10_ep)
    // inkex.paths.curve: c 5.7208 -5.14013 6.97822 -13.9033 8.53921 -21.4341
    .curve(points.path85_p11_cp1, points.path85_p11_cp2, points.path85_p11_ep)
    // inkex.paths.curve: c 1.28046 -6.17736 0.19109 -9.78193 0.56118 -18.9177
    .curve(points.armpitNotch_cp1, points.armpitNotch_cp2, points.armpitNotch_ep)
    // inkex.paths.curve: c 9.07933 -10.7691 42.836 -58.6974 53.2326 -68.1394
    .line(points.shoulder_ep)
    // inkex.paths.zoneClose: z
    .close()
}

export { draft_path85 }
