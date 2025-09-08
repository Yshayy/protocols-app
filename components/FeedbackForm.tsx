import React, { useEffect,useState } from 'react'

import styles from './FeedbackForm.module.css'

interface FeedbackFormProps {
  pageTitle: string
  canonicalPageUrl?: string
}

function FeedbackForm({ pageTitle, canonicalPageUrl }: FeedbackFormProps) {
  const [showForm, setShowForm] = useState(false)
  const [helpful, setHelpful] = useState<boolean | null>(null)
  const [remarks, setRemarks] = useState('')
  const [sentBy, setSentBy] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [pageUrl, setPageUrl] = useState('')

  useEffect(() => {
    if (canonicalPageUrl) {
      setPageUrl(canonicalPageUrl)
    } else {
      setPageUrl(window.location.href)
    }
  }, [canonicalPageUrl])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (helpful === null) {
      alert('אנא בחר אם זה היה מועיל')
      return
    }
    const data = {
      helpful,
      remarks: remarks || undefined,
      page: pageUrl,
      pageTitle,
      sentBy: sentBy || undefined
    }
    try {
      const response = await fetch(
        'https://hook.eu2.make.com/dhx83y1xupe1y0ol617agfwigmwh98mr',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }
      )
      if (response.ok) {
        setSubmitted(true)
        // Auto-close modal after 2 seconds
        setTimeout(() => {
          setShowForm(false)
          setSubmitted(false)
          setHelpful(null)
          setRemarks('')
          setSentBy('')
        }, 2000)
      } else {
        alert('שגיאה בשליחת המשוב')
      }
    } catch {
      alert('שגיאה בשליחת המשוב')
    }
  }

  const handleCloseModal = () => {
    setShowForm(false)
    setSubmitted(false)
    setHelpful(null)
    setRemarks('')
    setSentBy('')
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseModal()
    }
  }

  if (submitted) {
    return (
      <>
        <div className={styles.feedbackContainer}>
          <button className={styles.feedbackButton} onClick={() => setShowForm(true)}>
            💬 השאר משוב
          </button>
        </div>
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
          <div className={styles.modalContent}>
            <div className={styles.thankYou}>
              תודה על המשוב!
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className={styles.feedbackContainer}>
        <button className={styles.feedbackButton} onClick={() => setShowForm(true)}>
          💬 השאר משוב
        </button>
      </div>

      {showForm && (
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
          <div className={styles.modalContent}>
            <form onSubmit={handleSubmit} className={styles.form} dir="rtl">
              <h3>משוב על הדף</h3>
              <div className={styles.pageTitle}>
                <strong>דף:</strong> {pageTitle}
              </div>
              <button
                type="button"
                className={styles.closeButton}
                onClick={handleCloseModal}
                aria-label="סגור"
              >
                ✕
              </button>
              <div className={styles.helpfulSection}>
                <div>האם התוכן מדויק ושימושי?</div>
                <div className={styles.thumbs}>
                  <button
                    type="button"
                    className={`${styles.thumb} ${helpful === true ? styles.selected : ''}`}
                    onClick={() => setHelpful(true)}
                    aria-label="מועיל"
                  >
                    👍
                  </button>
                  <button
                    type="button"
                    className={`${styles.thumb} ${helpful === false ? styles.selected : ''}`}
                    onClick={() => setHelpful(false)}
                    aria-label="לא מועיל"
                  >
                    👎
                  </button>
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="remarks" className={styles.formLabel}>הערות (אופציונלי):</label>
                <textarea
                  id="remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className={styles.textarea}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="sentBy" className={styles.formLabel}>שמך (אופציונלי):</label>
                <input
                  id="sentBy"
                  type="text"
                  value={sentBy}
                  onChange={(e) => setSentBy(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className={styles.buttons}>
                <button type="submit" className={styles.submitButton}>
                  שלח
                </button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={handleCloseModal}
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default FeedbackForm
