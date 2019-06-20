import React, { useEffect } from 'react'
import G2 from '@antv/g2'

import { getNowDate } from '@/util'


function Calendar (props) {

  let { data, monthes } = props

  let chart = null

  const monthMap = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二']
  // const monthMap = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const nowDate = getNowDate()


  var Shape = G2.Shape
  var Util = G2.Util
  Shape.registerShape('polygon', 'boundary-polygon', {
    draw: function draw(cfg, container) {
      if (!Util.isEmpty(cfg.points)) {
        var attrs = {
          stroke: '#fff',
          lineWidth: 1,
          fill: cfg.color,
          fillOpacity: cfg.opacity
        }
        var points = cfg.points
        var path = [['M', points[0].x, points[0].y], ['L', points[1].x, points[1].y], ['L', points[2].x, points[2].y], ['L', points[3].x, points[3].y], ['Z']]
        attrs.path = this.parsePath(path)
        var polygon = container.addShape('path', {
          attrs: attrs
        })

        if (cfg.origin._origin.lastWeek) {
          var linePath = [['M', points[2].x, points[2].y], ['L', points[3].x, points[3].y]]
          // 最后一周的多边形添加右侧边框
          container.addShape('path', {
            zIndex: 1,
            attrs: {
              path: this.parsePath(linePath),
              lineWidth: 1,
              stroke: '#404040'
            }
          })
          if (cfg.origin._origin.lastDay) {
            container.addShape('path', {
              zIndex: 1,
              attrs: {
                path: this.parsePath([['M', points[1].x, points[1].y], ['L', points[2].x, points[2].y]]),
                lineWidth: 1,
                stroke: '#404040'
              }
            })
          }
        }
        if (cfg.origin._origin.date === nowDate) {
          container.addShape('path', {
            zIndex: 1,
            attrs: {
              path: this.parsePath([
                ['M', points[1].x, points[1].y],
                ['L', points[2].x, points[2].y],
                ['L', points[3].x, points[3].y],
                ['L', points[0].x, points[0].y],
                ['L', points[1].x, points[1].y]
              ]),
              lineWidth: 1,
              stroke: '#13c2c2'
            }
          })
        }
        container.sort()
        return polygon
      }
    }
  })

  useEffect(() => {
    chart = new G2.Chart({
      container: 'calendar-plot-g2',
      forceFit: true,
      height: 350,
      padding: [60, 20, 40, 60]
    })
    chart.source(data, {
      day: {
        type: 'cat',
        values: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      },
      week: {
        type: 'cat'
      },
      plots: {
        sync: true
      }
    })

    chart.axis('week', {
      position: 'top',
      tickLine: null,
      line: null,
      label: {
        offset: 2,
        textStyle: {
          fontSize: 12,
          fill: '#666',
          textBaseline: 'top'
        },
        formatter: function formatter(val) {
          if (val === '2') {
            return monthMap[monthes[0] - 1]
          } else if (val === '6') {
            return monthMap[monthes[1] - 1]
          } else if (val === '10') {
            return monthMap[monthes[2] - 1]
          }
          return ''
        }
      }
    })
    chart.axis('day', {
      grid: null
    })
    chart.legend(false)
    chart.tooltip({
      title: 'date',
      itemTpl: `<li data-index={index}>
        <span style="background-color:{color};width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:8px;"></span>
        标注数量<span style="margin-left: 20px;">{value}</span>
      </li>`
    })
    chart.coord().reflect('y')
    chart.polygon().position('week*day*date').color('plots', '#bae7ff-#597ef7').shape('boundary-polygon')
    chart.render()
  }, [])

  const stopChartRender = () => {
    chart.clear()
    chart = null
  }

  useEffect(() => stopChartRender, [])


  return (
    <div id="calendar-plot-g2" className="m-g2"></div>
  )
}

export default Calendar
