# Bible translation access and runtime status

This app is a static, no-build site. It has no server-side secret store or licensed Bible provider configured. Translation selection is persisted as an additive `settings.bibleVersion` value in `wol.v1`.

## Runtime

| Version | In-game status | Access path and limits |
| --- | --- | --- |
| KJV | Available | Existing lesson/support passages are served from the app's built-in KJV corpus. Other requested references use `bible-api.com` one passage at a time. Its public service documents CORS, a rate limit of 15 requests per 30 seconds, and asks clients not to download a whole Bible. The app uses an in-memory page cache only and does not bundle or persist downloaded Bible text. When offline, only already bundled lesson/support passages remain readable. |
| NIV | Unavailable pending authorization | Biblica says app/website text use requires written permission. Its current page offers an express route for qualifying noncommercial, AI-free apps via API.Bible or YouVersion; commercial use needs a permission request. API.Bible's current version table lists NIV 2011 as a Unique License, so confirm the exact plan/edition directly before enabling. |
| NLT | Unavailable pending authorized API access | Tyndale directs Bible app requests to API.Bible. API.Bible currently lists NLT under Standard License; plan, edition, attribution, caching, and any commercial-use terms must be confirmed for this app. |
| MSG | Unavailable pending written authorization | API.Bible currently lists The Message under Standard License. Tyndale's permissions guidance separately says online-platform use requires its permissions questionnaire. Confirm in writing that the chosen API.Bible license covers this online game before enabling. |
| EASY | Unavailable pending written permission | MissionAssist owns the EasyEnglish Bible and requires advance written approval for use on an electronic platform/app. Its policy supplies required attribution. EasyEnglish is not listed in the current API.Bible version catalog. |

The other versions remain selectable so a learner can set a preference. The reader shows an explicit unavailable state and offers the KJV inside the game plus an official publisher reading link. It never substitutes KJV text under another abbreviation.

## Copyright and implementation constraints

- A browser-only app cannot keep a private API key secret. Do not place API.Bible credentials or licensed text in client source. Add a same-origin licensed provider/proxy only after an access plan and the hosting endpoint are approved.
- API.Bible requires app-level attribution, per-passage citation/linking, metadata/license checks, and Fair Use Management System (FUMS) for web apps. Its cache guidance says cached licensed content must be refreshed at least every 30 days. Re-check the chosen translation's individual End User License and publisher rules.
- API.Bible terms do not permit turning copyrighted text into speech without specific permission. Current browser narration is therefore shown only for KJV. Do not enable browser text-to-speech for NIV, NLT, MSG, or EASY without written rights.
- Reading selectors do not alter puzzle data. Existing exact-word completion and recall activities stay labelled KJV so their answer keys cannot drift when a player chooses another reading version.
- No copyrighted text from the unavailable translations is bundled, fetched, or cached by this implementation.

## Official sources checked 2026-11-10

- [bible-api.com usage and terms](https://bible-api.com/)
- [API.Bible version catalog](https://www.api.bible/bibles), [terms](https://www.api.bible/terms-and-conditions), and [express licensing FAQ](https://care.api.bible/article/405-express-licensing-faqs)
- [Biblica permissions](https://www.biblica.com/permissions/)
- [Tyndale permissions for NLT and The Message](https://www.tyndale.com/permissions)
- [MissionAssist EasyEnglish copyright and licensing](https://www.easyenglish.bible/copyright-and-licensing/)

This is an implementation status record, not a legal opinion. Request written confirmation from the rights holders/provider for the game's intended distribution and monetization model before serving copyrighted translation text.
