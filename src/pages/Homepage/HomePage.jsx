import React, { Component } from 'react'
import { Row, Col, Card } from 'antd'

import HomeChart from 'components/G2/Home'
import Distribute from 'components/G2/Distribute'
import DrCount from 'components/G2/DrCount'
import api from '@/api'
import './style.less'

class HomePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isDataLoaded: false,
      imageList: [],
      currentPage: 1,
      total: 0
    }
  }
  componentDidMount () {
    this.fetchData()
  }
  fetchData () {
    api.fetchHomePageinfo().then(res => {
      console.log(res)
      if (res.result) {
      }
    }).catch(console.log)
  }
  onChange = (pageNumber) => {
    console.log('Page: ', pageNumber)
  }
  render () {
    return (
      <div className="app-home">
        <Row gutter="15" style={{marginBottom: '10px'}}>
          <Col span="12">
            <Card title="图像标注概览">
              <HomeChart></HomeChart>
            </Card>
          </Col>
          <Col span="12">
            <Card title="图像类型分布">
              <DrCount></DrCount>
            </Card>
          </Col>
        </Row>
        <Row gutter="15">
          <Col span="12">
            <Card title="在线标注排行榜">
              <Distribute></Distribute>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default HomePage
