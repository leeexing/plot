import React, { useEffect } from 'react'
import G2 from '@antv/g2'

import avatar from '@/assets/admin_avatar.png'
import demoImg from '@/assets/plotrank/demo.png'
import seamanImg from '@/assets/plotrank/seaman.png'
import damonImg from '@/assets/plotrank/damon.png'
import pilotImg from '@/assets/plotrank/pilot.png'
import stewardessImg from '@/assets/plotrank/stewardess.png'


function HomeG2(props) {

  let { plotRank } = props

  let chart = null
  let username = localStorage.getItem('username')

  const avatarSrc = [
    damonImg,
    pilotImg,
    stewardessImg,
    seamanImg,
    demoImg
  ]

  useEffect(() => {
    let srcForName = {}
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
    chart.tooltip({
      title: 'name',
      itemTpl: `<li data-index={index}>
        <span style="background-color:{color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>
        标注总量<span style="margin-left: 20px;">{value}</span>
      </li>`
    })
    chart.interval().position('name*plot').color('name', ['#f6c27d', '#fec514', '#db4c3c', '#a9dff3', '#2fc25b'])
    chart.point().position('name*plot').size(60).shape('name', function(name) {
      let data = plotRank.filter(item => item.name === name)[0]
      let src = data.src
      if (!src) {
        if (data.name === username) {
          src = avatar
        } else {
          if (srcForName[data.name]) {
            src = srcForName[data.name]
          } else {
            src = avatarSrc.shift()
            srcForName[data.name] = src
          }
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
