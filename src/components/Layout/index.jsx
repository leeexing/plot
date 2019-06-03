import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Layout, BackTop } from 'antd'
import Header from 'components/Header'
import AppSider from 'components/Sider'
import Upload from 'components/GlobalUploader'
// import SignalrMessage from 'components/Signalr'
import './index.less'


// const { Content, Footer, Sider } = Layout


class WebLayout extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    // const siderLayout = { xxl: 4, xl: 3, lg: 3, sm: 0, xs: 0 }
    // const contentLayout = { xxl: 20, xl: 21, lg: 21, sm: 24, xs: 24 }

    return (
      <Layout className="app-container">
        <div className="main-wrapper">
          <AppSider />
          <div className="app-main">
            <Header />
            <div className="content-wrapper">
              {/* <div className="content-inner-wrapper">{this.props.children}</div> */}
              {this.props.children}
              {/* <Footer className="footer">
                © 2019 <Icon type="user" /> Leecin
              </Footer> */}
            </div>
          </div>
        </div>
        <Upload />
        {/* <SignalrMessage /> */}
        <BackTop target={() => document.querySelector('.content-wrapper')} style={{right: '30px'}} />
      </Layout>
    )
  }
}

export default WebLayout
