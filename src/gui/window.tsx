import { ThemeProvider, BaseStyles } from '@primer/react'

const Window: React.FC = () => {
  return (
    <ThemeProvider>
      <BaseStyles>
        <div>Github Panel</div>
      </BaseStyles>
    </ThemeProvider>
  )
}

export default Window
