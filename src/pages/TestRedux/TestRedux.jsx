import React, { Component } from 'react'
import { connect } from 'react-redux'
import { List } from 'antd'
import { isEmpty } from 'ramda'

import { setPageTitle, setInfoList } from '@/storeRedux/actions'


const mapStateToProps = state => {
  return {
    pageTitle: state.pageTitle,
    infoList: state.infoList
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setPageTitle (data) {
      dispatch(setPageTitle(data))
    },
    setInfoList (data) {
      dispatch(setInfoList(data))
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class TestRedux extends Component {

  componentDidMount () {
    let {setPageTitle, setInfoList} = this.props

    setPageTitle('新的标题')

    setInfoList()
  }

  render () {
    let { pageTitle, infoList } = this.props
    return (
      <div>
        <h1 style={{marginBottom: '10px'}}>{pageTitle}</h1>
        {isEmpty(infoList)
          ? null
          : <List
            header={<div>Header</div>}
            footer={<div>Footer</div>}
            bordered
            dataSource={infoList}
            renderItem={item => (<List.Item>{item.Name}</List.Item>)}
          />
        }
      </div>
    )
  }
}

export default TestRedux
