import React, { Component } from 'react'
import { Button } from 'antd'
import { connect } from 'react-redux'

import { setFilterType } from '@/storeRedux/actions'

const mapStateToProps = state => {
  return {
    filterType: state.filterType
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changeDisplay (data) {
      dispatch(setFilterType(data))
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class TodoFooter extends Component {

  handleClick (type) {
    this.props.changeDisplay(type)
  }

  render () {
    let { filterType } = this.props
    return (
      <div className="todo-footer">
        <Button type={filterType === 'ALL' ? 'primary' : 'default'} onClick={this.handleClick.bind(this, 'ALL')}>ALL</Button>
        <Button type={filterType === 'DONE' ? 'primary' : 'default'} onClick={this.handleClick.bind(this, 'DONE')}>DONE</Button>
        <Button type={filterType === 'NOT_DONE' ? 'danger' : 'default'} onClick={this.handleClick.bind(this, 'NOT_DONE')}>NOT DONE</Button>
      </div>
    )
  }
}

export default TodoFooter
