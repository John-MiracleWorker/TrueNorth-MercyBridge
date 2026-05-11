# MercyBridge v2 Plan: Verified Payee Directory + Bill Verification Workflow

## North Star

MercyBridge v2 is **not** direct biller integration yet.

V2 turns MercyBridge from a manual benevolence workflow into a reusable trust platform:

> MercyBridge remembers which payees are real, how they were verified, how they can be paid, and whether prior payments were confirmed.

The platform should speed up repeat requests without pretending every biller can be integrated automatically.

## V2 Product Goal

When a requester submits a need and uploads a bill/invoice, MercyBridge should:

1. Extract the payee, amount, due date, account/invoice hints, and payment instructions.
2. Match the extracted payee against an internal verified payee directory.
3. Route unknown/suspicious payees into admin review.
4. Store approved payment routes internally.
5. Record payment attempts and confirmations.
6. Improve future trust scoring for that payee.

## Explicit Non-Goals for v2

- No direct integration with every utility/landlord/biller.
- No fully automated payment approval.
- No sponsor access to private account details, addresses, full documents, payment portals, or requester contact info.
- No direct sponsor-to-requester payments.
- No free-text “send me money” requests.
- No final legal/payment-rails assumptions without compliance review.

## Success Milestone

The first true v2 milestone:

> Process 100 requests, verify 50 unique payees, successfully pay 25 bills, and reuse at least 10 payees without re-verifying from scratch.

## Current System Fit

Existing MercyBridge already has:

- `mercybridge_needs`
- `mercybridge_contributions`
- `mercybridge_admin_reviews`
- uploaded bill documents
- AI/request screening fields
- secure messaging and safety controls
- admin workflow primitives

V2 should extend this system instead of replacing it.

The existing `biller_name` on `mercybridge_needs` becomes a display/input field, while the new canonical relationship becomes:

- `mercybridge_needs.payee_id -> mercybridge_payees.id`
- optional `mercybridge_needs.payee_match_status`
- optional `mercybridge_needs.payee_risk_score`

## Core Data Model

### 1. `mercybridge_payees`

Canonical internal payee records.

Fields:

- `id uuid primary key`
- `legal_name text not null`
- `display_name text not null`
- `normalized_name text not null`
- `category payee_category not null`
- `website text`
- `phone text`
- `address jsonb`
- `ein_or_tax_id_encrypted text null`
- `verification_status payee_verification_status not null default 'unverified'`
- `verification_level int not null default 0`
- `risk_score int not null default 50`
- `trust_score int not null default 0`
- `last_verified_at timestamptz`
- `suspended_at timestamptz`
- `suspension_reason text`
- `created_by uuid references auth.users(id)`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

Suggested categories:

- `utility`
- `rent_landlord`
- `property_manager`
- `medical`
- `dental`
- `auto_repair`
- `insurance`
- `childcare`
- `school`
- `church_partner`
- `government_fee`
- `telecom`
- `other`

Suggested statuses:

- `unverified`
- `pending_review`
- `limited_verified`
- `verified`
- `trusted`
- `suspended`
- `rejected`

Verification levels:

- Level 0: unknown
- Level 1: document appears legitimate
- Level 2: contact info independently verified
- Level 3: payment successfully completed once
- Level 4: multiple successful payments
- Level 5: partner/payee onboarded directly

### 2. `mercybridge_payee_aliases`

Fuzzy matching memory.

Fields:

- `id uuid primary key`
- `payee_id uuid references mercybridge_payees(id) on delete cascade`
- `alias_text text not null`
- `normalized_alias text not null`
- `source text not null` — `admin`, `ocr`, `requester`, `import`, `payment_history`
- `confidence numeric(5,4) default 1.0`
- `created_at timestamptz default now()`

Examples:

- Consumers Energy
- Consumer Energy
- Consumers
- Consumers Energy Co.
- consumerenergy.com

### 3. `mercybridge_need_documents`

Document-level extraction and privacy controls.

Fields:

- `id uuid primary key`
- `need_id uuid references mercybridge_needs(id) on delete cascade`
- `document_type text`
- `storage_path text not null`
- `safe_summary jsonb`
- `extracted_fields jsonb`
- `extraction_status text default 'pending'`
- `extraction_confidence numeric(5,4)`
- `reviewed_by uuid references auth.users(id)`
- `reviewed_at timestamptz`
- `retention_until timestamptz`
- `purged_at timestamptz`
- `created_at timestamptz default now()`

Extracted fields should include:

- `payee_name`
- `amount_due`
- `minimum_due`
- `due_date`
- `account_number_last4`
- `billing_address`
- `requester_name_on_bill`
- `payment_url`
- `payee_phone`
- `invoice_number`
- `service_address`

### 4. `mercybridge_payee_verifications`

Audit trail for how a payee became trusted.

Fields:

