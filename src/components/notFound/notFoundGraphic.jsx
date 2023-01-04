import React, { useState, useEffect } from 'react';
import { pxToNumber } from '../../helpers/styles-helper/styles-helper';
import { breakpointLg } from '../../variables.module.scss';
import * as styles from './notFound.module.scss';

const NotFoundGraphic = () => {
    const png = '/not-found/404gif2.png';
    const gif = '/not-found/404gif.gif';

    const [src, setSrc] = useState(png);

    useEffect(() => {
        const handleResize = () => {
            setSrc(window.innerWidth >= pxToNumber(breakpointLg) ? gif : png);
        }

        handleResize();

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    return (
        <img
            className={styles.notFoundGraphic}
            src={src}
            alt='404: Page Not Found'
            role='presentation'
        />
    );
};

export default NotFoundGraphic;
