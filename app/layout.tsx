import './globals.css'

export const metadata = {
  title: 'Email Workflow',
  description: 'Send referral emails via workflow automation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
