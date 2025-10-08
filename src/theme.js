import { createTheme } from '@mui/material/styles';
import * as variables from './variables.module.scss';

const baseTheme = {
  palette: {
    primary: {
      '500': '#0071bc',
    },
    secondary: {
      main: '#2272ce',
    },
    // does not have a corresponding variable in variable.modules.scss
    background: 'rgba(0, 113, 188, 0.1)',
  },
  overrides: {
    MuiTabs: {
      root: {
        minHeight: 0,
      },
      flexContainer: {
        borderBottomColor: variables.borderColor,
        borderBottomWidth: 2,
        borderBottomStyle: 'solid',
      },
      indicator: {
        height: 4,
      },
      fixed: {
        marginBottom: variables.fontSize_14,
      },
    },
    MuiPaper: {
      root: {
        color: variables.fontBodyCopy,
        backgroundColor: 'white',
      },
    },
    MuiFormControl: {
      root: {
        width: '100%',
      },
    },
    MuiInputBase: {
      root: {
        color: variables.fontBodyCopy,
        fontSize: variables.fontSize_15,
      },
      input: {
        color: variables.fontBodyCopy,
      },
    },
    MuiOutlinedInput: {
      root: {
        borderRadius: 3,
        borderColor: variables.borderColor,
      },
      input: {
        padding: 10,
      },
      adornedEnd: {
        paddingRight: 0,
      },
    },
    MuiCard: {
      root: {
        border: `1px solid ${variables.ddBorderColor}`,
        boxShadow: 'none',
        fontSize: variables.fontSize_16,
      },
    },
    MuiCardActionArea: {
      root: {
        padding: variables.fontSize_16,
      },
      focusHighlight: {
        backgroundColor: variables.contentSectionBackground,
      },
    },
  },
};

const datasetSearchTheme = {
  ...baseTheme,
  overrides: {
    ...baseTheme.overrides,
    MuiTab: {
      root: {
        '@media (min-width: 0px)': {
          minWidth: 0,
        },
        textTransform: 'none',
        lineHeight: 'normal',
        minWidth: 0,
        minHeight: 0,
        letterSpacing: 0,
        fontWeight: variables.semiBoldWeight,
        padding: '9px 12px',
        opacity: 1,
        '&$selected': {
          color: variables.primary,
        },
        '&:hover': {
          // does not have a corresponding variable in variable.modules.scss
          backgroundColor: 'rgba(0, 113, 188, 0.1)',
        },
      },
      wrapper: {
        flexDirection: 'row',
        fontSize: variables.fontSize_16,
      },
      selected: {},
    },
  },
};

export const theme = createTheme(baseTheme);
export const dsTheme = createTheme(datasetSearchTheme);
