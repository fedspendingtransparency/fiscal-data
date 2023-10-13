export const updatePercentage = (download, onChangeCallback) => {
  if (download.totalPages && download.estimatedFinishTime) {
    const nowTime = new Date(Date.now());
    const elapsed = nowTime - download.requestTime;
    let updatedPct = Math.round((elapsed / download.estimatedFinishTime) * 100);
    updatedPct = updatedPct > 99 ? 99 : updatedPct;
    if (updatedPct > download.progressPct) {
      if (onChangeCallback) {
        onChangeCallback(new Date());
      }
      download.progressPct = updatedPct;
    }
  }
};

export const updateProgress = (download, onChangeCallback) => {
  // how archiving phase relates to time required for page completion and table completion phases
  const archiveFactor = { csv: 8.8, json: 0.28, xml: 0.3 }[download.selectedFileType];
  const archiveExponent = { csv: 1.63, json: 2.08, xml: 1.94 }[download.selectedFileType];

  // how page count impacts archiving phase
  const archivePageFactor = { csv: 0.09, json: 0.13, xml: 0.11 }[download.selectedFileType];

  // how table count impacts archiving phase
  const archiveTableFactor = { csv: 0.12, json: 0.1, xml: 0.19 }[download.selectedFileType];

  // how ratio of pages per table affects archiving phase
  const archivePagePerTableFactor = { csv: 0.25, json: 0.13, xml: 0.11 }[download.selectedFileType];

  // adjust calculation curve based on overall time estimated
  const timingExponent = { csv: 0.66, json: 0.985, xml: 1 }[download.selectedFileType];

  // how pages per table tends to impact time required for table completion phase
  const pagePerTableFactor = { csv: 0.65, json: 0.4, xml: 0.9 }[download.selectedFileType];
  const pagePerTableExponent = { csv: 1.2, json: 1.2, xml: 1.4 }[download.selectedFileType];

  // how table count tends to impact time required for table completion phase
  const tableFactor = { csv: 0.55, json: 0.6, xml: 3.8 }[download.selectedFileType];

  const tableCount = Array.isArray(download.apis) ? download.apis.length : 1;
  const nowTime = new Date(Date.now());
  const elapsed = nowTime - download.requestTime;

  let aveProcPerPage = elapsed;

  if (download.pagesProcessed) {
    const processed = download.pagesProcessed < download.totalPages ? download.pagesProcessed : download.totalPages;
    aveProcPerPage = elapsed / processed;
  }

  if (!download.tablesCompleted || download.tablesCompleted < tableCount) {
    // project how long until all pages are done
    const projectedPageProcTime = aveProcPerPage * download.totalPages;

    // calculate an educated guess for how long before all tables report as completed
    let tableCompletionTime = aveProcPerPage * tableCount * tableFactor;
    const tableCompletionAdjustment = aveProcPerPage * pagePerTableFactor * (download.totalPages / tableCount) ** pagePerTableExponent;
    tableCompletionTime += tableCompletionAdjustment;

    // calculate an initial estimate on how long the archiving is likely to take
    const aveElapsedPerPage = (elapsed + tableCompletionTime) / download.totalPages;
    let allArchiving =
      (projectedPageProcTime + tableCompletionTime) ** timingExponent * archiveFactor +
      archivePageFactor *
        ((aveElapsedPerPage / (download.totalPages - archivePageFactor * download.totalPages)) * (download.totalPages - 1) ** archiveExponent);

    allArchiving += aveElapsedPerPage * (tableCount - 1) * archiveTableFactor;

    if (download.tableCount > 1) {
      // in cases where there are many pages per table, pad the estimate to allow for full
      // 10000 record pages
      allArchiving += allArchiving * (archivePagePerTableFactor * (download.totalPages / download.tableCount));
    } else if (download.totalPages < 3) {
      // reduce tendency to overestimate small download timings
      allArchiving = allArchiving ** 0.985;
    }
    // calculate projected millis required before download is ready
    download.estimatedFinishTime = projectedPageProcTime + tableCompletionTime + allArchiving;

    // restrict progress percentage from getting too high before all tables have been started
    download.estimatedFinishTime /= download.tablesStarted ? (download.tablesStarted + 1) / (tableCount + 1) : 0.7;

    // don't let progress get too close to 100% before the last table has been completed
    download.estimatedFinishTime = download.estimatedFinishTime > elapsed * 1.05 ? download.estimatedFinishTime : elapsed * 1.05;
  } else {
    // capture the all-tables-complete signal and update the projection so that the current progress
    // is based on that state of progress from here forward
    if (download.tablesCompleted === tableCount) {
      // calculate archiving time as above, but start from the actual elapsed time for the table
      // completion phase
      const aveElapsedPerPage = elapsed / download.totalPages;
      let allArchiving =
        elapsed ** timingExponent * archiveFactor +
        archivePageFactor *
          ((aveElapsedPerPage / (download.totalPages - archivePageFactor * download.totalPages)) * (download.totalPages - 1) ** archiveExponent);
      allArchiving += aveElapsedPerPage * (tableCount - 1) * archiveTableFactor;

      if (download.tableCount > 1) {
        allArchiving += allArchiving * (archivePagePerTableFactor * (download.totalPages / download.tableCount));
      } else if (download.totalPages < 3) {
        // reduce tendency to overestimate small download timings
        allArchiving = allArchiving ** 0.985;
      }
      download.estimatedFinishTime = elapsed + allArchiving;
    }
  }
  updatePercentage(download, onChangeCallback);
};
