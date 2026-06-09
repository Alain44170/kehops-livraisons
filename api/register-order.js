/* api/register-order.js
   Enregistre le numéro de téléphone du client dans Firebase après commande réussie.
   Marque la fin de l'éligibilité à l'offre première commande.
*/

const admin = require('firebase-admin');

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8')
  );
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://kheops-livraisons-default-rtdb.europe-west1.firebasedatabase.app"
  });
}

const db = admin.database();

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { phone } = req.body || {};
  if (!phone || phone.trim().length < 8) {
    return res.status(400).json({ error: 'Numéro invalide' });
  }

  const normalized = phone.replace(/\D/g, '');

  try {
    const ref = db.ref('clients/' + normalized);
    const snapshot = await ref.once('value');

    if (snapshot.exists()) {
      // Client connu — on incrémente juste le compteur
      await ref.update({
        orderCount: (snapshot.val().orderCount || 1) + 1,
        lastOrderAt: new Date().toISOString(),
      });
    } else {
      // Nouveau client — on crée la fiche
      await ref.set({
        firstOrderAt: new Date().toISOString(),
        lastOrderAt:  new Date().toISOString(),
        orderCount:   1,
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('register-order error:', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};
