import React, { useEffect, useState } from 'react';
import ComboSelectDropdown from '../../components/combo-select/combo-currency-select/combo-select-dropdown/combo-select-dropdown';
import { datasetSpecs, defaultSelection, getDatasets } from './testing-guide-helper';
import { arrow, datasetLink, results, search, testingForm, testingGuide } from './testing-guide.module.scss';
import SiteLayout from '../../components/siteLayout/siteLayout';
import DropdownContainer from '../../components/dropdown-container/dropdown-container';
import DropdownLabelButton from '../../components/dropdown-label-button/dropdown-label-button';
import TestingGuideSection from './testing-guide-section';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons';

const TestingGuide = ({ pageContext }) => {
  const { config } = pageContext;

  const [selectedOption, setSelectedOption] = useState(defaultSelection);
  const [selectedOptionConfig, setSelectedOptionConfig] = useState(null);
  const [currentReportSpecs, setCurrentReportSpecs] = useState([]);
  const [currentTableSpecs, setCurrentTableSpecs] = useState([]);
  const [active, setActive] = useState(false);

  const datasetKeys = Object.keys(config);
  const datasetValues = Object.values(config);
  const dropdownOptions = getDatasets(datasetKeys, config);

  const updateSelection = option => {
    setSelectedOption(option);
    setActive(false);
  };

  const getMatches = currentSpecs => {
    const testingNotes = [];
    currentSpecs?.forEach(spec => {
      const curNotes = spec;
      console.log(curNotes);
      curNotes.matchingDatasets = datasetValues.filter(x => {
        const hasDatasetConfig = x[spec.value];
        const hasApiConfig = x.apis.filter(api => api[spec.value]).length > 0;
        return (hasDatasetConfig || hasApiConfig) && x.datasetId !== selectedOption.value;
      });
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
      setSelectedOptionConfig(selectedConfig);
      setCurrentReportSpecs(getReportSpecs(selectedConfig));
      setCurrentTableSpecs(getTableSpecs(selectedConfig));
    } else {
      setSelectedOptionConfig(null);
      setCurrentReportSpecs(null);
      setCurrentTableSpecs(null);
    }
  }, [selectedOption]);

  const dropdownButton = <DropdownLabelButton selectedOption={selectedOption.label} active={active} setActive={setActive} dropdownWidth="400px" />;

  return (
    <SiteLayout>
      <div className={testingGuide}>
        <h2>Testing Guide</h2>
        <div className={testingForm}>
          <DropdownContainer dropdownButton={dropdownButton} setActive={setActive} active={active}>
            {active && (
              <div className={search}>
                <ComboSelectDropdown active={true} selectedOption={selectedOption} options={dropdownOptions} updateSelection={updateSelection} />
              </div>
            )}
          </DropdownContainer>
          {selectedOptionConfig && (
            <a href={'/datasets' + selectedOptionConfig?.slug} className={datasetLink}>
              View Dataset
              <FontAwesomeIcon icon={faArrowRightLong} title="right arrow" className={arrow} />
            </a>
          )}
          <div className={results}>
            <TestingGuideSection header="Reports and Files" specs={currentReportSpecs} />
            <TestingGuideSection header="Data Preview" specs={currentTableSpecs} />
          </div>
        </div>
      </div>
    </SiteLayout>
  );
};

export default TestingGuide;
