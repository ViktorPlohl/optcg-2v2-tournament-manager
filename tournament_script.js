// Export for testing
export let tournament = {
    name: '',
    format: 'swiss',
    byePoints: 3,
    teams: [],
    matches: [],
    currentRound: 0,
    isActive: false,
    isComplete: false
};

// Function to reset the state for testing
export function resetTournamentState() {
    tournament = {
        name: '',
        format: 'swiss',
        byePoints: 3,
        teams: [],
        matches: [],
        currentRound: 0,
        isActive: false,
        isComplete: false,
        nextTeamId: 1
    };
}

// Initialize tournament
export function initializeTournament() {
    const name = document.getElementById('tournament-name').value.trim();
    const format = document.getElementById('tournament-format').value;
    const byePoints = parseInt(document.getElementById('bye-points').value);
    const customRounds = parseInt(document.getElementById('custom-rounds').value);
    
    if (!name) {
        alert('Please enter a tournament name');
        return;
    }
    
    tournament.name = name;
    tournament.format = format;
    tournament.byePoints = byePoints;
    tournament.customRounds = isNaN(customRounds) ? null : customRounds; // Store custom rounds
    tournament.teams = [];
    tournament.matches = [];
    tournament.currentRound = 0;
    tournament.isActive = false;
    tournament.isComplete = false;
    tournament.nextTeamId = 1;
    
    console.log('Tournament initialized with:', {
        name: tournament.name,
        format: tournament.format,
        byePoints: tournament.byePoints,
        customRounds: tournament.customRounds,
        customRoundsInput: customRounds,
        isNaN: isNaN(customRounds)
    });
    
    const roundsMessage = tournament.customRounds ? 
        `Custom rounds: ${tournament.customRounds}` : 
        'Using official round rules';
    
    alert(`Tournament initialized successfully! BYE points: ${byePoints}, ${roundsMessage}`);
    updateDisplay();
    autoSave();
}

// Register a new team
export function registerTeam() {
    const teamName = document.getElementById('team-name').value.trim();
    const player1Name = document.getElementById('player1-name').value.trim();
    const player2Name = document.getElementById('player2-name').value.trim();
    
    if (!teamName || !player1Name || !player2Name) {
        alert('Please fill in team name and both player names');
        return;
    }
    
    // Check for duplicate team names
    if (tournament.teams.some(team => team.name === teamName)) {
        alert('Team name already exists');
        return;
    }
    
    const team = {
        id: tournament.teams.length + 1,
        name: teamName,
        player1: {
            name: player1Name
        },
        player2: {
            name: player2Name
        },
        points: 0,
        matches: [],
        opponents: []
    };
    
    tournament.teams.push(team);
    
    // Clear form
    document.getElementById('team-name').value = '';
    document.getElementById('player1-name').value = '';
    document.getElementById('player2-name').value = '';
    
    updateDisplay();
    autoSave();
}

// Toggle solo team mode with button
export function toggleSoloMode() {
    const soloCheckbox = document.getElementById('solo-team-checkbox');
    const player2Input = document.getElementById('player2-name-2');
    const toggleBtn = document.getElementById('solo-toggle-btn');
    
    if (soloCheckbox.value === 'false') {
        // Switch to solo mode
        soloCheckbox.value = 'true';
        player2Input.value = 'NonPlayer';
        player2Input.disabled = true;
        toggleBtn.innerHTML = '🎯 Solo Team Mode (Click to switch to Normal)';
        toggleBtn.style.background = '#dc3545';
    } else {
        // Switch to normal mode
        soloCheckbox.value = 'false';
        player2Input.value = '';
        player2Input.disabled = false;
        toggleBtn.innerHTML = '🎯 Normal Team Mode (Click to switch to Solo)';
        toggleBtn.style.background = '#28a745';
    }
}

// Register team from Teams tab (duplicate function with different IDs)
export function registerTeamFromTeamsTab() {
    const teamName = document.getElementById('team-name-2').value.trim();
    const player1Name = document.getElementById('player1-name-2').value.trim();
    let player2Name = document.getElementById('player2-name-2').value.trim();
    const isSolo = document.getElementById('solo-team-checkbox').value === 'true';
    
    console.log('Register attempt:', { teamName, player1Name, player2Name, isSolo });
    
    // If solo team, ensure Player 2 is NonPlayer
    if (isSolo) {
        document.getElementById('player2-name-2').value = 'NonPlayer';
        player2Name = 'NonPlayer';
        console.log('Solo team - Player2 set to NonPlayer');
    }
    
    if (!teamName || !player1Name || !player2Name) {
        console.log('Validation failed:', { teamName: !!teamName, player1Name: !!player1Name, player2Name: !!player2Name });
        alert('Please fill in team name and both player names');
        return;
    }
    
    // Check for duplicate team names
    if (tournament.teams.some(team => team.name === teamName)) {
        alert('Team name already exists');
        return;
    }
    
    const team = {
        id: tournament.teams.length + 1,
        name: teamName,
        player1: {
            name: player1Name
        },
        player2: {
            name: player2Name
        },
        isSolo: isSolo,
        points: 0,
        matches: [],
        opponents: []
    };
    
    tournament.teams.push(team);
    
    // Clear form
    document.getElementById('team-name-2').value = '';
    document.getElementById('player1-name-2').value = '';
    document.getElementById('player2-name-2').value = '';
    document.getElementById('player2-name-2').disabled = false;
    document.getElementById('solo-team-checkbox').value = 'false';
    const toggleBtn = document.getElementById('solo-toggle-btn');
    if (toggleBtn) {
        toggleBtn.innerHTML = '🎯 Normal Team Mode (Click to switch to Solo)';
        toggleBtn.style.background = '#28a745';
    }
    
    updateDisplay();
    autoSave();
}

