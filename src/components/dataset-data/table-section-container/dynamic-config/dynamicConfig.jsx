/* istanbul ignore file */
/**
 * This code is used internally, so the coverage isn't "AS" important with this file.
 */
import React, { useEffect, useState } from 'react';
import * as styles from "./dynamicConfig.module.scss";
import { Modal, Popover} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { createJSONOutput, placeTablePivots } from './helper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import FilterEditor from '../filter-editor/filter-editor';

const getModalStyle = () => {
  const top = '15%';
  const left = '15%';
  const width = '70%';
  const height = '70%';

  return {
    top,
    left,
    maxHeight: height,
    width,
    transform: `translate(-${top}%, -${left}%)`,
  };
};

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const DynamicConfig = ({
  selectedTable,
  handleIgnorePivots,
  handlePivotsUpdated,
  refreshTable
}) => {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [isConfigDirty, setIsConfigDirty] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [configFields, setConfigFields] = useState([]);
  const [draggableContent, setDraggableContent] = useState(null);
  const [pivotViews, setPivotViews] = useState([]);
  const [pivotValues, setPivotValues] = useState([]);
  const [ignorePivots, setIgnorePivots] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isCopySuccessful, setIsCopySuccessful] = useState(false);
  const [successMessageAnchor, setSuccessMessageAnchor] = useState(null);
  const [fieldInEditMode, setFieldInEditMode] = useState();
  const [filtersInEdit, setFiltersInEdit] = useState([]);

  const launchConfig = () => {
    setConfigOpen(true);
  };

  const setPivotOptions = () => {
    const completeTableObj = {
      aggregateOn: null,
      chartType: "none",
      dimensionField: null,
      filters: null,
      title: "Complete Table"
    };
    const curPivotViews = [completeTableObj];
    const aggregate = selectedTable.isLargeDataset ? [{field: 'record_calendar_year', type: 'YEAR'},
      {field: 'record_calendar_month', type: 'MONTH'}] : null;

    selectedTable.valueFieldOptions = pivotValues.map(pivot => pivot.columnName);

    pivotViews.forEach(pivot => {
      curPivotViews.push({
        aggregateOn: aggregate,
        chartType: null,
        dimensionField: pivot.columnName,
        filters: pivot.filters,
        title: pivot.title || pivot.prettyName,
        lastRowSnapshot: pivot.lastRowSnapshot
      })
    });
    selectedTable.dataDisplays = curPivotViews;
    handlePivotsUpdated();
  };

  const closeConfig = () => {
    setConfigOpen(false);
    if (isConfigDirty) {
      setPivotOptions();
      setIsConfigDirty(false);
    }
  };

  const copyToClipboard = (event) => {
    setSuccessMessageAnchor(event.currentTarget);
    window.navigator.clipboard.writeText(
      createJSONOutput(selectedTable, pivotViews, pivotValues)
    ).then(() => {
      setIsCopySuccessful(true);
      setShowSuccessMessage(true);
    }).catch(() => {
      setIsCopySuccessful(false);
      setShowSuccessMessage(true);
    }).finally(() => {
      setTimeout(() => {
        setShowSuccessMessage(false);
        setSuccessMessageAnchor(null);
      }, 1000);
    });
  };

  const createDropzone = (sourceList, type) => (
    <div
      data-test-id={`dropzone_${type.toLowerCase()}`}
      className={`${styles.dropzone} ${type.toLowerCase()}`}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={highlightDropzone}
      onDragLeave={removeDropzoneHighlight}
      onDrop={(e) => dropContent(e, type)}
      role={'presentation'}
    >
      {createPivotOptions(sourceList)}
    </div>
  );

  const updatePivotViewConfig = (field) => {

    const localPivotViews = pivotViews.slice();
    const updatedView = localPivotViews.find(pv => (
      pv.columnName === field.columnName && pv.title === field.title
    ));
    updatedView.lastRowSnapshot = field.lastRowSnapshot;
    if (field.lastSavedTitle !== undefined) {
      updatedView.title = field.title;
      delete field.lastSavedTitle;
    }
    updatedView.lastRowSnapshot = field.lastRowSnapshot;
    delete field.lastSavedSnapshot;

    if (filtersInEdit.length) {
      updatedView.filters = filtersInEdit;
    } else {
      delete updatedView.filters;
    }
    setPivotViews(localPivotViews);
    setIsConfigDirty(true);
  };

  const savePivotViewTitle = (field) => {
    updatePivotViewConfig(field);
    setFieldInEditMode(null);
  };

  const editPivotViewTitle = (field, value) => {
    if (!field.lastSavedTitle) {
      field.lastSavedTitle = field.title;
    }
    field.title = value;
  };

  const updateLastSavedSnapshot = (field) => {
    if (field.lastSavedSnapshot === undefined) {
      field.lastSavedSnapshot = field.lastRowSnapshot || false; // to ensure boolean, not undef
    }
    field.lastRowSnapshot = !field.lastRowSnapshot;
  };

  const cancelPivotViewChanges = (field) => {
    if (field.lastSavedTitle) {
      field.title = field.lastSavedTitle;
      delete field.lastSavedTitle;
    }
    if (field.lastSavedSnapshot !== undefined) {
      field.lastRowSnapshot = field.lastSavedSnapshot;
      delete field.lastSavedSnapshot;
    }
    setFieldInEditMode(null);
  };

  const createPivotOptions = (list) => (
    list.map((field, i) => (
        <div
          role={'button'}
          tabIndex={0}
          key={`configField-${i}`}
          className={`${styles.fieldOption} ${fieldInEditMode === field ? styles.edit : ''}`}
          draggable
          onDragStart={() => initiateDragStart(field, i)}
        >
          {field.columnName}
          <span className={styles.pivotViewOnly}>
            {' '} | {fieldInEditMode === field ? (
              <>
                <input
                  defaultValue={field.title} data-testid="titleInput"
                  onChange={(event) => editPivotViewTitle(field, event.target.value)}
                />
              </>
            ) : (
              <>
                <span data-testid="pivotViewTitle">{field.title}</span>
                <button
                  className={styles.editButton}
                  data-testid={`editButton-${field.title}`}
                  onClick={() => setFieldInEditMode(field)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              </>
            )}
          </span>
          {fieldInEditMode === field && (
            <>
              <span className={styles.snapshotToggler}>
                Use last row snapshot for values?
                <input
                  type="checkbox"
                  onChange={() => updateLastSavedSnapshot(field)}
                  defaultChecked={field.lastRowSnapshot}
                />
              </span>

                <div className={styles.filtersContainer} data-testid="filterEditor">
                  <FilterEditor
                    filters={filtersInEdit}
                    columnNames={selectedTable.fields.map(f => f.columnName)}
                    onUpdate={setFiltersInEdit}
                  />
                </div>
              <hr />
              <button
                onClick={() => savePivotViewTitle(field)}
                data-testid="saveButton"
              >
                <FontAwesomeIcon icon={faCheck} /> Save Changes
              </button>
              <button
                onClick={() => cancelPivotViewChanges(field)}
                data-testid="cancelButton"
              >
                <FontAwesomeIcon icon={faTimes} /> Cancel
              </button>
            </>
          )}
        </div>
    ))
  );

  const togglePivots = () => {
    if(!ignorePivots){
      refreshTable();
    }
    setIgnorePivots(!ignorePivots);
    handleIgnorePivots(!ignorePivots);
  };

  const initiateDragStart = (pivot, i) => {
    setDraggableContent({pivot, idx: i});
  };

  const highlightDropzone = (e) => {
    e.currentTarget.style.opacity = 0.5;
  };

  const removeDropzoneHighlight = (e) => {
    e.currentTarget.style.opacity = 1;
  };

  const dropContent = (e, type) => {
    if (
      !draggableContent
      || !draggableContent.pivot
      || type === draggableContent.pivot.from
      || (type === 'PIVOT_BANK' && !draggableContent.pivot.from
    )) {
      return;
    }

    let curPivots = [];
    let dropSetter = null;
    let source = null;
    let sourceSetter = null;

    const curPivot = type === 'VIEW'
      ? Object.assign({}, draggableContent.pivot)
      : draggableContent.pivot;

    switch(curPivot.from) {
      case 'VIEW':
        source = pivotViews;
        sourceSetter = setPivotViews;
        break;
      case 'VALUE':
        source = pivotValues;
        sourceSetter = setPivotValues;
        break;
      case 'PIVOT_BANK':
      default:
        source = configFields;
        sourceSetter = setConfigFields;
        break;
    }

    const sourceFields = source.slice();

    const uniquifyTitle = (pivot, title, count = 0) => {
      const findTitle = count ? `${title.replace(/ \d+$/,'')} ${count}` : title;
      if (count > 20) return findTitle;
      if (pivotViews.some(p => p.title === findTitle)) {
        return uniquifyTitle(pivot, title, ++count);
      }
      return findTitle;
    };

    switch(type) {
      case 'VIEW':
        curPivot.title = uniquifyTitle(curPivot, curPivot.title || curPivot.prettyName);
        curPivots = curPivots.concat(pivotViews);
        dropSetter = setPivotViews;
        break;
      case 'VALUE':
        sourceFields.splice(draggableContent.idx, 1);
        curPivots = curPivots.concat(pivotValues);
        dropSetter = setPivotValues;
        break;
      case 'PIVOT_BANK':
      default:
        sourceFields.splice(draggableContent.idx, 1);
        curPivots = curPivots.concat(configFields);
        dropSetter = setConfigFields;
        break;
    }
    if (!(type === 'PIVOT_BANK' && curPivot.from === 'VIEW')) {
      curPivot.from = type;
      curPivots.push(curPivot);
      dropSetter(curPivots);
    }
    sourceSetter(sourceFields);
    removeDropzoneHighlight(e);
    setIsConfigDirty(true);
  };

  useEffect(() => {
    if (fieldInEditMode && fieldInEditMode.filters) {
      // make temporary duplicate of any existing filters
      setFiltersInEdit(fieldInEditMode.filters.map(f => Object.assign({}, f)));
    } else {
      setFiltersInEdit([]);
    }
  }, [fieldInEditMode]);

  useEffect(() => {
    const pivotPlacement = placeTablePivots(selectedTable);
    setConfigFields(pivotPlacement['PIVOT_BANK']);
    setPivotViews(pivotPlacement['VIEW']);
    setPivotValues(pivotPlacement['VALUE']);
  }, []);

  return (
    <>
      <button
        data-testid="launchConfigModal"
        aria-label="Configure Chart"
        className={styles.configButton}
        onClick={launchConfig}
      >
        Configure Chart
      </button>
      <label>
        <input type="checkbox" onClick={togglePivots} />
        <span>Chart Without Pivots</span>
      </label>
      <Modal
        open={configOpen}
        onClose={closeConfig}
        aria-labelledby="Charting Configuration Modal"
        aria-describedby="Real-time config updates to current datatable's charts"
      >
        {
          // TODO - Move the children of Modal into a new component along with any resulting logic
          // and unit test this separately from the modal
          <div
            data-testid="configModal"
            id={styles.modal}
            style={modalStyle}
            className={classes.paper}
          >
            <header>
              <h1>Configure Chart</h1>
            </header>
            <hr />
            <section>
              <h2>Field Bank</h2>
              {createDropzone(configFields, 'PIVOT_BANK')}
            </section>
            <article className={styles.pivotDnd}>
              <section>
                <h2>Pivot Views</h2>
                {createDropzone(pivotViews, 'VIEW')}
              </section>
              <section>
                <h2>Pivot Values</h2>
                {createDropzone(pivotValues, 'VALUE')}
              </section>
            </article>
            <hr />
            <footer>
              <Popover
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                open={showSuccessMessage}
                anchorEl={successMessageAnchor}
              >
                <div
                  className={
                    isCopySuccessful ? styles.successfulMessage : styles.unsuccessfulMessage
                  }
                >
                  {isCopySuccessful ? 'Success' : 'Something went wrong, please try again.'}
                </div>
              </Popover>
              <button
                className={styles.configButton}
                onClick={copyToClipboard}
              >
                Copy JSON to Clipboard
              </button>
              <button
                data-test-id="closeConfigModal"
                className={styles.configButton}
                onClick={closeConfig}
              >
                Close
              </button>
            </footer>
          </div>
        }
      </Modal>
    </>
  )
};

export default DynamicConfig;
