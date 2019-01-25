import React, { Component } from 'react'
import { Alert, Button, Upload, notification, Icon, message, Row, Col, Progress, List } from 'antd'
import { baseURL } from '@/api/config'
import Auth from '@/util/auth'
import SparkMD5 from 'spark-md5'
import Uploader from 'simple-uploader.js'
import api from '@/api'
import { kebabCase } from '@/util'


const Dragger = Upload.Dragger

const props = {
  name: 'upfile',
  multiple: true,
  action: baseURL + '/v1/api/upload/image',
  headers: {
    Authorization: `Bearer ${Auth.getToken()}`,
    'Access-Control-Allow-Credentials': true
  },
  onChange (info) {
    const status = info.file.status
    if (status !== 'uploading') {
      // console.log(info.file, info.fileList)
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`)
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`)
    }
  }
}

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
          console.log(message, chunk)
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
        success: 'success',
        error: 'error',
        uploading: 'uploading',
        paused: 'paused',
        waiting: 'waiting'
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
  fileAdded (file) {
    console.log(file)
    this.computeMD5(file)
    // this.$emit(kebabCase(FILE_ADDED_EVENT), file)
    // if (file.ignored) {
    //   // is ignored, filter it
    //   return false
    // }
  }
  filesAdded (files, fileList) {
    console.log(files, fileList)
    // this.$emit(kebabCase(FILES_ADDED_EVENT), files, fileList)
    if (files.ignored || fileList.ignored) {
      // is ignored, filter it
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
      // this.error('FileReader onerror was triggered, maybe the browser aborted due to high memory usage.')
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
  }
  statusRemove (id) {
    console.log(id)
    // this.$nextTick(() => {
    //   $(`.myStatus_${id}`).remove()
    // })
  }
  fileRemoved (file) {
    this.files = this.uploader.files
    this.fileList = this.uploader.fileList
  }
  filesSubmitted (files, fileList) {
    this.setState({
      files: this.uploader.files,
      fileList: this.uploader.fileList
    })
    if (this.state.autoStart) {
      this.uploader.upload()
    }
  }
  allEvent (...args) {
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
    console.log('allEvent:', args)
    // this.$emit.apply(this, args)
  }
  onFileProgress (rootFile, file, chunk) {
    console.log(`上传中 ${file.name}，chunk：${chunk.startByte / 1024 / 1024} ~ ${chunk.endByte / 1024 / 1024}`)
  }
  onFileError (rootFile, file, response, chunk) {
    message.error(response)
  }
  error (msg) {
    notification.error({
      message: '提示',
      description: msg,
      duration: 3000
    })
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
    uploader.on('fileError', this.onFileError.bind(this))

    console.log(this.refs.uploadBtn.buttonNode)
    this.uploader.assignBrowse(this.refs.uploadBtn.buttonNode, false, false, {accept: ACCEPT_CONFIG.getAll()})

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
    return (
      <div className="m-upload">
        <Alert message="请上传图片或者zip打包文件" type="info" showIcon closable />
        <Row>
          <Col>
            {/* <Dragger {...props} className="upload-drop">
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">点击或者拖拽文件进行上传</p>
              <p className="ant-upload-hint">支持单个或多个文件。打包文件请使用.zip格式</p>
            </Dragger> */}
            <Button className="upload-btn" type="primary" ref="uploadBtn">上传</Button>
            {this.state.fileList.length === 0
              ? ''
              : 'fsdf'
              // : <List
              //   size="large"
              //   bordered
              //   dataSource={this.state.fileList}
              //   renderItem={item => (<List.Item>{item}</List.Item>)}
              // ></List>
            }
          </Col>
        </Row>
      </div>
    )
  }
}

export default ImageUpload
