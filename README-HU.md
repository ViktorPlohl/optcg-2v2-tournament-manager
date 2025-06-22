# One Piece TCG Tournament Manager

> **🚀 Gyors Indítás**: Új vagy a projektben? Nézd meg a [SETUP.md](SETUP.md) fájlt a leggyorsabb kezdéshez!

## 📋 Áttekintés

A One Piece TCG Tournament Manager egy teljes körű versenyszervező rendszer, amely a hivatalos One Piece Trading Card Game 2v2 szabályai szerint működik. A rendszer Swiss és Round Robin formátumokat támogat, fejlett párosítási algoritmusokkal és pontos rangsorolási számításokkal.

---

## 🎯 Főbb Funkciók

### 🏆 Verseny Formátumok
- **Swiss System**: Hivatalos One Piece TCG szabályok szerint
- **Round Robin**: Minden csapat minden csapat ellen játszik
- **Hibrid támogatás**: Solo játékosok és 2v2 csapatok vegyesen

### 👥 Csapat Kezelés
- **Normál csapatok**: 2 játékos (Player 1 + Player 2)
- **Solo csapatok**: 1 játékos + NonPlayer placeholder
- **Dinamikus regisztráció**: Verseny előtt és alatt is
- **Csapat eltávolítás**: Inaktív versenyekben

### 📊 Fejlett Statisztikák
- **OMW%**: Opponents' Match Win Percentage
- **OOMW%**: Opponents' Opponents' Match Win Percentage
- **Automatikus BYE kezelés**: Páratlan csapatszámnál
- **Valós idejű rangsor**: Hivatalos tiebreaker szabályokkal

---

## 🔧 Swiss Rendszer Implementáció

### 📐 Alaplogika

A Swiss rendszer a hivatalos One Piece TCG szabályok szerint működik:

1. **Körök száma**: Csapatszám alapján automatikusan számított
   - 1-8 csapat: 3 kör
   - 9-16 csapat: 4 kör
   - 17-32 csapat: 5 kör
   - stb. (log₂ alapú számítás)

2. **Párosítási algoritmus**:
   - **1. kör**: Teljesen random párosítás
   - **2+ kör**: Rangsor alapú párosítás

### 🎲 Első Kör - Random Párosítás

```
Algoritmus: Fisher-Yates Shuffle
1. Csapatok listája véletlenszerűen keverve
2. Első csapat vs Második csapat
3. Harmadik csapat vs Negyedik csapat
4. stb.
```

**Előnyök**:
- Teljesen fair kezdés
- Nincs előzetes előny/hátrány
- Minden verseny egyedi

### 📈 Továbbí Körök - Swiss Párosítás

**Rangsorolási kritériumok** (prioritás sorrendben):

1. **Összes pont** (csökkenő sorrend)
2. **OMW%** - Opponents' Match Win Percentage (csökkenő)
3. **OOMW%** - Opponents' Opponents' Match Win Percentage (csökkenő)
4. **Alfabetikus** - Csapatnév (növekvő)

**Párosítási logika**:
- Hasonló rangsorú csapatok egymás ellen
- Elkerüli a korábbi ellenfelet (ha lehetséges)
- Repeat pairing engedélyezett szükség esetén

---

## 🧮 Számítási Logikák

### 🏅 Pontszámítás

**Meccs struktúra**: Minden meccs 2 játékból áll
- **Priority játék**: 3 pont a győztesnek
- **Non-priority játék**: 2 pont a győztesnek

**Kör alapú prioritás**:
- **1. kör**: Minden Player 1 prioritást kap
- **2. kör**: Minden Player 2 prioritást kap
- **3. kör**: Minden Player 1 prioritást kap
- **stb.** (váltakozó minta)

### 📊 OMW% Számítás (Opponents' Match Win Percentage)

```
OMW% = (Ellenfelek összes győzelme) / (Ellenfelek összes meccse)
```

