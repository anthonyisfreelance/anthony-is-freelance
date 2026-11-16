// The standard design services contract. Change the wording here and bump CONTRACT_VERSION. Signed
// contracts are stored as a snapshot at the moment of signing, so changes here never alter a
// contract already signed.
//
// 1.1 (November 2026): the contract speaks of "the Quote" throughout (the "Project Schedule" name is
// gone); each contract shows only the pricing wording for its own type of quote; amends are stated
// in the terms; the confidential-project option is removed; clause 3 reworded around keeping work
// in scope; clause 14.4 trimmed to what the law requires.

export const CONTRACT_VERSION = '1.1, November 2026';

const lowerFirst = (s) => s.charAt(0).toLowerCase() + s.slice(1);

// The clauses for one quote. Each clause is [number, title, paragraphs]; a paragraph is a string,
// or { list: [...] } for bullets. Paragraphs are numbered here (1.1, 1.2, ...), so wording can be
// added or removed without renumbering by hand. Clause 9 points at "clause 8.3" and clauses 7, 12
// and 13 point at whole clauses: keep those in step if clauses move.
export function termsFor(q = {}) {
  const type = q.pricing?.type || 'scoped';
  const amends = String(q.contract?.revisionRounds || 'Two rounds of amends').trim().replace(/\.$/, '');

  // Clause 3.2: only the wording for this quote's pricing.
  const pricing = {
    fixed: 'The price in the Quote is fixed. It does not change with the hours worked, as long as the work stays within the Quote.',
    scoped: "The price in the Quote is based on the hours it sets out, and that is the agreed budget for the work in the Quote. If any part looks likely to need more time, the Designer will raise it first. Nothing extra is charged without the Client's written agreement.",
    hourly: 'Time is invoiced monthly, after the work is done, with a breakdown of hours by task. Any estimate is a guide for planning, not a fixed price. If an estimate looks likely to be exceeded, the Designer will tell the Client in writing first.',
  }[type];

  const clauses = [
    ['Scope of Work', [
      'The Designer will provide the design services set out in the Quote ("the Services").',
      'This Agreement covers the project in the Quote only. Any further sites, stores or projects will be quoted and contracted separately.',
      'Anything outside the Quote is agreed in writing first (email is enough), with the cost confirmed before the work starts. It is charged at the hourly rate unless agreed otherwise.',
    ]],
    ['Timeline', [
      'The start date is shown in the project details at the start of this Agreement. Delivery dates for each phase are agreed in writing at the project kick-off.',
      'The Designer will make all reasonable efforts to meet agreed deadlines. Timelines may shift because of delays caused by the Client or by any third party the Client engages, for example late feedback, unavailability for meetings, late delivery of assets or content, delayed store access, delays in development, or additional rounds of amends. Where no deadline has been agreed in writing, the Designer is not responsible for any perceived delay.',
      'The Designer decides how, when and where the Services are carried out, and provides its own equipment, software and workspace.',
    ]],
    ['Fees and Payment', [
      'Fees are set out in the Quote. All fees exclude VAT, which is added at the UK rate.',
      pricing,
      'Payment stages are set out in the Quote. Any deposit books the project in, so it is payable before work begins and is non-refundable.',
      'Invoices are payable within 14 days of the invoice date by bank transfer to the account shown on the invoice, quoting the invoice number.',
      'Late payments carry interest and fixed compensation at the statutory rates under the Late Payment of Commercial Debts (Interest) Act 1998, plus reasonable costs of recovery.',
      'If an invoice is more than 14 days overdue, the Designer may pause work after giving written notice, until it is paid. Agreed deadlines move by the length of the pause.',
    ]],
    ['Amends and Changes', [
      type === 'hourly'
        ? 'Amends are part of the work and are billed in the same way as all other time. A round of amends is one set of feedback from the Client, gathered and sent together.'
        : `The fee includes ${lowerFirst(amends)}. A round is one set of feedback from the Client, gathered and sent together.`,
      'Further rounds, changes to the agreed scope, and requests to revisit work already signed off are agreed first and charged at the hourly rate, unless agreed otherwise in writing.',
    ]],
    ['Completion and Acceptance', [
      'The project is complete at the completion point shown in the project details at the start of this Agreement. The Designer will tell the Client in writing when it is reached.',
      'The Client has 5 working days from that notice to raise in writing any item within the Quote that has not been delivered. If none is raised, the work is accepted and the final invoice becomes due.',
    ]],
    ['Ownership', [
      'Until all invoices for the project are paid in full, the Designer owns all intellectual property rights in the work, and the Client may not use, modify or distribute it.',
      'On full payment, the Designer assigns to the Client all intellectual property rights (including copyright and design rights) in the final deliverables, with full title guarantee. The Designer will hand over the Figma source files, design system, documentation, theme files where relevant, and any access details.',
      'The Designer waives its moral rights in the final deliverables to the extent permitted by law.',
      'The Designer keeps its pre-existing materials and its generic methods, processes, components and frameworks that are not specific to this project, and may reuse them. Where any are included in the deliverables, the Client receives a permanent, non-exclusive licence to use them as part of the project.',
      'If this Agreement ends early, the Client owns the work paid for up to the end date.',
    ]],
    ['Portfolio and Case Studies', [
      'Despite clause 6, once the work is publicly launched, the Designer keeps a permanent, worldwide, royalty-free right to show it for self-promotion. This includes its website, portfolio, social media, award entries, articles, talks and pitches, using screenshots, screen recordings, mock-ups and links to the live site, and naming the Client as a client.',
      'Case studies may describe the brief, the design thinking, the process and the work produced.',
      "The Client's prior written approval, not to be unreasonably withheld or delayed, is needed only to publish:",
      { list: ['confidential information under clause 12;', 'unreleased products or features; or', 'commercial figures, such as sales, revenue or conversion rates.'] },
      'If published material later becomes commercially sensitive, the Client may ask in writing for it to be changed or removed, and the Designer will do so within a reasonable time.',
    ]],
    ['Third-Party Materials', [
      'The Designer warrants that the work is original or properly licensed.',
      'Any third-party assets used (including fonts, imagery, icons, UI kits or libraries) will be disclosed to the Client, licensed for commercial web use, and transferable to the Client where required.',
      'The Client pays any ongoing third-party costs, including Shopify subscription fees, paid apps, premium themes, font licences, and photography or asset licensing.',
    ]],
    ['Client Responsibilities', [
      'The Client agrees to:',
      { list: [
        'give feedback within 5 working days unless agreed otherwise;',
        'provide Shopify collaborator or staff access to the store and any development or staging environment at the start, and keep it in place throughout;',
        'deliver brand assets (including logo, typography, colour palette and imagery) by the dates agreed at kick-off;',
        'provide the content, product data and information the Quote relies on;',
        'make sure all product, pricing, technical and regulatory information on the site is accurate; and',
        'pay the third-party costs in clause 8.3.',
      ] },
      'Delays caused by the Client may extend the timeline. They do not change payment due for work already done.',
    ]],
    ['Data Protection', [
      'Through store access, the Designer may see personal data held by the Client. Both parties will comply with the UK GDPR and the Data Protection Act 2018.',
      "The Designer will only access personal data where the Services need it, keep it secure, not copy it out of the Client's systems, and tell the Client without undue delay of any breach it becomes aware of.",
    ]],
    ['Project Pause and Dormancy', [
      'If the Client is unresponsive for 30 days in a row, the Designer may treat the project as dormant. Reopening it may need a new written agreement and a re-engagement fee. Payment for completed work remains due.',
    ]],
    ['Confidentiality', [
      'Both parties will keep confidential any non-public business information, project details and materials shared during the project, unless agreed otherwise in writing or required by law.',
      'This includes unreleased products and concepts, business strategy, patent-pending features, product plans and commercial information. The Designer will not disclose or use them outside this Agreement.',
      'This does not cover information that is already public or that the receiving party already held. Use permitted by clause 7 is not a breach.',
    ]],
    ['Termination', [
      "Either party may end this Agreement with 14 days' written notice.",
      'Either party may end it immediately by written notice if the other materially breaches it and does not put the breach right within 14 days of being asked, or becomes insolvent.',
      'On termination, the Client pays for all work done up to the end date at the hourly rate, less payments already made. Any deposit is non-refundable.',
      'Clauses 6, 7, 12 and 14 continue after this Agreement ends.',
    ]],
    ['Liability', [
      'The Designer is not responsible for financial losses, technical issues or damage arising from use of the designs, or from third-party services, apps or development used in the project.',
      'Neither party is liable for indirect or consequential loss, including loss of profit, revenue or data.',
      "The Designer's total liability under this Agreement is limited to the total fees paid by the Client under it.",
      'Nothing in this Agreement limits liability for death or personal injury caused by negligence, for fraud, or for anything else that cannot be limited by law.',
    ]],
    ['General', [
      'This Agreement and the Quote form the whole agreement between the parties and replace any earlier discussions.',
      'If they conflict, the Quote decides the scope, fees and payment stages, and these terms decide everything else.',
      'Changes to this Agreement must be agreed in writing by both parties.',
      'This Agreement may be signed electronically, including by a typed, drawn or uploaded signature. An electronic signature is as valid as a handwritten one. The signed PDF and its signing record are evidence of agreement.',
      'Notices are given by email: to the Designer at hello@anthonyis.uk, and to the Client at the contact named in this Agreement.',
      'This Agreement is governed by the law of England and Wales, and the courts of England and Wales have exclusive jurisdiction.',
    ]],
  ];

  return clauses.map(([title, paras], i) => {
    const n = String(i + 1);
    let k = 0;
    return [n, title, paras.map((para) => (typeof para === 'string' ? `${n}.${++k} ${para}` : para))];
  });
}

// The terms for a scoped-hours quote, for anything that needs the standard wording on its own.
export const TERMS = termsFor();

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
