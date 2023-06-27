import * as variables from "../../../variables.module.scss";
import { createTheme, makeStyles } from '@material-ui/core/styles';

const theme = {
  overrides: {
    MuiOutlinedInput: {
      root: {
        '&.Mui-focused fieldset': {
          '&.MuiOutlinedInput-notchedOutline': {
            borderColor: variables.primary,
            borderWidth: '1px',
          }
        },
      },
      adornedEnd: {
        paddingRight: variables.fontSize_16,
      },
    },
    MuiInputBase: {
      root: {
        fontFamily: 'Source Sans Pro',
      },
    }
  }
}

const themeWithGlow = {
  ...theme,
  overrides: {
    MuiOutlinedInput: {
      root: {
        '&.Mui-focused fieldset': {
          '&.MuiOutlinedInput-notchedOutline': {
            boxShadow: '0 0 0 4px #e8f5ff',
          }
        },
      },
    },
  }
}

export const useStyles = makeStyles({
  root: {
    '& .MuiOutlinedInput-root': {
      height: variables.fontSize_36,
    },
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderColor: '#d9d9d9',
    },
  }
})

export const searchBarTheme = createTheme(theme);
export const searchBarTheme_withFocusGlow = createTheme(themeWithGlow);



