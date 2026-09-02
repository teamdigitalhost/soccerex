import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft, ExternalLink, Building2, Globe2, Calendar, Clock, MapPin, Globe,
} from 'lucide-react'
import { getEventSpeaker, clapSpeaker } from '../lib/soccerexApi'
import ClapButton from '../components/ClapButton'
import { isTestModeFromUrl, withTestSearch } from '../lib/testMode'
import { eventThemeClass } from '../lib/eventTheme'
import { EventHeader, LoadingState, ErrorState } from './EventAgendaConcept'
import { eventSpeakers, eventAgenda } from '../lib/routes'

const ROLE_STATUS_LABEL = {
  confirmed: 'Confirmed',
  invited: 'Invited',
  in_discussion: 'In discussion',
  agreed: 'Agreed',
  declined: 'Declined',
  no_response: 'No response',
  cancelled: 'Cancelled',
  completed: 'Completed',
}

/* lucide-react v1.7 dropped brand icons, so social chips use a generic
   Globe icon plus a readable label. */
const SOCIAL_LABEL = {
  linkedin: 'LinkedIn',
  twitter: 'X / Twitter',
  x: 'X',
  instagram: 'Instagram',
  youtube: 'YouTube',
  github: 'GitHub',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  threads: 'Threads',
  bluesky: 'Bluesky',
}

