import React from 'react'
import { Icon } from 'antd'
import DRSVG from './svg/DR.svg'
import PACKAGESVG from './svg/packackeload.svg'


export const DRIcon = props => (
  <Icon component={DRSVG} {...props} />
)

export const PackLoadIcon = props => (
  <Icon component={PACKAGESVG} {...props} />
)
