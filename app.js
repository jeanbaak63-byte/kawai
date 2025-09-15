const profiles=[
 {name:"Aiko",age:19,image:"https://cdn.pixabay.com/photo/2024/09/21/10/53/anime-9063542_640.png",desc:"Rêveuse tombée des étoiles."},
 {name:"Hana",age:20,image:"https://cdn.pixabay.com/photo/2023/12/07/11/04/girl-8435329_640.png",desc:"Cosplayeuse lunaire."}
];
let deckIndex=0;const stack=[];const deckEl=document.getElementById('deck');
function createCard(p){const el=document.createElement('div');el.className='card';el.innerHTML=`<div class="photo"><img src="${p.image}"></div><div class="meta"><b>${p.name}, ${p.age}</b><div>${p.desc}</div></div>`;initDrag(el,{onMove:(dx)=>{el.style.transform=`translate(${dx}px,0) rotate(${dx/18}deg)`;},onEnd:(dx)=>{if(dx>90)doSwipe(el,'right');else if(dx<-90)doSwipe(el,'left');else resetCard(el);}});return el;}
function initDrag(el,{onMove,onEnd}){let startX=0,drag=false;el.onmousedown=e=>{drag=true;startX=e.clientX;el.style.transition='none'};window.onmousemove=e=>{if(!drag)return;const dx=e.clientX-startX;onMove(dx)};window.onmouseup=e=>{if(!drag)return;drag=false;const dx=e.clientX-startX;onEnd(dx)}};
function resetCard(el){el.style.transition='transform .25s';el.style.transform='translate(0,0) rotate(0)'}
function doSwipe(el,dir){el.style.transition='transform .3s';const off=window.innerWidth*1.5;let tx=0;if(dir==='right')tx=off;if(dir==='left')tx=-off;el.style.transform=`translate(${tx}px,0) rotate(${dir==='right'?20:-20}deg)`;setTimeout(()=>{el.remove();stack.pop();nextCard()},300)}
function nextCard(){if(deckIndex>=profiles.length)return;const p=profiles[deckIndex++];const c=createCard(p);stack.push(c);deckEl.appendChild(c)}
nextCard();nextCard();
document.getElementById('btnLike').onclick=()=>{const top=stack[stack.length-1];if(top)doSwipe(top,'right')};
document.getElementById('btnNope').onclick=()=>{const top=stack[stack.length-1];if(top)doSwipe(top,'left')};
