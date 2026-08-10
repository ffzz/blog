---
title: 'What a Security Clearance Actually Is, for IT Jobs in Canberra'
description: Canberra's IT job ads hide a second screening system behind the technical requirements. Notes on clearance levels, the application process, what gets investigated, and the obligations that follow — compiled from Australian Government sources.
pubDate: 2026-08-09
tags: ['career', 'security-clearance', 'canberra']
---

Hunting for IT work in Canberra comes with a particular kind of tedium: every listing has to be read end to end just to find out whether it needs a security clearance.

The wording is all over the place, too — Baseline, NV1, NV2, PV, TS-PA, one acronym after another:

> Australian citizenship required.
>
> Must be eligible to obtain and maintain a security clearance.
>
> Active NV1 clearance required.

Sometimes you get halfway down a listing and start getting genuinely excited. The stack lines up, the years line up, the responsibilities read like someone copied them off your résumé — and then you reach the fine print at the bottom: must hold a Baseline clearance. Curtain down.

Without Australian citizenship, IT work in Canberra is genuinely hard to come by. A large slice of the market simply isn't open.

How the system actually works, and where exactly it gates people, is scattered across the internet in fragments — a fair amount of it contradictory. These are my notes from reading through the official documents.

## A clearance is a relationship of trust that can be revoked

The first time people hear "security clearance," they tend to picture an upgraded police check, or a certificate you can sit for on your own like an AWS exam. Neither is quite right.

A clearance is closer to a judgment the government makes about a person at a given point in time: whether they're suitable to be trusted with access to classified government information, systems, or resources. Official guidance frames it as an assurance — a confirmation built on the checks completed at that time, not a permanent pass. The clearance holder, the sponsoring organisation, and the vetting agency all continue to carry responsibility for maintaining that trust, and the level required is set by what the role actually needs to touch, not by seniority or job title.

Two people with the same "Software Engineer" title can sit in very different places: building a commercial SaaS product usually needs no clearance at all; writing a government system that handles PROTECTED data might need Baseline; working in a SECRET environment needs NV1; national security and defence systems go further, into NV2 and PV. Even holding NV2 doesn't mean free access to everything marked TOP SECRET — the government runs on a need-to-know principle, where only what's genuinely required for the job is released, and neither seniority nor curiosity counts as a reason.[1]

## Five levels, and a top tier being phased out

| Level | Highest classification it typically allows ongoing access to |
| --- | --- |
| No clearance | Unclassified information; being marked OFFICIAL or OFFICIAL:SENSITIVE alone doesn't automatically trigger a clearance requirement |
| Baseline | PROTECTED |
| Negative Vetting Level 1 (NV1) | SECRET, with temporary access to TOP SECRET in specific circumstances |
| Negative Vetting Level 2 (NV2) | TOP SECRET |
| Positive Vetting (PV) | TOP SECRET, including authorised caveated resources |
| TOP SECRET–Privileged Access (TS-PA) | TOP SECRET and authorised caveated resources; gradually replacing PV, administered by the TS-PA Vetting Authority inside ASIO |

"Negative Vetting" isn't a verdict — it's just the historical name for those two levels. One detail that's easy to miss: a role can require a clearance simply because it counts as a position of trust, even if it doesn't handle classified material directly, so you can't judge whether a job needs vetting purely by the classification labels attached to its data.[1][6]

## Why PR isn't enough on its own

Under the general eligibility rules, applying for an Australian Government security clearance requires two things at once: Australian citizenship, and a checkable background. Every clearance also has to be sponsored by a government entity or an accredited organisation — you can't sponsor yourself, and there's no way to simply pay AGSVA for an NV1 out of pocket.[1][2]

PR grants the right to live and work in Australia long-term, but it usually can't substitute for the citizenship requirement a clearance sits on. A citizenship waiver does exist for non-citizens, but it was never meant to be a standard job-seeking path. Organisations generally only consider one where there's an exceptional business need — the person is essential to a critical task, the role can't be redesigned to avoid classified material, there's no suitable Australian citizen available, the applicant's nationality doesn't create an unacceptable conflict of interest with the role, or the applicant is a PR actively pursuing citizenship. Even an approved waiver doesn't guarantee the clearance itself gets granted — waivers are tied to a specific role and organisation, come with a time limit, need re-justifying, and generally don't transfer if you change jobs. The 2025 PSPF update went further and explicitly banned stacking multiple eligibility waivers together.[3]

So for most PR job-seekers, the more realistic read is: before you're actually a citizen, don't build your career plan around a citizenship waiver. It's an exception carved out for an organisation's critical need, not a channel designed to solve an ordinary candidate's employment problem.

