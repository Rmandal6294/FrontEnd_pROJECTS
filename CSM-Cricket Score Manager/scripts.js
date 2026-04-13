//script---------------
let teams = {
    team1: { name: "", players: [], battingOrder: [], currentBatsmen: [], score: 0 },
    team2: { name: "", players: [], battingOrder: [], currentBatsmen: [], score: 0 }
};

let gameState = {
    currentInnings: 1,
    battingTeam: null,
    bowlingTeam: null,
    currentBowler: null,
    overs: 0,
    balls: 0,
    totalRuns: 0,
    wickets: 0,
    fours: 0,
    sixes: 0,
    maxOvers: 20, 
    maxWickets: 10, 
    gameStarted: false,
    tossWinner: null,
    tossChoice: null,
    gameFinished: false
};

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.Player_container').style.display = 'none';
    document.querySelector('.score-container').style.display = 'none';
    document.querySelector('#winner-container').style.display = 'none';
    
    document.getElementById('add_team_a_player').addEventListener('click', function(e) {
        e.preventDefault();
        addPlayer('team1');
    });
    
    document.getElementById('add_team_b_player').addEventListener('click', function(e) {
        e.preventDefault();
        addPlayer('team2');
    });
});

function startGame() {
    const team1Name = document.getElementById('team1').value.trim();
    const team2Name = document.getElementById('team2').value.trim();
    
    if (!team1Name || !team2Name) {
        alert('Please enter names for both teams!');
        return;
    }
    
    teams.team1.name = team1Name;
    teams.team2.name = team2Name;
    
    document.getElementById('team1Name').textContent = team1Name;
    document.getElementById('team2Name').textContent = team2Name;
    document.getElementById('team1name').textContent = team1Name;
    document.getElementById('team2name').textContent = team2Name;
    
    document.querySelector('.Team_container').style.display = 'none';
    document.querySelector('.Player_container').style.display = 'block';
}

function addPlayer(teamId) {
    const nameId = teamId === 'team1' ? 'player-name1' : 'player-name2';
    const jerseyId = teamId === 'team1' ? 'player1-jsno' : 'player2-jsno';
    const roleId = teamId === 'team1' ? 'role-category1' : 'role-category2';
    const listId = teamId === 'team1' ? 'player-list1' : 'player-list2';
    
    const playerName = document.getElementById(nameId).value.trim();
    const jerseyNo = document.getElementById(jerseyId).value.trim();
    const role = document.getElementById(roleId).value;
    
    if (!playerName || !jerseyNo || !role) {
        alert('Please fill all player details!');
        return;
    }
    
    const playerExists = teams[teamId].players.some(player => player.jerseyNo === jerseyNo);
    if (playerExists) {
        alert('A player with this jersey number already exists!');
        return;
    }
    
    const newPlayer = {
        name: playerName,
        jerseyNo: jerseyNo,
        role: role,
        stats: {
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            overs: 0,
            wickets: 0,
            runsConceded: 0
        },
        status: 'available' 
    };
    
    teams[teamId].players.push(newPlayer);
    teams[teamId].battingOrder.push(newPlayer);
    
    const playerList = document.getElementById(listId);
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${playerName}</td>
        <td>${jerseyNo}</td>
        <td>${role}</td>
        <td><button onclick="removePlayer('${teamId}', '${jerseyNo}')">Remove</button></td>
    `;
    playerList.appendChild(row);
    
    document.getElementById(nameId).value = '';
    document.getElementById(jerseyId).value = '';
    document.getElementById(roleId).selectedIndex = 0;
}

function removePlayer(teamId, jerseyNo) {
    const playerIndex = teams[teamId].players.findIndex(player => player.jerseyNo === jerseyNo);
    
    if (playerIndex !== -1) {
        teams[teamId].players.splice(playerIndex, 1);
        
        const battingIndex = teams[teamId].battingOrder.findIndex(player => player.jerseyNo === jerseyNo);
        if (battingIndex !== -1) {
            teams[teamId].battingOrder.splice(battingIndex, 1);
        }
        
        const listId = teamId === 'team1' ? 'player-list1' : 'player-list2';
        const playerList = document.getElementById(listId);
        playerList.innerHTML = '';
        
        teams[teamId].players.forEach(player => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${player.name}</td>
                <td>${player.jerseyNo}</td>
                <td>${player.role}</td>
                <td><button onclick="removePlayer('${teamId}', '${player.jerseyNo}')">Remove</button></td>
            `;
            playerList.appendChild(row);
        });
    }
}

