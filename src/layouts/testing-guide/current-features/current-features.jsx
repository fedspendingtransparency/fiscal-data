import React from 'react';
import { section } from '../testing-guide.module.scss';

const CurrentFeatures = ({ specs }) => {
  return (
    <>
      <div className={section}>
        {specs.map((spec, i) => {
          console.log(spec);
          return (
            <>
              <div>
                <b>Feature: </b>
                {spec.label}
              </div>
              <div>
                <b>Description: </b>
                {spec.description}
              </div>
              {i !== specs.length - 1 && <br />}
            </>
          );
        })}
      </div>
    </>
  );
};

export default CurrentFeatures;
