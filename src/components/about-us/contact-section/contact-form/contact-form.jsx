/* istanbul ignore file */
// Feature is experimental and is not currently used on the site
import React, { useState } from 'react';
import { scroller } from 'react-scroll';
import { API_BASE_URL } from 'gatsby-env-variables';
import {
  comment,
  commentBoxSpacing,
  contactUsForm,
  error,
  errorIcon,
  errorMsg,
  formElement,
  label,
  loading,
  recaptcha,
  required,
  responseBody,
  responseIcon,
  responseMessage,
  responseTitle,
  submit,
  success,
  textInput,
} from './contact-form.module.scss';
import SelectControl from '../../../select-control/select-control';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { postAPI } from '../../../../utils/api-utils';
import CircularProgress from '@mui/material/CircularProgress';
import ReCAPTCHA from 'react-google-recaptcha';

import GLOBALS from '../../../../helpers/constants';

const smoothScrollConfig = GLOBALS.config.smooth_scroll;

const ContactForm = ({ onUnsupportedSubject = () => {} }) => {
  const dropdownOptions = [
    {
      label: 'Datasets/Reports',
    },
    {
      label: 'Media Inquiries',
    },
    {
      label: 'Provide Feedback',
    },
    {
      label: 'Technical Issues',
    },
    {
      label: 'My Stimulus Payment / Tax Return',
      disableFields: true,
    },
    {
      label: 'Other',
    },
  ];

  const initialOption = { label: 'Select Option' };

  const [subjectType, setSubjectType] = useState(initialOption);
  const [isValid, setIsValid] = useState(false);
  const [isEmailDirty, setIsEmailDirty] = useState(false);
  const [isCommentDirty, setIsCommentDirty] = useState(false);
  const [disabled, setIsDisabled] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMsg, setEmailErrorMsg] = useState('');
  const [commentError, setCommentError] = useState(false);
  const [showResponseMessage, setShowResponseMessage] = useState(false);
  const [isResponseSuccessful, setIsResponseSuccessful] = useState(false);
  const [isCallingAPI, setIsCallingAPI] = useState(false);
  const [isLongResponse, setIsLongResponse] = useState(false);
  const [recaptchaValue, setRecaptchaValue] = useState(null);

  const recaptchaRef = React.useRef(null);
  let timeOutIdx;
  const submitFeedback = async e => {
    e.preventDefault();
    timeOutIdx = setTimeout(function() {
      setIsLongResponse(true);
    }, 1000);

    setIsCallingAPI(true);

    const subject = subjectType.label === initialOption.label ? '' : subjectType.label;
    const name = document.getElementById('contactUsName').value;
    const email = document.getElementById('contactUsEmail').value;
    const comment = document.getElementById('contactUsComment').value;

    const params = {
      subject: subject,
      name: name,
      email: email,
      comment: comment,
      token: recaptchaValue,
    };

    const JSONedParams = JSON.stringify(params);

    const url = `${API_BASE_URL}/services/api/v2/fiscal-data-contact-us/`;

    await postAPI(url, {
      method: 'POST',
      body: JSONedParams,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(() => {
        setIsResponseSuccessful(true);
        clearForm();
        afterAPICall();
      })
      .catch(() => {
        setIsResponseSuccessful(false);
        afterAPICall();
      });

    recaptchaRef.current.reset();
  };

  const afterAPICall = () => {
    setIsCallingAPI(false);
    setShowResponseMessage(true);
    clearTimeout(timeOutIdx);
    setIsLongResponse(false);
  };

  const clearForm = () => {
    const name = document.getElementById('contactUsName');
    const email = document.getElementById('contactUsEmail');
    const comment = document.getElementById('contactUsComment');
    setSubjectType(initialOption);
    name.value = '';
    email.value = '';
    comment.value = '';

    setIsValid(false);
  };

  const setIsDirty = e => {
    const curEl = e.target;
    const id = curEl.id;
    if (id.toLowerCase().indexOf('email') !== -1) {
      setIsEmailDirty(true);
    } else {
      setIsCommentDirty(true);
    }
    checkValidity();
  };

  const subjectValueChange = value => {
    setSubjectType(value);
    const shouldBeDisabled = !(value['disableFields'] === undefined || value['disableFields'] === false);
    setIsDisabled(shouldBeDisabled);
    if (shouldBeDisabled) {
      onUnsupportedSubject();
      scroller.scrollTo('who-can-i-contact', {
        smooth: true,
        duration: smoothScrollConfig.duration,
        delay: smoothScrollConfig.delay,
      });
    }
  };

  const checkForErrors = e => {
    const curEl = e.target;
    const id = curEl.id;
    if (id.toLowerCase().indexOf('email') !== -1) {
      if (isEmailDirty) {
        setEmailError(!curEl.checkValidity());
        if (!curEl.value) {
          setEmailErrorMsg('Required Field');
        } else {
          setEmailErrorMsg('Please enter a valid email address');
        }
      } else {
        setEmailErrorMsg('');
      }
    } else {
      if (isCommentDirty) {
        const trimmedComment = curEl.value.trim();
        const isCommentError = !(trimmedComment && curEl.checkValidity());
        setCommentError(isCommentError);
      }
    }
  };

  const checkValidity = () => {
    const comment = document.getElementById('contactUsComment');
    const email = document.getElementById('contactUsEmail');
    setIsValid(comment.checkValidity() && email.checkValidity());
  };

  const onChange = value => {
    setRecaptchaValue(value);
  };

  return (
    <div className={contactUsForm}>
      <div className={formElement}>
        <SelectControl
          options={dropdownOptions}
          label="Subject"
          optionLabelKey="label"
          selectedOption={subjectType}
          changeHandler={subjectValueChange}
        />
      </div>
      <div className={formElement}>
        <label htmlFor="contactUsName" className={label}>
          Name
        </label>
        <input id="contactUsName" type="text" placeholder="Name" className={textInput} disabled={disabled ? 'disabled' : ''} />
      </div>
      <form name="contactUsForm" noValidate>
        <div className={commentBoxSpacing}>
          <label htmlFor="contactUsEmail" className={label}>
            Email <span className={required}>*</span>
          </label>
          {emailError && (
            <div className={errorIcon}>
              <FontAwesomeIcon icon={faExclamationCircle} />
            </div>
          )}
          <input
            onBlur={checkForErrors}
            onChange={setIsDirty}
            required
            id="contactUsEmail"
            type="email"
            placeholder="Email"
            disabled={disabled ? 'disabled' : ''}
            className={`${textInput} ${emailError ? error : ''}`}
          />
          {emailError && (
            <div className={errorMsg}>
              <span className={required}>*</span> {emailErrorMsg}
            </div>
          )}
        </div>
        <div className={commentBoxSpacing}>
          <label htmlFor="contactUsComment" className={label}>
            Comment <span className={required}>*</span>
          </label>
          {commentError && (
            <div className={errorIcon}>
              <FontAwesomeIcon icon={faExclamationCircle} />
            </div>
          )}
          <textarea
            onBlur={checkForErrors}
            onChange={setIsDirty}
            required
            id="contactUsComment"
            disabled={disabled ? 'disabled' : ''}
            className={`${textInput} ${comment} ${commentError ? error : ''}`}
          />
          {commentError && (
            <div className={errorMsg}>
              <span className={required}>*</span> Required Field
            </div>
          )}
        </div>
        <ReCAPTCHA sitekey="6LdyvrEZAAAAAPtSTHjmXgJ2oU8tVhBfpuMzHqa4" className={recaptcha} ref={recaptchaRef} onChange={onChange} />
        {!isCallingAPI &&
          showResponseMessage &&
          (isResponseSuccessful ? (
            <div data-test-id="successfulResponse" className={`${responseMessage} ${success}`}>
              <div>
                <FontAwesomeIcon icon={faCheckCircle} className={responseIcon} />
                <div className={responseTitle}>Thank you!</div>
              </div>
              <div className={responseBody}>
                Your message has been received and will be reviewed. We appreciate your input, but please know that we may not be able to respond to
                every submission.
              </div>
            </div>
          ) : (
            <div data-test-id="failedResponse" className={`${responseMessage} ${error}`}>
              <div>
                <FontAwesomeIcon icon={faExclamationCircle} className={responseIcon} />
                <div className={responseTitle}>Unable to Send Message</div>
              </div>
              <div className={responseBody}>
                Your message could not be sent at this time. Please ensure that all required fields have been filled out and try again.
              </div>
            </div>
          ))}
        {!isLongResponse ? (
          <button disabled={!isValid || isCallingAPI || !recaptchaValue || disabled} className={submit} onClick={submitFeedback}>
            Submit
          </button>
        ) : (
          <button disabled={true} className={`${submit} ${loading}`}>
            <CircularProgress size={17} />
          </button>
        )}
      </form>
    </div>
  );
};

export default ContactForm;