## A chicken-and-egg problem

You can't apply for a clearance on your own initiative. The process only starts once a government entity or an accredited organisation already intends to place you in a role that genuinely requires one. The normal order is: apply for the role, get selected or receive a conditional offer, get sponsored, and only then does the clearance assessment begin — not the other way around, where someone earns a clearance first and goes job-hunting afterward.

The 2026 PSPF is explicit that agencies hiring under the merit principle shouldn't screen out a candidate purely because they don't currently hold a clearance — as long as the person is willing and able to obtain the required clearance before starting, they shouldn't be required to hold it before being selected. That's why APS job ads tend to say "must be able to obtain and maintain" rather than requiring one up front.

Government contractors and consulting firms often work differently, and the ads say so directly: "active NV1 required." The reason usually isn't a legal requirement — it's that the project has already started, the client needs someone in a secure environment immediately, and the company doesn't have months to wait or the appetite to absorb the risk of a failed assessment and a delayed start. Canberra effectively runs two hiring markets at once: direct government hiring leans toward selecting on merit first and sponsoring afterward, while the contractor market is closer to buying a capability that's ready to deploy right now, with an active clearance as part of that package. It's also why a developer who already holds an NV1 tends to land interviews faster in the contractor market — not necessarily because their code is better, but because they can walk into a client's environment immediately.[7]

## The application is initiated by an employer

The real process is usually initiated by an employer. Before an organisation sponsors you, it typically runs its own pre-employment screening first — a clearance only judges whether you're suitable to hold a government security permission, it doesn't replace verification of your qualifications, employment history, or fitness for the role. Some departments, like Home Affairs, layer an Employment Suitability Screening on top of the AGSVA clearance itself, which means someone can pass AGSVA's vetting and still not meet that particular department's own suitability standard.[8]

Once an organisation decides to sponsor you, the process broadly runs like this: a Security Officer initiates the request in myClearance, you get an email and a text, you fill in your details and upload documents through the portal, AGSVA checks the application is complete, then it moves into checks covering identity, background, police records, travel, finances, referees, and digital footprint, with a security interview, financial review, or psychological assessment layered in depending on the level. A vetting analyst puts together an assessment and passes a recommendation to an authorised delegate, and finally both you and your sponsor get the outcome.

Applicants generally have 20 business days to complete the myClearance application, and AGSVA's own target is to confirm completeness within 10 business days of submission — the formal assessment clock only starts once the file is confirmed complete. Missing documents, slow referees, and hard-to-verify overseas history can all stretch things out. If a specific document genuinely can't be obtained, AGSVA may accept a Statutory Declaration in its place, but that's not a blanket substitute for anything unverifiable — the underlying question is still whether your identity and history can be confirmed through independent, reliable sources.[1]

## What actually gets investigated

Say "background check" and most people think of a criminal record. That's part of it, but the scope of vetting goes well beyond an ordinary National Police Check: identity, birth certificates, name changes, addresses, employment and education history, passports and overseas travel, criminal and legal records, drug use, organisational memberships and online accounts, family members and partners, overseas contacts you're in regular touch with, income, property, loans and business interests, your public digital footprint, health and psychological status, and whatever your referees report.

How far back that history needs to go depends on the level. Baseline usually covers the last five years of addresses, employment, education, and travel; NV1 and NV2 usually go back ten years; PV goes back to age sixteen, or the last ten years, whichever is longer. Referee requirements scale up the same way — Baseline typically needs one professional referee covering at least the last three months; NV1 and NV2 add a personal referee who can speak to the last ten years; PV needs one professional referee and four personal referees, together covering from age sixteen or the last ten years, whichever is longer. Referees are generally given fifteen business days to respond, and for PV they may also be interviewed by phone, video, or in person.[1]

The mental model to go in with is this: an independent agency needs to reconstruct and verify years of your life. Uploading a passport and a clean police check doesn't come close.

## For migrants, the hard part isn't an overseas background — it's whether it can be verified

For anyone who arrived in Australia as an adult, most of their education, work, housing, and social ties happened somewhere else. The natural worry follows: parents overseas, regular contact with friends and family in the country of origin, years of study and work abroad — does that sink the application before it even starts?

There's no rule that says "born overseas, automatic fail." What actually gets assessed is whether that history can be verified through independent, reliable sources, whether there are gaps that can't be explained, whether there's a loyalty, obligation, or interest that could conflict with Australia's national interest, whether family, debt, or assets could make someone vulnerable to coercion, and whether the applicant disclosed everything honestly, proactively, and in full. The PSPF defines a checkable background as one the vetting agency can actually verify through independent, reliable sources — gaps created by an overseas history lower the agency's confidence, but they aren't the same thing as a security problem. Employer records, school records, official documents, and referees who genuinely knew you at the time can all help fill in the picture.