// Start the tournament
export function startTournament() {
    // Prevent starting if tournament is already active
    if (tournament.isActive) {
        alert('Tournament is already active! Cannot start a new tournament.');
        console.log('Attempted to start tournament while already active');
        return;
    }
    
    // Prevent starting if tournament is complete
    if (tournament.isComplete) {
        alert('Tournament is already complete! Please reset matches to start a new tournament.');
        console.log('Attempted to start tournament while already complete');
        return;
    }
    
    if (tournament.teams.length < 2) {
        alert('Need at least 2 teams to start tournament');
        return;
    }
    
    // Allow odd number of teams - use bye system for Swiss
    if (tournament.teams.length % 2 !== 0 && tournament.format === 'swiss') {
        alert(`Tournament starting with ${tournament.teams.length} teams. Odd number of teams - bye system will be used.`);
    }
    
    console.log('Starting tournament...');
    tournament.isActive = true;
    tournament.currentRound = 1;
    generateRound();
    updateDisplay();
    autoSave();
}

// Generate pairings for current round
export function generateRound() {
    const availableTeams = tournament.teams.filter(team => !team.eliminated);
    
    if (tournament.format === 'swiss') {
        generateSwissPairings(availableTeams);
    } else {
        generateRoundRobinPairings();
    }
}

        // Generate Swiss system pairings (Official One Piece TCG Rules)
export function generateSwissPairings(teams) {
    console.log(`Generating Swiss pairings for ${teams.length} teams`);
    
    // BYE can only happen with odd number of teams
    if (teams.length % 2 === 0) {
        console.log('Even number of teams - no BYE needed');
    } else {
        console.log('Odd number of teams - one BYE will be assigned');
    }
    
    const roundMatches = [];
    const paired = new Set();
    let byeAssigned = false;
    
    // Handle BYE assignment first if odd number of teams
    if (teams.length % 2 !== 0) {
        let byeTeam = null;
        
        if (tournament.currentRound === 1) {
            // First round: Random BYE selection
            const randomIndex = Math.floor(Math.random() * teams.length);
            byeTeam = teams[randomIndex];
            console.log(`Round 1: Random BYE assigned to ${byeTeam.name}`);
        } else {
            // Later rounds: Prefer teams that haven't had BYE yet, then lowest ranked
            
            // Sort teams by ranking for BYE selection (lowest ranked gets priority)
            const teamsForBye = [...teams].sort((a, b) => {
                // 1. Prefer teams that haven't had BYE
                const aByes = a.byes || 0;
                const bByes = b.byes || 0;
                if (aByes !== bByes) return aByes - bByes;
                
                // 2. Then by ranking (lowest points first)
                if (a.points !== b.points) return a.points - b.points;
                
                // 3. Then by OMW% (lowest first)
                const aOMW = calculateOMW(a);
                const bOMW = calculateOMW(b);
                if (aOMW !== bOMW) return aOMW - bOMW;
                
                // 4. Then by OOMW% (lowest first)
                const aOOMW = calculateOOMW(a);
                const bOOMW = calculateOOMW(b);
                if (aOOMW !== bOOMW) return aOOMW - bOOMW;
                
                // 5. Alphabetical as tiebreaker
                return a.name.localeCompare(b.name);
            });
            
            byeTeam = teamsForBye[0];
            console.log(`Round ${tournament.currentRound}: BYE assigned to lowest ranked team without BYE: ${byeTeam.name}`);
        }
        
        // Assign BYE to selected team (find by name since ID might not match due to filtering)
        const tournamentByeTeam = tournament.teams.find(t => t.name === byeTeam.name);
        if (tournamentByeTeam) {
            tournamentByeTeam.points += tournament.byePoints;
            tournamentByeTeam.byes = (tournamentByeTeam.byes || 0) + 1;
        } else {
            console.error(`BYE team not found: ${byeTeam.name}`);
        }
        paired.add(byeTeam.id);
        byeAssigned = true;
        
        // Create a bye "match" for display purposes
        const byeMatchId = 'bye_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        const byeMatch = {
            id: byeMatchId,
            round: tournament.currentRound,
            team1: { ...byeTeam },
            team2: null,
            isBye: true,
            isComplete: true,
            team1Points: tournament.byePoints,
            team2Points: 0,
            results: []
        };
        roundMatches.push(byeMatch);
        
        console.log(`${byeTeam.name} receives BYE - ${tournament.byePoints} points`);
    }
    
    // Now sort remaining teams for pairing
    const availableTeams = teams.filter(team => !paired.has(team.id));
    
    if (tournament.currentRound === 1) {
        // First round: Random pairing (shuffle the teams)
        console.log('Round 1: Using random pairing');
        for (let i = availableTeams.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [availableTeams[i], availableTeams[j]] = [availableTeams[j], availableTeams[i]];
        }
    } else {
        // Later rounds: Sort by official ranking criteria for Swiss pairing
        console.log(`Round ${tournament.currentRound}: Using Swiss ranking pairing`);
        availableTeams.sort((a, b) => {
            // 1. Total points
            if (a.points !== b.points) return b.points - a.points;
            
            // 2. OMW% (Opponents' Match Win Rate)
            const aOMW = calculateOMW(a);
            const bOMW = calculateOMW(b);
            if (aOMW !== bOMW) return bOMW - aOMW;
            
            // 3. OOMW% (Opponents' Opponents' Match Win Rate)
            const aOOMW = calculateOOMW(a);
            const bOOMW = calculateOOMW(b);
            if (aOOMW !== bOOMW) return bOOMW - aOOMW;
            
            // 4. Alphabetical as tiebreaker
            return a.name.localeCompare(b.name);
        });
    }
    
    // Pair remaining teams
    for (let i = 0; i < availableTeams.length; i++) {
        if (paired.has(availableTeams[i].id)) continue;
        
        // Find best opponent that hasn't been played against
        let foundOpponent = false;
        for (let j = i + 1; j < availableTeams.length; j++) {
            if (paired.has(availableTeams[j].id)) continue;
            if (availableTeams[i].opponents.includes(availableTeams[j].id)) continue;
            
            const match = createMatch(availableTeams[i], availableTeams[j]);
            roundMatches.push(match);
            paired.add(availableTeams[i].id);
            paired.add(availableTeams[j].id);
            foundOpponent = true;
            break;
        }
        
        // If no new opponent found, allow repeat pairing (Swiss system fallback)
        if (!foundOpponent && !paired.has(availableTeams[i].id)) {
            console.log(`No new opponent for ${availableTeams[i].name}, allowing repeat pairing...`);
            for (let j = i + 1; j < availableTeams.length; j++) {
                if (paired.has(availableTeams[j].id)) continue;
                
                console.log(`Repeat pairing: ${availableTeams[i].name} vs ${availableTeams[j].name}`);
                const match = createMatch(availableTeams[i], availableTeams[j]);
                roundMatches.push(match);
                paired.add(availableTeams[i].id);
                paired.add(availableTeams[j].id);
                foundOpponent = true;
                break;
            }
        }
        
        if (!foundOpponent && !paired.has(availableTeams[i].id)) {
            console.error(`Cannot pair team ${availableTeams[i].name} - this should not happen with proper BYE handling`);
        }
    }
    
    console.log(`Round generated: ${roundMatches.length} matches, BYE assigned: ${byeAssigned}`);
    tournament.matches.push(...roundMatches);
}

