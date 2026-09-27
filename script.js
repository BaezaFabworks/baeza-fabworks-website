const menu=document.querySelector('.menu'),links=document.querySelector('.navlinks');
if(menu)menu.onclick=()=>{const open=links.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');};
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('show')}),{threshold:.12});document.querySelectorAll('.reveal').forEach(x=>io.observe(x));

// Baeza Fabworks shop audio. Starts only after a visitor interaction.
const AUDIO={music:'assets/audio/walls-that-fall.mp3',ratchet:'assets/audio/ratchet.mp3',click:'assets/audio/gear-click.mp3',weld:'assets/audio/weld-strike.mp3'};
const music=new Audio(AUDIO.music);music.loop=true;music.volume=.18;music.preload='auto';
const fx={ratchet:new Audio(AUDIO.ratchet),click:new Audio(AUDIO.click),weld:new Audio(AUDIO.weld)};
fx.ratchet.volume=.22;fx.click.volume=.35;fx.weld.volume=.43;
Object.values(fx).forEach(a=>a.preload='auto');
const audioBtn=document.querySelector('.audio');
let soundOn=sessionStorage.getItem('bfSound')==='on';
const savedTime=parseFloat(sessionStorage.getItem('bfMusicTime')||'0');if(Number.isFinite(savedTime))music.currentTime=savedTime;
function setAudioLabel(){if(audioBtn)audioBtn.textContent=soundOn?'🔊 SOUND ON':'🔇 SOUND OFF'}setAudioLabel();
function playFx(name){if(!soundOn||!fx[name])return;fx[name].currentTime=0;fx[name].play().catch(()=>{});}
function fadeMusicIn(){if(!soundOn)return;music.volume=0;music.play().then(()=>{let v=0;const t=setInterval(()=>{v=Math.min(.18,v+.015);music.volume=v;if(v>=.18)clearInterval(t)},70)}).catch(()=>{});}
function enableSound(){soundOn=true;sessionStorage.setItem('bfSound','on');setAudioLabel();fadeMusicIn();}
function disableSound(){soundOn=false;sessionStorage.setItem('bfSound','off');music.pause();Object.values(fx).forEach(a=>{a.pause();a.currentTime=0});setAudioLabel();}
if(audioBtn)audioBtn.onclick=()=>soundOn?disableSound():enableSound();
window.addEventListener('pagehide',()=>{try{sessionStorage.setItem('bfMusicTime',String(music.currentTime))}catch(e){}});

const intro=document.querySelector('.intro'),enter=document.querySelector('#enterShop');
if(enter)enter.onclick=()=>{soundOn=true;sessionStorage.setItem('bfSound','on');setAudioLabel();playFx('ratchet');setTimeout(()=>{intro.classList.add('hidden');sessionStorage.setItem('entered','1');fadeMusicIn()},450)};
if(intro&&sessionStorage.getItem('entered'))intro.classList.add('hidden');

// Resume soundtrack on subsequent pages when the browser permits it.
if(soundOn&&(!intro||sessionStorage.getItem('entered')))music.play().catch(()=>{});

// Quiet mechanical feedback for normal site navigation; welding strike for quote CTAs.
// Internal navigation is delayed very briefly so the browser has time to actually play the effect
// before unloading the current page. Modified-clicks/new tabs are left alone.
document.querySelectorAll('a[href]').forEach(el=>{
  if(el===audioBtn||el===enter)return;
  el.addEventListener('click',e=>{
    if(!soundOn||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    const href=el.getAttribute('href')||'';
    if(!href||href.startsWith('#')||href.startsWith('mailto:')||href.startsWith('tel:')||el.target==='_blank'){playFx(href.toLowerCase().includes('quote')?'weld':'click');return;}
    e.preventDefault();
    const isQuote=href.toLowerCase().includes('quote.html');
    playFx(isQuote?'weld':'click');
    setTimeout(()=>{window.location.href=href},isQuote?1100:560);
  });
});
document.querySelectorAll('button').forEach(el=>{if(el===audioBtn||el===enter||el.type==='submit')return;el.addEventListener('click',()=>playFx('click'))});

const form=document.querySelector('#quoteForm');
if(form){
  const status=document.querySelector('#formStatus');
  const submitBtn=document.querySelector('#quoteSubmit');
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    if(!form.reportValidity())return;

    playFx('weld');
    submitBtn.disabled=true;
    submitBtn.textContent='Sending…';
    status.className='form-status';
    status.textContent='Sending your project request…';

    try{
      const response=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});
      const data=await response.json().catch(()=>({}));
      if(response.ok){
        form.reset();
        status.className='form-status success';
        status.textContent='Thanks — your project request was sent to Baeza Fabworks. We’ll review the details and get back to you.';
      }else{
        const msg=data?.errors?.map(x=>x.message).filter(Boolean).join(' ')||'';
        status.className='form-status error';
        status.textContent=response.status===429?'Too many requests were sent at once. Please wait a moment and try again.':(msg||'We couldn’t send your request. Please try again, or email mbaeza28@yahoo.com.');
      }
    }catch(err){
      status.className='form-status error';
      status.textContent='We couldn’t connect to the quote service. Please try again, or email mbaeza28@yahoo.com.';
    }finally{
      submitBtn.disabled=false;
      submitBtn.textContent='Send Project Request →';
    }
  });
}
