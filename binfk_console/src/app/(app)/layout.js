import { NavBar } from "@/components/NavBar"
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
