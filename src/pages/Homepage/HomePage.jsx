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
  plot: 35654
}, {
  name: 'Damon',
  plot: 65456,
}, {
  name: 'Patrick',
  plot: 45724
}, {
  name: 'Mark',
  plot: 13654
}, {
  name: '示例',
  plot: 23891
}]
const defaultDrAngleView = [10, 20]
const defaultPlotOverview = Array.from({length: 4}, _ => 10 + Math.floor(Math.random() * 30))


class HomePage extends Component {
  constructor(props) {
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

  componentDidMount() {
    this.fetchData()
  }

  fetchData() {
    api.fetchHomePageinfo().then(res => {
      console.log(res)
      if (res.result) {
        let { drAngleView, plotOverview, plotRank } = res.data
        this.setState({
          plotOverview,
          drAngleView,
          plotRank
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

  render() {
    let { drAngleView, plotRank, plotOverview, loading, calendarPlot, calendarLoading, calendarMonth } = this.state
    let hasPlotOverviewData = plotOverview.some(item => item > 0)
    let hasDrAngleViewData = drAngleView.some(item => item > 0)
    let hasPlotRankData = plotRank.length > 0
    let titleStyle = { color: '#999', fontSize: '12px' }
    let plotOverviewTitle = hasPlotOverviewData
                            ? '标注图像概览'
                            : <div>标注图像概览<span style={titleStyle}>(暂无真实图像数据)</span></div>
    let drAngleViewTitle = hasDrAngleViewData
                            ? '图像类型分布'
                            : <div>图像类型分布<span style={titleStyle}>(暂无真实数据)</span></div>
    let plotRankDataTitle = hasPlotRankData
                            ? '在线标注排行榜(Top5)'
                            : <div>在线标注排行榜(Top5)<span style={titleStyle}>(暂无真实排行数据)</span></div>
    plotOverview = hasPlotOverviewData ? plotOverview : defaultPlotOverview
    drAngleView = hasDrAngleViewData ? drAngleView : defaultDrAngleView
    plotRank = hasPlotRankData ? plotRank : defaultPlotTopFive
    return (
      <div className="app-home">
        <Row gutter={15} style={{ marginBottom: '10px' }}>
          {/* 平台标注日历 */}
          <Col xs={{ span: 24 }} md={{ span: 12 }}>
            <Card title={<div>平台标注日历<span style={titleStyle}>(近三个月)</span></div>}>
              {calendarLoading
                ? <Spin size="large" />
                : calendarPlot.length > 0
                  ? <Calendar data={calendarPlot} monthes={calendarMonth} />
                  : '暂无数据'
              }
            </Card>
          </Col>
          {/* 标注图像概览 */}
          <Col xs={{ span: 24 }} md={{ span: 12 }}>
            <Card title={plotOverviewTitle}>
              {loading
                ? <Spin size="large" />
                : <PlotOverview plotOverview={plotOverview}></PlotOverview>
              }
            </Card>
          </Col>
        </Row>
        <Row gutter={15}>
          {/* 图像类型分布 */}
          <Col xs={{ span: 24 }} md={{ span: 12 }}>
            <Card title={drAngleViewTitle}>
              {loading
                ? <Spin size="large" />
                : <DrCount drViewData={drAngleView}></DrCount>
              }
            </Card>
          </Col>
          {/* 在线标注排行榜 */}
          <Col xs={{ span: 24 }} md={{ span: 12 }}>
            <Card title={plotRankDataTitle}>
              {loading
                ? <Spin size="large" />
                : <PlotTop5 plotRank={plotRank} />
              }
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default HomePage
