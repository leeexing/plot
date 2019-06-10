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
        this.initViewer();
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
        this.userName.text(getUserInfo('userName'))
        this.userAvatar.attr('src', localStorage.getItem('avatar') || './images/avatar.png')
        // !上下图像切换
        this.prevImgBtn.click(() => {
            this.prevImg();
        });
        this.nextImgBtn.click(() => {
            this.nextImg();
        });
        // !退出键关闭监控
        let btnCloseDom = window.parent.document.getElementById('btn-close')
        this.closeFullscreenBtn = $(btnCloseDom);
        this.closeFullscreenBtn.click(() => {
            this.beforeClose && this.beforeClose()
        })


        this.isFull = true;
        // $(window).on('resize', event => {
        //     event.preventDefault()
        //     if (this.isFull) {
        //         this.closeFullscreenBtn.click();
        //         this.isFull = false;
        //     }
        // })
        // !确认是否显示快捷键
        this.checkUserShowShortcut()
        // !判图逻辑.安全/危险
        this.safeBtn.click(() => {
            this.packageSafe()
        })
        this.dangerBtn.click(() => {
            this.packageDanger()
        })
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
        this.Viewer = new DrViewer(this.options);
    }
    prevImg() {
        if (this.imgHasLoaded) {
            this.index--;
            this.show();
        }
    }
    nextImg() {
        if (this.imgHasLoaded) {
            this.index++;
            this.show();
        }
    }
    get imgHasLoaded () {
        return this.Viewer.hasLoaded
    }
    show() {
        let anglesInfo = this.angles;
        this.Viewer.initShowDR(anglesInfo);
        this.doSubclassThing();
    }
    doSubclassThing() {
        throw new Error('抽象方法，必须由子类实现！');
    }
    showImgInfo(imgInfo) {
        this.imgName.text(imgInfo.byName);
        this.imgKnowledgeName.text(imgInfo.knowledgeName || `${lang.null}`);
        this.imgItemname.text(imgInfo.typeName);
        this.imgDesc.text(imgInfo.description != '' ? imgInfo.description : `${lang.null}`);
    }
    initCountdown(time) {
        this.timeRemaingElem = $('.j-time');
        this.time = time;
        this.countdownID = null;
        this.timeRemaingElem.html(formatSecondsNoUnit(this.time));
    }
    countdownStart(callback) {
        let timeRemain = this.time;
        this.timeUsed = 0; //用时
        const countTime = () => {
            timeRemain -= 1;
            this.timeRemaingElem.html(formatSecondsNoUnit(timeRemain));
            this.timeUsed = (this.time - timeRemain);
            if (timeRemain < 1) {
                //时间结束，后续操作业务类在覆盖
                clearInterval(this.countdownID);
                this.countdownID = null;
                this.countdownEnd();
                return
            }
            callback && callback()
        }
        this.countdownID = setInterval(countTime, 1000);
    }
    resetCountdown () {
        clearInterval(this.countdownID);
        this.countdownID = null;
        this.timeRemaingElem.html(formatSecondsNoUnit(this.time));
    }
    cancelCountdown() {
        clearInterval(this.countdownID);
        this.countdownID = null;
        this.timeWrap.hide();
        this.timeRemaingElem.empty();
    }
    countdownEnd() {
        throw new Error('抽象方法，必须由子类实现！');
    }
    checkPreNext() {
        if (this.allCount === 1) {
            this.prevBtnWrap.hide();
            this.nextBtnWrap.hide();
        } else {
            this.prevBtnWrap.show();
            this.nextBtnWrap.show();
            if (this.index === 0) {
                this.prevBtnWrap.hide();
            } else if (this.index === this.allCount - 1) {
                this.nextBtnWrap.hide();
            }
        }
    }
    closeFullScreen () {
        this.closeFullscreenBtn.click()
    }
    judgeBtnsShow () {
        this.judgeBtnsWrap.css('display', 'flex');
    }
    packageSafe () {
        this.activeImg.isPass = true
        this.resetJudgeBtnsStatus()
        if (this.formName !== 'Easy') { // ?重新选择安全会重置之前的标框数据
            this.Viewer.clearUserSelectRegion()
            // this.activeImg.signBox = null
        }
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
        this.kpTags.removeClass('active').eq(0).addClass('active')
    }
    packageDangerOfKp2Center () {
        let selectedKpDom = this.kpTags.filter('.active')
        let kpID = selectedKpDom.data('kpid')
        this.activeImg.dangerID = Number(kpID)
        this.activeImg.dangerName = selectedKpDom.text().trim()
    }
    packageDangerOfKp2Cancel () {
        this.activeImg.isPass = true
        this.activeImg.dangerID = null
        this.resetJudgeBtnsStatus()
        if (this.formName !== 'Easy') {
            this.Viewer.clearUserSelectRegion()
        }
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
    attachKpLayerEvent () {
        $.NstsGET(APIURI + 'api/Dropdown/Knowledge', {type: 'Image'}, data => {
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
        })
        this.layerContainer = $('.j-layer')
        this.layerBody = this.layerContainer.find('.nsts-body')
        this.isVisibleOfKpLayer = false
        $('.j-layer-close, .j-mask, .j-layer-cancel').click(() => {
            this.packageDangerOfKp2Cancel()
            this.kpLayerHide()
        })
        this.layerBody.on('click', '.nsts-tag', function() {
            $(this).addClass('active').siblings().removeClass('active')
        })
        // !确认选择危险品知识点
        $('.j-layer-ensure').click(() => {
            this.packageDangerOfKp2Center()
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
        super({checkType: 'map'});
        this.initElement();
    }
    initElement() {
        $('.main').append('<div class="map-menu j-map-menu"></div>')
        this.title.text('DR在线标图');
        this.beforeClose = () => {
            let renderData = this.mapMenu.activeRenderData()
            let id = renderData.id
            let putData = {
                markPos: [...this.Viewer.userSelectRegion]
            }
            if (putData.markPos.length > 0) {
                parent.postMessage({type: 'submitPlot', postData: JSON.stringify(putData), id}, location.origin)
            }
        }
    }
    init(options) {
        let {img_sql, initShowId, url} = options
        this.mapMenu = new MapMenu({imgInstance: this, img_sql, initShowId, url})
    }
    initShow(imgInfo) {
      this.Viewer.showDR(imgInfo)
      this.doSubclassThing(imgInfo)
    }
    doSubclassThing(imgInfo) {
        this.showImgInfo(imgInfo)
        this.checkPreNext()
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
        if (this.imgHasLoaded) {
            this.mapMenu.prevImgShow()
        }
    }
    nextImg() {
        if (this.imgHasLoaded) {
            this.mapMenu.nextImgShow()
        }
    }
    updateImgSuspect () {
        let renderData = this.mapMenu.activeRenderData()
        let id = renderData.id
        let putData = {
            markPos: [...this.Viewer.userSelectRegion]
        }
        if (putData.markPos.length > 0) {
            $.NstsPUT(APIURI + 'api/plot/' + id, JSON.stringify(putData), res => {
                if (!res.result) {
                    console.log(res.msg)
                }
            })
        }
    }
}
