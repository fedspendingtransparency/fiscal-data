import React from "react"
import {
  mainContent,
  mainTitle,
  secondaryTitle
} from './explainer-tile.module.scss';
import {
  breakpointMd,
  breakpointLg
} from '../../../../variables.module.scss';
import {pxToNumber} from "../../../../helpers/styles-helper/styles-helper";


const ExplainerTile =({content, width}) => {
  const desktopImage =
    <img
      src={content.desktopImagePath}
      alt={content.imageAltText}
      role="presentation"
      style={{width:'100%'}}
    />;

  const mobileImage =
    <img
      src={content.mobileImagePath}
      alt={content.imageAltText}
      role="presentation"
      style={{width:'100%'}}
    />;

  return (
    <>
      <div className={mainContent}>
        <div>
          {width >= pxToNumber(breakpointLg) ? desktopImage : mobileImage}
        </div>
        <h4 className={content.mainFeature ? mainTitle : secondaryTitle}>
          {content.title}
        </h4>
        <div style={{textOverflow:'ellipsis'}} >
          {content.body}
        </div>
      </div>
    </>
  )
}

export default ExplainerTile;
