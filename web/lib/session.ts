import { supabase } from './supabase'
import { Participant, ParticipantStatus, Session, WindowCategory } from '@/types/database'

const WINDOWS = {
  'narrative-structures': [
    'heros-journey',
    'redemption-arc',
    'conversations-with-god',
    'bildungsroman',
    'epiphany',
  ],
  'narrative-techniques': [
    'focalization',
    'zoom',
    'objects-as-metaphors',
    'nonlinear-narrative',
    'sensory-detail',
  ],
}

function pickRandom<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n)
}

export async function getOrCreateParticipant(pid: string): Promise<Participant> {
  const { data: existing } = await supabase
    .from('participants')
    .select('*')
    .eq('pid', pid)
    .single()

  if (existing) return existing as Participant

  const condition: WindowCategory =
    Math.random() < 0.5 ? 'narrative-structures' : 'narrative-techniques'

  const assigned_windows = pickRandom(WINDOWS[condition], 3)

  const { data, error } = await supabase
    .from('participants')
    .insert({ pid, condition, assigned_windows, status: 'consent' })
    .select()
    .single()

  if (error) throw error
  return data as Participant
}

export async function updateParticipantStatus(pid: string, status: ParticipantStatus) {
  const { error } = await supabase
    .from('participants')
    .update({ status } as Partial<Participant>)
    .eq('pid', pid)
  if (error) throw error
}

export async function getSession(participantId: string): Promise<Session | null> {
  const { data } = await supabase
    .from('sessions')
    .select('*')
    .eq('participant_id', participantId)
    .single()
  return (data as Session | null)
}

export async function ensureSession(participantId: string): Promise<Session> {
  const existing = await getSession(participantId)
  if (existing) return existing

  const { data, error } = await supabase
    .from('sessions')
    .insert({ participant_id: participantId })
    .select()
    .single()

  if (error) throw error
  return data as Session
}

export async function updateSession(participantId: string, updates: Partial<Session>) {
  const { error } = await supabase
    .from('sessions')
    .update(updates as Partial<Session>)
    .eq('participant_id', participantId)
  if (error) throw error
}

export const STEP_ORDER: ParticipantStatus[] = [
  'consent',
  'troubles',
  'qualities',
  'quality_description',
  'pre_narrative',
  'characters',
  'motivations',
  't1_meaning',
  'in_house',
  'post_narrative',
  't2_meaning',
  'complete',
]

export function nextStep(current: ParticipantStatus): ParticipantStatus {
  const idx = STEP_ORDER.indexOf(current)
  return STEP_ORDER[Math.min(idx + 1, STEP_ORDER.length - 1)]
}
