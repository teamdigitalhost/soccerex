import { useEffect, useMemo, useState } from 'react'
import {
  Handshake, Target, Compass, Calendar, Loader2, AlertCircle, Check, X,
  Sparkles, Lock, MessageSquare, ChevronDown, ChevronUp, Plus, Pencil,
  Globe, Users, MapPin, Clock,
} from 'lucide-react'
import {
  getDealNetworkPortal,
  submitDealNetworkPortalIntake,
  updateDealNetworkPortalIntake,
  respondToDealNetworkMeeting,
  ApiError,
} from '../lib/soccerexApi'
import { NEED_OFFER_OPTIONS, PAIN_OPTIONS } from '../lib/dealNetworkTaxonomy'

/* ═══ Deal Network Portal Section ══════════════════════════════════════════
 * Embeds inside CompanyPortal as one of the dashboard cards. Concierge tone:
 * no dense tables, no CRM feel. Cards. Lots of breathing room. Empty states
 * frame Soccerex as the curator, not the user as a marketplace browser.
 *
 * Loads the portal independently of the parent so a missing intake doesn't
 * break the rest of the dashboard. Self-refreshes after every mutation.
 */

const DEAL_TYPE_OPTIONS = [
  'Sponsorship', 'Media rights', 'Content partnership', 'Technology / platform',
  'Hospitality / experiences', 'Investment / M&A', 'Stadium / venue',
  'Data / analytics', 'Merchandising / licensing', 'Talent / agency', 'Other',
]

const BUDGET_OPTIONS = [
  '', 'Under $25k', '$25k – $50k', '$50k – $100k', '$100k – $250k',
  '$250k – $500k', '$500k – $1M', '$1M+', 'Prefer not to say',
]

const MEETING_FORMAT_OPTIONS = [
  { value: '', label: 'No preference' },
  { value: 'curated_intro', label: 'Curated introduction' },
  { value: 'group_session', label: 'Group / roundtable' },
  { value: 'on_site_meeting', label: 'On-site at a Soccerex event' },
  { value: 'virtual_intro', label: 'Virtual introduction first' },
  { value: 'open', label: 'Open to whatever fits' },
]

const SIDE_OPTIONS = [
  { value: 'company',      label: 'Brand, sponsor, or buyer' },
  { value: 'rightsholder', label: 'Club, venue, federation, rights holder' },
  { value: 'both',         label: 'Both sides depending on the deal' },
]

export default function DealNetworkPortalSection({ slug, editToken, isTest, onUnauthorized }) {
  const [portal, setPortal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingIntake, setEditingIntake] = useState(null) /* null = creating */

  async function loadPortal() {
    setLoading(true); setError(null)
    try {
      const data = await getDealNetworkPortal(slug, editToken, { test: isTest })
      setPortal(data || null)
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        if (typeof onUnauthorized === 'function') onUnauthorized()
        return
      }
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!slug || !editToken) return
    loadPortal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, editToken, isTest])

  const memberships = portal?.memberships || []
  const intakes     = portal?.intakes || []
  const matches     = portal?.matches || []
  const meetings    = portal?.meetings || []
  const summary     = portal?.membership_summary || {}
  const guidance    = portal?.guidance || {}

  /* Show the panel even when the user has no membership yet — the empty
     state is the invitation to start a brief. */

  return (
    <section style={cardStyle}>
      <HeaderRow
        intakeCount={intakes.length}
        meetingCount={meetings.length}
        matchCount={matches.length}
      />

      {loading && <SectionLoading />}

      {error && (
        <InlineError
          message={error?.message || 'Could not load the Deal Network portal.'}
          onRetry={loadPortal}
        />
      )}

      {!loading && !error && (
        <div className="flex flex-col gap-5 mt-5">
          {/* Membership status — only renders if backend returned membership rows */}
          {memberships.length > 0 && <MembershipCard summary={summary} memberships={memberships} />}

          {/* Current brief(s) */}
          <BriefsCard
            intakes={intakes}
            onEdit={(intake) => { setEditingIntake(intake); setEditorOpen(true) }}
            onNew={() => { setEditingIntake(null); setEditorOpen(true) }}
          />

          {/* Curated matches */}
          <MatchesCard matches={matches} />

          {/* Meetings */}
          <MeetingsCard
            meetings={meetings}
            slug={slug}
            editToken={editToken}
            isTest={isTest}
            onChanged={loadPortal}
            onUnauthorized={onUnauthorized}
          />

          {/* Large-file guidance */}
          {(guidance.large_files || guidance.concierge) && (
            <GuidanceFooter guidance={guidance} />
          )}
        </div>
      )}

      {editorOpen && (
        <IntakeEditor
          slug={slug}
          editToken={editToken}
          isTest={isTest}
          intake={editingIntake}
          limits={portal?.limits || {}}
          onClose={() => setEditorOpen(false)}
          onSaved={async () => { setEditorOpen(false); await loadPortal() }}
          onUnauthorized={onUnauthorized}
        />
      )}
    </section>
  )
}

