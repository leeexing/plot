/**
 * cookie
 *
*/

//根据指定名称获取Cookie
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return decodeURIComponent(arr[2]);
    else
        return null;
}

//删除指定Cookie
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString()+ "; path=/";
}

/**
 * 设置Cookie值
    time参数：
    s20是代表20秒,
    h是指小时，如12小时则是：h12
    d是天数，30天则：d30
 *
 * @param {any} name
 * @param {any} value
 * @param {any} time
 */
function setCookie(name, value, time) {
    if (time == undefined) {
        var Days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + "; path=/";
    }
    else {
        var strsec = getsec(time);
        var exp = new Date();
        exp.setTime(exp.getTime() + strsec * 1);
        document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + exp.toGMTString() + "; path=/";
    }
}

// 取时函数
function getsec(str) {
    var str1 = str.substring(1, str.length) * 1;
    var str2 = str.substring(0, 1);
    if (str2 == "s") {
        return str1 * 1000;
    }
    else if (str2 == "h") {
        return str1 * 60 * 60 * 1000;
    }
    else if (str2 == "d") {
        return str1 * 24 * 60 * 60 * 1000;
    }
}

/**
 * NSTS.Alert
*/
var NSTS = NSTS || {};
$(function() {
    let overLayerHtml = `
        <div class="sweet-overlay"></div>
        <div class="showSweetAlert Info">
            <div class="sa-icon1 sa-warning pulseWarning">
                <span class="sa-body pulseWarningIns"></span>
                <span class="sa-dot pulseWarningIns"></span>
            </div>
            <h2></h2>
            <div class="sa-button-container">
                <button class="cancel1">${lang.cancel}</button>
                <button class="confirm1">${lang.sure}</button>
            </div>
        </div>
        <div class="showSweetAlert failure">
            <div class="icon error animateErrorIcon">
                <span class="x-mark animateXMark">
                    <span class="line left"></span>
                    <span class="line right"></span>
                </span>
            </div>
            <h2></h2>
            <div class="sa-button-container">
                <button class="confirm2">${lang.sure}</button>
            </div>
        </div>
        <div class="showSweetAlert succeed">
            <div class="sa-icon2 sa-success animate">
                <span class="sa-line sa-tip animateSuccessTip"></span>
                <span class="sa-line sa-long animateSuccessLong"></span>
                <div class="sa-placeholder"></div>
                <div class="sa-fix"></div>
            </div>
            <h2></h2>
            <div class="sa-button-container">
                <button class="confirm3 sure success">OK</button>
            </div>
        </div>
    `
    $('body').append(overLayerHtml)

    NSTS.Plugin = {
        Alert: (function () {
            return {
                Success: function (msg,callback) {
                    msg = msg == undefined ? `${lang.operateSuccess}` : msg;
                    $(".sweet-overlay").show();
                    $(".succeed").addClass("active").show();
                    $(".succeed h2").html(msg);
                    $(".success").unbind('click');
                    $(".success").click(function () {
                        $(".sweet-overlay, .succeed").hide();
                        $(".date-items").show();
                        callback && callback();
                    });
                },
                Error: function (msg, fn) {
                    msg = msg == undefined ? `${lang.operateFailure}` : msg;
                    $(".sweet-overlay").show();
                    $(".failure").addClass("active").show();
                    $(".failure h2").html(msg);
                    $(".confirm2").unbind('click');
                    $(".confirm2").click(function () {
                        $(".sweet-overlay, .failure").hide();
                        if (fn != undefined) {
                            fn()
                        }
                    })
                },
                Confirm: function (msg,callback, callbackCancel) {
                    msg = msg == undefined ? "您确定操作吗?." : msg;
                    $(".sweet-overlay, .confirm1").show();
                    $(".Info").addClass("active").show();
                    $(".Info h2").html(msg);
                    $(".confirm1").unbind('click');
                    $(".confirm1").click(function () {
                        if (typeof callback === "function") {
                            callback(true);
                            $(".sweet-overlay, .Info, .confirm1").hide();
                        }
                    })
                    $(".cancel1").click(function () {
                        callbackCancel && callbackCancel()
                        $(".sweet-overlay, .Info").hide();
                    })
                },
            }
        })(),

        /*倒计时*/
        CountDown: (function () {
            return {
                /*
                totalMin:倒计时的分钟数
                showObj:要显示的对象 span ?
                minOrSec:分钟倒计时或秒倒计时 默认0 秒倒计时, 1:分钟倒计时
                callback:倒计时完成后的回调
                */
                Init: function (totalMinute, showObj, minOrSec, callback) {
                    var time = parseInt(totalMinute);
                    var minute, second;
                    var arr = Array.prototype.slice.call(arguments);
                    if (!arr[2]) {
                        time = time * 60;
                        type = '秒钟'
                    }
                    var count = function () {
                        time--;
                        minute = Math.floor(time / 60);
                        second = Math.floor(time % 60);
                        minute = minute < 10 ? '0' + minute : minute;
                        second = second < 10 ? '0' + second : second;
                        showObj.html(minute + '分' + second + '秒');

                        if (time < 0) {
                            showObj.html("time out");
                        }
                        setTimeout(count, 1000);
                    }
                    count();

                    //callback();
                },
            }
        })(),
        //某操作的Loading
        WaitIng: (function () {
            return {
                Start: function () {
                    $(".sweet-overlay, .load").show();
                },
                End: function () {
                    $(".sweet-overlay, .load").hide();
                }
            }
        })(),
    };
});

