import React from "react";
import {
  icon,
  iconBackground,
  keyTakeawaysContent,
  offsetIcon
} from "./key-takeaways.module.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const KeyTakeaways = ({takeaways, primaryColor, secondaryColor}) => (
  <>
    {takeaways.map((takeaway) =>
      <div className={keyTakeawaysContent} key={takeaway.text}>
        <div className={iconBackground} style={{backgroundColor:secondaryColor}}>
          <FontAwesomeIcon icon={takeaway.icon} className={icon} />
          <FontAwesomeIcon icon={takeaway.icon}
                           className={offsetIcon}
                           style={{color:primaryColor}}
          />
        </div>
        <p>{takeaway.text}</p>
      </div>
    )}
  </>
);

export default KeyTakeaways;
