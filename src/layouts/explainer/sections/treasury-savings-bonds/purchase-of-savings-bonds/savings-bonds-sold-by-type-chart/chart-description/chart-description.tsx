import React from 'react';
import { listContainer, description, box, header, descriptionsContainer } from './chart-description.module.scss';
import ScrollContainer from '../../../../../../../components/scroll-container/scroll-container';
import { savingsBondsMap } from '../savings-bonds-sold-by-type-chart-helper';

const ChartDescription = () => {
  const descriptionList = ['AD', 'E', 'EE', 'F', 'G', 'H', 'I', 'J', 'K', 'HH'];

  return (
    <div className={descriptionsContainer}>
      <ScrollContainer
        customContainerStyle={{ height: 'fit-content' }}
        customChildStyle={{ paddingRight: '17px' }}
        gradientColor="#f1f1f1"
        testId="SavingsBondsChart"
        bottomGradient
        deps={[descriptionList]}
      >
        <div className={listContainer}>
          {descriptionList.map((key, index) => {
            const bond = savingsBondsMap[key];
            return (
              <React.Fragment key={index}>
                <div className={header}>
                  <div className={box} data-testid={key + '-box'} style={{ backgroundColor: bond.color }} />
                  <h5>{bond.label}</h5>
                </div>
                <p className={description}>{bond.description}</p>
              </React.Fragment>
            );
          })}
        </div>
      </ScrollContainer>
    </div>
  );
};

export default ChartDescription;
