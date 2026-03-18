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
  { num: '05', label: 'Disponible dès avril 2026' },
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

// ── Page principale ───────────────────────────────────────────
export default function Home() {
  useReveal()

  // Mode sombre
  const [dark, setDark] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])

  // Curseur personnalisé
  useEffect(() => {
    const cursor = document.createElement('div')
    cursor.className = 'custom-cursor'
    document.body.appendChild(cursor)
    const move = (e) => { cursor.style.transform = `translate(${e.clientX - 8}px, ${e.clientY - 8}px)` }
    const grow = () => cursor.classList.add('cursor-grow')
    const shrink = () => cursor.classList.remove('cursor-grow')
    window.addEventListener('mousemove', move)
    document.querySelectorAll('a, button, .skill-card, .projet-card, .btn').forEach(el => {
      el.addEventListener('mouseenter', grow)
      el.addEventListener('mouseleave', shrink)
    })
    return () => { window.removeEventListener('mousemove', move); cursor.remove() }
  }, [])

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

  return (
    <>
      <Head>
        <title>{META.titre}</title>
        <meta name="description" content={META.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
            <li><a href="#bio">Bio</a></li>
            <li><a href="#competences">Compétences</a></li>
            <li><a href="#projets">Projets</a></li>
            <li><a href="#experience">Expériences</a></li>
            <li><a href="#contact">Contact</a></li>
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
                {id === 'bio' ? 'Bio' : id === 'competences' ? 'Compétences' : id === 'projets' ? 'Projets' : id === 'experience' ? 'Expériences' : 'Contact'}
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
              <p className="hero-title">{HERO.titre}</p>
              <blockquote className="hero-tagline">
                &ldquo;{HERO.citation}&rdquo;
              </blockquote>
              <div className="hero-cta">
                <a href="#competences" className="btn btn-primary">Voir mes compétences</a>
                <a href="#contact" className="btn btn-outline">Me contacter</a>
                <a href="/cv-victor-cassina.pdf" download className="btn btn-cv">⬇ CV PDF</a>
              </div>
            </div>
            <div className="hero-photo-wrap">
              <div className="photo-glow" />
              <img src="/victor2.png" alt="Victor Cassina" className="hero-photo" />
            </div>
          </div>
        </div>

        {/* 5 raisons de scroller */}
        <RaisonsTeaser />
      </section>

      <hr className="divider" />

      {/* BIO + COMPTEURS */}
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
                {['Canva', 'CapCut', 'Suite Adobe', 'Claude AI', 'Notion', 'Meta Business Suite'].map(o => (
                  <span key={o} className="outil-pill">{o}</span>
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

      {/* EXPÉRIENCES — TIMELINE */}
      <section id="experience" className="section">
        <div className="container">
          <p className="section-label reveal">Parcours</p>
          <h2 className="section-heading reveal">Expériences <em>clés</em>.</h2>
          <div className="timeline">
            {EXPERIENCES.map((exp, i) => (
              <div key={i} className="timeline-item reveal">
                <div className="timeline-left">
                  <span className="timeline-annee">{exp.annee}</span>
                  {exp.note && <small className="timeline-note">{exp.note}</small>}
                </div>
                <div className="timeline-dot-col">
                  <div className="timeline-dot" />
                  {i < EXPERIENCES.length - 1 && <div className="timeline-line" />}
                </div>
                <div className="timeline-content">
                  <span className="exp-tag">{exp.tag}</span>
                  <h3 className="timeline-titre">{exp.titre}</h3>
                  <p className="timeline-desc">{exp.description}</p>
                  {exp.highlight && <p className="exp-highlight">{exp.highlight}</p>}
                </div>
              </div>
            ))}
          </div>
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
