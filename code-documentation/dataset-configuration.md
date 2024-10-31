# Dataset Configurations 

### Dataset Configuration Locations
* **datasets.json -** Holds datasets that are present in *all* environments 
* **endpointConfig.js -** Holds dataset endpoints that are present in *all* environments
* **uat.js -** Holds datasets (and endpoints) that only appear in the UAT environment 
* **qat.js -** Holds datasets (and endpoints) that only appear in the QAT environment 

### Dataset Structure
*Found in uat.js, qat.js, datasets.json* \

Dataset ID: 
- slug: the trailing endpoint after "/datasets" 
  - seoConfig (search engine optimization)
    - pageTitle: what displays at the tab level in browser
    - description: 
    - keywords: 
  - topics: 
  - relatedDatasets:
  - currentDateButton: 
  - detailView (used for secondary/nested tables... clickable on a column value)
    - apiId:
    - field: 
    - label: 
    - secondaryField: 
    - dateRangeLockCopy: 
    - summaryTableFields: 
    - selectColumns: 
    
  