const TOKEN_KEY = 'source_data_ols_token'
/**
 * Ajax请求插件封装（依赖NstsLayer）
*/
!(function ($) {
    //插件默认参数
    var defaluts = {
        type:'GET',
        url: '',
        //data:
        dataType: 'json',//xml,html,script,json,jsonp,text
        timeout: 12000,//12秒过期时间
        //async: false,
        cache:false,//不启用缓存
        dataFilter: function (data, type){
            return data;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        	var message = XMLHttpRequest.statusText + "(" + XMLHttpRequest.status + "):" + XMLHttpRequest.responseText;
            console.log(message)
        },
        success: function (data, textStatus) {},
        complete: function (XMLHttpRequest, textStatus) {}
    };

    //ajax核心函数
    function AjaxCore(options) {

        defaluts.headers = {
            Authorization: "Bearer " + getCookie(TOKEN_KEY),
        }
        var ajaxOptions = $.extend(true, {}, defaluts, options);
        $.ajax(ajaxOptions);
    }

    //插件扩展方法
    $.extend({
        NstsGET: function (url, data, success, options) {
            var getOptions;
            var customOptions = {url}
            if (data != undefined || data != null) {
                customOptions.data=data;
            }
            if (success != undefined) {
                customOptions.success = success
            }
            if (options != undefined) {
                getOptions = $.extend({}, customOptions, options);
            } else {
                getOptions = customOptions;
            }
            AjaxCore(getOptions);
        },
        NstsPOST: function (url, data, success, options) {
            var postOptions;
            var customOptions = {
                type: 'POST',
                url,
                data
            }
            if (success != undefined) {
                customOptions.success = success
            }
            if (options != undefined) {
                postOptions = $.extend({}, customOptions, options);
            } else {
                postOptions = customOptions;
            }
            AjaxCore(postOptions);
        },
        NstsPUT: function (url, data, success, options) {
            var putOptions;
            var customOptions = {
                type: 'PUT',
                headers: {
                    'content-type': 'application/json'
                },
                url,
                data
            }
            if (success != undefined) {
                customOptions.success = success
            }
            if (options != undefined) {
                putOptions = $.extend({}, customOptions, options);
            } else {
                putOptions = customOptions;
            }
            AjaxCore(putOptions);
        },
        NstsDEL: function (url) {
            var deleteOptions;
            var customOptions = {
                type: 'Delete',
                url
            }
            switch (arguments.length) {
                case 1:
                    deleteOptions = customOptions;
                    break;
                case 2:
                    var arg_type = typeof (arguments[1]);
                    if (arg_type == "function") {
                        customOptions.success = arguments[1];
                    }
                    else {
                        customOptions.data = arguments[1];
                    }
                    deleteOptions = customOptions;
                    break;
                case 3:
                    //处理第二个参数(只能是data或者success)
                    var arg_type2 = typeof (arguments[1]);
                    if (arg_type2 == "function") {
                        customOptions.success = arguments[1];
                    }
                    else {
                        customOptions.data = arguments[1];
                    }
                    //处理第三个参数（只能是success或者options）
                    var arg_type3 = typeof (arguments[2]);
                    if (arg_type3 == "function") {
                        customOptions.success = arguments[2];
                        deleteOptions = customOptions;
                    }
                    else {
                        if (arg_type3 == "object")
                        {
                            deleteOptions = $.extend({}, customOptions, arguments[2]);
                        }
                    }
                    break;
                case 4:
                    customOptions.data = arguments[1];
                    customOptions.succcess = arguments[2];
                    deleteOptions = $.extend({}, customOptions, arguments[3]);
                    break;
                default:
                    throw 'Error（NET.DELETE）:非法的参数个数';
            }
            AjaxCore(deleteOptions);
        }
    });

})(window.jQuery);
