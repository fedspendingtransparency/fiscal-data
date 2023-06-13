import React, { FunctionComponent, useEffect, useState } from "react";
import { Link } from "gatsby";
import { Link as ScrollLink } from "react-scroll";
import ExternalLink from "../external-link/external-link";
import Analytics from "../../../utils/analytics/analytics";
import useGAEventTracking from "../../../hooks/useGAEventTracking";

type CustomLinkProps = {
  url: string;
  external?: boolean;
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  "data-testid"?: string;
  eventNumber?: string;
  id?: string;
};

const analyticsEventMap: Record<
  string, string
> = {
  "national-debt": "DebtExplainer",
  "national-deficit": "DeficitExplainer",
  "federal-spending": "SpendingExplainer",
  "government-revenue": "RevenueExplainer",
  "americas-finance-guide": "AfgOverview"
};

const CustomLink: FunctionComponent<CustomLinkProps> = ({
  url,
  external,
  children,
  href,
  onClick,
  "data-testid": dataTestId,
  eventNumber,
  id,
}: CustomLinkProps) => {
  const [urlOrHref, setUrlOrHref] = useState(href || url);
  const [ext, setExt] = useState(external);

  const thisurl = typeof window !== 'undefined' ? window.location.href : '';
  const urlSplit = thisurl.split('/');
  const pageName = urlSplit[urlSplit.length-2];
  const explainerPageName = analyticsEventMap[pageName];


  const {getGAEvent} = useGAEventTracking(null,explainerPageName);


  const onClickEventHandler = () => {
    if (onClick) {
      return onClick();
    } else if (eventNumber) {
      const gaEvent = getGAEvent(eventNumber);
      Analytics.event({
        //Until we generalize this use of useGAEventTracking, then we have to remove the "Fiscal Data - "that is added in analytics.js as _prefix
        category: gaEvent.eventCategory.replace("Fiscal Data - ", ""),
        action: gaEvent.eventAction,
        label: gaEvent.eventLabel,
      });
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
      setUrlOrHref(curPath.replace(externalUrl, ""));
    }
  }, [ext, url, href]);


  switch (true) {
    case ext || ["http", "tel"].some(protocol =>
      urlOrHref.startsWith(protocol)
    ):
      return (
        <ExternalLink
          url={urlOrHref}
          onClick={onClickEventHandler}
          dataTestId={dataTestId}
        >
          {children}
        </ExternalLink>
      );

    case urlOrHref.startsWith("mailto") :
      return (
        <a
          href={urlOrHref}
          onClick={onClickEventHandler}
          className="primary"
          data-testid={dataTestId || "mail-to link"}
        >
          {children}
        </a>
      );

    case urlOrHref.startsWith('#') :
      return (
        <ScrollLink
          to={urlOrHref.substr(1)}
          data-testid={dataTestId || "scroll-link"}
          className="primary"
          smooth={true}
          duration={600}
          delay={200}
          id={id}
        >
          {children}
        </ScrollLink>
      );

    case urlOrHref.endsWith('.pdf') :
      return (
        <a
          href={urlOrHref}
          className="primary"
          download
          data-testid={dataTestId || "download-link"}
        >
          {children}
        </a>
      );

    default:
      return (
        <Link
          to={urlOrHref}
          className="primary"
          download={urlOrHref.endsWith(".pdf")}
          data-testid={dataTestId || "internal-link"}
          onClick={onClickEventHandler}
          id={id}
        >
          {children}
        </Link>
      );
  }
};

export default CustomLink;
