'use client'

import { useState, useEffect } from 'react'
import { updateParticipantStatus, updateSession, getSession, nextStep } from '@/lib/session'
import { Participant } from '@/types/database'
import StepWrapper from '@/components/StepWrapper'

interface Props {
  participant: Participant
  pid: string
  onAdvance: () => void
}

export default function PreNarrativeStep({ participant, onAdvance }: Props) {
  const [troubles, setTroubles] = useState<string[]>([])
  const [selectedTrouble, setSelectedTrouble] = useState<string | null>(null)
  const [narrative, setNarrative] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const wordCount = narrative.trim().split(/\s+/).filter(Boolean).length

  useEffect(() => {
    getSession(participant.id).then((s) => {
      if (s?.trouble) {
        setTroubles(s.trouble)
        if (s.trouble.length === 1) setSelectedTrouble(s.trouble[0])
      }
    })
  }, [participant.id])

  const handleSubmit = async () => {
    if (!narrative.trim() || !selectedTrouble || wordCount > 350) return
    setSubmitting(true)
    await updateSession(participant.id, {
      t1_narrative: narrative,
      trouble: [selectedTrouble],
    })
    await updateParticipantStatus(participant.pid, nextStep('pre_narrative'))
    onAdvance()
  }

  return (
    <StepWrapper>
      <p className="text-stone-300 leading-relaxed">
        In front of you rises a grand house—sprawling and a little worn, mosses
        creeping up elegant, classical walls that might have stood there,
        uninhabited, for a century. Except that the windows are lit. All of them.
      </p>
      <p className="text-stone-300 leading-relaxed">
        Not a chance, you think, and turn to leave. Except… you can&apos;t at all
        remember where you came from, or how to get back.
      </p>
      <p className="text-stone-400 text-sm leading-relaxed italic">
        &ldquo;You&apos;re very welcome to stay the night,&rdquo; a voice says from the gate.
        &ldquo;Plenty of space. But I&apos;ll need a story from you first. Something true.
        No more than 300 words. Beginning, middle, end.&rdquo;
      </p>

      {troubles.length > 1 && !selectedTrouble && (
        <div className="space-y-2">
          <p className="text-stone-500 text-xs">Which would you like to tell?</p>
          {troubles.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTrouble(t)}
              className="w-full text-left px-4 py-3 rounded border border-stone-800 text-stone-400 text-sm hover:border-stone-600 hover:text-stone-300 transition-colors"
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {(selectedTrouble || troubles.length === 1) && (
        <>
          <textarea
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
            placeholder="Tell your story here… (This journey will be most interesting if it's something true—a story from your life that might benefit from some fresh perspective.)"
            rows={10}
            className="w-full bg-stone-900 border border-stone-700 rounded px-4 py-3 text-stone-200 text-sm placeholder-stone-600 focus:outline-none focus:border-stone-500 resize-none leading-relaxed"
          />

          <div className="flex justify-between items-center">
            <span className={`text-xs ${wordCount > 300 ? 'text-amber-600' : 'text-stone-600'}`}>
              {wordCount} / 300 words
            </span>
            <button
              onClick={handleSubmit}
              disabled={!narrative.trim() || wordCount > 350 || submitting}
              className="px-6 py-2 text-sm font-medium rounded border border-stone-700 text-stone-300 hover:bg-stone-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? '...' : 'Hand it over'}
            </button>
          </div>
        </>
      )}
    </StepWrapper>
  )
}
