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

export const getFacebookParams = (site, url) => {
  return socialUrls[site] + encodeURIComponent(url);
};

export const getTwitterParams = (site, url, title) => {
  return socialUrls[site] + encodeURIComponent(url) + '&title=' + encodeURIComponent(title);
};

export const getRedditParams = (site, url, title) => {
  return socialUrls[site] + encodeURIComponent(url) + '&title=' + encodeURIComponent(title);
};

export const getEmailParams = (site, url, body, separator, subject) => {
  return (
    socialUrls[site] +
    encodeURIComponent(url) +
    '&body=' +
    encodeURIComponent(body) +
    '&separator=' +
    encodeURIComponent(separator) +
    '&subject=' +
    encodeURIComponent(subject)
  );
};
