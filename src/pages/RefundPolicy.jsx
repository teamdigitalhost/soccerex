import PolicyPage from './PolicyPage'

const SECTIONS = [
  { heading: 'Refund Policy for Soccerex Events', paragraphs: [
    'Soccerex maintains a strict No Refund Policy for all event registrations. Once a registration is processed, no refunds will be issued under any circumstances, including but not limited to cancellation by the registrant, failure to attend the event, or dissatisfaction with the event.',
  ]},
  { heading: 'Credit Transfer to Future Events', paragraphs: [
    'In lieu of refunds, Soccerex offers registrants the option to transfer their registration as a credit to a future Soccerex event ("Credit Transfer"). This allows registrants to apply the full value of their original registration fee towards admission to a subsequent Soccerex event.',
  ], list: [
    'Eligibility: Credit Transfers are available to registrants who notify Soccerex in writing at least 7 days before the event date.',
    'Process: To initiate a Credit Transfer, registrants must contact Soccerex Customer Service via email at registrations@soccerex.com.',
    'Expiration: Credits must be used within 3 years from the original event date.',
  ]},
  { heading: 'Exceptions', paragraphs: [
    'Exceptions to this No Refund Policy may be made at the sole discretion of Soccerex and must be requested in writing to registrations@soccerex.com. Any approved exceptions will be processed as a Credit Transfer to a future event.',
  ]},
  { heading: 'Contact', paragraphs: [
    'For any questions regarding this Refund Policy, please contact us at registrations@soccerex.com.',
  ]},
]

export default function RefundPolicy() {
  return <PolicyPage title="Refund Policy" eyebrow="NO REFUNDS" sections={SECTIONS} />
}
