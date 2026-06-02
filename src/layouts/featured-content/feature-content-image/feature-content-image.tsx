import React, { useEffect, useState } from 'react';
import { image } from './feature-content-image.module.scss';
import { useWindowSize } from '../../../hooks/windowResize';

type FeaturedContentImageProps = {
  imageRefDesktop: string;
  imageRefMobile: string;
  altText: string;
};

const breakpointLarge = 992;

const FeaturedContentImage = ({ imageRefDesktop, imageRefMobile, altText }: FeaturedContentImageProps): JSX.Element => {
  const windowSize = useWindowSize();
  const [imageRef, setImageRef] = useState(imageRefDesktop);

  useEffect(() => {
    if (window.screen) {
      if (window.innerWidth < breakpointLarge) {
        setImageRef(imageRefMobile);
      } else {
        setImageRef(imageRefDesktop);
      }
    }
  }, [imageRefDesktop, imageRefMobile, windowSize]);

  return <img src={imageRef} alt={altText} className={image} data-testid="featured-content-image" />;
};

export default FeaturedContentImage;
