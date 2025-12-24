export const metadata = {
  title: 'Sanity Studio',
  description: 'Sanity Studio for IFYBEST',
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}