// Generate Round Robin pairings (all teams play each other once)
export function generateRoundRobinPairings() {
    const teams = tournament.teams;
    
    if (tournament.currentRound === 1) {
        // First round - generate all possible pairings with proper round distribution
        tournament.allMatches = [];
        
        // Create all possible pairings
        const allPairings = [];
        for (let i = 0; i < teams.length; i++) {
            for (let j = i + 1; j < teams.length; j++) {
                allPairings.push([teams[i], teams[j]]);
            }
        }
        
        // Distribute pairings across rounds using round-robin scheduling
        const numRounds = teams.length - 1;
        const matchesPerRound = Math.floor(teams.length / 2);
        
        // Simple round distribution - assign matches to rounds sequentially
        allPairings.forEach((pairing, index) => {
            const match = createMatch(pairing[0], pairing[1]);
            match.scheduledRound = (index % numRounds) + 1;
            tournament.allMatches.push(match);
        });
        
        console.log(`Generated ${tournament.allMatches.length} total matches for ${teams.length} teams`);
        console.log(`Distributed across ${numRounds} rounds`);
    }
    
    // Get matches for current round
    const currentRoundMatches = tournament.allMatches.filter(m => m.scheduledRound === tournament.currentRound);
    currentRoundMatches.forEach(match => {
        match.round = tournament.currentRound;
    });
    
    tournament.matches.push(...currentRoundMatches);
    
    console.log(`Round ${tournament.currentRound}: ${currentRoundMatches.length} matches scheduled`);
}

// Get priority player for a team in a specific round (Official Rules)
export function getPriorityForRound(team, round) {
    // Official One Piece TCG 2v2 Rules:
    // Round 1: All Player 1s have priority
    // Round 2: All Player 2s have priority  
    // Round 3: All Player 1s have priority
    // Pattern continues...
    
    if (round % 2 === 1) {
        // Odd rounds: Player 1 has priority
        return 'player1';
    } else {
        // Even rounds: Player 2 has priority
        return 'player2';
    }
}

