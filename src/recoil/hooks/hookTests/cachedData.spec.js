import { renderHook } from '@testing-library/react-hooks';
import useShouldRefreshCachedData from '../useShouldRefreshCachedData';
import { debtToThePennyData } from '../../debtToThePennyDataState';
import { debtToThePennyLastCachedState } from '../../debtToThePennyDataState';
import { setGlobalFetchMatchingResponse } from '../../../utils/mock-utils';

describe('useShouldRefreshCachedData', () => {
  beforeEach(() => {
    setGlobalFetchMatchingResponse(jest, [
      {
        matcher: url => {
          return url.includes('debt_to_penny?fields=');
        },
        jsonResponse: {
          data: [
            {
              tot_pub_debt_out_amt: '28908004857445.12',
              record_date: '2021-12-13',
            },
          ],
        },
      },
    ]);
  });

  test('should refresh data if it has been 5 minutes or longer', () => {
    const { firstResult } = renderHook(() => useShouldRefreshCachedData(Date.now(), debtToThePennyData, debtToThePennyLastCachedState));
    expect(firstResult).toEqual(0);
  });
});
