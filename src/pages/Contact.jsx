import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Handshake, Calendar, Mic, Newspaper, Heart, Store, MessageCircle,
  ArrowRight, Mail, MapPin, Check, User, Building2, Phone, FileText,
} from 'lucide-react'
import NetworkNodes from '../animations/NetworkNodes'
import PixelDivider from '../components/PixelDivider'

// ═══ INQUIRY TYPES ════════════════════════════════════════════════════════════
// Each type routes to the correct email and shows relevant conditional fields.
const INQUIRY_TYPES = [
  {
    id: 'partner',
    label: 'Partnership',
    icon: Handshake,
    email: 'partner@soccerex.com',
    desc: 'Sponsorship, strategic partnerships, and commercial opportunities.',
    fields: ['organization', 'country'],
  },
  {
    id: 'speaker',
    label: 'Speaker',
    icon: Mic,
    email: 'talks@soccerex.com',
    desc: 'Propose yourself or someone you represent as a Soccerex speaker.',
    fields: ['organization', 'speakerBio', 'linkedin'],
  },
  {
    id: 'press',
    label: 'Press & Media',
    icon: Newspaper,
    email: 'press@soccerex.com',
    desc: 'Media accreditation, interview requests, and press releases.',
    fields: ['organization', 'role', 'outlet', 'deadline'],
  },
  {
    id: 'exhibit',
    label: 'Exhibit',
    icon: Store,
    email: 'exhibit@soccerex.com',
    desc: 'Stand space, brand activations, and exhibitor packages.',
    fields: ['organization', 'role', 'country', 'productType'],
  },
  {
    id: 'volunteer',
    label: 'Volunteer',
    icon: Heart,
    email: 'enquiries@soccerex.com',
    desc: 'Join the Soccerex crew and help deliver our flagship events.',
    fields: ['role', 'country', 'availability', 'languages'],
  },
  {
    id: 'host',
    label: 'Host an Event',
    icon: MapPin,
    email: 'partner@soccerex.com',
    desc: 'Bring a Soccerex event to your city, region, or venue.',
    fields: ['organization', 'role', 'country', 'venueName'],
  },
  {
    id: 'general',
    label: 'General',
    icon: MessageCircle,
    email: 'enquiries@soccerex.com',
    desc: 'Anything else on your mind. We will route it to the right team.',
    fields: [],
  },
]

// Conditional field definitions
const FIELD_DEFS = {
  organization: { label: 'Organization / Company', placeholder: 'Your company or organization', type: 'text' },
  role: { label: 'Your Role', placeholder: 'Title or position', type: 'text' },
  country: { label: 'Country', placeholder: 'Where you are based', type: 'text' },
  partnershipType: {
    label: 'Partnership Type', type: 'select',
    options: ['', 'Title / Headline Sponsor', 'Category Sponsor', 'Media Partner', 'Technology Partner', 'Hospitality Partner', 'Other'],
  },
  budget: {
    label: 'Indicative Budget Range (USD)', type: 'select',
    options: ['', 'Under $25k', '$25k – $50k', '$50k – $100k', '$100k – $250k', '$250k+', 'Prefer not to say'],
  },
  event: {
    label: 'Which Event', type: 'select',
    options: ['', 'Soccerex Europe 2026 (Amsterdam)', 'Soccerex Miami', 'Soccerex MENA', 'Multiple events', 'Not sure yet'],
  },
  attendeeCount: {
    label: 'Approx. Number of Attendees', type: 'select',
    options: ['', '1', '2 – 5', '6 – 10', '11 – 25', '25+'],
  },
  topicArea: {
    label: 'Speaking Topic Area', type: 'select',
    options: ['', 'Commercial & Sponsorship', 'Broadcasting & Media', 'Technology & Innovation', 'Performance & Analytics', 'Fan Engagement', 'Governance & Regulation', 'Ownership & Investment', 'Women\'s Football', 'Youth Development', 'Other'],
  },
  speakerBio: { label: 'Short Bio', placeholder: 'A few sentences about the speaker\'s background', type: 'textarea', rows: 3 },
  linkedin: { label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/...', type: 'url' },
  outlet: { label: 'Publication / Outlet', placeholder: 'Name of your media outlet', type: 'text' },
  deadline: { label: 'Deadline (if any)', placeholder: 'e.g. next Friday', type: 'text' },
  productType: { label: 'Product / Service Category', placeholder: 'What you plan to showcase', type: 'text' },
  availability: { label: 'Event Availability', placeholder: 'Which events and dates you are available for', type: 'text' },
  languages: { label: 'Languages Spoken', placeholder: 'e.g. English, Spanish, Arabic', type: 'text' },
  venueName: { label: 'Venue / City', placeholder: 'Proposed host city or venue', type: 'text' },
}

// ═══ Scroll animations ═══════════════════════════════════════════════════════
function useScrollAnimations() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }) },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.fade-up, .slide-left, .slide-right, .scale-up').forEach((el) => {
      if (!el.classList.contains('visible')) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])
}

