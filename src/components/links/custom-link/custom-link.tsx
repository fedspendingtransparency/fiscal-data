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
};

const analyticsEventMap: Record<
  string, string
> = {
  "national-debt": "Debt",
  "national-deficit": "Deficit",
  "federal-spending": "Spedning",
  "government-revenue": "Revenue"
};

const CustomLink: FunctionComponent<CustomLinkProps> = ({
  url,
  external,
  children,
  href,
  onClick,
  "data-testid": dataTestId,
  eventNumber,
}: CustomLinkProps) => {
  const [urlOrHref, setUrlOrHref] = useState(href || url);
  const [ext, setExt] = useState(external);
  
  const thisurl = typeof window !== 'undefined' ? window.location.href : '';
  const urlSplit = thisurl.split('/');
  const pageName = urlSplit[urlSplit.length-2];
  const explainerPageName = analyticsEventMap[pageName];
  

  const {gaEvent} = useGAEventTracking(eventNumber, explainerPageName);

  const onClickEventHandler = () => {
    if (onClick) {
      return onClick();
    } else if (eventNumber) {
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

  if (
    ext ||
    (urlOrHref &&
      ["http", "tel", "mailto"].some(protocol =>
        urlOrHref.startsWith(protocol)
      ))
  ) {
    return (
      <ExternalLink
        url={urlOrHref}
        onClick={onClickEventHandler}
        dataTestId={dataTestId}
      >
        {children}
      </ExternalLink>
    );
  } else if (urlOrHref) {
    if (!urlOrHref.startsWith("#")) {
      if (urlOrHref.endsWith(".pdf")) {
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
      } else {
        return (
          <Link
            to={urlOrHref}
            className="primary"
            download={urlOrHref.endsWith(".pdf")}
            data-testid={dataTestId || "internal-link"}
            onClick={onClickEventHandler}
          >
            {children}
          </Link>
        );
      }
    } else {
      return (
        <ScrollLink
          to={urlOrHref.substr(1)}
          data-testid="scroll-link"
          className="primary"
          smooth={true}
          duration={600}
          delay={200}
        >
          {children}
        </ScrollLink>
      );
    }
  }

  return null;
};

export default CustomLink;
