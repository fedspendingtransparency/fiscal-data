import React, { FunctionComponent, useEffect, useState } from "react";
import { Link } from "gatsby";
import { Link as ScrollLink } from "react-scroll";
import ExternalLink from "../external-link/external-link";
import { graphql, useStaticQuery } from "gatsby";
import { Analytics } from "../../../utils/analytics/analytics";

type CustomLinkProps = {
  url: string;
  external?: boolean;
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  "data-testid"?: string;
  eventNumber?: string;
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
  const [gaEvents, setGaEvents] = useState(null);

  const allDeficitExplainerEventTrackingCsv = useStaticQuery(
    graphql`
      query {
        allDeficitExplainerEventTrackingCsv {
          deficitExplainerEventTrackingCsv: nodes {
            Number
            Trigger
            eventAction
            eventCategory
            eventLabel
          }
        }
      }
    `
  );

  const gaEventsOnClick = (e) => {
    //e.preventDefault();
    const gaEvent = gaEvents.filter(
      gaEvent => gaEvent.Number == eventNumber
    );

    console.log(eventNumber, gaEvent);

    // Analytics.event({
    //   category: 'Fiscal Data - Explainers',
    //   action: `Citation Click`,
    //   label: 'Deficit - U.S. Deficit Compared to Revenue and Spending'
    // });
  }

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

    if (eventNumber) {
      console.log(eventNumber)
      setGaEvents(
        allDeficitExplainerEventTrackingCsv.allDeficitExplainerEventTrackingCsv
          .deficitExplainerEventTrackingCsv
      );      
    }
  }, [ext, url, href, eventNumber]);

  if (
    ext ||
    (urlOrHref &&
      ["http", "tel", "mailto"].some(protocol =>
        urlOrHref.startsWith(protocol)
      ))
  ) {
    return (
      <ExternalLink url={urlOrHref} onClick={gaEventsOnClick} dataTestId={dataTestId}>
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
            //onClick={() => (onClick ? onClick() : null)}
            onClick={gaEventsOnClick}
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
