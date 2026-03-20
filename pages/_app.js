import '../styles/globals.css'
import { useState, useEffect } from 'react'

// Applique le dark mode immédiatement pour éviter le flash blanc
if (typeof document !== 'undefined') {
  document.documentElement.setAttribute('data-theme', 'dark')
}

const LINES = [
  { text: '> Initializing portfolio...', delay: 0, result: '[OK]' },
  { text: '> Connecting to Fintech network...', delay: 400, result: '[OK]' },
  { text: '> Fetching Market Sentiment...', delay: 900, result: '[DONE]' },
  { text: '> Scanning communication assets...', delay: 1300, result: '[OK]' },
  { text: '> Loading Victor_Cassina.exe...', delay: 1800, result: '' },
]

function LoadingScreen({ onDone }) {
  const [lines, setLines] = useState([])
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    LINES.forEach((line, i) => {
      setTimeout(() => {
        setLines(l => [...l, line])
      }, line.delay)
    })

    // Progress bar
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100 }
        return p + 2
      })
    }, 38)

    // Fade out and done
    setTimeout(() => {
      setFadeOut(true)
      setTimeout(onDone, 600)
    }, 3200)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`loader-screen${fadeOut ? ' loader-fade' : ''}`}>
      <div className="loader-inner">
        <div className="loader-header">
          <span className="loader-logo">VC <span>PORTFOLIO</span></span>
          <span className="loader-version">v2.0 — 2026</span>
        </div>

        <div className="loader-terminal">
          {lines.map((line, i) => (
            <div key={i} className="loader-line">
              <span className="loader-text">{line.text}</span>
              {line.result && (
                <span className={`loader-result ${line.result === '[OK]' || line.result === '[DONE]' ? 'ok' : ''}`}>
                  {line.result}
                </span>
              )}
            </div>
          ))}
          {progress > 0 && progress <= 100 && (
            <div className="loader-progress-wrap">
              <div className="loader-bar-track">
                <div className="loader-bar-fill" style={{ width: `${progress}%` }} />
              </div>
              <span className="loader-percent">{progress}%</span>
            </div>
          )}
          <span className="loader-cursor">█</span>
        </div>

        <div className="loader-footer">
          <span>FINTECH · WEB3 · COMMUNICATION DIGITALE</span>
        </div>
      </div>
    </div>
  )
}

export default function App({ Component, pageProps }) {
  const [loading, setLoading] = useState(true)

  return loading
    ? <LoadingScreen onDone={() => setLoading(false)} />
    : <Component {...pageProps} />
}
