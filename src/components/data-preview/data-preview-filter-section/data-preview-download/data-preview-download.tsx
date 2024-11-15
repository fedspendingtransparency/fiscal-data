import React, { useState } from 'react';
import DataPreviewDownloadButton from './data-preview-download-button/data-preview-download-button';

const DataPreviewDownload = ({ width }) => {
  const [active, setActive] = useState(false);

  return <DataPreviewDownloadButton active={active} setActive={setActive} width={width} />;
};

export default DataPreviewDownload;
