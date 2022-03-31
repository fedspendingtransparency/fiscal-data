import React, { FunctionComponent, useEffect, useState } from "react"
import { Link } from 'gatsby';
import {Link as ScrollLink} from 'react-scroll';
import ExternalLink from '../external-link/external-link';

type CustomLinkProps = {
  url: string,
  external?: boolean,
  children: React.ReactNode,
  href?: string,
  onClick?: () => void,
  "data-testid"?: string
}

const CustomLink: FunctionComponent<CustomLinkProps> = (
  {
    url,
    external,
    children,
    href,
    onClick,
    "data-testid": dataTestId
  }: CustomLinkProps
) => {
  const [urlOrHref, setUrlOrHref] = useState(href || url);
  const [ext, setExt] = useState(external);

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

  if (
    ext ||
    (urlOrHref && ['http', 'tel', 'mailto'].some(protocol => urlOrHref.startsWith(protocol)))
  ) {
    return (
      <ExternalLink url={urlOrHref} onClick={onClick} dataTestId={dataTestId}>
        {children}
      </ExternalLink>
    );
  } else if (urlOrHref) {
    if (!urlOrHref.startsWith('#')) {
      if (urlOrHref.endsWith('.pdf')) {
        return <a
          href={urlOrHref}
          className="primary"
          download
          data-testid={dataTestId || 'download-link'}
        >
          {children}
        </a>
      } else {
        return (
          <Link
            to={urlOrHref}
            className="primary"
            download={urlOrHref.endsWith('.pdf')}
            data-testid={dataTestId || 'internal-link'}
            onClick={() => onClick ? onClick() : null}
          >
            {children}
          </Link>
        );
      }
    } else {
      return (
        <ScrollLink to={urlOrHref.substr(1)}
              data-testid="scroll-link"
              className="primary"
              smooth={true}
              duration={600}
              delay={200}
        >
          {children}
        </ScrollLink>
      )
    }
  }

  return null;
}

export default CustomLink;