function finish_player_management() {
    if (teams.team1.players.length < 2 || teams.team2.players.length < 2) {
        alert('Each team must have at least 2 players!');
        return;
    }

    
    document.getElementById('team1nam').textContent = teams.team1.name;
    document.getElementById('team2nam').textContent = teams.team2.name;
    
    document.querySelector('.Player_container').style.display = 'none';
    document.querySelector('.score-container').style.display = 'block';
    
    document.getElementById('Toss-System').style.display = 'block';
    document.getElementById('choose_option').style.display = 'none';
}

function toss() {
    const tossResult = Math.random() < 0.5 ? 'team1' : 'team2';
    gameState.tossWinner = tossResult;
    
    document.getElementById('result').textContent = `${teams[tossResult].name} won the toss!`;
    document.getElementById('choose_option').style.display = 'block';
}

function Batting() {
    if (!gameState.tossWinner) return;
    
    gameState.tossChoice = 'batting';
    gameState.battingTeam = gameState.tossWinner;
    gameState.bowlingTeam = gameState.tossWinner === 'team1' ? 'team2' : 'team1';
    
    initializeInnings();
}

function Bowling() {
    if (!gameState.tossWinner) return;
    
    gameState.tossChoice = 'bowling';
    gameState.bowlingTeam = gameState.tossWinner;
    gameState.battingTeam = gameState.tossWinner === 'team1' ? 'team2' : 'team1';
    
    initializeInnings();
}

function initializeInnings() {
    document.getElementById('Toss-System').style.display = 'none';
    
    gameState.overs = 0;
    gameState.balls = 0;
    gameState.totalRuns = 0;
    gameState.wickets = 0;
    gameState.fours = 0;
    gameState.sixes = 0;
    
    const battingTeam = teams[gameState.battingTeam];
    battingTeam.currentBatsmen = battingTeam.battingOrder.slice(0, 2);
    battingTeam.currentBatsmen.forEach(player => {
        player.status = 'batting';
    });
    
    const bowlingTeam = teams[gameState.bowlingTeam];
    gameState.currentBowler = bowlingTeam.players.find(player => 
        player.role === 'Bowler' || player.role === 'All-rounder'
    );
    
    if (gameState.currentBowler) {
        gameState.currentBowler.status = 'bowling';
    } else {
        gameState.currentBowler = bowlingTeam.players[0];
        gameState.currentBowler.status = 'bowling';
    }
    
    updateScoreboard();
    
    gameState.gameStarted = true;
}

function updateScoreboard() {
    if (!gameState.gameStarted) return;
    
    const batsmen = teams[gameState.battingTeam].currentBatsmen.map(b => b.name).join(', ');
    document.getElementById('batsmen').textContent = batsmen;
    document.getElementById('bowler').textContent = gameState.currentBowler.name;
    document.getElementById('totalRuns').textContent = gameState.totalRuns;
    document.getElementById('wickets').textContent = gameState.wickets;
    
    const oversText = `${Math.floor(gameState.overs)}.${gameState.balls}`;
    document.getElementById('overs').textContent = oversText;
    
    const runRate = gameState.overs > 0 ? 
        (gameState.totalRuns / (Math.floor(gameState.overs) + gameState.balls/6)).toFixed(2) : 
        '0.00';
    document.getElementById('runRate').textContent = runRate;
    
    document.getElementById('fours').textContent = gameState.fours;
    document.getElementById('sixes').textContent = gameState.sixes;
    
    if (gameState.currentInnings === 1) {
        document.getElementById('team1Score').textContent = gameState.totalRuns;
        teams[gameState.battingTeam].score = gameState.totalRuns;
    } else {
        document.getElementById('team2Score').textContent = gameState.totalRuns;
        teams[gameState.battingTeam].score = gameState.totalRuns;
    }
}

