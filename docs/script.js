let players = [];
let currentPlayerIndex = 0;
const size = 8;
const totalCells = size * size;

const colors = ['#ff4757', '#2ed573', '#1e90ff',
    '#ffa502', '#e84393', '#32ff7e', '#7d5fff',
    '#18dcff', '#ffb8b8', '#fffa65', '#cd84f1',
    '#67e6dc', '#ff9f1a', '#3ae374', '#17c0eb',
    '#fff200', '#ffaf40', '#ff4d4d', '#7158e2',
    '#badc58', '#f0932b', '#eb4d4b', '#686de0'];

const randomChallenges = [
    "Bebe 1 trago", "Bebe 2 tragos", "Bebe 3 tragos", "Bebe 4 tragos",
    "¡Todos beben!", "Hombres beben",
    "Mujeres beben", "Yo nunca nunca...", "Yo nunca nunca...", "Yo nunca nunca...", "Yo nunca nunca...",
    "Mímica de una película o bebe", "Haz que beban 3 personas",
    "El de tu derecha bebe", "El de tu izquierda bebe",
    "El más alto bebe", "El más bajo bebe",
    "Beben con pareja", "Beben los solteros",
    "Grita algo que elijan el resto de jugadores",
    "Elige a alguien para beber contigo",
    "Beben los de negro",
    "Instagram abierto bebe",
    "Chiste(si es malo bebes)",
    "El menor bebe",
    "El mayor bebe",
    "El que tenga más seguidores en instagram bebe",
    "se deja el movil en el centro, proxima notificacion bebe",
    "Menos bateria bebe",
    "Mas bateria bebe",
    "Pon una regla (Ej: quien diga 'beber' bebe)",
    "El ultimo que ha puesto cancion bebe",
    "Si nombras a alguien por su nombre bebe (2 rondas)",
    "bebe 2 tragos sin las manos",
    "Espejo: elige a una persona, las 4 proximas rondas, si bebe, tu bebes",
    "Todos los que tengan gafas beben",
    "El que tenga mas fotos en el movil bebe",
    "Votacion: A la de tres se vota, quien más votos tenga, bebe",
    "Estatua: Quedate quien en una posicion, el ultimo en darse cuenta, bebe",
    "Rueda: Ir diciendo marcas de coche, si repites o no dices ninguna, bebe",
    "Muestra tu última foto de la galería o bebe",
    "Bebe por cada tatuaje o piercing que tengas",
    "Bebe por cada pulsera o accesorio que lleves",
    "Verdad o Reto", "Verdad o Reto", "Verdad o Reto"
    "Alguna vez te ha gustado tu mejor amig@","Alguna vez te ha gustado tu mejor amig@",
  "Todos: bebe si alguna vez te ha gustado tu mejor amig@","Todos: bebe si alguna vez te ha gustado tu mejor amig@",
  "Todos: bebe si alguna vez te ha gustado tu mejor amig@","Todos: bebe si alguna vez te ha gustado tu mejor amig@",
  "Todos: bebe si alguna vez te ha gustado tu mejor amig@","Todos: bebe si alguna vez te ha gustado tu mejor amig@",
  "Beben todos los que van a dormir juntos en la misma cama hoy", "Beben todos los que van a dormir juntos en la misma cama hoy",
  "Beben todos los que van a dormir juntos en la misma cama hoy","Beben todos los que van a dormir juntos en la misma cama hoy","Beben todos los que van a dormir juntos en la misma cama hoy","Beben todos los que van a dormir juntos en la misma cama hoy","Beben todos los que van a dormir juntos en la misma cama hoy","Beben todos los que van a dormir juntos en la misma cama hoy",
  "Que beban los que se liarian con alguien de esta sala","Que beban los que se liarian con alguien de esta sala","Que beban los que se liarian con alguien de esta sala","Que beban los que se liarian con alguien de esta sala","Que beban los que se liarian con alguien de esta sala","Que beban los que se liarian con alguien de esta sala","Que beban los que se liarian con alguien de esta sala",
];

function getSpiralPath() {
    let path = [];
    let left = 0, top = 0, right = size - 1, bottom = size - 1;
    while (left <= right && top <= bottom) {
        for (let i = left; i <= right; i++) path.push([top, i]);
        top++;
        for (let i = top; i <= bottom; i++) path.push([i, right]);
        right--;
        for (let i = right; i >= left; i--) path.push([bottom, i]);
        bottom--;
        for (let i = bottom; i >= top; i--) path.push([i, left]);
        left++;
    }
    return path;
}

const spiralPath = getSpiralPath();

// Función para añadir jugadores (Asegúrate de que el ID en HTML sea 'player-name')
function addPlayer() {
    const input = document.getElementById('player-name');
    const name = input.value.trim();

    if (name !== "") {
        const color = colors[players.length % colors.length];
        players.push({ name: name, position: 0, color: color });

        const list = document.getElementById('player-list');
        list.innerHTML += `<li style="color:${color}">● ${name}</li>`;

        input.value = "";
        document.getElementById('start-btn').classList.remove('hidden');
        input.focus();
        console.log("Jugador añadido:", name);
    } else {
        alert("Escribe un nombre primero");
    }
}

function startGame() {
    if (players.length === 0) return;

    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    const board = document.getElementById('board-container');
    board.innerHTML = "";

    spiralPath.forEach((pos, index) => {
        const cell = document.createElement('div');
        cell.className = 'cell active-path';
        if (index === 0) cell.classList.add('start');
        if (index === totalCells - 1) cell.classList.add('finish');
        cell.id = `path-${index}`;
        cell.innerText = index;
        cell.style.gridColumnStart = pos[1] + 1;
        cell.style.gridRowStart = pos[0] + 1;
        board.appendChild(cell);
    });
    updateTurn();
    renderTokens();
}

function rollDice() {
    const roll = Math.floor(Math.random() * 6) + 1;
    const icons = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    document.getElementById('dice-result').innerText = icons[roll - 1];

    let p = players[currentPlayerIndex];
    p.position += roll;

    if (p.position >= totalCells - 1) {
        p.position = totalCells - 1;
        renderTokens();
        setTimeout(() => {
            alert("👑 ¡" + p.name + " HA GANADO!");
            location.reload();
        }, 500);
    } else {
        const randomIndex = Math.floor(Math.random() * randomChallenges.length);
        document.getElementById('challenge-text').innerText = randomChallenges[randomIndex];

        renderTokens();
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        setTimeout(updateTurn, 600);
    }
}

function renderTokens() {
    document.querySelectorAll('.token').forEach(t => t.remove());
    players.forEach((p, i) => {
        const cell = document.getElementById(`path-${p.position}`);
        if (cell) {
            const token = document.createElement('div');
            token.className = 'token';
            token.style.backgroundColor = p.color;
            // Posicionamiento de las fichas dentro de la casilla
            token.style.left = (2 + (i % 3) * 4) + "px";
            token.style.top = (2 + Math.floor(i / 3) * 4) + "px";
            cell.appendChild(token);
        }
    });
}

function updateTurn() {
    const p = players[currentPlayerIndex];
    const display = document.getElementById('turn-display');
    display.innerText = `Turno: ${p.name}`;
    display.style.color = p.color;
}