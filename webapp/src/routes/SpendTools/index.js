import React, { memo, useEffect } from 'react'
import { makeStyles } from '@mui/styles'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import InputLabel from '@mui/material/InputLabel'
import { useTranslation } from 'react-i18next'
import { Spinner } from '@edenia/ui-kit'

import { formatWithThousandSeparator } from '../../utils/format-with-thousand-separator'
import useSpendTools from '../../hooks/customHooks/useSpendToolsState'
import { CATEGORIES } from '../../constants/income.constants'
import { useSharedState } from '../../context/state.context'
import SnackbarComponent from '../../components/Snackbar'

import styles from './styles'
import SpendToolTableRerport from './spendTool-table-report'

const useStyles = makeStyles(styles)
let firstConcat = true

const SpendTools = () => {
  const classes = useStyles()
  const [state] = useSharedState()
  const { t } = useTranslation('spendToolsRoute')
  const { eosRate = 0 } = state.eosTrasuryBalance
  const [
    {
      delegateBalance,
      formValues,
      errors,
      errorsModal,
      openModal,
      formValuesModal,
      errorMessage,
      modalData,
      openSnackbar,
      loadingSignTransaction,
      transactionsList
    },
    {
      handleInputChange,
      handleInputChangeModal,
      validateForm,
      validateFormModal,
      handleCloseModal,
      handleOpenModal,
      executeAction,
      setOpenSnackbar,
      setErrorMessage
    }
  ] = useSpendTools()

  const { to, amount, category, description } = formValues
  let { newCategory, newDescription } = formValuesModal

  useEffect(() => {
    if (!openModal) firstConcat = true
    formValuesModal.newDescription = ''
  }, [openModal])

  if (firstConcat && modalData?.description) {
    newDescription = newDescription.concat(modalData?.description)
    firstConcat = false
  }

  const handleEosTransfer = async e => {
    e.preventDefault()

    if (openModal) {
      if (Object.keys(validateFormModal(formValuesModal)).length > 0) return

      const dataAction = {
        account: state.user?.accountName,
        new_memo: `eden_expense:${newCategory}/${newDescription}`,
        tx_id: modalData?.txid
      }

      if (modalData?.digest === modalData?.txid) {
        setErrorMessage(
          'You must wait because the transaction continues without digest'
        )
      }

      await executeAction(dataAction, 'edenexplorer', 'categorize')
    } else {
      if (Object.keys(validateForm(formValues)).length > 0) return

      const dataAction = {
        from: state.user?.accountName,
        to,
        quantity: amount,
        memo: `eden_expense:${category}/${description}`
      }

      await executeAction(dataAction, 'eosio.token', 'transfer')
    }
  }

  const getTotalUSD = () =>
    `Aprox. $${
      isNaN(Number(amount.split(' ')[0]))
        ? 0
        : (Number(amount.split(' ')[0]) * eosRate).toFixed(4)
    } @ $${eosRate.toFixed(2)}/EOS`

  return (
    <div className={classes.root}>
      <SnackbarComponent
        open={openSnackbar}
        setOpen={setOpenSnackbar}
        message={t('snackbarMessage')}
        buttonMessage={t('snackbarButton')}
      />
      <Modal open={openModal} onClose={handleCloseModal}>
        <div className={classes.modalDimentions}>
          <IconButton onClick={handleCloseModal} id="close-modal-button-id">
            <img src={`${process.env.PUBLIC_URL}/icons/close.svg`} />
          </IconButton>
          <div>
            <span className={classes.titleModal}>{t('modalTitle')}</span>
          </div>
          <div className={classes.textModalContainer}>
            <span>{t('modalAbout')}</span>
          </div>
          <div>
            <strong>{t('transactionInfo')} </strong>
            <Tooltip title={modalData?.txid || ''}>
              <label>{modalData?.txid?.slice(0, 8)}...</label>
            </Tooltip>
            <br />
            <strong>{t('blockTime')} </strong>{' '}
            {new Date(modalData?.date?.split('T')[0]).toLocaleDateString()}
            <br />
            <strong>{t('action')} </strong> transfer{' '}
            <strong>{t('data')} </strong>
            {state.user?.accountName} {'->'} {modalData?.recipient}
            <br />
            <strong>{t('quantity')} </strong>
            {formatWithThousandSeparator(modalData?.amount, 4)}
            /EOS
            <br />
            <strong>Memo: </strong> {modalData?.description || t('memo')}
          </div>
          <form onSubmit={handleEosTransfer}>
            <div className={classes.formModalContainer}>
              <div className={classes.rowFormContainer}>
                <div className={classes.inputContainer}>
                  <InputLabel>{t('categoryLabel')}</InputLabel>
                  <Select
                    name="newCategory"
                    value={newCategory}
                    onChange={handleInputChangeModal}
                    type="text"
                    className={classes.selectForm}
                    error={errorsModal?.newCategory}
                  >
                    {CATEGORIES.map(category => (
                      <MenuItem key={`${category}-transfer`} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                <div className={classes.inputContainer}>
                  <InputLabel>{t('descriptionLabel')}</InputLabel>
                  <TextField
                    name="newDescription"
                    value={newDescription}
                    onChange={handleInputChangeModal}
                    type="text"
                    error={errorsModal?.newDescription}
                    fullWidth
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>
            <div className={classes.buttonContainer}>
              <br />
              <Button disabled={loadingSignTransaction} type="submit">
                {loadingSignTransaction ? (
                  <Spinner size={30} />
                ) : (
                  <span className={classes.labelButtonTransfer}>
                    {t('appendButton')}
                  </span>
                )}
              </Button>
            </div>
            <div className={classes.dangerText}>
              <small>{errorMessage}</small>
            </div>
          </form>
        </div>
      </Modal>
      <div>{t('viewAbout')}</div>
      <div className={classes.toolInformation}>{t('transferInformation')}</div>
      <form onSubmit={handleEosTransfer}>
        <div className={classes.formContainer}>
          <div className={classes.rowFormContainer}>
            <div className={classes.inputContainer}>
              <InputLabel>{t('toLabel')}</InputLabel>
              <TextField
                name="to"
                type="text"
                value={to}
                onChange={handleInputChange}
                placeholder={t('toInput')}
                error={errors?.to}
                id="outlined-error"
                autoComplete="off"
                fullWidth
              />
            </div>
            <div className={classes.specialInput}>
              <div id="labels-id">
                <label id="amount-id">{t('amountLabel')}</label>
                <label id="available-id">
                  {t('availableLabel')}:{' '}
                  {formatWithThousandSeparator(delegateBalance)}
                </label>
              </div>
              <TextField
                name="amount"
                type="text"
                value={amount}
                onChange={handleInputChange}
                placeholder="0.0000 EOS"
                fullWidth
                autoComplete="off"
                error={errors?.amount}
                helperText={getTotalUSD()}
                inputProps={{
                  pattern: '(([0-9]{1,9}.[0-9]{1,4})|([0-9]{1,9})) [E][O][S]'
                }}
              />
            </div>
          </div>
          <div className={classes.rowFormContainer}>
            <div className={classes.inputContainer}>
              <InputLabel>{t('categoryLabel')}</InputLabel>
              <Select
                name="category"
                type="text"
                value={category}
                onChange={handleInputChange}
                className={classes.selectForm}
                error={errors?.category}
                displayEmpty
                renderValue={
                  category !== ''
                    ? undefined
                    : () => (
                        <MenuItem id="placeholder-select">
                          {t('categoryInput')}
                        </MenuItem>
                      )
                }
              >
                {CATEGORIES.map(category => (
                  <MenuItem key={`${category}-categorize`} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div className={classes.inputContainer}>
              <InputLabel>{t('descriptionLabel')}</InputLabel>
              <TextField
                name="description"
                type="text"
                value={description}
                onChange={handleInputChange}
                placeholder={t('descriptionInput')}
                fullWidth
                error={errors?.description}
                autoComplete="off"
              />
            </div>
          </div>
        </div>
        <div className={classes.buttonContainer}>
          <Button
            disabled={loadingSignTransaction || eosRate === 0}
            type="submit"
          >
            {loadingSignTransaction ? (
              <Spinner size={30} />
            ) : (
              <span className={classes.labelButtonTransfer}>
                {t('transferButton')}
              </span>
            )}
          </Button>
        </div>
        <div className={classes.dangerText}>
          <small>{!openModal && errorMessage}</small>
        </div>
      </form>
      <SpendToolTableRerport
        handleOpenModal={handleOpenModal}
        transactionsList={transactionsList}
      />
    </div>
  )
}

export default memo(SpendTools)
