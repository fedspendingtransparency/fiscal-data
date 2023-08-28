import React from 'react';
import renderer from 'react-test-renderer';
import Topic, { topicIconAnalyticsEvent } from './topic';
import * as styles from './topic.module.scss';
import Analytics from '../../../../utils/analytics/analytics';

jest.useFakeTimers();
describe('Topics component', () => {
  const label = 'Debt';
  const slug = 'debt';

  let component, instance;

  const clickFn = jest.fn();
  let clickSpy;

  beforeEach(() => {
    component = renderer.create(
      <Topic
        active
        onChange={clickFn}
        label={label}
        filterKey={slug}
        slug={slug}
      />
    );
    instance = component.root;
    clickSpy = jest.spyOn(instance.props, 'onChange');
  });

  it('creates a button', () => {
    expect(instance.findByType('button')).toBeDefined();
  });

  it('shows the label for the button', () => {
    expect(instance.findByProps({'data-testid': 'topic-selector-label'}).children[0])
      .toStrictEqual(label);
  });

  it('adds the active class when button is selected', () => {
    const imageDiv = instance.findByProps({'data-testid': 'topic-selector-button'});
    expect(imageDiv.props.className).toContain(styles.active);
  });

  it('does not provide the active class when the button is not selected', () => {
    renderer.act(() => {
      component = renderer.create(
        <Topic
          active={false}
          clickHandler={clickFn}
          label={label}
          filterKey={slug}
          slug={slug}
        />
      )
    });
    jest.runAllTimers();
    instance = component.root;

    const imageDiv = instance.findByProps({'data-testid': 'topic-selector-button'});
    expect(imageDiv.props.className).not.toContain(styles.active);
  });

  it(
    'calls the onChange event with the expected parameters when the button is clicked',
    async () => {
      const button = instance.findByType('button');
      renderer.act(() => {
        button.props.onClick();
      });

      expect(clickSpy).toHaveBeenCalledWith({key: slug, value: false});
    }
  );

  it(`calls triggers a tracking event with the expected parameters when the button is clicked
    to update state to active and testing GA4 datalayer push`,
    async () => {
      window.dataLayer = window.dataLayer || [];
      const datalayerSpy = jest.spyOn(window.dataLayer, 'push');

      renderer.act(() => {
        component = renderer.create(
          <Topic
            active={false}
            onChange={clickFn}
            label={label}
            filterKey={slug}
            slug={slug}
          />
        )
      });
      jest.runAllTimers();
      instance = component.root;
      const button = instance.findByType('button');
      const trackingSpy = jest.spyOn(Analytics, 'event');
      renderer.act(() => {
        button.props.onClick();
      });
      jest.runAllTimers();

      expect(trackingSpy).toHaveBeenCalledWith({
        ...topicIconAnalyticsEvent,
        label
      });
      expect(datalayerSpy).toHaveBeenCalledWith({
        event: 'Topics Filter Click',
        eventLabel: label
      });
    });
});
