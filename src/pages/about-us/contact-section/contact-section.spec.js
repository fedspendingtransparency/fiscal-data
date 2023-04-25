import React from 'react';
import renderer from 'react-test-renderer';
import Contact from './contact-section';

describe('Contact Us section', () => {
  let component = renderer.create();

  renderer.act(() => {
    component = renderer.create(<Contact />)
  });
  const instance = component.root;

  document.getElementById = jest.fn(() => {
    return {
      checkValidity: function () {
        return true;
      }
    }
  });

  describe('contact section', () => {
    it('renders a SectionContent component with correct title and headingLevel for main title', () => {
      const title = instance.findByProps({ 'id': 'contact-us' }).findByType('h2');
      expect(title.children[0]).toEqual('Contact Us');
    });

    it('renders the Subscribe section', () => {
      const subsection = instance.findByProps({ 'id': 'subscribe' }).findByType('h3');
      expect(subsection.children[0]).toBeTruthy();
    });
  });
});
