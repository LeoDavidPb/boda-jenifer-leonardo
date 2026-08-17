const body=document.body,opening=document.getElementById("opening"),envelope=document.getElementById("envelope"),openButton=document.getElementById("openButton"),natureStage=document.getElementById("natureStage"),story=document.getElementById("story"),toast=document.getElementById("toast");let opened=false;

function showToast(m){toast.textContent=m;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),2300)}

openButton.addEventListener("click",()=>{if(opened)return;opened=true;envelope.classList.add("open");opening.classList.add("opening-active");opening.classList.add("opening-transition");setTimeout(()=>natureStage.classList.add("active"),650);setTimeout(()=>envelope.classList.add("fade"),1850);setTimeout(()=>{body.classList.remove("locked");story.classList.add("visible");story.scrollIntoView({behavior:"smooth",block:"start"})},3900)});

document.querySelectorAll(".next").forEach(b=>b.addEventListener("click",()=>{const t=document.getElementById(b.dataset.next);t.classList.add("visible");t.scrollIntoView({behavior:"smooth",block:"start"})}));
const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&opened)e.target.classList.add("visible")}),{threshold:.27});document.querySelectorAll(".scene:not(#opening)").forEach(s=>observer.observe(s));

document.getElementById("locationButton").addEventListener("click",()=>window.open("https://www.google.com/maps/search/?api=1&query=Parroquia%20de%20San%20Felipe%20Ap%C3%B3stol%2C%20Cra.%2032%20%2371%20Sur-182%2C%20La%20Bahia%2C%20Sabaneta%2C%20La%20Doctora%2C%20Sabaneta%2C%20Antioquia%2C%20Colombia","_blank","noopener,noreferrer"));

const rsvpForm=document.getElementById("rsvpForm");
const rsvpSuccess=document.getElementById("rsvpSuccess");
let submitted=false;
rsvpForm.addEventListener("submit",()=>{
  if(!rsvpForm.checkValidity()) return;
  submitted=true;
  const button=document.getElementById("rsvpButton");
  button.disabled=true;
  button.textContent="ENVIANDO…";
});
document.getElementById("hidden_iframe").addEventListener("load",()=>{
  if(!submitted) return;
  rsvpForm.hidden=true;
  rsvpSuccess.hidden=false;
  showToast("Confirmación enviada correctamente");
});

document.getElementById("restartButton").addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));

function countdown(){const target=new Date("2026-12-12T19:00:00-05:00");let x=target-new Date();if(x<=0){document.querySelector(".countdown").innerHTML='<div style="grid-column:1/-1"><b>HOY</b><span>COMIENZA NUESTRA HISTORIA</span></div>';return}const d=Math.floor(x/86400000);x%=86400000;const h=Math.floor(x/3600000);x%=3600000;const m=Math.floor(x/60000),s=Math.floor((x%60000)/1000);document.getElementById("days").textContent=String(d).padStart(3,"0");document.getElementById("hours").textContent=String(h).padStart(2,"0");document.getElementById("minutes").textContent=String(m).padStart(2,"0");document.getElementById("seconds").textContent=String(s).padStart(2,"0")}countdown();setInterval(countdown,1000);
// V8: progress bar
const progress=document.getElementById("progress");
function updateProgress(){
  const doc=document.documentElement;
  const max=doc.scrollHeight-doc.clientHeight;
  const pct=max>0?(doc.scrollTop/max)*100:0;
  progress.style.width=pct+"%";
}
window.addEventListener("scroll",updateProgress,{passive:true});
updateProgress();

// V8: practical info accordion
document.querySelectorAll(".accordion-item").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const panel=btn.nextElementSibling;
    const isOpen=btn.classList.toggle("open");
    panel.style.maxHeight=isOpen?panel.scrollHeight+"px":"0px";
  });
});

