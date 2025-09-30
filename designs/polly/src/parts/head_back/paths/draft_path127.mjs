import { scaleAllPoints } from '../../../shared.mjs'

function draft_path127(Path, Point, paths, points, measurements, options, utils, macro, part) {
  // Path: path127
  // m 43.4626 83.938
  points.path127_p1 = new Point(43.4626, 83.938)
  // c 17.2538 20.0646 48.6087 51.8633 70.7841 66.8664
  points.dartEnd_cp1 = new Point(60.2538, 104.0646)
  points.dartEnd_cp2 = new Point(91.6087, 135.8633)
  points.dartEnd_ep = new Point(113.7841, 150.8664)
  // c -23.8299 -12.3087 -67.7212 -19.3495 -93.4455 -18.7438
  points.dartBottom_cp1 = new Point(90.1701, 138.6913)
  points.dartBottom_cp2 = new Point(46.2788, 131.6505)
  points.dartBottom_ep = new Point(20.5545, 132.2562)
  // c -1.63459 33.746 -1.32107 52.4883 3.33086 78.1403
  points.sideCurveUpper_cp1 = new Point(19.3654, 165.746)
  points.sideCurveUpper_cp2 = new Point(19.6789, 184.4883)
  points.sideCurveUpper_ep = new Point(24.3309, 210.1403)
  // c 4.47635 24.6838 11.8388 49.2658 23.402 71.5283
  points.sideCurveLower_cp1 = new Point(28.4763, 234.6838)
  points.sideCurveLower_cp2 = new Point(35.8388, 259.2658)
  points.sideCurveLower_ep = new Point(47.402, 281.5283)
  // c 9.07378 17.4696 23.2391 36.7396 35.3585 47.3018
  points.neckOuter_cp1 = new Point(56.0738, 299.4696)
  points.neckOuter_cp2 = new Point(70.2391, 318.7396)
  points.neckOuter_ep = new Point(82.3585, 329.3018)
  // c 6.30967 -7.58899 22.0015 -11.5732 34.0531 -12.3965
  points.neckCurve_cp1 = new Point(88.3097, 321.411)
  points.neckCurve_cp2 = new Point(104.0015, 317.4268)
  points.neckCurve_ep = new Point(116.0531, 316.6035)
  // c 11.1131 -0.75925 23.4173 4.19693 32.6639 7.05415
  points.neckCenter_cp1 = new Point(127.1131, 316.2407)
  points.neckCenter_cp2 = new Point(139.4173, 321.1969)
  points.neckCenter_ep = new Point(148.6639, 324.0541)
  // c 6.11959 -11.0503 26.169 -50.5519 31.4624 -78.1213
  points.backCurveLower_cp1 = new Point(155.1196, 312.9497)
  points.backCurveLower_cp2 = new Point(175.169, 273.4481)
  points.backCurveLower_ep = new Point(180.4624, 245.8787)
  // c 9.49224 -49.4383 8.31825 -101.464 -0.52509 -151.023
  points.backCurveUpper_cp1 = new Point(189.4922, 196.5617)
  points.backCurveUpper_cp2 = new Point(188.3183, 144.5355)
  points.backCurveUpper_ep = new Point(179.4749, 94.9771)
  // C 175.51 66.3162 158.338 28.5686 151.075 13.7283
  points.headTip_cp1 = new Point(175.5097, 66.3162)
  points.headTip_cp2 = new Point(158.3381, 28.5686)
  points.headTip_ep = new Point(151.0749, 13.7283)
  // C 90.9817 40.5134 69.3601 61.2949 43.4626 83.938
  points.dartTop_cp1 = new Point(90.9817, 40.5134)
  points.dartTop_cp2 = new Point(69.3601, 61.2949)
  points.dartTop_ep = new Point(43.4626, 83.938)
  // Z

  scaleAllPoints(part, options.totalsize)

  paths.path127 = new Path()
    // inkex.paths.move: m 43.4626 83.938
    .move(points.path127_p1)
    // inkex.paths.curve: c 17.2538 20.0646 48.6087 51.8633 70.7841 66.8664
    .curve(points.dartEnd_cp1, points.dartEnd_cp2, points.dartEnd_ep)
    // inkex.paths.curve: c -23.8299 -12.3087 -67.7212 -19.3495 -93.4455 -18.7438
    .curve(points.dartBottom_cp1, points.dartBottom_cp2, points.dartBottom_ep)
    // inkex.paths.curve: c -1.63459 33.746 -1.32107 52.4883 3.33086 78.1403
    .curve(points.sideCurveUpper_cp1, points.sideCurveUpper_cp2, points.sideCurveUpper_ep)
    // inkex.paths.curve: c 4.47635 24.6838 11.8388 49.2658 23.402 71.5283
    .curve(points.sideCurveLower_cp1, points.sideCurveLower_cp2, points.sideCurveLower_ep)
    // inkex.paths.curve: c 9.07378 17.4696 23.2391 36.7396 35.3585 47.3018
    .curve(points.neckOuter_cp1, points.neckOuter_cp2, points.neckOuter_ep)
    // inkex.paths.curve: c 6.30967 -7.58899 22.0015 -11.5732 34.0531 -12.3965
    .curve(points.neckCurve_cp1, points.neckCurve_cp2, points.neckCurve_ep)
    // inkex.paths.curve: c 11.1131 -0.75925 23.4173 4.19693 32.6639 7.05415
    .curve(points.neckCenter_cp1, points.neckCenter_cp2, points.neckCenter_ep)
    // inkex.paths.curve: c 6.11959 -11.0503 26.169 -50.5519 31.4624 -78.1213
    .curve(points.backCurveLower_cp1, points.backCurveLower_cp2, points.backCurveLower_ep)
    // inkex.paths.curve: c 9.49224 -49.4383 8.31825 -101.464 -0.52509 -151.023
    .curve(points.backCurveUpper_cp1, points.backCurveUpper_cp2, points.backCurveUpper_ep)
    // inkex.paths.Curve: C 175.51 66.3162 158.338 28.5686 151.075 13.7283
    .curve(points.headTip_cp1, points.headTip_cp2, points.headTip_ep)
    // inkex.paths.Curve: C 90.9817 40.5134 69.3601 61.2949 43.4626 83.938
    .curve(points.dartTop_cp1, points.dartTop_cp2, points.dartTop_ep)
    // inkex.paths.ZoneClose: Z
    .line(points.path127_p1)
}

export { draft_path127 }
