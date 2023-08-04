import React, {useEffect, useRef, useState} from "react";
import { withWindowSize } from 'react-fns';
import { pxToNumber } from '../../helpers/styles-helper/styles-helper';
import globalConstants from "../../helpers/constants";
import SplitFlapCharacter from "./split-flap-character/split-flap-character";
import {
  splitFlapContainer,
  currency,
  magnitude,
  flapContainer,
  rowBreak,
  selectableDigits,
  spacedDigit,
  punctuation,
  blank
} from './split-flap-display.module.scss';
import { breakpointLg } from '../../variables.module.scss';
import {numberWithCommas} from "../../helpers/simplify-number/simplifyNumber";
import BigNumber from "bignumber.js";

interface IFlipCardDisplayProps {
  minLength?: number,
  value: string, // Even when passing in numbers, they should be a string to avoid issues with
                 // very large numbers
  valueType?: 'currency' | 'integer' | 'decimal',
  precision?: number,
  mobilePrecision?: number,
  showCommas?: boolean,
  charSet?: string[],
  stepCycleDelay?: number,
  padDirection?: 'left' | 'right',
  width?: number
}

const numericCharSet: string[] = [
  ' ', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
];

const purgeCharactersNotInCharSet = (
  value: string,
  charSet: string[],
  precision: number,
  showCommas?: boolean,
  preserveDecimal: boolean = true
): string => {
  return value.split('')
    .map((char: string, charIndex: number, srcArray: string[]): string => {
      if (showCommas && char === ',') return char;
      if (preserveDecimal && charIndex ===
        (srcArray.length - (precision + 1)) && char === '.') return char;
      return charSet.includes(char) ? char : charSet[0];
    })
    .join('');
};

const minLengthFill = (value: string, charSet: string[], minimumLength: number): string[] => {
  if (minimumLength && value.length < minimumLength) {
    return Array(minimumLength - value.length).fill(' ');
  }
  return [];
};
const toPrecision = (number: string, precision): string => {
  const bNumber: BigNumber = new BigNumber(number);
  return bNumber.toFixed(precision)
};