**Implementáció**:
1. Csapat összes ellenfelének megkeresése
2. Minden ellenfél győzelmi arányának kiszámítása
3. Átlag számítás súlyozás nélkül
4. Minimum 33.33% (0.3333) garantált

**Példa**:
- Csapat A ellenfelei: B (2-1), C (1-2), D (3-0)
- OMW% = (2+1+3) / (3+3+3) = 6/9 = 66.67%

### 📈 OOMW% Számítás (Opponents' Opponents' Match Win Percentage)

```
OOMW% = Ellenfelek OMW%-ának átlaga
```

**Implementáció**:
1. Csapat összes ellenfelének OMW%-a
2. Átlag számítás
3. Mély tiebreaker komplex szituációkban

---

## 🎪 BYE Rendszer

### 🎯 BYE Feltételek

**Mikor kell BYE**:
- Páratlan számú aktív csapat
- Egy csapat automatikusan "győz" a kör alatt

### 🔄 BYE Elosztási Algoritmus

**1. kör**:
- **Teljesen random** BYE kiválasztás
- Minden csapatnak egyenlő esélye

**2+ kör**:
- **Prioritás sorrend**:
  1. Még nem kapott BYE-t
  2. Legkevesebb pont
  3. Legalacsonyabb OMW%
  4. Legalacsonyabb OOMW%
  5. Alfabetikus sorrend

### 💰 BYE Pontok

- **Alapértelmezett**: 3 pont (priority győzelem értéke)
- **Konfigurálható**: tournament.byePoints változóban
- **Nyomon követés**: Csapatonként BYE számláló

---

## 🔄 Round Robin Rendszer

### 🎯 Alapelv

**Teljes körmérkőzés**: Minden csapat minden csapat ellen pontosan egyszer játszik.

### 📐 Matematikai Alapok

**Meccsek száma**: C(n,2) = n×(n-1)/2
- 4 csapat: 6 meccs
- 6 csapat: 15 meccs
- 8 csapat: 28 meccs

**Körök száma**: n-1 (n = csapatszám)

### 🗓️ Meccs Elosztás

**Algoritmus**:
1. Összes lehetséges párosítás generálása
2. Körök közötti egyenletes elosztás
3. Szekvenciális kör-hozzárendelés

**Példa** (4 csapat):
- **1. kör**: A vs B, C vs D
- **2. kör**: A vs C, B vs D
- **3. kör**: A vs D, B vs C

---

## 👤 Solo Csapat Támogatás

### 🎯 Solo Csapat Koncepció

**Probléma**: Mi történik, ha valaki egyedül akar játszani?
**Megoldás**: NonPlayer placeholder rendszer

### 🔧 Implementáció

**Solo csapat struktúra**:
- **Player 1**: Valós játékos
- **Player 2**: "NonPlayer" (placeholder)
- **isSolo**: true flag

### 🎮 Játék Logika

**Priority kezelés**:
- **Solo játékos**: Mindig priority játékot játszik (3 pont)
- **NonPlayer**: Mindig non-priority játékot "játszik" (2 pont)

**Automatikus eredmények**:
- **NonPlayer vs Valós játékos**: NonPlayer automatikusan veszít
- **Solo játékos vs Valós játékos**: Normál játék a priority asztalon

### 🏆 Verseny Integráció

**Párosítás**:
- Solo csapatok normálisan párosíthatók
- Swiss/Round Robin algoritmusok támogatják
- Nincs speciális kezelés szükséges

**Korlátok**:
- **Csak egy solo csapat** lehet versenyben
- Ha két solo játékos van → egy csapatot kell alkotniuk

---

## ⚙️ Technikai Részletek

### 🏗️ Architektúra

**Moduláris felépítés**:
- **tournament_script.js**: Fő logika
- **tournament_script.test.js**: Comprehensive tesztek (58 teszt)
- **HTML/CSS**: Felhasználói interfész

### 💾 Adatkezelés

