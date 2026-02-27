import "./globals.css"

export const metadata = {
  title: "tconsole",          
  description: "Theracues internal console for project management, sample tracking etc.",
  icons: {
    icon: "/favicon.ico",      
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    }
  }
}

export const viewport = {
  width: 1280,         
  initialScale: 1,
  maximumScale:1,       
  userScalable: false
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="appWrapper">
          <main className="appContent">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}