// Create a match between two teams
export function createMatch(team1, team2) {
    const matchId = 'match_' + Date.now() + '_' + Math.floor(Math.random() * 1000); // String ID
    
    // Determine priority based on team preferences and round number
    // Each team's priority alternates each round based on their initial preference
    const team1Priority = getPriorityForRound(team1, tournament.currentRound);
    const team2Priority = getPriorityForRound(team2, tournament.currentRound);
    
    // Determine which game is priority - where both teams' priority players meet
    const game1IsPriority = (team1Priority === 'player1' && team2Priority === 'player1');
    const game2IsPriority = (team1Priority === 'player2' && team2Priority === 'player2');
    
    // Special case: if teams have different priority preferences, 
    // priority goes to the game where at least one team's priority player is playing
    let finalGame1Priority = game1IsPriority;
    let finalGame2Priority = game2IsPriority;
    
    // If neither game has matching priorities, use fallback logic
    if (!game1IsPriority && !game2IsPriority) {
        // Default: Game with Player 1s gets priority if any team has P1 priority
        if (team1Priority === 'player1' || team2Priority === 'player1') {
            finalGame1Priority = true;
        } else {
            finalGame2Priority = true;
        }
    }
    
    const match = {
        id: matchId,
        round: tournament.currentRound,
        team1: { ...team1 },
        team2: { ...team2 },
        results: [
            {
                player1: team1.player1.name,
                player2: team2.player1.name,
                winner: null,
                isPriority: finalGame1Priority // Priority table for Player 1s
            },
            {
                player1: team1.player2.name,
                player2: team2.player2.name,
                winner: null,
                isPriority: finalGame2Priority // Priority table for Player 2s
            }
        ],
        isComplete: false,
        team1Points: 0,
        team2Points: 0
    };

    console.log('Priority assignment for match:', {
        matchId: matchId,
        round: tournament.currentRound,
        team1: team1.name,
        team1Priority: team1Priority,
        team2: team2.name,
        team2Priority: team2Priority,
        game1IsPriority: game1IsPriority,
        game2IsPriority: game2IsPriority,
        finalGame1Priority: finalGame1Priority,
        finalGame2Priority: finalGame2Priority,
        actualGame1Priority: match.results[0].isPriority,
        actualGame2Priority: match.results[1].isPriority
    });

    // Handle solo teams: NonPlayer always loses
    // Solo player always plays at priority table (always 3 points if wins)
    if (team1.isSolo || team2.isSolo) {
        if (team1.isSolo) {
            // Team1 is solo: solo player gets priority, NonPlayer automatically loses
            match.results[0].isPriority = true;  // Solo player gets priority
            match.results[1].isPriority = false; // NonPlayer vs opponent's non-priority player
            match.results[1].winner = 'team2';   // NonPlayer loses, opponent wins
            match.team2Points += 2;              // Opponent gets 2 points for non-priority win
        }
        
        if (team2.isSolo) {
            // Team2 is solo: solo player gets priority, NonPlayer automatically loses
            match.results[0].isPriority = true;  // Solo player gets priority
            match.results[1].isPriority = false; // NonPlayer vs opponent's non-priority player
            match.results[1].winner = 'team1';   // NonPlayer loses, opponent wins
            match.team1Points += 2;              // Opponent gets 2 points for non-priority win
        }
    }
    
    console.log('Created match with ID:', matchId);
    return match;
}

// Record match result
export function recordResult(matchId, gameIndex, winner) {
    console.log(`Recording result: Match ${matchId}, Game ${gameIndex}, Winner: ${winner}`);
    
    const match = tournament.matches.find(m => m.id == matchId); // Use == instead of === for flexible comparison
    if (!match) {
        console.error(`Match not found: ${matchId}`);
        console.log('Available matches:', tournament.matches.map(m => m.id));
        return;
    }
    
    if (match.isComplete) {
        console.log('Match already complete');
        return;
    }
    
    if (match.isBye) {
        console.log('Cannot record result for BYE match');
        return;
    }
    
    console.log('Match found:', match);
    
    match.results[gameIndex].winner = winner;
    
    // Calculate points for this game
    const isPriority = match.results[gameIndex].isPriority;
    
    // Check if this is a solo match - solo player always gets 3 points for wins
    const team1Solo = match.team1.isSolo;
    const team2Solo = match.team2.isSolo;
    
    let points;
    if ((team1Solo && winner === 'team1') || (team2Solo && winner === 'team2')) {
        // Solo player wins -> always 3 points (priority table)
        points = 3;
        console.log(`Game ${gameIndex + 1}: Solo player wins -> 3 points (always priority)`);
    } else {
        // Regular point calculation
        points = isPriority ? 3 : 2;
        console.log(`Game ${gameIndex + 1}: ${isPriority ? 'Priority' : 'Non-priority'} table, ${points} points`);
    }
    
    if (winner === 'team1') {
        match.team1Points += points;
    } else if (winner === 'team2') {
        match.team2Points += points;
    }
    
    console.log(`Match points: Team1: ${match.team1Points}, Team2: ${match.team2Points}`);
    
    // Check if match is complete
    if (match.results.every(result => result.winner !== null)) {
        match.isComplete = true;
        console.log('Match completed!');
        
        // Update team records
        const team1 = tournament.teams.find(t => t.id === match.team1.id);
        const team2 = tournament.teams.find(t => t.id === match.team2.id);
        
        if (team1 && team2) {
            team1.points += match.team1Points;
            team2.points += match.team2Points;
            
            team1.opponents.push(team2.id);
            team2.opponents.push(team1.id);
            
            team1.matches.push(matchId);
            team2.matches.push(matchId);
            
            console.log(`Updated team points: ${team1.name}: ${team1.points}, ${team2.name}: ${team2.points}`);
        }
    }
    
    updateDisplay();
    autoSave();
    checkTournamentCompletion();
}

// Check if tournament is complete
export function checkTournamentCompletion() {
    const currentRoundMatches = tournament.matches.filter(m => m.round === tournament.currentRound);
    const allCurrentMatchesComplete = currentRoundMatches.every(m => m.isComplete);

    if (!allCurrentMatchesComplete) {
        return; // Don't check until the round is fully complete
    }

    // Always allow next round - players decide when to end the tournament
    console.log(`Round ${tournament.currentRound} completed. Next round available.`);
    document.getElementById('next-round-btn').classList.remove('hidden');
    
    // Complete tournament button state will be updated by updateDisplay()
}

