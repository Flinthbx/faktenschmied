// Vercel Serverless Function — nimmt die Demo-Anfrage entgegen und mailt sie via Resend.
// Benötigte Env-Variablen in Vercel: RESEND_API_KEY (Pflicht), optional MAIL_FROM, MAIL_TO.
export default async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ ok: false, error: 'Method not allowed' }); return; }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { vorname = '', nachname = '', email = '', unternehmen = '', telefon = '', branche = '', nachricht = '', company = '' } = body;
    if (company) { res.status(200).json({ ok: true }); return; }            // Honeypot: stiller Erfolg
    if (!email || !nachname) { res.status(400).json({ ok: false, error: 'Bitte Name und E-Mail angeben.' }); return; }

    const key = process.env.RESEND_API_KEY;
    if (!key) { res.status(500).json({ ok: false, error: 'Mailversand ist noch nicht konfiguriert.' }); return; }
    const from = process.env.MAIL_FROM || 'FaktenSchmied Website <onboarding@resend.dev>';
    const to = process.env.MAIL_TO || 'vinzent.hebel@faktenschmied.de';

    const text =
      'Neue Demo-Anfrage über die Website\n\n' +
      'Name: ' + vorname + ' ' + nachname + '\n' +
      'E-Mail: ' + email + '\n' +
      'Unternehmen: ' + unternehmen + '\n' +
      'Telefon: ' + telefon + '\n' +
      'Branche: ' + branche + '\n\n' +
      'Nachricht:\n' + nachricht + '\n';

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], reply_to: email || undefined, subject: ('Demo-Anfrage: ' + vorname + ' ' + nachname).trim(), text }),
    });
    if (!r.ok) { res.status(502).json({ ok: false, error: 'Versand fehlgeschlagen.' }); return; }
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'Serverfehler.' });
  }
}
