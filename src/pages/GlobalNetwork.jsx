import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Globe, Handshake, Megaphone, ArrowRight, Mail, Newspaper, TrendingUp, MapPin } from 'lucide-react'
import NetworkNodes from '../animations/NetworkNodes'
import PixelDivider from '../components/PixelDivider'

// ─── Full logo inventory (228 logos from soccerex.com/global-network) ───────
const LOGOS = [
  "/images/global-network/2024_Copa_Am_rica_logo_svg_1.png",
  "/images/global-network/2026_FIFA_World_Cup_emblem_svg_1.png",
  "/images/global-network/500px_SL_Benfica_logo_svg_1.png",
  "/images/global-network/827c6d_3e671e098c1e4e9b9966188967f30363_mv2_1.png",
  "/images/global-network/ACFC_Crest_Primary_Sol_Rosa_d6e24aecadc24acdb81ddb8a7fee8aa4_1.png",
  "/images/global-network/AEK_Athens_1.png",
  "/images/global-network/AZ_Alkmaar_svg_1.png",
  "/images/global-network/Adidas.jpg",
  "/images/global-network/Ajax_Amsterdam_svg_1.png",
  "/images/global-network/Argentine_American_Chamber_of_Commerce_of_Florida_Logo_1.png",
  "/images/global-network/Arsenal_FC_1.png",
  "/images/global-network/Associa_o_de_Futebol_das_Bermudas_1.png",
  "/images/global-network/Astonvilla.png",
  "/images/global-network/Atletico_Mineiro_1.png",
  "/images/global-network/Bein_mediagroup_logo_1.png",
  "/images/global-network/Belgium_National_Football_Team_Logo_1.png",
  "/images/global-network/Bologna_1.png",
  "/images/global-network/Borussia_Dortmund_1.png",
  "/images/global-network/Brighton_and_Hove_Albion_FC_crest_svg_1.png",
  "/images/global-network/CBS_1.png",
  "/images/global-network/Chicago_Fire_logo_2021_svg_1.png",
  "/images/global-network/Club_Am_rica.png",
  "/images/global-network/Club_Tijuana_Gallos_de_Caliente_logo_C72C4CAB69_seeklogo_com_2_1.png",
  "/images/global-network/Concacaf_1.png",
  "/images/global-network/Crystal_Palace_FC_logo_2022_svg_1.png",
  "/images/global-network/Egyptian.png",
  "/images/global-network/Eintracht_Frankfurt_Logo_svg_1.png",
  "/images/global-network/Escudo_de_Estudiantes_de_La_Plata_svg_1.png",
  "/images/global-network/FC_Barcelona_crest_svg_1.png",
  "/images/global-network/FC_Internazionale_Milano_2021_svg_1.png",
  "/images/global-network/FC_Porto_1.png",
  "/images/global-network/FC_Zenit_2_star_2023_logo_1.png",
  "/images/global-network/FIFA_logo_without_slogan_svg_1.png",
  "/images/global-network/FKF_LOGO_1.png",
  "/images/global-network/F_d_ration_d_Egypte_de_handball_logo_1.png",
  "/images/global-network/Forbes_Logo_1.png",
  "/images/global-network/Fox_SportsLogo_1.png",
  "/images/global-network/GYM_Network_Logo_1.png",
  "/images/global-network/GYugbQDXcAArzRA_1.png",
  "/images/global-network/Gloucester_city_afc_logo_1.png",
  "/images/global-network/Go_Ahead_Eagles_logo_2002_2015_1.png",
  "/images/global-network/Gooztepe_1.png",
  "/images/global-network/GreatFutureStories_Logo_1.png",
  "/images/global-network/GrintafyPartners_0_1.png",
  "/images/global-network/Group_1.png",
  "/images/global-network/Group_2.png",
  "/images/global-network/Group_3.png",
  "/images/global-network/Group_4.png",
  "/images/global-network/Group_5.png",
  "/images/global-network/Group_6.png",
  "/images/global-network/Group_7.png",
  "/images/global-network/Group_8.png",
  "/images/global-network/HB_Koge_logo_svg_1.png",
  "/images/global-network/Helwan_University_Logo_1.png",
  "/images/global-network/Houston_Dynamo_FC_logo_svg_1.png",
  "/images/global-network/IFFHS_HD_logo_1.png",
  "/images/global-network/IMG_1104_PNG_png_1.png",
  "/images/global-network/IMG_1_1.png",
  "/images/global-network/IMG_Arena_1.png",
  "/images/global-network/IMG_GradLogo_Black_RGB_1.png",
  "/images/global-network/JJM2bNUs_400x400_1.png",
  "/images/global-network/Johan_Cruijff_ArenA_logo_1.png",
  "/images/global-network/Juventus_FC_2017_logo_1.png",
  "/images/global-network/KAS_Eupen_logo_svg_1.png",
  "/images/global-network/Kansas_City_Current_logo_svg_1.png",
  "/images/global-network/Kapital_Football_Partners_1.png",
  "/images/global-network/Koppa_1.png",
  "/images/global-network/Kwikgoal_1.png",
  "/images/global-network/LaLiga_TV_Por_M_Logo_1.png",
  "/images/global-network/La_liga_new_logo_1.png",
  "/images/global-network/Liberia_FA_1.png",
  "/images/global-network/Ligue_de_Football_Professionnel_logo_2_svg_1.png",
  "/images/global-network/Lili_Cantero_Transparent_Logo_1.png",
  "/images/global-network/LiveU_Logo_On_Whtite_1.png",
  "/images/global-network/Liverpool_FC_1.png",
  "/images/global-network/LogoASMonacoFC2021_svg_1.png",
  "/images/global-network/Logo_ALCOR_EQUIPEMENTS_v3_300dpi_png_1.png",
  "/images/global-network/Logo_Egyptian_Squash_Association_1.png",
  "/images/global-network/Logo_Greater_Manchester_FC_01_2.png",
  "/images/global-network/Logo_Univision_2019_svg_1.png",
  "/images/global-network/Logo_copy_1.png",
  "/images/global-network/Logo_ekstraklasa_1.png",
  "/images/global-network/Logo_gmp_RGB_red_1.png",
  "/images/global-network/Long_Island_soccer_1.png",
  "/images/global-network/MLS_Next_logo_1.png",
  "/images/global-network/Manchester_City_FC_badge_svg_1.png",
  "/images/global-network/Marilia_football_1.png",
  "/images/global-network/Marka_1.png",
  "/images/global-network/Marlee_Capital_Logo_1.png",
  "/images/global-network/Millwall_FC_crest_svg_1.png",
  "/images/global-network/NWSL.png",
  "/images/global-network/Nigeria.png",
  "/images/global-network/Norwich_City_1.png",
  "/images/global-network/OneFootball.png",
  "/images/global-network/PSG_logo_1.png",
  "/images/global-network/Preston_North_End_FC_svg_1.png",
  "/images/global-network/Qatar_Football_Association_logo_svg_1.png",
  "/images/global-network/Racing_Club_1.png",
  "/images/global-network/Real_Madrid2.png",
  "/images/global-network/Rezzil_Logo_1.png",
  "/images/global-network/Right_to_dream_logo_2021_1.png",
  "/images/global-network/Royal_Netherlands_Football_Association_Logo_svg_1.png",
  "/images/global-network/Rush_1.png",
  "/images/global-network/SFWC26_WEB_HEADER_LOGO_1.png",
  "/images/global-network/SF_Glens_1.png",
  "/images/global-network/SI_Linear_CMYK_1.png",
  "/images/global-network/SJ_earthquakes_1.png",
  "/images/global-network/SV9ohy72TVGL4clmnyf7_92C4AD5E_8234_4EEA_901F_D22EEFAC3D82_1.png",
  "/images/global-network/SabrinaComms_Logo_1.png",
  "/images/global-network/Samba_Digital_1.png",
  "/images/global-network/San_Diego_FC_logo_svg_1.png",
  "/images/global-network/Saudi_Arabia_national_football_team_logo_svg_1.png",
  "/images/global-network/Scottish_Football_Association_Logo_svg_1.png",
  "/images/global-network/Soccer5_Logo_1.png",
  "/images/global-network/Soccer_Parenting_Logo_1.png",
  "/images/global-network/South_Florida_Football_Academy_1.png",
  "/images/global-network/Sponsor_United_Logo_1.png",
  "/images/global-network/Sport_Business_1.png",
  "/images/global-network/Sportfive_logo_2021_svg_1.png",
  "/images/global-network/Sportian_1.png",
  "/images/global-network/SportsBranded_Logo_1.png",
  "/images/global-network/Stade_Rennais_FC_svg_1.png",
  "/images/global-network/Statathlon_Logo_Web_2.png",
  "/images/global-network/Supreme_Committee_for_Delivery_Legacy_1.png",
  "/images/global-network/Telemundo_logo_2018_svg_1.png",
  "/images/global-network/The_Cooligans_logo_1_1.png",
  "/images/global-network/The_Economist_Logo_svg_1_1.png",
  "/images/global-network/The_Players_Tribune_logo_svg_1.png",
  "/images/global-network/The_Third_Rail_Logo_1.png",
  "/images/global-network/The_US_Sun_1.png",
  "/images/global-network/Ticket_Time_Machine_Logo_1.png",
  "/images/global-network/TikTok_logo_svg_1.png",
  "/images/global-network/Tottenham_Hotspur_1.png",
  "/images/global-network/Triumph_Sports_Foundation_Logo_1.png",
  "/images/global-network/UEFA_logo_1.png",
  "/images/global-network/UPSL_1.png",
  "/images/global-network/Untitled_design_41_large_1.png",
  "/images/global-network/VL_RGB_Primary_FullColor_54bfc7e1_6561_4458_a2cd_d03bbe8b7915_1.png",
  "/images/global-network/VVoxXGRM_400x400_1.png",
  "/images/global-network/VYSA_1.png",
  "/images/global-network/VfB_Stuttgart_logo_1.png",
  "/images/global-network/Vovovo_FC_Logo_1.png",
  "/images/global-network/WAFF_1.png",
  "/images/global-network/West_Bromwich_Albion_Logo_1.png",
  "/images/global-network/World_Cup_Seattle.png",
  "/images/global-network/XL_1.png",
  "/images/global-network/Yahoo_Sports_New_Logo_1.png",
  "/images/global-network/Zimbabwe_Football_Association_1.png",
  "/images/global-network/atletico_de_madrid_1.png",
  "/images/global-network/brazil_1_1.png",
  "/images/global-network/brentford_1.png",
  "/images/global-network/cf23eb538ef560076b4910e3eed2445a_1.png",
  "/images/global-network/commebol.png",
  "/images/global-network/electronic_arts_1_logo_png_transparent_1.png",
  "/images/global-network/fiorentina_1.png",
  "/images/global-network/granada_1.png",
  "/images/global-network/h0Q4H1Fg_400x400_1.png",
  "/images/global-network/helmond_sport_logo_png_seeklogo_66231_1.png",
  "/images/global-network/image_asset_1.png",
  "/images/global-network/images_10_1.png",
  "/images/global-network/images_11_1.png",
  "/images/global-network/images_1_1.png",
  "/images/global-network/images_1_2.png",
  "/images/global-network/images_1_3.png",
  "/images/global-network/images_1_copy_2_1.png",
  "/images/global-network/images_1_copy_3.png",
  "/images/global-network/images_2.png",
  "/images/global-network/images_2_1.png",
  "/images/global-network/images_2_1_1.png",
  "/images/global-network/images_2_2.png",
  "/images/global-network/images_2_2_1.png",
  "/images/global-network/images_2_3.png",
  "/images/global-network/images_2_3_1.png",
  "/images/global-network/images_2_4_1.png",
  "/images/global-network/images_2_5_1.png",
  "/images/global-network/images_2_copy_1.png",
  "/images/global-network/images_3_1.png",
  "/images/global-network/images_3_2.png",
  "/images/global-network/images_3_3.png",
  "/images/global-network/images_4.png",
  "/images/global-network/images_4_1.png",
  "/images/global-network/images_5_1.png",
  "/images/global-network/images_6_copy_1.png",
  "/images/global-network/images_7_1.png",
  "/images/global-network/images_8_1.png",
  "/images/global-network/images_9_1.png",
  "/images/global-network/images_copy_2_1.png",
  "/images/global-network/images_copy_3_1.png",
  "/images/global-network/images_copy_4.png",
  "/images/global-network/images_copy_5.png",
  "/images/global-network/imagn_mainII_1_1.png",
  "/images/global-network/img_2691_high_png_1.png",
  "/images/global-network/intavision_media_logo_1.png",
  "/images/global-network/inter_miami_cf_logo_3D46B8A7DE_seeklogo_com_1.png",
  "/images/global-network/iqdigital_1.png",
  "/images/global-network/itf_logo_black_small_1.png",
  "/images/global-network/ittihad.png",
  "/images/global-network/jamaica_1.png",
  "/images/global-network/juarez_1.png",
  "/images/global-network/kisspng_charlton_athletic_f_c_emblem_wall_decal_organizat_england_football_5b5405f9ca5cd2_4765459115322332098289_1.png",
  "/images/global-network/kisspng_ghana_national_football_team_ghana_premier_league_5c040c565668d4_3998509315437691743539_1.png",
  "/images/global-network/klabu_logo_56E13FFB80_seeklogo_com_1.png",
  "/images/global-network/logoHORIZONTALazul_1.png",
  "/images/global-network/logo_1.png",
  "/images/global-network/logo_2.png",
  "/images/global-network/logo_Miami_FC_2_copy_1.png",
  "/images/global-network/logo_copy_2_1.png",
  "/images/global-network/logo_lasuperdeportiva_88_1.png",
  "/images/global-network/m9yhf29W_400x400_1.png",
  "/images/global-network/marketing_logo_1.png",
  "/images/global-network/meyba2.png",
  "/images/global-network/mls_1.png",
  "/images/global-network/mls_logo_png_transparent_1.png",
  "/images/global-network/mslrmcxxpsnxqjrs4a1i_1.png",
  "/images/global-network/nike.jpg",
  "/images/global-network/orlando_city_sc_logo_1.png",
  "/images/global-network/paramount_plus_logo_1_1.png",
  "/images/global-network/png_clipart_sudan_national_football_team_sudan_football_association_africa_cup_of_nations_algeria_national_football_team_football_emblem_logo_thumbnail_1.png",
  "/images/global-network/psv_eindhoven_logo_C72631179E_seeklogo_com_1.png",
  "/images/global-network/red_bull_leipzig_logo_png_transparent_1.png",
  "/images/global-network/sd_192_1.png",
  "/images/global-network/seattle_sounders_fc_logo_transparent_1.png",
  "/images/global-network/spokane_1.png",
  "/images/global-network/tigres_1.png",
  "/images/global-network/transparant_Wit_1.png",
  "/images/global-network/tudu_1.png",
  "/images/global-network/unnamed_1.png",
  "/images/global-network/vancouver_whitecaps_fc_logo_1.png",
]

