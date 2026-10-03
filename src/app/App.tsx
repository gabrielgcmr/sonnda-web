// src/app/App.tsx
import AppProviders from './providers/AppProviders'
import ThemeProvider from './providers/ThemeProvider'
import AppRouter from './router'

function App() {
  return (
    <ThemeProvider>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </ThemeProvider>
  )
}

export default App
