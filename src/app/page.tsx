import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import Link from 'next/link'
import { GitCommit, FileText, Zap, Download, Globe, ChevronRight, Check } from 'lucide-react'

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session) redirect('/dashboard')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Repolog',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    description:
      'Convert GitHub commit history into professional IT development reports using AI. Supports Indonesian and English, with PDF export.',
    url: 'https://repolog.jaffran.my.id',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    featureList: [
      'AI-powered commit classification',
      'Professional PDF export',
      'Bilingual support (Indonesian & English)',
      'Multi-repository support',
      'Custom date ranges',
      'Developer profile',
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[#0a0a0a] text-white">
        {/* Nav */}
        <nav className="border-b border-[#1a1a1a] sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <span className="font-bold text-lg tracking-tight">repolog</span>
            <div className="flex items-center gap-3">
              <Link href="/demo" className="text-sm text-[#888] hover:text-white transition-colors">
                Demo
              </Link>
              <Link
                href="/login"
                className="px-4 py-1.5 bg-white text-black rounded-lg text-sm font-semibold hover:bg-[#e5e5e5] transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-4 py-1.5 text-sm text-[#888] mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
            AI-powered · Bilingual · PDF export
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-tight mb-6">
            GitHub commits into
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#666]">
              professional IT reports
            </span>
          </h1>

          <p className="text-xl text-[#666] max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop spending hours writing development reports manually. Repolog reads your commit
            history, classifies your work with AI, and generates a professional PDF report — in
            minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-black rounded-xl font-semibold text-sm hover:bg-[#e5e5e5] transition-colors"
            >
              Start for free <ChevronRight size={16} />
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#111] border border-[#2a2a2a] text-[#aaa] rounded-xl font-semibold text-sm hover:border-[#444] hover:text-white transition-colors"
            >
              See live demo
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[
              { value: '< 2 min', label: 'Average generation time' },
              { value: '2 lang', label: 'Indonesian & English' },
              { value: '100%', label: 'Free to use' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-[#555] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-[#1a1a1a] py-24" id="how-it-works">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#555] mb-3">
                How it works
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold">From commits to report in 3 steps</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: '01',
                  icon: <GitCommit size={22} />,
                  title: 'Connect your repositories',
                  desc: 'Sign in with GitHub, pick any repositories you worked on, and set a date range. Repolog fetches your commits instantly.',
                },
                {
                  step: '02',
                  icon: <Zap size={22} />,
                  title: 'AI classifies your work',
                  desc: 'Claude AI reads each commit, groups them by feature, bug fix, or improvement, and writes a professional summary of your development activity.',
                },
                {
                  step: '03',
                  icon: <Download size={22} />,
                  title: 'Export your IT report',
                  desc: 'Download a polished PDF report — complete with executive summary, system updates, and future plans — ready to send to your manager or client.',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="relative bg-[#111] border border-[#1f1f1f] rounded-2xl p-7"
                >
                  <div className="text-5xl font-bold text-[#1f1f1f] absolute top-5 right-6 select-none">
                    {item.step}
                  </div>
                  <div className="w-10 h-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl flex items-center justify-center text-[#888] mb-5">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-[#555] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-[#1a1a1a] py-24 bg-[#0d0d0d]" id="features">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#555] mb-3">
                Features
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold">Everything you need</h2>
              <p className="text-[#555] mt-4 max-w-lg mx-auto">
                Built specifically for developers and IT teams who need to report their work quickly
                and professionally.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {[
                {
                  icon: <GitCommit size={18} />,
                  title: 'Multi-repository support',
                  desc: 'Combine commits from multiple GitHub repositories into a single unified report. Perfect for developers working across several projects.',
                },
                {
                  icon: <Globe size={18} />,
                  title: 'Bilingual reports',
                  desc: 'Generate reports in Bahasa Indonesia or English. Choose your language at generation time — ideal for local IT teams and international clients.',
                },
                {
                  icon: <FileText size={18} />,
                  title: 'Professional PDF export',
                  desc: 'Download a clean, formatted PDF with your name, position, company, and all development activities — ready to hand off without editing.',
                },
                {
                  icon: <Zap size={18} />,
                  title: 'AI-powered classification',
                  desc: 'Claude AI categorizes each commit as a feature, bug fix, infrastructure change, or maintenance — then writes a human-readable summary.',
                },
                {
                  icon: <ChevronRight size={18} />,
                  title: 'Repository aliases',
                  desc: 'Map technical repo names (like "fe-v2-app") to readable project names ("Customer Portal") so your reports look polished.',
                },
                {
                  icon: <Download size={18} />,
                  title: 'Custom date ranges & presets',
                  desc: 'Use quick presets — this month, last 30 days, this year — or set a custom range to cover any reporting period.',
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="flex gap-4 bg-[#111] border border-[#1f1f1f] rounded-2xl p-6"
                >
                  <div className="w-9 h-9 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg flex items-center justify-center text-[#666] flex-shrink-0 mt-0.5">
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1.5">{f.title}</h3>
                    <p className="text-sm text-[#555] leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Who it's for */}
        <section className="border-t border-[#1a1a1a] py-24" id="use-cases">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#555] mb-3">
                Use cases
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold">Who uses Repolog?</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  title: 'Individual developers',
                  items: [
                    'Monthly activity reports for managers',
                    'Freelance project summaries for clients',
                    'Personal portfolio documentation',
                    'Sprint retrospective reports',
                  ],
                },
                {
                  title: 'IT teams',
                  items: [
                    'Weekly team progress updates',
                    'Quarterly development reviews',
                    'Cross-team project status reports',
                    'Stakeholder-ready summaries',
                  ],
                },
                {
                  title: 'Project managers',
                  items: [
                    'Track developer output across repos',
                    'Generate client-facing delivery reports',
                    'Audit trail for completed features',
                    'Budget justification documentation',
                  ],
                },
              ].map((uc) => (
                <div
                  key={uc.title}
                  className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6"
                >
                  <h3 className="font-semibold text-white mb-4">{uc.title}</h3>
                  <ul className="space-y-2.5">
                    {uc.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-[#666]">
                        <Check size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-[#1a1a1a] py-24 bg-[#0d0d0d]" id="faq">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#555] mb-3">
                FAQ
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold">Frequently asked questions</h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: 'Is Repolog free to use?',
                  a: 'Yes. You can use Repolog with your own AI API key at no cost. Simply add your API key in Settings after signing in.',
                },
                {
                  q: 'Which GitHub repositories are supported?',
                  a: 'Any repository you have access to on GitHub — public or private. Repolog uses your GitHub OAuth token to fetch commits you committed to.',
                },
                {
                  q: 'What AI model powers the report generation?',
                  a: 'Repolog uses Claude (by Anthropic) to classify commits and generate the report content. You can provide your own Anthropic API key or use a compatible provider.',
                },
                {
                  q: 'Can I generate reports in Indonesian?',
                  a: 'Yes. Repolog fully supports Bahasa Indonesia. You can choose the language when creating each report — all sections including the executive summary are generated in your chosen language.',
                },
                {
                  q: 'How long does it take to generate a report?',
                  a: 'Most reports are ready in under 2 minutes, depending on the number of commits in the selected date range. Reports with hundreds of commits may take slightly longer.',
                },
                {
                  q: 'Can I use custom project names instead of repository names?',
                  a: 'Yes. You can set an alias for each repository so the report shows a friendly project name (e.g., "Customer Portal") instead of the raw GitHub repo name (e.g., "fe-v2-customer").',
                },
                {
                  q: 'Is my GitHub data stored?',
                  a: 'Repolog only stores the generated report content, not the raw commit data. Your GitHub access token is used only during report generation and is not stored permanently.',
                },
              ].map((faq) => (
                <details
                  key={faq.q}
                  className="group bg-[#111] border border-[#1f1f1f] rounded-xl overflow-hidden"
                >
                  <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-medium text-white list-none select-none hover:bg-[#161616] transition-colors">
                    {faq.q}
                    <ChevronRight
                      size={16}
                      className="text-[#555] flex-shrink-0 group-open:rotate-90 transition-transform"
                    />
                  </summary>
                  <p className="px-5 pb-4 text-sm text-[#666] leading-relaxed border-t border-[#1f1f1f] pt-4">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-[#1a1a1a] py-24">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-5">
              Ready to automate your IT reports?
            </h2>
            <p className="text-[#666] text-lg mb-10">
              Sign in with GitHub and generate your first report in under 2 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black rounded-xl font-semibold hover:bg-[#e5e5e5] transition-colors"
              >
                Get started free <ChevronRight size={16} />
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#111] border border-[#2a2a2a] text-[#aaa] rounded-xl font-semibold hover:border-[#444] hover:text-white transition-colors"
              >
                View demo first
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#1a1a1a] py-10">
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-[#444]">
              © {new Date().getFullYear()} Repolog. Built for developers.
            </div>
            <div className="flex items-center gap-6 text-sm text-[#444]">
              <Link href="/demo" className="hover:text-white transition-colors">
                Demo
              </Link>
              <Link href="/login" className="hover:text-white transition-colors">
                Sign in
              </Link>
              <a
                href="https://github.com/jaffrantirta/repolog"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
