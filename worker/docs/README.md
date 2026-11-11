# Client documents

Quotes, contracts and invoices on their own subdomain, `docs.anthonyis.uk` (a custom domain on the
site worker): `/quote/<token>/`, `/quote/<token>/contract/`, `/invoice/<token>/` and `/admin/`. Each
link is unguessable. Every
document is one A4 sheet, the same on screen and in the PDF.

## How it fits together

- **Pages** are rendered by the site worker (`worker/docs/`): `quote.js`, `contract.js` (terms in
  `terms.js`), `invoice.js`, `admin.js`, with shared styles in `shared.js`.
- **Data** lives in Anthony's Google Drive, not in this public repo: one JSON file per document in
  *Anthonyis Management > Website documents data*, named `<name> [<token>].json`, plus
  `settings.json` (bank details and Anthony's signature).
- **The Drive bridge** (`apps-script/Code.gs`) is a Google Apps Script web app running as Anthony.
  The worker uses it to read and write the JSON, save PDFs into the Quotes, Contracts (Signed) and
  Invoices (tax-year) folders, and send client emails from his Gmail.
- **PDFs** come from Cloudflare Browser Rendering (`pdf.js`), from the same HTML as the pages.
- **Codes and notices** (signing codes, admin login, "signed" notices) go through Resend (`mail.js`).

## The flow

1. A quote's JSON goes into the data folder (Claude writes it from what Anthony says).
2. Anthony checks it at `docs.anthonyis.uk/admin/` and presses **Send quote**: the PDF is saved to Quotes and the
   client gets an email from his Gmail with the link and the PDF.
3. The client presses **Accept quote**, fills in their company details, signs (draw, type or upload)
   and confirms with a code emailed to them.
4. The contract is stored exactly as signed, the signed contract and quote PDFs go to Drive and to
   the client, and the deposit invoice is drafted. Anthony gets a notice.
5. Anthony checks the invoice and presses **Send invoice**: the PDF goes into Invoices > `26:27`
   (tax year ends 31 January) and to the client. Later stages are one click each from the admin page.

## Settings

Worker (Cloudflare dashboard > Worker > Settings > Variables and secrets). Add them as secrets:
plain-text variables set in the dashboard are wiped by the next deploy.

| Name | Type | What |
| --- | --- | --- |
| `DOCS_SECRET` | secret | Long random string; signs code and login cookies |
| `BRIDGE_URL` | secret | The Apps Script web app URL (ends `/exec`) |
| `BRIDGE_KEY` | secret | Shared with the bridge's `BRIDGE_KEY` script property |
| `RESEND_API_KEY` | secret | Already set for the enquiry form |
| `ADMIN_EMAIL` | secret, optional | Where admin login codes go; defaults to hello@anthonyis.uk |

`wrangler.jsonc` adds the `BROWSER` binding and `nodejs_compat` for the PDFs, and `DOCS_HOST`.

## Data format

Quote:

```json
{
  "type": "quote", "token": "…", "key": "HappyThreads", "seq": 1, "number": "HappyThreads_01",
  "client": { "name": "Happythreads", "legalName": "", "companyNumber": "", "address": "",
              "contact": { "name": "Aga Hencil", "email": "aga@happythreads.com" } },
  "issued": "2026-11-11", "validUntil": "2026-12-11",
  "title": "Shopify store redesign and design system",
  "overview": { "heading": "…", "paragraphs": ["…"] },
  "scope": { "heading": "What I'll design", "items": [{ "title": "…", "body": "…", "hours": 12 }] },
  "pages": { "heading": "Mobile and desktop", "items": [{ "name": "Homepage", "note": "" }] },
  "pricing": { "type": "scoped | fixed | hourly", "rate": 8000, "fixed": 400000 },
  "stages": [{ "label": "Deposit", "percent": 50, "due": "Before work begins" }],
  "revisions": "…", "builtBy": "StudioForty9", "fromClient": "…",
  "contract": { "optional": ["A"], "completionPoint": "…", "revisionRounds": "…",
                "startDate": "", "confidential": false, "competitor": { "months": 12, "sector": "…" } },
  "state": { "status": "draft" }
}
```

Money is in pence. VAT is always 20%. Optional contract clauses: A third-party development,
B contractor status, C competitor restriction.

Invoice (`kind` "stage" with `lines`, or "itemised" with `items` priced at `rate`):

```json
{
  "type": "invoice", "token": "…", "key": "eComplete", "seq": 10, "number": "eComplete_10",
  "issued": "2026-11-30", "due": "2026-12-14", "project": "Dr David Jack design support",
  "kind": "itemised", "rate": 7000,
  "items": [{ "date": "2026-11-03", "description": "Clinic page tweaks", "hours": 6 }],
  "client": { "name": "eComplete", "legalName": "…", "address": "…", "contact": { "name": "…", "email": "…" } },
  "state": { "status": "draft" }
}
```

## Changing the contract wording

Edit `terms.js` and bump `CONTRACT_VERSION`. Signed contracts are kept as a snapshot of the page at
the moment of signing, so changes never alter one already signed.
