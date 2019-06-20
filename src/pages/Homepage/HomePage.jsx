import React, { Component } from 'react'
import { Row, Col, Card, Spin } from 'antd'

import './style.less'
import api from '@/api'
import DrCount from 'components/G2/DrCount'
import Calendar from 'components/G2/Calendar'
import PlotTop5 from 'components/G2/PlotTop5'
import PlotOverview from 'components/G2/PlotOverview'

const defaultPlotTopFive = [{
  name: 'John',
  plot: 35654,
}, {
  name: 'Damon',
  plot: 65456,
}, {
  name: 'Patrick',
  plot: 45724,
}, {
  name: 'Mark',
  plot: 13654,
}, {
  name: '示例',
  plot: 23891,
}]

const defaultDrAngleView = [10, 20]


class HomePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isDataLoaded: false,
      imageList: [],
      currentPage: 1,
      total: 0,
      drAngleView: [],
      plotOverview: [0, 0, 0, 0],
      plotRank: [],
      calendarPlot: [],
      calendarMonth: [],
      loading: true,
      calendarLoading: true
    }
  }
  componentDidMount () {
    this.fetchData()
  }
  fetchData () {
    api.fetchHomePageinfo().then(res => {
      console.log(res)
      if (res.result) {
        let { drAngleView, plotOverview, plotRank } = res.data
        this.setState({
          plotOverview,
          drAngleView: drAngleView.length > 0 ? drAngleView : defaultDrAngleView,
          plotRank: plotRank.length > 0 ? plotRank : defaultPlotTopFive
        })
      }
    }).catch(console.log)
      .finally(() => {
        this.setState({
          loading: false
        })
      })

    api.fetchHomeCalendarPlotInfo().then(res => {
      console.log(res)
      let { calendarPlotData, monthes } = res.data
      if (res.result) {
        this.setState({
          calendarPlot: calendarPlotData,
          calendarMonth: monthes
        })
      }
    }).catch(console.log)
      .finally(() => {
        this.setState({
          calendarLoading: false
        })
      })
  }

  render () {
    let { drAngleView, plotRank, plotOverview, loading, calendarPlot, calendarLoading, calendarMonth } = this.state
    let hasPlotOverviewData = plotOverview.filter(item => item !== 0).length > 1
    let hasDrAngleViewData = drAngleView.some(item => item !== 0)
    let plotOverviewTitle = hasPlotOverviewData
                            ? '标注图像概览'
                            : <div>标注图像概览<span style={{color: '#999', fontSize: '12px'}}>(暂无真实图像数据)</span></div>
    let drAngleViewTitle = hasDrAngleViewData
                            ? '图像类型分布'
                            : <div>图像类型分布<span style={{color: '#999', fontSize: '12px'}}>(暂无真实数据)</span></div>
    return (
      <div className="app-home">
        <Row gutter={15} style={{marginBottom: '10px'}}>
          {/* 平台标注日历 */}
          <Col xs={{ span: 24}} md={{ span: 12}}>
            <Card title={<div>平台标注日历<span style={{color: '#999', fontSize: '12px'}}>(近三个月)</span></div>}>
              {calendarLoading
                ? <Spin size="large" />
                : calendarPlot.length > 0
                  ? <Calendar data={calendarPlot} monthes={calendarMonth} />
                  : '暂无数据'
              }
            </Card>
          </Col>
          {/* 标注图像概览 */}
          <Col xs={{ span: 24}} md={{ span: 12}}>
            <Card title={plotOverviewTitle}>
              {loading
                ? <Spin size="large" />
                : hasPlotOverviewData
                  ? <PlotOverview plotOverview={plotOverview}></PlotOverview>
                  : <PlotOverview plotOverview={plotOverview.map(item => 10 + Math.floor(Math.random() * 30))} type="demo" />
              }
            </Card>
          </Col>
        </Row>
        <Row gutter={15}>
          {/* 图像类型分布 */}
          <Col xs={{ span: 24}} md={{ span: 12}}>
            <Card title={drAngleViewTitle}>
              {loading
                ? <Spin size="large" />
                : hasDrAngleViewData
                  ? <DrCount drViewData={drAngleView}></DrCount>
                  : <DrCount drViewData={defaultDrAngleView}></DrCount>
              }
            </Card>
          </Col>
          {/* 在线标注排行榜 */}
          <Col xs={{ span: 24}} md={{ span: 12}}>
            <Card title="在线标注排行榜(Top5)">
              {loading
                ? <Spin size="large" />
                : plotRank.length > 0
                  ? <PlotTop5 plotRank={plotRank} />
                  : '暂无数据'
              }
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default HomePage
