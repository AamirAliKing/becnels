import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface NavLink {
  href: string
  label: string
  icon?: React.ReactNode
}

interface NavLinksProps {
  className?: string
  linkClassName?: string
}

export const navLinks: NavLink[] = [
  { href: "/", label: "Dashboard" },
  { href: "/vehicles", label: "Vehicles" },
  { href: "/messages", label: "Messages" },
  { href: "/appointments", label: "Appointments" },
  { href: "/services", label: "Services" }
]

export function NavLinks({ className, linkClassName }: NavLinksProps) {
  const pathname = usePathname()

  return (
    <nav className={className}>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "text-sm transition-colors hover:text-primary",
            pathname === link.href
              ? "text-blue-600 font-semibold"
              : "text-muted-foreground",
            linkClassName
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
} 