import React, { useEffect } from 'react'
import G2 from '@antv/g2'


function HomeG2 (props) {

  let { drViewData } = props

  let chart = null

  const data = [{
    type: '单视角',
    value: drViewData[0]
  }, {
    type: '双视角',
    value: drViewData[1]
  }]

  useEffect(() => {
    chart = new G2.Chart({
      container: 'home-dr-g2',
      forceFit: true,
      // width: 500,
      height: 350,
      padding: [40, 0]
    })
    chart.source(data)
    chart.coord('theta', {
      startAngle: Math.PI, // 起始角度
      endAngle: Math.PI * (3 / 2) // 结束角度
    })
    chart.intervalStack().position('value').color('type').label('type')
    chart.render()
  }, [])

  const stopChartRender = () => chart.clear()

  useEffect(() => stopChartRender, [])


  return (
    <div id="home-dr-g2" className="m-g2"></div>
  )
}

export default HomeG2
