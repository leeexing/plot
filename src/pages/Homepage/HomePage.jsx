import React, { Component } from 'react'
import { Card } from 'antd'
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
    // this.fetchData()
  }
  fetchData () {
    let data = {
      page: this.state.currentPage,
      limit: 20,
    }
    api.fetchDRImages(data).then(res => {
      console.log(res)
      if (res.result) {
        this.setState({
          imageList: res.data.images,
          total: res.data.count
        })
      }
    }).catch(console.log)
  }
  onChange = (pageNumber) => {
    console.log('Page: ', pageNumber)
  }
  render () {
    return (
      <div className="app-home">
        <div className="home-material">
          <Card
            hoverable
            cover={<img alt="example" src="https://cn.bing.com/az/hprichbg/rb/HeartCranes_ZH-CN5070756418_1920x1080.jpg" />}
          >
            <Card.Meta
              title="在线标图素材一"
              description="上传时间2019-02-19"
            />
          </Card>
          <Card
            hoverable
            cover={<img alt="example" src="https://cn.bing.com/az/hprichbg/rb/BathBach_ZH-CN4601637280_1920x1080.jpg" />}
          >
            <Card.Meta
              title="在线标图素材二"
              description="上传时间2019-02-20"
            />
          </Card>
          <Card
            hoverable
            cover={<img alt="example" src="https://cn.bing.com/az/hprichbg/rb/lantern19_ZH-CN7846752344_1920x1080.jpg" />}
          >
            <Card.Meta
              title="在线标图素材三"
              description="上传时间2019-02-21"
            />
          </Card>

        </div>
      </div>
    )
  }
}

export default HomePage
