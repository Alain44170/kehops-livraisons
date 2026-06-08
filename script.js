/* script.js
   Interactions : menu mobile, reveal on scroll, validation du formulaire
   Commentaires en français

   Template EmailJS attendu :
   Nom du commerce : {{shop_name}}
   Contenu de la commande : {{shopping_list}}
   Message : {{message}}
*/

/* =====================================================
   MODALE DE CONFIRMATION — affichée après envoi réussi
   ===================================================== */
function afficherConfirmation() {
  // Créer la modale si elle n'existe pas encore
  if (!document.getElementById('confirm-modal')) {
    const modal = document.createElement('div');
    modal.id = 'confirm-modal';
    modal.style.cssText = `
      position:fixed;inset:0;z-index:9999;
      display:flex;align-items:center;justify-content:center;
      background:rgba(0,0,0,0.65);backdrop-filter:blur(4px);
      padding:16px;
    `;
    modal.innerHTML = `
      <div style="
        background:#0b3d2e;
        border:2px solid #f9d05e;
        border-radius:18px;
        padding:36px 28px 28px;
        max-width:420px;width:100%;
        text-align:center;
        box-shadow:0 20px 60px rgba(0,0,0,0.5);
        animation:confirmPop .3s cubic-bezier(.34,1.56,.64,1) both;
      ">
        <div style="font-size:3rem;margin-bottom:12px;">✅</div>
        <h2 style="color:#f9d05e;font-family:'Playfair Display',serif;font-size:1.4rem;margin:0 0 12px;">
          Demande envoyée !
        </h2>
        <p style="color:rgba(255,255,255,0.88);font-size:0.95rem;line-height:1.6;margin:0 0 24px;">
          Votre demande de livraison a bien été prise en compte.<br>
          Je vous contacte sous peu au numéro indiqué. 🛵
        </p>
        <button id="confirm-close-btn" style="
          background:linear-gradient(135deg,#f9d05e,#e8c84a);
          color:#0b3d2e;font-weight:800;font-size:1rem;
          border:none;border-radius:10px;padding:13px 32px;
          cursor:pointer;width:100%;
          box-shadow:0 4px 14px rgba(249,208,94,0.4);
          transition:transform .15s;
        ">Fermer</button>
      </div>
    `;
    // Animation CSS
    const style = document.createElement('style');
    style.textContent = `@keyframes confirmPop {
      from { opacity:0; transform:scale(.85) translateY(20px); }
      to   { opacity:1; transform:scale(1)  translateY(0);    }
    }`;
    document.head.appendChild(style);
    document.body.appendChild(modal);

    // Fermer au clic sur le bouton ou en dehors
    document.getElementById('confirm-close-btn').addEventListener('click', fermerConfirmation);
    modal.addEventListener('click', function(e){ if(e.target === modal) fermerConfirmation(); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') fermerConfirmation(); });
  } else {
    document.getElementById('confirm-modal').style.display = 'flex';
  }
  document.body.style.overflow = 'hidden';
}

function fermerConfirmation() {
  const modal = document.getElementById('confirm-modal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', function(){
  // Affiche l'année courante
  document.getElementById('year').textContent = new Date().getFullYear();

  // === EmailJS configuration ===
  const SERVICE_ID = 'service_sxo3uwm';
  const TEMPLATE_ID = 'template_6w6vi39';
  const PUBLIC_KEY = 'NuHxu96_U_IxWB1TO';

  // Initialisation EmailJS
  try{
    if(typeof emailjs !== 'undefined'){
      if(PUBLIC_KEY){
        emailjs.init(PUBLIC_KEY);
        console.log('EmailJS initialisé.');
      } else {
        console.warn('Public Key EmailJS non renseignée.');
      }
    } else {
      console.warn('EmailJS SDK non trouvé.');
    }
  }catch(err){ console.error('Erreur init EmailJS', err); }

  // Menu mobile toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  toggle && toggle.addEventListener('click', ()=> links.classList.toggle('open'));

  // Fermer le menu burger automatiquement au clic sur n'importe quel lien
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      setTimeout(() => links && links.classList.remove('open'), 150);
    });
  });

  // Reveal on scroll
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting) entry.target.classList.add('visible');
    });
  },{threshold:0.12});
  document.querySelectorAll('.step, .card, .review, .map-wrap, .hero-content, .info-box, .why-card').forEach(el=>{
    el.classList.add('reveal'); observer.observe(el);
  });

  const form = document.getElementById('delivery-form');
  const formMsg = document.getElementById('formMsg');
  const submitBtn = document.getElementById('submitBtn');

  form.addEventListener('reset', function(){
    formMsg.textContent = '';
  });

  form.addEventListener('submit', async function(e){
    e.preventDefault();
    formMsg.textContent = '';

    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const address = form.address.value.trim();
    const shopName = form.shop_name.value.trim();
    const shoppingList = form.shopping_list.value.trim();
    const message = form.message.value.trim();
    const paid = document.getElementById('paidConfirm').checked;

    if(!name || !phone || !address || !shopName || !shoppingList || !message || !paid){
      formMsg.textContent = 'Veuillez compléter tous les champs requis.';
      formMsg.style.color = '#c0392b';
      return;
    }

    // Vérification zone de livraison
    if(typeof addressValid !== 'undefined' && !addressValid){
      formMsg.textContent = 'Adresse hors zone de livraison (rayon 3 km autour de Nozay).';
      formMsg.style.color = '#c0392b';
      document.getElementById('address').scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    submitBtn.classList.add('loading');
    submitBtn.setAttribute('disabled', 'disabled');

    if(typeof emailjs === 'undefined'){
      formMsg.textContent = 'Erreur technique : EmailJS non chargé.';
      formMsg.style.color = '#c0392b';
      submitBtn.classList.remove('loading');
      submitBtn.removeAttribute('disabled');
      return;
    }

    const templateParams = {
      name,
      phone,
      address,
      shop_name: shopName,
      shopping_list: shoppingList,
      message
    };

    try{
      const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      console.log('EmailJS success', response);
      form.reset();
      afficherConfirmation();
    }catch(error){
      console.error('EmailJS erreur', error);
      formMsg.textContent = 'Erreur lors de l\'envoi. Veuillez réessayer ou nous appeler directement.';
      formMsg.style.color = '#c0392b';
    }finally{
      submitBtn.classList.remove('loading');
      submitBtn.removeAttribute('disabled');
    }
  });

  // Fermer menu mobile sur ESC
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') links.classList.remove('open'); });
});