/* ─── Header strip ──────────────────────────────────────────────────────── */
function HeaderRow({ intakeCount, meetingCount, matchCount }) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <p className="miami-subhead" style={{ fontSize: 10, color: 'var(--event-secondary, #BFA46F)', letterSpacing: '0.22em', marginBottom: 6 }}>
          DEAL NETWORK
        </p>
        <h2 className="miami-headline" style={{ fontSize: '1.15rem', color: '#0D1B2A', marginBottom: 4 }}>
          Your concierge introductions
        </h2>
        <p className="miami-body" style={{ fontSize: 13, color: '#3a4a5a' }}>
          A private workspace for the briefs you share with Soccerex, the matches we curate, and the meetings we schedule on your behalf.
        </p>
      </div>
      <div className="flex items-center gap-3 flex-wrap" style={{ fontSize: 12 }}>
        <Stat label="Briefs" value={intakeCount} />
        <Stat label="Matches" value={matchCount} />
        <Stat label="Meetings" value={meetingCount} />
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div style={{
      background: 'rgba(13,27,42,0.04)',
      borderRadius: 10,
      padding: '8px 14px',
      minWidth: 70,
      textAlign: 'center',
    }}>
      <p className="miami-headline" style={{ fontSize: 18, color: '#0D1B2A', lineHeight: 1 }}>{value}</p>
      <p className="miami-subhead" style={{ fontSize: 9, color: '#607186', letterSpacing: '0.18em', marginTop: 4 }}>{label}</p>
    </div>
  )
}

