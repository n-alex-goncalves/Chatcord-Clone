const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')

// Deck element
const biscaDeckElement = document.querySelector('.computer-deck')

// Points element
const computerPointsElement = document.querySelector('.computer-points')
const playerPointsElement   = document.querySelector('.player-points')

// Middle table element
const trumpCardSlot      = document.querySelector('.slot4')
const playedCard1Element = document.querySelector('.slot5')
const playedCard2Element = document.querySelector('.slot6')

// Computer card element
const computerCardSlot1 = document.querySelector('.slot1')
const computerCardSlot2 = document.querySelector('.slot2')
const computerCardSlot3 = document.querySelector('.slot3')

// Player card element
const playerCardSlot1 = document.querySelector('.slot7')
const playerCardSlot2 = document.querySelector('.slot8')
const playerCardSlot3 = document.querySelector('.slot9')


playerCardSlot1.addEventListener("click", function() { if (playerTurn) { playerCardSlot1.innerHTML = ''; addToTablePlayer(1) }})
playerCardSlot2.addEventListener("click", function() { if (playerTurn) { playerCardSlot2.innerHTML = ''; addToTablePlayer(2) }})
playerCardSlot3.addEventListener("click", function() { if (playerTurn) { playerCardSlot3.innerHTML = ''; addToTablePlayer(3) }})

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const socket = io()

/*

Update game state


Players
CurPlayer
Dictionary<>

function createGameState() {
    const biscaDeck = new Deck()
    biscaDeck.shuffle()
    
    const player1Hand = new Hand('PLAYER1')
    const player2Hand = new Hand('PLAYER2')
    
    player1Hand.addCard(biscaDeck.deal())
    player1Hand.addCard(biscaDeck.deal())
    player1Hand.addCard(biscaDeck.deal())
    
    player2Hand.addCard(biscaDeck.deal())
    player2Hand.addCard(biscaDeck.deal())
    player2Hand.addCard(biscaDeck.deal())
    
    const trumpCard = biscaDeck.deal()

    const gameState = {
        player1Hand: player1Hand,
        player2Hand: player2Hand,
        player1Score: 0,
        player2Score: 0,
        playedCard1: null,
        playedCard2: null,
        trumpCard: trumpCard,
        deck: biscaDeck,
        turn: 0
    }

    return gameState
}














*/

// Join room
socket.emit('joinRoom', { username, room })

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
})

// Message from server
socket.on('message', message => {
    console.log(message)
    outputMessage(message)

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

// Message submit
chatForm.addEventListener('submit', e => {
    e.preventDefault()
    const msg = e.target.elements.msg.value;

    // Emit message to the server
    socket.emit('chatMessage', msg)

    // Clear form
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
})

// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message')
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
    ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div)
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `${users.map(user => `<li>${user.username}</liv>`).join('')}`
}

function updateDeckCount() {
    biscaDeckElement.innerHTML = biscaDeck.numberOfCards
}