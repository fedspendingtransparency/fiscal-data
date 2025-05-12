import React from 'react';
import { render, screen, configure } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Truncator from './truncate';
import { expandedStyle } from './truncate.module.scss';

configure({ testIdAttribute: 'data-test-id' });
describe('Truncate component', () => {
  const textToTruncate = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
    occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
    laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto
    beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
    odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
    Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit,
    sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat
    voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit
    laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui
    in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat
    quo voluptas nulla pariatur?`;

  /**
   * The following tests that the text provided to the component is available and seen. We can't
   * necessarily test that the text has been truncated/clamped because of the viewport available to
   * jest as well as the css stylings that may or may not be applied.
   */
  it('shows the desired blob of text within the component', () => {
    render(<Truncator>{textToTruncate}</Truncator>);
    const truncatedDiv = screen.getByTestId('truncateDiv');
    const joinTurncatedDiv = s => s.replace(/\s+/g, '').trim();
    expect(joinTurncatedDiv(truncatedDiv.textContent)).toBe(joinTurncatedDiv(textToTruncate));
  });

  it('does not create a "Show More" button on default.', () => {
    render(<Truncator>{textToTruncate}</Truncator>);

    expect(screen.queryByTestId('showMoreLessButton')).not.toBeInTheDocument();
  });

  it('creates a "Show More" button when showMore prop is true', () => {
    render(<Truncator showMore>{textToTruncate}</Truncator>);

    expect(screen.getByTestId('showMoreLessButton')).toHaveTextContent('Show More');
  });

  it('adds the "expanded" class to the truncator when the show more button is clicked', async () => {
    render(<Truncator showMore>{textToTruncate}</Truncator>);

    const button = screen.getByTestId('showMoreLessButton');
    const truncator = screen.getByTestId('truncateDiv');

    expect(truncator.className).not.toContain(expandedStyle);

    await userEvent.click(button);

    expect(truncator.className).toContain(expandedStyle);
  });
});
