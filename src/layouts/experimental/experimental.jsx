import React from 'react';
import SiteLayout from '../../components/siteLayout/siteLayout';
import { fallback } from './experimental.module.scss';
import { ErrorBoundary } from 'react-error-boundary';
import { renderPDF } from '../../workers/pdfWorker';
// import pdfWorker from '../../workers/pdf.worker'
const fallbackComponent = () => {
  return <div className={fallback}>Something went wrong. Please refresh the page to try again.</div>;
};

/**
 * This page exists primarily for testing functionality that does not have a spot on the site at the time of development.
 * The content on this page should be regularly cleaned up.
 * @returns {*}
 * @constructor
 */
const ExperimentalPage = () => {
  const testfn = async () => {
    return renderPDF.renderPDFInWorker();
  };
  console.log(renderPDF.renderPDFInWorker);
  renderPDF.renderPDFInWorker();

  // useEffect(() => {
  //   try {
  //     pdfWorker.createPDF().then(res => console.log(res));
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }, []);
  // const worker = typeof window !== 'undefined' ? new PdfWorker() : {};
  // worker.postMessage({
  //   question: 'The Answer to the Ultimate Question of Life, The Universe, and Everything.',
  // });
  // worker.onmessage = ({ data: { answer } }) => {
  //   console.log(answer);
  // };

  // console.log(worker);
  return (
    <ErrorBoundary FallbackComponent={fallbackComponent}>
      <SiteLayout>
        <h2>PDF Generation POC</h2>
      </SiteLayout>
    </ErrorBoundary>
  );
};

export default ExperimentalPage;
