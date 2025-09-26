import React, { useEffect, useState } from 'react';
import ComboSelectDropdown from '../../../components/combo-select/combo-currency-select/combo-select-dropdown/combo-select-dropdown';
import { datasetSpecs, defaultSelection, getDatasets } from './testing-guide-helper';
import { datasetName, results, search, section, testingForm, testingGuide } from './testing-guide.module.scss';
import FeatureDisplay from './feature-display';

const TestingGuide = ({ config }) => {
  const [selectedOption, setSelectedOption] = useState(defaultSelection);
  const [currentReportSpecs, setCurrentReportSpecs] = useState([]);
  const [currentTableSpecs, setCurrentTableSpecs] = useState([]);

  const datasetKeys = Object.keys(config);
  const datasetValues = Object.values(config);
  const dropdownOptions = getDatasets(datasetKeys, config);

  const updateSelection = option => {
    setSelectedOption(option);
  };

  const getMatches = currentSpecs => {
    const testingNotes = [];
    currentSpecs?.forEach(spec => {
      const curNotes = spec;
      const matches = datasetValues.filter(x => {
        const hasDatasetConfig = x[spec.value];
        const hasApiConfig = x.apis.filter(api => api[spec.value]).length > 0;
        return (hasDatasetConfig || hasApiConfig) && x.datasetId !== selectedOption.value;
      });
      curNotes.matchingDatasets = matches;
      testingNotes.push(curNotes);
    });
    return testingNotes;
  };

  const getReportSpecs = selectedConfig => {
    console.log(selectedConfig);
    const reportSpecs = [];
    datasetSpecs.report.forEach(spec => {
      if (!!selectedConfig[spec.value]) reportSpecs.push(spec);
    });
    if (reportSpecs.length === 0) {
      if (selectedConfig.publishedReports?.length > 0) {
        reportSpecs.push({ label: 'Standard report functionality' });
      } else {
        reportSpecs.push({ label: 'No published reports' });
      }
    }

    return getMatches(reportSpecs);
  };

  const getTableSpecs = selectedConfig => {
    const tableSpecs = [];
    datasetSpecs.apis.forEach(spec => {
      selectedConfig.apis.forEach(api => {
        if (!!api[spec.value]) {
          if (tableSpecs) tableSpecs.push(spec);
        }
      });
    });
    datasetSpecs.table.forEach(spec => {
      if (!!selectedConfig[spec.value]) {
        if (tableSpecs) tableSpecs.push(spec);
      }
    });

    return getMatches([...new Set(tableSpecs)]);
  };

  useEffect(() => {
    const selectedConfig = config[selectedOption.value];
    if (selectedConfig) {
      setCurrentReportSpecs(getReportSpecs(selectedConfig));
      setCurrentTableSpecs(getTableSpecs(selectedConfig));
    }
  }, [selectedOption]);

  return (
    <div className={testingGuide}>
      <h2>Testing Guide</h2>
      <div className={datasetName}>{selectedOption.label}</div>
      <div className={testingForm}>
        <div className={search}>
          <ComboSelectDropdown active={true} selectedOption={selectedOption} options={dropdownOptions} updateSelection={updateSelection} />
        </div>
        <div className={results}>
          <div className={section}>
            <h3>Reports and Files</h3>
            {currentReportSpecs?.map(spec => {
              return <FeatureDisplay spec={spec} />;
            })}
          </div>
          <div className={section}>
            <h3>Data Preview</h3>
            {currentTableSpecs?.map(spec => {
              return <FeatureDisplay spec={spec} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestingGuide;
