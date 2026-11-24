# LEO.AI — Civic assistance architecture and acceptance guide

This document expands the [README](README.md) without changing application behavior. LEO.AI is an independent civic-reporting prototype. Reports and demonstration status records reside in browser local storage. Creating a report does not send a complaint to a government authority.

## Working mechanism

~~~mermaid
flowchart TD
 A[Describe civic problem] --> B[Classify issue]
 B --> C{Optional AI available?}
 C -->|Yes| D[Request suggested category]
 C -->|No| E[Local rule-based fallback]
 D --> F[Review complaint draft]
 E --> F
 F --> G[Save locally]
 G --> H[Local dashboard and tracking]
 H --> I[No official submission]
~~~

The interface helps turn an unstructured issue into a more useful description. Category and department suggestions are informational. A person should review the description before saving, particularly when an ambiguous location or personal allegation is involved. A local report identifier is not a government acknowledgment number.

## Data boundary

~~~mermaid
flowchart LR
 U[Browser user] --> R[React interface]
 R --> L[Browser local storage]
 R --> M[Leaflet and map data]
 R --> A[Optional Groq request]
 A --> R
 R -. future authorized integration .-> G[Government service]
~~~

Local storage is specific to the browser profile and origin. It is not shared municipal storage, does not synchronize across devices and can disappear if browser data is cleared. Map providers and optional model services are external systems; only necessary information should be sent. Do not include sensitive personal identifiers in sample reports.

## AI credential mechanism

The current documented browser integration uses a Vite client variable. A Vite-prefixed value can be embedded in the public browser bundle; it must not be treated as a private production credential. A proposed architecture moves inference to a server endpoint, validates inputs, limits request size and rate, reads secrets on the server and returns only the permitted response. This is a recommendation, not a completed migration. Rotate any previously exposed secret before deployment.

## Test cases

| Case | Expected result |
| --- | --- |
| AI key absent | Local fallback remains usable |
| Ambiguous issue | Suggest category without inventing facts |
| Reload same browser | Previously saved local reports remain if storage is available |
| Different browser | No assumption of synchronization |
| Location permission denied | Manual location entry or clear alternative |
| Language changed | Controls remain usable in supported languages |
| Report saved | No message claiming municipality receipt |

## Accessibility and future integration

Validate labels, focus order, contrast and language coverage with real assistive technology. Preserve both a textual location description and map context so the map is not the only means of interaction. A future official submission mechanism would need authorized endpoints, consent, authenticated identity where required, delivery receipts, reliable status provenance and a clear distinction between draft, sent and acknowledged. Until that is implemented and independently verified, do not market the project as an official reporting system.
