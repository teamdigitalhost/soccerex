import PolicyPage from './PolicyPage'

const SECTIONS = [
  { heading: 'About Our Use of Cookies', paragraphs: [
    'Soccerex uses cookies and similar tracking technologies on our website to enhance your browsing experience, analyze site traffic, and understand how visitors interact with our content. This Cookie Policy explains what cookies are, how we use them, and the choices you have.',
  ]},
  { heading: 'What Are Cookies', paragraphs: [
    'Cookies are small text files that are stored on your device when you visit a website. They help the site recognize your device and remember information about your visit, such as your preferred settings or whether you are logged in.',
  ]},
  { heading: 'Types of Cookies We Use', paragraphs: ['We use the following categories of cookies:'], list: [
    'Essential cookies, required for the basic operation of the website, such as page navigation and access to secure areas.',
    'Preference cookies, which remember choices you have made to provide a more personalized experience.',
    'Analytics cookies, which help us understand how visitors interact with the site by collecting anonymous information.',
    'Marketing cookies, which may be set by our advertising partners to build a profile of your interests and show you relevant ads on other sites.',
  ]},
  { heading: 'Comment and Login Cookies', paragraphs: [
    'If you leave a comment on our site you may opt-in to saving your name, email address, and website in cookies. These are for your convenience so that you do not have to fill in your details again when you leave another comment. These cookies will last for one year.',
    'If you visit our login page, we will set a temporary cookie to determine if your browser accepts cookies. This cookie contains no personal data and is discarded when you close your browser.',
    'When you log in, we will also set up several cookies to save your login information and your screen display choices. Login cookies last for two days, and screen options cookies last for a year. If you select "Remember Me", your login will persist for two weeks. If you log out of your account, the login cookies will be removed.',
  ]},
  { heading: 'Third-Party Cookies', paragraphs: [
    'Some cookies on our site are placed by third-party services such as analytics and advertising partners. These third parties may use cookies to collect information about your online activities across different websites and over time.',
  ]},
  { heading: 'Managing Cookies', paragraphs: [
    'Most browsers allow you to refuse cookies or alert you when a cookie is being placed. You can usually find these options in the settings or preferences menu of your browser. Please note that disabling certain cookies may affect the functionality of the website.',
  ]},
  { heading: 'Contact', paragraphs: [
    'If you have any questions about our use of cookies, please contact us at support@soccerex.com.',
  ]},
]

export default function CookiePolicy() {
  return <PolicyPage title="Cookie Policy" eyebrow="LEGAL" sections={SECTIONS} />
}
