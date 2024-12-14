import './window.css'
import Carousel from './components/carousel'
import StatPanel from './stat-panel'

const Window: React.FC = () => {
  return (
    <div className="window">
      <Carousel>
        <StatPanel></StatPanel>
        <div>2</div>
        <div>3</div>
      </Carousel>
    </div>
  )
}

export default Window
