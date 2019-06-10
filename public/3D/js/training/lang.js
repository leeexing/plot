/**
 * 多语言
*/
var langObj = {
    'zh-CN': {
        // 通用
        operateSuccess: '操作成功',
        operateFailure: '操作失败',
        imageName: '图像名称',
        knowledge: '知识点',
        imageType: '图像类型',
        imageDesc: '图像描述',
        submit: '提交',
        reset: '还原',
        tip: '提示',
        right: '正确',
        wrong: '错误',
        sure: '确定',
        cancel: '取消',
        null: '暂无',
        index: '索引',
        time: '用时',
        overTime: '超时',
        hour: '时',
        correctNum: '正确题数',
        wrongNum: '错误题数',
        imageMap: '图像库',
        examPaperPreview: '考卷预览',
        totalTime: '学习总时长',
        theTopicTime: '该题学习时长',
        answerTime: '作答时间',
        canAnswerOnce: '该题只能作答一次',
        theTimeHasCome: '作答时间已到',
        timeEndSubmitExam: '考试时间到，请点击提交按钮完成考试',
        hasNotAnswer: '该题还未作答',
        notPassNeedMarkTip: '你目前选择不通过，还未标记嫌疑物位置',
        notPassNeedSelectKp: '你目前选择不通过，还未选择危险品知识点类型',
        modelAnswer: '标准答案',
        studentAnswer: '学员答案',
        dangerName: '危险品名称',
        dangerPos: '危险品位置标记',
        pass: '通过',
        noPass: '不过',
        safe: '安全',
        danger: '危险',
        suspect: '嫌疑',
        score: '分数',
        keyTopic: '关键题',
        keyTopicRate: '关键题正确率',
        learningOver: (num, time) => `<p>识图学习结束！</p>本次共学习${num}幅图像，用时${time}`,
        minute: '分',
        minutes: '分',
        second: '秒',
        seconds: '秒',
        prev: '上一页',
        next: '下一页',
        easy: '简',
        medium: '中',
        hard: '难',
        // 业务
        showShortcut: '显示快捷键',
        hideShortcut: '隐藏快捷键',
        hasDataAndKeepPracitce: '当前练习数据未提交，是否继续当前练习?',
        // 走图
        drTracking: 'DR走图',
        dataBeginLoading: 'DR走图数据加载中......',
        dataIsLoaded2Start: '数据加载完成，DR走图准备开始!',
        dataIsLoading: 'DR走图数据加载中......已完成',
        drTrackingEnding: 'DR走图结束~',
        pause: '暂停',
        startTrack: '走图',
        trackResultTitle: 'DR走图练习结果',
        // DR
        angleOne: '视角一',
        angleTwo: '视角二',
        entityImage: '实物图',
        singleImageModel: '默认模式',
        doubleImageModel: '双视角模式',
        blackWhite: '灰色显示',
        colours: '真彩色',
        ms: '无机物剔除',
        os: '有机物剔除',
        markTip: '突出显示嫌疑物',
        inverse: '反色显示',
        gen: '超级增强',
        absorbM: '可吸收率(-)',
        absorbP: '可吸收率(+)',
        hi: '超级穿透',
        drImgCheck: 'DR图像查看',
        drImgStudy: 'DR图像学习',
        drImgStudyDetail: 'DR图像学习记录',
        drImgPractise: 'DR图像练习',
        drImgPractiseDetail: 'DR图像练习记录',
        // CT
        edge: '边缘增强',
        surface: '表面增强',
        transparency: '透明度',
        clip: '三维图像传动带方向切裁',
        topAngle: '上视角',
        leftAngle: '左视角',
        rightAngle: '右视角',
        ctImgCheck: 'CT图像查看',
        ctImgStudy: 'CT图像学习',
        ctImgStudy: 'CT图像学习记录',
        ctImgPractise: 'CT图像练习',
        ctImgPractiseDetail: 'CT图像练习记录',
    },
    'en': {
        operateSuccess: 'operate sucess',
        operateFailure: 'operate failure',
        imageName: 'image name',
        knowledge: 'knowledge',
        imageType: 'image type',
        imageDesc: 'image description',
        submit: 'submit',
        reset: 'reset',
        tip: 'Tip',
        right: 'right',
        wrong: 'wrong',
        sure: 'OK',
        cancel: 'Cancel',
        null: 'Null',
        index: 'index',
        time: 'time',
        overTime: 'overtime',
        hour: 'hour',
        correctNum: 'correct number',
        wrongNum: 'wrong number',
        imageMap: 'image library',
        examPaperPreview: 'paper preview',
        totalTime: 'total time',
        theTopicTime: 'the topic time',
        answerTime: 'answer time',
        canAnswerOnce: 'The question can only be answered once',
        theTimeHasCome: 'Time to answer has come',
        timeEndSubmitExam: 'Please click the submit button to complete the exam',
        hasNotAnswer: 'The question has not been answered',
        notPassNeedMarkTip: `You've chosen not to pass. You haven't tagged the suspect yet`,
        notPassNeedSelectKp: `You've chosen not to pass. You haven't tagged the chosen dangerous goods knowledge yet`,
        modelAnswer: 'standard answer',
        studentAnswer: 'Student answer',
        dangerName: 'Dangerous name',
        dangerPos: 'Dangerous location marking',
        pass: 'Pass',
        noPass: 'no pass',
        safe: 'Safe',
        danger: 'Danger',
        suspect: 'Suspect',
        score: 'score',
        keyTopic: 'Key problems',
        keyTopicRate: 'Correct rate of key questions',
        learningOver: (num, time) => `<p>Image study is over!</p>You have studied ${num} images, and used ${time}`,
        minute: ' minute ',
        minutes: ' minutes ',
        second: ' second',
        seconds: ' seconds',
        prev: 'prev',
        next: 'next',
        easy: 'easy',
        medium: 'medium',
        hard: 'hard',
        // 业务
        showShortcut: 'show shortcut',
        hideShortcut: 'hide shortcut',
        hasDataAndKeepPracitce: 'The current practice data has not been submitted. Do you want to continue the current exercise?',
        // 走图
        drTracking: 'Alarm Run',
        dataBeginLoading: 'The data of alarm run is loading......',
        dataIsLoaded2Start: 'Data loading is completed, and alarm run is ready to start!',
        dataIsLoading: 'Data loading has been completed ',
        drTrackingEnding: 'The alarm run ends here ~',
        pause: 'Pause',
        startTrack: 'Run',
        trackResultTitle: 'Alarm Run practice results',
        // DR
        angleOne: 'Angle one',
        angleTwo: 'Angle two',
        entityImage: 'Physical image',
        singleImageModel: 'default',
        doubleImageModel: 'double perspective',
        blackWhite: 'BW ',
        colours: 'Color',
        ms: 'MS',
        os: 'OS',
        markTip: 'Highlight suspect',
        inverse: 'Inverse',
        gen: 'GEN',
        absorbM: 'Absorbable rate(-)',
        absorbP: 'Absorbable rate(+)',
        hi: 'HI',
        drImgCheck: 'DR image view',
        drImgStudy: 'DR image study',
        drImgStudyDetail: 'DR image learning record',
        drImgPractise: 'DR image exercise',
        drImgPractiseDetail: 'DR image exercise record',
        // CT
        edge: 'Edge',
        surface: 'Surface',
        transparency: 'Transparency',
        clip: 'Clip',
        topAngle: 'Upward angle',
        leftAngle: 'Left angle',
        rightAngle: 'Right angle',
        ctImgCheck: 'CT image view',
        ctImgStudy: 'CT image learn',
        ctImgStudy: 'CT image learn record',
        ctImgPractise: 'CT image exercise',
        ctImgPractiseDetail: 'CT image exercise record',
    }
}
var langType = localStorage.getItem('lang') || 'zh-CN'

