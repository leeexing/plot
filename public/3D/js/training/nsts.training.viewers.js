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
 * ! 鼠标滑动局部放大实物图
 * create by leeing on 2018-07-27
*/
class MagnifyThumbmail {
    constructor() {
        this.container = $('.entity-thumbnail')
        this.large = $('.large')
        this.small = $('.small')
        this.attachEvent()
    }
    attachEvent() {
        this.container.mousemove(e => {
            let smallWidth = this.small.width()
            let smallHeight = this.small.height()
            let largeWidth = this.large.width()
            let largeHeight = this.large.height()
            let sx = Math.floor((this.container.width() - smallWidth) /2)
            let sy = Math.floor((this.container.height() - smallHeight) /2)
            let imgObj = new Image()
            imgObj.src = this.small.attr('src')
            let nativewidth = imgObj.width
            let nativeHeight = imgObj.height
            let magnify_offset = this.container.offset()
            let mx = e.pageX - magnify_offset.left - sx;
            let my = e.pageY - magnify_offset.top - sy;
            if(mx < smallHeight && my < smallHeight && mx > 0 && my > 0) {
                this.large.fadeIn(100);
            } else            {
                this.large.fadeOut(100);
            }
            if(this.large.is(":visible")) {
                let rx = Math.round(mx/smallWidth*nativewidth - largeWidth/2)*-1;
                let ry = Math.round(my/smallHeight*nativeHeight - largeHeight/2)*-1;
                let bgp = rx + "px " + ry + "px";
                let px = mx - largeWidth/2 + sx - 200;
                let py = my - largeHeight/2 + sy - 100;
                this.large.css({left: px, top: py, backgroundPosition: bgp});
            }
        }).mouseleave(() => {
            this.large.fadeOut(100)
        })
    }
}

/**
 * ! 简单显示CT图像
 */
class CtViewerSimple {
    constructor(options={}) {
        this.options = {
            CtWidth: 600,
            CtHeight: 600,
            CtContainerID: 'canvasct',
            showSusobj: true, // 是否"突出显示危险品"
            slicePlaneVisible: true, // 是否显示切线平面
            sizeIndexDefault: 5, //摄像头初始化时的放大比例
            defaultTransparency: 0.33,
            callback: null
        }
        Object.assign(this.options, options)
        this.init()
    }
    init() {
        this.firstRender = true
        this.initSqlLite()
        this.initElement()
    }
    initElement() {
        Module3D.Rendering.ShaderPath = '/static/3D/js/wgl/data/'
        Module3D.Rendering.ColorTablePath = '/static/3D/js/wgl/data/color_table_coded.png'
        Module3D.Rendering.NoiseTexturePath = '/static/3D/js/wgl/data/random_noise.png'
        Module3D.DRColorTableRootDir = '/static/3D/js/wgl/data/'
        Module3D.Initialize(this.options.CtContainerID, this.options.CtWidth, this.options.CtHeight)
        Module3D.Rendering.RenderingMode = true //一直刷新状态/拖拽时刷新
        Module3D.Rendering.UseCameraSlerp = true // 转向平滑过度
        Module3D.Rendering.DisableSHShade(false) // 初始化 表面增强
        Module3D.Rendering.Draw()
        // Module3D.Rendering.SetBackgroundColor(255, 255, 255)
        // Module3D.Rendering.CurCamera.position.set(0, 0, 1.1) // 设置摄像机的空间位置
        // Module3D.Rendering.DisplaySuspectObject(this.options.showSusobj) // 突出显示嫌疑物
        // Module3D.Rendering.SetCameraZoom(this.options.sizeIndexDefault)

        Module3D.Rendering.SetVolumeLoadedCallback(this.loaded.bind(this)) // 图像加载完成后执行
    }
    initShow(imgInfo) {
        this.sql.getData_CT(imgInfo, this.showModule3D.bind(this))
    }
    showModule3D(ctRenderData) {
        console.log('%c Show 3D ... ', 'background:#f90;color:#fff')
        // console.log(ctRenderData)
        if (ctRenderData[2] !== null) {
            Module3D.Rendering.SetVolumeDataBase64Content('ct.png', ctRenderData[0], ctRenderData[1], ctRenderData[2])
          } else {
            Module3D.Rendering.SetVolumeDataBase64Content('ct.png', ctRenderData[0], ctRenderData[1])
        }
    }
    renderCtLoadedStatus () {
        Module3D.Rendering.SetBackgroundColor(255, 255, 255)
        Module3D.Rendering.CameraControls.enabled = true //启用右键
        Module3D.Rendering.ToAbove() //上视角
        Module3D.Rendering.DisableSHShade(false) // 表面增强
        Module3D.Rendering.EnableEdge(false) // 边缘增强
        Module3D.Rendering.SetAlpha(this.options.defaultTransparency) // 透明度
        Module3D.Rendering.SetClipPlaneZ(0, false) // 剪裁
        Module3D.Rendering.SetCameraZoom(this.options.sizeIndexDefault) // 摄像机缩放系数
        Module3D.Rendering.ClearAllBoxButRiskyObject() // 清除除了确定包围线框的所有线框
        Module3D.Rendering.SetSlicePosZ(0.488) // 3d切平面的函数
        Module3D.Rendering.DisplaySuspectObject(this.options.showSusobj) // 突出显示嫌疑物
        this.redraw3D()
    }
    // 考虑到停止渲染后用户操作无反应，暂时不开启暂停渲染的功能
    redraw3D() {
        Module3D.Rendering.ReDraw()
        // setTimeout(() => {
        //     Module3D.Rendering.StopRendering()
        // }, 2000)
    }
    loaded() {
        this.renderCtLoadedStatus()
        this.options.loadedCallback && this.options.loadedCallback()
    }
    reset() {
        this.renderCtLoadedStatus()
    }
    stopRender() {
        Module3D.Rendering.StopRendering()
        Module3D.Rendering.CurRenderer.forceContextLoss()
        Module3D.Rendering.CurRenderer.context = null
        Module3D.Rendering.CurRenderer.domElement = null
        Module3D.Rendering.CurRenderer = null
    }
    initSqlLite() {
        this.sql = new DBQuery()
    }
}

