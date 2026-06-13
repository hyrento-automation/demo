import { redirect } from 'next/navigation'

// MVP MODE: No login required — redirect straight to admin dashboard
export default function AdminLoginPage() {
  redirect('/admin')
}
