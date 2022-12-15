import React, {useEffect, useState} from "react";
import {pxToNumber} from "../../helpers/styles-helper/styles-helper";
import {breakpointLg, breakpointMd} from "../../variables.module.scss";
import {withWindowSize} from "react-fns";
import {image} from './insights-image.module.scss';

type InsightsImageProps = {
  imageRefDesktop: string,
  imageRefMobile: string,
  altText: string
}

const InsightsImage = ({imageRefDesktop, imageRefMobile, altText}: InsightsImageProps): JSX.Element => {

  const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({
      width: undefined,
      height: undefined,
    });
    useEffect(() => {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
      // Add event listener
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }, []);
    return windowSize;
  }

  const [imageRef, setImageRef] = useState('');

  useEffect(() => {
    if(window.screen) {
      if(window.screen.width < pxToNumber(breakpointLg)) {
        setImageRef(imageRefMobile);
      }
      else {
        setImageRef(imageRefDesktop);
      }
    }
  }, [useWindowSize()])

  return (
    <img src={imageRef} alt={altText} className={image} />
  )
}

export default withWindowSize(InsightsImage);
