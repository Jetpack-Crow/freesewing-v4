import React from 'react'
import { LineDrawingWrapper, thin, dashed } from './shared.mjs'

/*
 * This strokeScale factor is used to normalize the stroke across
 * designs so we have a consistent look when showing our collection
 */
const strokeScale = 0.7

/**
 * A linedrawing component for Octoplushy
 *
 * @component
 * @param {object} props - All component props
 * @param {string} props.className - Any CSS classes to apply
 * @param {number} props.stroke - The stroke width to apply
 * @returns {JSX.Element}
 */
export const Penelope = ({ className, stroke = 1 }) => (
  <LineDrawingWrapper viewBox="-15 20 300 260" {...{ className }}>
    <Front stroke={stroke * strokeScale} />
    <Back stroke={stroke * strokeScale} />
  </LineDrawingWrapper>
)

/**
 * A linedrawing component for front of Octoplushy
 *
 * @component
 * @param {object} props - All component props
 * @param {string} props.className - Any CSS classes to apply
 * @param {number} props.stroke - The stroke width to apply
 * @returns {JSX.Element}
 */
export const PenelopeFront = ({ className, stroke = 1 }) => (
  <LineDrawingWrapper viewBox="-15 20 300 260" {...{ className }}>
    <Front stroke={stroke * strokeScale} />
  </LineDrawingWrapper>
)

/*
 * SVG elements for the front
 */
const Front = ({ stroke }) => (
  <>
    <path
      key="outline"
      d="m 72.944444,33.944444 c 29.619916,6.128259 58.243366,4.683814 82.501056,0.08762 l 0.0876,-12.533122 c -24.51303,5.362226 -54.28929,4.763918 -81.866453,0.167724 z"
    />
    <path
      key="outline"
      d="M 73.034722,33.763888 C 40.895833,130.72222 71.199516,173.05328 67.843749,256.61458 c 26.361111,-5.41667 84.818631,6.19953 94.568631,-2.10603 -2.72117,-67.78002 29.02783,-155.778753 -6.87926,-220.345055"
    />
    <path
      key="outline"
      d="M 87.59852,36.392952 C 82.491638,54.522384 81.454772,69.964287 81.454772,69.964287"
    />
    <path
      key="outline"
      d="M 93.546223,37.264752 C 91.50347,44.925075 90.136472,57.452425 90.136472,57.452425"
    />
    <path
      key="outline"
      d="m 145.44038,35.866774 c 3.06413,9.703077 5.46799,34.097513 5.46799,34.097513"
    />
    <path
      key="outline"
      d="m 138.39651,37.024896 c 2.2981,8.171012 2.80879,18.895464 2.80879,18.895464"
    />
    <path
      key="outline"
      d="M 73.756944,21.621528 C 95.784721,19.09375 141.46528,20.041667 155.54861,21.486111"
    />
    <path
      key="outline"
      d="m 67.843749,256.65972 c 42.611101,9.38889 41.843741,-1.35417 59.131941,0.31598"
    />
    <path
      key="folds"
      opacity={0.3}
      d="M 59.222222,94.701386 C 58.483121,110.70387 59.944444,150.94444 67.888888,167.55555 59.15009,141.25374 60.607367,115.83922 59.222222,94.701386 Z"
    />
    <path
      key="folds"
      opacity={0.3}
      d="m 169.24782,166.31999 c -2.07639,13.36111 -3.43055,40.53472 -18.41666,69.78472 12.81944,-28.61806 16.43055,-49.20138 18.41666,-69.78472 z"
    />{' '}
  </>
)