// ═══ Main component ═══════════════════════════════════════════════════════════
export default function Contact() {
  useScrollAnimations()
  useEffect(() => { window.scrollTo(0, 0) }, [])

  const [selectedType, setSelectedType] = useState(null)
  const [form, setForm] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const inquiry = INQUIRY_TYPES.find((t) => t.id === selectedType)

  // When user picks a type, smooth-scroll the form into view after its entrance animation starts
  useEffect(() => {
    if (selectedType) {
      const t = setTimeout(() => {
        const el = document.getElementById('contact-form-panel')
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 250)
      return () => clearTimeout(t)
    }
  }, [selectedType])

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    // Compose a structured email body
    const lines = [
      `Inquiry Type: ${inquiry.label}`,
      '',
      `Name: ${form.firstName || ''} ${form.lastName || ''}`.trim(),
      `Email: ${form.email || ''}`,
    ]
    if (form.phone) lines.push(`Phone: ${form.phone}`)
    lines.push('')
    // Conditional fields
    inquiry.fields.forEach((key) => {
      const def = FIELD_DEFS[key]
      if (form[key]) lines.push(`${def.label}: ${form[key]}`)
    })
    lines.push('')
    lines.push('Message:')
    lines.push(form.message || '')
    lines.push('')
    lines.push('---')
    lines.push('Sent via soccerex.com/contact')

    const subject = `[${inquiry.label}] Inquiry from ${form.firstName || ''} ${form.lastName || ''}`.trim()
    const body = encodeURIComponent(lines.join('\n'))
    const href = `mailto:${inquiry.email}?subject=${encodeURIComponent(subject)}&body=${body}`
    window.location.href = href
    setSubmitted(true)
  }

  return (
    <div style={{ background: '#050d1a' }}>

      {/* ═══ HERO ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden flex items-center justify-center" style={{ minHeight: '55vh' }}>
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at top, #0d2b52 0%, #050d1a 70%)',
        }} />
        <NetworkNodes color="#bfb170" nodeCount={35} opacity={0.15} />
        <div className="absolute pointer-events-none" style={{ top: '15%', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '800px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(191,177,112,0.1) 0%, transparent 60%)' }} />
        <div className="relative z-10 text-center" style={{ maxWidth: '900px', padding: 'clamp(140px,15vw,200px) clamp(24px,5vw,80px) clamp(60px,8vw,100px)' }}>
          <p className="section-label text-gold mb-5 fade-up">GET IN TOUCH</p>
          <h1 className="font-heading font-bold text-white leading-[1.05] mb-6 fade-up text-glow" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)' }}>
            Let's Talk{' '}
            <span style={{ color: 'var(--color-gold)' }}>Football Business</span>
          </h1>
          <div className="fade-up mx-auto mb-6" style={{ width: '100px', height: '3px', background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)' }} />
          <p className="font-body text-white/70 leading-relaxed fade-up mx-auto" style={{ fontSize: 'clamp(1rem, 1.4vw, 1.15rem)', maxWidth: '680px' }}>
            Partner with us, join as a speaker, register as press, volunteer, or just ask a question. Tell us who you are and we'll route your message to the right team.
          </p>
        </div>
      </section>

      <PixelDivider color="#f4f3f0" layers={4} height={90} speed={0.5} />

      {/* ═══ FORM ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: 'clamp(80px,10vw,140px) clamp(24px,5vw,80px)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(9,32,62,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(9,32,62,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="relative z-10" style={{ maxWidth: '980px', margin: '0 auto' }}>

          {/* Step 1: Inquiry type picker */}
          <div className="mb-10">
            <p className="font-mono uppercase tracking-[0.15em] mb-5 fade-up" style={{ fontSize: '0.72rem', color: '#09203e', fontWeight: 600 }}>
              Step 1 : What brings you here?
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {INQUIRY_TYPES.map((t) => {
                const Icon = t.icon
                const active = t.id === selectedType
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => { setSelectedType(t.id); setSubmitted(false) }}
                    className="fade-up"
                    style={{
                      background: active ? '#09203e' : '#fff',
                      color: active ? '#fff' : '#09203e',
                      border: `1px solid ${active ? '#09203e' : 'rgba(9,32,62,0.12)'}`,
                      borderRadius: '12px',
                      padding: '20px 16px',
                      cursor: 'pointer',
                      transition: 'all 0.25s',
                      textAlign: 'left',
                      boxShadow: active ? '0 14px 36px rgba(9,32,62,0.25)' : '0 4px 14px rgba(9,32,62,0.06)',
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.borderColor = '#bfb170'
                        e.currentTarget.style.transform = 'translateY(-3px)'
                        e.currentTarget.style.boxShadow = '0 12px 28px rgba(9,32,62,0.12)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.borderColor = 'rgba(9,32,62,0.12)'
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = '0 4px 14px rgba(9,32,62,0.06)'
                      }
                    }}
                  >
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '9px',
                      background: active ? '#bfb170' : 'rgba(191,177,112,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '12px',
                    }}>
                      <Icon size={18} color={active ? '#09203e' : '#bfb170'} strokeWidth={2.2} />
                    </div>
                    <p className="font-heading font-bold" style={{ fontSize: '1rem' }}>{t.label}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Step 2: Form (appears after selection with animation) */}
          <div id="contact-form-panel" className="contact-form-wrap" data-open={selectedType ? 'true' : 'false'}>
          {selectedType && (
          <form key={selectedType} onSubmit={handleSubmit} className="contact-form-panel" style={{
            background: '#fff',
            borderRadius: '16px',
            padding: 'clamp(28px,4vw,48px)',
            border: '1px solid rgba(9,32,62,0.08)',
            boxShadow: '0 20px 60px rgba(9,32,62,0.08)',
          }}>
            <div className="flex items-start gap-3 mb-8" style={{ paddingBottom: '22px', borderBottom: '1px solid rgba(9,32,62,0.08)' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'linear-gradient(135deg, #bfb170, #d4c78e)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <inquiry.icon size={20} color="#09203e" strokeWidth={2.2} />
              </div>
              <div>
                <p className="font-mono uppercase tracking-[0.12em]" style={{ fontSize: '0.68rem', color: '#bfb170', fontWeight: 600, marginBottom: '4px' }}>
                  Step 2 : Your Details
                </p>
                <h3 className="font-heading font-bold" style={{ fontSize: '1.25rem', color: '#09203e', marginBottom: '2px' }}>{inquiry.label}</h3>
                <p className="font-body" style={{ fontSize: '0.88rem', color: '#666' }}>{inquiry.desc}</p>
              </div>
            </div>

            {/* Always-visible fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField icon={User} label="First Name" required value={form.firstName || ''} onChange={(v) => updateField('firstName', v)} />
              <FormField icon={User} label="Last Name" required value={form.lastName || ''} onChange={(v) => updateField('lastName', v)} />
              <FormField icon={Mail} label="Email" type="email" required value={form.email || ''} onChange={(v) => updateField('email', v)} />
              <FormField icon={Phone} label="Phone (optional)" type="tel" value={form.phone || ''} onChange={(v) => updateField('phone', v)} />
            </div>

            {/* Conditional fields */}
            {inquiry.fields.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {inquiry.fields.map((key) => {
                  const def = FIELD_DEFS[key]
                  if (!def) return null
                  if (def.type === 'select') {
                    return (
                      <div key={key} style={{ gridColumn: key === 'speakerBio' ? '1 / -1' : 'auto' }}>
                        <label className="font-mono uppercase tracking-[0.1em] block mb-2" style={{ fontSize: '0.68rem', color: '#09203e', fontWeight: 600 }}>{def.label}</label>
                        <select
                          value={form[key] || ''}
                          onChange={(e) => updateField(key, e.target.value)}
                          style={{
                            width: '100%', padding: '13px 14px',
                            fontSize: '0.92rem', fontFamily: 'Inter, sans-serif',
                            background: '#f8f7f4',
                            border: '1px solid rgba(9,32,62,0.12)',
                            borderRadius: '8px', color: '#09203e',
                            outline: 'none', transition: 'border-color 0.2s, background 0.2s',
                            cursor: 'pointer',
                          }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = '#bfb170'; e.currentTarget.style.background = '#fff' }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(9,32,62,0.12)'; e.currentTarget.style.background = '#f8f7f4' }}
                        >
                          {def.options.map((opt) => (
                            <option key={opt} value={opt}>{opt || 'Select an option'}</option>
                          ))}
                        </select>
                      </div>
                    )
                  }
                  if (def.type === 'textarea') {
                    return (
                      <div key={key} style={{ gridColumn: '1 / -1' }}>
                        <FormField icon={FileText} label={def.label} placeholder={def.placeholder} textarea rows={def.rows || 3} value={form[key] || ''} onChange={(v) => updateField(key, v)} />
                      </div>
                    )
                  }
                  return (
                    <FormField
                      key={key}
                      icon={key === 'organization' ? Building2 : User}
                      label={def.label}
                      placeholder={def.placeholder}
                      type={def.type}
                      value={form[key] || ''}
                      onChange={(v) => updateField(key, v)}
                    />
                  )
                })}
              </div>
            )}

            {/* Message */}
            <div className="mb-6">
              <FormField
                icon={MessageCircle}
                label="Your Message"
                required
                textarea
                rows={5}
                placeholder="Tell us more about what you have in mind..."
                value={form.message || ''}
                onChange={(v) => updateField('message', v)}
              />
            </div>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
              <p className="font-body" style={{ fontSize: '0.78rem', color: '#888', maxWidth: '400px', lineHeight: 1.5 }}>
                By submitting, your message opens in your email client ready to send to{' '}
                <span style={{ color: '#bfb170', fontWeight: 600 }}>{inquiry.email}</span>.
              </p>
              <button type="submit" className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em] whitespace-nowrap"
                style={{ background: '#bfb170', color: '#09203e', padding: '16px 36px', fontSize: '0.82rem', border: 'none', cursor: 'pointer', transition: 'all 0.25s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#d4c78e' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#bfb170' }}
              >
                {submitted ? <><Check size={16} /> Sent</> : <>Send Message <ArrowRight size={16} /></>}
              </button>
            </div>
          </form>
          )}
          {/* Empty-state hint before a selection is made */}
          {!selectedType && (
            <div className="contact-empty-hint" style={{
              textAlign: 'center',
              padding: '60px 20px',
              border: '2px dashed rgba(9,32,62,0.12)',
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.5)',
            }}>
              <p className="font-mono uppercase tracking-[0.15em]" style={{ fontSize: '0.72rem', color: '#bfb170', fontWeight: 600, marginBottom: '10px' }}>
                ← Pick a category above
              </p>
              <p className="font-body" style={{ fontSize: '0.95rem', color: '#666' }}>
                Your form will appear here once you tell us what you're reaching out about.
              </p>
            </div>
          )}
          </div>

          {/* Direct email fallback list */}
          <div className="mt-12 text-center fade-up">
            <p className="font-mono uppercase tracking-[0.15em] mb-4" style={{ fontSize: '0.7rem', color: '#666', fontWeight: 600 }}>Prefer direct email?</p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {[
                { label: 'Partnerships', email: 'partner@soccerex.com' },
                { label: 'Speakers', email: 'talks@soccerex.com' },
                { label: 'Press', email: 'press@soccerex.com' },
                { label: 'Exhibit', email: 'exhibit@soccerex.com' },
                { label: 'General', email: 'enquiries@soccerex.com' },
              ].map((l) => (
                <a key={l.email} href={`mailto:${l.email}`} className="inline-flex items-center gap-1.5"
                  style={{ color: '#09203e', textDecoration: 'none', fontSize: '0.82rem', transition: 'color 0.2s', fontFamily: 'Inter, sans-serif' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#bfb170' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#09203e' }}
                >
                  <Mail size={13} /> {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// ═══ FormField helper ═════════════════════════════════════════════════════════
function FormField({ icon: Icon, label, placeholder, type = 'text', required, textarea, rows = 3, value, onChange }) {
  return (
    <div>
      <label className="font-mono uppercase tracking-[0.1em] block mb-2" style={{ fontSize: '0.68rem', color: '#09203e', fontWeight: 600 }}>
        {label}{required && <span style={{ color: '#bfb170', marginLeft: '4px' }}>*</span>}
      </label>
      <div style={{ position: 'relative' }}>
        {Icon && !textarea && (
          <Icon size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#bfb170', pointerEvents: 'none' }} />
        )}
        {textarea ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            required={required}
            style={{
              width: '100%', padding: '13px 14px',
              fontSize: '0.92rem', fontFamily: 'Inter, sans-serif',
              background: '#f8f7f4',
              border: '1px solid rgba(9,32,62,0.12)',
              borderRadius: '8px', color: '#09203e',
              outline: 'none', transition: 'border-color 0.2s, background 0.2s',
              resize: 'vertical', minHeight: '100px',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#bfb170'; e.currentTarget.style.background = '#fff' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(9,32,62,0.12)'; e.currentTarget.style.background = '#f8f7f4' }}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            style={{
              width: '100%', padding: '13px 14px 13px 38px',
              fontSize: '0.92rem', fontFamily: 'Inter, sans-serif',
              background: '#f8f7f4',
              border: '1px solid rgba(9,32,62,0.12)',
              borderRadius: '8px', color: '#09203e',
              outline: 'none', transition: 'border-color 0.2s, background 0.2s',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#bfb170'; e.currentTarget.style.background = '#fff' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(9,32,62,0.12)'; e.currentTarget.style.background = '#f8f7f4' }}
          />
        )}
      </div>
    </div>
  )
}
