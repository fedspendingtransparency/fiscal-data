export const socialUrls = {
  facebook: `https://www.facebook.com/sharer/sharer.php?u=`,
  twitter: `https://twitter.com/intent/tweet?url=`,
  reddit: `http://www.reddit.com/submit?url=`,
  linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=`,
  email: `mailto:`,
};

export const getLinkedInParams = (site, url, title) => {
  return socialUrls[site] + encodeURIComponent(url) + '&title=' + encodeURIComponent(title);
};

export const getFacebookParams = (site, url, title, summary, source) => {
  return (
    socialUrls[site] + encodeURIComponent(url) + '&title=' + encodeURIComponent(title)
    // '&summary=' +
    // encodeURIComponent(summary) +
    // '&source=' +
    // encodeURIComponent(source)
  );
};

export const getTwitterParams = (site, url, title, summary, source) => {
  return (
    socialUrls[site] + encodeURIComponent(url) + '&title=' + encodeURIComponent(title)
    // '&summary=' +
    // encodeURIComponent(summary) +
    // '&source=' +
    // encodeURIComponent(source)
  );
};

export const getRedditParams = (site, url, title) => {
  return socialUrls[site] + encodeURIComponent(url) + '&title=' + encodeURIComponent(title);
};

export const getEmailParams = (site, url, title, summary, source) => {
  return (
    socialUrls[site] + encodeURIComponent(url) + '&title=' + encodeURIComponent(title)
    // '&summary=' +
    // encodeURIComponent(summary) +
    // '&source=' +
    // encodeURIComponent(source)
  );
};
