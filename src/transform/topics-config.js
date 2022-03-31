
let topicsSource  = {
  "debt": {
    label: "Debt",
    title: "Topics",
    slug: "debt",
    datasetIds: new Set()
  },
  "revenue": {
    label: "Revenue",
    title: "Topics",
    slug: "revenue",
    datasetIds: new Set()
  },
  "spending": {
    label: "Spending",
    title: "Topics",
    slug: "spending",
    datasetIds: new Set()
  },
  "financial-summaries": {
    label: "Financial Summaries",
    title: "Topics",
    slug: "financial-summaries",
    datasetIds: new Set()
  },
  "interest-exchange-rates": {
    label: "Interest & Exchange Rates",
    title: "Topics",
    slug: "interest-exchange-rates",
    datasetIds: new Set()
  },
  "savings-bonds": {
    label: "Savings Bonds",
    title: "Topics",
    slug: "savings-bonds",
    datasetIds: new Set()
  }
};

/**
 * add a dataset id to a topic
 * @param topicId
 * @param datasetId
 */
const addDatasetToTopic = (topicId, datasetId) => {
  if (!topicsSource[topicId]) {
    console.warn("The topic id [%s] doesn't exist in the topics source.", topicId);
    return;
  }
  topicsSource[topicId].datasetIds.add(datasetId);
};

/**
 * provides the updated topics array
 */
const freshTopics = () => {
  let output = [];

  Object.entries(topicsSource).forEach(([topicId, topic]) => {
    output[output.length] = {
      ...topic,
      datasetIds: Array.from(topic.datasetIds)
    };
  });

  return output;
};

exports.addDatasetToTopic = addDatasetToTopic;
exports.freshTopics = freshTopics;