// Complete the tournament
export function completeTournament() {
    // Validation checks
    if (!tournament.isActive) {
        alert('Cannot complete tournament! Tournament is not active.');
        console.log('Attempted to complete tournament while not active');
        return;
    }
    
    if (tournament.matches.length === 0) {
        alert('Cannot complete tournament! No matches have been played yet.');
        console.log('Attempted to complete tournament with no matches');
        return;
    }
    
    // Check if current round has incomplete matches
    const currentRoundMatches = tournament.matches.filter(m => m.round === tournament.currentRound);
    const incompleteMatches = currentRoundMatches.filter(m => !m.isComplete);
    
    if (incompleteMatches.length > 0) {
        alert(`Cannot complete tournament! ${incompleteMatches.length} match(es) from Round ${tournament.currentRound} are still incomplete. Please finish all current matches first.`);
        console.log(`Attempted to complete tournament with ${incompleteMatches.length} incomplete matches:`, incompleteMatches.map(m => m.id));
        return;
    }
    
    // Confirmation dialog
    const totalRounds = tournament.currentRound;
    const totalMatches = tournament.matches.filter(m => m.isComplete).length;
    
    const confirmMessage = `Are you sure you want to complete the tournament?\n\n` +
                         `Tournament: ${tournament.name}\n` +
                         `Rounds played: ${totalRounds}\n` +
                         `Total matches: ${totalMatches}\n` +
                         `Teams: ${tournament.teams.length}\n\n` +
                         `This action cannot be undone. The tournament will be marked as complete.`;
    
    if (!confirm(confirmMessage)) {
        console.log('Tournament completion cancelled by user');
        return;
    }
    
    // Complete the tournament
    tournament.isComplete = true;
    tournament.isActive = false;
    
    // Hide next round button
    document.getElementById('next-round-btn').classList.add('hidden');
    
    updateDisplay();
    autoSave();
    
    alert(`🏆 Tournament "${tournament.name}" completed successfully!\n\nCheck the final standings to see the winners.`);
    console.log('Tournament completed! Check the final standings.');
}

// Generate next round
export function generateNextRound() {
    // Prevent generating next round if tournament is not active
    if (!tournament.isActive) {
        alert('Tournament is not active! Cannot generate next round.');
        console.log('Attempted to generate next round while tournament not active');
        return;
    }
    
    // Prevent generating next round if tournament is complete
    if (tournament.isComplete) {
        alert('Tournament is already complete! Cannot generate next round.');
        console.log('Attempted to generate next round while tournament complete');
        return;
    }
    
    // Check if all current round matches are complete
    const currentRoundMatches = tournament.matches.filter(m => m.round === tournament.currentRound);
    const incompleteMatches = currentRoundMatches.filter(m => !m.isComplete);
    
    if (incompleteMatches.length > 0) {
        alert(`Cannot generate next round! ${incompleteMatches.length} match(es) from Round ${tournament.currentRound} are still incomplete. Please finish all current matches first.`);
        console.log(`Attempted to generate next round with ${incompleteMatches.length} incomplete matches:`, incompleteMatches.map(m => m.id));
        return;
    }
    
    console.log(`Generating Round ${tournament.currentRound + 1}...`);
    tournament.currentRound++;
    document.getElementById('next-round-btn').classList.add('hidden');
    generateRound();
    updateDisplay();
    autoSave();
}

// Get official Swiss rounds count (One Piece TCG Official Rules)
export function getOfficialSwissRounds(playerCount) {
    if (playerCount <= 8) return 3;
    if (playerCount <= 16) return 4;
    if (playerCount <= 32) return 5;
    if (playerCount <= 64) return 6;
    if (playerCount <= 128) return 7;
    if (playerCount <= 256) return 8;
    if (playerCount <= 512) return 9;
    if (playerCount <= 1024) return 10;
    if (playerCount <= 2048) return 11;
    return 11; // Maximum
}

// Calculate OMW% (Opponents' Match Win Rate) - Official Bandai App Formula
export function calculateOMW(team) {
    if (team.opponents.length === 0) return 0.333; // Minimum 33.3% per official rules
    
    let totalOpponentWins = 0;
    let totalOpponentGames = 0;
    
    team.opponents.forEach(opponentId => {
        const opponent = tournament.teams.find(t => t.id === opponentId);
        if (opponent) {
            // Count actual wins (not points) for this opponent
            let opponentWins = 0;
            let opponentGames = 0;
            
            // Check each match this opponent played
            tournament.matches.forEach(match => {
                if (!match.isComplete || match.isBye) return; // Skip incomplete and BYE matches
                
                let opponentInMatch = false;
                let opponentWon = false;
                
                if (match.team1.id === opponent.id) {
                    opponentInMatch = true;
                    opponentWon = match.team1Points > match.team2Points;
                } else if (match.team2.id === opponent.id) {
                    opponentInMatch = true;
                    opponentWon = match.team2Points > match.team1Points;
                }
                
                if (opponentInMatch) {
                    opponentGames++;
                    if (opponentWon) {
                        opponentWins++;
                    }
                }
            });
            
            totalOpponentWins += opponentWins;
            totalOpponentGames += opponentGames;
        }
    });
    
    if (totalOpponentGames === 0) return 0.333;
    
    const omwRate = totalOpponentWins / totalOpponentGames;
    return Math.max(0.333, omwRate); // Minimum 33.3% per official rules
}

// Calculate OOMW% (Opponents' Opponents' Match Win Rate) - Official Bandai App Formula  
export function calculateOOMW(team) {
    if (team.opponents.length === 0) return 0.333; // Minimum 33.3% per official rules
    
    let totalOMWRates = 0;
    let validOpponents = 0;
    
    team.opponents.forEach(opponentId => {
        const opponent = tournament.teams.find(t => t.id === opponentId);
        if (opponent) {
            const opponentOMW = calculateOMW(opponent);
            totalOMWRates += opponentOMW;
            validOpponents++;
        }
    });
    
    if (validOpponents === 0) return 0.333;
    
    const oomwRate = totalOMWRates / validOpponents;
    return Math.max(0.333, oomwRate); // Minimum 33.3% per official rules
}

