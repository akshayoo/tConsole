import { NavBar } from "@/components/GNavBar"
import "./globals.css"

export default function AppLayout({ children }) {
  return (
    <div className="appWrapper">
        <NavBar />
        <main className="appContent">
          {children}
        </main>
    </div>
  )
}
