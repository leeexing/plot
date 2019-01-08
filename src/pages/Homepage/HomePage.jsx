import React, { Component } from 'react'
// import { Icon, Pagination, Tooltip } from 'antd'
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
        首页
      </div>
    )
  }
}

export default HomePage
