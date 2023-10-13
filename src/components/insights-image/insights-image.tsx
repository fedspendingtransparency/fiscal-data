import React, { useEffect, useState } from 'react';
import { withWindowSize } from 'react-fns';
import { image } from './insights-image.module.scss';
import { useWindowSize } from '../../hooks/windowResize';

type InsightsImageProps = {
  imageRefDesktop: string;
  imageRefMobile: string;
  altText: string;
};

const breakpointLarge = 992;

const InsightsImage = ({ imageRefDesktop, imageRefMobile, altText }: InsightsImageProps): JSX.Element => {
  const [imageRef, setImageRef] = useState('');

  useEffect(() => {
    if (window.screen) {
      if (window.innerWidth < breakpointLarge) {
        setImageRef(imageRefMobile);
      } else {
        setImageRef(imageRefDesktop);
      }
    }
  }, [useWindowSize()]);

  return <img src={imageRef} alt={altText} className={image} data-testid={'Image'} />;
};

export default withWindowSize(InsightsImage);
