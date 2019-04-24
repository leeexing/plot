import React from 'react'
import { Icon } from 'antd'
import DRSVG from './svg/DR.svg'
import PACKSVG from './svg/pack.svg'
import PACKAGESVG from './svg/packackeload.svg'
import FULLSCREEN from './svg/fullScreen.svg'
import PLOT from './svg/plot.svg'
import PLOTED from './svg/ploted.svg'
import DOWNLOAD from './svg/download.svg'


export const DRIcon = props => (
  <Icon component={DRSVG} {...props} />
)

export const PackIcon = props => (
  <Icon component={PACKSVG} {...props} />
)

export const PackLoadIcon = props => (
  <Icon component={PACKAGESVG} {...props} />
)

export const FullScreenIcon = props => (
  <Icon component={FULLSCREEN} {...props} />
)

export const PlotIcon = props => (
  <Icon component={PLOT} {...props} />
)

export const PlotedIcon = props => (
  <Icon component={PLOTED} {...props} />
)

export const DownloadIcon = props => (
  <Icon component={DOWNLOAD} {...props} />
)
