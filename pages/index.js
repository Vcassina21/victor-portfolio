import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useRef, useState, useCallback } from 'react'
import { META, HERO, BIO, COMPETENCES, EXPERIENCES, PROJETS, CONTACT } from '../contenu'

// ── Scroll reveal ─────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const siblings = [...e.target.parentElement.querySelectorAll('.reveal:not(.visible)')]
          const idx = siblings.indexOf(e.target)
          setTimeout(() => e.target.classList.add('visible'), idx * 80)
          io.unobserve(e.target)
        }
      })
    }, { threshold: 0.12 })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

// ── Compteur animé ────────────────────────────────────────────
function Counter({ target }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)
  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const steps = 40
        const increment = target / steps
        let current = 0
        const timer = setInterval(() => {
          current += increment
          if (current >= target) { setCount(target); clearInterval(timer) }
          else setCount(Math.floor(current))
        }, 1400 / steps)
      }
    }, { threshold: 0.5 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [target])
  return <span ref={ref}>{count}</span>
}

// ── Carte compétence accordéon ────────────────────────────────
function SkillCard({ competence }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`skill-card${open ? ' open' : ''}`} onClick={() => setOpen(!open)}>
      <div className="skill-header">
        <div className="skill-header-left">
          <span className="skill-badge">{competence.badge}</span>
          <h3>{competence.titre}</h3>
        </div>
        <div className="skill-toggle">+</div>
      </div>
      <div className="skill-body">
        <div className="skill-body-inner">
          <div className="skill-row">
            <p className="skill-row-label">🎓 Acquis IUT</p>
            <p>{competence.acquis}</p>
            <p className="skill-detail" dangerouslySetInnerHTML={{ __html: competence.acquis_detail }} />
            <div className="iut-pills">
              {competence.pills.map(p => <span key={p} className="iut-pill">{p}</span>)}
            </div>
          </div>
          <div className="skill-row">
            <p className="skill-row-label">📈 Lien Finance</p>
            <p>{competence.finance}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── 5 raisons teaser ─────────────────────────────────────
const RAISONS = [
  { num: '01', label: 'Stratégie de contenu' },
  { num: '02', label: 'Gestion de communauté' },
  { num: '03', label: 'Expérience terrain réelle' },
  { num: '04', label: 'Maîtrise des réseaux sociaux' },
  { num: '05', label: 'Veille & intelligence stratégique' },
]

function RaisonsTeaser() {
  const [active, setActive] = useState(0)
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  // Apparaît au scroll
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); io.disconnect() }
    }, { threshold: 0.3 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])

  // Défilement automatique toutes les 2s
  useEffect(() => {
    if (!visible) return
    const t = setInterval(() => setActive(a => (a + 1) % RAISONS.length), 2000)
    return () => clearInterval(t)
  }, [visible])

  const scrollToContent = () => {
    document.getElementById('bio')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div ref={ref} className={`raisons-teaser${visible ? ' raisons-visible' : ''}`} onClick={scrollToContent}>
      <div className="raisons-inner">
        <span className="raisons-label">5 raisons de me recruter</span>
        <div className="raisons-track">
          {RAISONS.map((r, i) => (
            <div key={i} className={`raison-item${i === active ? ' raison-active' : ''}`}>
              <span className="raison-num">{r.num}</span>
              <span className="raison-title">{r.label}</span>
            </div>
          ))}
        </div>
        <div className="raisons-dots">
          {RAISONS.map((_, i) => (
            <button key={i} className={`raison-dot${i === active ? ' raison-dot-active' : ''}`} onClick={e => { e.stopPropagation(); setActive(i) }} />
          ))}
        </div>
        <span className="raisons-scroll">↓ Scroll pour découvrir</span>
      </div>
    </div>
  )
}

