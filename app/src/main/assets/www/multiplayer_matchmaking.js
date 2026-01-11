
// Matchmaking & Public Rooms
export function createPublicRoom(db, roomId, meta) {
  return db.ref("public_rooms/"+roomId).set(meta);
}
export function listPublicRooms(db, cb) {
  db.ref("public_rooms").on("value", s=>cb(s.val()||{}));
}
