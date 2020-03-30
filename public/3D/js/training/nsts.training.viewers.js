/**
 * author： leeing
 * time: 2018/3/6
 * description: just show 3D image
 * FIXME:
 * 1. 当加载3D图像的时候，CT和DR图像同时下载，同时两者保存的 fileID 又是同一个id，
 *    这时就会出现一个竞争情况，说先下载完成谁可以保存，另一部分的数据就会出现 `提示保存错误的问题` （UNIQUE constraint failed: File_MainStore.FileID）
 *    毕竟存储的时候，用的是一个回调！
*/


// ! 1.后台接口baseUrl
const APIURI = localStorage.getItem('app_api_url')

// ! 2. 多语言词条。在单独加在此文件的时候不能获取lang.js里面的词条
var LANGEntry = {
    'zh-CN': {
        // 通用
        // DR
        DRImage: 'DR图',
        angleOne: '视角一',
        angleTwo: '视角二',
        colours: '真彩色',
        markTip: '突出显示嫌疑物',
        // CT
        surface: '表面增强',
    },
    'en': {
        // DR
        DRImage: 'DR image',
        angleOne: 'Angle one',
        angleTwo: 'Angle two',
        colours: 'Color',
        markTip: 'Highlight suspect',
        // CT
        surface: 'Surface',
    }
}
var LANGForm = localStorage.getItem('lang') || 'zh-CN'
var LANG_LOCAL = LANGEntry[LANGForm]


/**
 * !@class DrViewer
 */
