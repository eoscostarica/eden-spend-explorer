import React, { memo } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import { Spinner } from '@edenia/ui-kit'

import useDelegateReportState from '../../hooks/customHooks/useDelegateReportState'
import AccordionComp from '../../components/Accordion'
import TreasuryBalance from '../../components/TreasuryBalance'
import SelectComponent from '../../components/Select'

import styles from './styles'

const useStyles = makeStyles(styles)

const DelegateReport = () => {
  const classes = useStyles()
  const { t } = useTranslation()
  const { i18n } = useTranslation('translations')
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  const [
    {
      electionRoundSelect,
      electionRoundList,
      delegateList,
      dateElection,
      transactionList,
      categoryList,
      loader,
      accordionList
    },
    { setElectionRoundSelect, setDelegateSelect, setSearchValue }
  ] = useDelegateReportState()

  const dateFormat = new Date(dateElection).toLocaleDateString(
    i18n.language,
    options
  )

  const handleChangeSelectedElection = event => {
    setElectionRoundSelect(Number(event))
  }

  return (
    <div className={classes.root}>
      <div className={classes.headPage}>
        <div className={classes.title}>
          <Typography variant="span">
            {`${t('electionTime', { ns: 'delegateRoute' })}: ${dateFormat}`}
          </Typography>
          <Typography variant="span">
            {t('instruction', { ns: 'delegateRoute' })}
          </Typography>
        </div>
        <div id="treasury-container-id">
          <TreasuryBalance />
        </div>
      </div>
      <div className={classes.filtersContainer}>
        <Autocomplete
          id="combo-box-demo"
          sx={{ width: 300 }}
          options={delegateList.map(
            data => data.account || data.delegate_payer
          )}
          onInputChange={(event, newInputValue) => {
            setSearchValue(newInputValue)
          }}
          autoHighlight
          clearOnEscape
          renderInput={params => (
            <TextField {...params} label="Delegate" variant="outlined" />
          )}
        />
        <SelectComponent
          onChangeFunction={event => handleChangeSelectedElection(event)}
          labelSelect={t('textElectionSelect', { ns: 'generalForm' })}
          values={electionRoundList.map(data => `${data.election}`)}
          actualValue={electionRoundSelect}
          width={200}
        />
      </div>
      {loader ? (
        <div className={classes.spinner}>
          <Spinner />
        </div>
      ) : (
        <AccordionComp
          accordionList={accordionList}
          transactionList={transactionList}
          categoryList={categoryList}
          setDelegateSelect={setDelegateSelect}
        />
      )}
    </div>
  )
}

export default memo(DelegateReport)
