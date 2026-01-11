
import firebaseConfig from './firebase-config.js';

// Persistent identity
const PLAYER_ID = localStorage.getItem("bio_player_id") || crypto.randomUUID();
localStorage.setItem("bio_player_id", PLAYER_ID);

const PLAYER_NAME = localStorage.getItem("bio_player_name") || ("Player-" + PLAYER_ID.slice(0,4));
localStorage.setItem("bio_player_name", PLAYER_NAME);

let app=null, db=null, roomRef=null, roomId=null;
let isHost=false;
let heartbeatInterval=null;

async function initFirebase(){
  if(!firebaseConfig) return false;
  await load('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
  await load('https://www.gstatic.com/firebasejs/9.22.0/firebase-database-compat.js');
  app = firebase.initializeApp(firebaseConfig);
  db = firebase.database();
  return true;
}

function load(src){
  return new Promise(res=>{
    const s=document.createElement('script');
    s.src=src; s.onload=res; document.head.appendChild(s);
  });
}

function startHeartbeat(){
  heartbeatInterval = setInterval(()=>{
    if(roomRef){
      roomRef.child(`players/${PLAYER_ID}/lastPing`).set(Date.now());
    }
  }, 5000);
}

function stopHeartbeat(){
  if(heartbeatInterval) clearInterval(heartbeatInterval);
}

async function hostRoom(code, gameId){
  await initFirebase();
  roomId = code;
  isHost = true;
  roomRef = db.ref("rooms/"+roomId);

  await roomRef.set({
    meta:{
      createdAt:Date.now(),
      hostId:PLAYER_ID,
      gameId:gameId || null,
      status:"lobby"
    },
    players:{
      [PLAYER_ID]:{
        name:PLAYER_NAME,
        connected:true,
        joinedAt:Date.now(),
        lastPing:Date.now()
      }
    },
    game:{
      turn:PLAYER_ID,
      state:{},
      version:0
    },
    events:{}
  });

  startHeartbeat();
  attachListeners();
}

async function joinRoom(code){
  await initFirebase();
  roomId = code;
  roomRef = db.ref("rooms/"+roomId);

  await roomRef.child("players/"+PLAYER_ID).set({
    name:PLAYER_NAME,
    connected:true,
    joinedAt:Date.now(),
    lastPing:Date.now()
  });

  const snap = await roomRef.child("meta/hostId").get();
  isHost = snap.val() === PLAYER_ID;

  startHeartbeat();
  attachListeners();
}

function attachListeners(){
  roomRef.child("game").on("value", snap=>{
    if(snap.exists()) Multiplayer._stateCb?.(snap.val());
  });

  roomRef.child("players").on("value", snap=>{
    Multiplayer._playersCb?.(snap.val());
  });

  roomRef.child("events").limitToLast(1).on("child_added", snap=>{
    Multiplayer._eventCb?.(snap.val());
  });
}

function sendEvent(type,payload){
  if(!roomRef) return;
  const ref = roomRef.child("events").push();
  ref.set({
    type,
    from:PLAYER_ID,
    payload,
    ts:Date.now()
  });
}

function updateGameState(newState){
  if(!isHost) return;
  roomRef.child("game").transaction(g=>{
    if(!g) return g;
    g.state = newState;
    g.version = (g.version||0)+1;
    return g;
  });
}

window.Multiplayer = {
  get playerId(){return PLAYER_ID},
  get playerName(){return PLAYER_NAME},
  get roomId(){return roomId},
  get isHost(){return isHost},

  hostRoom,
  joinRoom,
  sendEvent,
  updateGameState,

  onStateUpdate(cb){ this._stateCb=cb },
  onPlayersUpdate(cb){ this._playersCb=cb },
  onEvent(cb){ this._eventCb=cb }
};
