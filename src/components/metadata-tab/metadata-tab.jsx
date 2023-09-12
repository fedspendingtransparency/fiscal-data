import React from 'react';
import DtgTable from "../dtg-table/dtg-table";

export default function MetadataTab({ config }) {
  const theData = [
    {
      name: 'Title',
      definition: config.name
    },
    {
      name: 'Description (Long)',
      definition: config.summaryText
    },
    {
      name: 'Description (Short)',
      definition: config.tagLine
    },
    {
      name: 'Update Frequency',
      definition: config.techSpecs.updateFrequency
    },
    {
      name: 'Date Range',
      definition: config.techSpecs.earliestDate + ' - ' + config.techSpecs.latestDate
    },
    {
      name: 'Topics',
      definition: config.relatedTopics ? config.relatedTopics.join(', ') : []
    },
    {
      name: 'Publisher',
      definition: config.publisher
    }
  ];
  const columnConfig = [
    {
      property: 'name',
      name: 'Name',
      order: 1,
      width: 18
    },
    {
      property: 'definition',
      name: 'Definition',
      order: 2
    }
  ];

  const tableProps = {
    data: theData,
    columnConfig,
    tableName: 'Metadata Tab',
    aria: {"aria-label": `${config.name} metadata`}
  };

  return (
    <DtgTable tableProps={tableProps} />
  )
}
