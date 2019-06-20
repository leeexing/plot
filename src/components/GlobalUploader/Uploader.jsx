import React, { Component } from 'react'
import SparkMD5 from 'spark-md5'
import { inject, observer } from 'mobx-react'
import { notification, Icon, message} from 'antd'

import './style.less'
import api from '@/api'
import Auth from '@/util/auth'
import { kebabCase } from '@/util'
import UploadList from './UploadList'
import { baseURL } from '@/api/config'
import Uploader from 'simple-uploader.js'


const FILE_ADDED_EVENT = 'fileAdded'
const FILES_ADDED_EVENT = 'filesAdded'
const UPLOAD_START_EVENT = 'uploadStart'
const ACCEPT_CONFIG = {
  image: ['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
  video: ['.mp4', '.rmvb', '.mkv', '.wmv', '.flv'],
  document: ['.zip'],
  // document: ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.pdf', '.txt', '.tif', '.tiff', '.zip', '.rar'],
  getAll () {
    return [...this.document]
    // return [...this.image, ...this.video, ...this.document]
  }
}


@inject('appStore')
@observer
class ImageUpload extends Component {

  constructor (props) {
    super(props)
    this.state = {
      options: {
        target: baseURL + '/v1/api/upload/file',
        chunkSize: '2048000',
        fileParameterName: 'upfile',
        testChunks: true, // 是否开启秒传
        maxChunkRetries: 3,
        checkChunkUploadedByResponse: function (chunk, message) {
          let objMessage = JSON.parse(message)
          if (objMessage.skipUpload) {
            return true
          }
          return (objMessage.uploaded || []).indexOf(chunk.offset + 1) >= 0
        },
        headers: {
          Authorization: Auth.getToken() && 'Bearer ' + Auth.getToken()
        },
        identifier: null
      },
      fileStatusText: {
        success: '成功' || 'success',
        error: '错误' || 'error',
        uploading: '上传' || 'uploading',
        paused: '暂停' || 'paused',
        waiting: '等待' || 'waiting'
      },
      autoStart: true,
      started: false,
      files: [],
      fileList: [],
      md5Arr: [],
      identifier: null,
      fileSize: 0
    }
  }

  uploadStart () {
    this.setState({
      started: true
    })
  }
  fileAdded = file => {
    this.computeMD5(file)
    if (file.ignored) { // is ignored, filter it
      return false
    }
  }
  filesAdded = (files, fileList) => {
    if (files.ignored || fileList.ignored) { // is ignored, filter it
      return false
    }
  }
  computeMD5 (file) {
    let fileReader = new FileReader()
    let time = new Date().getTime()
    let md5 = ''
    this.statusSet(file.id, 'md5')
    file.pause()
    fileReader.readAsArrayBuffer(this.extracrtMd5Blob(file.file))
    fileReader.onload = e => {
      if (file.size < 1024 * 1024 * 1024 && file.size !== e.target.result.byteLength) {
        this.error('Browser reported success but could not read the file until the end.')
        file.cancel()
        return
      }
      md5 = SparkMD5.ArrayBuffer.hash(e.target.result)
      this.uploader.opts.query = {
        ...this.params
      }
      // 防止上传两个内容一样的文件
      if (this.state.md5Arr.findIndex(md => md === md5) > -1) {
        file.cancel()
        this.error(`与 ${file.name} 内容相同的文件在同时上传。请勿同时重复上传！`)
        return
      }
      file.uniqueIdentifier = md5
      let md5Arr = [...this.state.md5Arr, md5]
      this.setState({
        md5Arr,
        identifier: md5,
        fileSize: e.target.result.byteLength
      })
      file.resume()
      this.statusRemove(file.id)
      console.log(`MD5计算完毕：${file.id} ${file.name} MD5：${md5} 用时：${new Date().getTime() - time} ms`)
    }
    fileReader.onerror = (err) => {
      console.log(err)
      this.error(`文件${file.name}读取出错，请检查该文件`)
      file.cancel()
    }
  }
  extracrtMd5Blob (file) {
    let { size } = file
    if (size > 1024 * 1024 * 1024) {
      return file.slice(-1024 * 1024 * 200, size)
    }
    return file
  }
  statusSet (id, status) {
    let statusMap = {
      md5: {
        text: 'res.checkMD5',
        bgc: '#fff'
      },
      transcoding: {
        text: 'res.transcoding',
        bgc: '#e2eeff'
      },
      failed: {
        text: 'res.uploadFail',
        bgc: '#e2eeff'
      }
    }
    console.log(statusMap)
  }
  statusRemove (id) {
    // console.log(id)
  }
  fileRemoved = (file) => {
    this.setState({
      files: this.uploader.files,
      fileList: this.uploader.fileList
    })
  }
  filesSubmitted = (files, fileList) => {
    this.setState({
      files: this.uploader.files,
      fileList: this.uploader.fileList
    })
    if (this.state.autoStart) {
      this.uploader.upload()
    }
  }
  allEvent = (...args) => {
    const name = args[0]
    const EVENTSMAP = {
      [FILE_ADDED_EVENT]: true,
      [FILES_ADDED_EVENT]: true,
      [UPLOAD_START_EVENT]: 'uploadStart'
    }
    const handler = EVENTSMAP[name]
    if (handler) {
      if (handler === true) {
        return
      }
      this[handler].apply(this, args.slice(1))
    }
    args[0] = kebabCase(name)
    // console.log('allEvent:', args)
  }
  onFileProgress = (rootFile, file, chunk) => {
    console.log(`上传中 ${file.name}，chunk：${chunk.startByte / 1024 / 1024} ~ ${chunk.endByte / 1024 / 1024}`)
  }
  onFileError = (rootFile, file, response, chunk) => {
    message.error(response)
  }
  error = (msg) => {
    notification.error({
      message: '提示',
      description: msg,
      duration: 3000
    })
  }
  onFileSuccess = (rootFile, file, response, chunk) => {
    console.log('the file has been uploaded successfully')
    let res = JSON.parse(response)
    if (!res.result) {
      message.error(res.message)
      return
    }
    if (res.needMerge) {
      let mergeData = {
        tempName: res.tempName,
        identifier: file.uniqueIdentifier,
        fileName: file.name,
        fileSize: file.size,
        ...this.params
      }
      api.mergeSimpleUpload(mergeData).then(res => {
        let md5Arr = this.state.md5Arr.filter(item => item !== file.uniqueIdentifier)
        this.setState({
          md5Arr
        })
        if (res.status === 205) {
          console.log('%c大文件处理中', 'background: #f90')
        }
        if (res.status === 0) {
          console.log('上传成功，转码中')
          this.statusSet(file.id, 'transcoding')
        } else if (res.status === 1) {
          console.log('上传失败')
        } else if (res.status === 200) {
          console.log('上传成功')
        }
      }).catch(e => {
        this.statusSet(file.id, 'failed')
      })
    } else {
      console.log('文件上传成功')
    }
  }

  toggleUploaderMini (value) {
    this.props.appStore.toggleUploaderMini(value)
  }

  closeUploader = () => {
    this.props.appStore.toggleUploaderGlobal(false)
  }

  componentDidMount () {
    const uploader = new Uploader(this.state.options)
    this.uploader = uploader
    this.uploader.fileStatusText = this.state.fileStatusText
    uploader.on('catchAll', this.allEvent.bind(this))
    uploader.on(FILE_ADDED_EVENT, this.fileAdded.bind(this))
    uploader.on(FILES_ADDED_EVENT, this.filesAdded.bind(this))
    uploader.on('fileRemoved', this.fileRemoved)
    uploader.on('filesSubmitted', this.filesSubmitted.bind(this))

    uploader.on('fileProgress', this.onFileProgress.bind(this))
    uploader.on('fileSuccess', this.onFileSuccess.bind(this))
    uploader.on('fileError', this.onFileError.bind(this))

    this.uploader.assignBrowse(this.refs.uploadBtn, false, false, {accept: ACCEPT_CONFIG.getAll()})
  }

  componentWillUnmount () {
    const uploader = this.uploader
    uploader.off('catchAll', this.allEvent)
    uploader.off(FILE_ADDED_EVENT, this.fileAdded)
    uploader.off(FILES_ADDED_EVENT, this.filesAdded)
    uploader.off('fileRemoved', this.fileRemoved)
    uploader.off('filesSubmitted', this.filesSubmitted)
    this.uploader = null
  }

  render () {
    let isUploadShow = this.props.appStore.isUploadShow
    let isMini = this.props.appStore.isUploaderMini
    let uploaderClassName = ''
    uploaderClassName += isUploadShow ? ' upload-show' : ''
    uploaderClassName += isMini ? ' mini' : ''
    return (
      <div className={"m-uploader" + uploaderClassName}>
        <div className="uploader-operate">
          {
            isMini
            ? <Icon type="arrow-left" onClick={this.toggleUploaderMini.bind(this, false)}/>
            : <Icon type="arrow-right" onClick={this.toggleUploaderMini.bind(this, true)}/>
          }
          <Icon type="close" onClick={this.closeUploader} />
        </div>
        <div className="uploader">
          <div className="upload-button" ref="uploadBtn">
            <Icon type="cloud-upload"></Icon>
            {/* <Icon type="plus"></Icon> */}
            {/* <span>上传</span> */}
          </div>
          <UploadList fileList={this.state.fileList}></UploadList>
        </div>
      </div>
    )
  }
}

export default ImageUpload
