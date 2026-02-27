import React from 'react';
import beautify from 'js-beautify';
import SectionContent from '../../section-content/section-content';
import { beautified } from '../../../../pages/api-documentation/api.module.scss';
import { code } from './links-object.module.scss';

const LinksObject = () => (
  <SectionContent id="responses-links-object" headingLevel={3} title="Links Object">
    <p>
      The links object is an API argument to access the current (self), first, previous, next, and last page of data. It is suitable for creating URLs
      under user interface elements such as pagination buttons.
    </p>
    <div>
      <h4>Example Links Object:</h4>
    </div>
    <code className={`large ${code} ${beautified}`}>
      <pre>
        {beautify(
          `"links":{
            "self":"&page%5Bnumber%5D=1&page%5Bsize%5D=-1",
            "first":"&page%5Bnumber%5D=1&page%5Bsize%5D=-1",
            "prev":null,
            "next":null,
            "last":"&page%5Bnumber%5D=1&page%5Bsize%5D=-1"
          }`,
          { indent_size: 2 }
        )}
      </pre>
    </code>
  </SectionContent>
);

export default LinksObject;
