// Client-side WebSocket and API interaction

const SERVER_URL = 'http://localhost:3000';
const WS_URL = 'ws://localhost:3000';

class GameClient {
  constructor() {
    this.socket = null;
    this.playerId = null;
    this.sessionToken = null;
    this.roomId = null;
    this.gameState = null;
  }

  // Connect to WebSocket server
  async connect() {
    return new Promise((resolve, reject) => {
      this.socket = io(WS_URL);
      
      this.socket.on('connect', () => {
        console.log('Connected to WebSocket server');
        resolve();
      });
      
      this.socket.on('connect_error', (err) => {
        console.error('WebSocket connection error:', err);
        reject(err);
      });
      
      this.socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
      });
      
      this.socket.on('move', (data) => {
        console.log('Received move:', data);
        this.handleMove(data);
      });
      
      this.socket.on('forfeit', (data) => {
        console.log('Received forfeit:', data);
        this.handleForfeit(data);
      });
    });
  }

  // Authenticate with the server
  async authenticate(username, password) {
    try {
      const response = await fetch(`${SERVER_URL}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        this.sessionToken = data.token;
        console.log('Authenticated successfully');
        return true;
      } else {
        console.error('Authentication failed:', data.error);
        return false;
      }
    } catch (err) {
      console.error('Authentication error:', err);
      return false;
    }
  }

  // Join matchmaking queue
  async joinMatchmaking(gameType, region) {
    try {
      const response = await fetch(`${SERVER_URL}/matchmake`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.sessionToken}`
        },
        body: JSON.stringify({ gameType, region })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('Joined matchmaking queue');
        return true;
      } else {
        console.error('Matchmaking failed:', data.error);
        return false;
      }
    } catch (err) {
      console.error('Matchmaking error:', err);
      return false;
    }
  }

  // Join a game room
  async joinRoom(roomId) {
    try {
      const response = await fetch(`${SERVER_URL}/join_room`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.sessionToken}`
        },
        body: JSON.stringify({ roomId })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        this.roomId = roomId;
        this.socket.emit('join_room', roomId);
        console.log('Joined room:', roomId);
        return true;
      } else {
        console.error('Join room failed:', data.error);
        return false;
      }
    } catch (err) {
      console.error('Join room error:', err);
      return false;
    }
  }

  // Make a move in the game
  async makeMove(move) {
    try {
      const response = await fetch(`${SERVER_URL}/move`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.sessionToken}`
        },
        body: JSON.stringify({ roomId: this.roomId, move })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        this.socket.emit('move', { roomId: this.roomId, move });
        console.log('Move made:', move);
        return true;
      } else {
        console.error('Move failed:', data.error);
        return false;
      }
    } catch (err) {
      console.error('Move error:', err);
      return false;
    }
  }

  // Forfeit the game
  async forfeit() {
    try {
      const response = await fetch(`${SERVER_URL}/forfeit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.sessionToken}`
        },
        body: JSON.stringify({ roomId: this.roomId })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        this.socket.emit('forfeit', this.roomId);
        console.log('Game forfeited');
        return true;
      } else {
        console.error('Forfeit failed:', data.error);
        return false;
      }
    } catch (err) {
      console.error('Forfeit error:', err);
      return false;
    }
  }

  // Reconnect to a game room
  async reconnect(roomId) {
    try {
      const response = await fetch(`${SERVER_URL}/reconnect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.sessionToken}`
        },
        body: JSON.stringify({ roomId })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        this.roomId = roomId;
        this.gameState = data.gameState;
        this.socket.emit('join_room', roomId);
        console.log('Reconnected to room:', roomId);
        return true;
      } else {
        console.error('Reconnect failed:', data.error);
        return false;
      }
    } catch (err) {
      console.error('Reconnect error:', err);
      return false;
    }
  }

  // Handle incoming move
  handleMove(data) {
    console.log('Handling move:', data);
    // Update game state based on the move
    // ... (add game state update logic here)
  }

  // Handle incoming forfeit
  handleForfeit(data) {
    console.log('Handling forfeit:', data);
    // Handle forfeit
    // ... (add forfeit handling logic here)
  }

  // Disconnect from WebSocket server
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

// Export the GameClient class
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameClient;
}

// Make GameClient available in the browser
if (typeof window !== 'undefined') {
  window.GameClient = GameClient;
}