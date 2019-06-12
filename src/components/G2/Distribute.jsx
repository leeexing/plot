import React, { useEffect } from 'react'
import G2 from '@antv/g2'

// -使用这种方式，会存在图像自适应绘制的时候，获取不到打包图像的地址的问题。500错误。
// -因为通过 babel 打包之后，加了一下 hash 值。所以改用绝对路径的图片地址
import avatar from '@/assets/admin_avatar.png'
import demoImg from '@/assets/plotrank/demo.png'
import patrickImg from '@/assets/plotrank/patrick.png'
import damonImg from '@/assets/plotrank/damon.png'
import pilotImg from '@/assets/plotrank/pilot.png'
import stewardessImg from '@/assets/plotrank/stewardess.png'


function HomeG2 (props) {

  let { plotRank } = props

  let chart = null
  let username = localStorage.getItem('username')

  const avatarSrc = [
    patrickImg,
    pilotImg,
    stewardessImg,
    damonImg,
    demoImg
    // 'https://plotapi.anjianba.cn/images/plotrank/patrick.png',
    // 'https://plotapi.anjianba.cn/images/plotrank/damon.png',
    // 'https://plotapi.anjianba.cn/images/plotrank/stewardess.png',
    // 'https://plotapi.anjianba.cn/images/plotrank/seaman.png',
    // 'https://plotapi.anjianba.cn/images/plotrank/pilot.png',
    // 'https://zos.alipayobjects.com/rmsportal/mYhpaYHyHhjYcQf.png',
    // 'https://zos.alipayobjects.com/rmsportal/JBxkqlzhrlkGlLW.png',
    // 'https://zos.alipayobjects.com/rmsportal/KzCdIdkwsXdtWkg.png',
  ]

  useEffect(() => {
    let srcArr = avatarSrc.slice()
    chart = new G2.Chart({
      container: 'home-dis-g2',
      forceFit: true,
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
    chart.interval().position('name*plot').color('name', ['#f6c27d', '#fec514', '#db4c3c', '#a9dff3', '#2fc25b'])
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

  const stopChartRender = () => chart.clear()

  useEffect(() => stopChartRender, []) // -等同于 componentWillUnmount

  return (
    <div id="home-dis-g2" className="m-g2"></div>
  )
}

export default HomeG2