class DrViewer {
    constructor(options={}) {
        this.options = {
          DrWidth: 400, // 默认宽
          DrHeight: 400, // 默认高
          DrContainerID: 'canvasdr',// DR图像容器一
          DrContainerID2: 'canvasdr-2',// DR图像容器二
          showSusobj: true, // 是否"突出显示危险品"（将红色嫌疑框显示出来）
          doubleAngleShow: true,
          defaultZoomIndex: 10,
          loadedCallback:null, // 初始化定义的回调函数，用于考题制作时的loading加载
          isNuctech: false, // 是否是nuctech人员，隐藏部分功能
        }
        Object.assign(this.options, options)
        this.init()
    }
    init() {
        this.initVariable()
        this.initSqlLite()
        this.initDrElement()
        if (this.options.doubleAngleShow) {
            this.initDrElement2() // 初始化第二个dr图像实例
        }
        this.initToolsBtnEvent()
    }
    initVariable() {
        this.shaderA = 'raw' //第一个参数。默认就是表面增强
        this.shaderB = 'standard' //第二个参数。默认是标准
        this.shaderC = 'default' //第三个参数。默认就是真彩色
        this.isInverse = false // 是否反色
        this.hasLoaded = true  // 判断图像是否加载完成。用于图像练习倒计时
        this.isFirstTimeShow =  true // 是否是第一次加载图像。用于判断第二幅图像开始，清除用户标记嫌疑框
        this.isFirstTimeShowOf2 =  true
        this.showSusobjByUser = true // 用户手动标记嫌疑物
        this.selectTipResult = null
        this.isTipSelected = false
        this.hasInsertTip = false
        this.userSelectRegion = []
        this.userSelectRegionShow = null
        this.singleGraphModle = false // 默认是单图模式。false：双视角同时显示(侧视角)
        this.drWidth = this.options.DrWidth
        this.drHeight = this.options.DrHeight
        this.needRemebUserSelectRegion = false // 是否需要记住用户标记的嫌疑框

        // 页面元素
        this.body = $('body')
        this.loadingLayer = $('.j-loading')
        this.$drinstanceWrap = $(`#${this.options.DrContainerID}`)
        this.curOperateName = $('.j-cur-operate')
        this.zoomIndex = $('.j-dr-zoomindex')
        this.btns = $('.j-tools a')
        this.marktipBtn = $('.marktip')
        this.anglesWrap = $('.j-angles')
        this.drContainer = $('.j-dr-container')
        this.entityContainer = $('.j-entity-container')
        this.entityImg = this.entityContainer.find('img')
        this.entityBtnWrap = $('.j-entity-wrap')
        this.entityBtn = this.entityBtnWrap.find('.entity-img')
        this.thumbnailWrap = $('.j-thumbnail')
        this.amplifyContainer = this.thumbnailWrap.find('.large')
        this.thumbnailImg = this.thumbnailWrap.find('img')
        this.mainViewBtn = $('.j-main-view')
        this.sideViewBtn = $('.j-side-view')
        this.angleIndex = 0
    }
    initDrElement() {
        Module3D.DRColorTableRootDir = '/static/3D/js/wgl/data/'
        this.drinstance = new Module3D.DRImageInstance()
        this.drinstance.setScaleMinAndMax(0.1, 4) //缩放比例最大最小值
        this.drinstance.setCallbackWhenLoaded(() => { //DR图像加载完成后
            this.loaded()
        })
        this.drinstance.setMouseWheelCallback(() => { //dr 缩放系数
            this.zoomIndex.text(this.drinstance.getZoomIndex().toFixed(1))
        })
        this.drinstance.showSusobj(this.options.showSusobj) //dr练习时不让危险品突出显示
        this.drinstance.setMMSelectCallback((data) => {
            this.setSelectTipResult(data)
            this.drinstance.showSusobj(false)
        })
        // tip插入管理实例初始化
        // this.tipManager = new Module3D.DRTipManager()
        // this.tipManager.setDr(this.drinstance)
        if (!this.options.showSusobj) {
            this.marktipBtn.addClass('disabled')
        }
    }
    initDrElement2() {
        this.drinstance2 = new Module3D.DRImageInstance()
        this.drinstance2.setScaleMinAndMax(0.1, 4) //缩放比例最大最小值
        this.drinstance2.setCallbackWhenLoaded(() => { //DR图像加载完成后
            this.loaded2()
        })
        this.drinstance2.setMouseWheelCallback(() => { //dr 缩放系数
            this.zoomIndex.text(this.drinstance2.getZoomIndex().toFixed(1))
        })
        this.drinstance2.showSusobj(this.options.showSusobj) //dr练习时不让危险品突出显示
        this.drinstance2.setMMSelectCallback((data) => {
            this.setSelectTipResultOfAngle2(data)
            this.drinstance2.showSusobj(false)
        })
    }
    showDR(imgInfo) {
        this.angleIndex = 0
        this.activeImgInfo = imgInfo
        this.userSelectRegion.length = 0
        this.loadStart()
        this.sql.getData_DR(imgInfo, this.initShowDR.bind(this))
    }
    initShowDR(data) {
        this.renderingData = data
        this.entityContainer.hide()
        this.drContainer.css('display', 'flex')
        // -主视角&侧视角
        if (this.singleGraphModle) {
            this.drWidth = this.options.DrWidth
            this.drContainer.removeClass('doubleShow')
            this.mainViewBtn.addClass('active')
        } else {
            this.sideViewBtn.addClass('active')
            if (this.renderingData[2]) {
                this.drWidth = this.drContainer.width() / 2
                this.drContainer.addClass('doubleShow')
            } else {
                this.drWidth = this.options.DrWidth
                this.drContainer.removeClass('doubleShow')
            }
        }
        // -缩略图
        if (this.activeImgInfo.physicalMaps.length !== 0) {
            let thunmbnailUrl = this.activeImgInfo.physicalMaps[0].url
            this.entityImg.attr('src', '').data('url', thunmbnailUrl)
            this.amplifyContainer.css('background', `url(${thunmbnailUrl}) no-repeat`)
            this.entityBtn.removeClass('active')
            if (!this.singleGraphModle) {
                this.thumbnailWrap.css('display', 'flex')
                this.thumbnailImg.attr('src', thunmbnailUrl)
                this.entityBtnWrap.removeClass('has-entity')
            } else {
                this.entityBtnWrap.addClass('has-entity')
                this.thumbnailWrap.hide()
            }
        } else {
            this.entityBtnWrap.removeClass('has-entity')
            this.thumbnailWrap.hide()
        }
        this.renderDR()
    }
    renderDR() {
        // console.log('%c Show DR ... ', 'background:#f90;color:#fff')
        !this.isFirstTimeShow && this.drinstance.remove2DRectangle()
        if (this.singleGraphModle) {
            this.drinstance.loadTexture(this.options.DrContainerID, this.renderingData[this.angleIndex == 0 ? 0 : 2], this.drWidth, this.drHeight)
            this.drinstance.loadTextureApp(this.renderingData[this.angleIndex == 0 ? 1 : 3])
        } else {
            this.drinstance.loadTexture(this.options.DrContainerID, this.renderingData[0], this.drWidth, this.drHeight)
            this.drinstance.loadTextureApp(this.renderingData[1])
            if (this.renderingData[2]) {
                !this.isFirstTimeShowOf2 && this.drinstance2.remove2DRectangle()
                this.drinstance2.loadTexture(this.options.DrContainerID2, this.renderingData[2], this.drWidth, this.drHeight)
                setTimeout(() => {
                    this.drinstance2.loadTextureApp(this.renderingData[3])
                }, 100)
            }
        }
        this.hasInsertTip && this.renderInsertTip()
    }
    loadStart () {
        this.loadingLayer.show()
        this.hasLoaded = false
        this.hasImgFirstLoaded = false
        this.selectTipResult = null
        this.isTipSelected = false
        this.showSusobjByUser = true
        this.revertInitStatus()
    }
    revertInitStatus () {
        this.shaderA = 'raw'
        this.shaderB = 'standard'
        this.shaderC = 'default'
        this.isInverse = false
        this.absorbValue = 0
        this.body.removeClass('inverse')
        this.btns.removeClass('active')
        this.mainViewBtn.removeClass('show-entity')
        this.sideViewBtn.removeClass('show-entity')

        if (!this.options.showSusobj) {
            this.coloursBtn.addClass('active')
            this.curOperateName.html(`<span>${LANG_LOCAL.colours}</span>`)
        } else {
            this.coloursBtn.addClass('active')
            if (this.activeImgInfo.isTip) {
                this.marktipBtn.addClass('disabled')
                this.curOperateName.html(`<span>${LANG_LOCAL.colours}</span>`)
            } else {
                this.marktipBtn.addClass('active').removeClass('disabled')
                this.curOperateName.html(`<span>${LANG_LOCAL.colours}</span>+<span>${LANG_LOCAL.markTip}</span>`)
            }
        }
    }
    renderLoadedStatus () {
        this.setShader()
        this.drinstance.restoreOrigialPos()
        this.drinstance.setInverse(this.isInverse)
        this.drinstance.setAbsorbLUT(65000, this.absorbValue)
        this.drinstance.switchToTipImage(false)
        // this.drinstance.switchToTipImage(this.activeImgInfo.isTip)
        if (this.activeImgInfo.isTip) {
            this.drinstance.setZoomIndex(this.options.defaultZoomIndex + 2)
        } else {
            this.drinstance.setZoomIndex(this.options.defaultZoomIndex)
        }
        this.zoomIndex.text(this.drinstance.getZoomIndex().toFixed(1))
        if (this.options.showSusobj) {
            this.drinstance.showSusobj(!this.activeImgInfo.isTip && this.showSusobjByUser)
        } else {
            this.drinstance.showSusobj(false)
        }
    }
    setRemebUserSelectRegion (isNeedRemb) {
        this.needRemebUserSelectRegion = isNeedRemb
    }
    loaded() {
        this.loadingLayer.hide()
        this.options.loadedCallback && this.options.loadedCallback()
        if (!this.hasImgFirstLoaded) { // 视角二图像加载完成后不再进行倒计时
            this.hasLoaded = true
            this.hasImgFirstLoaded = true
            this.loadedCbCountdown && this.loadedCbCountdown() // 用于确定考试、练习倒计时何时开始的回调函数
        }
        this.renderLoadedStatus()
        // -这里是用户标记嫌疑框回显。在图像练习、考试等记录查看时
        if (this.userSelectRegionShow && this.userSelectRegionShow[this.angleIndex]) {
            this.drinstance.add2DRectangle(...this.userSelectRegionShow[this.angleIndex])
        }
        this.isFirstTimeShow = false
        // -用户实时画框在视角一二之间切换时显示。加载之前记录标记的嫌疑框。但是一旦用户重新标记之后，就在`setSelectTipResult`中将这个框清除掉
        if (this.needRemebUserSelectRegion) {
            if (this.userSelectRegion.length > 0 && !!this.userSelectRegion[this.angleIndex]) {
                this.drinstance.add2DRectangle(...this.userSelectRegion[this.angleIndex], '#ff0000')
            }
        }
    }
    resetDR() {
        this.revertInitStatus()
        this.renderLoadedStatus()
        // 用户标记的嫌疑框回显
        this.drinstance.remove2DRectangle()
        if (this.userSelectRegionShow && this.userSelectRegionShow[this.angleIndex]) {
            this.drinstance.add2DRectangle(...this.userSelectRegionShow[this.angleIndex])
        }
    }
    loaded2() {
        this.resetDR2()
        this.isFirstTimeShowOf2 = false
    }
    resetDR2() {
        this.drinstance2.setShader(this.shaderA, this.shaderB, this.shaderC)
        this.drinstance2.setInverse(this.isInverse)
        this.drinstance2.restoreOrigialPos()
        this.drinstance2.setAbsorbLUT(65000, this.absorbValue)
        this.drinstance2.showSusobj(this.options.showSusobj && !this.activeImgInfo.isTip)

        this.drinstance2.switchToTipImage(false)
        if (this.activeImgInfo.isTip) {
            this.drinstance2.setZoomIndex(this.options.defaultZoomIndex + 2)
        } else {
            this.drinstance2.setZoomIndex(this.options.defaultZoomIndex)
        }
        this.drinstance2.remove2DRectangle()
        if (this.userSelectRegionShow && this.userSelectRegionShow[1]) {
            this.drinstance2.add2DRectangle(...this.userSelectRegionShow[1])
        }
        if (this.needRemebUserSelectRegion) {
            if (this.userSelectRegion.length > 0 && !!this.userSelectRegion[1]) {
                this.drinstance2.add2DRectangle(...this.userSelectRegion[1], '#ff0000')
            }
        }
    }
    clearUserSelectRegion () {
        this.drinstance.clearUserSelectRegion()
        if (this.drinstance2) {
            this.drinstance2.clearUserSelectRegion()
        }
        this.userSelectRegion.length = 0 // 清空用户标记嫌疑框的数据
    }
    setShader() {
        // console.log(`%c DR渲染参数： ${this.shaderA} ${this.shaderB} ${this.shaderC} `, 'background:#00bcd4;color:#fff')
        this.drinstance.setShader(this.shaderA, this.shaderB, this.shaderC)
        this.drinstance.refreshDisplay()
        if (this.isTrueDoubleShow()) {
            this.drinstance2.setShader(this.shaderA, this.shaderB, this.shaderC)
            this.drinstance2.refreshDisplay()
        }
    }
    // -用户画框后的设置的回调函数
    setSelectTipResult(data) { // data: [true/false, useMarkCoordinateArr]
        // console.log(`%c DR 标记嫌疑物 ${data} `, 'background:#f90;color:#fff')
        this.selectTipResult = data[0]
        this.isTipSelected = true
        this.userSelectRegion[this.angleIndex] = data[1]
        this.selectTipResultCallback && this.selectTipResultCallback(data)
        // -不是查看模式下，没有用户标记嫌疑框的记录数据。相当于在线标记完的回调
        if (!this.userSelectRegionShow) {
            this.drinstance.remove2DRectangle()
        }
    }
    setSelectTipResultOfAngle2(data) {
        // console.log(`%c DR [②] 标记嫌疑物 ${data} `, 'background:#f0f;color:#fff')
        this.selectTipResult = data[0]
        this.isTipSelected = true
        this.userSelectRegion[1] = data[1]
        this.selectTipResultCallback && this.selectTipResultCallback(data)
    }
    insertTip(tipInfo, initTipPos=[200, 200], defaultAngle2Y=200) {
        this.initRenderTipPos = initTipPos // [x, y, z, rotateVal, zoomVal]
        this.tipManager.setDefaultY(defaultAngle2Y) // 设置第二视角的Y轴坐标
        this.sql.getData_DR(tipInfo, this.initShowTip.bind(this))
    }
    // - 插入TIP相关
    initShowTip(data) {
        console.log('%c SHOW TIP ...', 'background:#eb2f96;color:#fff')
        this.hasInsertTip = true
        this.renderTipData = data
        this.insertTipRotateAngle1 = this.initRenderTipPos[2] || 0 // -tip的旋转角度
        this.insertTipZoom = this.initRenderTipPos[3] || 1 // -tip的缩放倍数
        if (this.hasLoaded) { // !担心DR图像的数据还在获取，这里已经开始显示tip。此时会显示不出来.需要依靠dr加载完成后再次插入tip
            this.tipManager.bindTipToDr(this.angleIndex,
                [[this.renderTipData[this.renderTipDataIndex], this.initRenderTipPos[0], this.initRenderTipPos[1], 100, this.insertTipRotateAngle1, this.insertTipZoom]]
            )
        }
    }
    setDefaultRotateAngle2 (value) {
        this.insertTipRotateAngle2 = value
    }
    renderInsertTip() {
        let tipPos, insertTipRotateAngle
        if (this.angleIndex === 0) {
            tipPos = this.tipManager.original_pos_1[0]
            insertTipRotateAngle = this.insertTipRotateAngle1
        } else {
            tipPos = this.tipManager.original_pos_2[0]
            insertTipRotateAngle = this.insertTipRotateAngle2
        }
        if (!tipPos || tipPos.length === 0) {
            tipPos = this.initRenderTipPos
        }
        this.tipManager.bindTipToDr(this.angleIndex,
            [[this.renderTipData[this.renderTipDataIndex], tipPos[0], tipPos[1], 100, insertTipRotateAngle, this.insertTipZoom]]
        )
        this.drinstance.refreshDisplay()
    }
    get renderTipDataIndex () {
        return this.angleIndex === 0 ? 0 : 2 // 插入的TIP需要对应到当前的视角上
    }
    // -tip旋转
    rotateInsertTip(angle) {
        if (this.angleIndex == 0) {
            this.insertTipRotateAngle1 = angle
            this.tipManager.changeTipAngleScale1(0, this.insertTipRotateAngle1, this.insertTipZoom)
        } else {
            this.insertTipRotateAngle2 = angle
            this.tipManager.changeTipAngleScale2(0, this.insertTipRotateAngle2, this.insertTipZoom)
        }
    }
    // -tip缩放
    zoomInsertTip (zoom) {
        this.insertTipZoom = zoom
        if (this.angleIndex == 0) {
            this.tipManager.changeTipAngleScale1(0, this.insertTipRotateAngle1, this.insertTipZoom) // 第一个参数表示插入tip的索引
        } else {
            this.tipManager.changeTipAngleScale2(0, this.insertTipRotateAngle2, this.insertTipZoom)
        }
    }
    removeInsertTip() {
        this.hasInsertTip = false
        this.tipManager.bindTipToDr(0, null)
        this.tipManager.original_pos_2.forEach(item => item[0] = 200) // 重置视角二 x 轴的值
    }
    // 获取插入tip的位置信息
    getInsertTipPos() {
        let tipPos = []
        tipPos.push(this.tipManager.original_pos_1[0])
        if (this.activeImgInfo.dr.length === 2) {
            tipPos.push(this.tipManager.original_pos_2[0])
        }
        return tipPos
    }
    stopRender() {
        this.drinstance.renderer.forceContextLoss()
        this.drinstance.renderer.context = null
        this.drinstance.renderer.domElement = null
        this.drinstance.renderer = null
        if (this.drinstance2) {
            this.drinstance2.renderer.forceContextLoss()
            this.drinstance2.renderer.context = null
            this.drinstance2.renderer.domElement = null
            this.drinstance2.renderer = null
        }
    }
    isTrueDoubleShow() {
        return !this.singleGraphModle && this.renderingData[2]
    }
    // 事件绑定
    initToolsBtnEvent() {
        let that = this
        // -实物图显示
        this.entityBtn.on('click', function() {
          if (that.entityBtn.hasClass('active')) return
          that.entityBtn.addClass('active')
          that.mainViewBtn.removeClass('active')
          that.sideViewBtn.removeClass('active')
          let src = that.entityImg.attr('src')
          let url = that.entityImg.data('url')
          !src && that.entityImg.attr('src', url)
          that.drContainer.hide()
          that.entityContainer.css('display', 'flex')
        })

        // -主视角
        this.mainViewBtn.click(function() {
            if (that.mainViewBtn.hasClass('active')) return
            if (!that.drContainer.is(':visible')) {
                that.drContainer.css('display', 'flex')
                that.entityContainer.hide()
                that.entityBtn.removeClass('active')
            }
            that.mainViewBtn.addClass('active')
            that.sideViewBtn.removeClass('active')
            that.singleGraphModle = true
            that.angleIndex = 0
            that.initShowDR(that.renderingData)
        })

        // -侧视角
        this.sideViewBtn.click(function() {
            if (that.sideViewBtn.hasClass('active')) return
            if (!that.drContainer.is(':visible')) {
                that.drContainer.css('display', 'flex')
                that.entityContainer.hide()
                that.entityBtn.removeClass('active')
            }
            that.sideViewBtn.addClass('active')
            that.mainViewBtn.removeClass('active')
            that.singleGraphModle = false
            that.angleIndex = 0
            that.initShowDR(that.renderingData)
        })

        // 渲染参数B => 超级穿透
        this.hiBtn = $('.j-tools .hi')
        this.hiBtn.click(function () {
            $(this).hasClass('active') ? $(this).removeClass('active') : $(this).addClass('active')
            that.shaderB = $(this).hasClass('active') ? 'superpenetrate' : 'standard'
            that.setShader()
        })

        // 按钮组 C  => 灰色、彩色、ms、os    @ CT DR 通用
        this.groupC = $('.j-tools a[data-group="c"]')
        this.groupC.click(function () {
            if (!$(this).hasClass('active')) {
                that.groupC.removeClass('active')
                $(this).addClass('active')
            } else {
                if ($(this).hasClass('colours')) {
                    return false
                } else {
                    $(this).removeClass('active')
                    that.groupC.filter('.colours').addClass('active')
                }
            }
            groupC()
        })
        function groupC() {
            that.shaderC = that.groupC.filter('.active').data('tag')
            that.setShader()
        }

        // 反色显示  @ CT DR shared
        this.inverseBtn = $('.j-tools .inverse')
        this.inverseBtn.click(function () {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active')
                that.body.removeClass('inverse')
            } else {
                $(this).addClass('active')
                that.body.addClass('inverse')
            }
            that.isInverse = $(this).hasClass('active')
            inverse()
        })
        function inverse() {
            that.drinstance.setInverse(that.isInverse)
            if (that.isTrueDoubleShow()) {
                that.drinstance2.setInverse(that.isInverse)
            }
        }