// Update all displays
export function updateDisplay() {
    updateTeamsList();
    updateMatchesList();
    updateStandings();
    updateTournamentStatus();
    updateMatchHistory();
    
    // Enable start tournament button if we have enough teams
    const startBtn = document.getElementById('start-tournament-btn');
    if (startBtn) {
        const shouldDisable = tournament.teams.length < 2 || tournament.isActive;
        startBtn.disabled = shouldDisable;
        console.log(`Start button - Teams: ${tournament.teams.length}, Active: ${tournament.isActive}, Disabled: ${shouldDisable}`);
    }
    
    // Enable reset matches button if tournament has been started or matches exist
    const resetBtn = document.getElementById('reset-matches-btn');
    if (resetBtn) {
        const hasMatches = tournament.matches.length > 0 || tournament.isActive || tournament.isComplete;
        resetBtn.disabled = !hasMatches;
    }
    
    // Update Complete Tournament button state and tooltip
    const completeBtn = document.getElementById('complete-tournament-btn');
    if (completeBtn) {
        if (!tournament.isActive) {
            completeBtn.disabled = true;
            completeBtn.title = 'Tournament is not active';
        } else if (tournament.isComplete) {
            completeBtn.disabled = true;
            completeBtn.title = 'Tournament is already complete';
        } else if (tournament.matches.length === 0) {
            completeBtn.disabled = true;
            completeBtn.title = 'No matches have been played yet';
        } else {
            // Check if current round is complete
            const currentRoundMatches = tournament.matches.filter(m => m.round === tournament.currentRound);
            const incompleteMatches = currentRoundMatches.filter(m => !m.isComplete);
            
            if (incompleteMatches.length > 0) {
                completeBtn.disabled = true;
                completeBtn.title = `Complete all ${incompleteMatches.length} remaining match(es) in Round ${tournament.currentRound} first`;
            } else {
                completeBtn.disabled = false;
                completeBtn.title = 'Complete the tournament (cannot be undone)';
            }
        }
        
        console.log(`Complete button state: disabled=${completeBtn.disabled}, tooltip="${completeBtn.title}"`);
    }
}

// Update teams list
export function updateTeamsList() {
    const teamsList = document.getElementById('teams-list');
    if (!teamsList) return;
    
    teamsList.innerHTML = '';
    
    tournament.teams.forEach((team, index) => {
        const teamCard = document.createElement('div');
        teamCard.className = 'team-card';
        const currentRound = tournament.currentRound || 1;
        const priorityPlayer = getPriorityForRound(team, currentRound);
        const priority1Icon = priorityPlayer === 'player1' ? ' 🏆' : '';
        const priority2Icon = priorityPlayer === 'player2' ? ' 🏆' : '';
        
        teamCard.innerHTML = `
            <div class="team-name">${team.name} ${team.isSolo ? '(Solo)' : ''}</div>
            <div class="player-info">
                <strong>Player 1:</strong> ${team.player1.name}${priority1Icon}
            </div>
            <div class="player-info">
                <strong>Player 2:</strong> ${team.player2.name}${priority2Icon} ${team.isSolo ? '<em>(NonPlayer)</em>' : ''}
            </div>
            <div style="margin-top: 10px;">
                <strong>Points:</strong> ${team.points}
            </div>
            <div style="margin-top: 5px; font-size: 0.9em; color: #666;">
                <strong>Round ${currentRound} Priority:</strong> ${priorityPlayer === 'player1' ? team.player1.name : team.player2.name}
            </div>
            <button onclick="removeTeam(${team.id})" class="btn-danger" style="margin-top: 10px;" ${tournament.isActive ? 'disabled' : ''}>
                Remove Team
            </button>
        `;
        teamsList.appendChild(teamCard);
    });
    
    // Update start button after updating teams list
    const startBtn = document.getElementById('start-tournament-btn');
    if (startBtn) {
        const shouldDisable = tournament.teams.length < 2 || tournament.isActive;
        startBtn.disabled = shouldDisable;
        console.log(`Teams updated - Count: ${tournament.teams.length}, Button disabled: ${shouldDisable}`);
    }
}

// Remove team (only if tournament hasn't started)
export function removeTeam(teamId) {
    if (tournament.isActive) {
        return;
    }
    
    if (confirm('Are you sure you want to remove this team?')) {
        tournament.teams = tournament.teams.filter(team => team.id !== teamId);
        updateDisplay();
        autoSave();
    }
}

