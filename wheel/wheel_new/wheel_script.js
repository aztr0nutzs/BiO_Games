
const canvas=document.getElementById("wheel");
const ctx=canvas.getContext("2d");
const segments=window.segments;
let angle=0;
const arc=2*Math.PI/segments.length;
let spinning=false;

let coins=parseInt(localStorage.getItem("coins")||"0");
let lastSpin=parseInt(localStorage.getItem("lastSpin")||"0");

coinsEl=document.getElementById("coins");
cooldown=document.getElementById("cooldown");
rarityEl=document.getElementById("rarity");

coinsEl.innerText="Coins: "+coins;

const COOLDOWN=24*60*60*1000;
function canSpin(){return Date.now()-lastSpin>COOLDOWN;}
function updateCooldown(){
 let rem=COOLDOWN-(Date.now()-lastSpin);
 if(rem<=0){cooldown.innerText="";return;}
 let h=Math.floor(rem/3600000);
 let m=Math.floor((rem%3600000)/60000);
 cooldown.innerText=`Next: ${h}h ${m}m`;
}
setInterval(updateCooldown,1000);

function rollRarity(){
 let r=Math.random();
 if(r<0.6)return "Common";
 if(r<0.85)return "Rare";
 if(r<0.97)return "Epic";
 return "Legendary";
}

const weights=segments.map(()=>Math.random()*2+1);

const audioCtx=new (window.AudioContext||window.webkitAudioContext)();
function beep(freq){
 let o=audioCtx.createOscillator();
 o.frequency.value=freq;
 o.connect(audioCtx.destination);
 o.start();
 setTimeout(()=>o.stop(),120);
}

let particles=[];
function spawnParticles(color){
 for(let i=0;i<50;i++){
  particles.push({x:300,y:300,
   vx:(Math.random()-0.5)*7,
   vy:(Math.random()-0.5)*7,
   life:70,color});
 }
}
function drawParticles(){
 particles.forEach(p=>{
  ctx.fillStyle=p.color;
  ctx.fillRect(p.x,p.y,3,3);
  p.x+=p.vx;p.y+=p.vy;p.life--;
 });
 particles=particles.filter(p=>p.life>0);
}

function drawWheel(){
 ctx.clearRect(0,0,600,600);
 for(let i=0;i<segments.length;i++){
  let start=angle+i*arc;
  let img=new Image();
  img.src="knxt4_chips/"+segments[i];
  ctx.save();
  ctx.translate(300,300);
  ctx.rotate(start+arc/2);
  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.arc(0,0,280,-arc/2,arc/2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(img,100,-80,160,160);
  ctx.restore();
 }
 ctx.beginPath();
 ctx.arc(300,300,40,0,2*Math.PI);
 ctx.fillStyle="#0ff";
 ctx.fill();
 drawParticles();
}
drawWheel();

function weightedSpin(){
 let total=weights.reduce((a,b)=>a+b,0);
 let r=Math.random()*total;
 let acc=0;
 for(let i=0;i<weights.length;i++){
  acc+=weights[i];
  if(r<=acc)return i;
 }
 return 0;
}

function payout(r){
 let base={Common:20,Rare:60,Epic:150,Legendary:500}[r];
 return base+Math.floor(Math.random()*base);
}

function spin(){
 if(spinning)return;
 if(!canSpin()){alert("Daily spin used");return;}
 spinning=true;

 let target=weightedSpin();
 let rarity=rollRarity();
 rarityEl.innerText="Rarity: "+rarity;

 let finalAngle=(segments.length-target)*arc;
 let speed=0.38;
 let decel=0.00045;

 function loop(){
  angle+=speed;
  speed-=decel;
  drawWheel();
  if(speed>0)requestAnimationFrame(loop);
  else{
   angle=finalAngle;
   drawWheel();

   let reward=payout(rarity);
   coins+=reward;
   coinsEl.innerText="Coins: "+coins;

   localStorage.setItem("coins",coins);
   localStorage.setItem("lastSpin",Date.now());
   lastSpin=Date.now();

   beep(700);
   spawnParticles(rarity=="Legendary"?"#ff0":"#f0f");

   if(window.Android&&Android.onWin)
    Android.onWin(segments[target],reward,rarity);

   alert(`WIN: ${segments[target]} | ${rarity} | +${reward}`);
   spinning=false;
  }
 }
 loop();
}

spinBtn.onclick=spin;
canvas.addEventListener("touchstart",e=>{e.preventDefault();spin();});
