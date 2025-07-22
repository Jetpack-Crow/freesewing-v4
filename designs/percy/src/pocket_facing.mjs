import { pocket } from './pocket.mjs'

function draftPercyPocketFacing({
  points,
  Point,
  paths,
  Path,
  options,
  complete,
  measurements,
  store,
  macro,
  utils,
  snippets,
  Snippet,
  sa,
  log,
  part,
}) {
  delete paths.seam

  paths.trimmedOutseam = paths.outseamTop.split(points.pocketBottomEdge)[1]
  delete paths.outseamTop
  paths.trimmedWaist = paths.pocketWaistEdge.split(points.pocketInnerEdge)[0]
  delete paths.pocketWaistEdge
  paths.pocketCutout.setClass('fabric')

  paths.seam = paths.pocketBottomEdge
    .join(paths.trimmedWaist)
    .join(paths.pocketCutout)
    .join(paths.trimmedOutseam)
    .close()
    .hide()
  if (sa) {
    paths.saBase = paths.seam
    paths.sa = paths.saBase.offset(sa).setClass('sa')
  }

  //Remove unused paperless macros
  macro('rmHd', 'hSide')
  macro('rmHd', 'hTop')
  macro('rmVd', 'vTop')
  macro('rmVd', 'vLeft')
  macro('rmPd', 'lengthWaist')
  macro('rmPd', 'lengthOutseam')

  macro('pd', {
    id: 'lengthOutseam',
    path: paths.trimmedOutseam.reverse(),
    d: -15 - sa,
  })

  macro('pd', {
    id: 'lengthWaist',
    path: paths.trimmedWaist.reverse(),
    d: -15 - sa,
  })

  macro('pd', {
    id: 'lengthPocket',
    path: paths.pocketCutout.reverse(),
    d: 15 + sa,
  })

  macro('vd', {
    id: 'vOutseam',
    from: points.pocketSideSeamIntercept,
    to: points.pocketBottomEdge,
    x: points.pocketBottomEdge.x,
  })
  macro('hd', {
    id: 'hOutseam',
    from: points.pocketSideSeamIntercept,
    to: points.pocketBottomEdge,
    y: points.pocketBottomEdge.y - sa - 15,
  })

  macro('vd', {
    id: 'vPocket',
    from: points.pocketInnerEdge,
    to: points.pocketBottomEdge,
    x: points.pocketBottomEdge.x,
  })
  macro('hd', {
    id: 'hPocket',
    to: points.pocketInnerEdge,
    from: points.pocketBottomEdge,
    y: points.pocketInnerEdge.y,
  })

  macro('title', {
    nr: 8,
    title: 'pocket_facing',
    at: points.titleAnchor,
  })

  return part
}

export const pocket_facing = {
  name: 'percy.pocket_facing',
  measurements: [],
  from: pocket,
  options: {},
  draft: draftPercyPocketFacing,
}
