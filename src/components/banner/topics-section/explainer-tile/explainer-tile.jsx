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
import {GatsbyImage, getImage} from "gatsby-plugin-image";


const ExplainerTile =({content, images, width}) => {
  const desktopImage = images.find(image => image.name === content.desktopImage);
  const mobileImage = images.find(image => image.name === content.mobileImage);

  const desktop =
    <GatsbyImage
      image={getImage(desktopImage)}
      alt={content.altText}
      role="presentation"
    />;

  const mobile =
    <GatsbyImage
      image={getImage(mobileImage)}
      alt={content.altText}
      role="presentation"
    />;

  const card =
    <div className={mainContent}>
      <div>
        {width >= pxToNumber(breakpointLg) ? desktop : mobile}
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
