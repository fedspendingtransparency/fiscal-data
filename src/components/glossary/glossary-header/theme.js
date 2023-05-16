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
        '&.Mui-focused fieldset': {
          '&.MuiOutlinedInput-notchedOutline': {
            borderColor: '#0071bc',
            borderWidth: '1px',
          }
        },
        '&:hover fieldset': {
          // borderColor: '#d9d9d9',
          '&.MuiOutlinedInput-notchedOutline': {
            borderColor: '#d9d9d9',
            // '&.Mui-focused fieldset': {
            //   borderColor: '#0071bc',
            // },
          },
        },
      },
      adornedEnd: {
        paddingRight: '16px',
      },
    },
    MuiInputBase: {
      root: {
        fontFamily: 'Source Sans Pro',
        borderColor: '#d9d9d9',
      },
    }
  }
}

export const searchBarTheme = createTheme(searchBar);


