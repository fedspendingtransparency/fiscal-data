import { render } from '@testing-library/react';
import React from 'react';
import DataPreviewDownloadWrapper from './data-preview-download-wrapper';
import { enableFetchMocks } from 'jest-fetch-mock';
import renderer from 'react-test-renderer';
import { RecoilRoot } from 'recoil';

jest.mock('../../../../components/truncate/truncate.jsx', function() {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(({ children }) => children),
  };
});

jest.useFakeTimers();

describe('data preview download', () => {
  enableFetchMocks();
  let createObjectURL;

  const mockSelectedTableWithUserFilter = {
    tableName: 'Table 1',
    userFilter: {
      label: 'Country-Currency',
      field: 'country_currency_desc',
    },
  };

  const mockSelectedUserFilter = {
    label: 'Atlantis-Aquabuck',
    value: 'Atlantis-Aquabuck',
  };

  const mockSelectedDetailViewFilter = {
    label: 'CUSIP',
    field: 'cusip',
    value: 'ABCD123',
  };

  beforeAll(() => {
    createObjectURL = global.URL.createObjectURL;
    global.URL.createObjectURL = jest.fn();
  });

  afterAll(() => {
    global.URL.createObjectURL = createObjectURL;
  });

  // Jest gives an error about the following not being implemented even though the tests pass.
  HTMLCanvasElement.prototype.getContext = jest.fn();

  const nonFilteredDate = 'ALL';
  let component = renderer.create();
  renderer.act(() => {
    component = renderer.create(
      <RecoilRoot>
        <DataPreviewDownloadWrapper selectedTable={{}} dataset={{ name: 'Mock dataset' }} />
      </RecoilRoot>
    );
  });
  const instance = component.root;

  // const downloadItemButtons = instance.findAllByType(DownloadItemButton);

  it('renders a placeholder', () => {
    const theComponent = instance.findByProps({ 'data-test-id': 'data-preview-download' });
    expect(theComponent).toBeDefined();
  });
});
