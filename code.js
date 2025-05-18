// Gameboard-Module
const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;
    const setMark = (index, mark) => {
        if (board[index] === "") {
            board[index] = mark;
            return true;
        }
        return false;
    };
    const reset = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };
    return { getBoard, setMark, reset };
})();

// Player Factory
const Player = (name, mark) => {
    return { name, mark };
};

// Game Controller
const GameController = (() => {
    let player1 = Player("Player 1", "X");
    let player2 = Player("Player 2", "O");
    let currentPlayer = player1;
    let gameOver = false;

    const winningCombos = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];

    const setPlayers = (name1, name2) => {
        player1 = Player(name1 || "Player 1", "X");
        player2 = Player(name2 || "Player 2", "O");
        currentPlayer = player1;
    };

    const checkWinner = () => {
        const board = Gameboard.getBoard();
        for (const combo of winningCombos) {
            const [a, b, c] = combo;
            if (
                board[a] &&
                board[a] === board[b] &&
                board[a] === board[c]
            ) {
                return currentPlayer;
            }
        }
        if (!board.includes("")) return "Tie";
        return null;
    };

    const playRound = (index) => {
        if (gameOver) return;
        if (Gameboard.setMark(index, currentPlayer.mark)) {
            const result = checkWinner();
            if (result === "Tie") {
                gameOver = true;
            } else if (result) {
                gameOver = true;
            } else {
                currentPlayer = currentPlayer === player1 ? player2 : player1;
            }
        }
    };

    const reset = () => {
        Gameboard.reset();
        currentPlayer = player1;
        gameOver = false;
    };

    return { playRound, reset, getCurrentPlayer: () => currentPlayer, getGameOver: () => gameOver, setPlayers, player1: () => player1, player2: () => player2 };
})();

// Display Controller
const DisplayController = (() => {
    const boardDiv = document.getElementById("board");
    const statusDiv = document.getElementById("status");
    const startBtn = document.getElementById("start");
    const player1Input = document.getElementById("player1-name");
    const player2Input = document.getElementById("player2-name");

    const handleCellClick = (e) => {
        const index = parseInt(e.target.dataset.index);
        if (GameController.getGameOver()) return;
        GameController.playRound(index);
        render();
        updateStatus();
    };

    const addCellListeners = () => {
        const cells = boardDiv.querySelectorAll(".cell");
        cells.forEach(cell => {
            cell.addEventListener("click", handleCellClick);
        });
    };

    const render = () => {
        const board = Gameboard.getBoard();
        const cells = boardDiv.querySelectorAll(".cell");
        cells.forEach((cell, idx) => {
            cell.textContent = board[idx];
        });
    };

    const updateStatus = () => {
        if (GameController.getGameOver()) {
            const board = Gameboard.getBoard();
            const winner = GameController.getCurrentPlayer();
            if (!board.includes("")) {
                statusDiv.textContent = "It's a tie!";
            } else {
                statusDiv.textContent = `${winner.name} wins!`;
            }
        } else {
            statusDiv.textContent = `${GameController.getCurrentPlayer().name}'s turn (${GameController.getCurrentPlayer().mark})`;
        }
    };

    const startGame = () => {
        GameController.setPlayers(player1Input.value, player2Input.value);
        GameController.reset();
        render();
        updateStatus();
    };

    const init = () => {
        render();
        addCellListeners();
        updateStatus();
        startBtn.addEventListener("click", startGame);
    };

    init();

    return { render, updateStatus };
})();