const SplitFlapDisplay = (
  {
    minLength,
    value,
    mobilePrecision,
    valueType = 'currency',
    precision = typeof(window) !== 'undefined' ? (window.innerWidth < pxToNumber(breakpointLg) ? mobilePrecision : 0) : 0,
    showCommas = true,
    charSet = numericCharSet,
    stepCycleDelay = globalConstants.config.splitFlap.speed,
    padDirection = 'left',
    width
  }: IFlipCardDisplayProps
): JSX.Element => {
  // creates a string of 0s that is the same length as the desired value

  const mobileBreakpoint = useRef<number>(pxToNumber(breakpointLg));

  const [minimumDisplayLength, setMinimumDisplayLength] = useState<number>(0);
  const [shortenDisplay, setShortenDisplay] = useState<boolean | null>(null);
  const [prevValue, setPrevValue] = useState<string>(null);

  const [currValue, setCurrValue] = useState<string>(null);
  const [prevChars, setPrevChars] = useState<string[]>(null);

  const [currChars, setCurrChars] = useState<string[]>(null);
  const [displayValue, setDisplayValue] = useState<string>(null);
  const [displayMagnitude, setDisplayMagnitude] = useState<string>(null);
  const [shortenedValue, setShortenedValue] = useState<string>(null);
  const [displayReady, setDisplayReady] = useState<boolean>(false);

  const [description, setDescription] = useState<string>('');
  const workingPrevValue = useRef<string>(null);
  const workingCurrValue = useRef<string>(null);

  const originalValue = useRef<string>(null);
  const timer = useRef<number | null>(null);

  const updateCycle = () => {

    if (!displayValue) return;
    const finalValue = purgeCharactersNotInCharSet(displayValue, charSet, precision, showCommas);
    if (timer.current || workingPrevValue.current === finalValue) {
      return;
    }

    workingPrevValue.current = workingCurrValue.current;
    setPrevValue(workingPrevValue.current);

    const currChars = workingCurrValue.current.split('');
    const finalChars = finalValue.split('');

    const nextValue = finalChars
      .map((char: string, valuePosition: number, srcArray: string[]) => {
        const currChar = currChars[valuePosition];
        const charSetIndex = charSet.indexOf(currChar);
        if (showCommas && char === ',') return char;
        if (valueType !== "integer"
          && char === '.'
          && valuePosition === srcArray.length - (precision + 1)) {
          return char;
        }

        // if the current char is our target char, or the currChar isn't in the char set...
        return currChar === char || (charSetIndex === 0 && !charSet.includes(char))
          ? currChar // ...pass it through
          : charSet[(charSetIndex + 1) % charSet.length];  // else, wrap around the char set
      }).join('');

    workingCurrValue.current = nextValue;
    setCurrValue(workingCurrValue.current);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    timer.current = setTimeout(() => {
      timer.current = null;
      updateCycle();
    }, stepCycleDelay);
  };

  const clearTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const setShortMode = () => {
    if (width === 0) return;
    setShortenDisplay((width <= mobileBreakpoint.current));
  };

  const formatNumberForDisplay = (x: string | number): string => {
    if (isNaN(+x)) {
      // string needs to be a number
      console.warn('Split Flap component needs Value [%s] to be a number.', value);
      return `${x}`;
    }

    const xWithPrecision: string = toPrecision(`${x}`, precision);

    if (showCommas) {
      return `${numberWithCommas(xWithPrecision)}`;
    } else {
      return xWithPrecision;
    }

  };

  const shortenedNumberWithMagnitude = (fullNumber: string, sigFigs: number)
    : { value: string, magnitude: string } => {
    const bNumber: BigNumber = new BigNumber(fullNumber)
    const numberLength: number = bNumber.toFixed(0).length;
    const magSrc: string[] = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];
    let shortenedNumber: number = 0;
    const sections = Math.ceil(numberLength/3);
    const magnitude = (sections > 1) ? magSrc[sections - 1] : '';

    if (numberLength <= sigFigs) {
      shortenedNumber = +fullNumber;
    } else {
      shortenedNumber = bNumber.dividedBy(Math.pow(10, ((sections - 1) * 3))).toNumber();
    }

    return {
      value: `${shortenedNumber}`,
      magnitude: magnitude
    };
  };

  const generateDescription = () => {
    const output = `${displayValue}${shortenDisplay ? ' ' + displayMagnitude : ''}`;
    setDescription(output);
  };

  const setDisplayChars = (minimumLength: number): void => {
    if (prevValue === null) return;
    if (padDirection === 'left' && minLength > 3 && !currValue.includes(' ')) {
      setPrevChars([
        ...minLengthFill(prevValue, charSet, minimumLength),
        ...prevValue.split('')
      ]);
      setCurrChars([
        ...minLengthFill(currValue, charSet, minimumLength),
        ...currValue.split('')
      ]);
    } else if (minLength > 3 && !currValue.includes(' ')) {
      setPrevChars([
        ...prevValue.split(''),
        ...minLengthFill(prevValue, charSet, minimumLength)
      ]);
      setCurrChars([
        ...currValue.split(''),
        ...minLengthFill(currValue, charSet, minimumLength)
      ]);
    }
  };

  const initializeCharArrays = (initLength: number): void => {
    const initValue: string = Array(initLength).fill(charSet[0]).join('');
    setPrevValue(initValue);
    setCurrValue(initValue);
    workingPrevValue.current = initValue;
    workingCurrValue.current = initValue;
  };

  useEffect(() => {
    if (width === null || width < 10) return;
    setShortMode();
  }, [width]);

  useEffect(() => {
    if (value === originalValue.current) {
      return;
    }

    originalValue.current = value;
    workingPrevValue.current = null;
    const shortenedVal = shortenedNumberWithMagnitude(originalValue.current, 2);

    setShortenedValue(shortenedVal.value);
    setDisplayMagnitude(shortenedVal.magnitude);

    setDisplayValue(
      formatNumberForDisplay(shortenDisplay ? shortenedValue : originalValue.current)
    );


  }, [value]);

  useEffect(() => {
    setShortMode();
  }, []);

  useEffect(() => {
    clearTimer();
    updateCycle();
    generateDescription();
    return clearTimer;
  }, [displayValue, charSet, stepCycleDelay]);

  useEffect(() => {
    if (!displayReady) initializeCharArrays(minimumDisplayLength);
    setDisplayChars(minimumDisplayLength);
    setDisplayReady(true);
  }, [prevValue, currValue, minimumDisplayLength]);

  useEffect(() => {
    if (shortenDisplay === null) return;
    workingPrevValue.current = null;

    if (shortenDisplay) {
      const shortenedMinLength = Math.round(parseFloat(shortenedValue))?.toString().length;
      setMinimumDisplayLength(shortenedMinLength);
      setDisplayValue(formatNumberForDisplay(shortenedValue));
    } else {
      setMinimumDisplayLength(minLength);
      setDisplayValue(formatNumberForDisplay(originalValue.current));
    }

  }, [shortenDisplay, shortenedValue]);

  return (
    <div className={splitFlapContainer}
      role="img"
      aria-label={`$${description}`}
    >

      { displayReady &&
      (
        <>
          <div className={flapContainer} aria-hidden={true}>
            {prevChars && <span className={currency}>$</span>}
            {prevChars && prevChars.map((prevChar: string, index: number) => (
              <React.Fragment key={`split-flap-char-${index}`}>
                <SplitFlapCharacter cycleDelay={stepCycleDelay}
                                    value={currChars[index] === ' ' ? '\u2007' : currChars[index]}
                                    prevValue={prevChar === ' ' ? '\u2007' : prevChar}
                />
              </React.Fragment>
            ))}
            {(displayValue && displayValue.length) && (
              <div className={selectableDigits} data-testid="selectable-digits">$
                {displayValue.split('').map((valChar: string, index: number) => (
                  <span
                    className={
                    [',', '.'].includes(valChar) ? punctuation : spacedDigit} key={index}
                  >{valChar}
                  </span>
                  ))}
              </div>
            )}
            <div className={blank}>&nbsp;</div>
          </div>
          {shortenDisplay && (
            <>
              <div className={rowBreak} />
              <div>&nbsp;</div>
              <div className={magnitude}>
                {displayMagnitude}
              </div>
              <div>&nbsp;</div>
            </>
          )}
        </>
      )
      }
    </div>
  );
};

export default withWindowSize(SplitFlapDisplay);
