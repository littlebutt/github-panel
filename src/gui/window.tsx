/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useRef, useState } from 'react'
import Carousel from './components/carousel'
import StatPanel from './stat-panel'
import SettingsPanel from './settings-panel'
import EventPanel from './event-panel'

import './window.css'

const Window: React.FC = () => {
  const [accessToken, setAccessToken] = useState<string>()
  const [badAccessToken, setBadAccessToken] = useState<boolean>(true)
  const [timespan, setTimespan] = useState<number>()
  const carouselRef = useRef(null)

  useEffect(() => {
    // @ts-ignore
    window.ConfigAPI.getTimespan().then((res) => {
      setTimespan(res)
    })

    // @ts-ignore
    window.ConfigAPI.missBaseConfig().then((res) => {
      // 1. No accessToken in the config file
      if (res === true) {
        carouselRef.current.goTo(2)
      } else {
        // @ts-ignore
        window.ConfigAPI.getAccessToken().then((res) => {
          // 2. Validate the accessToken
          // @ts-ignore
          window.GithubAPI.init(res)
          // @ts-ignore
          window.GithubAPI.validate()
            .then((vres: boolean) => {
              if (vres === true) {
                // 3. Set accessToken
                setBadAccessToken(false)
                setAccessToken(res)
              } else {
                carouselRef.current.goTo(2)
              }
            })
            .catch(() => {
              carouselRef.current.goTo(2)
            })
        })
      }
    })
  }, [])

  return (
    <div className="window">
      <Carousel ref={carouselRef}>
        <StatPanel timespan={timespan}></StatPanel>
        <EventPanel></EventPanel>
        <SettingsPanel
          accessToken={accessToken}
          setAccessToken={setAccessToken}
          badAccessToken={badAccessToken}
          timespan={timespan}
          setTimespan={setTimespan}
        ></SettingsPanel>
      </Carousel>
    </div>
  )
}

export default Window
