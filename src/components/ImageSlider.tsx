import { useState } from 'react';

type ImageSliderProps = {
  images: string[];
};

function ImageSlider({ images }: ImageSliderProps) {
  const [ind, setIndex] = useState(0);
  return (
    <>
      <div className="slider-container">
        <img src={images[ind]} alt="" className="slider-main-image" />
        <span className="slider-counter">
          {ind + 1} / {images.length}
        </span>
        <button
          className="slider-btn slider-btn-prev"
          onClick={() => (ind == 0 ? setIndex(images.length - 1) : setIndex(ind - 1))}
        >
          ‹
        </button>
        <button
          className="slider-btn slider-btn-next"
          onClick={() => (ind == images.length - 1 ? setIndex(0) : setIndex(ind + 1))}
        >
          ›
        </button>
      </div>
      <div className="thumbnails">
        {images.map((img, index) => (
          <img
            src={img}
            key={index}
            className={index === ind ? 'thumbnail active' : 'thumbnail'}
            onClick={() => setIndex(index)}
          />
        ))}
      </div>
    </>
  );
}

export default ImageSlider;
