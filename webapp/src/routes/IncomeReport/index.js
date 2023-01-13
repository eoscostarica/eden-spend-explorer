import React, { memo, useEffect } from 'react'
import { makeStyles } from '@mui/styles'
import { useTranslation } from 'react-i18next'
import {
  FormControl,
  FormControlLabel,
  Typography,
  RadioGroup,
  Radio,
  Divider
} from '@mui/material'

import useIncomeReportState from '../../hooks/customHooks/useIncomeReportState'
import BarChartReport from '../../components/BarChartReport'
import LineChartReport from '../../components/LineChartReport'
import TreasuryBalance from '../../components/TreasuryBalance'
import PieChartReport from '../../components/PieChartReport'
import { formatWithThousandSeparator } from '../../utils'
import TableReport from '../../components/TableReport'
import SelectComponent from '../../components/Select'

import TreasuryDisbursementsInfo from './treasury-disbursements-info'
import styles from './styles'

const useStyles = makeStyles(styles)

const rowsCenter = { flex: 1, align: 'center', headerAlign: 'center' }

const IncomeReport = () => {
  const classes = useStyles()

  const { t } = useTranslation()

  const [
    {
      incomeByElectionsList,
      electionsList,
      delegatesList,
      treasuryList,
      electionRoundSelect,
      showElectionRadio,
      delegatesActualElectionList,
      ranksList
    },
    { setElectionRoundSelect, setShowElectionRadio }
  ] = useIncomeReportState()

  useEffect(() => {
    setShowElectionRadio('allElections')
  }, [])

  const tableData =
    showElectionRadio === 'allElections' ? incomeByElectionsList : delegatesList

  const columns = [
    {
      field: tableData[0]?.name ? 'name' : 'election',
      headerName: tableData[0]?.name
        ? t('tableHeader1', { ns: 'incomeRoute' })
        : t('tableElectionHeader', { ns: 'incomeRoute' }),
      cellClassName: classes.links,
      renderCell: param => (
        <a
          className={tableData[0]?.name ? '' : classes.disableLink}
          href={`https://eosdetective.io/network/transfers?accounts=${param.value}&time_min=1661975129190&time_max=1669751129190&excludedAccounts=&excludedCategories=system`}
        >
          {param.value}
        </a>
      ),
      ...rowsCenter
    },
    {
      field: tableData[0]?.election ? 'EOS_TOTAL' : 'EOS_CLAIMED',
      headerName: 'EOS',
      renderCell: param => <>{formatWithThousandSeparator(param.value, 2)}</>,
      type: 'number',
      ...rowsCenter
    },
    {
      field: tableData[0]?.election ? 'USD_TOTAL' : 'USD_CLAIMED',
      headerName: 'USD',
      renderCell: param => <>{formatWithThousandSeparator(param.value, 2)}</>,
      type: 'number',
      ...rowsCenter
    },
    {
      field: 'EOS_CLAIMED_PERCENT',
      headerName: t('tableHeader7', { ns: 'incomeRoute' }),
      type: 'number',
      ...rowsCenter
    },
    {
      field: 'EOS_UNCLAIMED_PERCENT',
      headerName: t('tableHeader8', { ns: 'incomeRoute' }),
      type: 'number',
      ...rowsCenter
    }
  ]

  return (
    <div className={classes.root}>
      <div id="treasury-container-id">
        <TreasuryBalance />
      </div>
      <TreasuryDisbursementsInfo
        delegatesActualElectionList={delegatesActualElectionList}
        ranksList={ranksList}
      />
      <LineChartReport
        data={treasuryList}
        keyTranslation={'titleLineChart'}
        pathTranslation={'incomeRoute'}
      />
      <BarChartReport
        data={incomeByElectionsList}
        keyTranslation={'titleBarChart'}
        pathTranslation={'incomeRoute'}
        showLegend={true}
        typeData={'income'}
      />
      <Divider variant="middle" />
      <div className={classes.filtersContainer}>
        <div id="id-radio-election-container">
          <FormControl>
            <RadioGroup
              name="election-radio-buttons-group"
              row
              onChange={({ target }) => setShowElectionRadio(target.value)}
              value={showElectionRadio}
            >
              <FormControlLabel
                control={<Radio size="small" />}
                label={t('textRadioButton4', { ns: 'generalForm' })}
                value="allElections"
              />
              <FormControlLabel
                control={<Radio size="small" />}
                label={t('textRadioButton3', { ns: 'generalForm' })}
                value="oneElection"
              />
            </RadioGroup>
          </FormControl>
        </div>
        <div id="id-radio-election-container">
          {showElectionRadio === 'oneElection' && (
            <>
              <SelectComponent
                onChangeFunction={setElectionRoundSelect}
                labelSelect={t('textElectionSelect', { ns: 'generalForm' })}
                values={electionsList.map(data => `${data.election}`)}
                actualValue={electionRoundSelect}
                size="small"
              />
            </>
          )}
        </div>
      </div>

      <PieChartReport
        data={delegatesList}
        keyTranslation={'titlePieChart'}
        pathTranslation={'incomeRoute'}
        typeData={'income'}
      />
      <Divider variant="middle" />
      <div className={classes.tableContainer}>
        <div className={classes.title}>
          <Typography variant="span">
            {showElectionRadio === 'allElections'
              ? t('titleTable2', { ns: 'incomeRoute' })
              : t('titleTable', { ns: 'incomeRoute' })}
          </Typography>
          <div id="id-table-container">
            <TableReport columns={columns} dataPercent={tableData} />
          </div>
        </div>
      </div>
    </div>
  )
}

IncomeReport.prototypes = {}

export default memo(IncomeReport)
