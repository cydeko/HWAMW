import { redirect } from 'next/navigation'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ pid?: string }>
}) {
  const { pid } = await searchParams

  if (!pid) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-stone-950 text-stone-300 px-6">
        <div className="max-w-md text-center space-y-6">
          <h1 className="text-2xl font-serif text-stone-100">
            The House with a Million Windows
          </h1>
          <p className="text-stone-400 text-sm leading-relaxed">
            This experience is accessed via a personal study link. If you have
            been invited to participate, please use the link provided to you.
          </p>
        </div>
      </main>
    )
  }

  redirect(`/study?pid=${pid}`)
}
