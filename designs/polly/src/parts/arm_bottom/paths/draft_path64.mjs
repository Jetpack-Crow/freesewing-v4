import { scaleAllPoints } from '../../../shared.mjs'

function draft_path64(Path, Point, paths, points, measurements, options, utils, macro, part) {
  // Path: path64
  // m 79.3917 371.74
  points.path64_p1 = new Point(79.3917, 371.7402)
  // c 22.9772 -0.61651 50.4497 -22.6328 61.6766 -30.8383
  points.path64_p2_cp1 = new Point(101.9772, 371.3835)
  points.path64_p2_cp2 = new Point(129.4497, 349.3672)
  points.path64_p2_ep = new Point(140.6766, 341.1617)
  // c 0.26393 15.8943 -0.93376 42.5687 0.42245 63.7888
  points.path64_p3_cp1 = new Point(141.2639, 356.8943)
  points.path64_p3_cp2 = new Point(140.0662, 383.5687)
  points.path64_p3_ep = new Point(141.4224, 404.7888)
  // c 2.00855 31.427 12.7694 62.3206 11.4059 93.7822
  points.path64_p4_cp1 = new Point(143.0086, 436.427)
  points.path64_p4_cp2 = new Point(153.7694, 467.3206)
  points.path64_p4_ep = new Point(152.4059, 498.7822)
  // c -1.04712 24.1623 0.41733 52.3277 -14.9578 70.9964
  points.path64_p5_cp1 = new Point(150.9529, 523.1623)
  points.path64_p5_cp2 = new Point(152.4173, 551.3277)
  points.path64_p5_ep = new Point(137.0422, 569.9964)
  // c -14.1578 17.1906 -39.255 26.3983 -61.5225 26.0504
  points.path64_p6_cp1 = new Point(122.8422, 587.1906)
  points.path64_p6_cp2 = new Point(97.745, 596.3983)
  points.path64_p6_ep = new Point(75.4775, 596.0504)
  // c -18.9903 -0.29668 -40.0215 -8.90483 -51.7484 -23.8446
  points.path64_p7_cp1 = new Point(56.0097, 595.7033)
  points.path64_p7_cp2 = new Point(34.9785, 587.0952)
  points.path64_p7_ep = new Point(23.2516, 572.1554)
  // c -15.7025 -20.0044 -13.6533 -49.4769 -14.5568 -74.892
  points.path64_p8_cp1 = new Point(7.2975, 551.9955)
  points.path64_p8_cp2 = new Point(9.3467, 522.5231)
  points.path64_p8_ep = new Point(8.4432, 497.108)
  // c -1.07853 -30.3366 9.51914 -60.0822 10.9835 -90.4026
  points.path64_p9_cp1 = new Point(6.9215, 466.6634)
  points.path64_p9_cp2 = new Point(17.5191, 436.9178)
  points.path64_p9_ep = new Point(18.9835, 406.5974)
  // c 0.97507 -20.1893 0.44914 -48.0516 -1.47854 -60.6205
  points.path64_p10_cp1 = new Point(19.9751, 386.8107)
  points.path64_p10_cp2 = new Point(19.4491, 358.9484)
  points.path64_p10_ep = new Point(17.5215, 346.3795)
  // c 10.2074 6.6545 38.0576 26.5629 59.7756 25.9802
  points.path64_p11_cp1 = new Point(28.2074, 352.6545)
  points.path64_p11_cp2 = new Point(56.0576, 372.5629)
  points.path64_p11_ep = new Point(77.7756, 371.9802)
  // z

  scaleAllPoints(part, options.totalsize)

  paths.path64 = new Path()
    // inkex.paths.move: m 79.3917 371.74
    .move(points.path64_p1)
    // inkex.paths.curve: c 22.9772 -0.61651 50.4497 -22.6328 61.6766 -30.8383
    .curve(points.path64_p2_cp1, points.path64_p2_cp2, points.path64_p2_ep)
    // inkex.paths.curve: c 0.26393 15.8943 -0.93376 42.5687 0.42245 63.7888
    .curve(points.path64_p3_cp1, points.path64_p3_cp2, points.path64_p3_ep)
    // inkex.paths.curve: c 2.00855 31.427 12.7694 62.3206 11.4059 93.7822
    .curve(points.path64_p4_cp1, points.path64_p4_cp2, points.path64_p4_ep)
    // inkex.paths.curve: c -1.04712 24.1623 0.41733 52.3277 -14.9578 70.9964
    .curve(points.path64_p5_cp1, points.path64_p5_cp2, points.path64_p5_ep)
    // inkex.paths.curve: c -14.1578 17.1906 -39.255 26.3983 -61.5225 26.0504
    .curve(points.path64_p6_cp1, points.path64_p6_cp2, points.path64_p6_ep)
    // inkex.paths.curve: c -18.9903 -0.29668 -40.0215 -8.90483 -51.7484 -23.8446
    .curve(points.path64_p7_cp1, points.path64_p7_cp2, points.path64_p7_ep)
    // inkex.paths.curve: c -15.7025 -20.0044 -13.6533 -49.4769 -14.5568 -74.892
    .curve(points.path64_p8_cp1, points.path64_p8_cp2, points.path64_p8_ep)
    // inkex.paths.curve: c -1.07853 -30.3366 9.51914 -60.0822 10.9835 -90.4026
    .curve(points.path64_p9_cp1, points.path64_p9_cp2, points.path64_p9_ep)
    // inkex.paths.curve: c 0.97507 -20.1893 0.44914 -48.0516 -1.47854 -60.6205
    .curve(points.path64_p10_cp1, points.path64_p10_cp2, points.path64_p10_ep)
    // inkex.paths.curve: c 10.2074 6.6545 38.0576 26.5629 59.7756 25.9802
    .curve(points.path64_p11_cp1, points.path64_p11_cp2, points.path64_p11_ep)
    // inkex.paths.zoneClose: z
    .line(points.path64_p1)
}

export { draft_path64 }
