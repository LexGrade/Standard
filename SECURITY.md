# Security Policy

LexGrade is a static website. There is no backend, no database, and no user accounts. Aggregate traffic and page-performance measurement comes from Cloudflare Web Analytics, a browser beacon Cloudflare adds at the edge.

## Reporting a vulnerability

Email **security@lexgrade.org** (or **hello@lexgrade.org**) with the subject `Security: <short description>`. Please **do not** open a public issue for an unfixed vulnerability.

Reports are acknowledged within 7 days, and confirmed issues are addressed promptly. There is no bounty program.

## Scope

In scope:

- The static site (`sites/lexgrade.org`) and its build pipeline — e.g. content injection, a Content-Security-Policy gap, or a build that could emit unsafe output.

Out of scope:

- The **legal accuracy** of the standard's content. That is governed through the `rfc:` issue process (see [CONTRIBUTING.md](.github/CONTRIBUTING.md)), not as a security matter — though, as stated throughout, every citation must be independently verified before filing.
