import React from 'react';
import { container, imageBorder } from './image-container.module.scss';

const ImageContainer = ({ children, color, caption, width = '400px' }) => {
  return (
    <div className={container}>
      <div className={imageBorder} style={{ border: `1px solid ${color}`, boxShadow: `${color} 0.25rem 0.25rem`, maxWidth: width }}>
        {children}
      </div>
      <i>{caption}</i>
    </div>
  );
};

export default ImageContainer;
