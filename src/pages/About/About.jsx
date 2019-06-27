import React, { useState } from 'react'
import { Alert, Avatar, Divider, Steps, Tag, Icon, Button } from 'antd'

import './style.less'
import { PlotIcon } from '@/icon'
import Directory from 'components/G2/Directory'

const { Step } = Steps


function AboutPlot(props) {

  const [current, setCurrent] = useState(0)
  const [isShowDirectory, setShowDirectory] = useState(false)

  const onChange = current => {
    setCurrent(current)
  }

  const imageUploadTitle = <div>图像上传 <Button size="small" onClick={() => setShowDirectory(!isShowDirectory)}>示例</Button></div>

  const imageUpload = <div className="step-wrap">
    <div>
      <Tag color="magenta">图像要求：</Tag>
      单个的<strong><strong>.img</strong></strong>文件（或者名称相同的<strong>.img</strong>和<i className="jpg">.jpg</i>文件）；其中<i className="jpg">.jpg</i>文件用于生成缩略图
    </div>
    <div>
      <Tag color="red">图像处理：</Tag>
      将<strong>.img</strong>文件（或者<strong>.img</strong>和<i className="jpg">.jpg</i>文件）按照以下方法整理成压缩包目前仅支持.zip压缩包文件
    </div>
    <div>
      <Tag color="green">方法一</Tag>
      直接压缩，所有图像的<strong>.img</strong>（或者<strong>.img</strong>和<i className="jpg">.jpg</i>文件）文件放在一个文件夹内：全选<strong>.img</strong>文件——>右键——>发送到——>压缩（zipped）文件夹
    </div>
    <div>
      <Tag color="green">方法二</Tag>
      间接压缩，一个<strong>.img</strong>文件（或者<strong>.img</strong>和<i className="jpg">.jpg</i>件）放到文件夹内对应一个文件夹，全选所有文件夹生成zip压缩包：全选文件夹——>右键——>发送到——>压缩（zipped）文件夹
    </div>
    <div className={isShowDirectory ? 'directory directory-show' : 'directory'}>
      <Directory></Directory>
    </div>
    <div><Tag color="#f50">强调</Tag><strong>.img</strong>文件对应的缩略图<i className="jpg">.jpg</i>，两者名称<strong>必须相同</strong></div>
  </div>

  const plotImage = <div className="step-wrap">
    <div><Tag color="cyan">步骤：</Tag>素材列表——>详情——>点击图像——>图像全屏预览模式——>使用鼠标中键标记危险品位置即可；</div>
    <div><Tag color="#f50">提醒</Tag>有双视角的图像尽量都进行标记</div>
  </div>

  const imageDownload = <div className="step-wrap">
    <div>
      <Tag color="blue">步骤一：</Tag>打包图像：素材列表——>详情——>点击下载标志
      <Avatar size={32} icon="cloud-download" style={{ background: '#f6caa8' }} />
      ——>选择图像——>输入下载包名称——>点击 <Tag color="#108ee9">下载</Tag>按钮——>图像打包成功；</div>
    <div><Tag color="blue">步骤二：</Tag>标图下载：标图下载——>选择要下载的图包——>点击<a>下载</a>链接——>下载成功供后续使用</div>
    <div><Tag color="#f50">注意</Tag>下载的图像包只保留60天，请及时下载；下载的压缩包是经过加密的，不能直接打开查看</div>
  </div>

  return (
    <div className="m-about">
      <Alert message="关于标注平台的使用及注意事项" type="info" showIcon />

      <Divider />

      <Steps current={current} onChange={onChange} direction="vertical">
        <Step title={imageUploadTitle} description={imageUpload} icon={<Icon type="cloud-upload" />} />
        <Step title="标记图像" description={plotImage} icon={<PlotIcon />} />
        <Step title="标图下载" description={imageDownload}  icon={<Icon type="cloud-download" />} />
      </Steps>
    </div>
  )
}

export default AboutPlot