        // 重置
        this.resetBtn = $('.reset')
        this.resetBtn.click(function () {
            that.resetDR()
            if (that.isTrueDoubleShow()) {
                that.resetDR2()
            }
        })

        //突出显示嫌疑物 DR
        this.marktipBtn.click(function () {
            if ($(this).hasClass('disabled') || !that.options.showSusobj) {
                return
            }
            if (!$(this).hasClass('active')) {
                that.showSusobjByUser = true
                $(this).addClass('active')
                !that.activeImgInfo.isTip && that.drinstance.showSusobj(true)
                if (that.isTrueDoubleShow()) {
                    !that.activeImgInfo.isTip && that.drinstance2.showSusobj(true)
                }
            } else {
                $(this).removeClass('active')
                that.showSusobjByUser = false
                !that.activeImgInfo.isTip && that.drinstance.showSusobj(false)
                if (that.isTrueDoubleShow()) {
                    !that.activeImgInfo.isTip && that.drinstance2.showSusobj(false)
                }
            }
        });

        // 可变吸收率
        this.absorbValue = 0
        this.groupAbsorb = $('.j-tools .dr-btn[data-group="absor"]')
        this.groupAbsorb.click(function () {
            that.absorbValue += parseInt($(this).data('absor'))
            if (that.absorbValue > 0) {
                that.groupAbsorb.removeClass('active').filter('.absor-plus').addClass('active')
            } else if (that.absorbValue < 0) {
                that.groupAbsorb.removeClass('active').filter('.absor-minus').addClass('active')
            } else {
                that.groupAbsorb.removeClass('active')
            }
            groupAbsorb()
        })
        function groupAbsorb() {
            if (that.absorbValue > 25) {
                that.absorbValue = 25
                return false
            }
            if (that.absorbValue < -25) {
                that.absorbValue = -25
                return false
            }
            that.drinstance.setAbsorbLUT(65000, that.absorbValue)
            if (that.isTrueDoubleShow()) {
                that.drinstance2.setAbsorbLUT(65000, that.absorbValue)
            }
            // showOperateName()
        }

