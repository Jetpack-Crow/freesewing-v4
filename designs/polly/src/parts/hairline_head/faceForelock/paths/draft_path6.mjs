import { scaleAllPoints } from '../../../../shared.mjs'

function draft_path6(Path, Point, paths, points, measurements, options, utils, macro, part, store) {
  // Path: path6
  points.path6_p1 = new Point(880.6, 725.6)
  points.dartTop_cp1 = new Point(971.3, 802.6)
  points.dartTop_cp2 = new Point(1048.3, 839)
  points.dartTop_ep = new Point(1140.3, 871.8)
  points.foreheadCenter_cp1 = new Point(1149, 634.6)
  points.foreheadCenter_cp2 = new Point(1083.9, 389.7)
  points.foreheadCenter_ep = new Point(789, 344.8)
  points.neckInner_cp1 = new Point(756.5, 434.6)
  points.neckInner_cp2 = new Point(733, 827.1)
  points.neckInner_ep = new Point(799.3, 976.7)
  points.neckOuter_cp1 = new Point(868.9, 951.3)
  points.neckOuter_cp2 = new Point(948.6, 981.8)
  points.neckOuter_ep = new Point(974.4, 1022.7)
  points.dartBottom = new Point(1064.5, 963.4)
  points.dartPoint_cp1 = new Point(1046.1, 935.1)
  points.dartPoint_cp2 = new Point(962.7, 803.6)
  points.dartPoint_ep = new Point(880.6, 725.6)

  const hairlineHeadScale = 119.1 / 291
  store.set('hairlineHeadScale', hairlineHeadScale)

  scaleAllPoints(part, options.totalSize * hairlineHeadScale)

  const lowerHeadSeam = points.dartBottom.dist(points.neckOuter_ep)
  store.set('lowerHeadSeam', lowerHeadSeam)

  paths.path6 = new Path()
    .move(points.path6_p1)
    .curve(points.dartTop_cp1, points.dartTop_cp2, points.dartTop_ep)
    .curve(points.foreheadCenter_cp1, points.foreheadCenter_cp2, points.foreheadCenter_ep)
    .curve(points.neckInner_cp1, points.neckInner_cp2, points.neckInner_ep)
    .curve(points.neckOuter_cp1, points.neckOuter_cp2, points.neckOuter_ep)
    .line(points.dartBottom)
    .curve(points.dartPoint_cp1, points.dartPoint_cp2, points.dartPoint_ep)
    .line(points.path6_p1)
}

export { draft_path6 }
