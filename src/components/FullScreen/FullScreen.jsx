import React, { useEffect } from 'react'
import { Button } from 'antd'

import './style.less'
import { debounce } from '@/util'

const fullScreenType = ['webkitRequestFullScreen', 'webkitCancelFullScreen']


function FullScreen({ isFull, src, onCloseFullScreen }) {

  const isScreenFull = () => {
    let isFull = window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled
    if (isFull === undefined) {
      isFull = false
    }
    return isFull
  }

  const closeFullScreen = (type = 'esc') => {
    onCloseFullScreen(type)
    document[fullScreenType[1]]()
  }

  const checkFullScreenClose = debounce(() => {
    if (!isScreenFull()) {
      closeFullScreen()
    }
  }, 300)

  useEffect(() => {
    window.addEventListener('resize', checkFullScreenClose, false)
    return () => {
      window.removeEventListener('resize', checkFullScreenClose, false)
    }
  }, [])


  return (
    <div id="fullscreen">
      {
        isFull &&
        <div id="nsts">
          <Button onClick={closeFullScreen.bind(this, 'click')} id="btn-close" type="danger" shape="circle" icon="close" size="small"></Button>
          <iframe id="myframe" className="nsts-wrapper" src={src} frameBorder="0" allowFullScreen={true} title="imagefullscreen"></iframe>
        </div>
      }
    </div>
  )
}

export default FullScreen
