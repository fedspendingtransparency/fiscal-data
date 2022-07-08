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
import Link from "gatsby-link";


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

  const card =
    <div className={mainContent}>
      <div>
        {width >= pxToNumber(breakpointLg) ? desktopImage : mobileImage}
      </div>
      <h5 className={content.mainFeature ? mainTitle : secondaryTitle}>
        {content.title}
      </h5>
      <div>
        {content.body}
      </div>
    </div>;

  return (
    <>
      {content.path ?
        <Link to={content.path}>
          {card}
        </Link>
       :
        <div>
          {card}
        </div>
      }
    </>
  )
}

export default ExplainerTile;
