import { createRoot } from 'react-dom/client'
import Window from './gui/window'
import { BaseStyles, ThemeProvider } from '@primer/react'

import '@primer/primitives/dist/css/functional/themes/light.css'

const root = createRoot(document.body)
root.render(
  <ThemeProvider>
    <BaseStyles>
      <Window />
    </BaseStyles>
  </ThemeProvider>,
)
