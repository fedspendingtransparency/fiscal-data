import React from "react"
import {
  mainContent,
  mainTitle,
  secondaryTitle
} from './explainer-tile.module.scss';
import {
  breakpointSm
} from '../../variables.module.scss';
import {pxToNumber} from "../../helpers/styles-helper/styles-helper";


const ExplainerTile =({content, width}) => {
  const image = width >= pxToNumber(breakpointSm) ? content.desktopImagePath : content.mobileImagePath;
  return (
    <>
      <div className={mainContent}>
        <div>
          <img
            src={image}
            // loading="eager"
            // placeholder="blurred"
            alt={content.imageAltText}
            role="presentation"
            style={{width:'100%'}}
          />
        </div>
        <h4 className={content.mainFeature ? mainTitle : secondaryTitle}>
          {content.title}
        </h4>
        {content.body}
      </div>
    </>
  )
}

export default ExplainerTile;