var lang = langObj[langType]

$(() => {
    $('.j-cur-operate').html(`<span>${lang.colours}</span>`)
    $('.info-1 p').eq(0).html(`${lang.imageName}：<span class="img-name"></span>`)
    $('.info-1 p').eq(1).html(`${lang.knowledge}：<span class="img-kpoint"></span>`)
    $('.info-1 p').eq(2).html(`${lang.imageType}：<span class="goods-name"></span>`)
    $('.info-2').html(`${lang.imageDesc}：<span class="feature-desc"></span>`)
    $('.j-info-r p').eq(0).html(`${lang.totalTime}：<span class="total-time">49s</span>`)
    $('.j-info-r p').eq(1).html(`${lang.theTopicTime}：<span class="total-time">4s</span>`)
    $('.j-submit').attr('title', `${lang.submit}`)
    $('.j-layer .j-header').text(`${lang.knowledge}`)
    // DR
    $('.j-entity-wrap .entity-img').text(`${lang.entityImage}`)
    $('.j-change-model').text(`${lang.doubleImageModel}`) // -双视角模式
    $('.j-tools .bw').attr('title', `${lang.blackWhite}`)
    $('.j-tools .colours').attr('title', `${lang.colours}`)
    $('.j-tools .ms').attr('title', `${lang.ms}`)
    $('.j-tools .os').attr('title', `${lang.os}`)
    $('.j-tools .marktip').attr('title', `${lang.markTip}`)
    $('.j-tools .inverse').attr('title', `${lang.inverse}`)
    $('.j-tools .gen').attr('title', `${lang.gen}`)
    $('.j-tools .absor-minus').attr('title', `${lang.absorbM}`)
    $('.j-tools .absor-plus').attr('title', `${lang.absorbP}`)
    $('.j-tools .hi').attr('title', `${lang.hi}`)
    $('.j-tools .reset').attr('title', `${lang.reset}`)

    // CT
    $('.j-tools .surface').attr('title', `${lang.surface}`)
    $('.j-tools .edge').attr('title', `${lang.edge}`)
    $('.j-tools .transparency').attr('title', `${lang.transparency}`)
    $('.j-tools .clipping').attr('title', `${lang.clip}`)
    $('.j-tools .mark').attr('title', `${lang.markTip}`)
    $('.j-tools .topangle').attr('title', `${lang.topAngle}`)
    $('.j-tools .leftangle').attr('title', `${lang.leftAngle}`)
    $('.j-tools .rightangle').attr('title', `${lang.rightAngle}`)

    // 弹框
    $('.j-layer .j-layer-cancel').text(`${lang.cancel}`)
    $('.j-layer .j-layer-ensure, .j-info-layer-ensure').text(`${lang.sure}`)
    $('.j-info-header').text(`${lang.tip}`)
    $('.j-switch').attr('title', `${lang.showShortcut}`)
    // 走图
    $('.j-toggle-pause').text(`${lang.pause}`)
    $('.j-safe').attr('title', `${lang.safe}`)
    $('.j-danger').attr('title', `${lang.suspect}`)
    $('.j-msg-text').text(`${lang.dataBeginLoading}`)
    $('.result-title').text(`${lang.trackResultTitle}`)
})
