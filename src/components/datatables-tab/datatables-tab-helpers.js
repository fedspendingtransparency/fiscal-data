export const fileSizeTranslator = fileSize => {
  const fileSizeNumber = Number(fileSize);
  if (fileSizeNumber < 1000000) {
    const theNumber = Math.round((fileSizeNumber / 1000));
    if (theNumber === 1000) {return '1 MB'} else {
      return theNumber.toString() + ' KB';
    }
  } else {
    return Math.round((fileSizeNumber / 1000000)).toString() + ' MB';
  }
};

/*
 *             ~~~~~~~fileSizeTranslator2~~~~~~~
 *                   This time it's binary
 */
export const fileSizeTranslator2 = fileSize => {
  if(fileSize && !isNaN(fileSize)){
    const fileSizeNumber = Number(fileSize);
    const fileSizes = ['B', 'KB', 'MB', 'GB'];
    const kb = 1024;
    let curMultiplier = 1;
    for(let i = 0, il = fileSizes.length; i < il; i++){
      const curThreshold = curMultiplier * kb;
      if(curThreshold > fileSizeNumber){
        return Math.round(fileSizeNumber / curMultiplier) + ` ${fileSizes[i]}`;
      }
      curMultiplier = curThreshold;
    }
  }

  return null;
};

export const makeTheDataArray = apisArray => {
  const theDataArray = [];
  apisArray.forEach((api) => {
    // todo - DTG-2209 will provide the file sizes.
    const fileSizesArray = [];
    const dataObj = {
      name: api.tableName,
      description: api.tableDescription,
      fileSizes: fileSizesArray.join(', '),
      rowCount: api.rowCount,
      rowDescription: api.rowDefinition
    };
    theDataArray.push(dataObj);
  });
  return theDataArray;
};
