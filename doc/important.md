# Important

TOC

* webpack 相关配置
* react-router 报错
* axios 请求超时
* react-router Redirect
* npm run build/patch
* react-router
* mobx
* 备份小头像地址
* 关于页面文档

## webpack相关配置

REFER: https://www.webpackjs.com/plugins/uglifyjs-webpack-plugin/

1.压缩混淆
2.create-react-app webpack配置打包清除console.log

```js
// -压缩混淆
new UglifyJsPlugin({
  compress: {
    drop_console: true
  }
})
```

3.自动化分析

```js
// -打包优化分析
new BundleAnalyzerPlugin({ analyzerPort: 8919 })
```

4.`CommonsChunkPlugin` 这个已经被`webpack` 弃用了

```js
// -提取公共文件
new webpack.optimize.CommonsChunkPlugin({
  name: 'vendor',
  filename: 'vendor.bundle.js'
}),
```

5.url-loader 图片压缩

```js
test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
loader: require.resolve('url-loader'),
options: {
  limit: 50000,
  // limit: 10000,
  name: 'static/media/[name].[hash:8].[ext]',
},
```

通过配置 url-loader 的 limit 选项，可以根据图片大小来决定是否进行 base64 编码。这次配置的是：小于 20kb 的图片进行 base64 编码。

另外一种方式

图片压缩需要使用 img-loader ，除此之外，针对不同的图片类型，还要引用不同的插件。比如，我们项目中使用的是 png 图片，因此，需要引入 imagemin-pngquant ，并且指定压缩率。

```js
use: [
  {
    loader: require.resolve('url-loader'),
    options: {
      // limit: 50000,
      limit: 10000,
      name: 'static/media/[name].[hash:8].[ext]',
    },
  },
  {
    loader: "img-loader",
    options: {
      plugins: [
        require("imagemin-pngquant")({
          quality: [0.4, 0.6] // the quality of zip 指定压缩率
        })
      ]
    }
  }
]
```

可以进一步的缩小图片体积

最后，**这个方法更好**：

```js
use: [
  {
    loader: require.resolve('url-loader'),
    options: {
      limit: 10000, // -size <= 1KB
      name: 'static/media/[name].[hash:8].[ext]',
    },
  },
  {
    loader: 'image-webpack-loader',
    options: {
      mozjpeg: {
        progressive: true,
        quality: 65
      },
      // optipng.enabled: false will disable optipng
      optipng: {
        enabled: false,
      },
      pngquant: {
        quality: '65-90',
        speed: 4
      },
      gifsicle: {
        interlaced: false,
      },
      // the webp option will enable WEBP
      webp: {
        quality: 75
      }
    }
  },
  // {
  //   loader: "img-loader",
  //   options: {
  //     plugins: [
  //       require("imagemin-pngquant")({
  //         quality: [0.4, 0.6] // the quality of zip 指定压缩率
  //       })
  //     ]
  //   }
  // }
]
```

 TIP: -
图片一部分没有出现在 `media` 打包文件夹中，是因为一部分图片被处理成 base64 的数据格式了

## react-router报错

```js
// 之前是这么写的
if (item.component && item.children) {
  const childRoutes = this.renderRoutes(item.children, newCtxPath)
  children.push(
    <Route
      key={newCtxPath}
      render={props => <item.component {...props}>{childRoutes}</item.component>}
    />
  )
} else if (item.component) {
  // NOTE: 这里会报错。
  children.push(
    <Route
      exact
      key={newCtxPath}
      path={newCtxPath}
      component={item.component}
    />
  )
} else if (item.children) {
  item.children.forEach(item => renderRoute(item, newCtxPath))
}
```

报错信息：
**Warning: Failed prop type: Invalid prop `component` of type `object` supplied to `Route`, expected `function`**
主要原因可能是因为
由于添加了 `@loadable/component` 进行懒加载，结果报错

然后搜索相关资料，修改如下，可以了

