import Link from "next/link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-grid px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="text-lg font-bold text-brand-blue">
            RE/MAX <span className="text-brand-red">Radial</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/imoveis">Imóveis</Link>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 flex-col">{children}</main>

      <footer className="border-t border-grid px-6 py-8 text-sm text-foreground-secondary">
        <div className="mx-auto flex max-w-5xl flex-col gap-1">
          <span className="font-semibold text-foreground">RE/MAX Radial</span>
          <span>Agência 12116 · Odivelas</span>
        </div>
      </footer>
    </div>
  );
}
