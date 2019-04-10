import React, {
  useEffect
} from 'react'
import G2 from '@antv/g2'

function HomeG2 () {

  let chart = null

  const data = [
    { genre: 'Sports', sold: 275 },
    { genre: 'Strategy', sold: 115 },
    { genre: 'Action', sold: 120 },
    { genre: 'Shooter', sold: 350 },
    { genre: 'Other', sold: 150 }
  ]

  useEffect(() => {
    chart = new G2.Chart({
      container: 'home-g2',
      width: 500,
      height: 300
    })
    chart.source(data)
    chart.interval().position('genre*sold').color('genre')
    chart.render()
  }, [])


  return (
    <div id="home-g2" className="m-g2"></div>
  )
}

export default HomeG2