// Shuffle helper for varied rows
function shuffle(arr, seed = 1) {
  const a = [...arr]
  let s = seed
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280
    const j = Math.floor((s / 233280) * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Split into marquee rows
const ROW_SIZE = Math.ceil(LOGOS.length / 4)
const ROW_1 = shuffle(LOGOS, 7).slice(0, ROW_SIZE)
const ROW_2 = shuffle(LOGOS, 23).slice(0, ROW_SIZE)
const ROW_3 = shuffle(LOGOS, 41).slice(0, ROW_SIZE)
const ROW_4 = shuffle(LOGOS, 59).slice(0, ROW_SIZE)

// Featured/marquee grouping for grid section (all logos, shuffled for balance)
const ALL_SHUFFLED = shuffle(LOGOS, 101)

// Pillars of engagement
const PILLARS = [
  { icon: Users, label: 'ATTEND', desc: 'Tap into three decades of meaningful football business relationships.' },
  { icon: Megaphone, label: 'SPONSOR', desc: 'Align your brand with the global leaders shaping football\'s future.' },
  { icon: Globe, label: 'EXHIBIT', desc: 'Showcase your products and services to the industry\'s most influential buyers.' },
  { icon: Handshake, label: 'CONNECT', desc: 'Build the partnerships that will define the next era of the game.' },
]

// Stats bar numbers
const NETWORK_STATS = [
  { num: '228', label: 'Global Partners' },
  { num: '55', label: 'Physical Events' },
  { num: '79k+', label: 'Delegates' },
  { num: '24', label: 'Host Cities' },
]

// ─── Animated counter ──────────────────────────────────────────────────────
function AnimatedCounter({ target }) {
  const ref = useRef(null)
  const counted = useRef(false)
  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !counted.current) {
        counted.current = true
        const numericTarget = parseInt(target.replace(/[^0-9]/g, ''))
        const hasPlus = target.includes('+')
        const hasK = target.includes('k')
        const duration = 2000
        const start = performance.now()
        const animate = (now) => {
          const elapsed = now - start
          const progress = Math.min(elapsed / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          const current = Math.floor(numericTarget * eased)
          el.textContent = current + (hasK ? 'k' : '') + (hasPlus ? '+' : '')
          if (progress < 1) requestAnimationFrame(animate)
          else el.textContent = target
        }
        requestAnimationFrame(animate)
      }
    }, { threshold: 0.3 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])
  return <span ref={ref}>0</span>
}

