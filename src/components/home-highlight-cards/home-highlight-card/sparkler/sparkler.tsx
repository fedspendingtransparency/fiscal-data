import React, {FunctionComponent, ReactElement, useEffect, useState} from "react"
import { star, alternate, sparkleBox } from "./sparkler.module.scss"

type SparklerProps = {
  coordinates: (string | number)[][]
};

const Sparkler: FunctionComponent<SparklerProps> = ({coordinates}): JSX.Element => {

  const [sparkles, setSparkles] = useState<ReactElement>();

  const sparkle =
    <svg aria-hidden="true" width="38" height="38">
      <use href="#glimmer" />
    </svg>;

  const scintillate = ():ReactElement => {
    // randomly select one coordinate pair to place the first appearing sparkle with a fade effect that starts fully opaque
    const startingSpot = Math.floor(Math.random() * coordinates.length);

    return (
      <div className={sparkleBox} onMouseLeave={() => setSparkles(scintillate())} role={'presentation'}>
        <svg aria-hidden="true" style={{display: 'none'}}>
        <symbol id="glimmer" viewBox="155 78 68 9">
          <g fill="none" transform="scale(1 -1)">
            <g transform="translate(0 -792)">
              {/* eslint-disable-next-line max-len */}
              <path d="M 155.722,708.846 L 173.537,705.957 C 179.192,705.041 184.522,699.706 185.433,694.051 L 188.301,676.269 C 188.466,675.241 188.737,675.241 188.903,676.269 L 191.792,694.084 C 192.708,699.739 198.043,705.069 203.698,705.98 L 221.48,708.848 C 222.508,709.013 222.508,709.284 221.48,709.45 L 203.665,712.339 C 198.01,713.255 192.68,718.591 191.769,724.246 L 188.901,742.028 C 188.736,743.056 188.465,743.056 188.299,742.028 L 185.41,724.213 C 184.494,718.558 179.159,713.227 173.504,712.316 L 155.722,709.448 C 154.694,709.283 154.694,709.012 155.722,708.846 Z"
                    fill="#ffffff" strokeLinejoin="round" strokeLinecap="round" strokeWidth="0.5"
                    stroke="none" markerStart="none" markerEnd="none" strokeMiterlimit="79.8403193612775"
              />
            </g>
          </g>
        </symbol>
        </svg>
        {
          coordinates.map((coords, idx) => {
            return (
              (idx === startingSpot) ? (
                <div className={`${star} ${alternate}`}
                     data-testid="scintilla"
                     key={idx}
                     style={{ left: coords[0], top: coords[1] }}
                >
                  {sparkle}
                </div>
                ) : (
                <div key={idx}
                     className={star}
                     data-testid="scintilla"
                     style={
                  {
                    left: coords[0],
                    top: coords[1],
                    animationDelay: `${Math.random() * 3}s`
                  }}
                >
                  {sparkle}
                </div>)
            )
          })
        }
      </div>);
  };

  useEffect(() => {
    setSparkles(scintillate());
  }, []);

  return (
    <>
      {sparkles}
    </>
  );
};
export default Sparkler;
