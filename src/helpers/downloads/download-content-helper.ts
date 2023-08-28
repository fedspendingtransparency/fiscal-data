/*
This file exists to prevent having additional exports from the root page component file, since Gatsby (currently v.3)
logs warnings for "Extra" exports from page components
 */

export const downloadPageTextContent = {
  dlBeingPreparedHeader: 'Your download file is still being prepared.',
  dlReadyHeader: 'Your download file is ready!',
  dlBeingPreparedText: "Save your link so you can come back and get your file " +
    "when it's done, or keep this tab open for it to start downloading " +
    "automatically.",
  dlReadyText: 'If your file does not start downloading automatically, please ' +
    'refresh the page.',
  dlErrorHeader: "Oops! There's been a glitch, we can't find this download.",
  dlErrorText: "We're sorry, we can't seem to find this download page. This may " +
    "be due to an expired link or a typo in the URL.",
  checking: ''
};