        // 超级增强     @ DR 独有
        this.groupADr = $('.j-tools .dr-btn[data-group="a"]')
        this.groupADr.click(function () {
            $(this).hasClass('active') ? $(this).removeClass('active') : $(this).addClass('active')
            that.shaderA = $(this).hasClass('active') ? 'super' : 'raw'
            that.drinstance.updateShader(that.shaderA, that.shaderB, that.shaderC)
            that.drinstance.refreshDisplay()
            if (that.isTrueDoubleShow()) {
                that.drinstance2.updateShader(that.shaderA, that.shaderB, that.shaderC)
                that.drinstance2.refreshDisplay()
            }
        })

        /*
        * 显示操作按钮名称
        */
       this.btns.click(function () {
            showOperateName()
        })
        function showOperateName() {
            let nameText = []
            that.btns.filter('.active').each(function (index, elem) {
                let operateName = $(elem).attr('title')
                nameText.push(`<span>${operateName}</span>`)
            })
            that.curOperateName.html(nameText.join('+'))
        }

        /*
            键盘监听事件
        */
        this.bwBtn = $('.j-tools .bw')
        this.coloursBtn = $('.colours')
        this.osBtn = $('.j-tools .os')
        this.msBtn = $('.j-tools .ms')
        this.surfaceBtn = $('.j-tools .surface')
        this.absorbPlusBtn = this.groupAbsorb.filter('.absor-plus')
        this.absorbMinusBtn = this.groupAbsorb.filter('.absor-minus')
        this.prevBtn = $('.j-prevbtn-wrap .btn-prev')
        this.nextBtn = $('.j-nextbtn-wrap .btn-next')
        this.safeBtn = $('.j-pass')
        this.dangerBtn = $('.j-nopass')
        $(window).keydown(event => {
            let keyType = event.which
            switch (keyType) {
                // ! 业务操作
                case 190:   // > : 箱包通过
                    this.safeBtn.click()
                    break
                case 191:   // ? 箱包危险
                    this.dangerBtn.click()
                    break
                case 38:    // +
                    this.absorbPlusBtn.click()
                    break
                case 40:    // -
                    this.absorbMinusBtn.click()
                    break
                case 37:    // <--
                    if (this.prevBtn.is(':visible')) {
                        this.prevBtn.click()
                    }
                    break
                case 39:    // -->
                    if (this.nextBtn.is(':visible')) {
                        this.nextBtn.click()
                    }
                    break
                // ! 图像操作
                case 81:    // Q
                    this.bwBtn.click()
                    break
                case 87:    // W
                    this.coloursBtn.click()
                    break
                case 69:    // E
                    this.msBtn.click()
                    break
                case 82:    // R
                    this.osBtn.click()
                    break
                case 84:    // T
                    this.marktipBtn.click()
                    break
                case 65:    // A
                    this.inverseBtn.click()
                    break
                case 83:    // S
                    this.groupADr.click()
                    break
                case 68:    // D
                    this.hiBtn.click()
                    break
                case 70:    // F
                    this.resetBtn.click()
                    break
                default:
                    break;
            }
        })
    }
    initSqlLite () {
        this.sql = new DBQuery()
    }
    dropDataBase () {
        this.sql.dropTable() // !删除数据库数据
    }
}