Practically, that means it's worth getting organised early: overseas birth certificates and household registration documents, transcripts and diplomas, contracts or payslips from past employers, a full address history, old passports and travel records, referees who can speak credibly to the years spent overseas, foreign-language marriage, divorce, or name-change documents, and NAATI-certified translations where required — AGSVA is explicit that non-English birth certificates and marriage documents generally need a NAATI translation.[1]

Overseas family and foreign contacts aren't an automatic disqualifier either. The 2026 Personnel Security Adjudicative Standard runs on a whole-person assessment: whether a foreign contact is a risk depends on the nature of the relationship, the country involved, who the other person is, how often you're in touch, whether it could create a conflict of interest or an opportunity for coercion, and whether the applicant reported it themselves. Contact that's occasional and ordinary in nature, a long and deep connection to Australia, or dual citizenship that simply comes from parentage, birth, marriage, or travel convenience — all of these are treated as factors that reduce risk. The right approach is to describe the relationships, the frequency, the context, and the real-world impact honestly — without hiding, downplaying, or guessing at what the interviewer wants to hear. Cutting off normal family relationships, or dressing a background up to look more Australian than it is, achieves nothing.

## Debt and therapy don't disqualify you either

The adjudicative standard assesses seven main risk areas: external loyalty and affiliations, personal relationships and conduct, financial circumstances, alcohol and drug use, criminal history, security attitude and violations, and emotional and psychological health. What ultimately matters is character — honesty, trustworthiness, maturity, tolerance, resilience, and loyalty — and a single piece of unfavourable information doesn't automatically lead to a refusal. Assessors also weigh how serious the conduct was, the context it happened in, how often, how long ago, how old the applicant was at the time, whether it's been addressed, and how likely it is to recur.[4]

A mortgage, a car loan, or a credit card doesn't fail you just for existing. What the financial review actually cares about is an inability or unwillingness to repay debt, a long pattern of not meeting financial obligations, consistently spending beyond your means, unexplained wealth, tax evasion, fraud or other unlawful financial conduct, out-of-control gambling, and whether your financial position leaves you open to inducement or coercion. If financial difficulty came from redundancy, illness, divorce, or a business downturn, and the applicant actively managed the debt, set up a repayment plan, and behaved responsibly, those count as mitigating factors.

Mental health works the same way. The 2026 standard states plainly that seeking mental health counselling on its own can't be used to draw a negative inference. What's actually assessed is whether a condition materially affects judgement, reliability, or trustworthiness, and whether the applicant is following professional treatment advice. A condition that's being treated, stable, and disclosed proactively can lower the associated risk rather than raise it. "Has seen a psychologist" and "unfit to hold a clearance" simply aren't the same statement — trying to hide a medical history, on the other hand, tends to create a brand-new integrity problem.

Concealment is generally the more dangerous move. The standard states clearly that refusing to cooperate with the assessment, or refusing to give complete, candid, and truthful answers, can lead to a clearance being refused, revoked, or the process terminated outright — and deliberately withholding something is treated as a separate strike against your integrity and judgement. If you're unsure whether something needs to be disclosed, the safer move is to ask your Security Officer, not to decide privately that "they probably won't find it."[4]

## Time and money: why an active clearance is worth something

As of when this was written, AGSVA's published service targets and reported actual performance look roughly like this, in business days:

| Level | Service target | Reported actual performance |
| --- | --- | --- |
| Baseline | 20 days | ~26 days |
| NV1 | 70 days | ~81 days |
| NV2 | 100 days | ~103 days |
| PV | 180 days | ~212 days |

These are aggregate figures, not a promise for any individual case — a complex background, overseas checks, missing paperwork, or slow referees can all push things further out. The clock starts once the application is confirmed complete, and doesn't include the applicant's initial 20 business days to fill out the form or the completeness check itself. The sponsoring entity pays the fees, not the applicant; holding a clearance day-to-day doesn't carry an ongoing cost, but re-assessment, upgrades, and revalidation do.[5][9]

From an employer's perspective, the value of a candidate who already holds an active NV1 is easy to see: no need to fund and organise an assessment from zero, no months of waiting, a more predictable project start date, lower risk that the candidate ultimately fails to clear, and the ability to deploy someone into a government client's environment and start billing sooner. That's the real commercial value an active clearance carries in the contractor market — though it doesn't automatically mean a higher salary. It narrows the pool of eligible candidates and improves your odds of getting into certain projects; final pay still comes down to technical skill, how scarce the role is, the contract structure, and market supply and demand.

