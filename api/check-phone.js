/* api/check-phone.js
   Vérifie dans Firebase si un numéro de téléphone a déjà passé une commande.
   Retourne : { firstOrder: true/false }
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

  // Normaliser : garder uniquement les chiffres
  const normalized = phone.replace(/\D/g, '');

  try {
    const snapshot = await db.ref('clients/' + normalized).once('value');
    return res.status(200).json({ firstOrder: !snapshot.exists() });
  } catch (err) {
    console.error('check-phone error:', err);
    return res.status(200).json({ firstOrder: false });
  }
};
