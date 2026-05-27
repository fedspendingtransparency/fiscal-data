import React, { FunctionComponent, useEffect, useState } from 'react';
import { Link } from 'gatsby';
import ExternalLink from '../external-link/external-link';
import Analytics from '../../../utils/analytics/analytics';
import useGAEventTracking from '../../../hooks/useGAEventTracking';
import PageScrollLink from '../page-scroll-link/page-scroll-link';

type CustomLinkProps = {
  url: string;
  external?: boolean;
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  'data-testid'?: string;
  eventNumber?: string;
  id?: string;
  tabindex?: number;
  className?: string;
  skipExternalModal?: boolean;
  'aria-label'?: string;
};

const analyticsEventMap: Record<string, string> = {
  'national-debt': 'DebtExplainer',
  'national-deficit': 'DeficitExplainer',
  'federal-spending': 'SpendingExplainer',
  'government-revenue': 'RevenueExplainer',
  'americas-finance-guide': 'AfgOverview',
};

const CustomLink: FunctionComponent<CustomLinkProps> = ({
  url,
  external,
  children,
  href,
  onClick,
  'data-testid': dataTestId,
  eventNumber,
  id,
  tabindex,
  className,
  skipExternalModal = false,
  'aria-label': ariaLabel
}: CustomLinkProps) => {
  const [urlOrHref, setUrlOrHref] = useState(href || url);
  const [ext, setExt] = useState(external);
  const thisurl = typeof window !== 'undefined' ? window.location.href : '';
  const urlSplit = thisurl.split('/');
  const pageName = urlSplit[urlSplit.length - 2];
  const explainerPageName = analyticsEventMap[pageName];
  const PROD_ROOT = 'https://fiscaldata.treasury.gov';
  const { getGAEvent } = useGAEventTracking(null, explainerPageName);

  const onClickEventHandler = () => {
    if (onClick) {
      return onClick();
    } else if (eventNumber) {
      const gaEvent = getGAEvent(eventNumber);
      Analytics.event({
        //Until we generalize this use of useGAEventTracking, then we have to remove the "Fiscal Data - "that is added in analytics.js as _prefix
        category: gaEvent.eventCategory.replace('Fiscal Data - ', ''),
        action: gaEvent.eventAction,
        label: gaEvent.eventLabel,
      });
    }
  };

  useEffect(() => {
    let curPath = url || href;
    if (!curPath) return;

    if (curPath !== urlOrHref) {
      setUrlOrHref(curPath);
    }

    if (curPath.startsWith(PROD_ROOT)) {
      curPath = curPath.replace(PROD_ROOT, '') || '/';
    }

    const externalPrefix = /^external:/;
    if (externalPrefix.test(curPath)) {
      curPath = curPath.replace(externalPrefix, '');
      setExt(true);
    }

    if (curPath !== urlOrHref) setUrlOrHref(curPath);
  }, [ext, url, href]);

  const isAbsolute = urlOrHref.startsWith('http');
  const isSameSite = !isAbsolute || (typeof window !== 'undefined' && isAbsolute && new URL(urlOrHref).hostname === window.location.hostname);

  const treatAsExternal = (ext ?? false) || (isAbsolute && !isSameSite && ['http', 'tel'].some(p => urlOrHref.startsWith(p)));

  switch (true) {
    case treatAsExternal:
      return (
        <ExternalLink
          url={urlOrHref}
          onClick={onClickEventHandler}
          dataTestId={dataTestId}
          id={id}
          className={className}
          skipExternalModal={skipExternalModal}
          aria-label={ariaLabel}
        >
          {children}
        </ExternalLink>
      );

    case urlOrHref.startsWith('mailto'):
      return (
        <a href={urlOrHref} onClick={onClickEventHandler} className="primary" data-testid={dataTestId || 'mail-to link'}>
          {children}
        </a>
      );

    case urlOrHref.startsWith('#'):
      return (
        <PageScrollLink url={urlOrHref} dataTestId={dataTestId || 'scroll-link'} id={id} tabindex={tabindex} handleClick={onClickEventHandler}>
          {children}
        </PageScrollLink>
      );

    case urlOrHref.endsWith('.pdf'):
      return (
        <a href={urlOrHref} className="primary" download data-testid={dataTestId || 'download-link'} onClick={onClickEventHandler}>
          {children}
        </a>
      );

    case urlOrHref.endsWith('.xml') || urlOrHref.endsWith('.xlsx'):
      return (
        <a href={urlOrHref} className="primary" download data-testid={dataTestId || 'download-link'} onClick={onClickEventHandler}>
          {children}
        </a>
      );

    default:
      return (
        <Link
          to={urlOrHref}
          className="primary"
          download={urlOrHref.endsWith('.pdf')}
          data-testid={dataTestId || 'internal-link'}
          onClick={onClickEventHandler}
          id={id}
          aria-label={ariaLabel}
        >
          {children}
        </Link>
      );
  }
};

export default CustomLink;