function recordBall() {
    if (!gameState.gameStarted || gameState.gameFinished) return;
    
    const runsInput = document.getElementById('runs');
    const wicketInput = document.getElementById('wicket');
    const whiteBallInput = document.getElementById('whiteBall');
    
    let runs = parseInt(runsInput.value);
    const isWicket = wicketInput.checked;
    const isWhiteBall = whiteBallInput.checked;
    
    if (isNaN(runs)) {
        alert('Please enter valid runs!');
        return;
    }
    
    if (runs < 0 || runs > 6) {
        alert('Runs must be between 0 and 6!');
        return;
    }
    
    const battingTeam = teams[gameState.battingTeam];
    const currentBatsman = battingTeam.currentBatsmen[0]; 
    
    currentBatsman.stats.balls++;
    
    if (!isWhiteBall) {
        gameState.balls++;
        
        if (gameState.balls === 6) {
            gameState.overs++;
            gameState.balls = 0;
            
            changeBowler();
            
            battingTeam.currentBatsmen.reverse();
        }
    }
    
    if (runs > 0) {
        gameState.totalRuns += runs;
        currentBatsman.stats.runs += runs;
        
        if (runs === 4) {
            gameState.fours++;
            currentBatsman.stats.fours++;
        } else if (runs === 6) {
            gameState.sixes++;
            currentBatsman.stats.sixes++;
        }
        
        if (runs % 2 === 1) {
            battingTeam.currentBatsmen.reverse();
        }
    }
    
    if (isWicket) {
        gameState.wickets++;
        currentBatsman.status = 'out';
        
        const nextBatsmanIndex = battingTeam.players.findIndex(player => 
            player.status === 'available'
        );
        
        if (nextBatsmanIndex !== -1 && gameState.wickets < gameState.maxWickets) {
            const nextBatsman = battingTeam.players[nextBatsmanIndex];
            nextBatsman.status = 'batting';
            battingTeam.currentBatsmen[0] = nextBatsman;
        } else {
            endInnings();
        }
    }
    
    updateScoreboard();
    
    if (gameState.overs >= gameState.maxOvers || gameState.wickets >= gameState.maxWickets) {
        endInnings();
    }
    
    if (gameState.currentInnings === 2 && 
        gameState.totalRuns > teams[gameState.battingTeam === 'team1' ? 'team2' : 'team1'].score) {
        endInnings();
    }
    
    runsInput.value = '';
    wicketInput.checked = false;
    whiteBallInput.checked = false;
}

function changeBowler() {
    const bowlingTeam = teams[gameState.bowlingTeam];
    
    if (gameState.currentBowler) {
        gameState.currentBowler.stats.overs++;
        gameState.currentBowler.status = 'available';
    }
    
    let nextBowlers = bowlingTeam.players.filter(player => 
        (player.role === 'Bowler' || player.role === 'All-rounder') && 
        player !== gameState.currentBowler
    );
    
    if (nextBowlers.length === 0) {
        nextBowlers = bowlingTeam.players.filter(player => 
            player.role !== 'Wicketkeeper' && 
            player !== gameState.currentBowler
        );
    }
    
    if (nextBowlers.length > 0) {
        nextBowlers.sort((a, b) => a.stats.overs - b.stats.overs);
        gameState.currentBowler = nextBowlers[0];
        gameState.currentBowler.status = 'bowling';
    }
}

// End innings
function endInnings() {
    if (gameState.currentInnings === 1) {
        teams[gameState.battingTeam].score = gameState.totalRuns;
        
        const tempTeam = gameState.battingTeam;
        gameState.battingTeam = gameState.bowlingTeam;
        gameState.bowlingTeam = tempTeam;
        
        teams.team1.players.forEach(player => player.status = 'available');
        teams.team2.players.forEach(player => player.status = 'available');
        
        gameState.currentInnings = 2;
        initializeInnings();
    } else {
        endGame();
    }
}