// V8: calendar file generated in-browser
document.getElementById("calendarButton").addEventListener("click",()=>{
  const ics=`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Jenifer y Leonardo//Boda//ES
CALSCALE:GREGORIAN
BEGIN:VEVENT
UID:boda-jenifer-leonardo-20261212@example.local
DTSTAMP:20260809T000000Z
DTSTART:20261213T000000Z
SUMMARY:Boda de Jenifer & Leonardo
LOCATION:Parroquia de San Felipe Apóstol\, Cra. 32 #71 Sur-182\, La Doctora\, Sabaneta\, Antioquia
DESCRIPTION:Ceremonia de la boda de Jenifer & Leonardo a las 7:00 p. m. en la Parroquia de San Felipe Apóstol. La ubicación de la recepción se compartirá cuando esté confirmada.
END:VEVENT
END:VCALENDAR`;
  const blob=new Blob([ics],{type:"text/calendar;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;
  a.download="boda-jenifer-leonardo.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
});

// V9: floating quick navigation
const miniNav=document.getElementById("miniNav");
document.querySelectorAll(".mini-nav button").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const target=document.getElementById(btn.dataset.jump);
    if(target) target.scrollIntoView({behavior:"smooth",block:"start"});
  });
});
const openingObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    miniNav.classList.toggle("show", opened && !entry.isIntersecting);
  });
},{threshold:.35});
openingObserver.observe(document.getElementById("opening"));

// V9: native share when available, otherwise copy current URL.
document.getElementById("shareButton").addEventListener("click",async()=>{
  const shareData={
    title:"Jenifer & Leonardo — Nuestra boda",
    text:"12 de diciembre de 2026 · Medellín, Colombia",
    url:window.location.href
  };
  try{
    if(navigator.share){
      await navigator.share(shareData);
    }else if(navigator.clipboard && location.protocol.startsWith("http")){
      await navigator.clipboard.writeText(window.location.href);
      showToast("Enlace copiado");
    }else{
      showToast("La opción de compartir estará disponible al publicar la invitación");
    }
  }catch(e){}
});

/* =========================================================
   MÚSICA DE LA INVITACIÓN
   Empieza con el gesto del usuario al tocar el sello.
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const music = document.getElementById("weddingMusic");
  const toggle = document.getElementById("musicToggle");
  if (!music || !toggle) return;

  music.volume = 0.72;

  const setPlayingUI = (playing) => {
    toggle.classList.toggle("paused", !playing);
    toggle.setAttribute("aria-pressed", String(playing));
    toggle.setAttribute("aria-label", playing ? "Pausar música" : "Reproducir música");
    toggle.title = playing ? "Pausar música" : "Reproducir música";
  };

  const showControl = () => toggle.classList.add("visible");

  const startWeddingMusic = async () => {
    try {
      await music.play();
      setPlayingUI(true);
      showControl();
    } catch (error) {
      // Si el navegador no permite iniciar en ese instante,
      // dejamos visible el control para que el invitado pueda activarla.
      setPlayingUI(false);
      showControl();
    }
  };

  const seal = document.querySelector(".navy-opening .seal") || document.querySelector(".seal");
  if (seal) {
    const startOnGesture = () => startWeddingMusic();
    seal.addEventListener("pointerdown", startOnGesture, { once: true });
    seal.addEventListener("touchstart", startOnGesture, { once: true, passive: true });
  }

  toggle.addEventListener("click", async (event) => {
    event.stopPropagation();
    if (music.paused) {
      try {
        await music.play();
        setPlayingUI(true);
      } catch (error) {
        setPlayingUI(false);
      }
    } else {
      music.pause();
      setPlayingUI(false);
    }
  });

  music.addEventListener("play", () => setPlayingUI(true));
  music.addEventListener("pause", () => setPlayingUI(false));
});;


/* =========================================================
   PAUSA AUTOMÁTICA DE MÚSICA CUANDO LA PÁGINA NO ES VISIBLE
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const music = document.getElementById("weddingMusic");
  const toggle = document.getElementById("musicToggle");
  if (!music) return;

  let wasPlayingBeforeHide = false;

  const syncMusicButton = (playing) => {
    if (!toggle) return;
    toggle.classList.toggle("paused", !playing);
    toggle.setAttribute("aria-pressed", String(playing));
    toggle.setAttribute("aria-label", playing ? "Pausar música" : "Reproducir música");
    toggle.title = playing ? "Pausar música" : "Reproducir música";
  };

  const pauseForBackground = () => {
    if (!music.paused && !music.ended) {
      wasPlayingBeforeHide = true;
      music.pause();
      syncMusicButton(false);
    } else {
      wasPlayingBeforeHide = false;
    }
  };

  const resumeAfterReturn = async () => {
    if (!wasPlayingBeforeHide) return;
    try {
      await music.play();
      syncMusicButton(true);
    } catch (error) {
      // Si Safari bloquea la reanudación automática, el control queda disponible.
      syncMusicButton(false);
    } finally {
      wasPlayingBeforeHide = false;
    }
  };

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      pauseForBackground();
    } else {
      resumeAfterReturn();
    }
  });

  window.addEventListener("pagehide", pauseForBackground);
});
