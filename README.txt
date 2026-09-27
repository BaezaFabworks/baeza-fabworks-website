BAEZA FABWORKS WEBSITE — FIRST BUILD

Open index.html in a browser to preview locally.

Pages: Home, Services, Projects, 3D/CAD, About, Request a Quote.

Next steps with ChatGPT:
1. Add real project photos.
2. Confirm phone/email/social links and service area.
3. Choose licensed music or shop ambience and add it to assets.
4. Connect quote form + file uploads.
5. Choose domain/hosting and publish.

The quote form is intentionally local-only in this first build; it does not transmit customer data yet.


V14 FORM INTEGRATION
--------------------
Request a Quote is connected to Formspree form ID xyezbozd using the endpoint https://formspree.io/f/xyezbozd.
The site submits with Vanilla JavaScript/AJAX and multipart FormData so visitors remain on the Baeza Fabworks page and can receive inline success/error feedback.
Spam honeypot (_gotcha), double-submit protection, and client-side upload limit checks are included.
File uploads require a Formspree plan that supports native file uploads. Formspree currently limits each submission to 10 files, 25 MB per file, and 100 MB total request size.
