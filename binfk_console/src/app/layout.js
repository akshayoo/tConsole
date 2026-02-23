
import "./globals.css"

export const metadata = {
  title: "tconsole",          
  description: "Your app description here",
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