## Being cleared isn't the end of the story

A clearance can sit in a few different states: active (a current sponsor exists, and both holder and sponsor are meeting their maintenance obligations), inactive (still inside its revalidation window but without a current sponsor), expired (past the revalidation window), or ceased (formally ended through refusal, revocation, or no longer meeting eligibility). A new employer generally can't just "take over" an expired clearance — they need to start a fresh initial assessment.

Change jobs, and your new employer has to register a sponsorship interest in myClearance. A person can have multiple sponsors at once if there's a genuine business need for each, but every organisation has to register its interest formally. A clearance with no sponsor becomes inactive, and can eventually be cancelled. The more accurate way to think about it is that a clearance is a government security qualification that a new organisation can continue to sponsor when the conditions are met. It was never a piece of personal property to carry around forever. Once you leave a role, your access to that organisation's systems, premises, and material is revoked; even if the clearance status itself can later be reactivated, that doesn't mean you still have any right to touch the projects you used to work on.

There's an ongoing reporting obligation too, covering things like: changes to your name, identity, or nationality; marriage, separation, cohabitation, or other significant relationship changes; moving house or changes to who you live with; frequent or unusual foreign contact; overseas relatives and residency; international travel; a new mortgage, significant new debt, a major change in household income, or an unexpected windfall; changing employer; outside business activities, especially with overseas individuals or organisations; a significant change in health, medical, or psychological status; police involvement, criminal matters, or disciplinary action; illegal drug use or alcohol problems; a security incident; and identity documents compromised through a cyberattack. Buying a house or getting married obviously doesn't need anyone's approval; it just needs reporting in line with your clearance and your organisation's rules, so the security team can decide whether anything further has to happen. Political views aren't subject to blanket scrutiny either — simply changing who you vote for doesn't need reporting, though a shift in belief that turns into active support for or participation in a political cause might be something to disclose. Under the traditional AGSVA framework, the standard revalidation cycle currently sits at 15 years for Baseline, 10 for NV1, and 5 to 7 for NV2 and PV, and AGSVA can trigger a review for cause outside the normal cycle whenever a specific risk emerges.[1]

One rule that's become progressively firmer: don't put your clearance level on LinkedIn. AGSVA is explicit that clearance holders must not publish their specific clearance level on LinkedIn or any other social platform, and that responsibility extends to making sure employers, recruiters, or third parties don't publish it either — you're expected to have it removed if they do, and an unresolved public disclosure can itself count as a reportable security incident. PSPF Direction 003-2025, which took effect in October 2025, goes further and requires government entities to manage the risk of personnel disclosing anything online that identifies or hints at access to classified material — including the simple fact of holding a clearance at all. In practice, the safest approach is to leave Baseline, NV1, NV2, PV, and TS-PA off your public résumé, personal site, and social media entirely, and not to hint at what kind of systems you can access. Where the information genuinely needs to be shared, it goes through the channel an organisation actually approves — a recruiter or Security Officer directly, not a public profile.[6][10]

## Is it worth it? That depends on the life you want

For someone planning to stay in Canberra long-term and willing to work inside the government or defence ecosystem, a clearance opens up an entire slice of the job market that's otherwise closed off — government departments, defence, national security, border enforcement, and the consulting and defence-industry firms that serve them all expand noticeably. If you already hold an active clearance, the "immediate start" contractor roles open up too. That scarcity is itself a genuine career moat: technical skill can be built through training and project experience, but an active clearance needs a real role, organisational sponsorship, time, and continuous maintenance — which is worth real money to a company with an urgent project, even if it's better understood as a deployment advantage than a technical credential. Some roles pay extra for it, too — a 2026 ASIO listing for the TS-PA Vetting Authority itself offered a 7.5% allowance for maintaining TS-PA, though that same role also explicitly ruled out working from home.

