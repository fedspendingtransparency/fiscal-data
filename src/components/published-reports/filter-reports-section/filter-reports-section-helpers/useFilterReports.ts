import { useState, useCallback, useEffect } from 'react';
import { format } from 'date-fns';
import { API_BASE_URL } from 'gatsby-env-variables';
import { basicFetch } from '../../../../utils/api-utils';
import { convertDate } from '../../../dataset-data/dataset-data-helper/dataset-data-helper';
import { getCache, setCache, makeKey } from './filter-reports-cache';
import { buildNestedDateOptions } from './date-options';

export const SPECIAL_LABEL = 'No CUSIP 0r Issue Date - Special Announcement';

export const useFilterReports = (dataset: any, reportConfig: any) => {
  const { datasetId, apis } = dataset;
  const { filterField, dataTableRequest, specialAnnouncement, optionValues, dateFilterType } = reportConfig;

  const [filterOptions, setFilterOptions] = useState<any[]>([{ label: '(None selected)', value: '' }]);
  const [dateOptionsNested, setDateOptionsNested] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    const seed = async () => {
      const base = [{ label: '(None selected)', value: '' }];
      if (specialAnnouncement) {
        base.push({ ...specialAnnouncement, label: SPECIAL_LABEL });
      }
      if (optionValues?.length) {
        setFilterOptions([...base, ...optionValues.map(v => ({ label: v, value: v }))]);
        return;
      }
      if (!apis?.length || !filterField) {
        setFilterOptions(base);
        return;
      }

      const { endpoint } = apis[0];
      const cacheKey = makeKey('opts', datasetId, endpoint, filterField);
      const cached = getCache<any[]>(cacheKey);
      if (cached) {
        setFilterOptions([...base, ...cached]);
        return;
      }

      try {
        const url = `${API_BASE_URL}/services/api/fiscal_service/${endpoint}?fields=${encodeURIComponent(filterField)}&sort=${encodeURIComponent(
          filterField
        )}&page[size]=10000`;
        const res = await basicFetch(url);
        const vals = Array.isArray(res?.data)
          ? Array.from(new Set(res.data.map((r: any) => String(r?.[filterField] || '').trim()).filter(Boolean)))
          : [];
        const opts = vals.map(v => ({ label: v, value: v }));
        setCache(cacheKey, opts, 86400000);
        setFilterOptions([...base, ...opts]);
      } catch {
        setFilterOptions(base);
      }
    };
    seed();
  }, [apis, datasetId, filterField, specialAnnouncement, optionValues]);

  // Fetch Nested Dates (CUSIP-First only)
  const updateAvailableDates = useCallback(
    async (selection: any, isSpecial: boolean) => {
      if (!selection?.value || !apis?.length) {
        setDateOptionsNested([]);
        return;
      }

      let isoDates: string[] = [];
      const { endpoint } = apis[0];

      try {
        if (isSpecial) {
          const url = `${API_BASE_URL}/services/dtg/publishedfiles?dataset_id=${datasetId}&path_contains=${encodeURIComponent(selection.value)}`;
          const res = await basicFetch(url);
          isoDates = Array.isArray(res) ? Array.from(new Set(res.map((r: any) => r?.report_date).filter(Boolean))) : [];
        } else if (dataTableRequest) {
          const url = `${API_BASE_URL}/services/api/fiscal_service/${endpoint}?filter=${encodeURIComponent(
            `${filterField}:eq:${selection.value}`
          )}&fields=${encodeURIComponent(dataTableRequest.dateField)}&sort=-${encodeURIComponent(dataTableRequest.dateField)}&page[size]=10000`;
          const res = await basicFetch(url);
          isoDates = Array.isArray(res?.data)
            ? Array.from(new Set(res.data.map((row: any) => row?.[dataTableRequest.dateField]).filter(Boolean)))
            : [];
        }
        setDateOptionsNested(buildNestedDateOptions(isoDates, dateFilterType === 'byDay'));
      } catch {
        setDateOptionsNested([]);
      }
    },
    [apis, datasetId, filterField, dataTableRequest, dateFilterType]
  );

  //Main Fetcher
  const getReports = useCallback(
    async (selection: any, dateObj: Date | undefined, dateStr: string, isSpecial: boolean) => {
      if (!selection?.value || (!dateObj && !dateStr)) {
        setReports([]);
        setApiError(false);
        return;
      }

      setApiError(false);
      try {
        let allReports: any[] = [];
        const activeDate = dateObj || (dateStr ? new Date(`${dateStr}T00:00:00`) : null);
        const formattedDate = activeDate ? format(activeDate, 'yyyy-MM-dd') : '';

        if (isSpecial) {
          const url = `${API_BASE_URL}/services/dtg/publishedfiles?dataset_id=${datasetId}&path_contains=${encodeURIComponent(selection.value)}`;
          const res = await basicFetch(url);
          allReports = Array.isArray(res) ? res.filter(r => r.report_date === formattedDate) : [];
        } else if (dataTableRequest && apis?.length) {
          const { endpoint } = apis[0];
          const url = `${API_BASE_URL}/services/api/fiscal_service/${endpoint}?filter=${encodeURIComponent(
            `${dataTableRequest.dateField}:eq:${formattedDate},${filterField}:eq:${selection.value}`
          )}&fields=${encodeURIComponent(dataTableRequest.fields)}`;
          const res = await basicFetch(url);
          const matchingRows = res?.data || [];

          if (matchingRows.length > 0) {
            const promises = dataTableRequest.fields
              .split(',')
              .map(field => {
                const fileName = matchingRows[0][field];
                if (fileName && fileName !== 'null') {
                  const fileUrl = `${API_BASE_URL}/services/dtg/publishedfiles?dataset_id=${datasetId}&path_contains=${encodeURIComponent(
                    '/' + fileName
                  )}`;
                  return basicFetch(fileUrl).then(files => (Array.isArray(files) ? files[0] : null));
                }
                return null;
              })
              .filter(Boolean);
            allReports = await Promise.all(promises);
          }
        } else {
          const yyyymm = formattedDate.replace(/-/g, '').slice(0, 6);
          const url = `${API_BASE_URL}/services/dtg/publishedfiles?dataset_id=${datasetId}&path_contains=${encodeURIComponent(
            `${selection.value}${yyyymm}`
          )}`;
          const res = await basicFetch(url);
          allReports = Array.isArray(res) ? res : [];
        }

        const results = allReports.filter(Boolean).map(r => ({ ...r, report_date: convertDate(r.report_date) }));
        setReports(results);
        setApiError(results.length === 0);
      } catch {
        setApiError(true);
        setReports([]);
      }
    },
    [apis, datasetId, filterField, dataTableRequest]
  );

  return { filterOptions, dateOptionsNested, reports, apiError, setApiError, updateAvailableDates, getReports };
};
