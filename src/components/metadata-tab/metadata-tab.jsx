import React from 'react';
import DtgTable from "../dtg-table/dtg-table";

export default function MetadataTab(props) {
  const theData = [
    {
      name: 'Title',
      definition: props.config.name
    },
    {
      name: 'Description (Long)',
      definition: props.config.summaryText
    },
    {
      name: 'Description (Short)',
      definition: props.config.tagLine
    },
    {
      name: 'Update Frequency',
      definition: props.config.techSpecs.updateFrequency
    },
    {
      name: 'Date Range',
      definition: props.config.techSpecs.earliestDate + ' - ' + props.config.techSpecs.latestDate
    },
    {
      name: 'Topics',
      definition: props.config.relatedTopics.join(', ')
    },
    {
      name: 'Publisher',
      definition: props.config.publisher
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
    aria: {"aria-label": `${props.config.name} metadata`}
  };

  return (
    <DtgTable tableProps={tableProps} />
  )
}
