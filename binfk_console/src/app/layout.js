
import "./globals.css"

export const metadata = {
  title: "tconsole",          
  description: "tconsole web app for managing projects",
  icons: {
    icon: "/favicon.ico",      
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