function endGame() {
    gameState.gameFinished = true;
    
    const team1Score = teams.team1.score;
    const team2Score = teams.team2.score;
    
    let winnerName = '';
    if (team1Score > team2Score) {
        winnerName = teams.team1.name;
    } else if (team2Score > team1Score) {
        winnerName = teams.team2.name;
    } else {
        winnerName = 'No one (Match Tied)';
    }
    
    document.getElementById('winnerMessage').textContent = 
        winnerName === 'No one (Match Tied)' ? 'Match Tied!' : `${winnerName} Wins!`;
    
    document.getElementById('winDetails').textContent = 
        `${teams.team1.name} scored ${team1Score} runs, while ${teams.team2.name} scored ${team2Score} runs.`;
    
    document.getElementById('winner-container').style.display = 'flex';
    
    generateMatchSummary();
}

function generateMatchSummary() {
    const summaryDiv = document.getElementById('Score_Analysis');
    
    let summaryHTML = `
        <h2>Match Summary</h2>
        <div class="team-summary">
            <h3>${teams.team1.name} - ${teams.team1.score} runs</h3>
            <table>
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Runs</th>
                        <th>Balls</th>
                        <th>4s</th>
                        <th>6s</th>
                        <th>SR</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    teams.team1.players.forEach(player => {
        if (player.stats.balls > 0) {
            const strikeRate = player.stats.balls > 0 ? 
                ((player.stats.runs / player.stats.balls) * 100).toFixed(2) : 0;
            
            summaryHTML += `
                <tr>
                    <td>${player.name}</td>
                    <td>${player.stats.runs}</td>
                    <td>${player.stats.balls}</td>
                    <td>${player.stats.fours}</td>
                    <td>${player.stats.sixes}</td>
                    <td>${strikeRate}</td>
                </tr>
            `;
        }
    });
    
    summaryHTML += `
                </tbody>
            </table>
        </div>
        
        <div class="team-summary">
            <h3>${teams.team2.name} - ${teams.team2.score} runs</h3>
            <table>
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Runs</th>
                        <th>Balls</th>
                        <th>4s</th>
                        <th>6s</th>
                        <th>SR</th>
                    </tr>
                </thead>
                <tbody>
    `;
    

    teams.team2.players.forEach(player => {
        if (player.stats.balls > 0) {
            const strikeRate = player.stats.balls > 0 ? 
                ((player.stats.runs / player.stats.balls) * 100).toFixed(2) : 0;
            
            summaryHTML += `
                <tr>
                    <td>${player.name}</td>
                    <td>${player.stats.runs}</td>
                    <td>${player.stats.balls}</td>
                    <td>${player.stats.fours}</td>
                    <td>${player.stats.sixes}</td>
                    <td>${strikeRate}</td>
                </tr>
            `;
        }
    });
    
    summaryHTML += `
                </tbody>
            </table>
        </div>
    `;
    
    summaryDiv.innerHTML = summaryHTML;
}

function restartGame() {
    
    teams = {
        team1: { name: "", players: [], battingOrder: [], currentBatsmen: [], score: 0 },
        team2: { name: "", players: [], battingOrder: [], currentBatsmen: [], score: 0 }
    };
    
    gameState = {
        currentInnings: 1,
        battingTeam: null,
        bowlingTeam: null,
        currentBowler: null,
        overs: 0,
        balls: 0,
        totalRuns: 0,
        wickets: 0,
        fours: 0,
        sixes: 0,
        maxOvers: 20,
        maxWickets: 10,
        gameStarted: false,
        tossWinner: null,
        tossChoice: null,
        gameFinished: false
    };
    
    document.getElementById('team1Score').textContent = '0';
    document.getElementById('team2Score').textContent = '0';
    document.getElementById('player-list1').innerHTML = '';
    document.getElementById('player-list2').innerHTML = '';
    document.getElementById('Score_Analysis').innerHTML = '';
    
    document.querySelector('.Team_container').style.display = 'block';
    document.querySelector('.Player_container').style.display = 'none';
    document.querySelector('.score-container').style.display = 'none';
    document.querySelector('#winner-container').style.display = 'none';
}

function exitGame() {
    if (confirm('Are you sure you want to exit the game?')) {
        restartGame();
    }
}