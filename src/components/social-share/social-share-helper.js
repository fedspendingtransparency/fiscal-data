import React from 'react';

export const socialUrls = {
  facebook: `https://www.facebook.com/sharer/sharer.php?u=`,
  twitter: `https://twitter.com/intent/tweet?url=`,
  reddit: `http://www.reddit.com/submit?url=`,
  linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=`,
};

export const getSocialParams = (site, url, title, summary, source) => {
  // return (<a href={socialUrls[site] + encodeURIComponent(url)}>Test</a>)
  // socialUrls[site] + encodeURIComponent(url);
  console.log('title: ', title);
  console.log('sum: ', summary);
  console.log('sor: ', source);
  return (
    socialUrls[site] +
    encodeURIComponent(url) +
    '&title=' +
    encodeURIComponent(title) +
    '&summary=' +
    encodeURIComponent(summary) +
    '&source=' +
    encodeURIComponent(source)
    // return (
    //   socialUrls[site] + encodeURIComponent(url)
    //   // <a href={getSocialParams('linkedin', url)} target="_blank" rel="noopener noreferrer">
    //   //   test
    //   // </a>
  );
};
