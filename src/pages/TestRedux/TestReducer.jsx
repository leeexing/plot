import React, { Component } from 'react'
import { connect } from 'react-redux'
import { List, BackTop } from 'antd'
import { isEmpty } from 'ramda'
import { setPageTitle, updateInfoList } from '@/storeRedux/actions'


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
    updateInfoList (data) {
      dispatch(updateInfoList(data))
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class TestReducer extends Component {

  componentDidMount () {
    let { setPageTitle, updateInfoList } = this.props
    setPageTitle('B - 页面')
    updateInfoList()
  }

  render () {
    console.log(this.props)
    let { pageTitle, infoList } = this.props
    return (
      <div className="test">
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
        <BackTop style={{right: '20px'}} target={() => document.querySelector('.app-content')}></BackTop>
      </div>
    )
  }
}

export default TestReducer
