$(function(){
  /**
   * DR 图像控制层
   */
  const State = {
    mapBrowse(options) {
      let mapBrowse = new MapPreviewDR()
      mapBrowse.init(options)
    }
  }


  function Reducer(action, state = State) {
    let { type } = action
    switch (type) {
        // 图库查看
        case 'MAP_BROWSE': {
          let img_sql = {
            count: action.count,
            page: action.page,
            limit: action.limit || 40,
            imageName: action.imageName,
            plotStatus: action.plotStatus,
            suspectId: JSON.parse(action.suspectId),
            suspectNum: action.suspectNum
          }
          state.mapBrowse({
            img_sql,
            initShowId: action.initShowId,
            url: action.url,
            isNuctech: Boolean(Number(action.isNuctech))
          })
          break
        }

        default:
          break
    }
  }

  let urlParams = getUrlParams()
  console.log(999, urlParams)
  Reducer(urlParams)

  // 将焦点移到当前的全屏界面[兼容firefox不能及时聚焦的问题]
  $(window).focus()

})
