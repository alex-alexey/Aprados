const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const menu=document.querySelector('.menu-toggle');
const nav=document.querySelector('#navigation');
function closeMenu(){menu?.setAttribute('aria-expanded','false');nav?.classList.remove('open');}
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav?.classList.toggle('open',open);});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});

// The original opening and its controls are preserved.
const hero=document.querySelector('.hero');
const heroImage=document.querySelector('.hero-visual img');
const heroViews={exterior:{src:'images/home.jpg',alt:'Una vivienda abierta a la luz y al jardín'},interior:{src:'images/interior.jpg',alt:'Un interior luminoso para imaginar tu próxima etapa'}};
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{
 const view=heroViews[button.dataset.view];if(!view||button.getAttribute('aria-pressed')==='true')return;
 const visual=document.querySelector('.hero-visual');visual.classList.remove('switching');void visual.offsetWidth;heroImage.src=view.src;heroImage.alt=view.alt;visual.classList.add('switching');
 document.querySelectorAll('[data-view]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});
}));
let framePending=false;
function renderScroll(){framePending=false;if(reducedMotion.matches)return;const h=hero?.getBoundingClientRect();if(h&&h.bottom>0&&h.top<innerHeight&&heroImage)heroImage.style.transform=`scale(1.08) translateY(${Math.min(-h.top*.14,90)}px)`;}
function scheduleScroll(){if(!framePending){framePending=true;requestAnimationFrame(renderScroll);}}
window.addEventListener('scroll',scheduleScroll,{passive:true});window.addEventListener('resize',scheduleScroll,{passive:true});reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches&&heroImage)heroImage.style.transform='';else scheduleScroll();});scheduleScroll();

if('IntersectionObserver' in window&&!reducedMotion.matches){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('journey-in');io.unobserve(e.target);}}),{threshold:.12});document.querySelectorAll('.purchase-heading,.territory-title,.territory-panel,.answers-title,.answers-list details,.buyer-contact-heading,.buyer-brief,.contact-visual,.closing-top').forEach(el=>io.observe(el));}

function selectTerritory(panel){document.querySelectorAll('.territory-panel').forEach(p=>{const selected=p===panel;p.classList.toggle('selected',selected);p.querySelector('button').setAttribute('aria-expanded',String(selected));p.querySelector('.territory-info').hidden=!selected;});}
document.querySelectorAll('.territory-trigger').forEach(button=>button.addEventListener('click',()=>selectTerritory(button.closest('.territory-panel'))));

// A single, visible brief with a live summary; no data leaves before submission.
const form=document.querySelector('#buyer-form');
const briefLocations={
 'Estoy explorando':{caption:'Begues · Baix Llobregat',image:'begues-panorama.jpg',alt:'Panorámica de Begues entre las montañas'},
 'Begues':{caption:'Begues · Baix Llobregat',image:'begues-panorama.jpg',alt:'Panorámica de Begues entre las montañas'},
 'Baix Llobregat':{caption:'Castelldefels · Baix Llobregat',image:'baix.jpg',alt:'Castillo de Castelldefels en el Baix Llobregat'},
 'Garraf':{caption:'Sitges · Garraf',image:'garraf.jpg',alt:'Vista de Sitges en el Garraf'}
};
function updateBrief(){const d=new FormData(form);const location=briefLocations[d.get('zona')];const img=document.querySelector('#brief-photo');document.querySelector('#contact-location').textContent=location.caption;const next='images/'+location.image;if(img.getAttribute('src')!==next){const visual=document.querySelector('.contact-visual');visual.classList.remove('visual-changed');void visual.offsetWidth;img.src=next;img.alt=location.alt;visual.classList.add('visual-changed');}}
form.addEventListener('change',updateBrief);
document.querySelectorAll('[data-zone-choice]').forEach(link=>link.addEventListener('click',()=>{const radio=[...form.querySelectorAll('[name="zona"]')].find(input=>input.value===link.dataset.zoneChoice);if(radio)radio.checked=true;updateBrief();}));
form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const d=new FormData(form);const text=`Hola Aprados, soy ${d.get('nombre')}. Me gustaría recibir información para comprar una vivienda.\nZona: ${d.get('zona')}\nPresupuesto: ${d.get('presupuesto')}\nPlazo: ${d.get('plazo')}\n${d.get('mensaje')||''}`;window.location.href='https://wa.me/34662004454?text='+encodeURIComponent(text);});
updateBrief();

// One photographic service scene; native scrolling drives chapters on desktop.
const purchase=document.querySelector('.purchase-experience');
const purchaseRunway=document.querySelector('.purchase-runway');
const purchaseStage=document.querySelector('.purchase-stage');
const purchasePanels=[...document.querySelectorAll('.purchase-panel')];
const purchaseButtons=[...document.querySelectorAll('[data-purchase]')];
const purchaseMedia=document.querySelector('.purchase-media');
const purchasePhoto=document.querySelector('.purchase-photo');
const purchaseCopy=document.querySelector('.purchase-copy');
const purchaseDesktop=window.matchMedia('(min-width: 900px)');
const purchaseScenes=[{image:'interior.jpg',alt:'Espacio luminoso que representa la búsqueda de una vivienda'},{image:'detail.jpg',alt:'Detalles y materiales de un interior de vivienda'},{image:'home.jpg',alt:'Una vivienda con jardín y acceso exterior'}];
let purchaseIndex=-1,purchaseFrame=false;
purchase?.classList.add('purchase-enhanced');
function setPurchaseChapter(index){if(index===purchaseIndex)return;purchaseIndex=index;purchasePanels.forEach((p,i)=>p.hidden=i!==index);purchaseButtons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));const scene=purchaseScenes[index];purchaseCopy.classList.remove('content-change');purchaseMedia.classList.remove('media-change');void purchaseStage.offsetWidth;purchasePhoto.src='images/'+scene.image;purchasePhoto.alt=scene.alt;purchaseCopy.classList.add('content-change');purchaseMedia.classList.add('media-change');document.querySelector('.purchase-counter').textContent=(index+1)+' de 3';}
function updatePurchaseScene(){purchaseFrame=false;if(!purchase.classList.contains('purchase-pinned'))return;const rect=purchaseRunway.getBoundingClientRect();const travel=purchaseRunway.offsetHeight-purchaseStage.offsetHeight;if(rect.top>0||rect.bottom<0)return;const progress=Math.max(0,Math.min(.999,-rect.top/Math.max(1,travel)));setPurchaseChapter(Math.min(2,Math.floor(progress*3)));}
function queuePurchaseScene(){if(!purchaseFrame){purchaseFrame=true;requestAnimationFrame(updatePurchaseScene);}}
function configurePurchase(){purchase.classList.toggle('purchase-pinned',purchaseDesktop.matches&&!reducedMotion.matches);queuePurchaseScene();}
purchaseButtons.forEach((button,index)=>button.addEventListener('click',()=>{setPurchaseChapter(index);if(purchase.classList.contains('purchase-pinned')){const start=scrollY+purchaseRunway.getBoundingClientRect().top;const travel=purchaseRunway.offsetHeight-purchaseStage.offsetHeight;window.scrollTo({top:start+travel*((index+.15)/3),behavior:'instant'});}}));
window.addEventListener('scroll',queuePurchaseScene,{passive:true});window.addEventListener('resize',queuePurchaseScene,{passive:true});purchaseDesktop.addEventListener('change',configurePurchase);reducedMotion.addEventListener('change',configurePurchase);
setPurchaseChapter(0);configurePurchase();
