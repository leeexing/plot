import { autorun, computed, observable, action, runInAction, trace, flow} from 'mobx'
import api from '@/api'

console.group('%c简单学习`Mobx`', 'color:#fa0')
console.groupCollapsed('Mobx <observable.map>')
let test = observable.map(
  {
    myname: 'leeing'
  },
  {
    name: 'my map app' // -用于`spy`调试的名称. name 选项用来给数组一个友好的调试名称，用于 spy 或者 MobX 开发者工具
  }
)
test.set('age', 24)

console.log(test)
console.log(test.toJS())
console.log(test.toJSON())
console.log(test.entries().next())
test.intercept((change) => { // -拦截器
  console.log(test.toJS(), change)
  if (change.name === 'myname') {
    return change
  }
  // test.set('myname',  data.newValue) // !这样会产出循环
})
test.set('myname', 'leecin')
console.log(test.toJS())
test.set('age', 23)
console.log(test.toJS())
console.groupEnd()

console.groupCollapsed('Mobx <observable.box>')
let cityName = observable.box('beijing', {name: 'my box'})
let disposer = autorun(() => {
  console.log(`%c 追踪调试：%s`, 'color: red', cityName.get())
  trace()
}, {name: 'autorun cityName'})
console.log(cityName, disposer)
console.log(cityName.get())
cityName.set('Universe cener')
console.log(cityName.get())
disposer()
cityName.set('Nuctech')
console.log(cityName.get())
console.groupEnd('')

console.groupEnd('简单学习Mobx')

class TodoStore {
  @observable todos = [
    {
      id: 1,
      title: '元旦放假结束后第一天工作',
      isFinished: false
    }
  ]

  @computed get remainingTodos () {
    return this.todos.filter(item => !item.isFinished).length
  }

  @computed get isAllChecked () {
    return this.todos.length > 0 && this.todos.filter(item => item.isFinished).length === this.todos.length
  }

  @action.bound
  toggleTodo (item) {
    item.isFinished = !item.isFinished
  }

  @action.bound
  addTodo (todo) {
    console.log(this, todo)
    this.todos.push(todo)
  }

  @action('删除待办事项')
  deleteTodo = (todo) => {
    this.todos.remove(todo) // -observable array 自带`remove`方法
    console.log(this.todos.toJS())
    /* let index = this.todos.findIndex(item => item.id === id)
    console.log(index)
    this.todos.splice(index, 1) */
  }

  @action('清除所有代办事项')
  clearTodos = () => {
    this.todos.clear() // -自带方法
    // this.todos.length = 0
  }

  @action('待办事项全部完成')
  finishAllTodos = () => {
    this.todos.forEach(item => (item.isFinished = true))
  }

  // -异步处理逻辑
  @action
  getTodos () {
    api.fetchTodos().then(action('获取todos列表', res => {
      console.log(res)
      let newTodos = res.data.tenements.map(item => {
        let obj = {
          id: Math.random(),
          title: item.Name,
          isFinished: false
        }
        return obj
      })
      console.log(newTodos)
      this.todos = [...this.todos, ...newTodos]
    }))
  }

  // -async的写法
  @action
  fetchAsyncTodos = async () => {
    let data = await api.fetchTodos()
    runInAction('更新todos列表', () => {
      this.todos = data.data.tenements.map(item => {
        let obj = {
          id: Math.random(),
          title: item.Name,
          isFinished: false
        }
        return obj
      })
    })
  }

  // -flow写法
  fetchFlowTodos = flow(function *fetchFlowTodosData() {
    try {
      let data = yield api.fetchTodos()
      this.todos = data.data.tenements.map(item => {
        let obj = {
          id: Math.random(),
          title: item.Name,
          isFinished: false
        }
        return obj
      })
    } catch (error) {
      console.log(error)
    }
  })

  // -测试blob
  @action
  testBlob = () => {
    let data = new Array(100).fill('test')
    let blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'})
    let formData = new FormData()
    formData.append('equipmentDataFile', blob)
    let reader = new FileReader()
    reader.readAsBinaryString(blob)
    reader.onload = e => {
      if (e.target.readyState === FileReader.DONE) {
        console.log(e.target)
      }
    }
    console.log(blob)
    api.testBlob(formData, {contentType: 'file'}).then(res => {
      console.log(res)
    }).catch(console.log)
  }
}

export default TodoStore
