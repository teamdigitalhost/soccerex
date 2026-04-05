import PolicyPage from './PolicyPage'

const SECTIONS = [
  { heading: '1. Acceptance of Terms', paragraphs: [
    'By using our website or app, you agree to these Terms and any additional guidelines, policies, or rules that are posted on the Soccerex website or app. We reserve the right to update or modify these Terms at any time without prior notice. Your continued use of our services after changes are made constitutes your acceptance of the new Terms.',
  ]},
  { heading: '2. Use of Services', paragraphs: [
    'Soccerex provides a platform for networking, event management, and information sharing for professionals in the football industry. You agree to use the website and app only for lawful purposes and in accordance with these Terms.',
  ]},
  { heading: '3. Account Registration', paragraphs: [
    'To access certain features of our website and app, you may be required to register for an account. You are responsible for maintaining the confidentiality of your login credentials and for any activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.',
  ]},
  { heading: '4. User Conduct', paragraphs: ['You agree not to:'], list: [
    'Use the website or app for any illegal or unauthorized purpose.',
    'Post or transmit any content that is offensive, defamatory, harmful, or infringes on the rights of others.',
    'Attempt to gain unauthorized access to other user accounts or to Soccerex\'s network.',
    'Use automated means to access or scrape data from the website or app without our permission.',
  ]},
  { heading: '5. Intellectual Property', paragraphs: [
    'All content, logos, trademarks, and other materials available on the Soccerex website and app are the property of Soccerex or its licensors. You agree not to reproduce, distribute, or create derivative works based on this content without our prior written consent.',
  ]},
  { heading: '6. Event Participation and Tickets', paragraphs: [
    'If you register for or purchase tickets to Soccerex events through our website or app, please note that event participation is subject to additional terms, conditions, and policies. Event-specific details, including cancellation and refund policies, will be communicated to you upon registration.',
  ]},
  { heading: '7. Third-Party Links', paragraphs: [
    'Our website and app may contain links to third-party websites. These links are provided for your convenience, and Soccerex does not endorse or take responsibility for the content, privacy practices, or other activities of these external sites.',
  ]},
  { heading: '8. Privacy Policy', paragraphs: [
    'Your use of our website and app is also governed by our Privacy Policy, which explains how we collect, use, and protect your information. By using our services, you consent to the practices described in our Privacy Policy.',
  ]},
  { heading: '9. Limitation of Liability', paragraphs: [
    'Soccerex shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages resulting from your use or inability to use our website or app. This includes, but is not limited to, damages for loss of profits, goodwill, data, or other intangible losses.',
  ]},
  { heading: '10. Disclaimer of Warranties', paragraphs: [
    'The Soccerex website and app are provided "as is" and "as available" without any warranty or condition, express, implied, or statutory. We do not guarantee that our services will be uninterrupted, error-free, or secure. Your use of the website and app is at your own risk.',
  ]},
  { heading: '11. Governing Law', paragraphs: [
    'These Terms are governed by and construed in accordance with the laws of the jurisdiction in which Soccerex operates, without regard to its conflict of law principles. You agree to submit to the exclusive jurisdiction of the courts located within that jurisdiction.',
  ]},
  { heading: '12. Contact Information', paragraphs: [
    'If you have any questions or concerns regarding these Terms, please contact us at support@soccerex.com or at 3011 Ponce de Leon Blvd, Suite #1420, Coral Gables, FL 33134.',
  ]},
  { heading: '13. Changes to These Terms', paragraphs: [
    'We may update these Terms from time to time to reflect changes in our practices or to comply with legal requirements. We will notify you of any significant changes by posting the new Terms on our website and app. Your continued use of our services following any changes indicates your acceptance of the revised Terms.',
  ]},
]

export default function TermsConditions() {
  return <PolicyPage title="Terms & Conditions" eyebrow="LEGAL" lastUpdated="October 29, 2024" sections={SECTIONS} />
}
