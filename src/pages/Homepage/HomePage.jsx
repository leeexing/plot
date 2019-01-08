import React, { Component } from 'react'
import { Pagination } from 'antd'
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
        <div className="image-content">
          <ul className="image-container">
          {
            this.state.imageList.map((item, index) => (
              <li className="image-list" key={index}>
                <div className="image-item">
                  <div className="image-wrap">
                    <img className="thumbnail" src={item.thumbnails[0].url} alt="" />
                  </div>
                  <h3 className="image-name">{}</h3>
                </div>
              </li>
            ))
          }
          </ul>
        </div>
        <div className="pagination">
          <Pagination showQuickJumper defaultCurrent={this.state.currentPage}
            defaultPageSize={20}
            total={this.state.total}
            onChange={this.onChange} />
        </div>
      </div>
    )
  }
}

export default HomePage
