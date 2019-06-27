import Message from 'pages/Message'
import Todo from 'pages/Todos'

export default {
  path: 'test',
  children: [
    { path: 'todo', name: '待办', component: Todo },
    { path: 'message', name: '消息', component: Message }
  ]
}