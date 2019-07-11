import React, { useEffect } from 'react'
import G2 from '@antv/g2'


function getPoint(p0, p1, ratio) {
  return {
    x: (1 - ratio) * p0.x + ratio * p1.x,
    y: (1 - ratio) * p0.y + ratio * p1.y
  }
}


function HomeG2(props) {

  let { plotOverview } = props

  let chart = null

  const data = [{
    type: '上传图像',
    value: plotOverview[0]
  }, {
    type: '已标记图像',
    value: plotOverview[1]
  }, {
    type: '未标记图像',
    value: plotOverview[2]
  }, {
    type: '已下载图像',
    value: plotOverview[3]
  }]

  var pointRatio = 0.7 // 设置开始变成圆弧的位置 0.7
  var sliceNumber = 0.005

  G2.Shape.registerShape('interval', 'platelet', {
    draw: function draw(cfg, container) {
      cfg.points[1].y = cfg.points[1].y - sliceNumber
      cfg.points[2].y = cfg.points[2].y - sliceNumber
      var centerPoint = {
        x: cfg.points[3].x,
        y: (cfg.points[2].y + cfg.points[3].y) / 2
      }
      centerPoint = this.parsePoint(centerPoint)
      var points = this.parsePoints(cfg.points)
      var path = []
      var tmpPoint1 = getPoint(points[0], points[3], pointRatio)
      var tmpPoint2 = getPoint(points[1], points[2], pointRatio)
      path.push(['M', points[0].x, points[0].y])
      path.push(['L', tmpPoint1.x, tmpPoint1.y])
      path.push(['Q', points[3].x, points[3].y, centerPoint.x, centerPoint.y])
      path.push(['Q', points[2].x, points[2].y, tmpPoint2.x, tmpPoint2.y])
      path.push(['L', points[1].x, points[1].y])
      path.push(['z'])
      return container.addShape('path', {
        attrs: {
          fill: cfg.color,
          path: path
        }
      })
    }
  })

  useEffect(() => {
    chart = new G2.Chart({
      container: 'home-g2',
      forceFit: true,
      // width: 500,
      height: 350,
      padding: [40, 0]
    })
    chart.source(data)
    chart.coord('theta')
    chart.tooltip({
      title: 'type',
      itemTpl: `<li data-index={index}>
        <span style="background-color:{color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>
        数量<span style="margin-left: 20px;">{value}</span>
      </li>`
    })
    chart.intervalStack().position('value').color('type').shape('platelet').label('type')
    chart.render()
  }, [])

  const stopChartRender = () => chart.clear()

  useEffect(() => stopChartRender, [])

  return (
    <div id="home-g2" className="m-g2"></div>
  )
}

export default HomeG2
