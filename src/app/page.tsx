import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import Link from 'next/link'
import { Check, ChevronRight } from 'lucide-react'

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() })

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

      <div className="min-h-screen bg-[#0a0a0a] text-white font-mono">
        {/* Nav */}
        <nav className="border-b border-[#1a1a1a] sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <span className="text-sm text-[#aaa]">
              <span className="text-[#555]">~/</span>repolog
            </span>
            <div className="flex items-center gap-4">
              <Link href="/demo" className="text-xs text-[#555] hover:text-[#aaa] transition-colors">
                demo
              </Link>
              {session ? (
                <Link
                  href="/dashboard"
                  className="px-3 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] text-green-400 rounded text-xs hover:border-green-900 transition-colors"
                >
                  → dashboard
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="px-3 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] text-[#aaa] rounded text-xs hover:border-[#444] hover:text-white transition-colors"
                >
                  sign in with github
                </Link>
              )}
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: copy */}
            <div>
              <p className="text-xs text-[#555] mb-6">
                <span className="text-green-500">✓</span> ai-powered &nbsp;·&nbsp;
                <span className="text-green-500">✓</span> bilingual &nbsp;·&nbsp;
                <span className="text-green-500">✓</span> pdf export
              </p>

              <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5 tracking-tight lowercase">
                github commits<br />
                <span className="text-[#444]">into it reports</span><br />
                <span className="text-green-400">automatically.</span>
              </h1>

              <p className="text-sm text-[#555] leading-relaxed mb-8 max-w-sm">
                stop writing reports manually. repolog reads your commit history,
                classifies your work with ai, and exports a professional pdf — in under 2 minutes.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-black rounded text-xs font-bold hover:bg-[#e5e5e5] transition-colors"
                >
                  $ get started free
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#111] border border-[#2a2a2a] text-[#666] rounded text-xs hover:border-[#444] hover:text-[#aaa] transition-colors"
                >
                  view demo →
                </Link>
              </div>

              <div className="flex gap-8">
                {[
                  { value: '< 2 min', label: 'to generate' },
                  { value: 'id / en', label: 'bilingual' },
                  { value: 'free', label: 'to use' },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-sm font-bold text-white">{s.value}</div>
                    <div className="text-xs text-[#444] mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: terminal window */}
            <div className="rounded-xl border border-[#1f1f1f] overflow-hidden bg-[#0d0d0d]">
              {/* Title bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1f1f1f] bg-[#111]">
                <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                <span className="text-xs text-[#444] ml-2">repolog — zsh</span>
              </div>
              {/* Terminal body */}
              <div className="p-5 text-xs space-y-1 leading-relaxed">
                <p className="text-[#555]"># generate monthly IT report</p>
                <p>
                  <span className="text-green-500">❯</span>{' '}
                  <span className="text-[#aaa]">repolog generate \</span>
                </p>
                <p className="text-[#aaa] pl-4">--repos my-app,api-service \</p>
                <p className="text-[#aaa] pl-4">--from 2026-06-01 --to 2026-06-28 \</p>
                <p className="text-[#aaa] pl-4">--lang id</p>
                <p className="mt-3 text-[#555]">&nbsp;</p>
                <p>
                  <span className="text-green-400">✓</span>{' '}
                  <span className="text-[#666]">connecting to github...</span>{' '}
                  <span className="text-[#444]">done</span>
                </p>
                <p>
                  <span className="text-green-400">✓</span>{' '}
                  <span className="text-[#666]">fetching commits...</span>{' '}
                  <span className="text-[#aaa]">47 commits found</span>
                </p>
                <p>
                  <span className="text-green-400">✓</span>{' '}
                  <span className="text-[#666]">classifying with AI...</span>
                </p>
                <p className="pl-4 text-[#444]">
                  features: 18 &nbsp; bugfixes: 9 &nbsp; infra: 20
                </p>
                <p>
                  <span className="text-green-400">✓</span>{' '}
                  <span className="text-[#666]">generating sections in bahasa indonesia...</span>
                </p>
                <p>
                  <span className="text-green-400">✓</span>{' '}
                  <span className="text-[#666]">exporting pdf...</span>
                </p>
                <div className="mt-3 border border-green-900/50 bg-green-950/20 rounded px-3 py-2">
                  <p className="text-green-400">report ready in 1m 38s</p>
                  <p className="text-[#555]">→ laporan-it-juni-2026.pdf</p>
                </div>
                <p className="mt-2">
                  <span className="text-green-500">❯</span>{' '}
                  <span className="animate-pulse text-[#aaa]">▌</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-[#1a1a1a] py-20" id="how-it-works">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-xs text-[#444] mb-10">
              <span className="text-[#555]">#</span> how it works
            </p>

            <div className="grid md:grid-cols-3 gap-px bg-[#1a1a1a]">
              {[
                {
                  cmd: 'git clone',
                  step: '01',
                  title: 'connect repositories',
                  desc: 'sign in with github, pick any repos, set a date range. commits are fetched instantly from your account.',
                  out: '→ 3 repos selected, 2026-06-01 to 2026-06-28',
                },
                {
                  cmd: 'ai classify',
                  step: '02',
                  title: 'ai classifies your work',
                  desc: 'claude reads each commit message, groups by feature, bug fix, or infra change, and writes a professional summary.',
                  out: '→ 47 commits classified in 12s',
                },
                {
                  cmd: 'export --pdf',
                  step: '03',
                  title: 'export it report',
                  desc: 'download a polished pdf — executive summary, system updates, future plans — ready to send to your manager or client.',
                  out: '→ laporan-it-juni-2026.pdf (84 kb)',
                },
              ].map((item) => (
                <div key={item.step} className="bg-[#0a0a0a] p-7">
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs text-green-500">$ {item.cmd}</span>
                    <span className="text-3xl font-bold text-[#1a1a1a] select-none">{item.step}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-[#555] leading-relaxed mb-4">{item.desc}</p>
                  <p className="text-xs text-[#444] border-t border-[#1a1a1a] pt-3">{item.out}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-[#1a1a1a] py-20 bg-[#0d0d0d]" id="features">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-xs text-[#444] mb-10">
              <span className="text-[#555]">#</span> features
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  flag: '--multi-repo',
                  title: 'multi-repository support',
                  desc: 'combine commits from multiple github repos into one unified report. perfect for developers working across several projects.',
                },
                {
                  flag: '--lang id|en',
                  title: 'bilingual reports',
                  desc: 'generate reports in bahasa indonesia or english. choose per report — ideal for local teams and international clients.',
                },
                {
                  flag: '--export pdf',
                  title: 'professional pdf export',
                  desc: 'clean formatted pdf with your name, position, company, and all activity — ready to send without any editing.',
                },
                {
                  flag: '--model claude',
                  title: 'ai-powered classification',
                  desc: 'claude ai categorises each commit as feature, bug fix, infra, or maintenance — then writes a human-readable summary.',
                },
                {
                  flag: '--alias "Portal"',
                  title: 'repository aliases',
                  desc: 'map raw repo names like "fe-v2-app" to readable names like "customer portal" for polished, client-ready reports.',
                },
                {
                  flag: '--preset this-month',
                  title: 'date presets & custom range',
                  desc: 'quick presets: this month, last 30 days, this year. or set a fully custom start and end date for any period.',
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="bg-[#0a0a0a] border border-[#1a1a1a] rounded p-5 group hover:border-[#2a2a2a] transition-colors"
                >
                  <p className="text-xs text-green-600 mb-3 group-hover:text-green-500 transition-colors">
                    {f.flag}
                  </p>
                  <h3 className="text-sm font-bold text-[#aaa] mb-1.5">{f.title}</h3>
                  <p className="text-xs text-[#444] leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use cases */}
        <section className="border-t border-[#1a1a1a] py-20" id="use-cases">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-xs text-[#444] mb-10">
              <span className="text-[#555]">#</span> who uses repolog
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  role: 'developer',
                  prompt: '~/dev $',
                  items: [
                    'monthly activity reports for managers',
                    'freelance project summaries for clients',
                    'personal portfolio documentation',
                    'sprint retrospective reports',
                  ],
                },
                {
                  role: 'it team',
                  prompt: '~/team $',
                  items: [
                    'weekly team progress updates',
                    'quarterly development reviews',
                    'cross-team project status reports',
                    'stakeholder-ready summaries',
                  ],
                },
                {
                  role: 'project manager',
                  prompt: '~/pm $',
                  items: [
                    'track developer output across repos',
                    'generate client-facing delivery reports',
                    'audit trail for completed features',
                    'budget justification documentation',
                  ],
                },
              ].map((uc) => (
                <div key={uc.role} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded overflow-hidden">
                  <div className="border-b border-[#1a1a1a] px-4 py-2.5 bg-[#111] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#1f1f1f]" />
                    <span className="text-xs text-[#444]">{uc.prompt}</span>
                  </div>
                  <div className="p-4 space-y-2">
                    {uc.items.map((item) => (
                      <p key={item} className="flex items-start gap-2 text-xs text-[#555]">
                        <Check size={12} className="text-green-600 flex-shrink-0 mt-0.5" />
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-[#1a1a1a] py-20 bg-[#0d0d0d]" id="faq">
          <div className="max-w-3xl mx-auto px-6">
            <p className="text-xs text-[#444] mb-10">
              <span className="text-[#555]">#</span> faq
            </p>

            <div className="space-y-2">
              {[
                {
                  q: 'is repolog free to use?',
                  a: 'yes. bring your own ai api key and repolog is completely free. add your key in settings after signing in.',
                },
                {
                  q: 'which github repositories are supported?',
                  a: 'any repository you have access to — public or private. repolog uses your github oauth token to fetch commits you authored.',
                },
                {
                  q: 'what ai model powers the report generation?',
                  a: 'repolog uses claude by anthropic to classify commits and generate content. you can provide your own anthropic api key or use a compatible openai-format provider.',
                },
                {
                  q: 'can i generate reports in indonesian?',
                  a: 'yes. repolog fully supports bahasa indonesia. choose the language per report — all sections including the executive summary are generated in your selected language.',
                },
                {
                  q: 'how long does it take to generate a report?',
                  a: 'most reports are ready in under 2 minutes. repositories with hundreds of commits may take slightly longer depending on your ai api response time.',
                },
                {
                  q: 'can i use custom project names instead of repo names?',
                  a: 'yes. set an alias per repository so the report shows "customer portal" instead of "fe-v2-customer". aliases apply to ai content and the pdf.',
                },
                {
                  q: 'is my github data stored?',
                  a: 'repolog only stores the generated report content, not raw commit data. your github access token is used only during generation and not permanently stored.',
                },
              ].map((faq) => (
                <details
                  key={faq.q}
                  className="group border border-[#1a1a1a] rounded overflow-hidden bg-[#0a0a0a]"
                >
                  <summary className="flex items-center justify-between px-4 py-3.5 cursor-pointer text-xs text-[#888] list-none select-none hover:text-[#aaa] transition-colors">
                    <span><span className="text-[#333] mr-2">?</span>{faq.q}</span>
                    <ChevronRight
                      size={14}
                      className="text-[#333] flex-shrink-0 group-open:rotate-90 transition-transform"
                    />
                  </summary>
                  <p className="px-4 pb-4 pt-2 text-xs text-[#555] leading-relaxed border-t border-[#1a1a1a]">
                    <span className="text-[#333] mr-2">&gt;</span>{faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-[#1a1a1a] py-20">
          <div className="max-w-2xl mx-auto px-6">
            {/* Terminal CTA */}
            <div className="rounded-xl border border-[#1f1f1f] overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1f1f1f] bg-[#111]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                <span className="text-xs text-[#444] ml-2">repolog — get started</span>
              </div>
              <div className="p-6 space-y-3">
                <p className="text-xs text-[#555]"># automate your it reports today</p>
                <p className="text-xs text-[#aaa]">
                  <span className="text-green-500">❯</span> repolog init --github
                </p>
                <p className="text-xs text-[#555]">connecting to github oauth...</p>
                <p className="text-xs text-[#555]">setting up your profile...</p>
                <p className="text-xs text-[#555]">generating your first report...</p>
                <div className="border-t border-[#1a1a1a] pt-4 mt-4 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/login"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-white text-black rounded text-xs font-bold hover:bg-[#e5e5e5] transition-colors"
                  >
                    $ sign in with github
                  </Link>
                  <Link
                    href="/demo"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-5 py-2.5 border border-[#2a2a2a] text-[#555] rounded text-xs hover:border-[#444] hover:text-[#aaa] transition-colors"
                  >
                    view demo first →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#1a1a1a] py-8">
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#333]">
              © {new Date().getFullYear()} repolog — built for developers
            </p>
            <div className="flex items-center gap-6 text-xs text-[#333]">
              <Link href="/demo" className="hover:text-[#666] transition-colors">demo</Link>
              <Link href="/login" className="hover:text-[#666] transition-colors">sign in</Link>
              <a
                href="https://github.com/jaffrantirta/repolog"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#666] transition-colors"
              >
                github
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
