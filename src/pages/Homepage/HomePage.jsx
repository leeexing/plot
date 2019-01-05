import React, { Component } from 'react'
import { Row, Col, Skeleton } from 'antd'
import './style.less'

class HomePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isDataLoaded: false,
    }
  }
  componentDidMount () {
  }
  render () {
    return (
      <div className="app-home">
        <Row gutter={16}>
          <Col span={16}>
            <Skeleton active paragraph={{ rows: 8 }}/>
          </Col>
          <Col span={8}>
            <Skeleton active paragraph={{ rows: 6 }}/>
          </Col>
        </Row>
      </div>
    )
  }
}

export default HomePage
