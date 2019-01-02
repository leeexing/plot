# source-data-ols

源数据管理平台线上服务


## .eslintrc

配置语法检查

## .eslintignore

忽略某些文件的语法检查

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
