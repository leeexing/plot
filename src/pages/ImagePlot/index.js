// import ImagePlot from './ImagePlot'
// import ImagePlotList from './ImageList'
import loadable from '@loadable/component'

const ImagePlot = loadable(() => import('./ImagePlot'))
const ImagePlotList = loadable(() => import('./ImageList'))


export {
  ImagePlot,
  ImagePlotList
}
