import { postAPI } from '../../../utils/api-utils';
import { fileSizeTranslator2 } from '../../datatables-tab/datatables-tab-helpers';

export const getFileSize = async (filePath, failedRequestsNbr = 0) => {
  const fetchHeadOption = {
    method: 'HEAD',
  };

  if (failedRequestsNbr < 3) {
    return postAPI(filePath, fetchHeadOption)
      .then(res => {
        let returnVal = null;
        if (res && res.headers && res.headers.get) {
          const fileSize = res.headers.get('Content-Length');
          if (fileSize) {
            returnVal = fileSizeTranslator2(fileSize);
          }
          // Uncomment the below for testing file sizes in local
          // else {
          //   returnVal = Math.round(Math.random() * 100) + ' MB';
          // }
        }
        return returnVal;
      })
      .catch(async e => {
        await getFileSize(filePath, ++failedRequestsNbr);
      });
  } else {
    return null;
  }
};
