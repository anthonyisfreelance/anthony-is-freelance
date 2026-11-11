// The standard design services contract, as approved in November 2026 ("Standard Design Services
// Contract" doc). Change the wording here and bump CONTRACT_VERSION. Signed contracts are stored
// as a snapshot at the moment of signing, so changes here never alter a contract already signed.

export const CONTRACT_VERSION = '1.0, November 2026';

// Each clause: [number, title, paragraphs]. A paragraph is a string, or { list: [...] } for bullets.
// **text** marks a bold lead-in.
export const TERMS = [
  ['1', 'Scope of Work', [
    '1.1 The Designer will provide the design services set out in the Quote ("the Services").',
    '1.2 This Agreement covers the project named in the Project Schedule only. Any further sites, stores or projects will be quoted and contracted separately.',
    '1.3 Work outside the Quote needs written agreement from both parties (email is enough) and is charged at the hourly rate unless agreed otherwise.',
  ]],
  ['2', 'Timeline', [
    '2.1 Work begins on the start date in the Project Schedule. Delivery dates for each phase are agreed in writing at the project kick-off.',
    '2.2 The Designer will make all reasonable efforts to meet agreed deadlines. Timelines may shift because of delays caused by the Client or by any third party the Client engages, for example late feedback, unavailability for meetings, late delivery of assets or content, delayed store access, delays in development, or additional revision requests. Where no deadline has been agreed in writing, the Designer is not responsible for any perceived delay.',
    '2.3 The Designer decides how, when and where the Services are carried out, and provides its own equipment, software and workspace.',
  ]],
  ['3', 'Fees and Payment', [
    '3.1 Fees are set out in the Project Schedule and the Quote. All fees exclude VAT, which is added at the prevailing UK rate.',
    '3.2 **Fixed price projects:** the price does not change with the hours worked, provided the work stays within the Quote.',
    "3.3 **Scoped hours projects:** the hours in the Quote are the agreed budget. The Designer will tell the Client in writing before exceeding it, and further hours need the Client's written agreement.",
    '3.4 **Hourly projects:** time is invoiced monthly in arrears with a breakdown of hours by task. Any estimate is a guide for planning, not a fixed price. The Designer will tell the Client in writing before an estimate is likely to be materially exceeded.',
    '3.5 Payment stages are set out in the Project Schedule. Any deposit is payable before work begins and is non-refundable.',
    '3.6 Invoices are payable within 14 days of the invoice date by bank transfer to the account shown on the invoice, quoting the invoice number.',
    '3.7 Late payments carry interest and fixed compensation at the statutory rates under the Late Payment of Commercial Debts (Interest) Act 1998, plus reasonable costs of recovery.',
    '3.8 If an invoice is more than 14 days overdue, the Designer may pause work after giving written notice, until it is paid. Agreed deadlines move by the length of the pause.',
  ]],
  ['4', 'Revisions and Changes', [
    '4.1 The Project Schedule sets the number of revision rounds included. A round is one consolidated set of feedback from the Client, gathered and sent together.',
    '4.2 Additional revisions, changes to the agreed scope, and requests to revisit work already signed off are charged at the hourly rate unless agreed otherwise in writing.',
    '4.3 On hourly projects, revisions are billed in the same way as all other work.',
  ]],
  ['5', 'Completion and Acceptance', [
    '5.1 The project is complete at the completion point set out in the Project Schedule. The Designer will tell the Client in writing when it is reached.',
    '5.2 The Client has 5 working days from that notice to raise in writing any item within the Quote that has not been delivered. If none is raised, the work is accepted and the final invoice becomes due.',
  ]],
  ['6', 'Ownership', [
    '6.1 Until all invoices for the project are paid in full, the Designer owns all intellectual property rights in the work, and the Client may not use, modify or distribute it.',
    '6.2 On full payment, the Designer assigns to the Client all intellectual property rights (including copyright and design rights) in the final deliverables, with full title guarantee. The Designer will hand over the Figma source files, design system, documentation, theme files where relevant, and any access details.',
    '6.3 The Designer waives its moral rights in the final deliverables to the extent permitted by law.',
    '6.4 The Designer keeps its pre-existing materials and its generic methods, processes, components and frameworks that are not specific to this project, and may reuse them. Where any are included in the deliverables, the Client receives a permanent, non-exclusive licence to use them as part of the project.',
    '6.5 If this Agreement ends early, the Client owns the work paid for up to the end date.',
  ]],
  ['7', 'Portfolio and Case Studies', [
    '7.1 Despite clause 6, once the work is publicly launched, the Designer keeps a permanent, worldwide, royalty-free right to show it for self-promotion. This includes its website, portfolio, social media, award entries, articles, talks and pitches, using screenshots, screen recordings, mock-ups and links to the live site, and naming the Client as a client.',
    '7.2 Case studies may describe the brief, the design thinking, the process and the work produced.',
    "7.3 The Client's prior written approval, not to be unreasonably withheld or delayed, is needed only to publish:",
    { list: ['confidential information under clause 12;', 'unreleased products or features; or', 'commercial figures, such as sales, revenue or conversion rates.'] },
    '7.4 If published material later becomes commercially sensitive, the Client may ask in writing for it to be changed or removed, and the Designer will do so within a reasonable time.',
    '7.5 If the Project Schedule marks the project as confidential, the Designer will not publish the work or name the Client without written approval.',
  ]],
  ['8', 'Third-Party Materials', [
    '8.1 The Designer warrants that the work is original or properly licensed.',
    '8.2 Any third-party assets used (including fonts, imagery, icons, UI kits or libraries) will be disclosed to the Client, licensed for commercial web use, and transferable to the Client where required.',
    '8.3 The Client pays any ongoing third-party costs, including Shopify subscription fees, paid apps, premium themes, font licences, and photography or asset licensing.',
  ]],
  ['9', 'Client Responsibilities', [
    '9.1 The Client agrees to:',
    { list: [
      'give feedback within 5 working days unless agreed otherwise;',
      'provide Shopify collaborator or staff access to the store and any development or staging environment at the start, and keep it in place throughout;',
      'deliver brand assets (including logo, typography, colour palette and imagery) by the dates agreed at kick-off;',
      'provide the content, product data and information the Quote relies on;',
      'make sure all product, pricing, technical and regulatory information on the site is accurate; and',
      'pay the third-party costs in clause 8.3.',
    ] },
    '9.2 Delays caused by the Client may extend the timeline. They do not change payment due for work already done.',
  ]],
  ['10', 'Data Protection', [
    '10.1 Through store access, the Designer may see personal data held by the Client. Both parties will comply with the UK GDPR and the Data Protection Act 2018.',
    "10.2 The Designer will only access personal data where the Services need it, keep it secure, not copy it out of the Client's systems, and tell the Client without undue delay of any breach it becomes aware of.",
  ]],
  ['11', 'Project Pause and Dormancy', [
    '11.1 If the Client is unresponsive for 30 days in a row, the Designer may treat the project as dormant. Reopening it may need a new written agreement and a re-engagement fee. Payment for completed work remains due.',
  ]],
  ['12', 'Confidentiality', [
    '12.1 Both parties will keep confidential any non-public business information, project details and materials shared during the project, unless agreed otherwise in writing or required by law.',
    '12.2 This includes unreleased products and concepts, business strategy, patent-pending features, product plans and commercial information. The Designer will not disclose or use them outside this Agreement.',
    '12.3 This does not cover information that is already public or that the receiving party already held. Use permitted by clause 7 is not a breach.',
  ]],
  ['13', 'Termination', [
    "13.1 Either party may end this Agreement with 14 days' written notice.",
    '13.2 Either party may end it immediately by written notice if the other materially breaches it and does not put the breach right within 14 days of being asked, or becomes insolvent.',
    '13.3 On termination, the Client pays for all work done up to the end date at the hourly rate, less payments already made. Any deposit is non-refundable.',
    '13.4 Clauses 6, 7, 12 and 14 continue after this Agreement ends.',
  ]],
  ['14', 'Liability', [
    '14.1 The Designer is not responsible for financial losses, technical issues or damage arising from use of the designs, or from third-party services, apps or development used in the project.',
    '14.2 Neither party is liable for indirect or consequential loss, including loss of profit, revenue or data.',
    "14.3 The Designer's total liability under this Agreement is limited to the total fees paid by the Client under it.",
    '14.4 Nothing in this Agreement limits liability for death or personal injury caused by negligence, fraud, intellectual property infringement, breach of confidentiality, wilful misconduct, gross negligence, or anything that cannot be limited by law.',
  ]],
  ['15', 'General', [
    '15.1 This Agreement, the Project Schedule and the Quote form the whole agreement between the parties and replace any earlier discussions.',
    '15.2 If they conflict, the Project Schedule takes priority, then these terms, then the Quote.',
    '15.3 Changes to this Agreement must be agreed in writing by both parties.',
    '15.4 This Agreement may be signed electronically, including by a typed, drawn or uploaded signature. An electronic signature is as valid as a handwritten one. The signed PDF and its signing record are evidence of agreement.',
    '15.5 Notices are given by email: to the Designer at hello@anthonyis.uk, and to the Client at the contact in the Project Schedule.',
    '15.6 This Agreement is governed by the law of England and Wales, and the courts of England and Wales have exclusive jurisdiction.',
  ]],
];

