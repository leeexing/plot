import React, { Component } from 'react'
import Uploader from 'simple-uploader.js'
import { inject, observer } from 'mobx-react'

import { secondsToStr } from '@/util'

const events = ['fileProgress', 'fileSuccess', 'fileComplete', 'fileError']


@inject('appStore')
@observer
class UploadFile extends Component {
  constructor (props) {
    super(props)
    this.state = {
      paused: false,
      error: false,
      averageSpeed: 0,
      currentSpeed: 0,
      isComplete: false,
      isUploading: false,
      size: 0,
      formatedSize: '',
      uploadedSize: 0,
      progress: 0,
      timeRemaining: 0,
      type: '',
      extension: '',
      progressingClass: '',
      file: props.file || {},
      list: true
    }
  }
  fileCategory () {
    const extension = this.extension
    const isFolder = this.file.isFolder
    let type = isFolder ? 'folder' : 'unknown'
    const categoryMap = this.file.uploader.opts.categoryMap
    const typeMap = categoryMap || {
      image: ['gif', 'jpg', 'jpeg', 'png', 'bmp', 'webp'],
      video: ['mp4', 'm3u8', 'rmvb', 'avi', 'swf', '3gp', 'mkv', 'flv'],
      audio: ['mp3', 'wav', 'wma', 'ogg', 'aac', 'flac'],
      document: ['doc', 'txt', 'docx', 'pages', 'epub', 'pdf', 'numbers', 'csv', 'xls', 'xlsx', 'keynote', 'ppt', 'pptx']
    }
    Object.keys(typeMap).forEach((_type) => {
      const extensions = typeMap[_type]
      if (extensions.indexOf(extension) > -1) {
        type = _type
      }
    })
    return type
  }
  progressStyle () {
    const progress = Math.floor(this.state.progress * 100)
    const style = `translateX(${Math.floor(progress - 100)}%)`
    return {
      progress: `${progress}%`,
      transform: style
    }
  }
  formatedAverageSpeed () {
    return `${Uploader.utils.formatSize(this.state.averageSpeed)} / s`
  }
  status () {
    const isUploading = this.state.isUploading
    const isComplete = this.state.isComplete
    const isError = this.state.error
    const paused = this.state.paused
    if (isComplete) {
      return 'success'
    } else if (isError) {
      return 'error'
    } else if (isUploading) {
      return 'uploading'
    } else if (paused) {
      return 'paused'
    } else {
      return 'waiting'
    }
  }
  statusText () {
    const status = this.status()
    return this.state.file.uploader.fileStatusText[status] || status
  }
  formatedTimeRemaining () {
    const timeRemaining = this.state.timeRemaining
    const file = this.state.file
    if (timeRemaining === Number.POSITIVE_INFINITY || timeRemaining === 0) {
      return ''
    }
    let parsedTimeRemaining = secondsToStr(timeRemaining)
    const parseTimeRemaining = file.uploader.opts.parseTimeRemaining
    if (parseTimeRemaining) {
      parsedTimeRemaining = parseTimeRemaining(timeRemaining, parsedTimeRemaining)
    }
    return parsedTimeRemaining
  }

  _actionCheck () {
    this.setState({
      paused: this.state.file.paused,
      error: this.state.file.error,
      isUploading: this.state.file.isUploading()
    })
  }
  pause () {
    this.state.file.pause()
    this._actionCheck()
    this._fileProgress()
  }
  resume () {
    this.state.file.resume()
    this._actionCheck()
  }
  remove () {
    this.state.file.cancel()
  }
  retry () {
    this.state.file.retry()
    this._actionCheck()
  }
  fileEventsHandler (event, args) {
    const rootFile = args[0]
    const file = args[1]
    const target = this.state.list ? rootFile : file
    if (this.state.file === target) {
      if (this.list && event === 'fileSuccess') {
        return
      }
      this[`_${event}`].apply(this, args)
    }
  }
  _fileProgress () {
    this.setState({
      progress: this.state.file.progress(),
      averageSpeed: this.state.file.averageSpeed,
      currentSpeed: this.state.file.currentSpeed,
      timeRemaining: this.state.file.timeRemaining(),
      uploadedSize: this.state.file.sizeUploaded()
    })
    this._actionCheck()
  }
  _fileSuccess () {
    this._fileProgress()
    this.setState({
      error: false,
      isComplete: true,
      isUploading: false
    })
  }
  _fileComplete () {
    this._fileSuccess()
  }
  _fileError () {
    this._fileProgress()
    this.setState({
      error: false,
      isComplete: false,
      isUploading: false
    })
  }

  componentDidMount () {
    const staticProps = ['paused', 'error', 'averageSpeed', 'currentSpeed']
    const fnProps = [
      'isComplete',
      'isUploading',
      {
        key: 'size',
        fn: 'getSize'
      },
      {
        key: 'formatedSize',
        fn: 'getFormatSize'
      },
      {
        key: 'uploadedSize',
        fn: 'sizeUploaded'
      },
      'progress',
      'timeRemaining',
      {
        key: 'type',
        fn: 'getType'
      },
      {
        key: 'extension',
        fn: 'getExtension'
      }
    ]
    staticProps.forEach(prop => {
      this.setState({
        prop: this.state.file[prop]
      })
    })
    fnProps.forEach((fnProp) => {
      if (typeof fnProp === 'string') {
        this.setState({
          fnProp: this.state.file[fnProp]()
        })
      } else {
        this.setState({
          [fnProp.key]: this.state.file[fnProp.fn]()
        })
      }
    })

    const handlers = this._handlers = {}
    const eventHandler = (event) => {
      handlers[event] = (...args) => {
        this.fileEventsHandler(event, args)
      }
      return handlers[event]
    }
    events.forEach((event) => {
      this.state.file.uploader.on(event, eventHandler(event))
    })
  }

  componentWillUnmount () {
    events.forEach((event) => {
      this.state.file.uploader.off(event, this._handlers[event])
    })
    this._handlers = null
  }

  render () {
    const status = this.status()
    const isInsert = this.props.appStore.isUploaderInsert
    return (
      <li className="uploader-file" status={status}>
        <div className={"uploader-file-progress " + this.state.progressingClass} style={this.progressStyle()}></div>
        <div className="uploader-file-info">
          <div className="uploader-file-name"><i className="uploader-file-icon" ></i>{this.state.file.name}</div>
          <div className="uploader-file-size">{this.state.formatedSize}</div>
          <div className="uploader-file-meta"></div>
          <div className="uploader-file-status">
          {
            status === "uploading"
            ? <div className="uploader-file-status-detail">
                <span>{this.progressStyle().progress}</span>
                <em>{this.formatedAverageSpeed()}</em>
                {
                  !isInsert && <i>{this.formatedTimeRemaining()}</i>
                }
              </div>
            : <span>{this.statusText()}</span>
          }
          </div>
          <div className="uploader-file-actions">
            <span className="uploader-file-pause" onClick={this.pause.bind(this)}></span>
            <span className="uploader-file-resume" onClick={this.resume.bind(this)}>️</span>
            <span className="uploader-file-retry" onClick={this.retry.bind(this)}></span>
            <span className="uploader-file-remove" onClick={this.remove.bind(this)}></span>
          </div>
        </div>
      </li>
    )
  }
}

export default UploadFile
