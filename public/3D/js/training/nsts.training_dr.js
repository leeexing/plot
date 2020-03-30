/*
 * 说明：DR图像显示
*/
class TrainingBaseDR  {
    constructor(options={}) {
        this.options = {
          showTool : true, // 是否需要显示工具条；默认显示，考题添加出可能不需要
          showTitleInfo: false, // 是否显示头部信息
          checkType: 'study', // 查看类型
          callback: '',
        }
        Object.assign(this.options, options)
        this.initBaseElement()
        this.initViewer()
    }
    initBaseElement () {
        this.title = $('.j-title')
        this.drContainer = $('.j-dr-container')
        this.judgeBtnsWrap = $('.j-judge-btns')
        this.prevImgBtn = $('.btn-prev')
        this.nextImgBtn = $('.btn-next')
        this.prevBtnWrap = $('.j-prevbtn-wrap')
        this.nextBtnWrap = $('.j-nextbtn-wrap')
        this.imgName = $('.img-name')
        this.imgKnowledgeName = $('.img-kpoint')
        this.imgItemname = $('.goods-name')
        this.imgDesc = $('.feature-desc')
        this.timeWrap = $('.j-time-info') // 倒计时时间
        this.indexInfoWrap = $('.j-index-info') // 索引
        this.totalIndex = $('.j-total-index')
        this.curIndex = $('.j-cur-index')
        this.safeBtn = $('.j-pass')
        this.dangerBtn = $('.j-nopass')
        this.submitBtn = $('.j-submit')
        this.userName = $('.j-username')
        this.userAvatar = $('.j-avatar')
        this.userName.text(localStorage.getItem('username'))
        this.userAvatar.attr('src', localStorage.getItem('avatar') || './images/avatar.png')
        // !上下图像切换
        this.prevImgBtn.click(() => {
            this.prevImg()
        })
        this.nextImgBtn.click(() => {
            this.nextImg()
        })
        // !退出键关闭监控
        let btnCloseDom = window.parent.document.getElementById('btn-close')
        this.closeFullscreenBtn = $(btnCloseDom)
        this.closeFullscreenBtn.click(() => {
            this.beforeClose && this.beforeClose()
        })


        // !这里的逻辑不用监听了，不然会触发两次click。
        // !但是如果通过esc关闭的话，就不能保证最后未提交的标注图像提交
        // this.isFull = true
        // const onHandleResize = event => {
        //     event.preventDefault()
        //     if (this.isFull) {
        //         $(window).off('resize')
        //         this.isFull = false
        //         this.closeFullscreenBtn.click()
        //     }
        // }
        // $(window).on('resize', onHandleResize)
        // !确认是否显示快捷键
        this.checkUserShowShortcut()
        this.attachInfoLayerEvent()
    }
    initViewer() {
        this.index = 0
        if (this.options.checkType !== 'map') {
            this.indexInfoWrap.css('opacity', 1)
        }
        if (this.options.checkType == 'exam') {
            this.prevBtnWrap.hide()
            this.judgeBtnsShow()
        }
        if (this.options.showTitleInfo) {
            $('.m-title').css('display', 'flex')
        }
        this.options.DrHeight = Math.floor(this.drContainer.height())
        this.options.DrWidth = Math.floor(this.drContainer.width())
        this.Viewer = new DrViewer(this.options)
    }
    prevImg() {
        if (this.imgHasLoaded) {
            this.index--
            this.show()
        }
    }
    nextImg() {
        if (this.imgHasLoaded) {
            this.index++
            this.show()
        }
    }
    get imgHasLoaded () {
        return this.Viewer.hasLoaded
    }
    show() {
        let anglesInfo = this.angles
        this.Viewer.initShowDR(anglesInfo)
        this.doSubclassThing()
    }
    doSubclassThing() {
        throw new Error('抽象方法，必须由子类实现！')
    }
    showImgInfo(imgInfo) {
        this.imgName.text(imgInfo.byName)
        this.imgKnowledgeName.text(imgInfo.knowledgeName || `${lang.null}`)
        this.imgItemname.text(imgInfo.typeName)
        this.imgDesc.text(imgInfo.description != '' ? imgInfo.description : `${lang.null}`)
    }
    initCountdown(time) {
        this.timeRemaingElem = $('.j-time')
        this.time = time
        this.countdownID = null
        this.timeRemaingElem.html(formatSecondsNoUnit(this.time))
    }
    checkPreNext() {
        if (this.allCount === 1) {
            this.prevBtnWrap.hide()
            this.nextBtnWrap.hide()
        } else {
            this.prevBtnWrap.show()
            this.nextBtnWrap.show()
            if (this.index === 0) {
                this.prevBtnWrap.hide()
            } else if (this.index === this.allCount - 1) {
                this.nextBtnWrap.hide()
            }
        }
    }
    closeFullScreen () {
        this.closeFullscreenBtn.click()
    }
    judgeBtnsShow () {
        this.judgeBtnsWrap.css('display', 'flex')
    }
    packageSafe () {
        this.activeImg.isPass = true
        this.resetJudgeBtnsStatus()
    }
    packageDanger () {
        if (this.formName === 'Easy') {
            this.activeImg.isPass = false
            this.resetJudgeBtnsStatus('danger')
        }
    }
    kpLayerShow () {
        this.isVisibleOfKpLayer = true
        this.layerContainer.removeClass('fadeOut').addClass('active fadeIn')
    }
    kpLayerHide () {
        this.isVisibleOfKpLayer = false
        this.layerContainer.removeClass('active fadeIn').addClass('fadeOut')
    }
    resetLayerState () {
        this.kpTags.removeClass('active').eq(0).addClass('active')
    }
    packageDangerOfKp2Ensure () {
        let selectedKpDom = this.kpTags.filter('.active')
        if (selectedKpDom) {
            let suspectKp = selectedKpDom.data('kpid')
            // this.$imgKpAddBtn.addClass('active')
            let suspectKpName = selectedKpDom.text()
            this.doSomethingOfPickImgKp(suspectKp, suspectKpName)
        }
    }
    packageDangerOfKp2Cancel () {
        this.resetJudgeBtnsStatus()
    }
    doSomethingOfPickImgKp () {
        throw new Error('抽象方法，必须由子类实现！')
    }
    clearUserSelectRegion() {
        this.Viewer.clearUserSelectRegion()
    }
    resetJudgeBtnsStatus (type='safe') {
        if (type === 'safe') {
            this.safeBtn.addClass('active')
            this.dangerBtn.removeClass('active')
        } else {
            this.safeBtn.removeClass('active')
            this.dangerBtn.addClass('active')
        }
    }
    checkUserShowShortcut () {
        let showShortcut = localStorage.getItem('showShortcut')
        showShortcut = showShortcut === null || showShortcut === 'false' ? false : true
        this.shortcutSwitchBtn = $('.j-switch')
        this.toolsWrap = $('.j-tools')
        this.shortcutSwitchBtn.click(() => {
            this.shortcutSwitchBtn.toggleClass('show-shortcut')
            this.toolsWrap.toggleClass('shortcut-show')
            let isShowShortcut = this.shortcutSwitchBtn.hasClass('show-shortcut')
            localStorage.setItem('showShortcut', isShowShortcut)
            if (isShowShortcut) {
                this.shortcutSwitchBtn.attr('title', `${lang.showShortcut}`)
            } else {
                this.shortcutSwitchBtn.attr('title', `${lang.hideShortcut}`)
            }
        })
        if (!showShortcut) {
            this.shortcutSwitchBtn.click()
        }
    }
    // FIXME: 后期需要添加接口获取的方式
    attachKpLayerEvent () {
        // 正常需要知识点
        /* $.NstsGET(APIURI + '/api/Dropdown/Knowledge', {type: 'Image'}, data => {
            if (!data.result) {
                console.log('哎呦，报错了')
            }
            console.log(data)
            let kpTaglist = []
            data.package[0].children.forEach((item, index) => {
                let className = index === 0 ? ' active' : ''
                kpTaglist.push(`<div class="nsts-tag${className}" data-kpid="${item.id}">
                                    <span class="nsts-tag-dot"></span>
                                    <span class="nsts-tag-text">${item.value}</span>
                                </div>`)
            })
            this.layerBody.html(kpTaglist.join(''))
            this.kpTags = this.layerBody.find('.nsts-tag')
        }) */
        this.layerContainer = $('.j-layer')
        this.layerBody = this.layerContainer.find('.nsts-body')
        this.kpTags = this.layerBody.find('.nsts-tag')
        this.isVisibleOfKpLayer = false
        $('.j-layer-close, .j-mask, .j-layer-cancel').click(() => {
            this.kpLayerHide()
        })
        this.layerBody.on('click', '.nsts-tag', function() {
            $(this).addClass('active').siblings().removeClass('active')
        })
        // !确认选择危险品知识点
        $('.j-layer-ensure').click(() => {
            this.packageDangerOfKp2Ensure()
            this.kpLayerHide()
        })
    }
    attachInfoLayerEvent () {
        this.infoLayerContainer = $('.j-info-layer')
        this.infoLayerBody = this.infoLayerContainer.find('.nsts-body')
        $('.j-info-layer-close, .j-info-mask').click(() => {
            this.infoLayerHide()
            this.infoLayerEnsureCB && this.infoLayerEnsureCB()
        })
        $('.j-info-layer-ensure').click(() => {
            this.infoLayerHide()
            this.infoLayerEnsureCB && this.infoLayerEnsureCB()
        })
    }
    infoLayerShow () {
        this.infoLayerContainer.removeClass('fadeOut').addClass('active fadeIn')
    }
    infoLayerHide () {
        this.infoLayerContainer.removeClass('active fadeIn').addClass('fadeOut')
    }
}


