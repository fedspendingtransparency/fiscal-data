import metadataHelper from './metadata';

describe('Metadata helper - createObjectKeys', () => {
  it('transforms an array of data into an object with keys set to the dataset_id', () => {
    expect(metadataHelper.createObjectKeys(metadataHelper.mockSummaryAPIReturn)).toEqual(metadataHelper.mockObjectKeysReturn);
  });

  it('filters and transforms the metadata summary response to the desired datasets', () => {
    expect(metadataHelper.createObjectKeys(metadataHelper.mockSummaryAPIReturn, ['111', '222'])).toEqual(metadataHelper.mockObjectKeysReturn);
    expect(metadataHelper.createObjectKeys(metadataHelper.mockSummaryAPIReturn, '222')).toEqual(metadataHelper.mockObjectKeysReturnFiltered);
  });
});
