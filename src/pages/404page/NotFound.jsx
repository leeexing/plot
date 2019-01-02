import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import './style.less'
import notFoundImg from 'assets/404.jpg'

class NotFound extends Component {
  constructor (props) {
    super(props)
    this.state = {
      remainTime: 3
    }
  }
  componentDidMount () {
    // let timer = setInterval(() => {
    //   this.setState({
    //     remainTime: this.state.remainTime - 1
    //   })
    //   if (this.state.remainTime === 0) {
    //     clearInterval(timer)
    //     this.props.history.push('')
    //   }
    // }, 1000)
  }
  render () {
    return (
      <div className="notfound">
        <div className="notfound-img">
          <img src={notFoundImg} alt=""/>
        </div>
        <h2>你想访问的页面不存在</h2>
        <p>{this.state.remainTime}秒后 <Link className="notfound-back" to="/">返回首页</Link></p>
      </div>
    )
  }
}

export default withRouter(NotFound)
