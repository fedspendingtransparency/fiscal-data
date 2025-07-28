import { renderHook } from '@testing-library/react-hooks';
import useShouldRefreshCachedData from './useShouldRefreshCachedData';
import { debtToThePennyData, debtToThePennyLastCachedState } from '../debtToThePennyDataState';
import { setGlobalFetchMatchingResponse } from '../../utils/mock-utils';
import { RecoilRoot, useRecoilState } from 'recoil';
import TestRenderer from 'react-test-renderer';

describe('useShouldRefreshCachedData', () => {
  const { act } = TestRenderer;
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

  test('to return a date time value', () => {
    const cacheState = renderHook(
      () => {
        const [state, setState] = useRecoilState(debtToThePennyLastCachedState);
        return {
          state,
          setState,
        };
      },
      {
        wrapper: RecoilRoot,
      }
    );

    expect(cacheState.result.current.state).toBe(0);

    act(() => cacheState.result.current.setState(10));

    expect(cacheState.result.current.state).toBe(10);

    const { result } = renderHook(() => useShouldRefreshCachedData(123, debtToThePennyData, debtToThePennyLastCachedState), {
      wrapper: RecoilRoot,
    });

    expect(result.current).toBeDefined();
  });
});