- `id uuid primary key`
- `payee_id uuid references mercybridge_payees(id)`
- `need_id uuid references mercybridge_needs(id)`
- `reviewer_id uuid references auth.users(id)`
- `verification_type text not null`
- `result text not null` — `passed`, `failed`, `partial`, `needs_more_info`
- `evidence jsonb`
- `notes text`
- `created_at timestamptz default now()`

Verification types:

- `document_review`
- `official_website_match`
- `phone_verified`
- `address_verified`
- `public_record_match`
- `prior_payment_confirmed`
- `partner_onboarding`
- `compliance_review`

### 5. `mercybridge_payee_payment_methods`

Internal-only approved payment routes.

Fields:

- `id uuid primary key`
- `payee_id uuid references mercybridge_payees(id) on delete cascade`
- `method_type text not null`
- `payment_url text`
- `mailing_address jsonb`
- `ach_details_encrypted text`
- `check_payable_to text`
- `phone_payment_allowed boolean default false`
- `phone text`
- `requires_account_number boolean default false`
- `requires_invoice_number boolean default false`
- `notes text`
- `status text not null default 'pending_review'`
- `last_successful_payment_at timestamptz`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

Method types:

- `biller_portal`
- `guest_pay_portal`
- `card_by_phone`
- `mailed_check`
- `ach`
- `wire`
- `manual_other`

### 6. `mercybridge_payment_attempts`

Payment operation history and trust input.

Fields:

- `id uuid primary key`
- `need_id uuid references mercybridge_needs(id)`
- `payee_id uuid references mercybridge_payees(id)`
- `payment_method_id uuid references mercybridge_payee_payment_methods(id)`
- `amount numeric(12,2) not null`
- `method text not null`
- `status text not null default 'pending'`
- `confirmation_number text`
- `receipt_storage_path text`
- `paid_at timestamptz`
- `settled_at timestamptz`
- `failed_reason text`
- `reviewer_id uuid references auth.users(id)`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

Statuses:

- `pending`
- `initiated`
- `paid`
- `confirmed`
- `settled`
- `failed`
- `reversed`
- `cancelled`

### 7. `mercybridge_risk_flags`

Reviewer warning system, not an AI fraud oracle.

Fields:

- `id uuid primary key`
- `need_id uuid references mercybridge_needs(id)`
- `payee_id uuid references mercybridge_payees(id)`
- `requester_id uuid references auth.users(id)`
- `flag_type text not null`
- `severity text not null` — `low`, `medium`, `high`, `critical`
- `message text not null`
- `evidence jsonb`
- `resolved_at timestamptz`
- `resolved_by uuid references auth.users(id)`
- `created_at timestamptz default now()`

Risk flags:

- requester/payee phone match
- requester/payee address match
- payment method is direct-to-person
- cash app / Venmo / PayPal / Zelle / crypto / gift card language
- no public website found
- extracted payee differs from entered payee
- repeated weird payee across multiple requesters
- requester changed bill details after extraction
- failed prior payment
- suspended payee match

## Request Flow

1. Requester creates need.
2. Requester uploads bill/invoice/statement.
3. System stores raw document privately.
4. Extraction runs and creates `mercybridge_need_documents` record.
5. System normalizes extracted payee name.
6. Matching searches `mercybridge_payees` and `mercybridge_payee_aliases`.
7. If high-confidence trusted match:
   - attach `payee_id` to need
   - show reviewer recommendation
   - continue normal review
8. If no match or risky match:
   - create or stage payee as `pending_review`
   - create risk flags
   - route to verification queue
9. Admin reviews document, extracted fields, match suggestions, risk flags, and playbook checklist.
10. Admin approves existing payee, creates new payee, merges aliases, asks for more info, suspends/rejects, or escalates.
11. Sponsor funds verified/review-approved need.
12. MercyBridge pays payee through approved internal method.
13. Receipt/confirmation is uploaded.
14. Payment attempt updates payee trust score.
15. Future matching becomes faster.

## Sponsor-Safe Public View

Sponsors may see:

- generalized requester story
- city/state only
- need category
- verified payee category or display name when safe
- amount requested/funded/remaining
- due date
- verification level summary
- statement that MercyBridge pays the biller directly

Sponsors must not see:

- full bill image
- full account number
- home/service address
- requester phone/email
- private payment portal/account URL
- raw payment instructions
- direct contact instructions

## Admin Verification Queue

Admin view should show:

- uploaded bill/document with protected access
- extracted fields
- possible payee matches with confidence
- current payee trust level
- requester history
- sponsor/funding status
- payee website/contact info
- prior payment history
- risk flags
- category-specific checklist
- recommended action

Admin actions:

- approve payee
- approve request once without fully trusting payee
- request more info
- merge with existing payee
- add alias
- reject payee
- suspend payee
- mark fraud
- escalate for compliance review

## Category Verification Playbooks

### Utilities

- official website exists
- payment portal matches bill
- phone number matches official source
- account number format appears plausible
- payee has prior successful payments

### Rent / Landlord / Property Manager

