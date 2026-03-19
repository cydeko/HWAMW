'use client'

import { useState, useEffect } from 'react'
import { updateParticipantStatus, updateSession, getSession, nextStep } from '@/lib/session'
import { Participant, Character } from '@/types/database'
import StepWrapper from '@/components/StepWrapper'

interface Props {
  participant: Participant
  pid: string
  onAdvance: () => void
}

export default function CharactersStep({ participant, onAdvance }: Props) {
  const [plotSummary, setPlotSummary] = useState('')
  const [summaryConfirmed, setSummaryConfirmed] = useState(false)
  const [characters, setCharacters] = useState<Character[]>([])
  const [currentCharIdx, setCurrentCharIdx] = useState(0)
  const [charDescription, setCharDescription] = useState('')
  const [generating, setGenerating] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const generate = async () => {
      const session = await getSession(participant.id)
      if (!session?.t1_narrative) {
        setGenerating(false)
        return
      }
      try {
        const res = await fetch('/api/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ narrative: session.t1_narrative }),
        })
        if (res.ok) {
          const data = await res.json()
          setPlotSummary(data.summary || '')
          setCharacters(data.characters?.map((name: string) => ({ name, description: '' })) || [])
        }
      } catch {
        // Ollama unavailable — proceed with empty summary, user can fill manually
      } finally {
        setGenerating(false)
      }
    }
    generate()
  }, [participant.id])

  const handleConfirmSummary = () => setSummaryConfirmed(true)

  const handleCharacterDescription = async () => {
    const updated = characters.map((c, i) =>
      i === currentCharIdx ? { ...c, description: charDescription } : c
    )
    setCharacters(updated)
    setCharDescription('')

    if (currentCharIdx < characters.length - 1) {
      setCurrentCharIdx(currentCharIdx + 1)
    } else {
      setSubmitting(true)
      await updateSession(participant.id, {
        plot_summary: plotSummary,
        characters: updated,
      })
      await updateParticipantStatus(participant.pid, nextStep('characters'))
      onAdvance()
    }
  }

  if (generating) {
    return (
      <StepWrapper>
        <p className="text-stone-500 text-sm italic">
          &ldquo;Hmm, very interesting,&rdquo; he says, reading carefully…
        </p>
      </StepWrapper>
    )
  }

  if (!summaryConfirmed) {
    return (
      <StepWrapper>
        <p className="text-stone-400 text-sm italic leading-relaxed">
          &ldquo;Now let me see if I&apos;ve got this straight.&rdquo;
        </p>
        <p className="text-stone-300 leading-relaxed text-sm">{plotSummary}</p>
        <p className="text-stone-400 text-sm italic">&ldquo;Is that right?&rdquo;</p>

        <div className="flex gap-3">
          <button
            onClick={handleConfirmSummary}
            className="flex-1 py-3 text-sm rounded border border-stone-700 text-stone-300 hover:bg-stone-800 transition-colors"
          >
            That&apos;s right
          </button>
          <button
            onClick={() => setSummaryConfirmed(true)}
            className="flex-1 py-3 text-sm rounded border border-stone-800 text-stone-500 hover:border-stone-700 hover:text-stone-400 transition-colors"
          >
            Not quite
          </button>
        </div>
      </StepWrapper>
    )
  }

  const currentChar = characters[currentCharIdx]

  // No characters identified — skip straight to next step
  if (!currentChar) {
    const advance = async () => {
      await updateSession(participant.id, { plot_summary: plotSummary, characters: [] })
      await updateParticipantStatus(participant.pid, nextStep('characters'))
      onAdvance()
    }
    advance()
    return (
      <StepWrapper>
        <p className="text-stone-500 text-sm italic">One moment…</p>
      </StepWrapper>
    )
  }

  return (
    <StepWrapper>
      <p className="text-stone-400 text-sm italic leading-relaxed">
        &ldquo;I see. And these other folks, your supporting cast—that&apos;s mainly{' '}
        {characters.map((c) => c.name).join(', ')}. Now, help me understand.
        Who&apos;s this <span className="text-stone-200">{currentChar.name}</span>?
        What are they like?&rdquo;
      </p>

      <textarea
        value={charDescription}
        onChange={(e) => setCharDescription(e.target.value)}
        placeholder={`Describe ${currentChar.name} briefly…`}
        rows={3}
        className="w-full bg-stone-900 border border-stone-700 rounded px-4 py-3 text-stone-200 text-sm placeholder-stone-600 focus:outline-none focus:border-stone-500 resize-none leading-relaxed"
      />

      <button
        onClick={handleCharacterDescription}
        disabled={!charDescription.trim() || submitting}
        className="w-full py-3 text-sm font-medium rounded border border-stone-700 text-stone-300 hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        {submitting ? '...' : currentCharIdx < characters.length - 1 ? 'Next' : 'Continue'}
      </button>
    </StepWrapper>
  )
}
