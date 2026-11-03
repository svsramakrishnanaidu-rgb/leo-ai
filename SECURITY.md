# Security policy

## Scope and status

LEO.AI is a community-built **prototype**, not a government-affiliated service. Its complaint records currently live in the user's browser via `localStorage`, and sample records demonstrate the interface. It is not suitable for production use with sensitive civic reports until backend storage, access controls, and privacy protections are implemented.

## Important: AI API keys in frontend applications

The current implementation in `src/lib/ai.ts` and `src/lib/chatbot.ts` reads `import.meta.env.VITE_GROQ_API_KEY` and calls Groq directly from the browser.

**Any variable prefixed with `VITE_` is exposed to client-side code. It cannot securely store a secret.**

- Do **not** deploy this frontend with a real Groq API key in `VITE_GROQ_API_KEY`.
- Do **not** commit an `.env` file or credentials.
- If a real key was committed or deployed to a public browser bundle, **revoke/rotate it**.
- For production, add a trusted server or serverless endpoint that stores `GROQ_API_KEY` as a server-only secret and proxies requests with authentication, input validation, rate limits, and usage controls.
- Local fallback classification and chat do not require any key.

## Data handling

- The prototype stores complaint information in browser `localStorage`, not a shared database.
- Data is not reliably backed up or synchronized across devices.
- Do not put names, phone numbers, exact home addresses, or other sensitive personal information into demonstration reports.
- Maps and address lookups may send searches to third-party OpenStreetMap/Nominatim services, according to their own policies.
- Demo status entries are not official updates.

## Reporting a vulnerability

Please **do not** post active secrets, private personal data, or exploitable details in a public GitHub issue.

Contact the repository owner privately through their GitHub profile or use GitHub's private vulnerability reporting feature if it is enabled. Include reproduction steps, affected component, expected and actual behavior, and possible impact. Do not test against other people's accounts or data.

## Before production deployment

- [ ] Move all AI provider calls and credentials to a protected server-side service
- [ ] Add server-side authentication, authorization and request throttling
- [ ] Implement secure shared persistence with privacy and deletion controls
- [ ] Audit personal-data collection and third-party data transfers
- [ ] Add security and accessibility tests
- [ ] Clearly distinguish demonstrations from official reports
