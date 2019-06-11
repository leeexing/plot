import React, { useEffect } from 'react'
import G2 from '@antv/g2'

import avatar from '@/assets/admin_avatar.png'
import demoImg from '@/assets/demo.png'
import patrickImg from '@/assets/patrick.png'
import damonImg from '@/assets/damon.png'


function HomeG2 (props) {

  let { plotRank } = props

  let chart = null
  let username = localStorage.getItem('username')

  const avatarSrc = [
    'https://zos.alipayobjects.com/rmsportal/mYhpaYHyHhjYcQf.png',
    // 'https://zos.alipayobjects.com/rmsportal/JBxkqlzhrlkGlLW.png',
    damonImg,
    patrickImg,
    'https://zos.alipayobjects.com/rmsportal/KzCdIdkwsXdtWkg.png',
    demoImg
  ]

  useEffect(() => {
    let srcArr = avatarSrc.slice()
    chart = new G2.Chart({
      container: 'home-dis-g2',
      forceFit: true,
      // width: 500,
      height: 350,
      padding: [60, 20, 40, 60]
    })
    chart.source(plotRank, {
      plot: {
        min: 0
      }
    })
    chart.legend(false)
    chart.axis('plot', {
      labels: null,
      title: null,
      line: null,
      tickLine: null
    })
    chart.interval().position('name*plot').color('name', ['#7f8da9', '#fec514', '#db4c3c', '#daf0fd', '#2fc25b'])
    chart.point().position('name*plot').size(60).shape('name', function(name) {
      let data = plotRank.filter(item => item.name === name)[0]
      let src = data.src
      if (srcArr.length === 0) {
        srcArr = avatarSrc.slice()
      }
      if (!src) {
        if (data.name === username) {
          src = avatar
        } else {
          src = srcArr.shift()
        }
      }
      return ['image', src]
    })
    chart.render()
  }, [])

  return (
    <div id="home-dis-g2" className="m-g2"></div>
  )
}

export default HomeG2
