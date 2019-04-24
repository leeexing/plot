import React, {
  useEffect
} from 'react'
import G2 from '@antv/g2'
import avatar from '@/assets/admin_avatar.png'

function HomeG2 () {

  let chart = null

  const data = [{
    "name": "John",
    "vote": 35654
  }, {
    "name": "Damon",
    "vote": 65456
  }, {
    "name": "Patrick",
    "vote": 45724
  }, {
    "name": "Mark",
    "vote": 13654
  }]

  let imageMap = {
    'John': 'https://zos.alipayobjects.com/rmsportal/mYhpaYHyHhjYcQf.png',
    'Damon': avatar,
    // 'Damon': 'https://zos.alipayobjects.com/rmsportal/JBxkqlzhrlkGlLW.png',
    'Patrick': 'https://zos.alipayobjects.com/rmsportal/zlkGnEMgOawcyeX.png',
    'Mark': 'https://zos.alipayobjects.com/rmsportal/KzCdIdkwsXdtWkg.png'
  }

  useEffect(() => {
    chart = new G2.Chart({
      container: 'home-dis-g2',
      forceFit: true,
      // width: 500,
      height: 350,
      padding: [60, 20, 40, 60]
    })
    chart.source(data, {
      vote: {
        min: 0
      }
    })
    chart.legend(false)
    chart.axis('vote', {
      labels: null,
      title: null,
      line: null,
      tickLine: null
    })
    chart.interval().position('name*vote').color('name', ['#7f8da9', '#fec514', '#db4c3c', '#daf0fd'])
    chart.point().position('name*vote').size(60).shape('name', function(name) {
      return ['image', imageMap[name]]
    })
    chart.render()
  }, [])


  return (
    <div id="home-dis-g2" className="m-g2"></div>
  )
}

export default HomeG2
