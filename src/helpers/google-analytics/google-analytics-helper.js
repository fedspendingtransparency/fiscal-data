export const ga4DataLayerPush = eventObj => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(eventObj);
};
