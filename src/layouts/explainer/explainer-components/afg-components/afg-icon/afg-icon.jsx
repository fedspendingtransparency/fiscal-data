import React, {useState, useEffect} from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
    icon,
    iconBackground,
    offsetIcon
} from "./afg-icon.module.scss";

// TODO: Move this out of AFG folder and use in key takeaways

export default function AfgIcon({
    faIcon,
    iconColor,
    backgroundColor = null,
    altText

}) {
    const [circleColor, setCircleColor] = useState('');
    useEffect(() => {
        setCircleColor( backgroundColor ? backgroundColor : iconColor + '10')
    }, [])

    return (
        <div
          aria-label={altText}
          role={'img'}
          data-testid={'afg-icon'}
          className={iconBackground}
          style={{ backgroundColor: circleColor }}
        >
            <FontAwesomeIcon icon={faIcon} className={icon} />
            <FontAwesomeIcon icon={faIcon}
                className={offsetIcon}
                style={{ color: iconColor }}
            />
        </div>
    )
}
