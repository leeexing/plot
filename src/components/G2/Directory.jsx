import React, { useEffect } from 'react'
import G2 from '@antv/g2'


function HomeG2 () {

  let chart = null
  let view1 = null
  let view2 = null

  var otherRatio = 6.67 / 100 // Other 的占比
  var otherOffsetAngle = otherRatio * Math.PI // other 占的角度的一半

  const data = [{
    type: '上传文件夹',
    value: 86.66
  }, {
    type: 'lx910_0015',
    value: 6.67
  }, {
    type: 'lx910_0016',
    value: 6.67
  }]
  let other = [{
    type: 'lx910_0016.img',
    value: 1.77
  }, {
    type: 'lx910_0016.jpg',
    value: 1.44
  }, {
    type: 'lx910_0016_side.jpg',
    value: 1.12
  }, {
    type: '...',
    value: 0.37
  }]

  useEffect(() => {
    chart = new G2.Chart({
      container: 'home-file-g2',
      // forceFit: true,
      width: 600,
      height: 300,
      padding: [0, 20, 0, 0]
    })
    chart.legend(false)

    view1 = chart.view({
      start: {
        x: 0,
        y: 0
      },
      end: {
        x: 0.5,
        y: 1
      }
    })
    view1.tooltip(false, {
      showTitle: false,
      inPlot: false
    })
    view1.coord('theta', {
      radius: 0.7,
      startAngle: 0 + otherOffsetAngle,
      endAngle: Math.PI * 2 + otherOffsetAngle
    })
    view1.source(data)
    view1.intervalStack().position('value').color('type', ['#38c060', '#4fb0ff', '#2593fc']).opacity(1).label('value', function() {
      return {
        offset: -10,
        useHtml: true,
        htmlTemplate: function htmlTemplate(text, item) {
          var d = item.point
          if (d.type === 'lx910_0015') {
            return '<p style="width: 50px; margin-top: 35px; margin-left: -10px; font-size: 12px; color: #fff; transform: rotate(-20deg)">' + d.type + '</p>'
          }
          if (d.type === 'lx910_0016') {
            return '<p style="width: 50px; margin-top: 15px; margin-left: -5px; font-size: 12px; color: #fff;">' + d.type + '</p>'
          }
          return '<p style="width: 80px; margin-top: -20px; font-size: 16px; color: #fff;">' + d.type + '</p>'
        }
      }
    })

    view2 = chart.view({
      start: {
        x: 0.5,
        y: 0.1
      },
      end: {
        x: 0.9,
        y: 0.9
      }
    })
    view2.axis(false)
    view2.source(other, {
      value: {
        nice: false
      }
    })
    view2.intervalStack().position('1*value').color('type', ['#063d8a', '#0b53b0', '#1770d6', '#2593fc', '#47abfc', '#6dc1fc', '#94d6fd', '#bbe7fe']).label('value', {
      position: 'right',
      offsetX: 5,
      offsetY: 10,
      formatter: function formatter(text, item) {
        var d = item.point
        return d.type
      }
    })

    chart.render()
    drawLinkArea()
    chart.on('afterpaint', function() {
      chart && drawLinkArea()
    })

    /*---------绘制连接区间-----------*/
    function drawLinkArea() {
      var canvas = chart.get('canvas')
      var container = chart.get('backPlot')
      var view1_coord = view1.get('coord')
      var center = view1_coord.center
      var radius = view1_coord.radius
      var interval_geom = chart.getAllGeoms()[1]
      var interval_container = interval_geom.get('shapeContainer')
      var interval_bbox = interval_container.getBBox()
      var view2_coord = view2.get('coord')
      //area points
      var pie_start1 = {
        x: center.x + Math.cos(Math.PI * 2 - otherOffsetAngle) * radius,
        y: center.y + Math.sin(Math.PI * 2 - otherOffsetAngle) * radius
      }
      var pie_start2 = {
        x: center.x + Math.cos(otherOffsetAngle) * radius,
        y: center.y + Math.sin(otherOffsetAngle) * radius
      }
      var interval_end1 = {
        x: interval_bbox.minX,
        y: view2_coord.end.y
      }
      var interval_end2 = {
        x: interval_bbox.minX,
        y: view2_coord.start.y
      }
      var path = [['M', pie_start1.x, pie_start1.y], ['L', pie_start2.x, pie_start2.y], ['L', interval_end2.x, interval_end2.y], ['L', interval_end1.x, interval_end1.y], ['Z']]
      container.addShape('path', {
        attrs: {
          path: path,
          fill: '#e9f4fe'
        }
      })
      canvas.draw()
    }
  }, [])

  const stopChartRender = () => {
    chart.clear()
    chart = null
  }

  useEffect(() => stopChartRender, [])


  return (
    <div id="home-file-g2" className="m-g2"></div>
  )
}

export default HomeG2