// Update matches list
export function updateMatchesList() {
    const matchesList = document.getElementById('current-matches');
    if (!matchesList) return;
    
    const currentRoundMatches = tournament.matches.filter(m => m.round === tournament.currentRound);
    
    matchesList.innerHTML = '';
    
    if (currentRoundMatches.length === 0) {
        matchesList.innerHTML = '<p>No matches in current round</p>';
        return;
    }
    
    currentRoundMatches.forEach(match => {
        const matchCard = document.createElement('div');
        matchCard.className = 'match-card';
        
        // Handle bye matches differently
        if (match.isBye) {
            matchCard.innerHTML = `
                <div class="match-header">Round ${match.round} - BYE</div>
                <div style="text-align: center; padding: 20px;">
                    <strong>${match.team1.name}</strong><br>
                    <em>Receives BYE (${tournament.byePoints} points)</em><br>
                    <div style="margin-top: 10px; font-weight: bold; color: #28a745;">
                        BYE - Automatic ${tournament.byePoints} Points
                    </div>
                </div>
            `;
        } else {
            const priorityIndicator1 = match.results[0].isPriority ? '<span class="priority-indicator">PRIORITY</span>' : '';
            const priorityIndicator2 = match.results[1].isPriority ? '<span class="priority-indicator">PRIORITY</span>' : '';
            
            matchCard.innerHTML = `
                <div class="match-header">Round ${match.round} - Match</div>
                <div class="vs-display">
                    <div class="team-display">
                        <strong>${match.team1.name}</strong><br>
                        ${match.team1.player1.name}<br>
                        ${match.team1.player2.name}
                    </div>
                    <div class="vs-text">VS</div>
                    <div class="team-display">
                        <strong>${match.team2.name}</strong><br>
                        ${match.team2.player1.name}<br>
                        ${match.team2.player2.name}
                    </div>
                </div>
                
                <div style="margin: 15px 0;">
                    <strong>Game 1:</strong> ${match.results[0].player1} vs ${match.results[0].player2} ${priorityIndicator1}<br>
                    <div class="match-result">
                        <button onclick="recordResult('${match.id}', 0, 'team1')" ${match.results[0].winner ? 'disabled' : ''}>
                            ${match.team1.player1.name} Wins
                        </button>
                        <button onclick="recordResult('${match.id}', 0, 'team2')" ${match.results[0].winner ? 'disabled' : ''}>
                            ${match.team2.player1.name} Wins
                        </button>
                    </div>
                    ${match.results[0].winner ? `<em>Winner: ${match.results[0].winner === 'team1' ? match.team1.player1.name : match.team2.player1.name}</em>` : ''}
                </div>
                
                <div style="margin: 15px 0;">
                    <strong>Game 2:</strong> ${match.results[1].player1} vs ${match.results[1].player2} ${priorityIndicator2}<br>
                    <div class="match-result">
                        <button onclick="recordResult('${match.id}', 1, 'team1')" ${match.results[1].winner ? 'disabled' : ''}>
                            ${match.team1.player2.name} Wins
                        </button>
                        <button onclick="recordResult('${match.id}', 1, 'team2')" ${match.results[1].winner ? 'disabled' : ''}>
                            ${match.team2.player2.name} Wins
                        </button>
                    </div>
                    ${match.results[1].winner ? `<em>Winner: ${match.results[1].winner === 'team1' ? match.team1.player2.name : match.team2.player2.name}</em>` : ''}
                </div>
                
                <div style="text-align: center; margin-top: 15px; font-weight: bold;">
                    ${match.team1.name}: ${match.team1Points} points | ${match.team2.name}: ${match.team2Points} points
                    ${match.isComplete ? '<br><em>Match Complete</em>' : ''}
                </div>
            `;
        }
        
        matchesList.appendChild(matchCard);
    });
}