export default function EventSpeakerProfile() {
  const { slug, speakerSlug } = useParams()
  const [speaker, setSpeaker] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setSpeaker(null); setError(null)
    getEventSpeaker(slug, speakerSlug, { test: isTestModeFromUrl() })
      .then((s) => { if (!cancelled) setSpeaker(s) })
      .catch((err) => { if (!cancelled) setError(err) })
    return () => { cancelled = true }
  }, [slug, speakerSlug])

  /* The detail response embeds an `event` object so we can render the same
     EventHeader without a second fetch. */
  const event = speaker?.event || null

  return (
    <div className={`event-page ${eventThemeClass(slug)}`} style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <EventHeader event={event} slug={slug} active="speakers" loading={!event && !error} />

      <section style={{ padding: 'clamp(24px,3vw,40px) clamp(24px,5vw,80px) clamp(80px,10vw,120px)' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>

          <Link to={withTestSearch(eventSpeakers(slug))} className="inline-flex items-center gap-2 font-mono uppercase tracking-widest mb-6"
            style={{ fontSize: 11, color: '#0D1B2A', opacity: 0.55, textDecoration: 'none' }}>
            <ArrowLeft size={13} /> Back to all speakers
          </Link>

          {error && <ErrorState error={error} />}
          {!error && !speaker && <LoadingState label="Loading speaker" />}

          {speaker && <ProfileBody speaker={speaker} eventSlug={slug} />}
        </div>
      </section>
    </div>
  )
}

function ProfileBody({ speaker, eventSlug }) {
  const initials = (speaker.display_name || '?')
    .split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
  const roleStatus = ROLE_STATUS_LABEL[speaker.role_status] || speaker.role_status
  const isPastEvent = speaker.event?.ends_on ? new Date(speaker.event.ends_on) < new Date() : false

  return (
    <>
      <div style={{
        position: 'relative',
        borderRadius: 18,
        overflow: 'hidden',
        marginBottom: 28,
        background: speaker.banner_url ? '#0D1B2A' : 'var(--event-sunset)',
        aspectRatio: '5/2',
        minHeight: 200,
      }}>
        {speaker.banner_url && (
          <img src={speaker.banner_url} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
        )}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(180deg, rgba(13,27,42,0) 0%, rgba(13,27,42,0.6) 100%)',
        }} />
      </div>

      {/* Profile header: photo overlapping the banner */}
      <div className="grid gap-8 mb-12" style={{ gridTemplateColumns: 'minmax(140px, 220px) 1fr', alignItems: 'flex-start' }}>
        <div style={{
          marginTop: 'min(-90px, -8vw)',
          width: '100%',
          aspectRatio: '1/1',
          borderRadius: 18,
          overflow: 'hidden',
          border: '4px solid #FFFFFF',
          boxShadow: '0 18px 40px -22px rgba(13,27,42,0.35)',
          background: speaker.photo_url ? '#0D1B2A' : 'var(--event-sunset)',
          position: 'relative',
        }}>
          {speaker.photo_url ? (
            <img src={speaker.photo_url} alt={speaker.display_name}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
              <span className="miami-headline" style={{ fontSize: 'clamp(2.6rem, 7vw, 4.4rem)', color: '#fff', letterSpacing: '0.05em' }}>
                {initials}
              </span>
            </div>
          )}
        </div>

        <div>
          {roleStatus && (
            <div className="inline-flex items-center gap-2 mb-3" style={{
              padding: '4px 10px', borderRadius: 999,
              fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
              background: 'var(--event-tile-soft)', color: 'var(--event-primary)',
              border: '1px solid var(--event-primary-border)',
              fontFamily: 'Montserrat, sans-serif',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: speaker.role_status === 'confirmed' ? '#10b981' : 'var(--event-primary)' }} />
              {roleStatus}
            </div>
          )}
          <h1 className="miami-headline" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#0D1B2A', lineHeight: 1.05, marginBottom: 10 }}>
            {speaker.display_name}
          </h1>
          {speaker.headline && (
            <p className="miami-body" style={{ fontSize: '1.1rem', color: '#3a4a5a', lineHeight: 1.4, marginBottom: 16 }}>
              {speaker.headline}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2" style={{ fontSize: 13, color: '#607186' }}>
            {speaker.company && (
              <span className="flex items-center gap-1.5"><Building2 size={13} /> {speaker.company}</span>
            )}
            {speaker.country && (
              <span className="flex items-center gap-1.5"><Globe2 size={13} /> {speaker.country}</span>
            )}
            {!isPastEvent && (
              <ClapButton
                initial={speaker.claps || 0}
                onFlush={(n) => clapSpeaker(eventSlug, speaker.slug, n)}
                ariaLabel={`Clap for ${speaker.display_name}`}
                idleLabel="Clap"
              />
            )}
          </div>

          {(speaker.website_url || hasSocials(speaker) || speaker.links?.length > 0) && (
            <div className="flex flex-wrap gap-2 mt-5">
              {speaker.website_url && (
                <ExternalChip href={speaker.website_url} label="Website" Icon={Globe} />
              )}
              {speaker.socials && Object.entries(speaker.socials).map(([key, url]) => {
                if (!url) return null
                return (
                  <ExternalChip key={key} href={url} label={SOCIAL_LABEL[key.toLowerCase()] || prettyKey(key)} Icon={Globe} />
                )
              })}
              {speaker.links?.map((link, i) => {
                if (!link?.url) return null
                return (
                  <ExternalChip key={`link-${i}`} href={link.url} label={link.label || link.title || link.url} Icon={ExternalLink} />
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bio */}
      {speaker.bio && (
        <section className="mb-12">
          <p className="miami-subhead mb-3" style={{ color: 'var(--event-secondary)', fontSize: 11 }}>About</p>
          <p className="miami-body" style={{ fontSize: '1.05rem', color: '#1a2a3a', lineHeight: 1.6, maxWidth: 760, whiteSpace: 'pre-wrap' }}>
            {speaker.bio}
          </p>
        </section>
      )}

      {/* Sessions */}
      {speaker.sessions?.length > 0 && (
        <section>
          <p className="miami-subhead mb-3" style={{ color: 'var(--event-secondary)', fontSize: 11 }}>On the agenda</p>
          <h2 className="miami-headline mb-6" style={{ fontSize: 'clamp(1.4rem, 2.6vw, 2rem)', color: '#0D1B2A' }}>
            {speaker.display_name.split(' ')[0]}'s sessions at {speaker.event?.cycle || speaker.event?.name || 'this event'}
          </h2>
          <div className="flex flex-col gap-3">
            {speaker.sessions.map((s) => <SessionRow key={s.id} session={s} eventSlug={eventSlug} />)}
          </div>
        </section>
      )}

      {/* Empty sessions state */}
      {speaker.sessions?.length === 0 && (
        <section>
          <p className="miami-body" style={{ fontSize: 14, color: '#607186' }}>
            No published sessions for {speaker.display_name} yet.
          </p>
        </section>
      )}
    </>
  )
}

function SessionRow({ session, eventSlug }) {
  return (
    <Link to={withTestSearch(eventAgenda(eventSlug))} style={{ textDecoration: 'none' }}>
      <article style={{
        background: '#FFFFFF',
        border: '1px solid rgba(13,27,42,0.10)',
        borderRadius: 12,
        padding: 18,
        display: 'flex', flexDirection: 'column', gap: 10,
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--event-primary-border)'
          e.currentTarget.style.boxShadow = '0 12px 28px -16px rgba(13,27,42,0.18)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(13,27,42,0.10)'
          e.currentTarget.style.boxShadow = 'none'
        }}>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="miami-subhead" style={{
            fontSize: 11, letterSpacing: '0.14em', color: 'var(--event-primary)',
            fontVariantNumeric: 'tabular-nums',
          }}>
            <Calendar size={11} style={{ display: 'inline', marginRight: 4 }} />
            {formatDate(session.starts_at)}
            <Clock size={11} style={{ display: 'inline', margin: '0 4px 0 10px' }} />
            {formatTime(session.starts_at)} - {formatTime(session.ends_at)}
          </span>
          {session.format && (
            <span style={{
              padding: '2px 8px', borderRadius: 4,
              fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
              color: 'var(--event-secondary)', background: 'var(--event-tile-soft)',
              fontFamily: 'Montserrat, sans-serif',
            }}>
              {session.format}
            </span>
          )}
          {session.role && session.role !== 'speaker' && (
            <span className="miami-subhead" style={{ fontSize: 10, color: 'var(--event-primary)', letterSpacing: '0.18em' }}>
              {session.role}
            </span>
          )}
        </div>

        <h3 className="miami-headline" style={{ fontSize: '1.05rem', color: '#0D1B2A', lineHeight: 1.2 }}>
          {session.title}
        </h3>

        <div className="flex flex-wrap gap-x-4 gap-y-1" style={{ fontSize: 12, color: '#607186' }}>
          {session.stage?.name && (
            <span className="flex items-center gap-1.5"><MapPin size={11} /> {session.stage.name}</span>
          )}
          {session.topic?.title && (
            <span>Topic: <span style={{ color: '#0D1B2A' }}>{session.topic.title}</span>
              {session.topic.theme && <span style={{ color: '#607186' }}> · {session.topic.theme}</span>}
            </span>
          )}
        </div>
      </article>
    </Link>
  )
}

function ExternalChip({ href, label, Icon }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5"
      style={{
        padding: '6px 12px', borderRadius: 999,
        background: 'var(--event-tile-soft)',
        border: '1px solid var(--event-primary-border)',
        fontSize: 12, fontWeight: 600,
        color: 'var(--event-primary)',
        textDecoration: 'none',
        fontFamily: 'Montserrat, sans-serif',
      }}>
      <Icon size={13} /> {label}
    </a>
  )
}

function hasSocials(s) {
  if (!s.socials || typeof s.socials !== 'object') return false
  return Object.values(s.socials).some(Boolean)
}

function prettyKey(key) {
  return key.charAt(0).toUpperCase() + key.slice(1)
}

function formatDate(iso) {
  if (!iso) return ''
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!m) return ''
  const d = new Date(`${m[1]}-${m[2]}-${m[3]}T00:00:00`)
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function formatTime(iso) {
  if (!iso) return ''
  const m = iso.match(/T(\d{2}):(\d{2})/)
  if (!m) return ''
  let [, h, mm] = m
  let hour = parseInt(h, 10)
  const period = hour >= 12 ? 'PM' : 'AM'
  hour = hour % 12 || 12
  return `${hour}:${mm} ${period}`
}
