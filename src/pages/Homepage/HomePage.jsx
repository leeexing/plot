import React, { Component } from 'react'
import { Row, Col, Card, Spin } from 'antd'

import PlotOverview from 'components/G2/PlotOverview'
import Distribute from 'components/G2/Distribute'
import DrCount from 'components/G2/DrCount'
import FileStruc from 'components/G2/Directory'
import api from '@/api'
import './style.less'

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
      loading: true
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
  }

  render () {
    let { drAngleView, plotRank, plotOverview, loading } = this.state
    return (
      <div className="app-home">
        <Row gutter={15} style={{marginBottom: '10px'}}>
          <Col span={12}>
            <Card title="上传文件目录结构示例">
              <FileStruc></FileStruc>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="标注图像概览">
              {loading
                ? <Spin size="large" />
                : plotOverview.filter(item => item !== 0).length > 1
                  ? <PlotOverview plotOverview={plotOverview}></PlotOverview>
                  : <PlotOverview plotOverview={plotOverview.map(item => 10 + Math.floor(Math.random() * 30))} type="demo" />
              }
            </Card>
          </Col>
        </Row>
        <Row gutter={15}>
          <Col span={12}>
            <Card title="图像类型分布">
              {loading
                ? <Spin size="large" />
                : drAngleView.some(item => item !== 0)
                  ? <DrCount drViewData={drAngleView}></DrCount>
                  : '暂无数据'
              }
            </Card>
          </Col>
          <Col span={12}>
            <Card title="在线标注排行榜(Top5)">
              {loading
                ? <Spin size="large" />
                : plotRank.length > 0
                  ? <Distribute plotRank={plotRank}></Distribute>
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