// ── Carte projet accordéon ────────────────────────────────
function ProjetCard({ projet }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="projet-card reveal">
      {projet.image && (
        <div className="projet-img-wrap">
          <img src={projet.image} alt={projet.titre} className="projet-img" />
          <div className="projet-overlay">
            <span className="projet-overlay-titre">{projet.titre}</span>
            <div className="projet-overlay-outils">
              {(projet.outils || []).map(o => (
                <span key={o} className="projet-overlay-tag">{o}</span>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="projet-top" style={{ borderTop: `4px solid ${projet.couleur}` }}>
        <div className="projet-meta">
          <span className="projet-annee">{projet.annee}</span>
          <span className="projet-tag" style={{ color: projet.couleur, background: `${projet.couleur}18` }}>{projet.tag}</span>
        </div>
        <h3 className="projet-titre">{projet.titre}</h3>
        <p className="projet-resume">{projet.intro}</p>
        <button
          className={`projet-toggle${open ? ' open' : ''}`}
          style={{ color: projet.couleur, borderColor: projet.couleur }}
          onClick={() => setOpen(!open)}
        >
          {open ? 'Réduire' : 'Voir le détail'} <span>{open ? '↑' : '↓'}</span>
        </button>
      </div>
      <div className={`projet-accordion${open ? ' open' : ''}`}>
        <div className="projet-bottom">
          <p className="projet-section-label">Productions réalisées</p>
          <ul className="projet-list">
            {projet.productions.map((p, j) => (
              <li key={j} className="projet-list-item">
                <span className="projet-dot" style={{ background: projet.couleur }} />
                {p}
              </li>
            ))}
          </ul>
          <div className="projet-competences">
            {projet.competences.map(c => <span key={c} className="projet-comp-pill">{c}</span>)}
          </div>
          <div className="projet-resultat" style={{ borderLeft: `2px solid ${projet.couleur}` }}>
            <span className="projet-resultat-label">✓ Résultat</span>
            <p>{projet.resultat}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Effet Typing ─────────────────────────────────────────
const TYPING_WORDS = ['@Fintech', '@Web3', '@Néo-banque']

function TypingWord() {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = TYPING_WORDS[wordIndex]
    let timeout

    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80)
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 1800)
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45)
    } else if (deleting && displayed.length === 0) {
      setDeleting(false)
      setWordIndex((wordIndex + 1) % TYPING_WORDS.length)
    }
    return () => clearTimeout(timeout)
  }, [displayed, deleting, wordIndex])

  return (
    <span className="typing-word">
      {displayed}<span className="typing-cursor">|</span>
    </span>
  )
}

