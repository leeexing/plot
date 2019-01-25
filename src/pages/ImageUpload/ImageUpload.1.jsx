import React, { Component } from 'react'
import { Alert, Button, Upload, Modal, Icon, message, Row, Col, Progress } from 'antd'
import { baseURL } from '@/api/config'
import Auth from '@/util/auth'
import SparkMD5 from 'spark-md5'
import api from '@/api'

const confirm = Modal.confirm
const Dragger = Upload.Dragger

const props = {
  name: 'upfile',
  multiple: true,
  action: baseURL + '/v1/api/upload/image',
  headers: {
    'Authorization': `Bearer ${Auth.getToken()}`,
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

class ImageUpload extends Component {

  constructor (props) {
    super(props)
    this.state = {
      preUploading:false,   //预处理
      chunksSize:0,   // 上传文件分块的总个数
      currentChunks:0,  // 当前上传的队列个数 当前还剩下多少个分片没上传
      uploadPercent:-1,  // 上传率
      preUploadPercent:-1, // 预处理率
      uploadRequest:false, // 上传请求，即进行第一个过程中
      uploaded:false, // 表示文件是否上传成功
      uploading:false, // 上传中状态
      name: 'upload'
    }
  }

  showConfirm = () => {
    const that = this
    confirm({
      title: '是否提交上传',
      content: '点击确认进行提交',
      onOk () {
        that.preUpload()
      },
      onCancel () {

      }
    })
  }

  preUpload = () => {
    console.log(this.state)
    api.fetchUploadImageStatus({identifier: '168c63609e52b008ee16147689cced9b'}).then(res => {
      console.log(res)
    }).catch(console.log)
    // requestUrl, 返回可以上传的分片列表
    // let uploadList = res.body.Chunks.filter((value)=>{
    //   return value.status === 'Pending'
    // })

    // // 从返回结果中获取当前还有多少个分片没传
    // let currentChunks = res.body.Total - res.body.Uploaded

    // // 获得上传进度
    // let uploadPercent = Number(((this.state.chunksSize - currentChunks) /this.state.chunksSize * 100).toFixed(2))
    // // 上传之前，先判断文件是否已经上传成功
    // if(uploadPercent === 100){
    //   message.success('上传成功')
    //   this.setState({
    //     uploaded:true,    // 让进度条消失
    //     uploading:false
    //   })
    // }else{
    //   this.setState({
    //     uploaded:false,
    //     uploading:true
    //   })
    // }

    // this.setState({
    //   uploadRequest:false,    // 上传请求成功
    //   currentChunks,
    //   uploadPercent
    // })
    // //进行分片上传
    // this.handlePartUpload(uploadList)
  }

  handlePartUpload = uploadList => {
    // 分片上传
    let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
    const _this = this
    const batchSize = 4,    // 采用分治思想，每批上传的片数，越大越卡
          total = uploadList.length,   //获得分片的总数
          batchCount = total / batchSize    // 需要批量处理多少次
    let batchDone = 0     //已经完成的批处理个数
    doBatchAppend()
    function doBatchAppend() {
      if (batchDone < batchCount) {
          let list = uploadList.slice(batchSize*batchDone,batchSize*(batchDone+1))
          setTimeout(()=>silcePart(list),2000)
      }
    }

    function silcePart(list){
        batchDone += 1
        doBatchAppend()
        list.forEach((value)=>{
          let {fileMd5,chunkMd5,chunk,start,end} = value
          let formData = new FormData(),
              blob = new Blob([_this.state.arrayBufferData[chunk-1].currentBuffer],{type: 'application/octet-stream'}),
              params = `fileMd5=${fileMd5}&chunkMd5=${chunkMd5}&chunk=${chunk}&start=${start}&end=${end}&chunks=${_this.state.arrayBufferData.length}`

          formData.append('chunk', blob, chunkMd5)
          request
            .post(`http://x.x.x.x/api/contest/upload_file_part?${params}`)
            .send(formData)
            .withCredentials()
            .end((err,res)=>{
              if(res.body.Code === 200){
                let currentChunks = this.state.currentChunks
                --currentChunks
                // 计算上传进度
                let uploadPercent = Number(((this.state.chunksSize - currentChunks) /this.state.chunksSize * 100).toFixed(2))
                this.setState({
                  currentChunks,  // 同步当前所需上传的chunks
                  uploadPercent,
                  uploading:true
                })
                if(currentChunks ===0){
                  // 调用验证api
                  this.checkUploadStatus(this.state.fileMd5)
                }
              }
            })
      })
    }
  }

  render () {
    const {preUploading, uploadPercent, preUploadPercent, uploadRequest, uploaded, uploading} = this.state
    const that = this
    const uploadProp = {
      onRemove: file => {
        this.setState(({ fileList }) => {
          const index = fileList.indexOf(file)
          const newFileList = fileList.slice()
          newFileList.splice(index, 1)
          return {
            fileList: newFileList,
          }
        })
      },
      beforeUpload: file => {
        console.log(file, '+++++')
        // 首先清除一下各种上传的状态
        this.setState({
          uploaded:false,   // 上传成功
          uploading:false,  // 上传中
          uploadRequest:false   // 上传预处理
        })
        // 兼容性的处理
        let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
          chunkSize = 1024 * 1024 * 5,                             // 切片每次5M
          chunks = Math.ceil(file.size / chunkSize),
          currentChunk = 0, // 当前上传的chunk
          spark = new SparkMD5.ArrayBuffer(), // 对arrayBuffer数据进行md5加密，产生一个md5字符串
          chunkFileReader = new FileReader(),  // 用于计算出每个chunkMd5
          totalFileReader = new FileReader(),  // 用于计算出总文件的fileMd5
          fileReader = new FileReader()

        fileReader.onerror = function () {
          console.warn('oops, something went wrong.')
        }

        let loadNext = () => {
          let start = currentChunk * chunkSize
          let end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize
          fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
        }
        loadNext()

        let params = {
          chunks: [],
          file: {}
        }  // 用于上传所有分片的md5信息
        let arrayBufferData = [] // 用于存储每个chunk的arrayBuffer对象,用于分片上传使用

        params.file.fileName = file.name
        params.file.fileSize = file.size

        // totalFileReader.readAsArrayBuffer(file)
        totalFileReader.onload = e => {
          // 对整个totalFile生成md5
          spark.append(e.target.result)
          params.file.fileMd5 = spark.end() // 计算整个文件的fileMd5
          totalFileReader.readAsArrayBuffer(file)
        }

        chunkFileReader.readAsArrayBuffer(file)
        chunkFileReader.onload = function (e) {
          console.log(e, '****')
          // 对每一片分片进行md5加密
          spark.append(e.target.result)
          // 每一个分片需要包含的信息
          let obj = {
            chunk: currentChunk + 1,
            start: currentChunk * chunkSize, // 计算分片的起始位置
            end: ((currentChunk * chunkSize + chunkSize) >= file.size) ? file.size : currentChunk * chunkSize + chunkSize, // 计算分片的结束位置
            chunkMd5:spark.end(),
            chunks
          }
          // 每一次分片onload,currentChunk都需要增加，以便来计算分片的次数
          currentChunk++
          params.chunks.push(obj)

          // 将每一块分片的arrayBuffer存储起来，用来partUpload
          let tmp = {
            chunk:obj.chunk,
            currentBuffer:e.target.result
          }
          arrayBufferData.push(tmp)

          if (currentChunk < chunks) {
            // 当前切片总数没有达到总数时
            loadNext()

            // 计算预处理进度
            that.setState({
              preUploading: true,
              preUploadPercent: Number((currentChunk / chunks * 100).toFixed(2))
            })
          } else {
            //记录所有chunks的长度
            params.file.fileChunks = params.chunks.length
            // 表示预处理结束，将上传的参数，arrayBuffer的数据存储起来
            that.setState({
              arrayBufferData,
              preUploading: false,
              uploadParams: params,
              chunksSize: chunks,
              preUploadPercent: 100
            })
          }
        }

        // 只允许一份文件上传
        this.setState({
          fileList: [file],
          file: file
        })

        return false
      },
      fileList: this.state.fileList,
      ...props
    }

    return (
      <div className="m-upload">
        <Alert message="请上传图片或者zip打包文件" type="info" showIcon closable />
        <Row>
          <Col>
            <Dragger {...uploadProp}>
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">点击或者拖拽文件进行上传</p>
              <p className="ant-upload-hint">支持单个或多个文件。打包文件请使用.zip格式</p>
            </Dragger>
            {uploadPercent >= 0
              && !!uploading
              && <div style={{marginTop:20,width:'95%'}}>
                <Progress percent={uploadPercent} status="active" />
                <h4>文件上传中，请勿关闭窗口</h4>
              </div>
            }
            <Button type="primary" onClick={this.showConfirm}>
            {/* <Button type="primary" onClick={this.showConfirm} disabled={!!(this.state.preUploadPercent <100)}> */}
              <Icon type="upload" />提交上传
            </Button>
          </Col>
        </Row>
      </div>
    )
  }
}

export default ImageUpload
