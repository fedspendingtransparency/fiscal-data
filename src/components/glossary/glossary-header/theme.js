import * as variables from '../../../variables.module.scss';
import { createTheme } from '@mui/material/styles';

const theme = {
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-focused fieldset': {
            '&.MuiOutlinedInput-notchedOutline': {
              borderColor: variables.primary,
              borderWidth: '1px',
            },
          },
        },
        adornedEnd: {
          paddingRight: 0,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: variables.fontSize_15,
          fontFamily: 'Source Sans Pro',
          color: variables.fontBodyCopy,
        },
        input: {
          color: variables.fontBodyCopy,
        },
      },
    },
  },
};

// export const useStyles = makeStyles({
//   root: {
//     '& .MuiOutlinedInput-root': {
//       height: variables.fontSize_36,
//     },
//     '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
//       borderColor: '#d9d9d9',
//     },
//   },
// });

export const searchBarTheme = createTheme(theme);
