import React, { useState } from 'react';
import { container, menu, activeMenu, desktopLinks, content, hoverMenu, linkContainer } from './dataset-detail-nav.module.scss';
import { Link } from 'react-scroll';
import { updateAddressPath } from '../../helpers/address-bar/address-bar';
import globalConstants from '../../helpers/constants';
const scrollDelay = globalConstants.config.smooth_scroll.delay;
const scrollDuration = globalConstants.config.smooth_scroll.duration;

const DDNav = () => {
  const [hover, setHover] = useState(null);
  const linksArr = [
    {
      title: 'Introduction',
      id: 'introduction',
    },
    {
      title: 'About This Dataset',
      id: 'about-this-dataset',
    },
    {
      title: 'Preview & Download',
      id: 'preview-and-download',
    },
    {
      title: 'API Quick Guide',
      id: 'api-quick-guide',
    },
    {
      title: 'Related Datasets',
      id: 'related-datasets',
    },
  ];

  const handleInteraction = (e, id) => {
    //only proceed on mouse click or Enter key press
    if (e?.key && e.key !== 'Enter') {
      return;
    }

    if (id) {
      updateAddressPath(id, window.location);
      setHover(null);
    }
  };

  return (
    <section id={container}>
      <div className={content}>
        <div data-testid="DDNavMenu" className={menu}>
          {linksArr.map((d, i) => {
            return (
              // <div
              //   role="button"
              //   tabIndex={-1}
              //   onMouseEnter={() => setHover(d.id)}
              //   onMouseLeave={() => setHover(null)}
              //   className={`${linkContainer} ${hover === d.id ? hoverMenu : ''}`}
              // >
              <Link
                className={`${desktopLinks} ${hover === d.id ? hoverMenu : ''}`}
                key={`DDNavDesktopLink${i}`}
                data-testid={`DDNavDesktopLink${i}`}
                aria-label={`Jump to ${d.title} section`}
                to={d.id}
                activeClass={activeMenu}
                smooth
                spy
                duration={scrollDuration}
                delay={scrollDelay}
                onClick={() => handleInteraction(null, d.id)}
                tabIndex={0}
                offset={-36}
                onMouseEnter={() => setHover(d.id)}
                onMouseLeave={() => setHover(null)}
              >
                {d.title}
              </Link>
              // </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default DDNav;