/* ─── Membership ────────────────────────────────────────────────────────── */
function MembershipCard({ summary, memberships }) {
  const primary = memberships[0] || {}
  return (
    <div style={subcardStyle}>
      <div className="flex items-start gap-4 flex-wrap">
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: 'rgba(191,164,111,0.16)',
          display: 'grid', placeItems: 'center', flexShrink: 0,
        }}>
          <Sparkles size={20} style={{ color: 'var(--event-secondary, #BFA46F)' }} />
        </div>
        <div className="flex-1" style={{ minWidth: 200 }}>
          <p className="miami-subhead" style={{ fontSize: 10, color: '#607186', letterSpacing: '0.2em' }}>MEMBERSHIP</p>
          <p className="miami-headline" style={{ fontSize: '1rem', color: '#0D1B2A', marginBottom: 4 }}>
            {prettyTier(primary.tier) || 'Active member'}{primary.event_name ? ` · ${primary.event_name}` : ''}
          </p>
          <p className="miami-body" style={{ fontSize: 12, color: '#586778' }}>
            Status <span style={{ color: '#0D1B2A', fontWeight: 600 }}>{prettyStatus(primary.status) || 'Active'}</span>
            {primary.meeting_entitlement != null && (
              <> · Meeting entitlement <span style={{ color: '#0D1B2A', fontWeight: 600 }}>{primary.meeting_entitlement}</span></>
            )}
            {summary.match_count != null && (
              <> · Matches curated <span style={{ color: '#0D1B2A', fontWeight: 600 }}>{summary.match_count}</span></>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

/* ─── Briefs ────────────────────────────────────────────────────────────── */
function BriefsCard({ intakes, onEdit, onNew }) {
  if (intakes.length === 0) {
    return (
      <div style={emptyCardStyle}>
        <div className="flex items-start gap-4">
          <div style={emptyIconWrapStyle}>
            <Target size={20} style={{ color: 'var(--event-secondary, #BFA46F)' }} />
          </div>
          <div className="flex-1">
            <h3 className="miami-headline" style={{ fontSize: '1rem', color: '#0D1B2A', marginBottom: 4 }}>
              What you are looking for
            </h3>
            <p className="miami-body" style={{ fontSize: 13, color: '#586778', marginBottom: 14, lineHeight: 1.55 }}>
              Tell us what kind of commercial opportunities would be worth your time. We use this to curate introductions and shape the room at our events.
            </p>
            <button onClick={onNew} className="inline-flex items-center gap-2" style={primaryButtonStyle}>
              <Plus size={14} /> Add a brief
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="miami-headline" style={{ fontSize: '0.95rem', color: '#0D1B2A' }}>Your active briefs</h3>
        <button onClick={onNew} className="inline-flex items-center gap-1.5" style={subtleButtonStyle}>
          <Plus size={12} /> Add another brief
        </button>
      </div>
      {intakes.map((intake) => (
        <BriefRow key={intake.id} intake={intake} onEdit={() => onEdit(intake)} />
      ))}
    </div>
  )
}

function BriefRow({ intake, onEdit }) {
  const [expanded, setExpanded] = useState(false)
  const pitch = intake.one_sentence_pitch || intake.pitch || intake.deal_description || '(No pitch yet)'
  const sideLabel = SIDE_OPTIONS.find((s) => s.value === intake.side)?.label || prettyKey(intake.side) || 'Brief'
  const tags = [
    ...(Array.isArray(intake.deal_types) ? intake.deal_types : []),
    intake.primary_geography,
    intake.budget_range,
    intake.decision_timeline,
  ].filter(Boolean)

  return (
    <div style={subcardStyle}>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex-1" style={{ minWidth: 200 }}>
          <p className="miami-subhead" style={{ fontSize: 10, color: '#607186', letterSpacing: '0.2em', marginBottom: 4 }}>
            {sideLabel.toUpperCase()}{intake.status && <> · {prettyStatus(intake.status)}</>}
          </p>
          <p className="miami-body" style={{ fontSize: 14, color: '#0D1B2A', lineHeight: 1.5, marginBottom: 8 }}>
            {pitch}
          </p>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tags.map((t, i) => (
                <span key={`${t}-${i}`} style={tagStyle}>{t}</span>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setExpanded((e) => !e)} style={subtleButtonStyle} className="inline-flex items-center gap-1.5">
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {expanded ? 'Hide' : 'Details'}
          </button>
          <button onClick={onEdit} style={subtleButtonStyle} className="inline-flex items-center gap-1.5">
            <Pencil size={12} /> Edit
          </button>
        </div>
      </div>
      {expanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4" style={{ borderTop: '1px solid rgba(13,27,42,0.08)' }}>
          <DetailField label="Ideal counterpart" value={intake.ideal_counterpart} />
          <DetailField label="Named targets" value={(intake.named_targets || []).join(', ')} />
          <DetailField label="Leagues / properties" value={(intake.leagues_competitions || []).join(', ')} />
          <DetailField label="Meeting format" value={prettyKey(intake.meeting_format_preference)} />
          <DetailField label="Specific people" value={intake.specific_people_to_meet} />
          <DetailField label="Notes / context" value={intake.deal_description} />
        </div>
      )}
    </div>
  )
}

/* ─── Matches ───────────────────────────────────────────────────────────── */
function MatchesCard({ matches }) {
  if (matches.length === 0) {
    return (
      <div style={emptyCardStyle}>
        <div className="flex items-start gap-4">
          <div style={emptyIconWrapStyle}>
            <Compass size={20} style={{ color: 'var(--event-secondary, #BFA46F)' }} />
          </div>
          <div className="flex-1">
            <h3 className="miami-headline" style={{ fontSize: '1rem', color: '#0D1B2A', marginBottom: 4 }}>
              Introductions Soccerex is reviewing
            </h3>
            <p className="miami-body" style={{ fontSize: 13, color: '#586778', lineHeight: 1.55 }}>
              Soccerex is reviewing your criteria. Curated introductions will appear here once the team identifies strong fits. We share rationale, not just names.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="miami-headline" style={{ fontSize: '0.95rem', color: '#0D1B2A' }}>Potential introductions</h3>
      {matches.map((m) => (
        <MatchRow key={m.id} match={m} />
      ))}
    </div>
  )
}

function MatchRow({ match }) {
  const name = match.counterpart_name || match.counterpart?.display_name || match.title || 'Introduction'
  const score = match.fit_score
  const reason = match.match_reason || match.rationale
  const angle = match.intro_angle
  const status = prettyStatus(match.status)
  return (
    <div style={subcardStyle}>
      <div className="flex items-start gap-3">
        <div style={{
          width: 38, height: 38, borderRadius: 9,
          background: 'rgba(13,27,42,0.06)',
          display: 'grid', placeItems: 'center', flexShrink: 0,
        }}>
          <Handshake size={18} style={{ color: '#0D1B2A' }} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="miami-headline" style={{ fontSize: '1rem', color: '#0D1B2A' }}>{name}</p>
            {typeof score === 'number' && score > 0 && (
              <span style={{
                background: 'rgba(191,164,111,0.16)',
                color: 'var(--event-secondary, #8a6f3a)',
                fontSize: 10, fontFamily: 'IBM Plex Mono, monospace',
                letterSpacing: '0.1em',
                padding: '3px 8px', borderRadius: 999, fontWeight: 600,
              }}>FIT {score}</span>
            )}
            {status && (
              <span style={{ fontSize: 10, color: '#607186', letterSpacing: '0.15em', fontFamily: 'IBM Plex Mono, monospace' }}>
                · {status.toUpperCase()}
              </span>
            )}
          </div>
          {reason && <p className="miami-body mt-2" style={{ fontSize: 13, color: '#3a4a5a', lineHeight: 1.55 }}>{reason}</p>}
          {angle && (
            <p className="miami-body mt-2" style={{ fontSize: 12.5, color: '#586778', fontStyle: 'italic' }}>
              Intro angle: {angle}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Meetings ──────────────────────────────────────────────────────────── */
function MeetingsCard({ meetings, slug, editToken, isTest, onChanged, onUnauthorized }) {
  if (meetings.length === 0) {
    return (
      <div style={emptyCardStyle}>
        <div className="flex items-start gap-4">
          <div style={emptyIconWrapStyle}>
            <Calendar size={20} style={{ color: 'var(--event-secondary, #BFA46F)' }} />
          </div>
          <div className="flex-1">
            <h3 className="miami-headline" style={{ fontSize: '1rem', color: '#0D1B2A', marginBottom: 4 }}>
              Concierge meetings
            </h3>
            <p className="miami-body" style={{ fontSize: 13, color: '#586778', lineHeight: 1.55 }}>
              No meeting requests yet. Accepted introductions become concierge-scheduled meetings here, with prep notes and a single set of accept / tentative / decline controls.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="miami-headline" style={{ fontSize: '0.95rem', color: '#0D1B2A' }}>Meeting requests</h3>
      {meetings.map((m) => (
        <MeetingRow
          key={m.id}
          meeting={m}
          slug={slug}
          editToken={editToken}
          isTest={isTest}
          onChanged={onChanged}
          onUnauthorized={onUnauthorized}
        />
      ))}
    </div>
  )
}

function MeetingRow({ meeting, slug, editToken, isTest, onChanged, onUnauthorized }) {
  const [pending, setPending] = useState(null) /* 'accepted' | 'tentative' | 'declined' | null */
  const [error, setError] = useState('')
  const [note, setNote] = useState('')
  const [showNote, setShowNote] = useState(false)
  const status = prettyStatus(meeting.status)
  const title = meeting.title || meeting.subject || 'Introduction meeting'
  const when = meeting.scheduled_at || meeting.starts_at || meeting.proposed_time
  const where = meeting.location || meeting.venue
  const counterpart = meeting.counterpart_name || meeting.counterpart?.display_name
  const prepNotes = meeting.prep_notes || meeting.agenda
  const myResponse = meeting.my_response || meeting.viewer_response

  async function respond(response) {
    if (pending) return
    setPending(response); setError('')
    try {
      await respondToDealNetworkMeeting(slug, editToken, meeting.id, {
        response,
        note: note.trim() || undefined,
        contact_sharing_consented: response === 'accepted',
      }, { test: isTest })
      setShowNote(false); setNote('')
      if (typeof onChanged === 'function') await onChanged()
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        if (typeof onUnauthorized === 'function') onUnauthorized()
        return
      }
      setError(err?.message || 'Could not record your response.')
    } finally {
      setPending(null)
    }
  }

  const responded = myResponse && ['accepted', 'tentative', 'declined'].includes(myResponse)

  return (
    <div style={subcardStyle}>
      <div className="flex items-start gap-3 flex-wrap">
        <div style={{
          width: 40, height: 40, borderRadius: 9,
          background: 'rgba(13,27,42,0.06)',
          display: 'grid', placeItems: 'center', flexShrink: 0,
        }}>
          <Users size={18} style={{ color: '#0D1B2A' }} />
        </div>
        <div className="flex-1" style={{ minWidth: 240 }}>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="miami-headline" style={{ fontSize: '1rem', color: '#0D1B2A' }}>{title}</p>
            {status && (
              <span style={{ fontSize: 10, color: '#607186', letterSpacing: '0.15em', fontFamily: 'IBM Plex Mono, monospace' }}>
                · {status.toUpperCase()}
              </span>
            )}
          </div>
          {counterpart && (
            <p className="miami-body mt-1" style={{ fontSize: 13, color: '#3a4a5a' }}>
              With {counterpart}
            </p>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2" style={{ fontSize: 12, color: '#586778' }}>
            {when && <span className="inline-flex items-center gap-1.5"><Clock size={12} /> {formatWhen(when)}</span>}
            {where && <span className="inline-flex items-center gap-1.5"><MapPin size={12} /> {where}</span>}
          </div>
          {prepNotes && (
            <p className="miami-body mt-3" style={{ fontSize: 12.5, color: '#586778', lineHeight: 1.55 }}>
              {prepNotes}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 flex flex-wrap items-center justify-between gap-3" style={{ borderTop: '1px solid rgba(13,27,42,0.06)' }}>
        {responded ? (
          <p className="miami-body" style={{ fontSize: 12.5, color: '#0D1B2A' }}>
            <Check size={13} style={{ display: 'inline', marginRight: 4, color: '#10b981' }} />
            You responded <strong>{prettyKey(myResponse)}</strong>. Soccerex will follow up with logistics.
          </p>
        ) : (
          <>
            <button
              onClick={() => setShowNote((v) => !v)}
              className="inline-flex items-center gap-1.5"
              style={subtleButtonStyle}
            >
              <MessageSquare size={12} /> {showNote ? 'Hide note' : 'Add a short note'}
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => respond('declined')}
                disabled={!!pending}
                style={ghostButtonStyle}
              >
                {pending === 'declined' ? <Loader2 size={13} className="prog-spin" /> : <X size={13} />} Decline
              </button>
              <button
                onClick={() => respond('tentative')}
                disabled={!!pending}
                style={ghostButtonStyle}
              >
                {pending === 'tentative' ? <Loader2 size={13} className="prog-spin" /> : '?'} Tentative
              </button>
              <button
                onClick={() => respond('accepted')}
                disabled={!!pending}
                style={primaryButtonStyle}
              >
                {pending === 'accepted' ? <Loader2 size={13} className="prog-spin" /> : <Check size={13} />} Accept
              </button>
            </div>
          </>
        )}
      </div>
      {showNote && !responded && (
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="e.g. Happy to meet, please include our CEO."
          style={{
            ...inputStyle, marginTop: 10, resize: 'vertical', minHeight: 60, fontSize: 13,
          }}
        />
      )}
      {error && (
        <p style={{ fontSize: 12.5, color: '#b91c1c', marginTop: 8 }}>
          <AlertCircle size={12} style={{ display: 'inline', marginRight: 4 }} /> {error}
        </p>
      )}
    </div>
  )
}

/* ─── Intake editor (modal) ─────────────────────────────────────────────── */
function IntakeEditor({ slug, editToken, isTest, intake, limits, onClose, onSaved, onUnauthorized }) {
  const isEditing = !!intake?.id
  const [form, setForm] = useState(() => ({
    side: intake?.side || 'company',
    one_sentence_pitch: intake?.one_sentence_pitch || intake?.pitch || '',
    ideal_counterpart: intake?.ideal_counterpart || '',
    deal_description: intake?.deal_description || '',
    deal_types: Array.isArray(intake?.deal_types) ? intake.deal_types : [],
    primary_geography: intake?.primary_geography || '',
    budget_range: intake?.budget_range || '',
    decision_timeline: intake?.decision_timeline || '',
    meeting_format_preference: intake?.meeting_format_preference || '',
    specific_people_to_meet: intake?.specific_people_to_meet || '',
    named_targets: Array.isArray(intake?.named_targets) ? intake.named_targets.join('\n') : '',
    looking_for: Array.isArray(intake?.signals?.need) ? intake.signals.need : [],
    can_offer: Array.isArray(intake?.signals?.offer) ? intake.signals.offer : [],
    pain_points: Array.isArray(intake?.signals?.pain) ? intake.signals.pain : [],
    pain_point_detail: intake?.signals?.pain_detail || '',
  }))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const canSave = useMemo(() => Boolean(form.side && form.one_sentence_pitch.trim() && !saving), [form, saving])

  async function handleSave() {
    if (!canSave) return
    setSaving(true); setError('')
    const payload = {
      side: form.side,
      one_sentence_pitch: form.one_sentence_pitch.trim() || undefined,
      ideal_counterpart: form.ideal_counterpart.trim() || undefined,
      deal_description: form.deal_description.trim() || undefined,
      deal_types: form.deal_types,
      primary_geography: form.primary_geography || undefined,
      budget_range: form.budget_range || undefined,
      decision_timeline: form.decision_timeline.trim() || undefined,
      meeting_format_preference: form.meeting_format_preference || undefined,
      specific_people_to_meet: form.specific_people_to_meet.trim() || undefined,
      named_targets: form.named_targets
        .split(/[\n,]+/g).map((s) => s.trim()).filter(Boolean),
      currency: limits?.default_currency || 'USD',
      looking_for: form.looking_for,
      can_offer: form.can_offer,
      pain_points: form.pain_points,
      pain_point_detail: form.pain_point_detail || undefined,
    }
    try {
      if (isEditing) {
        await updateDealNetworkPortalIntake(slug, editToken, intake.id, payload, { test: isTest })
      } else {
        await submitDealNetworkPortalIntake(slug, editToken, payload, { test: isTest })
      }
      onSaved && onSaved()
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        if (typeof onUnauthorized === 'function') onUnauthorized()
        return
      }
      const detail = err instanceof ApiError && err.body?.errors
        ? Object.values(err.body.errors).flat().join(' ')
        : err.message
      setError(detail || 'Could not save your brief.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3 mb-5">
          <div>
            <p className="miami-subhead" style={{ fontSize: 10, color: 'var(--event-secondary, #BFA46F)', letterSpacing: '0.22em' }}>
              {isEditing ? 'EDIT BRIEF' : 'NEW BRIEF'}
            </p>
            <h3 className="miami-headline" style={{ fontSize: '1.2rem', color: '#0D1B2A' }}>
              {isEditing ? 'Update your Deal Network brief' : 'Tell us what would make this useful'}
            </h3>
          </div>
          <button onClick={onClose} style={subtleButtonStyle} aria-label="Close">
            <X size={14} />
          </button>
        </div>

        <Field label="Which side of the table?" required>
          <select value={form.side} onChange={(e) => update('side', e.target.value)} style={selectStyle}>
            {SIDE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>

        <Field label="One-sentence pitch" required>
          <textarea
            rows={2}
            value={form.one_sentence_pitch}
            onChange={(e) => update('one_sentence_pitch', e.target.value)}
            placeholder="e.g. We want to meet MLS clubs ready to launch fan data activations in 2026."
            style={textareaStyle}
          />
        </Field>

        <Field label="Who would be an ideal counterpart?">
          <textarea
            rows={2}
            value={form.ideal_counterpart}
            onChange={(e) => update('ideal_counterpart', e.target.value)}
            placeholder="The kind of company, role, or context that would make this worth your time."
            style={textareaStyle}
          />
        </Field>

        <Field label="Deal types you are open to">
          <ChipGroup
            options={DEAL_TYPE_OPTIONS}
            value={form.deal_types}
            onChange={(v) => update('deal_types', v)}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Primary geography">
            <input
              value={form.primary_geography}
              onChange={(e) => update('primary_geography', e.target.value)}
              placeholder="e.g. Americas, Europe, MENA, Global"
              style={inputStyle}
            />
          </Field>
          <Field label="Budget range">
            <select value={form.budget_range} onChange={(e) => update('budget_range', e.target.value)} style={selectStyle}>
              {BUDGET_OPTIONS.map((o) => <option key={o} value={o}>{o || 'Prefer not to say yet'}</option>)}
            </select>
          </Field>
          <Field label="Decision timeline">
            <input
              value={form.decision_timeline}
              onChange={(e) => update('decision_timeline', e.target.value)}
              placeholder="e.g. Q3 2026, before Miami"
              style={inputStyle}
            />
          </Field>
          <Field label="Meeting format preference">
            <select value={form.meeting_format_preference} onChange={(e) => update('meeting_format_preference', e.target.value)} style={selectStyle}>
              {MEETING_FORMAT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Specific people or roles you want to meet">
          <textarea
            rows={2}
            value={form.specific_people_to_meet}
            onChange={(e) => update('specific_people_to_meet', e.target.value)}
            placeholder="e.g. Heads of commercial at MLS clubs, federation presidents, family offices."
            style={textareaStyle}
          />
        </Field>

        <Field label="Named targets (optional, one per line)">
          <textarea
            rows={2}
            value={form.named_targets}
            onChange={(e) => update('named_targets', e.target.value)}
            placeholder="Companies, clubs, or people you'd love to meet."
            style={textareaStyle}
          />
        </Field>

        <Field label="Deeper context (optional)">
          <textarea
            rows={3}
            value={form.deal_description}
            onChange={(e) => update('deal_description', e.target.value)}
            placeholder="Longer explanation, history, scope, what 'good' looks like."
            style={textareaStyle}
          />
        </Field>

        {(() => {
          const chip = (active) => ({
            background: active ? '#09203e' : '#f1f0ec',
            color: active ? '#fff' : '#09203e',
            border: `1px solid ${active ? '#09203e' : 'rgba(9,32,62,0.14)'}`,
            borderRadius: 999, padding: '7px 13px', fontSize: '0.8rem',
            cursor: 'pointer', marginRight: 8, marginBottom: 8,
          })
          const toggle = (field, key) => setForm((f) => ({
            ...f,
            [field]: f[field].includes(key) ? f[field].filter((k) => k !== key) : [...f[field], key],
          }))
          const ready = (form.looking_for || []).length > 0 && (form.pain_points || []).length > 0
          return (
            <div style={{ marginTop: 18, marginBottom: 18 }}>
              <div style={{
                marginBottom: 14, padding: '10px 14px', borderRadius: 8,
                background: ready ? 'rgba(34,139,87,0.12)' : 'rgba(233,30,99,0.10)',
                border: `1px solid ${ready ? 'rgba(34,139,87,0.4)' : 'rgba(233,30,99,0.35)'}`,
                fontSize: '0.85rem', color: '#09203e',
              }}>
                {ready
                  ? 'Match-ready: you have declared what you need and a pain point.'
                  : 'Not match-ready yet. Add at least one "looking for" and one pain point so Soccerex can match you.'}
              </div>

              <p style={{ fontWeight: 600, fontSize: '0.8rem', margin: '0 0 8px' }}>What you are looking for</p>
              <div>{NEED_OFFER_OPTIONS.map((o) => (
                <button type="button" key={o.key} style={chip((form.looking_for || []).includes(o.key))} onClick={() => toggle('looking_for', o.key)}>{o.label}</button>
              ))}</div>

              <p style={{ fontWeight: 600, fontSize: '0.8rem', margin: '14px 0 8px' }}>What you can offer</p>
              <div>{NEED_OFFER_OPTIONS.map((o) => (
                <button type="button" key={o.key} style={chip((form.can_offer || []).includes(o.key))} onClick={() => toggle('can_offer', o.key)}>{o.label}</button>
              ))}</div>

              <p style={{ fontWeight: 600, fontSize: '0.8rem', margin: '14px 0 8px' }}>Pain points</p>
              <div>{PAIN_OPTIONS.map((o) => (
                <button type="button" key={o.key} style={chip((form.pain_points || []).includes(o.key))} onClick={() => toggle('pain_points', o.key)}>{o.label}</button>
              ))}</div>

              <textarea
                value={form.pain_point_detail}
                onChange={(e) => setForm((f) => ({ ...f, pain_point_detail: e.target.value }))}
                placeholder="Pain point detail (optional): what is the real problem?"
                rows={2}
                style={{ width: '100%', marginTop: 12, padding: '10px 12px', border: '1px solid rgba(9,32,62,0.14)', borderRadius: 8, fontSize: '0.88rem' }}
              />
            </div>
          )
        })()}

        {error && (
          <p style={{ fontSize: 13, color: '#b91c1c', margin: '10px 0' }}>
            <AlertCircle size={13} style={{ display: 'inline', marginRight: 4 }} /> {error}
          </p>
        )}

        <div className="flex items-center justify-between gap-3 mt-5 pt-4" style={{ borderTop: '1px solid rgba(13,27,42,0.08)' }}>
          <p className="miami-body" style={{ fontSize: 11.5, color: '#7a8896', lineHeight: 1.5, maxWidth: 360 }}>
            <Lock size={11} style={{ display: 'inline', marginRight: 4 }} />
            Briefs stay private until Soccerex proposes a fit.
          </p>
          <div className="flex gap-2">
            <button onClick={onClose} style={ghostButtonStyle}>Cancel</button>
            <button onClick={handleSave} disabled={!canSave} style={primaryButtonStyle}>
              {saving ? <><Loader2 size={13} className="prog-spin" /> Saving</> : isEditing ? 'Save changes' : 'Submit brief'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Misc ──────────────────────────────────────────────────────────────── */

function GuidanceFooter({ guidance }) {
  return (
    <div style={{
      background: 'rgba(13,27,42,0.03)',
      borderRadius: 10,
      padding: '14px 16px',
      fontSize: 12,
      color: '#586778',
      lineHeight: 1.55,
    }}>
      {guidance.concierge && <p style={{ marginBottom: guidance.large_files ? 8 : 0 }}>{guidance.concierge}</p>}
      {guidance.large_files && (
        <p>
          <Globe size={11} style={{ display: 'inline', marginRight: 4 }} />
          {guidance.large_files}
        </p>
      )}
    </div>
  )
}

function DetailField({ label, value }) {
  if (!value) return null
  return (
    <div>
      <p className="miami-subhead" style={{ fontSize: 10, color: '#607186', letterSpacing: '0.18em', marginBottom: 3 }}>{label.toUpperCase()}</p>
      <p className="miami-body" style={{ fontSize: 13, color: '#0D1B2A', lineHeight: 1.5 }}>{value}</p>
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label className="miami-subhead block mb-1.5" style={{ fontSize: 10, color: '#0D1B2A', letterSpacing: '0.16em' }}>
        {label}{required && <span style={{ color: 'var(--event-secondary, #BFA46F)', marginLeft: 4 }}>*</span>}
      </label>
      {children}
    </div>
  )
}

function ChipGroup({ options, value, onChange }) {
  function toggle(opt) {
    onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt])
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const active = value.includes(opt)
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            style={{
              background: active ? '#0D1B2A' : '#f5f4f0',
              color: active ? '#fff' : '#0D1B2A',
              border: `1px solid ${active ? '#0D1B2A' : 'rgba(13,27,42,0.1)'}`,
              borderRadius: 999,
              padding: '6px 12px',
              fontSize: 12,
              fontFamily: 'Inter, sans-serif',
              cursor: 'pointer',
              transition: 'all 0.18s',
            }}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

function SectionLoading() {
  return (
    <div className="flex items-center gap-2 mt-5" style={{ color: '#607186', fontSize: 13 }}>
      <Loader2 size={14} className="prog-spin" /> Loading Deal Network…
    </div>
  )
}

function InlineError({ message, onRetry }) {
  return (
    <div className="mt-5" style={{
      background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c',
      borderRadius: 10, padding: '12px 14px', fontSize: 13,
    }}>
      <AlertCircle size={13} style={{ display: 'inline', marginRight: 6 }} /> {message}
      {onRetry && (
        <button onClick={onRetry} style={{ marginLeft: 8, textDecoration: 'underline', color: '#b91c1c', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>
          Try again
        </button>
      )}
    </div>
  )
}

/* ─── Format helpers ────────────────────────────────────────────────────── */

function prettyKey(value) {
  if (!value) return ''
  return String(value).replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}
function prettyStatus(value) {
  return prettyKey(value)
}
function prettyTier(value) {
  if (!value) return ''
  const map = { premier: 'Premier tier', strategic: 'Strategic tier', priority: 'Priority tier', access: 'Access tier' }
  return map[String(value).toLowerCase()] || prettyKey(value)
}
function formatWhen(value) {
  try {
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return value
    return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
  } catch {
    return value
  }
}

/* ─── Inline styles (keeps the component self-contained) ────────────────── */

const cardStyle = {
  background: '#FFFFFF', border: '1px solid rgba(13,27,42,0.08)', borderRadius: 14,
  padding: 'clamp(20px, 3vw, 32px)',
}
const subcardStyle = {
  background: '#FAFBF8',
  border: '1px solid rgba(13,27,42,0.07)',
  borderRadius: 12,
  padding: '16px 18px',
}
const emptyCardStyle = {
  background: 'linear-gradient(180deg, #fafaf6 0%, #f5f3ee 100%)',
  border: '1px dashed rgba(13,27,42,0.14)',
  borderRadius: 12,
  padding: '20px 22px',
}
const emptyIconWrapStyle = {
  width: 44, height: 44, borderRadius: 10,
  background: 'rgba(191,164,111,0.18)',
  display: 'grid', placeItems: 'center', flexShrink: 0,
}
const tagStyle = {
  background: 'rgba(13,27,42,0.06)',
  color: '#3a4a5a',
  fontSize: 11,
  fontFamily: 'IBM Plex Mono, monospace',
  letterSpacing: '0.04em',
  padding: '3px 8px',
  borderRadius: 6,
}
const inputStyle = {
  width: '100%', padding: '10px 12px',
  fontSize: 13, fontFamily: 'Inter, sans-serif',
  background: '#fff',
  border: '1px solid rgba(13,27,42,0.14)',
  borderRadius: 8, color: '#0D1B2A',
  outline: 'none',
}
const textareaStyle = { ...inputStyle, resize: 'vertical', minHeight: 68, lineHeight: 1.5 }
const selectStyle = {
  ...inputStyle,
  appearance: 'none', WebkitAppearance: 'none',
  backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%2210%22 height%3D%226%22 viewBox%3D%220 0 10 6%22%3E%3Cpath fill%3D%22%230D1B2A%22 d%3D%22M5 6 0 0h10z%22%2F%3E%3C%2Fsvg%3E")',
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: 30,
}
const primaryButtonStyle = {
  background: '#0D1B2A', color: '#fff',
  border: 'none', borderRadius: 8,
  padding: '9px 14px',
  fontSize: 12, fontFamily: 'Inter, sans-serif', fontWeight: 600,
  letterSpacing: '0.02em', cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', gap: 6,
  transition: 'background 0.18s',
}
const ghostButtonStyle = {
  background: 'transparent', color: '#0D1B2A',
  border: '1px solid rgba(13,27,42,0.18)', borderRadius: 8,
  padding: '8px 14px',
  fontSize: 12, fontFamily: 'Inter, sans-serif', fontWeight: 500,
  cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', gap: 6,
  transition: 'border-color 0.18s',
}
const subtleButtonStyle = {
  background: 'transparent', color: '#586778',
  border: '1px solid rgba(13,27,42,0.10)', borderRadius: 8,
  padding: '6px 10px',
  fontSize: 11, fontFamily: 'Inter, sans-serif',
  cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', gap: 4,
}
const modalOverlayStyle = {
  position: 'fixed', inset: 0, zIndex: 100,
  background: 'rgba(5,13,26,0.55)',
  backdropFilter: 'blur(4px)',
  display: 'grid', placeItems: 'center',
  padding: '24px 20px',
  overflowY: 'auto',
}
const modalStyle = {
  background: '#FFFFFF', borderRadius: 16,
  padding: 'clamp(20px,3vw,32px)',
  maxWidth: 640, width: '100%',
  maxHeight: 'calc(100vh - 48px)',
  overflowY: 'auto',
  boxShadow: '0 30px 80px rgba(5,13,26,0.4)',
}
