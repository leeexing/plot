import React, { Component } from 'react'
import { notification, Icon, message} from 'antd'
import { inject, observer } from 'mobx-react'
import { baseURL } from '@/api/config'
import Auth from '@/util/auth'
import SparkMD5 from 'spark-md5'
import Uploader from 'simple-uploader.js'
import api from '@/api'
import { kebabCase } from '@/util'
import UploadList from './UploadList'
import './style.less'


const FILE_ADDED_EVENT = 'fileAdded'
const FILES_ADDED_EVENT = 'filesAdded'
const UPLOAD_START_EVENT = 'uploadStart'
const ACCEPT_CONFIG = {
  image: ['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
  video: ['.mp4', '.rmvb', '.mkv', '.wmv', '.flv'],
  document: ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.pdf', '.txt', '.tif', '.tiff', '.zip', '.rar'],
  getAll () {
    return [...this.image, ...this.video, ...this.document]
  }
}

@inject('appStore')
@observer
class ImageUpload extends Component {

  constructor (props) {
    super(props)
    this.state = {
      options: {
        target: baseURL + '/v1/api/upload/image',
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
      fileList: []
    }
  }

  uploadStart () {
    this.setState({
      started: true
    })
  }
  fileAdded = (file) => {
    this.computeMD5(file)
    if (file.ignored) { // is ignored, filter it
      return false
    }
  }
  filesAdded = (files, fileList) => {
    // console.log(files, fileList)
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
    fileReader.readAsArrayBuffer(file.file)
    fileReader.onload = e => {
      if (file.size !== e.target.result.byteLength) {
        this.error('Browser reported success but could not read the file until the end.')
        file.cancel()
        return
      }
      md5 = SparkMD5.ArrayBuffer.hash(e.target.result)
      this.uploader.opts.query = {
        ...this.params
      }
      console.log(`MD5计算完毕：${file.id} ${file.name} MD5：${md5} 用时：${new Date().getTime() - time} ms`)
      file.uniqueIdentifier = md5
      file.resume()
      this.statusRemove(file.id)
    }
    fileReader.onerror = function () {
      this.error(`文件${file.name}读取出错，请检查该文件`)
      file.cancel()
    }
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
    // this.$nextTick(() => {
    //     $(`<p class="myStatus_${id}"></p>`).appendTo(`.file_${id} .uploader-file-status`).css({
    //         'position': 'absolute',
    //         'top': '0',
    //         'left': '0',
    //         'right': '0',
    //         'bottom': '0',
    //         'zIndex': '1',
    //         'backgroundColor': statusMap[status].bgc
    //     }).text(statusMap[status].text);
    // })
  }
  statusRemove (id) {
    console.log(id)
    // this.$nextTick(() => {
    //   $(`.myStatus_${id}`).remove()
    // })
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
    let res = JSON.parse(response)
    if (!res.result) {
      message.error(res.message)
      // this.statusSet(file.id, 'failed')
      return
    }
    if (res.needMerge) {
      api.mergeSimpleUpload({
          tempName: res.tempName,
          fileName: file.name,
          ...this.params,
      }).then(res => {
        if (res.status === 0) {
          console.log('上传成功，转码中')
          this.statusSet(file.id, 'transcoding')
        } else if (res.status === 1) {
          console.log('上传失败')
        } else if (res.status === 200) {
          console.log('上传成功')
        }
        // Bus.$emit('fileSuccess')
      }).catch(e => {
        this.statusSet(file.id, 'failed')
      })
    } else {
      // Bus.$emit('fileSuccess')
      console.log('上传成功')
    }
  }

  toggleUploaderMini (value) {
    this.props.appStore.toggleUploaderMini(value)
  }

  closeUploader = () => {
    this.props.appStore.closeUploader()
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
    let isInsert = this.props.appStore.isUploaderInsert
    let isMini = this.props.appStore.isUploaderMini
    let isClosable = this.props.appStore.isUploaderClose
    let uploaderClassName = ''
    uploaderClassName += isInsert ? '' : ' insert'
    uploaderClassName += isMini ? ' mini' : ''
    uploaderClassName += isClosable ? ' closable' : ''
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
            <Icon type="plus"></Icon>
            <span>上传</span>
          </div>
          <UploadList fileList={this.state.fileList}></UploadList>
        </div>
      </div>
    )
  }
}

export default ImageUpload
