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
}: CustomLinkProps) => {
  const [urlOrHref, setUrlOrHref] = useState(href || url);
  const [ext, setExt] = useState(external);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const thisurl = typeof window !== 'undefined' ? window.location.href : '';
  const urlSplit = thisurl.split('/');
  const pageName = urlSplit[urlSplit.length - 2];
  const explainerPageName = analyticsEventMap[pageName];

  const { getGAEvent } = useGAEventTracking(null, explainerPageName);

  const verifyFile = async () => {
    try {
      const response = await fetch(urlOrHref, { method: 'HEAD' });
      if (response.ok) {
        setIsVerified(true);
        window.location.href = urlOrHref; // Redirect to the URL
      } else {
        setIsVerified(false);
        setErrorMessage('File not available');
      }
    } catch (error) {
      setIsVerified(false);
      setErrorMessage('Error checking file');
    } finally {
      setIsLoading(false);
    }
  };

  const onClickEventHandler = async e => {
    e.preventDefault();
    if (onClick) {
      return onClick();
    } else if (eventNumber) {
      const gaEvent = getGAEvent(eventNumber);
      Analytics.event({
        category: gaEvent.eventCategory.replace('Fiscal Data - ', ''),
        action: gaEvent.eventAction,
        label: gaEvent.eventLabel,
      });
    }

    if (urlOrHref.endsWith('.pdf') || urlOrHref.endsWith('.xml')) {
      setIsLoading(true);
      await verifyFile();

      // Retry logic after 5 seconds if the file is not available
      if (!isVerified) {
        setTimeout(() => {
          verifyFile();
        }, 5000);
      }
    } else {
      window.location.href = urlOrHref; // For other links, just navigate to the URL
    }
  };

  useEffect(() => {
    const curPath = url || href;
    if (!curPath) return;

    if (curPath !== urlOrHref) {
      setUrlOrHref(curPath);
    }
    const externalUrl: RegExp = /^external:/;
    if (!ext && externalUrl.test(curPath)) {
      setExt(true);
      setUrlOrHref(curPath.replace(externalUrl, ''));
    }
  }, [ext, url, href]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isVerified && errorMessage) {
    return <div>{errorMessage}</div>;
  }

  switch (true) {
    case ext || ['http', 'tel'].some(protocol => urlOrHref.startsWith(protocol)):
      return (
        <ExternalLink url={urlOrHref} onClick={onClickEventHandler} dataTestId={dataTestId}>
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
        <PageScrollLink url={urlOrHref} dataTestId={dataTestId || 'scroll-link'} id={id} tabindex={tabindex}>
          {children}
        </PageScrollLink>
      );

    case urlOrHref.endsWith('.pdf'):
    case urlOrHref.endsWith('.xml'):
      return (
        <a href={urlOrHref} onClick={onClickEventHandler} className="primary" data-testid={dataTestId || 'download-link'}>
          {children}
        </a>
      );

    default:
      return (
        <Link to={urlOrHref} className="primary" data-testid={dataTestId || 'internal-link'} onClick={onClickEventHandler} id={id}>
          {children}
        </Link>
      );
  }
};

export default CustomLink;
