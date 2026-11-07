// SPDX-License-Identifier: AGPL-3.0-only
//
// Sends www.lexgrade.org to the canonical host, keeping the path and query.

export default {
  fetch(request) {
    const url = new URL(request.url);
    url.protocol = 'https:';
    url.hostname = 'lexgrade.org';
    return Response.redirect(url.toString(), 301);
  },
};