```js
// 修改之后
if (item.component && item.children) {
  const childRoutes = this.renderRoutes(item.children, newCtxPath)
  children.push(
    <Route
      key={newCtxPath}
      render={props => <item.component {...props}>{childRoutes}</item.component>}
    />
  )
} else if (item.component) {
  let PView = item.component // UPDATE: 这里修改了
  children.push(
    <Route
      exact
      key={newCtxPath}
      path={newCtxPath}
      render={props => <PView {...props} />}
    />
  )
} else if (item.children) {
  item.children.forEach(item => renderRoute(item, newCtxPath))
}
```

## axios 请求超时

REFER: https://juejin.im/post/5abe0f94518825558a06bcd9

```js
//在main.js设置全局的请求次数，请求的间隙
axios.defaults.retry = 4;
axios.defaults.retryDelay = 1000;

axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
  var config = err.config;
  // If config does not exist or the retry option is not set, reject
  if (!config || !config.retry) return Promise.reject(err);

  // Set the variable for keeping track of the retry count
  config.__retryCount = config.__retryCount || 0;

  // Check if we've maxed out the total number of retries
  if (config.__retryCount >= config.retry) {
    // Reject with the error
    return Promise.reject(err);
  }

  // Increase the retry count
  config.__retryCount += 1;

  // Create new promise to handle exponential backoff
  var backoff = new Promise(function (resolve) {
    setTimeout(function () {
      resolve();
    }, config.retryDelay || 1);
  });

  // Return the promise in which recalls axios to retry the request
  return backoff.then(function () {
    return axios(config);
  });
});
```

## react-router Redirect

react中路由重定向

```jsx
} else if (item.children) {
    item.children.forEach(item => renderRoute(item, newCtxPath))
  } else {
    children.push(
      <Route
        key="redirect"
        path="/"
        exact
        render={() => (
          this.props.userStore.isLogined
          ? <Redirect to="/home"/>
          : <Redirect to="/login"/>
        )}
      />
    )
  }
```

目前是这么处理的。通过是否登录与否进行相应的路由跳转

## npm run build/patch

> 针对不同场景进行打包

有两种业务场景需要打包

* 线上部署环境  npm run build
* 测试环境      npm run build:test

三个地方需要修改

1. scripts/build.js (modify)
2. scripts/start.js (modify)
3. scripts/build_test.js (create)
4. config/env.js (modify)

```js 重要需改
// HERE: build.js
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';
+ process.env.BUILD_TYPE = 'production';

// HERE: build_test.js (new)
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';
+ process.env.BUILD_TYPE = 'test';

// HERE: start.js
+ process.env.BABEL_ENV = 'development';
+ process.env.NODE_ENV = 'development';
+ process.env.BUILD_TYPE = 'development';

// HERE: env.js
{
  // Useful for determining whether we’re running in production mode.
  // Most importantly, it switches React into the correct mode.
  NODE_ENV: process.env.NODE_ENV || 'development',
  + BUILD_TYPE: process.env.BUILD_TYPE || 'production',
  // Useful for resolving the correct path to static assets in `public`.
  // For example, <img src={process.env.PUBLIC_URL + '/img/logo.png'} />.
  // This should only be used as an escape hatch. Normally you would put
  // images into the `src` and `import` them in code to get their paths.
  PUBLIC_URL: publicUrl,
}
```

最后在 `src/api/config.js`中使用

```js
const baseUrlMap = {
  test: 'https://stgplotapi.anjianba.cn',
  development: 'http://localhost:5281',
  production: 'https://plotapi.anjianba.cn'
}
const signalrUrlMap = {
  test: 'https://stgws.anjianba.cn/browser',
  development: 'https://stgws.anjianba.cn/browser',
  production: 'https://debug.anjianba.cn:8080/browser'
}

const TOKEN_KEY = 'source_data_ols_token'
const baseURL = baseUrlMap[process.env.BUILD_TYPE]
const SIGNALR_URL = signalrUrlMap[process.env.BUILD_TYPE]

window.localStorage.setItem('app_api_url', baseURL + '/v1/')

export {
  baseURL,
  TOKEN_KEY,
  SIGNALR_URL
}
```

`env.js` 那里一定要添加，不然在 `config.js` 中获取不到 `process.env.BUILD_TYPE` 的值

## react-router

