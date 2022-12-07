import React, { Suspense, useEffect, useMemo } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { StylesProvider, createGenerateClassName } from '@mui/styles'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import '@edenia/ui-kit/dist/index.css'
import ReactGA from 'react-ga'

import useTresuryBalanceState from './hooks/customHooks/useTresuryBalanceState'
import routes from './routes'
import Loader from './components/Loader'
import DashboardLayout from './layouts/Dashboard'
import { useSharedState } from './context/state.context'
import getTheme from './theme'
import './i18n'

const TRACKING_ID = 'G-3MY19MHQWY'

ReactGA.initialize(TRACKING_ID)

const generateClassName = createGenerateClassName({
  productionPrefix: 'eosSpendExplorer'
})

const App = () => {
  const [state, { setEOSTrasuryBalance }] = useSharedState()
  const [{ eosRate, currencyBalance, nextEdenDisbursement }] =
    useTresuryBalanceState()
  const theme = useMemo(() => getTheme(state.useDarkMode), [state.useDarkMode])
  const userRoutes = useMemo(
    () => routes(state?.user?.accountName ? 'member' : 'guest'),
    [state?.user]
  )

  const renderRoute = ({ component: Component, ...route }, index) => (
    <Route
      key={`path-${route.path}-${index}`}
      path={route.path}
      exact={route.exact}
      element={<Component />}
    />
  )

  useEffect(() => {
    setEOSTrasuryBalance({
      eosRate,
      currencyBalance,
      nextEdenDisbursement
    })
  }, [eosRate, currencyBalance, nextEdenDisbursement])

  return (
    <BrowserRouter>
      <StylesProvider generateClassName={generateClassName}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DashboardLayout routes={userRoutes.sidebar}>
              <Suspense fallback={<Loader />}>
                <Routes>
                  {userRoutes.browser.map(renderRoute)}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </DashboardLayout>
          </LocalizationProvider>
        </ThemeProvider>
      </StylesProvider>
    </BrowserRouter>
  )
}

export default App