/**
 * !@class CtViewer
 */
class CtViewer {
    constructor(options={}) {
        this.options = {
          DrWidth: 400,
          DrHeight: 400,
          DrContainerID: 'canvasdr',// DR图像容器ID
          CtWidth: 600,
          CtHeight: 600,
          CtContainerID: 'canvasct',
          SliceWidth: 400,
          SliceHeight: 400,
          SliceContainerID: 'canvasslice',
          showDR: true, // 是否显示DR图像
          showSlice: true, // 是否显示切片图像
          showSusobj: true, // 是否"突出显示危险品"
          slicePlaneVisible: true, // 是否显示切线平面
          sizeIndexDefault: 6, //摄像头初始化时的放大比例
          defaultTransparency: 0.33, //默认CT透明度值
          defaultZoomIndexDr: 11,
          callback: null
        }
        Object.assign(this.options, options)
        this.init()
    }
    init() {
        this.initSqlLite()
        this.initVariable()
        this.initCtElement()
        this.initSliceElement()
        this.initDrElement()
        this.initToolsBtnEvent()
    }
    initVariable() {
        // !drinstance、slice 渲染变量
        this.shaderA = 'raw' //第一个参数。默认就是表面增强
        this.shaderB = 'standard' // 第二个参数。默认是标准
        this.shaderC = 'default' // 第三个参数。默认就是真彩色
        this.hasLoaded = true  // 判断图像是否加载完成的字段
        this.isFirstTimeShow = true
        this.selectTipResult = null
        this.isTipSelected = false
        this.showSusobjByUser = true // 用户选择是否显示，markBtn控制；统一视角一二的切换
        this.needRemebUserSelectRegion = false // 是否记忆用户标记的嫌疑框在视角一二切换时
        this.userSelectRegion = {
            dr: [],
            ct: []
        }
        this.userSelectRegionShow = {
            dr: null,
            ct: null
        }
        this.body = $('body')
        this.loadingLayer = $('.j-loading')
        this.curOperateName = $('.j-cur-operate')
        this.zoomIndex = $('.j-zoom')
        this.btns = $('.j-tools a')
        this.$module3DContainer = $(`#${this.options.CtContainerID}`)
        this.$module3DContainer.hide()
    }
    // 3D图像初始化
    initCtElement() {
        Module3D.Rendering.ShaderPath = './js/wgl/data/'
        Module3D.Rendering.ColorTablePath = './js/wgl/data/color_table_coded.png'
        Module3D.Rendering.NoiseTexturePath = './js/wgl/data/random_noise.png'
        Module3D.DRColorTableRootDir = './js/wgl/data/'
        Module3D.Initialize(this.options.CtContainerID, this.options.CtWidth, this.options.CtHeight)
        Module3D.Rendering.RenderingMode = true //一直刷新状态/拖拽时刷新
        Module3D.Rendering.UseCameraSlerp = true // 转向平滑过度
        Module3D.Rendering.DisableSHShade(false) // 初始化 表面增强
        Module3D.Rendering.Draw()
        Module3D.Rendering.SetBackgroundColor(255, 255, 255)
        Module3D.Rendering.CurCamera.position.set(0, 0, 1.1) // 设置摄像机的空间位置
        Module3D.Rendering.SetSlicePlaneVisible(this.options.slicePlaneVisible) // 3D平板切片显示.默认显示
        Module3D.Rendering.SetCameraZoom(this.options.sizeIndexDefault) // 摄像机初始放大比

        Module3D.Rendering.SetVolumeLoadedCallback(this.ctLoaded.bind(this)) // 图像加载完成后执行
        Module3D.Rendering.SetMouseWheelCallback(() => { // 监听"3D图像"鼠标滚轮
            let zoomValue = 16 - Module3D.Rendering.GetCameraZoomIndex()
            this.zoomIndex.text(zoomValue.toFixed(1))
        })
        Module3D.Rendering.SetManualPickingCheckingFunction(() => { // 3D 手动选择嫌疑物后的回调
            let isSelectedBox = Module3D.Rendering.IsSelectedBoxContainTipPart()
            this.setSelectTipResult(isSelectedBox[0])
        })
    }
    initSliceElement() {
        this.slinstance = new Module3D.DRImageInstance(true)
        this.slinstance.setScaleMinAndMax(0.1, 4)
        this.slinstance.showSusobj(this.options.showSusobj) //练习时不让危险品突出显示
        this.slinstance.setCallbackWhenLoaded(() => { // 加载完成的回调；切片默认为“125”
            this.renderSliceLoadedStatus()
            this.SliceZeffRenderCB && this.SliceZeffRenderCB()
        })
        this.initSliceEvent()
    }
    initSliceEvent() {
        let that = this
        this.$sliceContainer = $(`#${this.options.SliceContainerID}`)
        this.$sliceInputBar = $('#sliceinput')
        this.$densityAve = $('.j-density-ave') // 平均密度原子序数
        this.$atomAve = $('.j-atom-ave')
        this.$density = $('.j-density') // 密度与原子系数
        this.$atom = $('.j-atom')
        this.slinstance.setMMSelectCallback(data => {
            console.log(`%c 平均密度和原子序数：${data} `, 'background:#000color:#fff')
            this.$densityAve.text(data[0][0].toFixed(2))
            this.$atomAve.text(data[0][1].toFixed(2))
            this.setSelectTipResult(data[1])  // 用于判断选择嫌疑物
        })
        this.slinstance.setMouseMoveCallback(data => {
            this.$density.text(data[0].toFixed(2))
            this.$atom.text(data[1].toFixed(2))
        })
        // slice 切片位置
        if (this.$sliceInputBar.length !== 0) {
            this.$sliceInputBar.on('input', function () {
                let x = parseInt($(this).val())
                that.setSlicePiece(x)
            })
        }
    }
    initDrElement() {
        this.$drContainer = $(`#${this.options.DrContainerID}`)
        this.anglesWrap = $('.dr-angles')
        this.drinstance = new Module3D.DRImageInstance()
        this.drinstance.setScaleMinAndMax(0.1, 4) // 缩放比例最大最小值
        this.drinstance.setZoomIndex(this.options.defaultZoomIndexDr)
        this.drinstance.setCallbackWhenLoaded(() => { // DR图像加载完成后
            this.drLoaded()
        })
        this.drinstance.setMouseWheelCallback(() => { // DR缩放系数
            this.zoomIndex.text(this.drinstance.getZoomIndex().toFixed(1))
        })
        this.drinstance.showSusobj(this.options.showSusobj) //练习时不让危险品突出显示

        this.drinstance.setMMSelectCallback((data) => {
            this.setSelectTipResultOfDr(data)
        })
        this.initDrEvent()
    }
    initDrEvent() {
        let that = this
        this.drinstance.setDbClickCallback(function drDoubleClick(data) { // 双击DR
            let x = parseInt(data[0] * 255)
            that.$sliceInputBar.val(x)
            that.setSlicePiece(x)
        })
    }
    setSelectTipResult(data) { // ! CT, slice 标记嫌疑物
        // console.log(`%c CT 标记嫌疑物： ${data} `, 'background:#f90;color:#fff')
        this.isTipSelected = true
        this.selectTipResult = data
        this.selectTipResultCallback && this.selectTipResultCallback()
    }
    setSelectTipResultOfDr(data) { // ! DR 标记嫌疑物
        // console.log(`%c DR 标记嫌疑物： ${data} `, 'background:#f90;color:#fff')
        this.isTipSelected = true
        this.selectTipResult = data[0]
        this.userSelectRegion.dr[this.angleIndex] = data[1]
        this.selectTipResultCallback && this.selectTipResultCallback()
        // -不是查看模式下，没有用户标记嫌疑框的记录数据。相当于在线标记完的回调
        if (!this.userSelectRegionShow.dr) {
            this.drinstance.remove2DRectangle()
        }
    }
    setRemebUserSelectRegion (isNeedRemb) {
        this.needRemebUserSelectRegion = isNeedRemb
    }
    clearUserSelectRegion () {
        this.drinstance.clearUserSelectRegion()
        this.slinstance.clearUserSelectRegion()
        Module3D.Rendering.ClearAllBoxButRiskyObject()
        this.userSelectRegion.dr.length = 0
        this.userSelectRegion.ct.length = 0
        this.redraw3D()
    }
    setSlicePiece(piecePos) {
        let pieceValue = (piecePos / 255).toFixed(3)
        this.$sliceInputBar.css('background-size', pieceValue * 100 + '% 100%')
        this.drinstance.setSliceIndex(piecePos)
        this.activeImgInfo.isTip || this.slinstance.setSliceIndex(piecePos)
        Module3D.Rendering.SetSlicePosZ(pieceValue) // 3d切平面的函数
        this.redraw3D()
    }
    redraw3D() {
        Module3D.Rendering.ReDraw()
        setTimeout(() => {
            Module3D.Rendering.StopRendering // !需要加括号执行。但是停止渲染后，画框不会渲染出来
        }, 2000)
        // window.setTimeout('Module3D.Rendering.StopRendering', 100)
    }
    loadingStart() {
        this.hasLoaded = false
        this.drHasLoaded = false
        this.ctHasLoaded = false
        this.loadingLayer.show()
        this.$module3DContainer.hide()
        this.$sliceContainer.hide()
        this.$drContainer.hide()
        this.selectTipResult = null
        this.isTipSelected = false
        this.revertCtInitStatus()
        this.revertDrInitStatus()
    }
    revertDrInitStatus () {
        this.shaderA = 'raw'
        this.shaderB = 'standard'
        this.shaderC = 'default'
        this.isInverse = false
        this.showSusobjByUser = true
        this.hasDrImgFirstLoaded = false // 第一次加载DR图像。切换视角二的时候已为true
        this.zoomIndex.text((16 - this.options.sizeIndexDefault).toFixed(1))
        this.body.removeClass('inverse')
        this.btns.removeClass('active')
        this.$opacityInputWrap.hide()
        this.$clipInputWrap.hide()
        if (!this.options.showSusobj) {
            this.coloursBtn.addClass('active')
            this.surfaceBtn.addClass('active')
            this.curOperateName.html(`<span>${LANG_LOCAL.colours}</span>+<span>${LANG_LOCAL.surface}</span>`)
        } else {
            this.coloursBtn.addClass('active')
            this.surfaceBtn.addClass('active')
            this.marktipBtn.addClass('active')
            this.curOperateName.html(`<span>${LANG_LOCAL.colours}</span>+<span>${LANG_LOCAL.surface}</span>+<span>${LANG_LOCAL.markTip}</span>`)
        }
        this.$sliceInputBar.val(125).css('background-size', '50% 100%')
    }
    revertCtInitStatus () {
        this.alphaValue = 0.33
        this.clipPlaneValue = 0
        this.isAlphaOpen = false
    }
    renderSliceLoadedStatus () {
        this.slinstance.setInverse(this.isInverse);
        this.slinstance.setSliceIndex(125)
        this.slinstance.switchToTipImage(false)
        this.slinstance.showSusobj(this.options.showSusobj)
    }
    renderDrLoadedStatus () {
        this.setShader()
        this.drinstance.restoreOrigialPos()
        this.drinstance.setSliceLineVisible(true) // 切换线的显示状态
        this.drinstance.setInverse(this.isInverse)
        this.drinstance.setAbsorbLUT(65000, this.absorbValue)
        this.drinstance.switchToTipImage(this.activeImgInfo.isTip)
        this.drinstance.setZoomIndex(this.options.defaultZoomIndexDr)
        // this.drinstance.clearUserSelectRegion()
        this.drinstance.setSlicePosX(0.488)
        if (this.options.showSusobj) {
            this.drinstance.showSusobj(!this.activeImgInfo.isTip && this.showSusobjByUser)
        } else {
            this.drinstance.showSusobj(false)
        }
    }
    renderCtLoadedStatus () {
        Module3D.Rendering.SetBackgroundColor(255, 255, 255)
        Module3D.Rendering.CameraControls.enabled = true //启用右键
        Module3D.Rendering.SetVolumeTransferTable(Module3D.Rendering.IMG_PROC_PARA.APIP_IC_COLORIZE) //默认真彩色
        Module3D.Rendering.ToAbove() //上视角
        Module3D.Rendering.DisableSHShade(false) // 表面增强
        Module3D.Rendering.EnableEdge(false) // 边缘增强
        Module3D.Rendering.SetAlpha(this.options.defaultTransparency) // 透明度
        Module3D.Rendering.SetClipPlaneZ(0, false) // 剪裁
        Module3D.Rendering.SetCameraZoom(this.options.sizeIndexDefault) // 摄像机缩放系数
        Module3D.Rendering.ClearAllBoxButRiskyObject() // 清除除了确定包围线框的所有线框
        Module3D.Rendering.SetSlicePosZ(0.488) // 3d切平面的函数
        Module3D.Rendering.DisplaySuspectObject(this.options.showSusobj) // 突出显示嫌疑物
        this.redraw3D()
    }
    drLoaded () {
        this.drHasLoaded = true
        this.renderDrLoadedStatus()
        if (!this.activeImgInfo.isTip) {
            let index = +this.$sliceInputBar.val()
            this.drinstance.setSliceIndex(index.toFixed(2)) // 默认值和"切片"的相同:125
        }
        // -用户标记的嫌疑框回显。在图像练习、考试等记录查看时
        if (this.userSelectRegionShow.dr && !!this.userSelectRegionShow.dr[this.angleIndex]) {
            this.drinstance.add2DRectangle(...this.userSelectRegionShow.dr[this.angleIndex])
        }
        // -用户实时画框在视角一二之间切换时显示。加载之前记录标记的嫌疑框。但是一旦用户重新标记之后，就在`setSelectTipResult`中将这个框清除掉
        if (this.needRemebUserSelectRegion) {
            if (this.userSelectRegion.dr.length > 0 && !!this.userSelectRegion.dr[this.angleIndex]) {
                this.drinstance.add2DRectangle(...this.userSelectRegion.dr[this.angleIndex], '#ff0000')
            }
        }
        if (this.drHasLoaded && this.ctHasLoaded && !this.hasDrImgFirstLoaded) {
            this.allLoadedCallback()
        }
        this.hasDrImgFirstLoaded = true
    }
    ctLoaded () {
        this.ctHasLoaded = true
        this.renderCtLoadedStatus()
        if (this.drHasLoaded && this.ctHasLoaded) {
            this.allLoadedCallback()
        }
    }
    allLoadedCallback () {
        this.hasLoaded = true
        this.loadingLayer.fadeOut()
        this.$drContainer.show()
        this.$module3DContainer.show()
        !this.activeImgInfo.isTip && this.$sliceContainer.show()
        this.drloadedCallback && this.drloadedCallback()
        this.options.callback && this.options.callback() // 初始化绑定的回调函数
        this.loadedCbCountdown && this.loadedCbCountdown() // 考试、练习时绑定的回调函数，用于确定倒计时何时开始
        this.isFirstTimeShow = false
    }
    initShow(imgInfo) {
        this.activeImgInfo = imgInfo
        this.userSelectRegion.dr.length = 0
        this.userSelectRegion.ct.length = 0
        this.loadingStart()
        this.initShow3D()
        this.initShowDR()
    }
    initShow3D () {
        this.$sliceContainer.hide()
        this.sql.getData_CT(this.activeImgInfo, this.showModule3D.bind(this))
    }
    showModule3D (ctRenderData) { // params：[base63, ttxt, suspect, density]
        console.log('%c Show 3D ... ', 'background:#f90;color:#fff')
        if (ctRenderData[2] !== null) {
            Module3D.Rendering.SetVolumeDataBase64Content('ct.png', ctRenderData[0], ctRenderData[1], ctRenderData[2])
        } else {
            Module3D.Rendering.SetVolumeDataBase64Content('ct.png', ctRenderData[0], ctRenderData[1])
        }
        if (!this.activeImgInfo.isTip) { // 如果图像是 tip， 不显示 slice
            this.slinstance.loadTexture(this.options.SliceContainerID, ctRenderData[0], this.options.SliceHeight, this.options.SliceHeight)
            if (ctRenderData[3] !== null) { // 有原子序数数据
                this.SliceZeffRenderCB = () => this.slinstance.loadZeff(ctRenderData[3])
            } else {
                this.SliceZeffRenderCB = null
            }
        }
    }
    initShowDR() {
        let anglesHTML = ''
        this.activeImgInfo.dr.forEach((angle, index) => {
          let isActive = index == 0 ? 'active' : ''
          let indexName = index == 0 ? LANG_LOCAL.angleOne : LANG_LOCAL.angleTwo
          anglesHTML += `<a class="${isActive}">${indexName}</a>`
        })
        this.anglesWrap.html(anglesHTML)
        this.angleIndex = 0
        this.sql.getData_DR(this.activeImgInfo, this.showDR.bind(this))
    }
    showDR(data) {
      this.drRenderingData = data
      this.renderDR()
    }
    renderDR() {
        console.log('%c Show DR ... ', 'background:#00bcd4;color:#fff')
        !this.isFirstTimeShow && this.drinstance.remove2DRectangle()
        this.drinstance.loadTexture(this.options.DrContainerID, this.drRenderingData[this.angleIndex == 0 ? 0 : 2], this.options.DrWidth, this.options.DrHeight)
        this.drinstance.loadTextureApp(this.drRenderingData[this.angleIndex == 0 ? 1 : 3])
    }
    reset() {
        this.revertCtInitStatus()
        this.revertDrInitStatus()
        this.renderCtLoadedStatus()
        !this.activeImgInfo.isTip && this.renderSliceLoadedStatus()
        this.renderDrLoadedStatus()
        // 用户标记的嫌疑框回显
        this.drinstance.remove2DRectangle()
        if (this.userSelectRegionShow.dr && !!this.userSelectRegionShow.dr[this.angleIndex]) {
            this.drinstance.add2DRectangle(...this.userSelectRegionShow.dr[this.angleIndex])
        }
    }
    setShader() {
        console.log(`%c DR 渲染模式： ${this.shaderA} ${this.shaderB} ${this.shaderC} `, 'background:#00bcd4;color:#eee;padding: 2px;border-radius: 2px')
        this.drinstance.setShader(this.shaderA, this.shaderB, this.shaderC)
        this.drinstance.refreshDisplay()
        this.slinstance.setShader(this.shaderA, this.shaderB, this.shaderC)
        this.slinstance.refreshDisplay()
    }
    stopRender() {
        Module3D.Rendering.StopRendering()
        Module3D.Rendering.CurRenderer.forceContextLoss()
        Module3D.Rendering.CurRenderer.context = null
        Module3D.Rendering.CurRenderer.domElement = null
        Module3D.Rendering.CurRenderer = null

        this.drinstance.renderer.forceContextLoss()
        this.drinstance.renderer.context = null
        this.drinstance.renderer.domElement = null
        this.drinstance.renderer = null

        this.slinstance.renderer.forceContextLoss()
        this.slinstance.renderer.context = null
        this.slinstance.renderer.domElement = null
        this.slinstance.renderer = null
    }
    initToolsBtnEvent() {
        let that = this
        // 控制按钮操作栏 收缩/展开
        this.unfoldBtn = $('.j-unfold')
        this.toolsWrap = $('.ct-tools')
        this.unfoldBtn.click(function () {
            if (!$(this).hasClass('z-select')) {
                let width = that.toolsWrap.width()
                that.toolsWrap.data('originwidth', width).animate({ width: '46px' }, 500, function () {
                    $(this).find('.ct-btn').hide()
                })
                $(this).addClass('z-select')
            }
            else {
                $(this).removeClass('z-select')
                let oldwidth = that.toolsWrap.data('originwidth') + 48
                that.toolsWrap.find('.ct-btn').show()
                that.toolsWrap.animate({ width: oldwidth + 'px' }, 400)
            }
        })

        this.anglesWrap.on('click', 'a', function () {
          if (!$(this).hasClass('active')) {
            $(this).addClass('active').siblings().removeClass('active')
            if($(this).index() === 1) {
              that.angleIndex = 1
            } else {
              that.angleIndex = 0
            }
            that.renderDR()
          }
        })

        // 按钮组 A => 表面增强、边缘增强   @ CT 唯一
        this.groupA = $('.j-tools .ct-btn[data-group="a"]')
        this.groupA.click(function () {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
            } else {
                that.groupA.removeClass('active');
                $(this).addClass('active');
            }
            groupA();
        });
        function groupA() {
            var $activeBtn = that.groupA.filter('.active');
            var renderType = that.shaderA = $activeBtn.data('tag') || 'raw';
            switch (renderType) {
                case 'surface':
                    Module3D.Rendering.DisableSHShade(false);
                    Module3D.Rendering.EnableEdge(false);
                    break;
                case 'edge':
                    Module3D.Rendering.EnableEdge(true);
                    Module3D.Rendering.DisableSHShade(true);
                    break;
                default:
                    Module3D.Rendering.DisableSHShade(true);
                    Module3D.Rendering.EnableEdge(false);
            }
            // 考虑到 DR Slice 没有表面增强。如果选择，默认设置为 原始值;
            if (renderType === 'surface') {
                that.shaderA = 'raw';
            }
            that.redraw3D();
            that.setShader();
        }

