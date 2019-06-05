import React, { Component } from 'react'
import { Row, Col, Card } from 'antd'

import HomeChart from 'components/G2/Home'
import Distribute from 'components/G2/Distribute'
import DrCount from 'components/G2/DrCount'
import FileStruc from 'components/G2/Directory'
import api from '@/api'
import './style.less'

class HomePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isDataLoaded: false,
      imageList: [],
      currentPage: 1,
      total: 0,
      drRank: null,
      drAngleView: []
    }
  }
  componentDidMount () {
    this.fetchData()
  }
  fetchData () {
    api.fetchHomePageinfo().then(res => {
      console.log(res)
      if (res.result) {
        this.setState({
          drAngleView: res.data.drAngleView
        })
      }
    }).catch(console.log)
  }
  onChange = (pageNumber) => {
    console.log('Page: ', pageNumber)
  }
  render () {
    let { drAngleView, drRank } = this.state
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
              <HomeChart></HomeChart>
            </Card>
          </Col>
        </Row>
        <Row gutter={15}>
          <Col span={12}>
            <Card title="图像类型分布">
              {drAngleView.every(item => item === 0)
                ? '暂无数据'
                : <DrCount drViewData={drAngleView}></DrCount>
              }
            </Card>
          </Col>
          <Col span={12}>
            <Card title="在线标注排行榜">
              {drRank
                ? <Distribute></Distribute>
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
