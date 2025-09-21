import { back as carltonBack } from '@freesewing/carlton'
import { hidePresets } from '@freesewing/core'

function draftCarlitaBack({ complete, macro, part, paths }) {
  if (complete) {
    macro('banner', {
      id: 'chestLine',
      classes: 'center contrast help',
      path: paths.chest,
      text: 'carlita:chestLine',
    })
  }

  return part
}

export const back = {
  name: 'carlita.back',
  from: carltonBack,
  hide: hidePresets.HIDE_TREE,
  draft: draftCarlitaBack,
}
