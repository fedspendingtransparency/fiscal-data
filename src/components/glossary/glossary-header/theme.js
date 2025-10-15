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
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 253, 253, 0.96)',
          boxShadow: '0 2px 30px 0 rgba(0, 0, 0, 0.16)',
          maxWidth: '90%',
          width: '17rem',
          margin: '0.5rem 0',
        },
      },
    },
  },
};

export const searchBarTheme = createTheme(theme);
