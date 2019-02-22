import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Button, Divider, Table } from 'antd'


@inject('appStore')
@observer
class ImageBatchList extends Component {

  constructor (props) {
    super(props)
    this.state = {
      columns: [],
      dataSource: [],
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
    this.setState({
      dataSource: [
        {
          key: '1',
          name: '批次一',
          age: 32,
          address: '2019-02-21 14:56:12'
        }, {
          key: '2',
          name: '批次二',
          age: 42,
          address: '2019-02-22 11:56:34'
        }
      ],
      columns: [
        {
          title: '批次名',
          dataIndex: 'name',
          key: 'name',
        }, {
          title: '大小(M)',
          dataIndex: 'age',
          key: 'age',
        }, {
          title: '上传时间',
          dataIndex: 'address',
          key: 'address',
        },
        {
          title: '操作',
          key: 'operation',
          width: 150,
          render: (text, record) => (
            <span>
              <Button onClick={this.onHandlePlot} type="primary" size="small">详情</Button>
              <Divider type="vertical" />
              <Button type="danger" size="small">删除</Button>
            </span>
          )
        }
      ]
    })
    // -其他请求获取图像标记列表
    // api.fetchDRImages(data).then(res => {
    //   console.log(res)
    //   if (res.result) {
    //     this.setState({
    //       imageList: res.data.images,
    //       total: res.data.count
    //     })
    //   }
    // }).catch(console.log)
  }

  onHandlePlot = (data) => {
    this.props.appStore.updateNavBreadcrumb([
      {
        path: '/plot',
        breadcrumbName: '标图素材'
      },
      {
        path: '/plotDetail',
        breadcrumbName: '在线标图'
      }
    ])
    this.props.history.push('/plot/1')
  }

  render () {
    return (
      <div>
        <Table dataSource={this.state.dataSource} columns={this.state.columns} />
      </div>
    )
  }
}

export default ImageBatchList


