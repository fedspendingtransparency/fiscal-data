// import * as variables from "../../../../variables.module.scss";

 import { createTheme } from '@material-ui/core/styles';

const searchBar = {
  palette: {
    primary: {
      main: '#0071bc'
    }
  },
  overrides: {
    MuiOutlinedInput: {
      root: {
        height: '36px',
        '&:hover': {
          borderColor: '#d9d9d9',
        },
        '&.Mui-focused': {
          borderWidth: '1px',
          '&.notchedOutline': {
            border: 'none'
          }
        }
      },
      adornedEnd: {
        paddingRight: '16px',
      },
      notchedOutline: {
        borderWidth: '1px',
        '&:focus': {
          borderWidth: '1px',
        }
      }
    },
    MuiInputBase: {
      root: {
        fontFamily: 'Source Sans Pro',
        borderColor: '#d9d9d9',
        '&:hover': {
          borderColor: '#d9d9d9',
        }
      },

    }
  }
}

export const searchBarTheme = createTheme(searchBar);


