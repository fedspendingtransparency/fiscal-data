import React from 'react';
import FilterGroupReset from './filterGroupReset';
import { mockFilters } from '../../mockData/mockFilters';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('filter group reset', () => {
  const groupResetMock = jest.fn();

  const filters = mockFilters;

  it('displays the count for this group', () => {
    const { getByText } = render(
      <FilterGroupReset groupId="lastUpdated" onGroupReset={groupResetMock} activeFilters={['ninetyDays', 'sevenDays']} filters={filters} />
    );
    expect(getByText('2')).toBeInTheDocument();
  });

  it('includes the icon', () => {
    const { getByRole } = render(
      <FilterGroupReset groupId="lastUpdated" onGroupReset={groupResetMock} activeFilters={['ninetyDays', 'sevenDays']} filters={filters} />
    );
    const icon = getByRole('img', { hidden: true });
    expect(icon).toBeDefined();
  });

  it('hides the button when there are no matches', () => {
    const { queryByRole } = render(<FilterGroupReset groupId="lastUpdated" activeFilters={['foo', 'bar']} />);

    expect(queryByRole('button')).toBeNull();
  });

  it('calls the group reset callback when clicked', () => {
    const { getByRole } = render(
      <FilterGroupReset groupId="lastUpdated" onGroupReset={groupResetMock} activeFilters={['ninetyDays', 'sevenDays']} filters={filters} />
    );
    const button = getByRole('button');
    userEvent.click(button);
    expect(groupResetMock).toHaveBeenCalledWith('lastUpdated');
  });
});