- lease/rent statement uploaded
- landlord/property manager identity verified
- property ownership or management relationship checked
- payment instructions verified independently
- no direct-to-requester payment

### Auto Repair

- invoice uploaded
- business is real
- phone/address verified independently
- invoice number confirmed if needed
- payment goes to business, not requester

### Medical / Dental

- provider name verified
- statement uploaded
- billing department or payment portal verified
- sponsor view masks patient/account details

### Childcare / School

- provider/school exists
- invoice or tuition statement uploaded
- payment route verified independently
- child/private family details masked from sponsor

## Messaging and Off-Platform Payment Blocking

Existing messaging controls should be extended to block or flag:

- Cash App
- Venmo
- PayPal
- Zelle
- Apple Cash
- crypto wallets
- gift cards
- phone number exchange
- email exchange
- “text me”
- “pay me directly”
- “outside the app”

Hard rule:

- Requesters cannot ask sponsors to pay them directly.
- Sponsors cannot fund unverified free-text payment instructions.
- Every fundable need must be attached to an existing verified payee or a review-approved new payee.

## Trust Scoring Inputs

Positive:

- successful payment
- receipt confirmed
- same payee used multiple times
- official website verified
- phone/address independently verified
- public records match
- direct partner onboarding

Negative:

- failed payment
- payment reversal
- requester edited bill details after extraction
- multiple requesters using same suspicious payee
- payee shares phone/address with requester
- off-platform payment attempt
- cash/gift-card/crypto language
- suspended/rejected prior match

Output should be reviewer-facing:

- confidence score
- risk score
- plain-language reason list
- recommended action

## Build Phases

### Phase 1 — Internal Payee Directory

Goal: intake bills, identify payees, manually verify payees, and reuse payee records.

Deliverables:

- payee tables and enums
- need-to-payee relationship
- admin payee list/detail pages
- manual payee creation/editing
- verification status/level controls
- alias management
- initial migration from existing known biller database where appropriate

No payment automation.

### Phase 2 — Document Extraction + Matching

Goal: OCR/LLM assists reviewers but does not decide.

Deliverables:

- `mercybridge_need_documents`
- extraction edge function
- extracted field review UI
- fuzzy alias matching
- confidence scoring
- create/merge/approve match workflow
- risk flag generation

### Phase 3 — Verification Queue + Playbooks

Goal: make admin review repeatable and category-specific.

Deliverables:

- verification queue page
- category checklists
- reviewer actions
- admin audit trail
- more-info flow
- compliance escalation state

### Phase 4 — Payment Method Memory + Payment Attempts

Goal: MercyBridge learns how each payee is safely paid.

Deliverables:

- payee payment method table/UI
- internal-only payment route notes
- payment attempt records
- receipt upload
- confirmation tracking
- trust score updates after confirmed payment

Still manual payment operations.

### Phase 5 — Sponsor-Safe Public View

Goal: increase sponsor trust without leaking requester/payee bypass data.

Deliverables:

- sponsor-safe payee verification badge
- public redaction rules
- “MercyBridge pays biller directly” copy
- no raw payment instructions shown publicly
- no account/service address exposure

### Phase 6 — Compliance Review Before Automated Money Movement

Goal: validate legal/payment structure before scaling rails.

Deliverables:

- written money-flow diagram
- attorney review package
- payment operations requirements
- decision on Stripe Connect / Modern Treasury / other rails later

## Implementation Order

Recommended first sprint:

1. Add payee enums/tables.
2. Add nullable `payee_id` and `payee_match_status` to `mercybridge_needs`.
3. Build admin payee directory CRUD.
4. Add alias table and simple normalized search.
5. Add verification status/level controls.
6. Add migration/seed for top trusted utility billers.

Recommended second sprint:

1. Add `mercybridge_need_documents` table.
2. Store extraction result JSON.
3. Build reviewer extraction panel.
4. Add fuzzy match suggestions.
5. Add approve-match/create-new-payee/merge-alias actions.

Recommended third sprint:

1. Add verification queue.
2. Add risk flags.
3. Add category playbooks.
4. Add payment method memory.
5. Add payment attempts and receipt confirmation.

## Engineering Notes

- Keep raw documents private and time-limited where possible.
- Store only safe summaries long-term unless there is a clear operational/legal reason.
- Use RLS aggressively: sponsor-facing reads must never expose internal payee payment routes or raw documents.
- Treat OCR/LLM output as `suggested`, never authoritative.
- Make every admin trust-changing action auditable.
- Prefer reviewer explainability over black-box fraud scoring.
- Do not let “trusted payee” mean “auto-approved requester.” It only reduces payee verification work.

## V3 Bridge

V2 creates the data foundation for v3 automation.

Possible v3 integrations only after v2 proves the workflow:

- Stripe Connect-style managed platform payments
- Modern Treasury-style ACH/check/wire operations
- bill pay APIs/payment networks
- direct payee onboarding
- automated payment status reconciliation

The point of v2 is to make those future integrations safe because MercyBridge already knows who is real.
