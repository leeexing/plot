import React, { Component } from 'react'
import { Button } from 'antd'
import { connect } from 'react-redux'

import { setFilterType } from '@/storeRedux/actions'

const mapStateToProps = ({filterType}) => ({filterType})

// - 使用这种复杂一点的写法，可以改变方法名，以及做一些额外的数据处理
// const mapDispatchToProps = (dispatch, ownProps) => {
//   return {
//     changeDisplay (data) {
//       dispatch(setFilterType(data))
//     }
//   }
// }

@connect(
  mapStateToProps,
  { setFilterType }
)
class TodoFooter extends Component {

  handleClick (type) {
    this.props.setFilterType(type)
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
