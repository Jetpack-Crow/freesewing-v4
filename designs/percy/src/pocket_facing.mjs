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
  if (sa) {
    paths.saBase = paths.seam
    paths.sa = paths.saBase.offset(sa).setClass('sa')
  }

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