/**
 * ! DR 在线标图
 *
 * @class MapPreviewDR
 * @extends {TrainingBaseDR}
 */
class MapPreviewDR extends TrainingBaseDR {
    constructor() {
        super({ checkType: 'map' })
        this.initElement()
    }
    initElement() {
        $('.main').append('<div class="map-menu j-map-menu"></div>')
        this.$imgInfoAddWrap = $('.j-img-info-add')
        this.$imgKpAddBtn = $('.j-img-kp')
        this.$imgRectangleNumBtn = $('.j-multi-suspect')
        this.$extraInfo = $('.j-extra-info')
        this.$imgSuspectName = this.$extraInfo.find('.content')
        this.suspectKp = null
        this.isMultiSuspect = false

        this.title.text('DR在线标图')
        // -推出前将最后一幅图像保存
        this.beforeClose = () => {
            let renderData = this.mapMenu.activeRenderData()
            let id = renderData.id
            let putData = {
                markPos: [...this.Viewer.userSelectRegion]
            }
            if (this.suspectKp) {
                putData.suspectKp = this.suspectKp
            }
            if (this.isMultiSuspect) {
                putData.isMultiSuspect = true
            }
            // 如果退出前，需要选择图像类型却没有选择，就抛弃这次标记记录
            if (putData.markPos.length > 0) {
                if (this.isNuctech && !this.suspectKp) {
                    return
                }
                // 通过postMessage方式让标注列表组件内部进行提交
                parent.postMessage({ id, type: 'submitPlot', postData: JSON.stringify(putData) }, location.origin)
            }
        }
        $('.j-backout-plot').click(() => {
            this.backoutPlotImageSuspect()
        })
        $('.j-rotate-plot').click(() => {
            this.rotatePlotImage()
        })
        // 添加图像类型选择
        this.$imgKpAddBtn.click(() => {
            this.kpLayerShow()
        })
        // 添加判断是否为多嫌疑物
        this.$imgRectangleNumBtn.click(() => {
            this.isMultiSuspect = !this.$imgRectangleNumBtn.hasClass('active')
            this.activeImageData.isMultiSuspect = this.isMultiSuspect
            this.$imgRectangleNumBtn.toggleClass('active')
        })
    }
    init(options) {
        let {img_sql, initShowId, url} = options
        this.isNuctech = options.isNuctech
        if (this.isNuctech) {
            this.attachKpLayerEvent()
            this.$imgInfoAddWrap.show()
            this.$extraInfo.show()
        }
        this.mapMenu = new MapMenu({imgInstance: this, img_sql, initShowId, url})
    }
    initShow(imgInfo) {
        this.activeImageData = imgInfo
        this.Viewer.showDR(imgInfo)
        this.doSubclassThing(imgInfo)
    }
    doSubclassThing(imgInfo) {
        this.showImgInfo(imgInfo)
        this.checkPreNext()
        if (this.isNuctech) {
            this.suspectKp = null
            this.isMultiSuspect = false
            console.log(this.activeImageData)
            if (this.activeImageData.suspectid) {
                let selectedKpDom = this.kpTags.filter(`[data-kpid="${this.activeImageData.suspectid}"]`)
                let suspectKpName = selectedKpDom.text().trim()
                this.showImgSuspectName(suspectKpName)
            } else {
                this.showImgSuspectName('未选择')
            }
            if (this.activeImageData.isMultiSuspect) {
                this.$imgRectangleNumBtn.addClass('active')
            } else {
                this.$imgRectangleNumBtn.removeClass('active')
            }
            this.resetLayerState()
        }
    }
    doSomethingOfPickImgKp (suspectKp, suspectKpName) {
        this.suspectKp = suspectKp
        this.activeImageData.suspectid = suspectKp
        this.showImgSuspectName(suspectKpName)
    }
    showImgSuspectName (name) {
        this.$imgSuspectName.text(name)
    }
    // 切换下一副图像标注前，检查是否可以切换。是否已经选择图像类型
    checkValidateBeforeClickNext () {
        if (!this.Viewer.hasLoaded) {
            return false
        }
        if (this.isNuctech) {
            if (this.Viewer.userSelectRegion.length > 0 && !this.suspectKp) {
                this.infoLayerShow()
                return false
            }
        }
        return true
    }
    checkPreNext() {
        if (this.mapMenu.imgCount == 1) {
            this.prevBtnWrap.hide()
            this.nextBtnWrap.hide()
        } else {
          if (this.mapMenu.activeIndex === 0) {
              this.prevBtnWrap.hide()
          } else if (this.mapMenu.activeIndex == this.mapMenu.imgCount) {
              this.nextBtnWrap.hide()
          } else {
              this.prevBtnWrap.show()
              this.nextBtnWrap.show()
          }
        }
    }
    prevImg() {
        if (this.checkValidateBeforeClickNext()) {
            this.mapMenu.prevImgShow()
        }
    }
    nextImg() {
        if (this.checkValidateBeforeClickNext()) {
            this.mapMenu.nextImgShow()
        }
    }
    updateImgSuspect () {
        let renderData = this.mapMenu.activeRenderData()
        // 如果是看到最后一副图像时进行删除操作
        if (!renderData) {
            return
        }
        let { id } = renderData
        let putData = {
            markPos: [...this.Viewer.userSelectRegion]
        }
        if (this.suspectKp) {
            putData.suspectKp = this.suspectKp
        }
        if (this.isMultiSuspect) {
            putData.isMultiSuspect = true
        }
        if (putData.markPos.length > 0) {
            $.NstsPUT(APIURI + '/api/plot/' + id, JSON.stringify(putData), res => {
                if (!res.result) {
                    console.log(res.msg)
                }
                this.mapMenu.imgData.filter(item => item.id === id)[0].plot = true
                this.mapMenu.activeDom(id).addClass('ploted')
            })
        }
    }
    // 恢复图像的标记
    backoutPlotImageSuspect() {
        let { id, plot } = this.activeImageData
        let markPos = this.Viewer.userSelectRegion
        if (markPos.length > 0) {
            this.clearUserSelectRegion()
        }
        if (!plot) {
            return
        }
        this.postPlot(id, { isRotate: false })
    }
    rotatePlotImage() {
        let { id } = this.activeImageData
        this.postPlot(id, { isRotate: true })
    }
    postPlot(id, postData) {
        $.NstsPOST(APIURI + '/api/plot/' + id, JSON.stringify(postData), res => {
            if (!res.result) {
                NSTS.Plugin.Alert.Error(res.msg)
                return
            }
            this.Viewer.showDR(this.activeImageData)
            this.doSubclassThing(this.activeImageData)
            this.activeImageData.plot = false
            this.mapMenu.activeDom(id).removeClass('ploted')
            if (this.isNuctech) {
                this.suspectKp = null
                this.$imgSuspectName.text('未选择')
                this.isMultiSuspect = false
                this.$imgRectangleNumBtn.removeClass('active')
            }
        }, {
            contentType: 'application/json'
        })
    }
}
