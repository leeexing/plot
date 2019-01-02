import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Input, Popover } from 'antd'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import 'styles/navBar.less'

const appContent = (
  <div className="douban-app">
    <img className="app-logo" src="https://img3.doubanio.com/f/frodo/144e6fb7d96701944e7dbb1a9bad51bdb1debe29/pics/app/logo.png" alt=""/>
    <h3>豆瓣</h3>
    <img className="app-qr" src="https://img3.doubanio.com/f/frodo/cb278672a7ed5e611bd06d07592cf865a3f5cd91/pics/app/pin.png" alt=""/>
  </div>
)

class NavBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isSignIn: this.props.hasLogin || false,
      current: 'home',
      navItems: [
        {
          name: '豆瓣',
          path: '/home'
        },{
          name: '读书',
          path: '/study'
        },{
          name: '电影',
          path: '/film'
        },{
          name: '音乐',
          path: '/'
        },{
          name: '同城',
          path: '/local'
        },{
          name: '小组',
          path: '/group'
        },{
          name: '阅读',
          path: '/reading'
        },{
          name: 'FM',
          path: '/fm'
        },{
          name: '时间',
          path: '/404'
        },{
          name: '豆品',
          path: '/todo'
        },{
          name: '更多',
          path: '/todoredux'
        },
      ],
      navSecondItems: [
        {
          name: '音乐人',
          path: 'musician'
        }, {
          name: '潮潮豆瓣音乐周',
          path: 'musicweek'
        }, {
          name: '金羊毛计划',
          path: 'plan'
        }, {
          name: '专题',
          path: '/topics'
        },{
          name: '排行榜',
          path: '/chart'
        }, {
          name: '分类浏览',
          path: '/tags'
        }, {
          name:'乐评',
          path: '/reviews'
        }, {
          name: '豆瓣FM',
          path: 'doubanfm'
        }, {
          name: '歌单',
          path: '/songlist'
        }, {
          name: '阿比鹿音乐奖',
          path: '/awards'
        }
      ]
    }
  }
  logout () {
    this.props.dispatch({type: 'LOGOUT'})
    this.props.history.push('/login')
  }
  render () {
    let hasNoLogin = (
      <div className="nav-info">
        <Link to="/login">登录</Link>
        <Link to="/register">注册</Link>
      </div>
    )

    let hasLogin = (
      <div className="nav-info">
        <Link to="/reminder">提醒</Link>
        <Link to="/doumail">豆邮</Link>
        <a onClick={this.logout.bind(this)}>退出</a>
        {/* <Link to="/login" onClick={this.logout.bind(this)}>退出</Link> */}
      </div>
    )
    return (
      <nav className="app-nav">
        <div className="app-nav-bd">
          <div className="nav-items">
            <ul>
              {
                this.state.navItems.map((nav, index) =>
                  <li key={index}><Link to={nav.path}>{nav.name}</Link></li>
                )
              }
            </ul>
          </div>
          <div className="nav-others">
            <div className="nav-doubanapp">
              <Popover content={appContent} placement="bottom">
                <Link to="/doubanapp">下载豆瓣客户端</Link>
              </Popover>
            </div>
            {
              this.state.isSignIn ? hasLogin : hasNoLogin
            }
          </div>
        </div>
        <div className="app-nav-search">
          <div className="nav-wrap">
            <div className="nav-logo">
              <Link to="/">豆瓣音乐</Link>
            </div>
            <div className="nav-search">
            <Input.Search
              placeholder="唱片名、表演者、条码、ISRC"
              enterButton
              style={{width: 500}}
              onSearch={value => console.log(value)}
            />
            </div>
          </div>
        </div>
        <div className="app-nav-secondary">
          <div className="nav-wrap">
            <ul>
              {
                this.state.navSecondItems.map((item, index) =>
                  <li key={index}><Link to={item.path}>{item.name}</Link></li>
                )
              }
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}

let mapStateToProps = ({userInfo}) => {
  return {
    hasLogin: userInfo['hasLogin']
  }
}

export default withRouter(connect(mapStateToProps, null)(NavBar))
