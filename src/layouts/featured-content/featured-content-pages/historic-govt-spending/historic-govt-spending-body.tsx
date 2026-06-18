import React, { ReactElement } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import { featuredContentCitationsMap } from '../../featured-content-helpers';
import { image, imageBox } from './historic-govt-spending-body.module.scss';

interface IImageNode {
  name: string;
  childImageSharp: { gatsbyImageData: Record<string, unknown> };
}

const BoxedImage = ({ images, name, altText }: { images: IImageNode[]; name: string; altText: string }): ReactElement => {
  const node = images?.find(img => img.name === name);
  const gatsbyImage = getImage(node);

  return (
    <div className={imageBox} data-testid={`historic-govt-spending-image-${name}`}>
      {gatsbyImage && <GatsbyImage image={gatsbyImage} alt={altText} className={image} />}
    </div>
  );
};

export const HistoricGovtSpendingBody = (): ReactElement => {
  const data = useStaticQuery(
    graphql`
      query {
        allFile(filter: { extension: { eq: "png" } }) {
          topicsImages: nodes {
            name
            childImageSharp {
              gatsbyImageData(quality: 100, placeholder: BLURRED)
            }
          }
        }
      }
    `
  );
  const images: IImageNode[] = data.allFile.topicsImages;

  const { accountsOfReceiptsAndExpenditures, monthlyTreasuryStatement, usaSpending, combinedStatement } = featuredContentCitationsMap[
    'historic-govt-spending'
  ];

  return (
    <div>
      <p>
        The {accountsOfReceiptsAndExpenditures} has all the details! The earliest report from 1793, now available on Fiscal Data, includes expenses to
        individuals and companies who supplied the Department of War with supplies.
      </p>
      <BoxedImage images={images} name="ledger1_colored" altText="A page from a historic federal financial report listing government expenses." />
      <p>
        These reports also included very detailed descriptions for expenses incurred by the government, including the individuals to which money was
        paid. See below for the travel expenses covered for an individual who testified in a counterfeiting case in 1791. Today, spending expenses can
        be found at an aggregate level in the {monthlyTreasuryStatement} or in detail on {usaSpending}.
      </p>
      <BoxedImage images={images} name="ledger2_colored" altText="A page from a historic federal financial report listing government expenses." />
      <p>
        These early reports also provide a glimpse into the expenses and funding for the 1803 Louisiana Purchase. In the 1805 Account of the Receipts
        and Expenditures of the United States, there are expenses of $8,625 for Land Titles in Louisiana, as well as interest payments on Louisiana
        Stock as part of the Public Debt.
      </p>
      <BoxedImage images={images} name="ledger3_colored" altText="A page from a historic federal financial report listing government expenses." />
      <BoxedImage images={images} name="ledger4_colored" altText="A page from a historic federal financial report listing government expenses." />
      <p>
        To explore more historic spending, revenue, and deficits, check out all of the {accountsOfReceiptsAndExpenditures} files or the ongoing{' '}
        {combinedStatement} for nearly 250 years of continuous financial reporting of the United States!
      </p>
    </div>
  );
};
