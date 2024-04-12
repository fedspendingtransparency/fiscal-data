import React from 'react';
import { fireEvent, render, waitFor, within } from '@testing-library/react';

import { Index } from '../index';
import * as Gatsby from 'gatsby';
import { RecoilRoot } from "recoil";

const imageQueryMock = {
  allFile: {
    topicsImages: [],
  },
  allDatasets: {
    datasets: [],
  },
  gitTag: {
    name: '2021.5.1',
  },
  gitCommit: {
    hash: '123abc',
    date: 'date of commit',
    message: 'mock commit msg',
  },
  gitBranch: {
    name: 'prod',
  },
  currentBuildDate: {
    currentDate: 'mock build date',
  },
};

beforeAll(() => {
  const useStaticQueryMock = jest.spyOn(Gatsby, 'useStaticQuery');
  useStaticQueryMock.mockImplementation(() => imageQueryMock);
});

describe('Site Home Index', () => {
  it('renders the topics section', () => {
    const { getByTestId } = render(<Index width={900} />, {wrapper: RecoilRoot});
    expect(getByTestId('topics-section')).toBeInTheDocument();
  });

  it('renders the HomeMainContent component', () => {
    const { getByTestId } = render(<Index width={900} />, {wrapper: RecoilRoot});
    expect(getByTestId('home-main-content')).toBeInTheDocument();
  });

  it('renders the HomeFeatures component', () => {
    const { getByTestId } = render(<Index width={900} />, {wrapper: RecoilRoot});
    expect(getByTestId('home-features')).toBeInTheDocument();
  });
});
