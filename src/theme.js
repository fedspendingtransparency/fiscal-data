// import { createTheme } from '@mui/material/styles';
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
  components: {
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 0,
          marginBottom: variables.fontSize_14,
        },
        flexContainer: {
          borderBottomColor: variables.borderColor,
          borderBottomWidth: 2,
          borderBottomStyle: 'solid',
        },
        indicator: {
          height: 4,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          color: variables.fontBodyCopy,
          backgroundColor: 'white',
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          width: '100%',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: variables.fontBodyCopy,
          fontSize: variables.fontSize_15,
        },
        input: {
          color: variables.fontBodyCopy,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
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
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid ${variables.ddBorderColor}`,
          boxShadow: 'none',
          fontSize: variables.fontSize_16,
        },
      },
    },
    MuiCardActionArea: {
      styleOverrides: {
        root: {
          padding: variables.fontSize_16,
        },
        focusHighlight: {
          backgroundColor: variables.contentSectionBackground,
        },
      },
    },
  },
};

const datasetSearchTheme = {
  palette: {
    ...baseTheme.palette,
  },
  components: {
    ...baseTheme.components,
    MuiTab: {
      styleOverrides: {
        root: {
          fontSize: 16,
          minHeight: 0,
          padding: '9px 12px',
          fontFamily: 'Source Sans Pro',
          textTransform: 'none',
          lineHeight: 'normal',
          minWidth: 0,
          letterSpacing: 0,
          fontWeight: variables.semiBoldWeight,
          opacity: 0.7,
          '@media (min-width: 0px)': {
            minWidth: 0,
          },
          '&.Mui-selected': {
            opacity: 1,
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
  },
};

const datasetPropertiesTheme = {
  palette: {
    ...baseTheme.palette,
  },
  components: {
    ...baseTheme.components,
    MuiTab: {
      styleOverrides: {
        root: {
          fontSize: 16,
          marginBottom: -2,
          borderBottom: '2px solid #dddddd',
          padding: '9px 12px',
          fontFamily: 'Source Sans Pro',
          textTransform: 'none',
          lineHeight: 'normal',
          minWidth: 0,
          letterSpacing: 0,
          fontWeight: variables.semiBoldWeight,
          opacity: 1,
          '@media (min-width: 0px)': {
            minWidth: 0,
          },
          '&$selected': {
            color: variables.primary,
          },
          '&:hover': {
            // does not have a corresponding variable in variable.modules.scss
            backgroundColor: 'rgba(0, 113, 188, 0.1)',
          },
        },
      },
    },
  },
};

const chartTableToggleTheme = {
  components: {
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 0,
          '&:focus-visible': {
            backgroundColor: '#dff2f7',
          },
          '&:focus': {
            backgroundColor: '#dff2f7',
          },
        },
        indicator: {
          backgroundColor: '#0071bc',
          height: 4,
        },
        flexContainer: {
          borderWidth: '1px',
          borderBottom: 'none',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          marginBottom: -2,
          borderBottom: '2px solid #dddddd',
          borderRight: '1px solid #dddddd',
          textTransform: 'none',
          fontSize: '14px',
          fontFamily: 'Source Sans Pro',
          minHeight: 0,
          minWidth: '160px',
          opacity: 1,
          letterSpacing: 'normal',
          display: 'flex',
          flexDirection: 'row',
          '@media (max-width: 599px)': {
            minWidth: 0,
          },
          '&.Mui-selected': {
            color: '#0071bc',
            fontWeight: 600,
          },
          '&:hover': {
            backgroundColor: 'rgba(0, 113, 188, 0.1)',
          },

          '&:focus': {
            backgroundColor: '#dff2f7',
          },
        },
        wrapper: {
          flexDirection: 'row',
          fontSize: variables.fontSize_16,
        },
        selected: {},
      },
    },
  },
};

// export const theme = createTheme(baseTheme);
// export const dsTheme = createTheme(datasetSearchTheme);
// export const dpTheme = createTheme(datasetPropertiesTheme);
// export const chartToggleTheme = createTheme(chartTableToggleTheme);
