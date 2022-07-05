import React from "react"
import {
  mainContent,
  mainTitle,
  secondaryTitle
} from './explainer-tile.module.scss';


const ExplainerTile = ({tileContent}) => {
  return (
    <>
      <div className={mainContent}>
        <div>
          <img
            src={tileContent.desktopImagePath}
            loading="eager"
            placeholder="blurred"
            alt="banner graphic"
            role="presentation"
            style={{width:'100%'}}
          />
        </div>
        <h4 className={tileContent.main ? mainTitle : secondaryTitle}>
          {tileContent.title}
        </h4>
        {tileContent.body}
      </div>
    </>
  )
};

export default ExplainerTile;
