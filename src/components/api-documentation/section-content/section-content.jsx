import React, {useEffect, useState} from 'react';
import * as styles from './section-content.module.scss';

const SectionContent = ({id, children, className, headingLevel, title}) => {

  const [header, setHeader] = useState(null);
  const scHeadingLevel = headingLevel ? parseInt(headingLevel, 10) : 2;

  const createHeader = () => {
    switch (scHeadingLevel) {
      case 2 :
        return <h2>{title}</h2>;
      case 3 :
        return <h3>{title}</h3>;
      case 4 :
        return <h4>{title}</h4>;
      case 5 :
        return <h5>{title}</h5>;
      case 6 :
        return <h6>{title}</h6>;
      default :
        return <h2>{title}</h2>;
    }
  }

  useEffect(() => {
    setHeader(createHeader());
  }, []);

  return (
    <section id={id} className={`${styles.sectionContainer} ${className || ''}`}>
      {header}
      {children}
    </section>
  )
}
export default SectionContent;
