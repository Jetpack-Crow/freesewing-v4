import { scaleAllPoints } from '../../../shared.mjs'

function draft_path64(Path, Point, paths, points, measurements, options, utils, macro, part) {
  // Path: path64
  // m 79.3917 371.74
  // c 33.1012 -0.59962 50.4497 -22.6328 61.6766 -30.8383
  points.armpitPointRight_cp1 = new Point(112.1012, 371.4004)
  points.armpitPointRight_cp2 = new Point(129.4497, 349.3672)
  points.armpitPointRight_ep = new Point(140.6766, 341.1617)
  // c 0.26393 15.8943 -0.93376 42.5687 0.42245 63.7888
  points.armNarrowRight_cp1 = new Point(141.2639, 356.8943)
  points.armNarrowRight_cp2 = new Point(140.0662, 383.5687)
  points.armNarrowRight_ep = new Point(141.4224, 404.7888)
  // c 4.51413 47.2555 26.3062 122.293 -3.55182 164.779
  points.armWideRight_cp1 = new Point(145.5141, 452.2555)
  points.armWideRight_cp2 = new Point(167.3062, 527.2926)
  points.armWideRight_ep = new Point(137.4482, 569.7786)
  // c -26.4789 32.1512 -86.9396 35.751 -113.271 2.20581
  points.armWideLeft_cp1 = new Point(110.5211, 602.1512)
  points.armWideLeft_cp2 = new Point(50.0604, 605.751)
  points.armWideLeft_ep = new Point(23.7291, 572.2058)
  // c -29.7894 -46.6465 -7.43748 -114.628 -3.57334 -165.295
  points.armNarrowLeft_cp1 = new Point(-5.7894, 525.3534)
  points.armNarrowLeft_cp2 = new Point(16.5625, 457.3721)
  points.armNarrowLeft_ep = new Point(20.4267, 406.7054)
  // c 0.97507 -20.1893 0.44914 -48.0516 -1.47854 -60.6205
  points.armpitPointLeft_cp1 = new Point(20.9751, 386.8107)
  points.armpitPointLeft_cp2 = new Point(20.4491, 358.9484)
  points.armpitPointLeft_ep = new Point(18.5215, 346.3795)
  // c 10.2074 6.6545 26.6743 26.5798 59.7756 25.9802
  points.armpitCenter_cp1 = new Point(29.2074, 352.6545)
  points.armpitCenter_cp2 = new Point(45.6743, 372.5798)
  points.armpitCenter_ep = new Point(80, 371.9802)
  // z

  points.curveBottom = new Point(80, 595.7)
  points.curveBottom_cpRight = new Point(115, 595.7)

  scaleAllPoints(part, options.totalSize)

  paths.armpitPath = new Path()
    .move(points.armpitCenter_ep)
    // inkex.paths.curve: c 33.1012 -0.59962 50.4497 -22.6328 61.6766 -30.8383
    .curve(points.armpitPointRight_cp1, points.armpitPointRight_cp2, points.armpitPointRight_ep)
    .hide()

  paths.armCurvePath = new Path()
    .move(points.armpitPointRight_ep)

    // inkex.paths.curve: c 0.26393 15.8943 -0.93376 42.5687 0.42245 63.7888
    .curve(points.armNarrowRight_cp1, points.armNarrowRight_cp2, points.armNarrowRight_ep)
    // inkex.paths.curve: c 4.51413 47.2555 26.3062 122.293 -3.55182 164.779
    .curve(points.armWideRight_cp1, points.armWideRight_cp2, points.armWideRight_ep)
    ._curve(
      //points.armWideLeft_cp1,
      points.curveBottom_cpRight,
      points.curveBottom
    )
    .hide()

  paths.path64 = paths.armpitPath.join(paths.armCurvePath)
  /*
    paths.path64 = new Path()
        // inkex.paths.move: m 79.3917 371.74
        .move(points.armpitPointRight_ep
        )
        // inkex.paths.curve: c 0.26393 15.8943 -0.93376 42.5687 0.42245 63.7888
        .curve(
            points.armNarrowRight_cp1,
            points.armNarrowRight_cp2,
            points.armNarrowRight_ep
        )
        // inkex.paths.curve: c 4.51413 47.2555 26.3062 122.293 -3.55182 164.779
        .curve(
            points.armWideRight_cp1,
            points.armWideRight_cp2,
            points.armWideRight_ep
        )
        // inkex.paths.curve: c -26.4789 32.1512 -86.9396 35.751 -113.271 2.20581
        .curve(
            points.armWideLeft_cp1,
            points.armWideLeft_cp2,
            points.armWideLeft_ep
        )
        // inkex.paths.curve: c -29.7894 -46.6465 -7.43748 -114.628 -3.57334 -165.295
        .curve(
            points.armNarrowLeft_cp1,
            points.armNarrowLeft_cp2,
            points.armNarrowLeft_ep
        )
        // inkex.paths.curve: c 0.97507 -20.1893 0.44914 -48.0516 -1.47854 -60.6205
        .curve(
            points.armpitPointLeft_cp1,
            points.armpitPointLeft_cp2,
            points.armpitPointLeft_ep
        )
        // inkex.paths.curve: c 10.2074 6.6545 26.6743 26.5798 59.7756 25.9802
        .curve(
            points.armpitCenter_cp1,
            points.armpitCenter_cp2,
            points.armpitCenter_ep
        )
        // inkex.paths.curve: c 33.1012 -0.59962 50.4497 -22.6328 61.6766 -30.8383
        .curve(
            points.armpitPointRight_cp1,
            points.armpitPointRight_cp2,
            points.armpitPointRight_ep)
        //.hide()
        */
}

export { draft_path64 }