**Állapot tárolás**:
- **LocalStorage**: Automatikus mentés
- **JSON format**: Strukturált adatok
- **Hibakezelés**: Korrupt adat helyreállítás

**Fő adatstruktúrák**:
- **Tournament**: Verseny állapot
- **Teams**: Csapatok listája
- **Matches**: Meccsek és eredmények
- **Results**: Játék eredmények

### 🔄 Valós Idejű Frissítések

**Automatikus frissítések**:
- Csapat lista
- Meccs lista
- Rangsor táblázat
- Verseny státusz
- Meccs történet

---

## 🧪 Tesztelés

### 📊 Teszt Lefedettség

**58 átfogó teszt** az alábbi területeken:
- Alapfunkciók (5 teszt)
- Swiss párosítás (2 teszt)
- Meccs kezelés (2 teszt)
- Verseny befejezés (2 teszt)
- Solo csapat kezelés (4 teszt)
- Szélsőséges esetek (4 teszt)
- BYE rendszer (2 teszt)
- Round Robin (6 teszt)
- Csapat kezelés (3 teszt)
- Rangsor számítások (5 teszt)
- Adat perzisztencia (3 teszt)
- Hibakezelés (3 teszt)
- UI manipuláció (13 teszt)
- Fejlett forgatókönyvek (3 teszt)

### 🎯 Kritikus Tesztek

**Nagy verseny teszt**: 16 csapat, 4 kör
**Komplex tiebreaker**: OMW%/OOMW% pontos számítás
**Solo csapat integráció**: Vegyes verseny támogatás

---

## 🚀 Gyors Indítás

### 📥 Telepítés

**1. Opció: Letöltés GitHub-ról**
1. Kattints a zöld "Code" gombra → "Download ZIP"
2. Csomagold ki a ZIP fájlt a kívánt mappába
3. Nyisd meg az `index.html` fájlt bármilyen modern böngészőben

**2. Opció: Repository Klónozása**
```bash
git clone https://github.com/YOUR_USERNAME/onepiece-tcg-tournament-manager.git
cd onepiece-tcg-tournament-manager
# Nyisd meg az index.html fájlt böngészőben
```

### 💻 Alkalmazás Futtatása

**1. Opció: Egyszerű Fájl Megnyitás** (Próbáld ezt először)
1. Töltsd le az összes fájlt egy mappába
2. Nyisd meg az `index.html` fájlt bármilyen modern böngészőben
3. Azonnal használhatod a versenykezelőt!

> **⚠️ Megjegyzés**: Ha CORS hibákat tapasztalsz (főleg Chrome-ban), használd a 3. opciót.

**2. Opció: Helyi Fejlesztői Szerver**
```bash
# Ha telepítve van a Node.js
npm install
npm test  # Opcionális: Tesztek futtatása
# Majd nyisd meg az index.html-t böngészőben
```

**3. Opció: Helyi Szerver** (Ajánlott, ha az 1. opció nem működik)
```bash
# Python használatával (általában előre telepített)
python -m http.server 8000
# Majd látogasd meg: http://localhost:8000

# Vagy Node.js live-server-rel
npx live-server

# Vagy PHP-val (ha elérhető)
php -S localhost:8000
```

### 📋 Követelmények

- **Modern böngésző** (Chrome, Firefox, Safari, Edge)
- **Nincs szükség szerverre** - teljesen böngészőben fut*
- **Nincs szükség internetre** - offline működik
- **Node.js** (opcionális, csak tesztek futtatásához)

> **\*CORS Megjegyzés**: Egyes böngészők (főleg Chrome) helyi szervert igényelhetnek CORS szabályzatok miatt. Lásd a hibaelhárítás részt lentebb.

---

## 🎮 Használati Útmutató

### 📝 Csapat Regisztráció

1. **Normál csapat**: Név + Player 1 + Player 2
2. **Solo csapat**: Név + Player 1 + Solo checkbox
3. **Validáció**: Duplikált nevek ellenőrzése

