import React, { ReactElement, useState, useEffect } from 'react';
import CustomLink from '../../../../components/links/custom-link/custom-link';
import { footNotes, heroImageSubHeading, footNotesPillData, flapWrapper } from '../../hero-image/hero-image.module.scss';
import { getFootNotesDateRange, getPillData, getChangeLabel } from '../hero-helper';
import SplitFlapDisplay from '../../../../components/split-flap-display/split-flap-display';
import { apiPrefix, basicFetch } from '../../../../utils/api-utils';
import { getShortForm } from '../../../../utils/rounding-utils';
import GlossaryPopoverDefinition from '../../../../components/glossary/glossary-term/glossary-popover-definition';

const TreasuryFraudSpendingHero = (): ReactElement => {
  return (
    <>
      <p>Hero section</p>
    </>
  );
};

export default TreasuryFraudSpendingHero;
