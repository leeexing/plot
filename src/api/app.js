import http from './http'

export default {
    login (data) {
        return http.post('/api/login', data)
    },
    todos (data) {
        return http.get('/api/todos', data)
    },
    todo (id, data) {
        return http.put('/api/todo' + id, data)
    }
}
