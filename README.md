# One Piece TCG Tournament Manager

[![Tests](https://github.com/ViktorPlohl/optcg-2v2-tournament-manager/actions/workflows/test.yml/badge.svg)](https://github.com/ViktorPlohl/optcg-2v2-tournament-manager/actions/workflows/test.yml)

> **🚀 Quick Start**: New to this project? Check out [SETUP.md](SETUP.md) for the fastest way to get started!

## 📋 Overview

The One Piece TCG Tournament Manager is a comprehensive tournament organization system that operates according to the official One Piece Trading Card Game 2v2 rules. The system supports both Swiss and Round Robin formats with advanced pairing algorithms and precise ranking calculations.

---

## 🎯 Main Features

### 🏆 Tournament Formats
- **Swiss System**: According to official One Piece TCG rules
- **Round Robin**: Every team plays against every other team
- **Hybrid Support**: Solo players and 2v2 teams mixed together

### 👥 Team Management
- **Regular Teams**: 2 players (Player 1 + Player 2)
- **Solo Teams**: 1 player + NonPlayer placeholder
- **Dynamic Registration**: Before and during tournaments
- **Team Removal**: In inactive tournaments

### 📊 Advanced Statistics
- **OMW%**: Opponents' Match Win Percentage
- **OOMW%**: Opponents' Opponents' Match Win Percentage
- **Automatic BYE Handling**: For odd number of teams
- **Real-time Rankings**: With official tiebreaker rules

---

## 🔧 Swiss System Implementation

### 📐 Core Logic

The Swiss system operates according to official One Piece TCG rules:

1. **Number of Rounds**: Automatically calculated based on team count
   - 1-8 teams: 3 rounds
   - 9-16 teams: 4 rounds
   - 17-32 teams: 5 rounds
   - etc. (log₂ based calculation)

2. **Pairing Algorithm**:
   - **Round 1**: Completely random pairing
   - **Round 2+**: Ranking-based pairing

### 🎲 First Round - Random Pairing

```
Algorithm: Fisher-Yates Shuffle
1. Team list randomly shuffled
2. First team vs Second team
3. Third team vs Fourth team
4. etc.
```

**Advantages**:
- Completely fair start
- No prior advantage/disadvantage
- Every tournament is unique

### 📈 Subsequent Rounds - Swiss Pairing

**Ranking Criteria** (in priority order):

1. **Total Points** (descending order)
2. **OMW%** - Opponents' Match Win Percentage (descending)
3. **OOMW%** - Opponents' Opponents' Match Win Percentage (descending)
4. **Alphabetical** - Team name (ascending)

**Pairing Logic**:
- Similar ranked teams against each other
- Avoids previous opponents (when possible)
- Repeat pairing allowed when necessary

---

## 🧮 Calculation Logic

### 🏅 Point Calculation

**Match Structure**: Every match consists of 2 games
- **Priority Game**: 3 points to the winner
- **Non-priority Game**: 2 points to the winner

**Round-based Priority**:
- **Round 1**: All Player 1s get priority
- **Round 2**: All Player 2s get priority
- **Round 3**: All Player 1s get priority
- **etc.** (alternating pattern)

### 📊 OMW% Calculation (Opponents' Match Win Percentage)

```
OMW% = (Opponents' Total Wins) / (Opponents' Total Matches)
```

**Implementation**:
1. Find all opponents of the team
2. Calculate each opponent's win rate
3. Average calculation without weighting
4. Minimum 33.33% (0.3333) guaranteed

**Example**:
- Team A's opponents: B (2-1), C (1-2), D (3-0)
- OMW% = (2+1+3) / (3+3+3) = 6/9 = 66.67%

### 📈 OOMW% Calculation (Opponents' Opponents' Match Win Percentage)

```
OOMW% = Average of opponents' OMW%
```

**Implementation**:
1. OMW% of all team's opponents
2. Average calculation
3. Deep tiebreaker in complex situations

---

## 🎪 BYE System

### 🎯 BYE Conditions

**When BYE is needed**:
- Odd number of active teams
- One team automatically "wins" the round

### 🔄 BYE Distribution Algorithm

**Round 1**:
- **Completely random** BYE selection
- Every team has equal chance

**Round 2+**:
- **Priority order**:
  1. Haven't received BYE yet
  2. Fewest points
  3. Lowest OMW%
  4. Lowest OOMW%
  5. Alphabetical order

### 💰 BYE Points

- **Default**: 3 points (priority win value)
- **Configurable**: In tournament.byePoints variable
- **Tracking**: BYE counter per team

---

## 🔄 Round Robin System

### 🎯 Core Principle

**Complete Round Robin**: Every team plays against every other team exactly once.

### 📐 Mathematical Foundation

**Number of Matches**: C(n,2) = n×(n-1)/2
- 4 teams: 6 matches
- 6 teams: 15 matches
- 8 teams: 28 matches

**Number of Rounds**: n-1 (n = number of teams)

### 🗓️ Match Distribution

**Algorithm**:
1. Generate all possible pairings
2. Even distribution across rounds
3. Sequential round assignment

**Example** (4 teams):
- **Round 1**: A vs B, C vs D
- **Round 2**: A vs C, B vs D
- **Round 3**: A vs D, B vs C

---

## 👤 Solo Team Support

### 🎯 Solo Team Concept

**Problem**: What happens when someone wants to play alone?
**Solution**: NonPlayer placeholder system

### 🔧 Implementation

**Solo team structure**:
- **Player 1**: Real player
- **Player 2**: "NonPlayer" (placeholder)
- **isSolo**: true flag

### 🎮 Game Logic

**Priority handling**:
- **Solo player**: Always plays priority game (3 points)
- **NonPlayer**: Always "plays" non-priority game (2 points)

**Automatic results**:
- **NonPlayer vs Real player**: NonPlayer automatically loses
- **Solo player vs Real player**: Normal game on priority table

### 🏆 Tournament Integration

**Pairing**:
- Solo teams can be paired normally
- Swiss/Round Robin algorithms support them
- No special handling required

**Limitations**:
- **Only one solo team** allowed per tournament
- If two solo players exist → they must form one team

---

## ⚙️ Technical Details

### 🏗️ Architecture

**Modular structure**:
- **tournament_script.js**: Core logic
- **tournament_script.test.js**: Comprehensive tests (58 tests)
- **HTML/CSS**: User interface

### 💾 Data Management

**State storage**:
- **LocalStorage**: Automatic saving
- **JSON format**: Structured data
- **Error handling**: Corrupt data recovery

**Main data structures**:
- **Tournament**: Tournament state
- **Teams**: Team list
- **Matches**: Matches and results
- **Results**: Game results

### 🔄 Real-time Updates

**Automatic updates**:
- Team list
- Match list
- Standings table
- Tournament status
- Match history

---

## 🧪 Testing

### 📊 Test Coverage

**58 comprehensive tests** covering:
- Basic functions (5 tests)
- Swiss pairing (2 tests)
- Match handling (2 tests)
- Tournament completion (2 tests)
- Solo team handling (4 tests)
- Edge cases (4 tests)
- BYE system (2 tests)
- Round Robin (6 tests)
- Team management (3 tests)
- Ranking calculations (5 tests)
- Data persistence (3 tests)
- Error handling (3 tests)
- UI manipulation (13 tests)
- Advanced scenarios (3 tests)

### 🎯 Critical Tests

**Large tournament test**: 16 teams, 4 rounds
**Complex tiebreaker**: Precise OMW%/OOMW% calculation
**Solo team integration**: Mixed tournament support

---

## 🚀 Quick Start

### 📥 Installation

**Option 1: Download from GitHub**
1. Click the green "Code" button → "Download ZIP"
2. Extract the ZIP file to your desired folder
3. Open `index.html` in any modern web browser

**Option 2: Clone Repository**
```bash
git clone https://github.com/YOUR_USERNAME/onepiece-tcg-tournament-manager.git
cd onepiece-tcg-tournament-manager
# Open index.html in browser
```

### 💻 Running the Application

**Option 1: Simple File Opening** (Try this first)
1. Download all files to a folder
2. Open `index.html` in any modern web browser
3. Start using the tournament manager immediately!

> **⚠️ Note**: If you encounter CORS errors (especially in Chrome), use Option 3 instead.

**Option 2: Local Development Server**
```bash
# If you have Node.js installed
npm install
npm test  # Optional: Run tests
# Then open index.html in browser
```

**Option 3: Local Server** (Recommended if Option 1 fails)
```bash
# Using Python (usually pre-installed)
python -m http.server 8000
# Then visit: http://localhost:8000

# Or using Node.js live-server
npx live-server

# Or using PHP (if available)
php -S localhost:8000
```

### 📋 Requirements

- **Modern web browser** (Chrome, Firefox, Safari, Edge)
- **No server required** - runs completely in browser*
- **No internet needed** - works offline
- **Node.js** (optional, only for running tests)

> **\*CORS Note**: Some browsers (especially Chrome) may require a local server due to CORS policies. See troubleshooting section below.

---

## 🎮 Usage Guide

### 📝 Team Registration

1. **Regular team**: Name + Player 1 + Player 2
2. **Solo team**: Name + Player 1 + Solo checkbox
3. **Validation**: Duplicate name checking

### 🏁 Tournament Start

1. **Minimum 2 teams** required
2. **Format selection**: Swiss/Round Robin
3. **Automatic first round** generation

### 🎮 Match Management

1. **Result recording**: Winner per game
2. **Automatic point calculation**
3. **Real-time ranking updates**

### 🏆 Tournament Completion

1. **Automatic detection**: All matches completed
2. **Final standings**: OMW%/OOMW% tiebreakers
3. **Statistics export**

### 🔧 Troubleshooting

**Problem**: App doesn't load or shows CORS errors
**Solution**: Use Option 3 (local server) instead of opening the file directly. Chrome especially blocks local file access.

**Problem**: Tournament data disappears after closing browser
**Solution**: This is normal! Data is saved in browser storage. Use the same browser and it will persist.

**Problem**: Styling looks broken
**Solution**: Make sure `tournament_styles.css` is in the same folder as `index.html`.

**Problem**: JavaScript errors in console
**Solution**: Try using a local server (Option 3) or use Firefox/Safari which are more permissive with local files.

---

## 🔮 Future Developments

### 🎯 Planned Features

- **Playoff system**: Top 8 elimination stage
- **Timing**: Match time limits
- **Statistics export**: CSV/PDF reports
- **Multi-tournament**: Multiple tournament management
- **Online sync**: Real-time synchronization

### 🛠️ Technical Improvements

- **Performance optimization**: Large tournaments (100+ teams)
- **Mobile responsive**: Full mobile support
- **Offline mode**: Internet-free operation
- **Backup/Restore**: Tournament save/restore

---

## 📚 Appendices

### 🔗 References

- **One Piece TCG Official Rules**: Tournament regulations
- **Swiss System**: Chess tournament format adaptation
- **Fisher-Yates Shuffle**: Random pairing algorithm

### 📖 Glossary

- **OMW%**: Opponents' Match Win Percentage
- **OOMW%**: Opponents' Opponents' Match Win Percentage
- **BYE**: Automatic win for odd number of teams
- **Priority**: Higher point value game (3 points vs 2 points)
- **NonPlayer**: Placeholder in solo teams
- **Tiebreaker**: Tie-resolving criteria

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### 🐛 Bug Reports
- Use GitHub Issues to report bugs
- Include steps to reproduce
- Provide browser and OS information

### 💡 Feature Requests
- Open an issue with the "enhancement" label
- Describe the feature and use case
- Check existing issues first

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🌍 Language Versions

- **English**: README.md (this file)
- **Hungarian**: README-HU.md

---

## ⭐ Show Your Support

If this project helped you organize your One Piece TCG tournaments, please give it a ⭐ on GitHub!

---

*Created by: One Piece TCG Tournament Manager v1.0*
*Last updated: 2025* 