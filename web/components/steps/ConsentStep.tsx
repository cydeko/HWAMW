'use client'

import { useState } from 'react'
import { updateParticipantStatus, updateSession, nextStep } from '@/lib/session'
import { Participant } from '@/types/database'
import StepWrapper from '@/components/StepWrapper'

interface Props {
  participant: Participant
  pid: string
  onAdvance: () => void
}

export default function ConsentStep({ participant, onAdvance }: Props) {
  const [agreed, setAgreed] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleConsent = async () => {
    if (!agreed) return
    setSubmitting(true)
    await updateSession(participant.id, {
      consent_given: true,
      consent_timestamp: new Date().toISOString(),
      consent_version: 'v1',
    })
    await updateParticipantStatus(participant.pid, nextStep('consent'))
    onAdvance()
  }

  return (
    <StepWrapper>
      <h1 className="text-2xl font-serif text-stone-100">
        The House with a Million Windows
      </h1>

      <div className="space-y-4 text-stone-300 text-sm leading-relaxed">
        <p>
          You are being invited to take part in a research study conducted by
          researchers at the Alan Turing Institute. The experience will take
          approximately 30–45 minutes.
        </p>
        <p>
          You will be asked to share a personal story, then guided through an
          interactive narrative experience designed to offer new perspectives on
          that story. This experience is informed by and contributes to
          psychological science.
        </p>
        <p>
          Your responses will be stored securely and anonymously. You may
          withdraw at any time. Your data will be used for academic research
          purposes only and may appear in published work in anonymised form.
        </p>
        <p>
          If you have any questions, please contact the research team at{' '}
          <span className="text-stone-400">[contact email]</span>.
        </p>
      </div>

      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 accent-stone-400"
        />
        <span className="text-stone-400 text-sm leading-relaxed">
          I have read the above, I am 18 or older, and I consent to participate
          in this study.
        </span>
      </label>

      <button
        onClick={handleConsent}
        disabled={!agreed || submitting}
        className="w-full py-3 text-sm font-medium rounded border border-stone-700 text-stone-300 hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        {submitting ? 'One moment...' : 'Begin'}
      </button>
    </StepWrapper>
  )
}
