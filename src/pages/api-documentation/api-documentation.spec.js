import React from 'react';
import renderer from 'react-test-renderer';
import {useStaticQuery} from "gatsby";
import ApiDocumentationPage, {scrollOptions} from "./index";
import GettingStarted from '../../components/api-documentation/getting-started/getting-started';
import Endpoints from '../../components/api-documentation/endpoints/endpoints';
import Methods from '../../components/api-documentation/methods/methods';
import Fields from '../../components/api-documentation/fields/fields';
import Aggregation from '../../components/api-documentation/aggregation/aggregation';
import Pivoting from '../../components/api-documentation/pivoting/pivoting';
import MultiDimensionDatasets from '../../components/api-documentation/multi-dimension-datasets/multi-dimension-datasets';
import Examples from '../../components/api-documentation/examples/examples';
import * as styles from './api.module.scss';
import TOCButton from "../../components/table-of-contents/toc-button/toc-button";
import * as addressBar from "../../helpers/address-bar/address-bar";
import {animateScroll} from "react-scroll";

jest.useFakeTimers();
describe('ApiDocumentationPage', () => {
  const internalData = require('../../testData/__dataConfig_for_tests.json');
  const profilerConfigMockData = {
    allDatasets: {
      datasets: internalData.datasets
    },
    allTopics: {
      topics: internalData.topics
    }
  };
  const scrollToTopSpy = jest.spyOn(animateScroll, "scrollToTop");
  const scrollToSpy = jest.spyOn(animateScroll, "scrollTo");
  document.querySelector = jest.fn(() => {
    return {
      appendChild: jest.fn(),
      getAttribute: jest.fn(),
      getBoundingClientRect: jest.fn(() => {
        return {height: 0}
      })
    }
  });

  let component;
  let instance;

  beforeAll(() => {
    useStaticQuery.mockReturnValue(profilerConfigMockData);
    renderer.act(() => {
      component = renderer.create(<ApiDocumentationPage />)
    });

    instance = component.root;
  });

  it('defines meta elements', () => {
    const helmetProps = instance.find(e => e.props['data-test-id'] === 'helmet').props;

    expect(helmetProps.pageTitle).toBe('API Documentation');
    expect(helmetProps.description).toBeDefined();
    expect(helmetProps.keywords).toBeDefined();
  });

  it('expects Getting Started to be within its layout', () => {
    expect(instance.findByType(GettingStarted)).toBeDefined();
  });
  it('expects Endpoints to be within its layout', () => {
    expect(instance.findByType(Endpoints)).toBeDefined();
  });
  it('expects Methods to be within its layout', () => {
    expect(instance.findByType(Methods)).toBeDefined();
  });
  it('expects Fields to be within its layout', () => {
    expect(instance.findByType(Fields)).toBeDefined();
  });
  it('expects Aggregation to be within its layout', () => {
    expect(instance.findByType(Aggregation)).toBeDefined();
  });
  it('expects Pivoting to be within its layout', () => {
    expect(instance.findByType(Pivoting)).toBeDefined();
  });
  it('expects Multi-Dimension Datasets to be within its layout', () => {
    expect(instance.findByType(MultiDimensionDatasets)).toBeDefined();
  });
  it('expects Examples to be within its layout', () => {
    expect(instance.findByType(Examples)).toBeDefined();
  });

  it('expects links to exist within the toc', () => {
    const toc = instance.findByProps({'id': styles.toc});
    const links = toc.findAllByType('a');
    expect(links.length).toBeGreaterThan(0);
  });

  it('contains a TOCButton', () => {
    const tocButton = instance.findByType(TOCButton);
    expect(tocButton).toBeDefined();
  });

  it('assigns the class "tocClosed" to the content and toc elements when tocIsOpen is false', () => {
    // and it is false on page load
    const content = instance.findByProps({'id': 'content'});
    const toc = instance.findByProps({'id': 'toc'});
    expect(content.props.className).toContain('tocClosed');
    expect(toc.props.className).toContain('tocClosed');
  });

  it('assigns the class "tocOpen" to the content and toc elements when tocIsOpen is true', () => {
    // in order to make it true, need to click the button
    const tocButton = instance.findByType(TOCButton);
    const buttonElement = tocButton.findByType('button');
    renderer.act(() => buttonElement.props.onClick());
    const content = instance.findByProps({'id': 'content'});
    const toc = instance.findByProps({'id': 'toc'});
    expect(content.props.className).toContain('tocOpen');
    expect(toc.props.className).toContain('tocOpen');
    //Closing toc
    renderer.act(() => buttonElement.props.onClick());
  });

  it('Sets the proper scroll positions when toc is opened and closed ', async() =>{
    const testYOffset = 547;
    const tocButton = instance.findByType(TOCButton);
    const buttonElement = tocButton.findByType('button');
    global.window.pageYOffset = testYOffset;
    scrollToTopSpy.mockClear();
    scrollToSpy.mockClear();
    renderer.act(() => {
      global.window.dispatchEvent(new Event("scroll"))
      return undefined
    })
    renderer.act(() => buttonElement.props.onClick());
    expect(scrollToTopSpy).toHaveBeenCalledWith(scrollOptions);
    expect(scrollToSpy).not.toHaveBeenCalled();
    renderer.act(() => buttonElement.props.onClick());
    expect(scrollToSpy).toHaveBeenCalledWith(testYOffset, scrollOptions);
  });

  it('calls updateAddressPath to update the url when a toc element is clicked' , () => {
    // in order to make it true, need to click the button
    const updateAddressPathSpy = jest.spyOn(addressBar, 'updateAddressPath');
    updateAddressPathSpy.mockClear();
    const tocElement = instance.findByProps({'data-test-id': 'tocLink1'});
    renderer.act(() => tocElement.props.onClick());
    jest.runAllTimers();
    expect(updateAddressPathSpy).toHaveBeenCalledTimes(1);
  });
});
