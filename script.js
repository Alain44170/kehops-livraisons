/* script.js
   Interactions : menu mobile, reveal on scroll, validation du formulaire
   Commentaires en français

   Template EmailJS attendu :
   Contenu réel de la commande : {{shopping_list}}
   Message : {{message}}
   Lien vers la photo de la carte : {{image_url}}
*/

document.addEventListener('DOMContentLoaded', function(){
  // Affiche l'année courante
  document.getElementById('year').textContent = new Date().getFullYear();

  // === EmailJS configuration ===
  const SERVICE_ID = 'service_sxo3uwm';
  const TEMPLATE_ID = 'template_6w6vi39';
  const PUBLIC_KEY = 'NuHxu96_U_IxWB1TO';

  // === Cloudinary configuration ===
  const CLOUDINARY_CLOUD_NAME = 'demioehav';
  const CLOUDINARY_UPLOAD_PRESET = 'superu_cards';

  // Initialisation EmailJS (nécessite que le SDK soit chargé avant ce script)
  try{
    if(typeof emailjs !== 'undefined'){
      if(PUBLIC_KEY){
        emailjs.init(PUBLIC_KEY);
        console.log('EmailJS initialisé avec la Public Key.');
        console.log('EmailJS chargé');
      } else {
        console.warn('Public Key EmailJS non renseignée. Remplacez PUBLIC_KEY dans script.js');
      }
    } else {
      console.warn('EmailJS SDK non trouvé — vérifiez que le script CDN est chargé.');
    }
  }catch(err){ console.error('Erreur init EmailJS', err); }

  // Menu mobile toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  toggle && toggle.addEventListener('click', ()=> links.classList.toggle('open'));


  // Reveal on scroll using IntersectionObserver
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting) entry.target.classList.add('visible');
    });
  },{threshold:0.12});
  document.querySelectorAll('.step, .card, .review, .map-wrap, .hero-content, form, .info-box').forEach(el=>{
    el.classList.add('reveal'); observer.observe(el);
  });

  // Form validation and fake submit (préparer pour intégration serveur)
  const form = document.getElementById('delivery-form');
  const formMsg = document.getElementById('formMsg');
  const submitBtn = document.getElementById('submitBtn');
  const photoPreview = document.getElementById('photoPreview');
  const cardPhoto = document.getElementById('cardPhoto');

  // Pas de toast — showToast est une fonction inoffensive (log uniquement)
  function showToast(text, type='success'){
    console.log('showToast suppressed:', text, type);
  }

  function clearPhotoPreview(){
    photoPreview.innerHTML = '';
    photoPreview.style.display = 'none';
  }

  function showPhotoPreview(file, compressedSize){
    if(!file || !file.type.startsWith('image/')){
      clearPhotoPreview();
      return;
    }
    const url = URL.createObjectURL(file);
    photoPreview.innerHTML = `
      <img src="${url}" alt="Aperçu de la photo de la carte Super U" />
      <div class="preview-text">
        <span>Photo prête à l’envoi</span>
        <small>Poids d’origine : ${Math.round(file.size/1024)} Ko</small>
        ${compressedSize ? `<small>Poids après compression : ${Math.round(compressedSize/1024)} Ko</small>` : ''}
      </div>
    `;
    const img = photoPreview.querySelector('img');
    img.onload = () => URL.revokeObjectURL(url);
    photoPreview.style.display = 'flex';
  }

  async function loadCompressedImage(file, maxSize = 200 * 1024, maxWidth = 1200){
    const createBitmap = window.createImageBitmap ? window.createImageBitmap(file) : Promise.reject();
    let image;
    try{
      image = await createBitmap;
    }catch(_){
      const tempUrl = URL.createObjectURL(file);
      image = await new Promise((resolve, reject)=>{
        const img = new Image();
        img.onload = ()=>{ URL.revokeObjectURL(tempUrl); resolve(img); };
        img.onerror = ()=>{ URL.revokeObjectURL(tempUrl); reject(new Error('Image load failed')); };
        img.src = tempUrl;
      });
    }

    const originalWidth = image.width;
    const originalHeight = image.height;
    const maxDimension = Math.min(maxWidth, originalWidth);
    const scales = [1, 0.92, 0.84, 0.78, 0.72, 0.66];
    const qualities = [0.92, 0.86, 0.78, 0.72, 0.68, 0.62];
    let bestBlob = null;
    let bestInfo = null;

    for(const scale of scales){
      const width = Math.round(originalWidth * Math.min(scale, maxDimension / originalWidth));
      const height = Math.round(originalHeight * Math.min(scale, maxDimension / originalWidth));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, width);
      canvas.height = Math.max(1, height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      for(const quality of qualities){
        const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
        if(!blob) continue;
        if(!bestBlob || blob.size < bestBlob.size){
          bestBlob = blob;
          bestInfo = {size: blob.size, width: canvas.width, height: canvas.height, quality};
        }
        if(blob.size <= maxSize){
          return {blob, size: blob.size, width: canvas.width, height: canvas.height, quality};
        }
      }
    }

    return bestInfo ? {blob: bestBlob, ...bestInfo} : null;
  }

  async function uploadToCloudinary(file){
    if(!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET){
      throw new Error('Cloudinary config manquante : renseignez CLOUDINARY_CLOUD_NAME et CLOUDINARY_UPLOAD_PRESET.');
    }

    console.log('Cloudinary connecté');
    console.log('Upload preset :', CLOUDINARY_UPLOAD_PRESET);

    const cloudUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'super_u_cards');
    formData.append('resource_type', 'image');

    const response = await fetch(cloudUrl, {
      method: 'POST',
      body: formData
    });

    if(!response.ok){
      const text = await response.text();
      throw new Error(`Cloudinary upload failed (${response.status}): ${text}`);
    }

    const payload = await response.json();
    const imageUrl = payload.secure_url || payload.url;
    console.log('Image uploadée :', imageUrl);
    console.log('URL image :', imageUrl);
    return imageUrl;
  }

  function buildTempFormWithImageUrl(originalForm, imageUrl){
    const tempForm = document.createElement('form');
    tempForm.style.display = 'none';

    Array.from(originalForm.elements).forEach(element => {
      if(!element.name || element.disabled) return;
      if(element.type === 'file') return;
      if(element.type === 'checkbox' || element.type === 'radio'){
        if(!element.checked) return;
      }
      const hidden = document.createElement('input');
      hidden.type = 'hidden';
      hidden.name = element.name;
      hidden.value = element.value;
      tempForm.appendChild(hidden);
    });

    const imageUrlField = document.createElement('input');
    imageUrlField.type = 'hidden';
    imageUrlField.name = 'image_url';
    imageUrlField.value = imageUrl;
    tempForm.appendChild(imageUrlField);

    document.body.appendChild(tempForm);
    return tempForm;
  }

  cardPhoto.addEventListener('change', function(){
    const file = cardPhoto.files[0];
    if(!file){
      clearPhotoPreview();
      return;
    }
    console.log('Card photo sélectionnée', file.name, file.type, file.size);
    if(file.size > 5*1024*1024){
      formMsg.textContent = 'La photo est trop volumineuse (max 5MB).';
      formMsg.style.color = '#c0392b';
    } else if(file.size < 16000){
      formMsg.textContent = 'La photo semble trop petite. Veuillez prendre une photo nette et lisible du code-barres.';
      formMsg.style.color = '#c0392b';
    } else {
      formMsg.textContent = '';
    }
    showPhotoPreview(file);
  });

  form.addEventListener('reset', function(){
    clearPhotoPreview();
    formMsg.textContent = '';
  });

  form.addEventListener('submit', async function(e){
    e.preventDefault();
    formMsg.textContent='';
    console.log('Soumission du formulaire : début des validations');
    // Contrôles simples
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const address = form.address.value.trim();
    const shoppingList = form.shopping_list.value.trim();
    const message = form.message.value.trim();
    const photo = cardPhoto.files[0];
    const paid = document.getElementById('paidConfirm').checked;

    console.log('Valeurs du formulaire', {name, phone, address, shoppingList, message, photoPresent: !!photo, paid});
    console.log('shopping_list bien récupérée :', shoppingList);
    console.log('Image sélectionnée', photo ? photo.name : 'aucune');

    if(!photo){
      formMsg.textContent = 'Merci de joindre une photo nette du code-barres de la carte Super U.';
      formMsg.style.color = '#c0392b';
      console.log('Validation échouée : aucune photo sélectionnée');
      return;
    }

    if(!photo.type.startsWith('image/')){
      formMsg.textContent = 'Merci de sélectionner une image de la carte Super U.';
      formMsg.style.color = '#c0392b';
      console.log('Validation échouée : fichier non image', photo.type);
      return;
    }

    if(photo.size < 16000){
      formMsg.textContent = 'La photo est trop petite. Utilisez l’appareil photo pour une image nette du code-barres.';
      formMsg.style.color = '#c0392b';
      console.log('Validation échouée : photo trop petite', photo.size);
      return;
    }

    if(!name || !phone || !address || !shoppingList || !message || !paid){
      formMsg.textContent = 'Veuillez compléter tous les champs requis et joindre la photo de la carte.';
      formMsg.style.color = '#c0392b';
      console.log('Validation échouée : champs manquants', {name,phone,address,shoppingList,message,paid});
      return;
    }

    let fileToUpload = photo;
    let compressedResult = null;
    if(photo.size > 200*1024){
      formMsg.textContent = 'Compression de l’image en cours...' ;
      formMsg.style.color = 'var(--accent)';
      try{
        compressedResult = await loadCompressedImage(photo, 200 * 1024, 1200);
      }catch(err){
        console.error('Erreur de compression', err);
        formMsg.textContent = 'Impossible de compresser l’image. Essayez une autre photo.';
        formMsg.style.color = '#c0392b';
        return;
      }

      if(!compressedResult || compressedResult.size > 200 * 1024){
        const sizeKo = compressedResult ? Math.round(compressedResult.size / 1024) : 'inconnu';
        console.error('Compression insuffisante, taille finale trop élevée', sizeKo);
        formMsg.textContent = 'L’image reste trop volumineuse après compression. Prenez une photo plus petite ou plus centrée sur le code-barres.';
        formMsg.style.color = '#c0392b';
        return;
      }

      fileToUpload = new File([compressedResult.blob], photo.name.replace(/\.[^/.]+$/, '.jpg'), {type: 'image/jpeg'});
      console.log('Compression image réussie');
      console.log('Poids final :', compressedResult.size);
      showPhotoPreview(photo, compressedResult.size);
    }

    if(photo.size > 5*1024*1024 && !compressedResult){
      formMsg.textContent = 'La photo est trop volumineuse (max 5MB). Essayez une nouvelle capture ou utilisez un fichier plus léger.';
      formMsg.style.color = '#c0392b';
      console.log('Validation échouée : photo trop volumineuse', photo.size);
      return;
    }

    submitBtn.classList.add('loading');
    submitBtn.setAttribute('disabled','disabled');
    console.log('Upload Cloudinary démarré');
    console.log('Fichier original conservé');

    let imageUrl;
    try{
      imageUrl = await uploadToCloudinary(fileToUpload);
      console.log('Upload Cloudinary réussi');
      console.log('URL image :', imageUrl);
    }catch(err){
      console.error('Cloudinary upload erreur', err);
      showToast('Erreur lors de l’upload de l’image. Essayez une autre photo.', 'error');
      formMsg.textContent = 'Échec de l’upload Cloudinary. Réessayez.';
      formMsg.style.color = '#c0392b';
      submitBtn.classList.remove('loading');
      submitBtn.removeAttribute('disabled');
      return;
    }

    if(typeof emailjs === 'undefined'){
      console.error('EmailJS SDK introuvable. Assurez-vous que le script CDN est chargé dans index.html.');
      showToast('Erreur technique : EmailJS non chargé.', 'error');
      submitBtn.classList.remove('loading'); submitBtn.removeAttribute('disabled');
      return;
    }

    if(SERVICE_ID.indexOf('COLLE')===0 || PUBLIC_KEY.indexOf('COLLE')===0){
      console.error('SERVICE_ID ou PUBLIC_KEY non remplacés dans script.js. Envoi annulé.');
      showToast('Configuration EmailJS manquante. Remplacez SERVICE_ID et PUBLIC_KEY dans script.js.', 'error');
      submitBtn.classList.remove('loading'); submitBtn.removeAttribute('disabled');
      return;
    }

    const tempForm = buildTempFormWithImageUrl(form, imageUrl);
    try{
      emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, tempForm, PUBLIC_KEY)
        .then(function(response){
          console.log('EmailJS success', response);
          console.log('Email envoyé avec URL image');
          showToast('Demande envoyée — je vous contacte sous peu.', 'success');
          formMsg.textContent = 'Votre demande a bien été prise en compte.'; formMsg.style.color = 'var(--accent)';
          form.reset();
          clearPhotoPreview();
        })
        .catch(function(error){
          console.error('EmailJS erreur', error);
          showToast('Erreur lors de l’envoi. Voir console.', 'error');
          formMsg.textContent = 'Erreur lors de l’envoi. Veuillez réessayer.'; formMsg.style.color = '#c0392b';
        })
        .finally(()=>{ submitBtn.classList.remove('loading'); submitBtn.removeAttribute('disabled'); if(tempForm.parentNode) tempForm.parentNode.removeChild(tempForm); });
    }catch(err){
      console.error('Exception lors de l\'appel EmailJS', err);
      showToast('Erreur inattendue. Voir console.', 'error');
      formMsg.textContent = 'Erreur inattendue. Veuillez réessayer.'; formMsg.style.color = '#c0392b';
      submitBtn.classList.remove('loading');
      submitBtn.removeAttribute('disabled');
      if(tempForm.parentNode) tempForm.parentNode.removeChild(tempForm);
    }
  });

  // Small accessibility: close mobile menu on ESC
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') links.classList.remove('open'); });
});
