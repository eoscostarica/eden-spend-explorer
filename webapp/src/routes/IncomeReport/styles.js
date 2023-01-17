export default theme => ({
  root: {
    margin: theme.spacing(1),
    '& #treasury-container-id': {
      display: 'flex',
      justifyContent: 'flex-end',
      [theme.breakpoints.down('sm')]: {
        justifyContent: 'center'
      }
    },
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(0)
    }
  },
  title: {
    '& span': {
      fontSize: '18px',
      fontWeight: 500,
      lineHeight: 1.56,
      letterSpacing: '-0.4px'
    }
  },
  filtersContainer: {
    marginTop: theme.spacing(2),
    '& #id-radio-election-container': {
      display: 'flex',
      marginLeft: theme.spacing(2),
      justifyContent: 'end',
      alignItems: 'center'
    },
    '& span': {
      fontSize: '12px',
      fontWeight: 300,
      lineHeight: 1.33,
      letterSpacing: '-0.26px'
    }
  },
  tableContainer: {
    marginTop: theme.spacing(3),
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 'bold',
      color: theme.palette.secondary.main
    },
    '& .MuiDataGrid-iconSeparator': {
      display: 'none'
    },
    '& .MuiDataGrid-cell': {
      color: theme.palette.secondary.main
    },
    '& #id-table-container': {
      marginTop: theme.spacing(2)
    }
  },
  links: {
    '& a ': {
      display: 'flex',
      textAlign: 'center',
      textDecoration: 'none',
      color: theme.palette.secondary.main,
      marginTop: '2px'
    },
    '& a:hover': {
      color: '#1565c0'
    }
  },
  disableLink: {
    pointerEvents: 'none',
    cursor: 'pointer'
  },
  disbursementsContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(3)
  },
  disbursementBox: {
    margin: theme.spacing(0, 2, 0, 2)
  },
  rankLevelBox: {
    margin: theme.spacing(0, 2, 0, 2),
    borderRight: '1px solid rgba(0, 0, 0, 0.12)',
    paddingRight: theme.spacing(3)
  }
})
