import React from "react"
import {
  mainContent,
  mainTitle,
  secondaryTitle
} from './explainer-tile.module.scss';
import { breakpointLg, breakpointMd } from '../../../../variables.module.scss';
import {pxToNumber} from "../../../../helpers/styles-helper/styles-helper";

import Link from "gatsby-link";
import {GatsbyImage, getImage} from "gatsby-plugin-image";


const ExplainerTile =({content, images, width}) => {
  let desktopImage, mobileImage;
  if(images) {
    desktopImage = images.allFile.topicsImages.find(image => image.name === content.desktopImage);
    mobileImage = images.allFile.topicsImages.find(image => image.name === content.mobileImage);
  }

  const desktop =
    <GatsbyImage
      image={getImage(desktopImage)}
      alt={content.altText}
      loading="eager"
      role="presentation"
    />;

  const mobile =
    <GatsbyImage
      image={getImage(mobileImage)}
      alt={content.altText}
      loading="eager"
      role="presentation"
    />;

  const card =
    <div className={mainContent} data-testid="tile">
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
        <Link to={content.path}
              data-testid={'tile-link'}
        >
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
