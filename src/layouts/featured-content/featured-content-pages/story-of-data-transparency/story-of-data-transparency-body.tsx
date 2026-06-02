import React, { ReactElement } from 'react';
import CustomLink from '../../../../components/links/custom-link/custom-link';

export const StoryOfDataTransparencyBody = (): ReactElement => {
  return (
    <div>
      <p>
        This is a Feature Content page: a short, informational snippet of content. Replace this copy with one to four paragraphs explaining the topic.
        Body text can include glossary terms, such as the federal debt, which open a definition popover when clicked.
      </p>
      <p>
        Paragraphs can also include links to other parts of the site, for example{' '}
        <CustomLink url="/americas-finance-guide/national-debt/">Understanding the National Debt</CustomLink>, or to external resources. Keep the
        content concise and focused on a single idea.
      </p>
    </div>
  );
};
