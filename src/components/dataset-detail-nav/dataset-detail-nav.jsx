import React from 'react';
import { container, menu, mobile, activeMenu, disabledLink, desktopLinks, content } from './dataset-detail-nav.module.scss';
import { Link } from 'react-scroll';
import { updateAddressPath } from '../../helpers/address-bar/address-bar';
import globalConstants from '../../helpers/constants';

const scrollDelay = globalConstants.config.smooth_scroll.delay;
const scrollDuration = globalConstants.config.smooth_scroll.duration;

const DDNav = () => {
  const linksArr = [
    {
      title: 'Introduction',
      href: 'introduction',
    },
    {
      title: 'About This Dataset',
      href: 'about-this-dataset',
    },
    {
      title: 'Preview & Download',
      href: 'preview-and-download',
    },
    {
      title: 'API Quick Guide',
      href: 'api-quick-guide',
    },
    {
      title: 'Related Datasets',
      href: 'related-datasets',
    },
  ];

  const handleInteraction = (e, id) => {
    //only proceed on mouse click or Enter key press
    if (e?.key && e.key !== 'Enter') {
      return;
    }

    if (id) {
      updateAddressPath(id, window.location);
    }
  };

  return (
    <section id={container}>
      <div className={content}>
        <div data-testid="DDNavMenu" className={menu}>
          {linksArr.map((d, i) => {
            return (
              <Link
                className={desktopLinks}
                key={`DDNavDesktopLink${i}`}
                data-testid={`DDNavDesktopLink${i}`}
                aria-label={`Jump to ${d.title} section`}
                to={d.href}
                activeClass={activeMenu}
                smooth
                spy
                duration={scrollDuration}
                delay={scrollDelay}
                onClick={() => handleInteraction(null, d.href)}
                tabIndex={0}
                offset={-36}
              >
                {d.title}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default DDNav;