        // 渲染参数B => 超级穿透
        this.hiBtn = $('.j-tools .hi');
        this.hiBtn.click(function () {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                Module3D.Rendering.EnablePenetrate(false);
            } else {
                $(this).addClass('active');
                Module3D.Rendering.EnablePenetrate(true);
            }
            that.shaderB = $(this).hasClass('active') ? 'superpenetrate' : 'standard';
            that.setShader();
        });

        // 按钮组 C  => 灰色、彩色、ms、os
        this.$groupC = $('.j-tools a[data-group="c"]');
        this.$groupC.click(function () {
            if (!$(this).hasClass('active')) {
                that.$groupC.removeClass('active');
                $(this).addClass('active');
            } else {
                if ($(this).hasClass('colours')) {
                    return false
                } else {
                    $(this).removeClass('active');
                    that.$groupC.filter('.colours').addClass('active');
                }
            }
            groupC();
        });
        function groupC() {
            var $activeBtn = that.$groupC.filter('.active');
            var renderType = that.shaderC = $activeBtn.data('tag');
            switch (renderType) {
                case 'blackwhite':
                    Module3D.Rendering.SetVolumeTransferTable(Module3D.Rendering.IMG_PROC_PARA.APIP_IC_BLACK_AND_WHITE);
                    break;
                case 'ms':
                    Module3D.Rendering.SetVolumeTransferTable(Module3D.Rendering.IMG_PROC_PARA.APIP_IC_MINERAL_STRIPPING);
                    break;
                case 'os':
                    Module3D.Rendering.SetVolumeTransferTable(Module3D.Rendering.IMG_PROC_PARA.APIP_IC_ORGANIC_STRIPPING);
                    break;
                default:
                    Module3D.Rendering.SetVolumeTransferTable(Module3D.Rendering.IMG_PROC_PARA.APIP_IC_COLORIZE);
            }
            that.redraw3D();
            that.setShader();
        }

        // 反色显示  @ CT DR shared
        this.inverseBtn = $('.j-tools .inverse');
        this.inverseBtn.click(function () {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                that.body.removeClass('inverse');
            } else {
                $(this).addClass('active');
                that.body.addClass('inverse');
            }
            that.isInverse = $(this).hasClass('active');
            Module3D.Rendering.SetInverseDisplay(that.isInverse);
            that.redraw3D();
            that.slinstance.setInverse(that.isInverse);
            that.drinstance.setInverse(that.isInverse);
        });

        // 视角 => 上视角、左视角、右视角。默认前视角
        this.$groupF = $('.j-tools .ct-btn[data-group="f"]');
        this.$groupF.click(function () {
            if (!$(this).hasClass('active')) {
                that.$groupF.removeClass('active');
                $(this).addClass('active');
            } else {
                $(this).removeClass('active');
            }
            let showType = that.$groupF.filter('.active').data('tag');
            switch (showType) {
                case 'top':
                    Module3D.Rendering.ToAbove();
                    break;
                case 'left':
                    Module3D.Rendering.ToLeft();
                    break;
                case 'right':
                    Module3D.Rendering.ToFront();
                    break;
                default:
                    Module3D.Rendering.ToAbove();
            }
            that.redraw3D();
            // FIXME 切换视角会将之前缩放的比例重置为初始值
            let newZoomVal = Module3D.Rendering.GetCameraZoomIndex();
            that.zoomIndex.text((16 - newZoomVal).toFixed(1));
        });

        // 透明度
        this.$opacityInputWrap = $('.ct-opacity');
        this.$clipInputWrap = $('.ct-clipping');
        this.$transparentBtn = $('.j-tools .transparency');
        this.$clipBtn = $('.j-tools .clipping');
        this.$opacityInput = $('.j-opacity');
        this.$clipInput = $('.j-clipping');
        this.$transparentBtn.click(function () {
            if (!$(this).hasClass('active')) {
                $(this).addClass('active');
                that.$clipBtn.hasClass('active') ? that.$clipBtn.removeClass('active') : null;
                that.$opacityInputWrap.css('display', 'flex');
                that.$clipInputWrap.hide();
                that.isAlphaOpen = true;
            } else {
                $(this).removeClass('active');
                that.$opacityInputWrap.hide();
                that.isAlphaOpen = false;
            }
            that.$opacityInput.val(that.alphaValue).css('background-size', `${that.alphaValue * 100}% 100%`);
        });
        this.$opacityInput.on('input', function () {
            that.alphaValue = $(this).val();
            console.log(`%c 剪裁值：${that.alphaValue} `, 'background:#0f88eb;color:#fff');
            $(this).css('background-size', `${that.alphaValue * 100}% 100%`);
            Module3D.Rendering.SetAlpha(that.alphaValue);
            Module3D.Rendering.DrawJustOnce();
        });

        // 剪裁
        this.$clipBtn.click(function () {
            if (!$(this).hasClass('active')) {
                $(this).addClass('active');
                that.$transparentBtn.hasClass('active') ? that.$transparentBtn.removeClass('active') : null;
                that.$clipInputWrap.css('display', 'flex');
                that.$opacityInputWrap.hide();
            } else {
                $(this).removeClass('active');
                that.$clipInputWrap.hide();
            }
            that.$clipInput.val(that.clipPlaneValue).css('background-size', `${that.clipPlaneValue * 100}% 100%`);
        });
        this.$clipInput.on('input', function () {
            that.clipPlaneValue = $(this).val();
            console.log(`%c 剪裁值：${that.clipPlaneValue} `, 'background:#0f88eb;color:#fff');
            let cssPercent = (+that.clipPlaneValue) * 100;
            $(this).css('background-size', `${cssPercent}% 100%`);
            Module3D.Rendering.SetClipPlaneZ(that.clipPlaneValue, false);
            Module3D.Rendering.DrawJustOnce();
        });

        // 重置
        this.resetBtn = $('.ct-btn.reset');
        this.resetBtn.click(function () {
            that.reset();
        });

        //突出显示嫌疑物CT
        this.marktipBtn = $('.mark')
        this.marktipBtn.click(function () {
            if ($(this).hasClass('disabled') || !that.options.showSusobj) {
                return
            }
            let type = $(this).hasClass('active');
            type ? $(this).removeClass('active') && (that.showSusobjByUser = false) : $(this).addClass('active') && (that.showSusobjByUser = true);
            Module3D.Rendering.DisplaySuspectObject(that.showSusobjByUser);
            that.drinstance.showSusobj(that.showSusobjByUser);
            that.slinstance.showSusobj(that.showSusobjByUser);
            that.redraw3D();
        });

        // 显示操作按钮
        this.btns.click(function () {
            showOperateName();
        });
        function showOperateName() {
            var nameText = [];
            that.btns.filter('.active').each(function (index, elem) {
                let operateName = $(elem).attr('title');
                nameText.push(`<span>${operateName}</span>`);
            });
            that.curOperateName.html(nameText.join('+'));
        }

        // 键盘监听事件
        this.bwBtn = $('.j-tools .gray')
        this.coloursBtn = $('.colours')
        this.osBtn = $('.j-tools .os')
        this.msBtn = $('.j-tools .ms')
        this.surfaceBtn = $('.j-tools .surface');
        this.isAlphaOpen = false;
        this.alphaValue = 0.33;
        this.clipPlaneValue = 0;
        this.prevBtn = $('.j-prevbtn-wrap .btn-prev')
        this.nextBtn = $('.j-nextbtn-wrap .btn-next')
        this.safeBtn = $('.j-pass')
        this.dangerBtn = $('.j-nopass')
        $(window).keydown(event => {
            let keyType = event.which;
            switch (keyType) {
                // ! 业务操作
                case 190:   // > : 箱包通过
                    this.safeBtn.click()
                    break
                case 191:   // ? 箱包危险
                    this.dangerBtn.click()
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
                case 38:    // +
                    if (that.isAlphaOpen) {//确保点开了透明度控制按钮
                        that.alphaValue = Math.min(that.alphaValue + 0.05, 1);
                        that.$opacityInput.val(that.alphaValue).css('background-size', that.alphaValue * 100 + '% 100%');
                        Module3D.Rendering.SetAlpha(that.alphaValue);
                        Module3D.Rendering.DrawJustOnce();
                    }
                    break
                case 40:    // -
                    if (that.isAlphaOpen) {//确保点开了透明度控制按钮
                        that.alphaValue = Math.max(that.alphaValue - 0.05, 0);
                        that.$opacityInput.val(that.alphaValue).css('background-size', that.alphaValue * 100 + '% 100%');
                        Module3D.Rendering.SetAlpha(that.alphaValue);
                        Module3D.Rendering.DrawJustOnce();
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
                    this.surfaceBtn.click()
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
        });
    }
    initSqlLite() {
        // this.sql = new SqlLite();
        this.sql = new DBQuery()
    }
}

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
          loadedCallback:null // 初始化定义的回调函数，用于考题制作时的loading加载
        }
        Object.assign(this.options, options)
        this.init()
    }
    init() {
        this.initVariable()
        this.initSqlLite()
        this.initDrElement()
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

        if (this.options.doubleAngleShow) {
            this.initDrElement2() // 初始化第二个dr图像实例
        }

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
        this.tipManager = new Module3D.DRTipManager()
        this.tipManager.setDr(this.drinstance)
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
        // 缩略图效果
        new MagnifyThumbmail()
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
        // console.log(this.tipManager.original_pos_1, this.tipManager.original_pos_2, this.tipManager)
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
 * !图像本地存储 方案二🥈
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
