import React, { useEffect, useState } from 'react';
import { fetchAPI } from '../../../utils/api-utils';
import ApiQuickGuideSection from '../api-quick-guide-section';
import { loadingIcon, responseBlock } from './dataset-detail-examples.module.scss';
import { codeBlock, exampleTitle } from '../accordions/accordions.module.scss';
import GLOBALS from '../../../helpers/constants';
import LoadingIndicator from '../../loading-indicator/loading-indicator';

export const errorMessage = 'Our examples are temporarily unavailable. Please refresh the page to try again.';

const DatasetDetailExamples = ({ isAccordionOpen, selectedTable }) => {
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const title = 'Example Request & Response';
  const baseURL = GLOBALS.PROD_API_BASE_URL;
  const sortStr = `sort=-${selectedTable.dateField}`;
  const formatStr = 'format=json';
  const paginationStr = 'page[number]=1&page[size]=1';
  const fullRequestStr = `${baseURL}/${selectedTable.endpoint}?${sortStr}&${formatStr}&${paginationStr}`;

  let loadCanceled = false;

  const retrieveResponse = () => {
    if (!loadCanceled) {
      setIsLoading(true);
      fetchAPI(fullRequestStr)
        .then(response => {
          if (!loadCanceled) {
            if (response && response.data) {
              setIsLoading(false);
              setResponse(JSON.stringify(response, null, 1));
            } else {
              setResponse(errorMessage);
            }
          }
        })
        .catch(error => {
          if (!loadCanceled) {
            setIsLoading(false);
            setResponse(errorMessage);
            console.error('error:', error);
          }
        });
    }
  };

  const cleanup = () => {
    loadCanceled = true;
    setIsLoading(false);
  };

  // Makes the api call if the accordion is open; otherwise, resets the response so that the
  // useEffect below can make the call.
  useEffect(() => {
    setResponse('');
    if (isAccordionOpen) {
      retrieveResponse();
    }
    return cleanup;
  }, [selectedTable]);

  // Ensures that opening the accordion only calls the API if the response has not already fetched
  // from the current selectedTable state.
  useEffect(() => {
    if (isAccordionOpen && !response && !isLoading) {
      setResponse('');
      retrieveResponse();
    }
    return cleanup;
  }, [isAccordionOpen]);

  const children = (
    <>
      In this example, we are...
      <ul>
        <li>Specifying the endpoint</li>
        <li>Requesting the JSON response format</li>
        <li>
          Sorting the data by <code>{selectedTable.dateField}</code> in descending order
        </li>
        <li>Setting pagination parameters</li>
      </ul>
      <div className={exampleTitle}>EXAMPLE REQUEST</div>
      <code data-testid="exampleRequest" className={`${codeBlock} large`}>
        {fullRequestStr}
      </code>
      <div className={exampleTitle}>EXPECTED RESPONSE</div>
      <code className={`${codeBlock} ${responseBlock} large`}>
        {!!response ? <pre data-testid="exampleResponse">{response}</pre> : <LoadingIndicator loadingClass={loadingIcon} />}
      </code>
    </>
  );

  return <ApiQuickGuideSection title={title} children={children} />;
};
export default DatasetDetailExamples;
