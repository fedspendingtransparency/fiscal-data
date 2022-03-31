import React from 'react';
import renderer from 'react-test-renderer';
import Truncator from './truncate';
import * as styles from './truncate.module.scss';

describe('Truncate component', () => {

  // Jest gives an error about the following not being implemented even though the tests pass.
  HTMLCanvasElement.prototype.getContext = jest.fn();

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
  let component = renderer.create();
  let componentWithButtons = renderer.create();

  renderer.act(() => {
    component = renderer.create(
        <Truncator>{textToTruncate}</Truncator>
    );
    componentWithButtons = renderer.create(
      <Truncator showMore>{textToTruncate}</Truncator>
    );
  });
  const instance = component.root;
  const instanceWithButtons = componentWithButtons.root;

  /**
   * The following tests that the text provided to the component is available and seen. We can't
   * necessarily test that the text has been truncated/clamped because of the viewport available to
   * jest as well as the css stylings that may or may not be applied.
   */
  it('shows the desired blob of text within the component', () => {
    const displayText = instance.findByProps({'data-test-id': 'truncateDiv'});
    const displayTextWithButton = instanceWithButtons.findByProps({'data-test-id': 'truncateDiv'});
    expect(displayText.props.children).toStrictEqual(textToTruncate);
    expect(displayTextWithButton.props.children).toStrictEqual(textToTruncate);
  });

  it('does not create a "Show More" button on default.', () => {
    const showMoreLessButtons = instance.findAllByProps({'data-test-id': 'showMoreLessButton'});
    expect(showMoreLessButtons.length).toBe(0);
  });

  it('creates a "Show More" button when showMore prop is true', () => {
    const showMoreLessButtons = instanceWithButtons.findAllByProps({
      'data-test-id': 'showMoreLessButton'
    });
    expect(showMoreLessButtons[0].children[0]).toBe("Show More");
  });

  it('adds the "expanded" class to the truncator when the show more button is clicked', async() => {
    const showMoreLessButtons = instanceWithButtons.findAllByProps({
      'data-test-id': 'showMoreLessButton'
    });
    const truncatorElement = instanceWithButtons.findByProps({'data-test-id': 'truncateDiv'});

    expect(truncatorElement.props.className).not.toContain(styles.expanded);

    renderer.act(() => {
      showMoreLessButtons[0].props.onClick();
    });

    expect(truncatorElement.props.className).toContain(styles.expanded)

  });
});
