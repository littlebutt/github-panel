/* eslint-disable @typescript-eslint/ban-ts-comment */
import './window.css'
import Carousel from './components/carousel'
import StatPanel from './stat-panel'
import { useEffect, useRef, useState } from 'react'

const Window: React.FC = () => {
  const [accessToken, setAccessToken] = useState<string>()
  const [username, setUsername] = useState<string>()
  const carouselRef = useRef(null)

  useEffect(() => {
    // @ts-ignore
    window.ConfigAPI.init()
    // @ts-ignore
    window.ConfigAPI.missBaseConfig().then((res) => {
      if (res === true) {
        carouselRef.current.goTo(2)
      } else {
        // @ts-ignore
        window.ConfigAPI.getAccessToken().then((res) => {
          setAccessToken(res)
        })
        // @ts-ignore
        window.ConfigAPI.getUsername().then((res) => {
          setUsername(res)
        })
      }

    })
  }, [])

  return (
    <div className="window">
      <Carousel ref={carouselRef}>
        <StatPanel></StatPanel>
        <div>2</div>
        <div>3</div>
      </Carousel>
    </div>
  )
}

export default Window
