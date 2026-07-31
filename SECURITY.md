# Security Policy

LexGrade is a static, zero-JavaScript website. There is no backend, no database, no user accounts, and no user data is collected or stored.

## Reporting a vulnerability

Email **security@lexgrade.org** (or **hello@lexgrade.org**) with the subject `Security: <short description>`. Please **do not** open a public issue for an unfixed vulnerability.

We aim to acknowledge a report within 7 days and to address confirmed issues promptly. There is no bounty program.

## Scope

In scope:

- The static site (`sites/lexgrade.org`) and its build pipeline — e.g. content injection, a Content-Security-Policy gap, or a build that could emit unsafe output.

Out of scope:

- The **legal accuracy** of the standard's content. That is governed through the `rfc:` issue process (see [CONTRIBUTING.md](.github/CONTRIBUTING.md)), not as a security matter — though, as stated throughout, every citation must be independently verified before filing.
