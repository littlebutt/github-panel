import './window.css'
import Carousel from './components/carousel'

const Window: React.FC = () => {
  return (
      <div className='window'>
        <Carousel>
          <div>1</div>
          <div>2</div>
          <div>3</div>
        </Carousel>
      </div>
  )
}

export default Window
