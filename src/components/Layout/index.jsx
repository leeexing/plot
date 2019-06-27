import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Layout, BackTop } from 'antd'

import './index.less'
import Header from 'components/Header'
import { MenuSider } from 'components/Sider'
import Upload from 'components/GlobalUploader'
import SignalrMessage from 'components/Signalr'


class WebLayout extends Component {

  static propTypes = {
    children: PropTypes.node
  }

  render() {
    return (
      <Layout className="app-container">
        <div className="main-wrapper">
          <MenuSider />
          <div className="app-main">
            <Header />
            <div className="content-wrapper">
              {this.props.children}
            </div>
          </div>
        </div>
        <Upload />
        <SignalrMessage />
        <BackTop target={() => document.querySelector('.content-wrapper')} style={{ right: '30px' }} />
      </Layout>
    )
  }
}

export default WebLayout
