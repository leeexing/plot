import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CountUp from 'countup.js'
import './countUp.less'

class Countup extends Component {
  constructor (props) {
    super(props)
    this.state = {
      startValue: this.props.startValue || 0,
      endValue: this.props.endValue,
      decimal: this.props.decimal || 0, // 保留几位小数
      duration: this.props.duration || 2
    }
  }
  componentDidMount () {
    let demo = {}
    demo = new CountUp(this.props.id, this.state.startValue, this.state.endValue, this.state.decimal, this.setState.duration)
    if (!demo.error) {
      demo.start()
    }
  }
  componentDidUpdate () {
    let demo = new CountUp(this.props.id, this.state.startValue, this.props.endValue, this.state.decimal, this.setState.duration)
    if (!demo.error) {
      demo.start()
    }
  }
  render () {
    return (
      <div className="count-up">
        <h2>
          <a id={this.props.id}>{this.state.startValue}</a>
        </h2>
        <p>{this.props.infoText}</p>
      </div>
    )
  }
}

Countup.propTypes = {
  endValue: PropTypes.number.isRequired,
  infoText: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired
}

export default Countup
