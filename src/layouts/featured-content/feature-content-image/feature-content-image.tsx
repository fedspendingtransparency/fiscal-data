import React, { useEffect, useState } from 'react';
import { image } from './feature-content-image.module.scss';
import { useWindowSize } from '../../../hooks/windowResize';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { breakpointLg } from '../../../variables.module.scss';

type FeaturedContentImageProps = {
  imageRefDesktop: string;
  imageRefMobile: string;
  altText: string;
  images: any;
};

const FeaturedContentImage = ({ imageRefDesktop, imageRefMobile, altText, images }: FeaturedContentImageProps): JSX.Element => {
  const windowSize = useWindowSize();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window.screen) {
      setIsMobile(window.innerWidth < breakpointLg);
    }
  }, [windowSize]);

  const desktopImageData = images.allFile.featuredImages.find(img => img.name === imageRefDesktop);
  const mobileImageData = images.allFile.featuredImages.find(img => img.name === imageRefMobile);

  const imageToDisplay = isMobile ? mobileImageData : desktopImageData;
  const gatsbyImage = getImage(imageToDisplay);

  return <GatsbyImage image={gatsbyImage} alt={altText} className={image} data-testid="featured-content-image" />;
};

export default FeaturedContentImage;
