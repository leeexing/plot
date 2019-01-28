import http from './http'

export default {
    login (data) {
        return http.post('/api/login', data)
    },
    loginByThirdpart (data) {
    return http.post('/api/auth/login/thirdpart', data)
    },
    fetchTodos (data) {
        return http.get('/api/tenement', data)
    },
    fetchTodo (id, data) {
        return http.put('/api/todo' + id, data)
    },
    // -图像管理
    fetchCaptureImage (data) {
        return http.get('/api/imageCapture', data)
    },
    fetchDRImages (data) {
        return http.get('/api/image/DR', data)
    },
    fetchImageDetail (id, data) {
        return http.get('/api/image/' + id, data)
    },
    fetchImageBaseInfo (id, data) {
        return http.get('/api/image/baseInfo/' + id, data)
    },
    postImageBaseInfo (id, data) {
        return http.post('/api/image/baseInfo/' + id, data)
    },
    fetchCTImages (data) {
        return http.get('/api/image/CT', data)
    },
    distributeImage (id, data) {
        return http.post('/api/image/distribute/' + id, data)
    },
    // -图像上传
    fetchUploadImageStatus (data) {
        return http.get('/api/upload/image', data)
    },
    mergeSimpleUpload (data) {
        return http.post('/api/upload/merge', data)
    },
    // -以下为测试
    testBlob (data, options) {
        return http.post('/api/tenement/tbuser', data, options)
    }
}