// Update standings (Official One Piece TCG Ranking)
export function updateStandings() {
    const standingsBody = document.getElementById('standings-body');
    if (!standingsBody) return;
    
    console.log('Updating standings - Tournament teams:', tournament.teams.map(t => ({
        name: t.name, 
        points: t.points, 
        matches: t.matches.length,
        opponents: t.opponents.length
    })));
    
    // Sort teams by official ranking criteria
    const sortedTeams = [...tournament.teams].sort((a, b) => {
        // 1. Match Points
        if (a.points !== b.points) return b.points - a.points;
        
        // 2. OMW% (Opponents' Match Win Rate)
        const aOMW = calculateOMW(a);
        const bOMW = calculateOMW(b);
        if (aOMW !== bOMW) return bOMW - aOMW;
        
        // 3. OOMW% (Opponents' Opponents' Match Win Rate)
        const aOOMW = calculateOOMW(a);
        const bOOMW = calculateOOMW(b);
        return bOOMW - aOOMW;
    });
    
    standingsBody.innerHTML = '';
    
    sortedTeams.forEach((team, index) => {
        const row = document.createElement('tr');
        const omwRate = (calculateOMW(team) * 100).toFixed(1);
        const oomwRate = (calculateOOMW(team) * 100).toFixed(1);
        const byeText = team.byes ? ` (${team.byes} BYE)` : '';
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${team.name}${byeText}</td>
            <td>${team.points}</td>
            <td>${omwRate}%</td>
            <td>${oomwRate}%</td>
            <td>${team.matches.length}</td>
        `;
        standingsBody.appendChild(row);
    });
}

// Update tournament status
export function updateTournamentStatus() {
    const statusElement = document.getElementById('tournament-status');
    if (!statusElement) return;
    
    if (!tournament.isActive && !tournament.isComplete) {
        statusElement.innerHTML = 'Tournament not started';
        statusElement.className = 'tournament-status';
    } else if (tournament.isActive) {
        statusElement.innerHTML = `Round ${tournament.currentRound} in progress`;
        statusElement.className = 'tournament-status status-active';
    } else if (tournament.isComplete) {
        statusElement.innerHTML = 'Tournament Complete! 🏆';
        statusElement.className = 'tournament-status status-complete';
    }
}

// Update match history
export function updateMatchHistory() {
    const historyBody = document.getElementById('match-history-body');
    if (!historyBody) return;

    historyBody.innerHTML = '';

    // Get all completed matches, sorted by round
    const completedMatches = tournament.matches
        .filter(match => match.isComplete)
        .sort((a, b) => a.round - b.round);

    if (completedMatches.length === 0) {
        historyBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">No completed matches yet</td></tr>';
        return;
    }

    completedMatches.forEach(match => {
        const row = document.createElement('tr');

        if (match.isBye) {
            row.innerHTML = `
                <td>Round ${match.round}</td>
                <td colspan="2" style="text-align: center;"><strong>${match.team1.name}</strong> (BYE)</td>
                <td colspan="2" style="text-align: center;">Automatic BYE</td>
                <td>${match.team1Points} pts</td>
                <td style="text-align: center;">BYE Winner</td>
            `;
        } else {
            // Game 1 result
            const game1Winner = match.results[0].winner === 'team1' ? match.team1.player1.name : match.team2.player1.name;
            const game1Loser = match.results[0].winner === 'team1' ? match.team2.player1.name : match.team1.player1.name;
            const game1Priority = match.results[0].isPriority ? ' (Priority)' : '';
            const game1Result = `${game1Winner} vs ${game1Loser}${game1Priority}`;

            // Game 2 result
            const game2Winner = match.results[1].winner === 'team1' ? match.team1.player2.name : match.team2.player2.name;
            const game2Loser = match.results[1].winner === 'team1' ? match.team2.player2.name : match.team1.player2.name;
            const game2Priority = match.results[1].isPriority ? ' (Priority)' : '';
            const game2Result = `${game2Winner} vs ${game2Loser}${game2Priority}`;

            // Match winner
            const matchWinner = match.team1Points > match.team2Points ? match.team1.name : 
                               match.team2Points > match.team1Points ? match.team2.name : 'Tie';

            row.innerHTML = `
                <td>Round ${match.round}</td>
                <td><strong>${match.team1.name}</strong><br><small>${match.team1.player1.name}, ${match.team1.player2.name}</small></td>
                <td><strong>${match.team2.name}</strong><br><small>${match.team2.player1.name}, ${match.team2.player2.name}</small></td>
                <td>${game1Result}</td>
                <td>${game2Result}</td>
                <td>${match.team1.name}: ${match.team1Points}<br>${match.team2.name}: ${match.team2Points}</td>
                <td><strong>${matchWinner}</strong></td>
            `;
        }

        historyBody.appendChild(row);
    });
}

// Auto-save tournament state to localStorage
export function autoSave() {
    try {
        localStorage.setItem('onepiece_tournament', JSON.stringify(tournament));
        console.log('Tournament auto-saved');
        updateSaveStatus('💾 Auto-saved at ' + new Date().toLocaleTimeString());
    } catch (error) {
        console.error('Failed to auto-save tournament:', error);
        updateSaveStatus('❌ Save failed');
    }
}

// Update save status indicator
export function updateSaveStatus(message) {
    const statusElement = document.getElementById('save-status');
    if (statusElement) {
        statusElement.textContent = message;
        setTimeout(() => {
            if (statusElement.textContent === message) {
                statusElement.textContent = '';
            }
        }, 3000);
    }
}

// Clear localStorage
export function clearStorage() {
    if (confirm('This will delete all saved tournament data. Are you sure?')) {
        localStorage.removeItem('onepiece_tournament');
        alert('Storage cleared');
    }
}

// Reset matches but keep teams
export function resetMatches() {
    if (!confirm('This will reset all matches and points but keep registered teams. Continue?')) {
        return;
    }
    
    // Reset tournament state
    tournament.isActive = false;
    tournament.isComplete = false;
    tournament.currentRound = 0;
    tournament.matches = [];
    tournament.allMatches = []; // For round robin
    
    // Reset team data but keep team registration
    tournament.teams.forEach(team => {
        team.points = 0;
        team.matches = [];
        team.opponents = [];
        team.byes = 0;
    });
    
    // Hide next round button
    document.getElementById('next-round-btn').classList.add('hidden');
    
    // Force clear standings table
    const standingsBody = document.getElementById('standings-body');
    if (standingsBody) {
        standingsBody.innerHTML = '';
    }
    
    // Force clear matches display
    const matchesList = document.getElementById('current-matches');
    if (matchesList) {
        matchesList.innerHTML = '<p>No matches - Tournament reset</p>';
    }
    
    // Force clear match history display
    const historyBody = document.getElementById('match-history-body');
    if (historyBody) {
        historyBody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">No completed matches yet</td></tr>';
    }
    
    updateDisplay();
    
    // Force another standings update after a short delay
    setTimeout(() => {
        updateStandings();
        console.log('Forced standings update after reset');
    }, 100);
    
    autoSave();
    
    alert('Matches reset successfully! Teams are preserved.');
    console.log('Reset completed - Teams:', tournament.teams.map(t => ({name: t.name, points: t.points, matches: t.matches.length})));
}

// Auto-load on page load
export function autoLoad() {
    try {
        const saved = localStorage.getItem('onepiece_tournament');
        if (saved) {
            const loadedTournament = JSON.parse(saved);
            // Only auto-load if there's actual tournament data
            if (loadedTournament.name || loadedTournament.teams.length > 0) {
                tournament = loadedTournament;
                
                // Update form fields
                document.getElementById('tournament-name').value = tournament.name || '';
                document.getElementById('tournament-format').value = tournament.format || 'swiss';
                document.getElementById('bye-points').value = tournament.byePoints || 3;
                if (tournament.customRounds) {
                    document.getElementById('custom-rounds').value = tournament.customRounds;
                }
                
                console.log('Tournament auto-loaded');
                
                // Tournament auto-loaded - no need to switch tabs
            }
        }
    } catch (error) {
        console.error('Failed to auto-load tournament:', error);
    }
}

// Initialize display on page load
document.addEventListener('DOMContentLoaded', function() {
    autoLoad();
    updateDisplay();
});

// Assign functions to the window object so they can be called from the HTML
window.initializeTournament = initializeTournament;
window.registerTeam = registerTeam;
window.toggleSoloMode = toggleSoloMode;
window.registerTeamFromTeamsTab = registerTeamFromTeamsTab;
window.startTournament = startTournament;
window.generateNextRound = generateNextRound;
window.completeTournament = completeTournament;
window.removeTeam = removeTeam;
window.recordResult = recordResult;
window.clearStorage = clearStorage;
window.resetMatches = resetMatches; 