// ── Block Explorer Timeline ───────────────────────────────
function BlockExplorer({ experiences }) {
  const [selected, setSelected] = useState(null)
  const hashes = useRef(
    experiences.map(() => '0x' + Array.from({length: 8}, () => Math.floor(Math.random()*16).toString(16)).join(''))
  ).current

  return (
    <div className="block-explorer">
      <div className="be-header">
        <span>Block</span>
        <span>Transaction</span>
        <span className="be-hide-sm">Période</span>
        <span>Status</span>
      </div>
      {experiences.map((exp, i) => (
        <div key={i} className="be-entry">
          <div
            className={`be-row${selected === i ? ' be-row-open' : ''}`}
            onClick={() => setSelected(selected === i ? null : i)}
          >
            <span className="be-num">#{String(experiences.length - i).padStart(2,'0')}</span>
            <div className="be-main">
              <span className="be-hash">{hashes[i]}</span>
              <span className="be-titre">{exp.titre} <span className="be-arrow">{selected === i ? '▲' : '▼'}</span></span>
            </div>
            <span className="be-period be-hide-sm">{exp.annee}</span>
            <span className={`be-status ${exp.note ? 'be-pending' : 'be-done'}`}>
              {exp.note ? '⏳ En cours' : '✓ Terminé'}
            </span>
          </div>
          {selected === i && (
            <div className="be-modal">
              <button className="be-close" onClick={(e) => { e.stopPropagation(); setSelected(null) }}>✕ Fermer</button>
              <div className="be-modal-inner">
                <div className="be-modal-row"><span className="be-field">TX Hash</span><span className="be-value be-mono">{hashes[i]}</span></div>
                <div className="be-modal-row"><span className="be-field">Poste</span><span className="be-value">{exp.titre}</span></div>
                <div className="be-modal-row"><span className="be-field">Status</span><span className={`be-value ${exp.note ? 'be-pending' : 'be-done'}`}>{exp.note ? '⏳ En cours' : '✓ Confirmed'}</span></div>
                <div className="be-modal-row"><span className="be-field">Période</span><span className="be-value">{exp.annee} {exp.note || ''}</span></div>
                <div className="be-modal-row"><span className="be-field">Type</span><span className="be-value">{exp.tag}</span></div>
                <div className="be-modal-row"><span className="be-field">Description</span><p className="be-value be-desc">{exp.description}</p></div>
                {exp.highlight && <div className="be-modal-row"><span className="be-field">Résultat</span><p className="be-value be-highlight-val">{exp.highlight}</p></div>}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ── Terminal Easter Egg ───────────────────────────────────
const TERMINAL_COMMANDS = {
  help: () => `Commandes disponibles :\n  help     → affiche cette aide\n  whoami   → manifeste de Victor\n  hire     → envoyer une proposition\n  clear    → vider le terminal`,
  whoami: () => `> Victor Cassina\n> Communicant · Web3 natif · Fintech enthusiast\n> "Je ne fais pas de la communication.\n>  Je construis des ponts entre des idées\n>  complexes et des humains curieux."\n> — vcassina.com`,
  hire: () => `HIRE_REQUEST_SENT ✓\n> Redirection vers le contact...`,
  clear: () => '__CLEAR__',
}

function Terminal({ onHire }) {
  const [open, setOpen] = useState(false)
  const [lines, setLines] = useState(['Bienvenue. Tape "help" pour commencer.'])
  const [input, setInput] = useState('')
  const endRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setOpen(o => !o) }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [lines])

  const run = (cmd) => {
    const trimmed = cmd.trim().toLowerCase()
    const fn = TERMINAL_COMMANDS[trimmed]
    if (!fn) {
      setLines(l => [...l, `$ ${cmd}`, `Commande inconnue: "${trimmed}". Tape "help".`])
    } else {
      const result = fn()
      if (result === '__CLEAR__') { setLines(['Terminal vidé.']); return }
      if (trimmed === 'hire') {
        setLines(l => [...l, `$ ${cmd}`, result])
        setTimeout(() => { setOpen(false); onHire() }, 1200)
      } else {
        setLines(l => [...l, `$ ${cmd}`, result])
      }
    }
  }

  if (!open) return (
    <button className="terminal-btn" onClick={() => setOpen(true)} title="Ouvrir le terminal (Ctrl+K)">
      &gt;_
    </button>
  )

  return (
    <div className="terminal-overlay" onClick={() => setOpen(false)}>
      <div className="terminal-box" onClick={e => e.stopPropagation()}>
        <div className="terminal-bar">
          <span className="t-dot t-red" /><span className="t-dot t-yellow" /><span className="t-dot t-green" />
          <span className="terminal-title">vcassina ~ terminal</span>
          <button className="terminal-close" onClick={() => setOpen(false)}>✕</button>
        </div>
        <div className="terminal-body">
          {lines.map((l, i) => <pre key={i} className="terminal-line">{l}</pre>)}
          <div ref={endRef} />
        </div>
        <div className="terminal-input-row">
          <span className="terminal-prompt">~$</span>
          <input
            className="terminal-input" autoFocus value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && input.trim()) { run(input); setInput('') } }}
            placeholder="tape une commande..."
          />
        </div>
      </div>
    </div>
  )
}

// ── Audit Playground ──────────────────────────────────────
const AUDIT_SAMPLES = {
  Clarté: {
    input: "La tokenisation des actifs sous-jacents via des protocoles de smart contracts décentralisés permet une liquidité accrue des marchés de capitaux traditionnellement illiquides.",
    output: "Grâce à la blockchain, on peut maintenant acheter et vendre des parts de biens immobiliers ou d'œuvres d'art aussi facilement qu'une action en bourse."
  },
  Punchy: {
    input: "Notre solution de néo-banque propose une offre de services financiers innovants destinée aux populations non bancarisées dans les marchés émergents.",
    output: "On donne accès à la banque à ceux que les banques ont oubliés. Pas de paperasse. Pas de minimum. Juste un téléphone. 🌍"
  },
  'Gen Z': {
    input: "Notre application mobile permet d'effectuer des virements internationaux avec des frais réduits par rapport aux systèmes bancaires traditionnels.",
    output: "POV : t'envoies de l'argent à l'autre bout du monde et ça coûte moins cher qu'un café ☕ Fini les frais cachés, fini les délais. Ta banque elle fait ça ? 👀 #Fintech #GenZ #MoneyTips"
  }
}

function AuditPlayground() {
  const [mode, setMode] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState(null)

  const runAudit = (m) => {
    setMode(m); setResult(null); setScanning(true)
    setTimeout(() => { setScanning(false); setResult(AUDIT_SAMPLES[m]) }, 1800)
  }

  return (
    <div className="audit-wrap reveal">
      <div className="audit-intro">
        <p className="audit-tagline">Test en direct · Vulgarisation</p>
        <h3 className="audit-title">Transformez n&apos;importe quel texte technique</h3>
        <p className="audit-sub">Sélectionnez un mode pour voir comment j&apos;adapte un message à son audience.</p>
      </div>
      <div className="audit-modes">
        {Object.keys(AUDIT_SAMPLES).map(m => (
          <button key={m} className={`audit-mode-btn${mode === m ? ' active' : ''}`} onClick={() => runAudit(m)}>
            {m === 'Clarté' ? '🔍 Clarté' : m === 'Punchy' ? '⚡ Punchy' : '📱 Gen Z'}
          </button>
        ))}
      </div>
      {mode && (
        <div className="audit-panels">
          <div className="audit-panel audit-before">
            <span className="audit-panel-label">Avant — Jargon</span>
            <p className="audit-text">{AUDIT_SAMPLES[mode].input}</p>
          </div>
          <div className="audit-arrow">→</div>
          <div className="audit-panel audit-after">
            <span className="audit-panel-label">Après — {mode}</span>
            {scanning ? (
              <div className="audit-scanning">
                <span className="audit-scan-dot" /><span className="audit-scan-dot" /><span className="audit-scan-dot" />
                <span className="audit-scan-text">Analyse en cours...</span>
              </div>
            ) : result ? (
              <p className="audit-text audit-result">{result.output}</p>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Dashboard Analytics ───────────────────────────────────
function useDashboardAnim(target, duration = 1200) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1)
        setVal(Math.round(p * target))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.3 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [target, duration])
  return [val, ref]
}

const CHART_DATA = [
  { label: 'Jan', before: 12, after: 28 },
  { label: 'Fév', before: 15, after: 35 },
  { label: 'Mar', before: 10, after: 42 },
  { label: 'Avr', before: 18, after: 51 },
  { label: 'Mai', before: 14, after: 47 },
  { label: 'Jun', before: 20, after: 63 },
]

function DashboardAnalytics() {
  const [engage, engageRef] = useDashboardAnim(63)
  const [reach, reachRef] = useDashboardAnim(12400)
  const [growth, growthRef] = useDashboardAnim(247)
  const maxVal = Math.max(...CHART_DATA.map(d => d.after))

  return (
    <div className="dash-wrap reveal">
      {/* KPI Cards */}
      <div className="dash-kpis">
        <div className="dash-kpi" ref={engageRef}>
          <span className="dash-kpi-label">Taux d'engagement</span>
          <span className="dash-kpi-val">{engage}<span className="dash-kpi-unit">%</span></span>
          <span className="dash-kpi-sub">↑ +34% vs moyenne secteur</span>
        </div>
        <div className="dash-kpi" ref={reachRef}>
          <span className="dash-kpi-label">Portée mensuelle</span>
          <span className="dash-kpi-val">{reach.toLocaleString('fr')}<span className="dash-kpi-unit"> vues</span></span>
          <span className="dash-kpi-sub">↑ Croissance organique</span>
        </div>
        <div className="dash-kpi" ref={growthRef}>
          <span className="dash-kpi-label">Croissance communauté</span>
          <span className="dash-kpi-val">+{growth}<span className="dash-kpi-unit">%</span></span>
          <span className="dash-kpi-sub">↑ Sur 6 mois glissants</span>
        </div>
      </div>

      {/* Chart */}
      <div className="dash-chart-wrap">
        <div className="dash-chart-header">
          <span className="dash-chart-title">Engagement par mois</span>
          <div className="dash-legend">
            <span className="dash-legend-item"><span className="dash-dot dash-dot-before" />Sans stratégie</span>
            <span className="dash-legend-item"><span className="dash-dot dash-dot-after" />Avec ma stratégie</span>
          </div>
        </div>
        <div className="dash-chart">
          {CHART_DATA.map((d, i) => (
            <div key={i} className="dash-bar-group">
              <div className="dash-bars">
                <div className="dash-bar dash-bar-before" style={{ height: `${(d.before / maxVal) * 100}%` }}>
                  <span className="dash-bar-tip">{d.before}%</span>
                </div>
                <div className="dash-bar dash-bar-after" style={{ height: `${(d.after / maxVal) * 100}%`, animationDelay: `${i * 0.08}s` }}>
                  <span className="dash-bar-tip dash-bar-tip-after">{d.after}%</span>
                </div>
              </div>
              <span className="dash-bar-label">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="dash-disclaimer">* Données simulées basées sur les moyennes du secteur Fintech/SaaS (Source : Hootsuite 2024)</p>
    </div>
  )
}

// ── Infinite scroll tags ──────────────────────────────────
const TAGS = [
  'Copywriting Web3', 'Stratégie Social Ads', 'Vulgarisation Crypto',
  'Content Design', 'Community Management', 'Gestion de crise',
  'Personal Branding', 'Social Listening', 'Planning Éditorial',
  'Brand Voice', 'Identité Visuelle', 'Growth Content',
  'Storytelling Fintech', 'Veille Stratégique', 'UGC & Influence',
]

function InfiniteTagsBar() {
  return (
    <div className="tags-bar">
      <div className="tags-track">
        {[...TAGS, ...TAGS, ...TAGS].map((tag, i) => (
          <span key={i} className="tags-item">
            <span className="tags-dot" />
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Page principale ───────────────────────────────────────────
export default function Home() {
  useReveal()

  // Scroll tout en haut au chargement
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Mode sombre
  const [dark, setDark] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])

  // Barre de progression lecture
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Bouton retour en haut
  const [showTop, setShowTop] = useState(false)
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Toast email copié
  const [toast, setToast] = useState(false)
  const copyEmail = useCallback((e) => {
    e.preventDefault()
    navigator.clipboard.writeText(CONTACT.email)
    setToast(true)
    setTimeout(() => setToast(false), 2500)
  }, [])

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <Head>
        <title>{META.titre}</title>
        <meta name="description" content={META.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* TERMINAL */}
      <Terminal onHire={scrollToContact} />

      {/* BARRE DE PROGRESSION */}
      <div className="read-progress" style={{ width: `${progress}%` }} />


      {/* TOAST */}
      <div className={`toast${toast ? ' toast-visible' : ''}`}>✅ &nbsp;Email copié dans le presse-papier !</div>

      {/* BOUTON RETOUR EN HAUT */}
      {showTop && (
        <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Retour en haut">
          ↑
        </button>
      )}


      {/* NAV */}
      <nav className="nav">
        <div className="nav-inner">
          <span className="nav-logo">Victor <span>Cassina</span></span>
          <ul className="nav-links">
            <li><a href="#bio">Mon Profil</a></li>
            <li><a href="#competences">Mes Compétences</a></li>
            <li><a href="#projets">Mes Réalisations</a></li>
            <li><a href="#experience">Mon Parcours</a></li>
            <li><a href="#contact">Me Recruter</a></li>
          </ul>
          <button className="dark-toggle" onClick={() => setDark(!dark)} aria-label="Mode sombre">
            {dark ? '☀️' : '🌙'}
          </button>
          <button className="nav-burger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
        {menuOpen && (
          <div className="nav-mobile-menu">
            {['bio','competences','projets','experience','contact'].map(id => (
              <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>
                {id === 'bio' ? 'Mon Profil' : id === 'competences' ? 'Mes Compétences' : id === 'projets' ? 'Mes Réalisations' : id === 'experience' ? 'Mon Parcours' : 'Me Recruter'}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-blob blob1" />
          <div className="hero-blob blob2" />
          <div className="hero-blob blob3" />
        </div>
        <div className="container">
          <div className="hero-inner">
            <div className="hero-text">
              <div className="hero-available">
                <span className="available-dot" />
                Disponible pour une alternance
              </div>
              <p className="hero-eyebrow">{HERO.eyebrow}</p>
              <h1 className="hero-name">
                {HERO.prenom}<br /><em>{HERO.nom}</em>
              </h1>
              <p className="hero-title">
                Futur Community Manager &nbsp;<TypingWord />&nbsp; · Stratégie Digitale
              </p>
              <blockquote className="hero-tagline power-baseline">
                &ldquo;{HERO.citation}&rdquo;
              </blockquote>
              <div className="hero-cta">
                <a href="#contact" className="btn btn-primary btn-green">Me contacter</a>
                <a href="/cv-victor-cassina.pdf" download className="btn btn-cv-discreet">⬇ CV</a>
              </div>
            </div>
            <div className="hero-photo-wrap" onMouseMove={e => {
              const rect = e.currentTarget.getBoundingClientRect()
              const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12
              const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12
              e.currentTarget.querySelector('.hero-photo').style.transform = `scale(1.03) translate(${x}px, ${y}px)`
            }} onMouseLeave={e => {
              e.currentTarget.querySelector('.hero-photo').style.transform = 'scale(1) translate(0,0)'
            }}>
              <div className="photo-glow" />
              <img src="/victor.png" alt="Victor Cassina" className="hero-photo" />
            </div>
          </div>
        </div>

        {/* Tags infinite scroll */}
        <InfiniteTagsBar />
      </section>

      <hr className="divider" />
      <section id="bio" className="section">
        <div className="container reveal">
          <p className="section-label">À propos</p>
          <h2 className="section-heading">{BIO.titre1}<br /><em>{BIO.titre2}</em></h2>
          <p className="bio-text" dangerouslySetInnerHTML={{ __html: BIO.texte }} />
          <div className="counters">
            <div className="counter-item">
              <span className="counter-number"><Counter target={15} /></span>
              <span className="counter-label">SAÉ réalisées</span>
              <span className="counter-sub">(Situation d&apos;Apprentissage Évaluée)</span>
            </div>
            <div className="counter-item">
              <span className="counter-number"><Counter target={2} /></span>
              <span className="counter-label">Stages effectués</span>
            </div>
            <div className="counter-item">
              <span className="counter-number"><Counter target={4} /></span>
              <span className="counter-label">Années d&apos;expérience</span>
            </div>
            <div className="counter-item">
              <span className="counter-number"><Counter target={2} /></span>
              <span className="counter-label">Cryptomonnaies lancées</span>
            </div>
          </div>
        </div>
      </section>


      <hr className="divider" />
      <section id="softskills" className="section">
        <div className="container">
          <p className="section-label reveal">Profil</p>
          <h2 className="section-heading reveal">Langue, Outils &amp; <em>Soft Skills</em>.</h2>
          <div className="softskills-grid reveal">
            <div className="lang-block">
              <p className="softskills-sub">Langue</p>
              <div className="lang-list">
                <div className="lang-item">
                  <span className="lang-flag">🇬🇧</span>
                  <div>
                    <span className="lang-name">Anglais</span>
                    <span className="lang-level">B2 — Lu, écrit, parlé</span>
                  </div>
                  <div className="lang-bar"><div className="lang-fill" style={{ width: '70%' }} /></div>
                </div>
              </div>

              <p className="softskills-sub" style={{ marginTop: '32px' }}>Outils</p>
              <div className="outils-list">
                {[
                  { nom: 'Canva', tip: 'Création de 40+ visuels pour la JPO MMI — affiches, carrousels Instagram, stories — validés par la cheffe de département.' },
                  { nom: 'CapCut', tip: '3 vidéos montées pour la JPO MMI : interviews étudiants, visite des locaux, reportage BDE. Rendu pro en 48h.' },
                  { nom: 'Suite Adobe', tip: 'Charte graphique Solidélice réalisée sous Illustrator — logo, palette, typographies, déclinée sur tous les supports.' },
                  { nom: 'Claude AI', tip: 'Utilisé quotidiennement pour accélérer la rédaction, structurer des stratégies de contenu et affiner les angles éditoriaux.' },
                  { nom: 'Notion', tip: 'Planning éditorial mensuel, suivi de projets SAÉ et organisation de la stratégie de contenu Hop Bunny sur Notion.' },
                  { nom: 'Meta Business Suite', tip: 'Gestion des publications, analyse des insights et suivi des KPIs sur les pages Instagram et Facebook de Hop Bunny.' },
                ].map((o, i) => (
                  <div key={o.nom} className={`outil-pill-wrap`}>
                    <span className={`outil-pill outil-pulse-${i}`}>{o.nom}</span>
                    <div className="outil-tooltip">{o.tip}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="soft-block">
              <p className="softskills-sub">Soft Skills</p>
              <div className="soft-list">
                {[
                  { icon: '🧠', label: 'Intelligence contextuelle', desc: 'Lire un environnement (réseau social, secteur, audience) et adapter instantanément son registre de communication.' },
                  { icon: '⚡', label: 'Réactivité éditoriale', desc: 'Surveiller l\'actualité en temps réel et produire un contenu pertinent rapidement après un événement.' },
                  { icon: '🔗', label: 'Vision stratégique', desc: 'Relier un objectif de communication à des actions concrètes — voir la chaîne complète, pas juste l\'exécution.' },
                  { icon: '🎭', label: 'Polyvalence de ton', desc: 'Passer d\'un document institutionnel à une story dynamique sans perdre la cohérence de marque.' },
                ].map(s => (
                  <div key={s.label} className="soft-item">
                    <span className="soft-icon">{s.icon}</span>
                    <div>
                      <span className="soft-label">{s.label}</span>
                      <p className="soft-desc">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* COMPÉTENCES */}
      <section id="competences" className="section">
        <div className="container">
          <p className="section-label reveal">Compétences IUT &amp; Synergies Finance</p>
          <h2 className="section-heading reveal">Ce que j&apos;apporte<br />au secteur <em>Fintech</em>.</h2>
          <p className="skills-hint reveal">Cliquez sur une carte pour découvrir les compétences acquises à l&apos;IUT et leur application concrète en finance.</p>
          <div className="skills-grid">
            {COMPETENCES.map(c => <SkillCard key={c.badge} competence={c} />)}
          </div>
        </div>
      </section>

      {/* CITATION PLEINE LARGEUR */}
      <div className="citation-band">
        <div className="container">
          <blockquote className="citation-text">
            &ldquo;On ne peut pas ne pas communiquer.&rdquo;
          </blockquote>
          <cite className="citation-author">— Paul Watzlawick, théoricien de la communication</cite>
        </div>
      </div>

      <hr className="divider" />

      {/* EXPÉRIENCES — BLOCK EXPLORER */}
      <section id="experience" className="section">
        <div className="container">
          <p className="section-label reveal">Parcours</p>
          <h2 className="section-heading reveal">Expériences <em>clés</em>.</h2>
          <p className="skills-hint reveal">Cliquez sur un bloc pour voir le détail de la transaction.</p>
          <BlockExplorer experiences={EXPERIENCES} />
        </div>
      </section>

      <hr className="divider" />

      {/* PROJETS */}
      <section id="projets" className="section">
        <div className="container">
          <p className="section-label reveal">Réalisations</p>
          <h2 className="section-heading reveal">Mes <em>projets</em> IUT.</h2>
          <p className="skills-hint reveal">Cliquez sur une carte pour découvrir le détail de chaque SAÉ.</p>
          <div className="projets-grid">
            {PROJETS.map((projet, i) => (
              <ProjetCard key={i} projet={projet} />
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* CONTACT */}
      <section id="contact" className="contact-section">
        <div className="container">
          <p className="section-label">Contact</p>
          <h2 className="section-heading">Travaillons<br /><em>ensemble</em>.</h2>
          <p className="contact-text">{CONTACT.texte}</p>
          <div className="contact-links">
            <button onClick={copyEmail} className="btn btn-primary">✉️ &nbsp;{CONTACT.email}</button>
            <a href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-outline">LinkedIn →</a>
            <a href="/cv-victor-cassina.pdf" download className="btn btn-cv">⬇ CV PDF</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <p>© 2026 Victor Cassina &nbsp;·&nbsp; BUT Info-Com, IUT de Dijon &nbsp;·&nbsp; Fait avec <strong>rigueur</strong> &amp; créativité.</p>
        </div>
      </footer>
    </>
  )
}
