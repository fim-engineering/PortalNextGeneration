import { Carousel } from 'antd';
import Link from 'next/link';
import { withRouter } from 'next/router';
import { useEffect } from 'react';
import '../static/css/carousel.css';

const CarouselTemplate = () => {
  return (
    <Carousel autoplay>
      <div>
        <h3>1</h3>
      </div>
      <div>
        <h3>2</h3>
      </div>
      <div>
        <h3>3</h3>
      </div>
      <div>
        <h3>4</h3>
      </div>
    </Carousel>
  )
}

function Index(props) {

  useEffect(() => {
    props.router.prefetch('/about')
    props.router.prefetch('/faq')
    props.router.prefetch('/login')
  }, [])

  return (
    <div>
      <CarouselTemplate />
    </div>
  )
}

export default withRouter(Index);