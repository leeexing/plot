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
    // -首页
    fetchHomePageinfo (data) {
        return http.get('/api/home/pageinfo', data)
    },
    // -文件上传
    fetchUploadImageStatus (data) {
        return http.get('/api/upload/image', data)
    },
    mergeSimpleUpload (data) {
        return http.post('/api/upload/merge', data)
    },
    // -在线标注
    fetchPlotUploads (data) {
        return http.get('/api/plot/uploads', data)
    },
    fetchPlotDownloads (data) {
        return http.get('/api/plot/downloads', data)
    },
    deletePlotDownload (id, data) {
        return http.delete('/api/plot/downloads/' + id, data)
    },
    fetchPlotUploadBatchDetail (id, data) {
        return http.get('/api/plot/uploads/' + id, data)
    },
    deletePlotUploadBatch (id) {
        return http.delete('/api/plot/uploads/' + id)
    },
    packPlotImages (data) {
        return http.post('/api/plot/pack', data)
    },
    // -以下为测试
    testBlob (data, options) {
        return http.post('/api/tenement/tbuser', data, options)
    }
}
