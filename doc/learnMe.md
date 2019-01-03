# Learn

TOC

1. mobx

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