import http from './http'

export default {
    login (data) {
        return http.post('/api/login', data)
    },
    loginByNuctech (data) {
    return http.post('/api/auth/login/nuctech', data)
    },
    fetchTodos (data) {
        return http.get('/api/tenement', data)
    },
    fetchTodo (id, data) {
        return http.put('/api/todo/' + id, data)
    },
    // -首页
    fetchHomePageinfo (data) {
        return http.get('/api/home/pageinfo', data)
    },
    // -zip文件上传
    fetchUploadImageStatus (data) {
        return http.get('/api/upload/file', data)
    },
    mergeSimpleUpload (data) {
        return http.post('/api/upload/merge', data)
    },
    // -上传文件列表
    fetchPlotUploads (data) {
        return http.get('/api/upload', data)
    },
    fetchPlotUploadBatchDetail (id, data) {
        return http.get('/api/upload/' + id, data)
    },
    deletePlotUploadBatch (id) {
        return http.delete('/api/upload/' + id)
    },
    // -在线标注打包
    packPlotImages (data) {
        return http.post('/api/plot/pack', data)
    },
    // -文件下载
    fetchPlotDownloads (data) {
        return http.get('/api/download', data)
    },
    deletePlotDownload (id, data) {
        return http.delete('/api/download/' + id, data)
    },
    recordDownloadCount (id, data) {
        return http.post('/api/download/' + id, data)
    }
}
