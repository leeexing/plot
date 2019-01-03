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
    },
    // -以下为测试
    testBlob (data, options) {
        return http.post('/api/tenement/tbuser', data, options)
    }
}
