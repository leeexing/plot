import React from 'react'
import UploadFile from './UploadFile'

const UploadList = props => (
  <div className="uploader-list">
    <ul>
      {props.fileList.map(file => (
        <UploadFile file={file} key={file.id}></UploadFile>
      ))
      }
    </ul>
  </div>
)

export default UploadList
