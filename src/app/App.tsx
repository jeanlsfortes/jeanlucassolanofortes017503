import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter } from 'react-router-dom'
import { useState } from 'react'
import AppRoutes from '@/routes'
import HealthCheck from '@/components/shared/HealthCheck/HealthCheck'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {
  const [enableDevtools] = useState(
    import.meta.env.VITE_ENABLE_DEVTOOLS === 'true'
  )

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      {enableDevtools && <ReactQueryDevtools initialIsOpen={false} />}
      <HealthCheck devOnly={true} pollingInterval={30000} />
    </QueryClientProvider>
  )
}

export default App