// ─── Scroll animations hook ────────────────────────────────────────────────
function useScrollAnimations(dep) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }) },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.fade-up, .slide-left, .slide-right, .scale-up, .blur-reveal').forEach((el) => {
      if (!el.classList.contains('visible')) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [dep])
}

// ─── Marquee row ───────────────────────────────────────────────────────────
function LogoMarquee({ logos, direction = 'left', duration = 80 }) {
  return (
    <div className="gn-marquee" style={{ maskImage: 'linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)', WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 8%, #000 92%, transparent 100%)' }}>
      <div className={`gn-marquee-track ${direction === 'right' ? 'gn-marquee-reverse' : ''}`} style={{ animationDuration: `${duration}s` }}>
        {[...logos, ...logos].map((src, i) => (
          <div key={i} className="gn-marquee-item">
            <img src={src} alt="" loading="lazy" />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────
export default function GlobalNetwork() {
  const [showAll, setShowAll] = useState(false)
  useScrollAnimations(showAll)
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const visibleGrid = showAll ? ALL_SHUFFLED : ALL_SHUFFLED.slice(0, 96)

  return (
    <div style={{ background: '#050d1a' }}>

      {/* ═══ HERO ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden flex items-center justify-center" style={{ minHeight: '85vh' }}>
        {/* Background image */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'url(/hero/234-NEW8-aerial-diverse-crowd-networking.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'saturate(0.6) brightness(0.35)',
        }} />
        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, rgba(5,13,26,0.65) 0%, rgba(9,32,62,0.75) 40%, rgba(5,13,26,0.9) 100%)',
        }} />
        <NetworkNodes color="#bfb170" nodeCount={45} opacity={0.18} />
        {/* Radial gold glow */}
        <div className="absolute pointer-events-none" style={{ top: '15%', left: '50%', transform: 'translateX(-50%)', width: '900px', height: '900px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(191,177,112,0.1) 0%, transparent 60%)' }} />

        <div className="relative z-10 text-center" style={{ maxWidth: '1000px', padding: 'clamp(140px,15vw,200px) clamp(24px,5vw,80px) clamp(80px,10vw,120px)' }}>
          <p className="section-label text-gold mb-6 fade-up">GLOBAL NETWORK</p>
          <h1 className="font-heading font-bold text-white leading-[1.02] mb-6 fade-up text-glow" style={{ fontSize: 'clamp(2.5rem, 6.5vw, 5.5rem)' }}>
            The Global Leader in the{' '}
            <span style={{ color: 'var(--color-gold)' }}>Business of Football</span>{' '}
            <span style={{ color: 'var(--color-gold)' }}>Since 1996</span>
          </h1>
          <div className="fade-up mx-auto mb-8" style={{ width: '100px', height: '3px', background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)' }} />
          <p className="font-body text-white/75 leading-relaxed fade-up mx-auto" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', maxWidth: '720px' }}>
            Soccerex events provide the industry's leading professionals with a variety of formal and informal networking platforms, building and strengthening the relationships that shape the global football industry.
          </p>
        </div>
      </section>

      {/* Wave divider: hero → ecosystem */}
      <PixelDivider color="#f4f3f0" layers={4} height={90} speed={0.5} />

      {/* ═══ ECOSYSTEM INTRO ════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(9,32,62,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(9,32,62,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="relative z-10 text-center" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p className="section-label mb-6 fade-up" style={{ color: '#09203e', fontWeight: 600 }}>GLOBAL EVENTS, WHERE THE FOOTBALL WORLD MEETS</p>
          <h2 className="font-heading font-bold leading-tight mb-6 fade-up" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.3rem)', color: '#09203e' }}>
            Soccerex isn't just a company.
          </h2>
          <h3 className="font-heading font-bold leading-tight mb-8 fade-up" style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', color: '#bfb170' }}>
            We're a comprehensive ecosystem.
          </h3>
          <div className="fade-up mx-auto mb-8" style={{ width: '80px', height: '3px', background: 'linear-gradient(90deg, transparent, #09203e, transparent)' }} />
          <p className="font-body leading-relaxed fade-up mx-auto" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', color: '#333', maxWidth: '760px' }}>
            Soccerex empowers and connects the global football industry. As the game continues to evolve, we're here leading the charge, helping to shape the future of football. Join us on this exciting journey.
          </p>
        </div>
      </section>

      {/* Wave divider: ecosystem → pillars */}
      <PixelDivider color="#09203e" layers={4} height={90} speed={0.5} />

      {/* ═══ FOUR PILLARS ═══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #09203e 0%, #0d2b52 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <NetworkNodes color="#bfb170" nodeCount={28} opacity={0.12} />
        <div className="relative z-10" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="text-center mb-16">
            <p className="section-label text-gold mb-4 fade-up">FOUR WAYS TO ENGAGE</p>
            <h2 className="font-heading font-bold text-white leading-tight mb-6 fade-up text-glow" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>
              Tap into Three Decades of{' '}
              <span style={{ color: '#bfb170' }}>Connections</span>
            </h2>
            <div className="fade-up mx-auto" style={{ width: '80px', height: '3px', background: 'linear-gradient(90deg, transparent, #bfb170, transparent)' }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILLARS.map((p, i) => {
              const Icon = p.icon
              return (
                <div key={p.label} className="scale-up" style={{ transitionDelay: `${i * 60}ms` }}>
                  <div style={{
                    background: 'rgba(255,255,255,0.04)', padding: '40px 32px', borderRadius: '16px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                    border: '1px solid rgba(191,177,112,0.15)',
                    backdropFilter: 'blur(10px)',
                    height: '100%', transition: 'transform 0.3s, box-shadow 0.3s, border-color 0.3s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = 'rgba(191,177,112,0.5)'; e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(191,177,112,0.15)'; e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.3)' }}
                  >
                    <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'linear-gradient(135deg, #bfb170, #d4c78e)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                      <Icon size={26} color="#09203e" strokeWidth={2} />
                    </div>
                    <h3 className="font-heading font-bold mb-3" style={{ fontSize: '1.4rem', color: '#fff', letterSpacing: '0.02em' }}>{p.label}</h3>
                    <p className="font-body leading-relaxed" style={{ fontSize: '0.98rem', color: 'rgba(255,255,255,0.7)' }}>{p.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Wave divider: pillars → stats */}
      <PixelDivider color="#09203e" layers={4} height={90} speed={0.5} />

      {/* ═══ STATS BAR ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: '#09203e', padding: 'clamp(60px,8vw,100px) clamp(24px,5vw,80px)' }}>
        <NetworkNodes color="#bfb170" nodeCount={25} opacity={0.12} />
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {NETWORK_STATS.map((s) => (
            <div key={s.label} className="text-center scale-up">
              <p className="font-heading font-bold text-gold" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', lineHeight: 1 }}>
                <AnimatedCounter target={s.num} />
              </p>
              <p className="font-body text-white/50 text-xs uppercase tracking-widest mt-3">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Wave divider: stats → marquee */}
      <PixelDivider color="#09203e" layers={4} height={90} speed={0.6} />

      {/* ═══ LOGO MARQUEE ═══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: 'clamp(80px,10vw,140px) 0' }}>
        <div className="text-center mb-14 px-6">
          <p className="section-label mb-4 fade-up" style={{ color: '#09203e', fontWeight: 600 }}>THREE DECADES OF CONNECTIONS</p>
          <h2 className="font-heading font-bold leading-tight mb-4 fade-up" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', color: '#09203e' }}>
            Partners Across the{' '}
            <span style={{ color: '#bfb170' }}>Football World</span>
          </h2>
          <div className="fade-up mx-auto mb-6" style={{ width: '80px', height: '3px', background: 'linear-gradient(90deg, transparent, #09203e, transparent)' }} />
          <p className="font-body fade-up mx-auto" style={{ fontSize: '1.05rem', color: '#555', maxWidth: '700px' }}>
            Federations, leagues, clubs, brands, broadcasters, investors, technology innovators, and media partners. The global football industry, under one roof.
          </p>
        </div>
        <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <LogoMarquee logos={ROW_1} direction="left" duration={100} />
          <LogoMarquee logos={ROW_2} direction="right" duration={120} />
          <LogoMarquee logos={ROW_3} direction="left" duration={140} />
          <LogoMarquee logos={ROW_4} direction="right" duration={110} />
        </div>
      </section>

      {/* Wave divider: marquee → grid */}
      <PixelDivider color="#eae8e4" layers={4} height={90} speed={0.5} />

      {/* ═══ LOGO GRID ══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #09203e 0%, #050d1a 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <NetworkNodes color="#bfb170" nodeCount={30} opacity={0.1} />
        <div className="relative z-10" style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <div className="text-center mb-16" style={{ maxWidth: '960px', margin: '0 auto 64px' }}>
            <p className="section-label text-gold mb-6 fade-up">THREE DECADES OF CONNECTIONS</p>
            <h2 className="font-heading font-semibold text-white leading-[1.25] fade-up" style={{ fontSize: 'clamp(1.35rem, 2.4vw, 2.1rem)' }}>
              Soccerex events provide the industry's leading professionals with a variety of{' '}
              <span style={{ color: '#bfb170' }}>formal and informal networking platforms</span>
              {' '}to help build and strengthen{' '}
              <span style={{ color: '#bfb170' }}>professional relationships</span>.
            </h2>
            <div className="fade-up mx-auto mt-8" style={{ width: '80px', height: '3px', background: 'linear-gradient(90deg, transparent, #bfb170, transparent)' }} />
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4">
            {visibleGrid.map((src, i) => (
              <div key={src + i} className="gn-grid-cell">
                <img src={src} alt="" loading="lazy" />
              </div>
            ))}
          </div>
          {!showAll && ALL_SHUFFLED.length > 96 && (
            <div className="text-center mt-12 fade-up">
              <button
                onClick={() => setShowAll(true)}
                className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em] cursor-pointer border-none"
                style={{ background: '#bfb170', color: '#09203e', padding: '16px 36px', fontSize: '0.85rem', transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#d4c78e' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#bfb170' }}
              >
                Show more <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Wave divider: grid → newsletter */}
      <PixelDivider color="#050d1a" layers={4} height={90} speed={0.5} />

      {/* ═══ NEWSLETTER (SOCCER EXPERT) ═════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
          {/* Boot image */}
          <div className="slide-left" style={{ minHeight: '420px', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'url(/images/global-network/sections/soccerex-boot.jpg)',
              backgroundSize: 'cover', backgroundPosition: 'center',
            }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(9,32,62,0.1) 0%, transparent 100%)' }} />
          </div>
          {/* Form side */}
          <div className="slide-right flex items-center" style={{ padding: 'clamp(60px,8vw,120px) clamp(32px,6vw,90px)' }}>
            <div style={{ maxWidth: '520px' }}>
              <p className="section-label mb-4 fade-up" style={{ color: '#09203e', fontWeight: 600 }}>THE FOOTBALL BUSINESS E-NEWSLETTER</p>
              <h2 className="font-heading font-bold leading-tight mb-3 fade-up" style={{ fontSize: 'clamp(2rem, 3.8vw, 2.8rem)', color: '#09203e', letterSpacing: '-0.01em' }}>
                SOCCER<span style={{ color: '#bfb170' }}>EXPERT</span>
              </h2>
              <div className="fade-up mb-6" style={{ width: '60px', height: '3px', background: '#bfb170' }} />
              <p className="font-body leading-relaxed mb-3 fade-up" style={{ fontSize: '1.15rem', color: '#09203e', fontWeight: 600 }}>
                Tap in to three decades of connections.
              </p>
              <p className="font-body leading-relaxed mb-8 fade-up" style={{ fontSize: '1rem', color: '#555' }}>
                Subscribe to get the latest commercial details, groundbreaking interviews, and industry analysis, free, straight to your inbox.
              </p>
              <a href="mailto:enquiries@soccerex.com?subject=SoccerExpert%20Newsletter" className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em] fade-up"
                style={{ background: '#09203e', color: '#fff', padding: '16px 36px', fontSize: '0.85rem', textDecoration: 'none', border: '2px solid #09203e', transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#bfb170'; e.currentTarget.style.borderColor = '#bfb170'; e.currentTarget.style.color = '#09203e' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#09203e'; e.currentTarget.style.borderColor = '#09203e'; e.currentTarget.style.color = '#fff' }}
              >
                <Mail size={16} /> Subscribe Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Wave divider: newsletter → insights */}
      <PixelDivider color="#eae8e4" layers={4} height={90} speed={0.5} />

      {/* ═══ INSIGHTS ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #09203e 0%, #050d1a 100%)' }}>
        <NetworkNodes color="#bfb170" nodeCount={25} opacity={0.1} />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-stretch">
          {/* Copy */}
          <div className="slide-left flex items-center" style={{ padding: 'clamp(80px,10vw,140px) clamp(32px,6vw,90px)' }}>
            <div style={{ maxWidth: '560px' }}>
              <p className="section-label text-gold mb-4 fade-up">THE FOOTBALL INDUSTRY'S PULSE</p>
              <h2 className="font-heading font-bold text-white leading-tight mb-4 fade-up text-glow" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                Soccerex's Insights
              </h2>
              <h3 className="font-heading font-semibold leading-tight mb-6 fade-up" style={{ fontSize: 'clamp(1.4rem, 2.4vw, 1.9rem)', color: '#bfb170' }}>
                Stay informed, stay relevant.
              </h3>
              <div className="fade-up mb-6" style={{ width: '60px', height: '3px', background: '#bfb170' }} />
              <p className="font-body leading-relaxed mb-8 fade-up" style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.75)' }}>
                Keeping abreast of the rapidly changing football business environment is key. Our comprehensive newsfeed provides the latest trends and updates from influential industry players. Consider it your one-stop solution for all football industry news.
              </p>
              <a href="https://soccerex.com/insights/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em] fade-up"
                style={{ background: '#bfb170', color: '#09203e', padding: '16px 36px', fontSize: '0.85rem', textDecoration: 'none', transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#d4c78e' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#bfb170' }}
              >
                <Newspaper size={16} /> Read Soccerex Articles
              </a>
            </div>
          </div>
          {/* Image */}
          <div className="slide-right" style={{ minHeight: '480px', position: 'relative', overflow: 'hidden', paddingTop: 'clamp(80px,10vw,140px)' }}>
            <div style={{
              position: 'absolute', left: 0, right: 0, bottom: 0, top: 'clamp(80px,10vw,140px)',
              backgroundImage: 'url(/images/global-network/sections/england-women.webp)',
              backgroundSize: 'cover', backgroundPosition: 'center',
            }} />
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 'clamp(80px,10vw,140px)', background: 'linear-gradient(270deg, rgba(9,32,62,0) 0%, rgba(9,32,62,0.4) 100%)' }} />
          </div>
        </div>
      </section>

      {/* Wave divider: insights → affiliate */}
      <PixelDivider color="#050d1a" layers={4} height={90} speed={0.5} />

      {/* ═══ AFFILIATE PROGRAM ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f4f3f0 0%, #eae8e4 100%)', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(9,32,62,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(9,32,62,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="relative z-10" style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="text-center mb-12">
            <div className="fade-up" style={{ display: 'inline-flex', width: '60px', height: '60px', borderRadius: '14px', background: 'linear-gradient(135deg, #bfb170, #d4c78e)', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <TrendingUp size={28} color="#09203e" strokeWidth={2.2} />
            </div>
            <p className="section-label mb-4 fade-up" style={{ color: '#09203e', fontWeight: 600 }}>THE SOCCEREX AFFILIATE PROGRAM</p>
            <h2 className="font-heading font-bold leading-tight mb-6 fade-up" style={{ fontSize: 'clamp(2rem, 4.2vw, 3.2rem)', color: '#09203e' }}>
              Elevate Your Industry{' '}
              <span style={{ color: '#bfb170' }}>Impact &amp; Influence</span>
            </h2>
            <div className="fade-up mx-auto mb-8" style={{ width: '80px', height: '3px', background: 'linear-gradient(90deg, transparent, #09203e, transparent)' }} />
            <p className="font-body leading-relaxed fade-up mx-auto" style={{ fontSize: 'clamp(1rem, 1.4vw, 1.15rem)', color: '#555', maxWidth: '720px' }}>
              Transform your passion into profit. Earn commissions on ticket sales and exhibitor deals, enjoy VIP event access, and tap into exclusive industry insights.
            </p>
          </div>
          {/* 3 benefit cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
            {[
              { title: 'Earn Commissions', desc: 'Receive a share on every ticket sale and exhibitor deal you refer.' },
              { title: 'VIP Access', desc: 'Unlock exclusive access to Soccerex events and networking zones.' },
              { title: 'Exclusive Insights', desc: 'Get privileged access to industry intelligence and commercial data.' },
            ].map((b, i) => (
              <div key={b.title} className="scale-up" style={{ transitionDelay: `${i * 60}ms`, background: '#fff', padding: '32px 28px', borderRadius: '14px', border: '1px solid rgba(9,32,62,0.06)', boxShadow: '0 10px 30px rgba(9,32,62,0.06)' }}>
                <h4 className="font-heading font-bold mb-2" style={{ fontSize: '1.2rem', color: '#09203e' }}>{b.title}</h4>
                <p className="font-body" style={{ fontSize: '0.95rem', color: '#666', lineHeight: 1.6 }}>{b.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 fade-up">
            <a href="https://soccerex.com/affiliate-program/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em]"
              style={{ background: '#09203e', color: '#fff', padding: '16px 36px', fontSize: '0.85rem', textDecoration: 'none', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#0d2b52' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#09203e' }}
            >
              Learn More
            </a>
            <a href="https://soccerex.com/affiliate-program/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em]"
              style={{ background: '#bfb170', color: '#09203e', padding: '16px 36px', fontSize: '0.85rem', textDecoration: 'none', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#d4c78e' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#bfb170' }}
            >
              Apply Now <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Wave divider: affiliate → host CTA */}
      <PixelDivider color="#050d1a" layers={4} height={90} speed={0.5} />

      {/* ═══ HOST AN EVENT CTA ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: '520px' }}>
        {/* Stadium background */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'url(/images/global-network/sections/stadium-render.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(5,13,26,0.88) 0%, rgba(9,32,62,0.78) 50%, rgba(5,13,26,0.9) 100%)' }} />
        <NetworkNodes color="#bfb170" nodeCount={30} opacity={0.15} />
        <div className="absolute pointer-events-none" style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '900px', height: '900px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(191,177,112,0.12) 0%, transparent 60%)' }} />

        <div className="relative z-10 flex items-center justify-center" style={{ minHeight: '520px', padding: 'clamp(100px,12vw,160px) clamp(24px,5vw,80px)' }}>
          <div className="text-center" style={{ maxWidth: '900px' }}>
            <div className="fade-up" style={{ display: 'inline-flex', width: '64px', height: '64px', borderRadius: '14px', background: 'linear-gradient(135deg, #bfb170, #d4c78e)', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <MapPin size={30} color="#09203e" strokeWidth={2.2} />
            </div>
            <p className="section-label text-gold mb-4 fade-up">PARTNERSHIP OPPORTUNITIES</p>
            <h2 className="font-heading font-bold text-white leading-[1.05] mb-6 fade-up text-glow" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
              To Enquire About Hosting a{' '}
              <span style={{ color: '#bfb170' }}>Soccerex Event in Your City</span>
            </h2>
            <div className="fade-up mx-auto mb-8" style={{ width: '100px', height: '3px', background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)' }} />
            <p className="font-body text-white/75 leading-relaxed fade-up mb-10 mx-auto" style={{ fontSize: 'clamp(1rem, 1.4vw, 1.2rem)', maxWidth: '700px' }}>
              Bring the global football industry to your doorstep. Soccerex events drive economic impact, tourism, and international visibility for their host cities.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 fade-up">
              <a href="mailto:partner@soccerex.com" className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em]"
                style={{ background: '#bfb170', color: '#09203e', padding: '18px 40px', fontSize: '0.85rem', textDecoration: 'none', transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#d4c78e' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#bfb170' }}
              >
                Contact Us <ArrowRight size={16} />
              </a>
              <Link to="/about" className="inline-flex items-center gap-2 font-body font-semibold uppercase tracking-[0.15em]"
                style={{ background: 'transparent', color: '#fff', padding: '18px 40px', fontSize: '0.85rem', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)', transition: 'all 0.3s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#bfb170'; e.currentTarget.style.color = '#bfb170' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = '#fff' }}
              >
                About Soccerex
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