### 🏁 Verseny Indítás

1. **Minimum 2 csapat** szükséges
2. **Formátum választás**: Swiss/Round Robin
3. **Automatikus első kör** generálás

### 🎮 Meccs Kezelés

1. **Eredmény rögzítés**: Játékonkénti győztes
2. **Automatikus pontszámítás**
3. **Valós idejű rangsor frissítés**

### 🏆 Verseny Befejezés

1. **Automatikus detektálás**: Minden meccs befejezve
2. **Végső rangsor**: OMW%/OOMW% tiebreaker
3. **Statisztikák exportálás**

### 🔧 Hibaelhárítás

**Probléma**: Az alkalmazás nem töltődik be vagy CORS hibákat mutat
**Megoldás**: Használd a 3. opciót (helyi szerver) a közvetlen fájl megnyitás helyett. A Chrome különösen blokkolja a helyi fájl hozzáférést.

**Probléma**: A verseny adatok eltűnnek a böngésző bezárása után
**Megoldás**: Ez normális! Az adatok a böngésző tárhelyen vannak mentve. Használd ugyanazt a böngészőt és megmaradnak.

**Probléma**: A stílus hibás
**Megoldás**: Győződj meg róla, hogy a `tournament_styles.css` ugyanabban a mappában van, mint az `index.html`.

**Probléma**: JavaScript hibák a konzolban
**Megoldás**: Próbálj helyi szervert használni (3. opció) vagy használj Firefox/Safari böngészőt, amelyek megengedőbbek a helyi fájlokkal.

---

## 🔮 Jövőbeli Fejlesztések

### 🎯 Tervezett Funkciók

- **Playoff rendszer**: Top 8 kieséses szakasz
- **Időmérés**: Meccs időkorlátok
- **Statisztika export**: CSV/PDF jelentések
- **Multi-tournament**: Több verseny kezelése
- **Online sync**: Valós idejű szinkronizáció

### 🛠️ Technikai Fejlesztések

- **Performance optimalizáció**: Nagy versenyek (100+ csapat)
- **Mobile responsive**: Teljes mobil támogatás
- **Offline mode**: Internet nélküli működés
- **Backup/Restore**: Verseny mentés/visszaállítás

---

## 📚 Függelékek

### 🔗 Hivatkozások

- **One Piece TCG Official Rules**: Tournament regulations
- **Swiss System**: Chess tournament format adaptation
- **Fisher-Yates Shuffle**: Random pairing algorithm

### 📖 Glosszárium

- **OMW%**: Opponents' Match Win Percentage - Ellenfelek győzelmi aránya
- **OOMW%**: Opponents' Opponents' Match Win Percentage - Ellenfelek ellenfeleinek győzelmi aránya
- **BYE**: Automatikus győzelem páratlan csapatszámnál
- **Priority**: Magasabb pontértékű játék (3 pont vs 2 pont)
- **NonPlayer**: Placeholder solo csapatokban
- **Tiebreaker**: Döntetlen feloldó kritériumok

---

## 🤝 Közreműködés

A közreműködések szívesen fogadottak! Kérlek, nyugodtan nyiss Pull Request-et.

### 🐛 Hibajelentések
- Használd a GitHub Issues-t hibák jelentésére
- Add meg a reprodukálási lépéseket
- Írd le a böngésző és OS információkat

### 💡 Funkció Kérések
- Nyiss issue-t "enhancement" címkével
- Írd le a funkciót és a használati esetet
- Ellenőrizd előbb a meglévő issue-kat

---

## 📄 Licenc

Ez a projekt nyílt forráskódú és [MIT Licenc](LICENSE) alatt érhető el.

---

## ⭐ Támogatás

Ha ez a projekt segített a One Piece TCG versenyeid szervezésében, kérlek adj neki egy ⭐-ot GitHub-on!

---

*Készítette: One Piece TCG Tournament Manager v1.0*
*Utolsó frissítés: 2024* 