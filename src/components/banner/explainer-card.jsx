import React from "react"
import {mainContent} from './explainer-card.module.scss';


const ExplainerCard = ({title, body, imagePath, main}) => {

  return (
    <>
      <div className={mainContent}>
        <img
          src={imagePath}
          loading="eager"
          placeholder="blurred"
          alt="banner graphic"
          role="presentation"
          style={main ? {maxWidth:'750px'} : undefined}
        />
        <h4>
          {title}
        </h4>
        {body}
      </div>
    </>
  )
};

export default ExplainerCard;
