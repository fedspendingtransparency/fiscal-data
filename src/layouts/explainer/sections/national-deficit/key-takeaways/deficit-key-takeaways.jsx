import {
  icon,
  iconBackground,
  keyTakeawaysContent, noMarginBottom,
  offsetIcon
} from "../national-deficit.module.scss";
import {
  smallSampleCopy
} from "../national-deficit";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChartLine, faPercent, faPollH} from "@fortawesome/free-solid-svg-icons";
import React from "react";

const DeficitKeyTakeaways = () => (
  <>
    <div className={keyTakeawaysContent}>
      <div className={iconBackground}>
        <FontAwesomeIcon icon={faChartLine} className={icon} />
        <FontAwesomeIcon icon={faChartLine} className={offsetIcon} />
      </div>
      <p>{smallSampleCopy}</p>
    </div>
    <div className={keyTakeawaysContent}>
      <div className={iconBackground}>
        <FontAwesomeIcon icon={faPollH} className={icon} />
        <FontAwesomeIcon icon={faPollH} className={offsetIcon} />
      </div>
      <p>{smallSampleCopy}</p>
    </div>
    <div className={`${keyTakeawaysContent} ${noMarginBottom}`}>
      <div className={iconBackground}>
        <FontAwesomeIcon icon={faPercent} className={icon} />
        <FontAwesomeIcon icon={faPercent} className={offsetIcon} />
      </div>
      <p>{smallSampleCopy}</p>
    </div>
  </>
);

export default DeficitKeyTakeaways;
