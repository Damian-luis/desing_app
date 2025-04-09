import { Header } from '@/components/ui/Header'
import { Navbar } from '@/components/ui/Navbar'
import { AuthProvider } from '@/context/AuthContext'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <Header />
        <Navbar />
        
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </AuthProvider>
  )
}