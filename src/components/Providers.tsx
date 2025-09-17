'use client'

import '../lib/i18n-client'
import { I18nextProvider } from 'react-i18next'
import i18n from '../lib/i18n-client'
import { LocaleUpdater } from './LocaleUpdater'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <LocaleUpdater />
      {children}
    </I18nextProvider>
  )
}