/**
 * !实现web缓存基本的增删改查
 *
 * .open() 是一个异步操作，使用的时候需要提前将初始化
 * created by leeing on 2018/04/28
 */
class IndexedDB {
    constructor(options={}) {
      this.options = {
        version: 1,
        dbName: 'NSTS',
        tableName: 'imgIndexDB',
        createIndexName: ['FileID']
      }
      Object.assign(this.options, options)
      this.init()
    }
    init() {
      this.tableName = this.options.tableName
      this.request = window.indexedDB.open(this.options.dbName, this.options.version)
      this.request.onupgradeneeded = event => {
        console.log('%c 数据库创建或者版本更新 ', 'background:#fa8c16;color:#fff;')
        let db = event.target.result
        let objectStore = db.createObjectStore(this.tableName, {KeyPath: 'FileID'})
        if (this.options.createIndexName) {
          this.options.createIndexName.forEach((name, index) => {
            objectStore.createIndex(name, name, {unique: index === 0})
          })
        }
      }
      this.request.onsuccess = event => {
        // console.log('%c 数据库建立成功 ', 'background:#13c2c2;color:#fff;')
        this.db = event.target.result
      }
      this.request.onerror = event => {
        console.log('%c 数据库建立失败 ', 'background:#f5222d;color:#fff;')
        console.log("Why didn't you allow my web app to use IndexedDB?!")
      }
    }
    insert(data) {
      return new Promise((resolve, reject) => {
        let store = this.db
                        .transaction(this.tableName, 'readwrite')
                        .objectStore(this.tableName)
        let req = store.add(data, data.FileID)
        req.onsuccess = function() {
            // console.log(`%c ${data.FileID} 数据存储 `, 'background:#52c41a;color:#fff;')
            resolve(this.result)
        }
        req.onerror = function() {
            reject(this.result)
        }
      })
    }
    insert_many(data) {
        return new Promise((resolve, reject) => {
          if (!Array.isArray(data)) {
            reject('data must be array')
          }
          let store = this.db
                          .transaction(this.tableName, 'readwrite')
                          .objectStore(this.tableName)
          data.forEach(item => {
            let req = store.add(item, item.FileID)
            req.onsuccess = function() {
              resolve(this.result)
            }
            req.onerror = function() {
              reject(this.result)
            }
          })
        })
    }
    update(data) {
        return new Promise((resolve, reject) => {
            let store = this.db
                            .transaction(this.tableName, 'readwrite')
                            .objectStore(this.tableName)
            let req = store.put(data, data.FileID)
            req.onsuccess = function() {
                // console.log(`%c ${data.FileID} 数据更新 `, 'background:#722ed1;color:#fff;')
                resolve(this.result)
            }
            req.onerror = function() {
                reject(this.result)
            }
        })
    }
    get_by_key(key) {
        return new Promise((resolve, reject) => {
            if (!key) {
                resolve(null)
            }
            let store = this.db
                            .transaction(this.tableName, 'readwrite')
                            .objectStore(this.tableName)
            let req = store.get(key)
            req.onsuccess = function() {
                resolve(this.result)
            }
            req.onerror = function() {
                reject(this.result)
            }
        })
    }
    get_by_index(value, indexName='name') {
        if (!value) {
            return Promise.reject('索引值不能为空!!!')
        }
        if (!this.options.createIndexName.includes(indexName)) {
            return Promise.reject(`没有这个 ${indexName} 索引!`)
        }
        let store = this.db
                        .transaction(this.tableName, 'readwrite')
                        .objectStore(this.tableName)
        let index = store.index(indexName)
        return new Promise((resolve, reject) => {
            let req = index.get(value)
            req.onsuccess = e => {
                resolve(e.target.result)
            }
            req.onerror = e => {
                reject(e.target)
            }
        })
    }
    get_all_index(value, indexName='name') {
        if (!value) {
            return Promise.reject('索引不能为空!!!')
        }
        if (!this.options.createIndexName.includes(indexName)) {
            return Promise.reject('没有这个indexName!!!')
        }
        let index = this.db
                        .transaction(this.tableName, 'readOnlu')
                        .objectStore(this.tableName)
                        .index(indexName)
        return new Promise((resolve, reject) => {
            let req = index.getAll(value)
            req.onsuccess = e => {
                resolve(e.target.result)
            }
            req.onerror = e => {
                reject(e.target)
            }
        })
    }
    delete(key) {
        if (!key) {
            return Promise.reject('key 值不能为空')
        }
        let store = this.db
                        .transaction(this.tableName, 'readwrite')
                        .objectStore(this.tableName)
        let req = store.delete(key)
        req.onsuccess = e => {
            return Promise.resolve(e.target.result)
        }
    }

}

