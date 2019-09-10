import http from './http'

export default {
    login(data) {
        return http.post('/api/auth/login', data)
    },
    loginByNuctech(data) {
        return http.post('/api/auth/login/nuctech', data)
    },
    fetchTodos(data) {
        return http.get('/api/tenement', data)
    },
    fetchTodo(id, data) {
        return http.put('/api/todo/' + id, data)
    },
    // -首页
    fetchHomePageinfo(data) {
        return http.get('/api/home/pageinfo', data)
    },
    fetchHomeCalendarPlotInfo(data) {
        return http.get('/api/home/calendar', data)
    },
    // -zip文件上传
    fetchUploadImageStatus(data) {
        return http.get('/api/upload/file', data)
    },
    mergeSimpleUpload(data) {
        return http.post('/uploadApi/upload/merge', data)
        // return http.post('/api/upload/merge', data)
    },
    // -上传文件列表
    fetchPlotUploads(data) {
        return http.get('/api/upload', data)
    },
    // -上传过程的日志
    fetchUploadProcessLog(id, data) {
        return http.get('/api/upload/log/' + id, data)
    },
    fetchPlotUploadBatchDetail(id, data) {
        return http.get('/api/upload/' + id, data)
    },
    deletePlotUploadBatch(id) {
        return http.delete('/api/upload/' + id)
    },
    // -图像标注
    updateImgSuspect(id, data) {
        return http.put('/api/plot/' + id, data)
    },
    // -图像重命名
    renameImage(id, data) {
        return http.put('/api/plot/rename/' + id, data)
    },
    // -图像打包
    packPlotImages(data) {
        return http.post('/api/plot/pack', data)
    },
    // -文件下载
    fetchPlotDownloads(data) {
        return http.get('/api/download', data)
    },
    deletePlotDownload(id, data) {
        return http.delete('/api/download/' + id, data)
    },
    recordDownloadCount(id, data) {
        return http.post('/api/download/' + id, data)
    }
}
