import Accordion from '../../../../../../components/accordion/accordion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDollarSign,
  faHandHoldingMedical,
  faHeartbeat,
  faShieldAlt,
  faUserFriends,
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { debtAccordion } from '../../national-debt.module.scss';
import CustomLink from '../../../../../../components/links/custom-link/custom-link';
import { analyticsClickHandler } from '../../../../explainer-helpers/national-debt/national-debt-helper';
import {
  fundingProgramAccordion,
  spendingCategoriesAccordionContent,
  spendingCategoriesTable,
  row, firstColumn, secondColumn, icon
} from './spending-categories-accordion.module.scss'

const SpendingCategoriesAccordion = () => {
  const accodionContent = [
    {
      name: 'Income Security',
      description: 'Supports programs such as unemployment compensation, federal employee retirement and disability, ' +
        'and food and nutrition assistance; spending for this program increased during the COVID-19 pandemic because of ' +
        'the CARES Act and American Rescue Plan Act',
      icon: faDollarSign
    },
    {
      name: 'Social Security',
      description: 'Supports programs for beneficiaries including retirement, disability insurance, and supplemental security income payments',
      icon: faUserFriends
    },
    {
      name: 'Health',
      description: 'Supports spending for programs related to health care services, health research and training, and consumer and ' +
      'occupational health and safety, except for Medicare which has its own category',
      icon: faHeartbeat
    },
    {
      name: 'National Defense',
      description: 'Supports spending related to the military and defense-related activities',
      icon: faShieldAlt
    },
    {
      name: 'Medicare',
      description: 'Supports spending programs providing health insurance for people such as those aged 65 or older and certain younger ' +
        'people with disabilities',
      icon: faHandHoldingMedical
    },
  ]

  const usaSpending_majorSpendingCategories = (
    <CustomLink
      url={"https://www.usaspending.gov/"}
      onClick={() =>
        analyticsClickHandler(
          "Citation Click",
          "What are the major spending categories?"
        )
      }
    >
      USAspending.gov
    </CustomLink>
  );

  const objectClass = (
    <CustomLink
      url={"https://www.usaspending.gov/#/explorer/object_class"}
      onClick={() =>
        analyticsClickHandler(
          "Citation Click",
          "What are the major spending categories?"
        )
      }
    >
      Object Class
    </CustomLink>
  );

  const budgetFunction = (
    <CustomLink
      url={"https://www.usaspending.gov/explorer/budget_function"}
      onClick={() =>
        analyticsClickHandler(
          "Citation Click",
          "What are the major spending categories?"
        )
      }
    >
      Budget Function
    </CustomLink>
  );

  return (
    <>
      <div className={debtAccordion}>
        <Accordion
          title="What are some of the major spending categories?"
          ga4ID={"major-spending-cat"}
          altStyleAccordion={{ padding: "9px 16px" }}
          containerClass={fundingProgramAccordion}
          openEventNumber={"11"}
          closeEventNumber={"12"}
          explainerGAEvent="Debt"
        >
          <div className={spendingCategoriesAccordionContent}>
            <p>
              Below are some of the federal government’s largest spending
              categories. Visit {usaSpending_majorSpendingCategories} to explore
              federal spending by the types of items and services purchased by
              the federal government. Explore federal spending by {objectClass}{" "}
              or learn how spending categories and subcategories break down by
              viewing federal spending by {budgetFunction}.
            </p>
            <div className={spendingCategoriesTable}>
              {accodionContent.map(category => (
                <React.Fragment key={category.name}>
                  <div className={row}>
                    <div className={firstColumn}>
                      <FontAwesomeIcon icon={category.icon} className={icon} />
                    </div>
                    <div className={secondColumn}>
                      <strong>{category.name}</strong>
                      <p>
                        {category.description}
                      </p>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </Accordion>
      </div>
    </>
  )
}

export default SpendingCategoriesAccordion;