/**
 * !图像本地存储
 *
 * 获取|保存 DR、CT 图像到本地
 * 为了立即获取进行数据库操作的事务，DB_INSTANCE 需完成初始化
 * created by leeing on 2018/04/28
 */
class DBQuery {
    constructor() {
        this.init()
    }
    init() {
        if (DBQuery.dbInstance) {
            this.dbHelper = DBQuery.dbInstance
        } else {
            this.dbHelper = new IndexedDB()
        }
    }
    getData_CT(imgInfo, callback) {
        this.dbHelper.get_by_key(imgInfo.storageID).then(db_data => {
            // 本地还没有保存过这条 fileID 的数据
            if (!db_data) {
                // console.log(`%c CT数据远程下载 & 本地存储 ... `, 'background:#c41d7f;color:#fff')
                this.fetchData_CT(imgInfo.ct).then(data => {
                    // console.log(data)
                    let insertData = {
                        FileID: imgInfo.storageID,
                        ImgData: data[0],
                        ImgDesData: data[1],
                        SuspectCubeData: data[2],
                        Density: data[3]
                    }
                    this.dbHelper.insert(insertData).catch(err => console.log())
                    callback(data)
                })
            } else {
                // 没有 CT 相关的数据存储，需要 update 这条 fileID 的数据
                if (!db_data.ImgData) {
                    // console.log(`%c CT数据本地更新 ... `, 'background:#eb2f96;color:#fff')
                    this.fetchData_CT(imgInfo.ct).then(data => {
                        db_data.ImgData = data[0]
                        db_data.ImgDesData = data[1]
                        db_data.SuspectCubeData = data[2]
                        db_data.Density = data[3]
                        this.dbHelper.update(db_data)
                        callback(data)
                    })
                } else {
                    // console.log(`%c CT数据本地读取 ... `, 'background:#f759ab;color:#fff')
                    let {ImgData, ImgDesData, SuspectCubeData, Density} = db_data
                    callback([ImgData, ImgDesData, SuspectCubeData, Density])
                }
            }
        })
    }
    getData_DR(imgInfo, callback) {
        // console.log('DR_ID', imgInfo.storageID)
        this.dbHelper.get_by_key(imgInfo.storageID).then(db_data => {
            // 本地还没有保存过这条 fileID 的数据
            if (!db_data) {
                // console.log(`%c DR数据远程下载 & 本地存储 ... `, 'background:#c41d7f;color:#fff')
                this.fetchData_DR(imgInfo.dr).then(data => {
                    // console.log(data)
                    let insertData = {
                        FileID: imgInfo.storageID,
                        Angle1: data[0],
                        Suspect1: data[1],
                        Angle2: data[2] || null,
                        Suspect2: data[3] || null
                    }
                    this.dbHelper.insert(insertData).catch(err => console.log())
                    callback(data)
                })
            } else {
                // 没有 DR 相关的数据存储，需要 update 这条 fileID 的数据
                if (!db_data.Angle1) {
                    // console.log(`%c DR数据本地更新 ... `, 'background:#eb2f96;color:#fff')
                    this.fetchData_DR(imgInfo.dr).then(data => {
                        // console.log(data)
                        db_data.Angle1 = data[0]
                        db_data.Suspect1 = data[1]
                        db_data.Angle2 = data[2] || null
                        db_data.Suspect2 = data[3] || null
                        this.dbHelper.update(db_data)
                        callback(data)
                    })
                } else {
                    // console.log(db_data)
                    let {Angle1, Suspect1, Angle2, Suspect2} = db_data
                    // console.log(`%c DR数据本地读取 ... `, 'background:#f759ab;color:#fff')
                    callback([Angle1, Suspect1, Angle2, Suspect2])
                }
            }
        })
    }
    // 视角主体数据
    fetchData_CT(ctObj) {
        let fetchDataFns = []
        Object.keys(ctObj).map(key => ctObj[key]).forEach(item => {
            if (item) {
                if (item.endsWith('.txt')) {
                    fetchDataFns.push(this.loadDataByFileReaderTxt(item))
                } else {
                    fetchDataFns.push(this.loadDataByFileReader(item))
                }
            } else {
                fetchDataFns.push(this.loadEmptyData())
            }
        })
        return new Promise((resolve, reject) => {
            Promise.all(fetchDataFns)
            .then(data => {
                resolve(data)
            })
            .catch(error => {
                reject(error)
            })
        })
    }
    fetchData_DR(drArr) {
        let fetchDataFns = []
        // 视角主体数据
        drArr.forEach(item => {
          fetchDataFns.push(this.loadDataByFileReader(item.url))
          if (item.suspect) {
            // console.log(item.suspect)
            fetchDataFns.push(this.loadDataByFileReader(item.suspect))
          } else {
            fetchDataFns.push(this.loadEmptyData())
          }
        })
        return new Promise((resolve, reject) => {
          Promise.all(fetchDataFns)
            .then(data => {
              resolve(data)
            })
            .catch(error => {
              reject(error)
            })
        })
    }
    // 下载 png 图像信息
    loadDataByFileReader(url) {
        return new Promise((resolve, reject) => {
          let reader = new FileReader()
          let xhr = new XMLHttpRequest()

          xhr.open('get', url + `?${Date.now()}`, true)
          xhr.responseType = 'blob'
          xhr.onload = function () {
            if (this.status === 200) {
              reader.readAsDataURL(this.response)
            } else {
              console.log(this.statusText)
            }
          }
        //   xhr.setRequestHeader('If-Modified-Since','0')
          xhr.send(null)
          reader.onerror = error => {
            reject(error)
          }
          reader.onload = data => {
            resolve(data.target.result)
          }
        })
    }
    // 下载 txt 文件信息
    loadDataByFileReaderTxt(url) {
        return new Promise((resolve, reject) => {
          let reader = new FileReader()
          let xhr = new XMLHttpRequest()
          xhr.open('get', url + `?${Date.now()}`, true)
          xhr.responseType = 'blob'
          xhr.onload = function () {
              if (this.status === 200) {
                  reader.readAsText(this.response)
              } else {
                  console.log(this.statusText)
              }
          }
        //   xhr.setRequestHeader('If-Modified-Since','0')
          xhr.send(null)
          reader.onerror = error => {
            reject(error)
          }
          reader.onload = data => {
            resolve(data.target.result)
          }
        })
    }
    // 当 suspect='' 时，直接返回 null 数据
    loadEmptyData() {
        return new Promise(resolve => {
          resolve(null)
        })
    }
    static initIndexDBInstance () {
        DBQuery.dbInstance = new IndexedDB()
    }
}

// -项目中提前初始化
DBQuery.initIndexDBInstance()
