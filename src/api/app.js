import http from './http'

export default {
    login (data) {
        return http.post('/api/login', data)
    },
    fetchTodos (data) {
        return http.get('/api/tenement', data)
    },
    fetchTodo (id, data) {
        return http.put('/api/todo' + id, data)
    }
}
