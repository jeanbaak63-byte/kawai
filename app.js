const profiles = [
  { name:"Aiko", age:19, image:"https://cdn.pixabay.com/photo/2024/09/21/10/53/anime-9063542_640.png", desc:"Rêveuse tombée des étoiles. Cherche duo chill pour dramas rom-com.", tags:["catgirl","genki","vtuber"] },
  { name:"Miyu", age:22, image:"https://cdn.pixabay.com/photo/2024/07/08/05/41/girl-8880144_640.png", desc:"Gamer nocturne. Café + ranked = ❤️", tags:["tsundere","gamer","idol"] },
  { name:"Hana", age:20, image:"https://cdn.pixabay.com/photo/2023/12/07/11/04/girl-8435329_640.png", desc:"Cosplayeuse lunaire, vibes pastel & isekai.", tags:["cosplay","pink","isekai"] },
];

let deckIndex = 0;
const stack=[];
const deckEl=document.getElementById('deck');

function createCard(p){
  const chips = p.tags?.length ? `<div class="chips">${p.tags.map(t=>`<span class="chip">#${t}</span>`).join('')}</div>` : "";
  const el=document.createElement('div'); el.className='card'; el.dataset.name=p.name;
  el.innerHTML=`
    <div class="photo"><img src="${p.image}" alt="${p.name}"></div>
    <div class="shade"></div>
    <div class="badge like">LIKE</div>
    <div class="badge nope">NOPE</div>
    <div class="meta">
      <div class="name">${p.name}, ${p.age}</div>
      <div class="tag">${p.desc}</div>
      ${chips}
    </div>
  `;

  const likeBadge = el.querySelector('.badge.like');
  const nopeBadge = el.querySelector('.badge.nope');
  likeBadge.style.opacity = 0; nopeBadge.style.opacity = 0;

  initDrag(el,{
    onMove:(dx)=>{
      const rot = dx/18;
      el.style.transform = `translate3d(${dx}px,0,0) rotate(${rot}deg)`;
      const started = Math.abs(dx) > 8;
      const pwr = Math.min(1, Math.abs(dx)/120);
      if(!started){
        likeBadge.style.opacity = 0; likeBadge.style.transform = 'scale(.9)';
        nopeBadge.style.opacity = 0; nopeBadge.style.transform = 'scale(.9)';
        return;
      }
      if(dx > 0){
        likeBadge.style.opacity = pwr; likeBadge.style.transform = 'scale(1)';
        nopeBadge.style.opacity = 0;   nopeBadge.style.transform = 'scale(.9)';
      } else {
        nopeBadge.style.opacity = pwr; nopeBadge.style.transform = 'scale(1)';
        likeBadge.style.opacity = 0;   likeBadge.style.transform = 'scale(.9)';
      }
    },
    onEnd:(dx)=>{
      likeBadge.style.opacity = 0; likeBadge.style.transform = 'scale(.9)';
      nopeBadge.style.opacity  = 0; nopeBadge.style.transform  = 'scale(.9)';
      if(dx > 90) doSwipe(el,'right'); else if(dx < -90) doSwipe(el,'left'); else resetCard(el);
    }
  });

  return el;
}

function initDrag(el,{onMove,onEnd}){
  let startX=0,drag=false;
  const down=(e)=>{ if(el!==deckEl.lastElementChild) return;
    drag=true; startX=(e.touches?e.touches[0]:e).clientX; el.style.transition='none'; el.classList.add('dragging');
    document.querySelector('.hint')?.remove();
  };
  const move=(e)=>{ if(!drag) return; const x=(e.touches?e.touches[0]:e).clientX; const dx=x-startX; onMove(dx); };
  const up=(e)=>{ if(!drag) return; const x=(e.changedTouches?e.changedTouches[0]:e).clientX; const dx=x-startX; drag=false; el.classList.remove('dragging'); onEnd(dx); };
  el.addEventListener('mousedown',down);   window.addEventListener('mousemove',move); window.addEventListener('mouseup',up);
  el.addEventListener('touchstart',down,{passive:true}); window.addEventListener('touchmove',move,{passive:true}); window.addEventListener('touchend',up);
}

function resetCard(el){
  el.style.transition='transform .25s ease';
  el.style.transform='translate(0,0) rotate(0)';
}

function doSwipe(el,dir){
  el.style.transition='transform .3s ease-out';
  const off = Math.max(window.innerWidth*1.5, 600);
  let tx=0, rot=0;
  if(dir==='right'){ tx=off;  rot=20; }
  if(dir==='left'){  tx=-off; rot=-20; }
  el.style.transform=`translate3d(${tx}px,0,0) rotate(${rot}deg)`;
  setTimeout(()=>{ el.remove(); stack.pop(); nextCard(); }, 300);
}

function nextCard(){
  if(deckIndex>=profiles.length) return;
  const p=profiles[deckIndex++], c=createCard(p);
  stack.push(c); deckEl.appendChild(c);
}
nextCard(); nextCard(); nextCard();

document.getElementById('btnLike').onclick=()=>{ const top=stack[stack.length-1]; if(top) doSwipe(top,'right'); };
document.getElementById('btnNope').onclick=()=>{ const top=stack[stack.length-1]; if(top) doSwipe(top,'left'); };
