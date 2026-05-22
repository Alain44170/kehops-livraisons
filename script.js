/* script.js
   Interactions : menu mobile, reveal on scroll, validation du formulaire
   Commentaires en français

   Template EmailJS attendu :
   Nom du commerce : {{shop_name}}
   Contenu de la commande : {{shopping_list}}
   Message : {{message}}
*/

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

  // Reveal on scroll
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting) entry.target.classList.add('visible');
    });
  },{threshold:0.12});
  document.querySelectorAll('.step, .card, .review, .map-wrap, .hero-content, form, .info-box').forEach(el=>{
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
      formMsg.textContent = 'Votre demande a bien été prise en compte. Je vous contacte sous peu !';
      formMsg.style.color = 'var(--accent)';
      form.reset();
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
