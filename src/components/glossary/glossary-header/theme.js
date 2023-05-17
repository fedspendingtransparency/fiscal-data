// import * as variables from "../../../../variables.module.scss";

 import { createTheme, makeStyles } from '@material-ui/core/styles';

const theme = {
  overrides: {
    MuiOutlinedInput: {
      root: {
        '&.Mui-focused fieldset': {
          '&.MuiOutlinedInput-notchedOutline': {
            borderColor: '#0071bc',
            borderWidth: '1px',
          }
        },
      },
      adornedEnd: {
        paddingRight: '16px',
      },
    },
    MuiInputBase: {
      root: {
        fontFamily: 'Source Sans Pro',
      },
    }
  }
}

export const useStyles = makeStyles({
  root: {
    '& .MuiOutlinedInput-root': {
      height: '36px',
    },
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderColor: '#d9d9d9',
    },
  }
})

export const searchBarTheme = createTheme(theme);


