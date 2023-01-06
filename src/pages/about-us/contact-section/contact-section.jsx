import React, {useState } from 'react';
import {Link, scroller} from 'react-scroll';
import { API_BASE_URL } from "gatsby-env-variables";
import SectionContent from '../../../components/api-documentation/section-content/section-content';

import * as styles from './contact-section.module.scss';
import * as aboutUsStyles from '../about-us.module.scss';
import SelectControl from "../../../components/select-control/select-control";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationCircle, faCheckCircle} from "@fortawesome/free-solid-svg-icons";
import {postAPI} from "../../../utils/api-utils";
import CircularProgress from "@material-ui/core/CircularProgress";
import ReCAPTCHA from "react-google-recaptcha";

import GLOBALS from '../../../helpers/constants';
import CustomLink from "../../../components/links/custom-link/custom-link"
const smoothScrollConfig = GLOBALS.config.smooth_scroll;

const Contact = ({onUnsupportedSubject = () => {}}) => {
  const dropdownOptions = [
    {
      label: 'Datasets/Reports'
    },
    {
      label: 'Media Inquiries'
    },
    {
      label: 'Provide Feedback'
    },
    {
      label: 'Technical Issues'
    },
    {
      label: 'My Stimulus Payment / Tax Return',
      disableFields: true
    },
    {
      label: 'Other'
    },
  ];

  const initialOption = {label: 'Select Option'};

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
  const submitFeedback = async (e) => {
    e.preventDefault();
    timeOutIdx = setTimeout(function () {
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
      token: recaptchaValue
    }

    const JSONedParams = JSON.stringify(params);

    const url =
      `${API_BASE_URL}/services/api/v2/fiscal-data-contact-us/`

    await postAPI(url, {method: 'POST', body: JSONedParams, headers: {
        'Content-Type': 'application/json'
      }}).then(() => {
      setIsResponseSuccessful(true);
      clearForm();
      afterAPICall();
    }).catch(() => {
      setIsResponseSuccessful(false);
      afterAPICall();
    });

    recaptchaRef.current.reset();

  }

  const afterAPICall = () => {
    setIsCallingAPI(false);
    setShowResponseMessage(true);
    clearTimeout(timeOutIdx);
    setIsLongResponse(false);
  }

  const clearForm = () => {
    const name = document.getElementById('contactUsName');
    const email = document.getElementById('contactUsEmail');
    const comment = document.getElementById('contactUsComment');
    setSubjectType(initialOption);
    name.value = '';
    email.value = '';
    comment.value = '';

    setIsValid(false);
  }

  const setIsDirty = (e) => {
    const curEl = e.target;
    const id = curEl.id;
    if (id.toLowerCase().indexOf('email') !== -1) {
      setIsEmailDirty(true);
    } else {
      setIsCommentDirty(true);
    }
    checkValidity();
  }

  const subjectValueChange = (value) => {
    setSubjectType(value);
    const shouldBeDisabled =
      !(value['disableFields'] === undefined || value['disableFields'] === false);
    setIsDisabled(shouldBeDisabled);
    if (shouldBeDisabled) {
      onUnsupportedSubject();
      scroller.scrollTo('who-can-i-contact', {
        smooth: true,
        duration: smoothScrollConfig.duration,
        delay: smoothScrollConfig.delay
      });

    }
  };

  const checkForErrors = (e) => {
    const curEl = e.target;
    const id = curEl.id;
    if (id.toLowerCase().indexOf('email') !== -1) {
      if (isEmailDirty) {
        setEmailError(!curEl.checkValidity());
        if (!curEl.value) {
          setEmailErrorMsg('Required Field')
        } else {
          setEmailErrorMsg('Please enter a valid email address')
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
  }

  const checkValidity = () => {
    const comment = document.getElementById('contactUsComment');
    const email = document.getElementById('contactUsEmail');
    setIsValid(comment.checkValidity() && email.checkValidity());
  }

  const onChange = (value) => {
    setRecaptchaValue(value);
  }

  return (
    <div className={aboutUsStyles.section}>
      <SectionContent id="contact-us"
                      headingLevel={2}
                      title="Contact Us"
                      className={styles.mainSection}
      >
        <p>
          Have a question about Fiscal Data? The{' '}
          <Link to="about-fiscal-data"
                className="primary"
                smooth={true}
                duration={600}
                delay={200}
          >
            About Us
          </Link> and{' '}
          <Link to="faq"
                className="primary"
                smooth={true}
                duration={600}
                delay={200}
          >
            FAQ
          </Link> are the quickest ways to get an answer, but if you can’t find what you’re
          looking for there or would like to make a suggestion, please fill out the form
          below! Please note that required fields are denoted with an asterisk(
          <span className={styles.required}>*</span>).
          <br /><br />
          <i>
            Do not enter sensitive personal identifiable information such as SSN, address,
            phone number, date of birth, or driver's license number.
          </i>
        </p>
        <div className={styles.contactUsForm}>
          <div className={styles.formElement}>
            <SelectControl options={dropdownOptions}
                           label="Subject"
                           optionLabelKey="label"
                           selectedOption={subjectType}
                           changeHandler={subjectValueChange}
            />
          </div>
          <div className={styles.formElement}>
            <label htmlFor="contactUsName" className={styles.label}>
              Name
            </label>
            <input id="contactUsName"
                   type="text"
                   placeholder="Name"
                   className={styles.textInput}
                   disabled={(disabled) ? 'disabled': ''}
            />
          </div>
          <form name="contactUsForm"
                noValidate
          >
            <div className={styles.commentBoxSpacing}>
              <label htmlFor="contactUsEmail"
                     className={styles.label}
              >
                Email <span className={styles.required}>*</span>
              </label>
              {
                emailError &&
                <div className={styles.errorIcon}>
                  <FontAwesomeIcon icon={faExclamationCircle} />
                </div>
              }
              <input onBlur={checkForErrors}
                     onChange={setIsDirty}
                     required id="contactUsEmail"
                     type="email"
                     placeholder="Email"
                     disabled={(disabled) ? 'disabled': ''}
                     className={`${styles.textInput} ${emailError ? styles.error : ''}`}
              />
              {
                emailError &&
                  <div className={styles.errorMsg}>
                    <span className={styles.required}>*</span>{' '}
                    {emailErrorMsg}
                  </div>
              }
            </div>
            <div className={styles.commentBoxSpacing}>
              <label htmlFor="contactUsComment" className={styles.label}>
                Comment <span className={styles.required}>*</span>
              </label>
              {
                commentError &&
                  <div className={styles.errorIcon}>
                    <FontAwesomeIcon icon={faExclamationCircle} />
                  </div>
              }
              <textarea onBlur={checkForErrors}
                        onChange={setIsDirty}
                        required
                        id="contactUsComment"
                        disabled={(disabled) ? 'disabled': ''}
                        className={
                          `${styles.textInput} ${styles.comment} ${commentError ?
                            styles.error : ""}`}
              />
              {
                commentError &&
                <div className={styles.errorMsg}>
                  <span className={styles.required}>*</span> Required Field
                </div>
              }
            </div>
            <ReCAPTCHA sitekey="6LdyvrEZAAAAAPtSTHjmXgJ2oU8tVhBfpuMzHqa4"
                       className={styles.recaptcha}
                       ref={recaptchaRef}
                       onChange={onChange}
            />
            {
              (!isCallingAPI && showResponseMessage) && (isResponseSuccessful ?
              <div data-test-id="successfulResponse"
                   className={`${styles.responseMessage} ${styles.success}`}
              >
                <div>
                  <FontAwesomeIcon icon={faCheckCircle} className={styles.responseIcon} />
                  <div className={styles.responseTitle}>Thank you!</div>
                </div>
                <div className={styles.responseBody}>
                  Your message has been received and will be reviewed. We appreciate{' '}
                  your input, but please know that we{' '}
                  may not be able to respond to every submission.
                </div>
              </div>
                :
              <div data-test-id="failedResponse"
                   className={`${styles.responseMessage} ${styles.error}`}
              >
                <div>
                  <FontAwesomeIcon icon={faExclamationCircle} className={styles.responseIcon} />
                  <div className={styles.responseTitle}>Unable to Send Message</div>
                </div>
                <div className={styles.responseBody}>
                  Your message could not be sent at this time. Please ensure that all{' '}
                  required fields have been filled out and try again.
                </div>
              </div>)
            }
            {
              !isLongResponse ?
                <button disabled={!isValid || isCallingAPI || !recaptchaValue || disabled }
                        className={styles.submit}
                        onClick={submitFeedback}
                >
                  Submit
                </button>
              :
                <button disabled={true}
                        className={`${styles.submit} ${styles.loading}`}
                >
                  <CircularProgress size={17} />
                </button>
            }
          </form>
        </div>
      </SectionContent>
      <SectionContent id="subscribe"
                      headingLevel={3}
                      title="Sign Up for Email Updates"
      >
        <p>
          Want to stay up to date about new features and datasets? Sign up for email
          updates by sending an email to{' '}
          <CustomLink
            url={`mailto:join-fiscal-data-gov@lists.fiscal.treasury.gov?
            subject=Yes, I’d like to receive updates from Fiscal Data!`}
            external
          >
            join-fiscal-data-gov@lists.fiscal.treasury.gov
          </CustomLink>.
        </p>
      </SectionContent>
    </div>
  );
};

export default Contact;
