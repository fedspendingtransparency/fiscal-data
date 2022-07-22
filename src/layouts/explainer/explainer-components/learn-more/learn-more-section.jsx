import {resource} from "./learn-more-section.module.scss";
import CustomLink from "../../../../components/links/custom-link/custom-link";
import React from "react";

const LearnMoreSection = ({links, description}) => {

  return (
    <>
      <p>
        {description}
      </p>
      { links.map((link) =>
        <div className={resource} key={link.title}>
          <strong>{link.title}</strong>
          <br />
          <CustomLink url={link.url}>
            {link.url}
          </CustomLink>
        </div>
      )}
    </>
  )
};

export default LearnMoreSection;
