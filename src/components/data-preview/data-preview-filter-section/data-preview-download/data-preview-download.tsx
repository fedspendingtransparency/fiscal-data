import React, { FunctionComponent, useState } from 'react';
import DataPreviewDownloadButton from './data-preview-download-button/data-preview-download-button';

interface IDataPreviewDownload {
  width: number;
}

const DataPreviewDownload: FunctionComponent<IDataPreviewDownload> = ({ width }: IDataPreviewDownload) => {
  const [active, setActive] = useState(false);

  return <DataPreviewDownloadButton active={active} setActive={setActive} width={width} />;
};

export default DataPreviewDownload;
