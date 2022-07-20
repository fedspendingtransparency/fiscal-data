import {learnMoreLink} from "./learn-more.module.scss";
import CustomLink from "../../../../components/links/custom-link/custom-link";
import React from "react";

const LearnMoreSection = ({links, description}) => {

  return (
    <>
      <p>
        {description}
      </p>
      { links.map((link) =>
        <div className={learnMoreLink} key={link.title}>
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