The costs are just as real. First, the barrier to entry itself — without citizenship, this path is essentially closed, and even after becoming a citizen you still need to land a role willing to sponsor you, which is a genuinely uneven starting line for a migrant just entering the workforce. Second, privacy — vetting touches on things you'd normally never volunteer to an employer: family relationships, overseas contacts, finances, drug use, mental health, travel history, online accounts. All of it sits under the Privacy Act, but the process itself is still deeply invasive. Third, constraints on how you work — jobs handling classified material generally can't be done over a home network or in a public space, and the higher the clearance and the more sensitive the system, the less likely fully remote work becomes, which is a real problem if you like remote work, travel often, or want the option to live in different countries. Fourth, limits on what you can show — a lot of this work can never go in a portfolio, sometimes you can't even describe the nature of the project, and since you also can't disclose the clearance itself, it becomes harder to prove what you've actually built outside the government ecosystem. Fifth, a kind of technical path dependency — some government and defence projects genuinely run on modern cloud, data, and distributed-systems work, but others are shaped by legacy systems, procurement cycles, and strict change control, and years of maintaining a closed system you can't talk about can quietly drift your skills away from what global product companies and startups are doing. Sixth, career inertia — once you hold an active clearance, the easiest next job tends to be another security-cleared role, and a few years in, your network, résumé, and salary expectations can end up tightly bound to the Canberra government market. That's not necessarily a bad thing, but it's better as a choice you made deliberately than a path you drifted into.

## A realistic path through it

Before citizenship, there's no point chasing courses or services that claim to "arrange" a clearance — individuals can't self-sponsor, and any pitch that packages one as something you can simply buy has sidestepped the actual problem, which is finding a sponsor. What's worth doing at that stage: build real Australian experience at companies that don't need a clearance, keep improving technical skill and English communication, keep a complete record of addresses, employment, education, and travel, maintain a stable and explainable financial position, stay in touch with former managers and long-standing friends who could serve as referees later, and plan the citizenship application around your own circumstances.

Once citizenship is sorted, roles advertised as "Australian citizenship required, must be eligible to obtain and maintain a security clearance" are usually a better bet than ones demanding "active NV1 required" from day one — the former is far more likely to sponsor a strong candidate who doesn't already hold one. Direct government hiring, graduate programs, and larger organisations able to start someone on unclassified work all make better entry points than a small contractor who needs a body on a project this week.

The paperwork can be assembled long before an invitation arrives: five to ten years of address history, every stretch of employment and education, overseas travel records, passports, birth, citizenship, marriage, and name-change documents, NAATI translations for anything not in English, referees who can genuinely cover the relevant years, details on overseas family, an honest financial picture, and a clear explanation ready for anything that needs one. The goal when filling it out is to be complete, consistent, and verifiable — trying to look flawless is precisely what vetting is trained to notice. Once cleared, it's worth knowing exactly who the current sponsor is, what state the clearance is in, and which life changes trigger a report. And none of it belongs on LinkedIn, a personal site, or a public résumé.

Having read through all of it, my takeaway is this: a security clearance is neither the impassable wall it's sometimes made out to be, nor something citizenship hands over automatically. It's a system with clear rules and clear costs. Understanding the rules first, and then deciding whether to step into it, matters a lot more than closing the tab the moment a line reads "NV1 required."

---

*These are notes compiled from publicly available Australian Government sources. They describe general rules, aren't professional advice, and aren't a guarantee of any individual outcome. For a specific role, assessment, reporting, or disclosure requirement, defer to your sponsoring entity, Security Officer, the relevant Authorised Vetting Agency, and whatever version of the PSPF is current at the time.*

## References

1. [AGSVA Security Clearance Applicant Guide Book](https://www.agsva.gov.au/sites/default/files/2025-05/AGSVASecurityClearanceApplicantGuideBookMar2025.pdf)
2. [Overview of AGSVA Security Clearances](https://support.ausclear.au/articles/overview-of-agsva-security-clearances)
3. [PSPF Policy 12 — Eligibility and suitability of personnel](https://www.protectivesecurity.gov.au/sites/default/files/pspf-persec-12-eligibility-suitability-personnel.pdf)
4. [PSPF Publications Library](https://www.protectivesecurity.gov.au/publications-library)
5. [AGSVA — Key performance indicators](https://www.agsva.gov.au/about/key-performance-indicators)
6. [AGSVA — Social media compliance](https://www.agsva.gov.au/clearance-holders/responsibilities/social-media-compliance)
7. [ASD — How to apply](https://www.asd.gov.au/careers/how-to-apply)
8. [Department of Home Affairs — Employment Suitability Screening](https://www.homeaffairs.gov.au/about-us/careers/vacancies/employment-suitability-clearance)
9. [AGSVA Service Level Charter](https://www.agsva.gov.au/sites/default/files/2024-01/2023-24-AGSVA-Service-Level-Charter-Signed-ASV.pdf)
10. [PSPF Direction 003-2025 — Online Disclosure of Security Clearance and National Security Information](https://www.protectivesecurity.gov.au/publications-library/direction-003-2025-online-disclosure-security-clearance-and-national-security-information)
