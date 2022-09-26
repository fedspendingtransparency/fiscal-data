import * as queryString from 'querystring';
import { apiPrefix } from '../utils/api-utils';

export type ApiRequestUrl = {
  endpointPath: string,
  fields?: string,
  filter?: string,
  sort?: string,
  pagination?: string,
}

export default class ApiRequest  {
  endpointPath: string;
  fields?: string;
  filter?: string;
  sort?: string;
  pagination?: string;

  constructor(
    {
      endpointPath,
      fields,
      filter,
      sort = '-record_date',
      pagination = 'page[size]=1'
    }: ApiRequestUrl) {
    this.endpointPath = endpointPath;
    this.fields = fields;
    this.filter = filter;
    this.sort = sort !== undefined ? sort : '-record_date';
    this.pagination = pagination !== undefined ? pagination : 'page[size]=1';
  }

  appendToFilter = (appendage: string): void => {
    this.filter = (this.filter ? `${this.filter},` : '');
    this.filter += appendage;
  }

  getUrl = (): string => {

    const params: any = {};
    if (this.fields) {
      params.fields = this.fields;
    }
    if (this.filter) {
      params.filter = this.filter;
    }
    if (this.sort) {
      params.sort = this.sort;
    }

    let urlParameters = params !== {} ? ('?' + queryString.stringify(params)) : '';

    if (this.pagination) {
      urlParameters += urlParameters ? '&' : '?';
      urlParameters += this.pagination
    }
    return `${apiPrefix}${this.endpointPath}${urlParameters}`;
  }

  forEndOfFiscalYear = (fiscalYear: string): ApiRequest => {
    const priorYearAppend = `record_calendar_month:eq:09,record_fiscal_year:eq:${fiscalYear}`;
    this.appendToFilter(priorYearAppend);
    return this;
  }

}
