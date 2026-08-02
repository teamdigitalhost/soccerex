import PolicyPage from './PolicyPage'

const SECTIONS = [
  { heading: 'About Our Use of Cookies', paragraphs: [
    'Soccerex uses cookies and similar tracking technologies on our website to enhance your browsing experience, analyze site traffic, and understand how visitors interact with our content. This Cookie Policy explains what cookies are, how we use them, and the choices you have.',
    'When you first visit soccerex.com, a consent banner asks whether you accept analytics and marketing cookies. You can change your preference at any time by clearing your browser storage for this site.',
  ]},
  { heading: 'What Are Cookies', paragraphs: [
    'Cookies are small text files that are stored on your device when you visit a website. They help the site recognize your device and remember information about your visit, such as your preferred settings or whether you are logged in.',
  ]},
  { heading: 'Types of Cookies We Use', paragraphs: ['We use the following categories of cookies:'], list: [
    'Essential cookies, required for the basic operation of the website, such as page navigation and access to secure areas.',
    'Preference cookies, which remember choices you have made to provide a more personalized experience.',
    'Analytics cookies (Google Analytics 4), which help us understand how visitors interact with the site by collecting information about pages visited, time on site, and traffic sources.',
    'Marketing cookies (LinkedIn Insight Tag), which allow us to build retargeting audiences on LinkedIn so we can show relevant ads to visitors who have expressed an interest in Soccerex events.',
  ]},
  { heading: 'First-Party Analytics', paragraphs: [
    'In addition to the consent-gated cookies above, Soccerex operates its own first-party event beacon. This records page views, session identifiers, and campaign click tokens and is used solely for internal lead scoring and campaign attribution. It does not share data with third parties and is active regardless of your analytics cookie preference.',
  ]},
  { heading: 'Google Analytics 4', paragraphs: [
    'If you accept analytics cookies, we load Google Analytics 4 (GA4) via the gtag.js library. GA4 collects anonymized data about how visitors use the site, including page paths, scroll depth, and traffic source. Data is processed by Google LLC and subject to Google\'s Privacy Policy.',
  ]},
  { heading: 'LinkedIn Insight Tag', paragraphs: [
    'If you accept analytics cookies, we also load the LinkedIn Insight Tag. This allows us to measure conversions from LinkedIn ads and build matched audiences on LinkedIn Campaign Manager. Data is processed by LinkedIn Corporation and subject to LinkedIn\'s Privacy Policy.',
  ]},
  { heading: 'Comment and Login Cookies', paragraphs: [
    'If you visit our login page, we will set a temporary cookie to determine if your browser accepts cookies. This cookie contains no personal data and is discarded when you close your browser.',
    'When you log in, we will also set up several cookies to save your login information and your screen display choices. Login cookies last for two days, and screen options cookies last for a year. If you select "Remember Me", your login will persist for two weeks. If you log out of your account, the login cookies will be removed.',
  ]},
  { heading: 'Managing Cookies', paragraphs: [
    'Most browsers allow you to refuse cookies or alert you when a cookie is being placed. You can usually find these options in the settings or preferences menu of your browser. Please note that disabling certain cookies may affect the functionality of the website.',
    'To withdraw your analytics consent on soccerex.com specifically, clear the site\'s local storage (in your browser\'s DevTools under Application > Local Storage > soccerex.com) and reload the page. The consent banner will reappear.',
  ]},
  { heading: 'Contact', paragraphs: [
    'If you have any questions about our use of cookies, please contact us at support@soccerex.com.',
  ]},
]

export default function CookiePolicy() {
  return <PolicyPage title="Cookie Policy" eyebrow="LEGAL" sections={SECTIONS} />
}
