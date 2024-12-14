import React from 'react'
import Slider from 'react-slick'

// CSS for react-slick
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

export interface CarouselProps {
  style?: React.CSSProperties
  children?: React.ReactNode
  rootClassname?: string
  id?: string
  dots?: boolean
  arrows?: boolean
  autoplay?: boolean
  draggable?: boolean
  infinite?: boolean
  speed?: number
  slidesToShow?: number
  slidesToScroll?: number
  swipe?: boolean
}

export interface CarouselRef {
  goTo: (slide: number) => void
  prev: () => void
  next: () => void
}

const Carousel = React.forwardRef<CarouselRef, CarouselProps>((props, ref) => {
  const {
    dots = true,
    arrows = false,
    autoplay = false,
    draggable = false,
    infinite = true,
    speed = 500,
    slidesToShow = 1,
    slidesToScroll = 1,
    swipe = false,
  } = props

  const slickRef = React.useRef<Slider>(undefined)
  const goTo = (slide: number) => {
    slickRef.current.slickGoTo(slide, false)
  }
  React.useImperativeHandle(
    ref,
    () => ({
      goTo,
      prev: slickRef.current.slickPrev,
      next: slickRef.current.slickNext,
    }),
    [slickRef.current],
  )
  return (
    <Slider
      ref={slickRef}
      dots={dots}
      arrows={arrows}
      autoplay={autoplay}
      draggable={draggable}
      infinite={infinite}
      speed={speed}
      slidesToShow={slidesToShow}
      slidesToScroll={slidesToScroll}
      swipe={swipe}
    >
      {props.children}
    </Slider>
  )
})

export default Carousel
