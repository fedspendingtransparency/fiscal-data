import React from 'react';
import renderer from 'react-test-renderer';
import SelectControl from '../../../../components/select-control/select-control';
import { submit, errorIcon } from './contact-form.module.scss';
import { scroller } from 'react-scroll';
import Contact from './contact-form';
import { ReCAPTCHA } from 'react-google-recaptcha';
import { API_BASE_URL } from 'gatsby-env-variables';

jest.mock('react-scroll');
jest.useFakeTimers();

jest.mock('gatsby-plugin-mdx', () => {
  return {
    MDXRenderer: ({ children }) => {
      return <div>{children}</div>;
    },
  };
});

describe('About Us - Contact Form', () => {
  let component = renderer.create();

  renderer.act(() => {
    component = renderer.create(<Contact />);
  });
  const instance = component.root;

  document.getElementById = jest.fn(() => {
    return {
      checkValidity: function() {
        return true;
      },
    };
  });

  describe('form interaction', () => {
    const nameId = 'contactUsName';
    const emailId = 'contactUsEmail';
    const commentId = 'contactUsComment';
    const nameInput = instance.findByProps({ id: nameId });
    const emailInput = instance.findByProps({ id: emailId });
    const commentInput = instance.findByProps({ id: commentId });
    const submitButton = instance.findByProps({ className: submit });

    const testString = 'testing';

    beforeEach(() => {
      renderer.act(() => {
        emailInput.props.onChange({
          target: {
            id: emailId,
            value: testString,
            checkValidity: function() {
              return false;
            },
          },
        });
        commentInput.props.onChange({
          target: {
            id: commentId,
            value: testString,
            checkValidity: function() {
              return true;
            },
          },
        });
      });

      // Only the email string will show an error
      renderer.act(() => {
        emailInput.props.onBlur({
          target: {
            id: emailId,
            value: testString,
            checkValidity: function() {
              return true;
            },
          },
        });
        commentInput.props.onBlur({
          target: {
            id: commentId,
            value: testString,
            checkValidity: function() {
              return true;
            },
          },
        });
      });
      jest.runAllTimers();
    });

    it('selectValueChange scrollTo called and fields disabled when value has disableFields set to true', async () => {
      scroller.scrollTo.mockImplementation(() => {});
      const value = { label: 'Test Label', disableFields: true };
      const selectInstance = instance.findByType(SelectControl);

      await renderer.act(async () => {
        selectInstance.props.changeHandler(value);
      });

      expect(scroller.scrollTo).toHaveBeenCalled();
      expect(emailInput.props['disabled']).toBe('disabled');
      expect(nameInput.props['disabled']).toBe('disabled');
      expect(commentInput.props['disabled']).toBe('disabled');
    });

    it('selectValueChange scrollTo not called and fields enabled when value does not have disableFields', async () => {
      scroller.scrollTo.mockImplementation(() => {});
      const value = { label: 'Test Label' };
      const selectInstance = instance.findByType(SelectControl);

      await renderer.act(async () => {
        selectInstance.props.changeHandler(value);
      });

      expect(scroller.scrollTo).toHaveBeenCalled();
      expect(emailInput.props['disabled']).toBe('');
      expect(nameInput.props['disabled']).toBe('');
      expect(commentInput.props['disabled']).toBe('');
    });

    it('provides the error validations upon user input+blur', () => {
      expect(instance.findAllByProps({ className: errorIcon }).length).toBe(0);

      // Both inputs have errors
      renderer.act(() => {
        emailInput.props.onBlur({
          target: {
            id: emailId,
            value: testString,
            checkValidity: function() {
              return false;
            },
          },
        });
        commentInput.props.onBlur({
          target: {
            id: commentId,
            value: '',
            checkValidity: function() {
              return false;
            },
          },
        });
      });
      jest.runAllTimers();

      expect(instance.findAllByProps({ className: errorIcon }).length).toBe(2);
    });

    it('calls the environment specific API for Contact Us', async () => {
      const callArgs = {
        body: '{"subject":"Test Label","name":"param val","email":"param val","comment":"param val","token":null}',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      };
      global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [] }) }));

      await renderer.act(async () => {
        submitButton.props.onClick({ preventDefault: jest.fn() });
      });
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining(API_BASE_URL), callArgs);
    });

    it('properly processes a successful feedback response', async () => {
      global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [] }) }));

      await renderer.act(async () => {
        submitButton.props.onClick({ preventDefault: jest.fn() });
      });

      expect(instance.findByProps({ 'data-test-id': 'successfulResponse' })).toBeDefined();
    });

    it('properly processes a failed feedback response', async () => {
      global.fetch = jest.fn(() => Promise.reject({ ok: true, json: () => Promise.resolve({ data: [] }) }));

      await renderer.act(async () => {
        submitButton.props.onClick({ preventDefault: jest.fn() });
      });

      expect(instance.findByProps({ 'data-test-id': 'failedResponse' })).toBeDefined();
    });
  });
});
describe('recaptcha component', () => {
  let component = renderer.create();

  renderer.act(() => {
    component = renderer.create(<Contact />);
  });
  const instance = component.root;

  const emailId = 'contactUsEmail';
  const emailInput = instance.findByProps({ id: emailId });
  const testString = 'testing';
  const commentId = 'contactUsComment';
  const commentInput = instance.findByProps({ id: commentId });

  document.getElementById = jest.fn(() => {
    return {
      value: 'param val',
      checkValidity: function() {
        return true;
      },
    };
  });

  renderer.act(() => {
    emailInput.props.onChange({
      target: {
        id: emailId,
        value: testString,
        checkValidity: function() {
          return true;
        },
      },
    });
    commentInput.props.onChange({
      target: {
        id: commentId,
        value: testString,
        checkValidity: function() {
          return true;
        },
      },
    });
  });

  const submitButton = instance.findByProps({ className: submit });

  it('activates the submit button when the recaptcha quest is successful', () => {
    const recaptchaElement = instance.findByType(ReCAPTCHA);
    expect(submitButton.props.disabled).toBeTruthy();
    renderer.act(() => {
      recaptchaElement.props.onChange('test token');
    });
    expect(submitButton.props.disabled).toBeFalsy();
  });
  it('does not activate submit button if recaptcha quest fails', () => {
    const recaptchaElement = instance.findByType(ReCAPTCHA);
    renderer.act(() => {
      recaptchaElement.props.onChange(null);
    });
    expect(submitButton.props.disabled).toBeTruthy();
  });
  it('sends the token in the form submission post', async () => {
    const recaptchaElement = instance.findByType(ReCAPTCHA);
    let urlCalled = false;
    let bodyCalled = {};
    global.fetch = jest.fn((url, body) => {
      urlCalled = url;
      bodyCalled = body;
      return Promise.reject({ ok: true, json: () => Promise.resolve({ data: [] }) });
    });
    await renderer.act(async () => {
      recaptchaElement.props.onChange('testToken');
    });
    await renderer.act(async () => {
      submitButton.props.onClick({ preventDefault: jest.fn() });
    });
    expect(bodyCalled.body).toContain('testToken');
  });
});
