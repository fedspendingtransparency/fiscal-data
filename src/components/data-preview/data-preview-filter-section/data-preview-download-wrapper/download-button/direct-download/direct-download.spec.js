import { render } from '@testing-library/react';
import React from 'react';
import DirectDownload from './direct-download';

describe('CSV Direct Download Button', () => {
  const mockedJSONData = 'JSON String';
  const mockedXMLData = 'XML String';
  it('renders a json download link', () => {
    const { getByRole } = render(
      <DirectDownload fileType="json" filename="filename" downloadData={mockedJSONData} handleClick={jest.fn()} chidren={<>JSON</>} />
    );
    const downloadLink = getByRole('link', { hidden: true });
    expect(downloadLink).toHaveAttribute('href', 'data:text/plain;charset=utf-8,JSON%20String');
  });
  it('renders a xml download link', () => {
    const { getByRole } = render(
      <DirectDownload fileType="xml" filename="filename" downloadData={mockedXMLData} handleClick={jest.fn()} chidren={<>XML</>} />
    );
    const downloadLink = getByRole('link', { hidden: true });
    expect(downloadLink).toHaveAttribute('href', 'data:application/xml;charset=utf-8,XML%20String');
  });
});