export const OPTIONAL = {
  A: ['A', 'Third-Party Development', [
    "A.1 The Client has engaged a separate developer for development beyond the Services. The Designer's responsibility is limited to the work set out in the Quote.",
    "A.2 The Designer is not responsible for the developer's code, timelines or deliverables, or for faults, regressions or conflicts caused by development. Remedial work needed because development affected the Designer's completed work is charged at the hourly rate.",
    "A.3 The Designer will review the developer's build against the signed-off designs where the Quote includes it. The Client coordinates between the parties and makes sure the developer has the access and information it needs.",
  ]],
  B: ['B', 'Contractor Status', [
    'B.1 The Designer is an independent contractor providing services through its own limited company. Nothing in this Agreement creates employment, worker status, partnership or agency.',
    'B.2 The Designer is responsible for its own tax, National Insurance, VAT and insurance, and has no entitlement to holiday pay, sick pay, pension contributions or other employee benefits.',
    "B.3 The Designer may provide a suitably qualified substitute with reasonable notice to the Client, and remains responsible for the substitute's work and payment.",
    'B.4 The Client has no obligation to offer further work, and the Designer has no obligation to accept it. The Designer is free to work for other clients, subject to clause 12.',
  ]],
  // C takes { months, sector } from the quote's contract settings.
  C: (c = {}) => ['C', 'Competitor Restriction', [
    `C.1 For ${c.months || 12} months after completion, the Designer will not name the Client or reference the work in pitches or proposals to direct competitors in the ${c.sector || "Client's"} sector. Clause 7 otherwise applies.`,
  ]],
};

export const OPTIONAL_NAMES = { A: 'Third-Party Development', B: 'Contractor Status', C: 'Competitor Restriction' };
