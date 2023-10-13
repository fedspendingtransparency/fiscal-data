import React from 'react';
import DatasetSectionContainer from './dataset-section-container';
import { render } from '@testing-library/react';

describe('DatasetSectionContainer', () => {
  it('renders a dataset section container that displays provided header and body elements', () => {
    const title = 'Dataset Detail Title';
    const body = 'Dataset Detail Body';

    const { getByTestId } = render(<DatasetSectionContainer title={title}>{body}</DatasetSectionContainer>);
    const section = getByTestId('sectionContainer');
    expect(section.children).toBeDefined();
    const sectionHeader = getByTestId('sectionHeader');
    expect(sectionHeader.innerHTML).toBe(title);
    const sectionBody = getByTestId('sectionBody');
    expect(sectionBody.innerHTML).toBe(body);
  });
});