> 如何在`axios`中进行路由跳转

```js
import { BrowserRouter } from 'react-router-dom'


const router = new BrowserRouter()
const routeSkip = path => {
  router.history.push(path)
  router.history.go()
}

service.interceptors.response.use(response => {
  if (!response.data.result) {
    return Promise.reject(response.data.msg)
  }
  return response
}, error => {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        console.log('%c ❗❗❗ 通过服务器进行权限限制 ', 'background:#f90;color:#555')
        // console.log(router.history)
        routeSkip('/login')
        return Promise.reject(error.response)
      case 500:
        message.error('Server Error')
        routeSkip('/500')
        return Promise.reject(error.response)
      default:
        return Promise.reject(error.response)
    }
  } else {
    routeSkip('/login')
  }
})
```

## mobx

```js csdn上面也会过期
// 失效：
useStrict(true)

// 需要这么改
import { configure } from 'mobx'

// 不允许在动作外部修改状态
configure({ enforceActions: 'observed' })

```

```js TodoFooter也可以这么写
import React from 'react'
import { Button, Checkbox, Tag } from 'antd'
import { inject, observer } from 'mobx-react'

const TodoFooter = inject('todoStore')(observer({finishAllTodos, remainingTodos, clearTodos} => (
  <footer className="todo-footer">
    <label>
      <Checkbox checked={props.isAllChecked} onChange={props.finishAllTodos.bind(this)}></Checkbox>
    </label>
    <Tag>还剩 {props.remainingTodos} 项未完成</Tag>
    <Button type="danger" size="small" onClick={props.clearTodos}>清楚全部已完成</Button>
  </footer>
)))
```

```js 可以在组件里面实时计算想要的值
class User {
  @observable name
}

class Profile extends React.Component {
  @computed get name() {
    // 正确的; 计算属性会追踪 `user.name` 属性
    return this.props.user.name
  }

  render() {
    return <div>{this.name}</div>
  }
}
```

### when

```js
class MyResource {
    constructor() {
        when(
            // 一旦...
            () => !this.isVisible,
            // ... 然后
            () => this.dispose()
        );
    }

    @computed get isVisible() {
        // 标识此项是否可见
    }

    dispose() {
        // 清理
    }
}
```

## 备份小头像地址

```js
const avatarSrc = [
  'https://plotapi.anjianba.cn/images/plotrank/patrick.png',
  'https://plotapi.anjianba.cn/images/plotrank/damon.png',
  'https://plotapi.anjianba.cn/images/plotrank/stewardess.png',
  'https://plotapi.anjianba.cn/images/plotrank/seaman.png',
  'https://plotapi.anjianba.cn/images/plotrank/pilot.png',
  'https://zos.alipayobjects.com/rmsportal/mYhpaYHyHhjYcQf.png',
  'https://zos.alipayobjects.com/rmsportal/JBxkqlzhrlkGlLW.png',
  'https://zos.alipayobjects.com/rmsportal/KzCdIdkwsXdtWkg.png',
]
```

## 关于页面文档

1、图像上传
图像要求：单个的.img文件或者是同包裹名称相同的.img和.jpg文件，jpg文件供生成缩略图使用
图像处理：将.img文件（或者.img和.jpg文件）按照以下方法整理成压缩包目前仅支持.zip压缩包文件，
方法一直接压缩，所有图像的img（或者.img和.jpg文件）文件放在一个文件夹内：全选.img文件—>右键—>发送到—>压缩（zipped）文件夹
方法二间接压缩，一个.img文件（或者.img和.jpg文件）放到文件夹内对应一个文件夹，全选所有文件夹生成zip压缩包：全选文件夹—>右键—>发送到—>压缩（zipped）文件夹；

2、标记图像
步骤：素材列表——>详情——>点击图像——>图像全屏预览模式——>使用鼠标中键标记危险品位置即可；

3、标图下载
步骤一打包图像：素材列表——>详情——>点击下载标志【 】——>选择图像——>输入下载包名称——>点击“下载”——图像打包成功；

步骤二标图下载：标图下载——>选择要下载的图包——>点击“下载”——>下载成功供后续使用
