import { Carousel } from 'antd';
import Link from 'next/link';
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

const Index = () => (
  <div>
    <CarouselTemplate />
  </div>
);

export default Index;