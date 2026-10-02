const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PLAYER_SPEED = 5;
const ENEMY_COUNT = 5;
const TREASURE_COUNT = 3;

class Game {
  constructor() {
    this.state = 'menu';
    this.player = {
      x: GAME_WIDTH / 2,
      y: GAME_HEIGHT / 2,
      hp: 100,
      maxHp: 100,
      mana: 100,
      maxMana: 100,
      exp: 0,
      expToNext: 100,
      level: 1,
      gold: 0,
      gems: 0,
      inventory: ['Espada Brillante', 'Poción de Vida', 'Cristal Mágico', 'Amuleto Antiguo', 'Pergamino de Fuego'],
      shield: false,
      shieldTime: 0
    };
    this.enemies = [];
    this.treasures = [];
    this.log = ['Bienvenido a Game JARN', 'Creator: Alejandro', '¡Prepárate para la aventura!'];
    this.keys = {};
    this.questKills = 0;
    this.questGoal = 15;
    this.gameRunning = false;
    this.init();
  }

  init() {
    this.render();
    document.addEventListener('keydown', (e) => this.keys[e.key] = true);
    document.addEventListener('keyup', (e) => this.keys[e.key] = false);
    window.addEventListener('resize', () => this.render());
  }

  addLog(msg, type = 'default') {
    this.log.unshift(msg);
    this.log = this.log.slice(0, 20);
    playSound('log');
  }

  startGame() {
    this.state = 'game';
    this.gameRunning = true;
    this.createEnemies();
    this.createTreasures();
    this.addLog('¡La aventura comienza!');
    this.gameLoop();
  }

  createEnemies() {
    this.enemies = [];
    for (let i = 0; i < ENEMY_COUNT; i++) {
      this.enemies.push({
        x: Math.random() * (GAME_WIDTH - 100) + 50,
        y: Math.random() * (GAME_HEIGHT - 100) + 50,
        hp: 30 + i * 10,
        maxHp: 30 + i * 10,
        speed: 1 + Math.random() * 1.5,
        damage: 5 + i,
        id: i,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2
      });
    }
  }

  createTreasures() {
    this.treasures = [];
    for (let i = 0; i < TREASURE_COUNT; i++) {
      this.treasures.push({
        x: Math.random() * (GAME_WIDTH - 50) + 25,
        y: Math.random() * (GAME_HEIGHT - 50) + 25,
        gold: 25 + Math.random() * 50,
        gems: Math.random() > 0.7 ? 1 : 0,
        id: i
      });
    }
  }

  updatePlayer() {
    if (this.keys['ArrowUp'] || this.keys['w']) this.player.y -= PLAYER_SPEED;
    if (this.keys['ArrowDown'] || this.keys['s']) this.player.y += PLAYER_SPEED;
    if (this.keys['ArrowLeft'] || this.keys['a']) this.player.x -= PLAYER_SPEED;
    if (this.keys['ArrowRight'] || this.keys['d']) this.player.x += PLAYER_SPEED;

    this.player.x = Math.max(20, Math.min(GAME_WIDTH - 20, this.player.x));
    this.player.y = Math.max(20, Math.min(GAME_HEIGHT - 20, this.player.y));

    if (this.player.shield) {
      this.player.shieldTime--;
      if (this.player.shieldTime <= 0) {
        this.player.shield = false;
      }
    }
  }

  updateEnemies() {
    this.enemies = this.enemies.filter(e => e.hp > 0);

    this.enemies.forEach(enemy => {
      const dx = this.player.x - enemy.x;
      const dy = this.player.y - enemy.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 0) {
        enemy.x += (dx / dist) * enemy.speed;
        enemy.y += (dy / dist) * enemy.speed;
      }

      if (dist < 40) {
        const damage = this.player.shield ? enemy.damage / 2 : enemy.damage;
        this.player.hp -= damage;
        if (this.player.hp < 0) this.player.hp = 0;
      }
    });
  }

  checkCollisions() {
    this.enemies.forEach(enemy => {
      const dx = this.player.x - enemy.x;
      const dy = this.player.y - enemy.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
    });

    this.treasures = this.treasures.filter(treasure => {
      const dx = this.player.x - treasure.x;
      const dy = this.player.y - treasure.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 35) {
        this.player.gold += treasure.gold;
        this.player.gems += treasure.gems;
        this.addLog(`¡Encontraste ${treasure.gold.toFixed(0)} de oro!`, 'success');
        playSound('coin');
        return false;
      }
      return true;
    });
  }

  attack() {
    let targetEnemy = null;
    let minDist = Infinity;

    this.enemies.forEach(enemy => {
      const dx = this.player.x - enemy.x;
      const dy = this.player.y - enemy.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < minDist) {
        minDist = dist;
        targetEnemy = enemy;
      }
    });

    if (targetEnemy && minDist < 150) {
      const damage = 15 + Math.floor(Math.random() * 15);
      targetEnemy.hp -= damage;
      this.addLog(`¡Ataque básico! ${damage} de daño.`, 'success');
      playSound('attack');

      if (targetEnemy.hp <= 0) {
        this.questKills++;
        this.player.exp += 30;
        this.player.gold += 15;
        this.addLog(`¡Enemigo derrotado! +30 EXP`, 'success');
        this.checkLevelUp();
      }
    } else {
      this.addLog('No hay enemigos cerca.');
    }
  }

  castFireBolt() {
    if (this.player.mana < 25) {
      this.addLog('Mana insuficiente para Fuego Arcano.', 'warning');
      return;
    }

    this.player.mana -= 25;
    let targetEnemy = null;
    let minDist = Infinity;

    this.enemies.forEach(enemy => {
      const dx = this.player.x - enemy.x;
      const dy = this.player.y - enemy.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < minDist) {
        minDist = dist;
        targetEnemy = enemy;
      }
    });

    if (targetEnemy) {
      const damage = 40 + Math.floor(Math.random() * 30);
      targetEnemy.hp -= damage;
      this.addLog(`¡Fuego Arcano! ${damage} de daño explosivo.`, 'success');
      playSound('spell');

      if (targetEnemy.hp <= 0) {
        this.questKills++;
        this.player.exp += 50;
        this.player.gold += 20;
        this.addLog(`¡Enemigo incinerated! +50 EXP`, 'success');
        this.checkLevelUp();
      }
    }
  }

  heal() {
    if (this.player.mana < 20) {
      this.addLog('Mana insuficiente para curación.', 'warning');
      return;
    }

    this.player.mana -= 20;
    const healAmount = 40;
    this.player.hp = Math.min(this.player.maxHp, this.player.hp + healAmount);
    this.addLog(`¡Curación! +${healAmount} HP.`, 'success');
    playSound('heal');
  }

  shield() {
    if (this.player.mana < 30) {
      this.addLog('Mana insuficiente para escudo.', 'warning');
      return;
    }

    this.player.mana -= 30;
    this.player.shield = true;
    this.player.shieldTime = 300;
    this.addLog('¡Escudo mágico activado! Defensa aumentada 50%.', 'success');
    playSound('shield');
  }

  checkLevelUp() {
    if (this.player.exp >= this.player.expToNext) {
      this.player.level++;
      this.player.exp -= this.player.expToNext;
      this.player.expToNext += 50;
      this.player.maxHp += 15;
      this.player.maxMana += 15;
      this.player.hp = this.player.maxHp;
      this.player.mana = this.player.maxMana;
      this.addLog(`¡SUBISTE DE NIVEL! Ahora eres nivel ${this.player.level}!`, 'success');
      playSound('levelup');
    }

    if (this.questKills >= this.questGoal) {
      this.addLog('¡MISIÓN COMPLETADA! ¡Has vencido a todos los enemigos!', 'success');
      this.player.gems += 10;
      this.gameRunning = false;
    }
  }

  gameLoop() {
    if (!this.gameRunning) return;

    this.updatePlayer();
    this.updateEnemies();
    this.checkCollisions();
    this.render();

    if (this.player.hp <= 0) {
      this.addLog('¡Has sido derrotado! Regresando al menú...', 'error');
      setTimeout(() => this.goToMenu(), 2000);
      return;
    }

    requestAnimationFrame(() => this.gameLoop());
  }

  goToMenu() {
    this.state = 'menu';
    this.gameRunning = false;
    this.player = {
      x: GAME_WIDTH / 2,
      y: GAME_HEIGHT / 2,
      hp: 100,
      maxHp: 100,
      mana: 100,
      maxMana: 100,
      exp: 0,
      expToNext: 100,
      level: 1,
      gold: 0,
      gems: 0,
      inventory: ['Espada Brillante', 'Poción de Vida', 'Cristal Mágico', 'Amuleto Antiguo', 'Pergamino de Fuego'],
      shield: false,
      shieldTime: 0
    };
    this.questKills = 0;
    this.log = ['Bienvenido a Game JARN', 'Creator: Alejandro'];
    this.render();
  }

  render() {
    const root = document.getElementById('root');
    root.innerHTML = '';

    if (this.state === 'menu') {
      root.innerHTML = `
        <div class="menu-screen">
          <div class="menu-content">
            <div class="menu-logo">⚔️🎮🛡️</div>
            <div class="menu-title">GAME JARN</div>
            <div class="menu-subtitle">RPG de Aventura Épica</div>
            <div class="menu-creator">Creator: Alejandro</div>
            <div class="menu-buttons">
              <button class="btn" onclick="window.game.startGame()">INICIAR AVENTURA</button>
              <button class="btn" onclick="alert('Características:\n• Mapa dinámico\n• 5+ enemigos\n• Sistema de misiones\n• Inventario\n• Efectos de sonido\n• Múltiples habilidades')">CARACTERÍSTICAS</button>
              <button class="btn" onclick="alert('Game JARN v1.0\nCreador: Alejandro\nRPG Online Multiplayer Ready\n© 2026 - Todos los derechos reservados')">CRÉDITOS</button>
            </div>
            <div class="menu-info">
              <p>Usa las flechas o WASD para moverte</p>
              <p>Presiona los botones para atacar, hechizar, sanar y defenderte</p>
            </div>
          </div>
        </div>
      `;
    } else if (this.state === 'game') {
      const hpPercent = (this.player.hp / this.player.maxHp) * 100;
      const manaPercent = (this.player.mana / this.player.maxMana) * 100;
      const expPercent = (this.player.exp / this.player.expToNext) * 100;
      const questPercent = (this.questKills / this.questGoal) * 100;

      root.innerHTML = `
        <div class="game-screen">
          <div class="game-header">
            <div class="header-title">⚔️ GAME JARN - Nivel ${this.player.level}</div>
            <div class="header-stats">
              <div class="stat-item">
                <div class="stat-label">HP</div>
                <div class="stat-bar">
                  <div class="stat-bar-fill" style="width: ${hpPercent}%"></div>
                </div>
                <div class="stat-value">${Math.floor(this.player.hp)}/${this.player.maxHp}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">MANA</div>
                <div class="stat-bar">
                  <div class="stat-bar-fill" style="width: ${manaPercent}%"></div>
                </div>
                <div class="stat-value">${Math.floor(this.player.mana)}/${this.player.maxMana}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">EXP</div>
                <div class="stat-bar">
                  <div class="stat-bar-fill" style="width: ${expPercent}%"></div>
                </div>
                <div class="stat-value">${Math.floor(this.player.exp)}/${this.player.expToNext}</div>
              </div>
              <div class="stat-item">
                <div class="stat-value" style="color: #ffd700; font-size: 1.4rem;">💰 ${Math.floor(this.player.gold)} 💎 ${this.player.gems}</div>
              </div>
            </div>
          </div>

          <div class="map-area">
            <div class="game-map">
              <!-- Enemigos -->
              ${this.enemies.map(e => `
                <div class="entity enemy" style="left: ${e.x}px; top: ${e.y}px;">
                  👹
                  <div class="health-bar">
                    <div class="health-fill" style="width: ${(e.hp / e.maxHp) * 100}%"></div>
                  </div>
                </div>
              `).join('')}
              <!-- Tesoros -->
              ${this.treasures.map(t => `
                <div class="entity treasure" style="left: ${t.x}px; top: ${t.y}px;">💰</div>
              `).join('')}
              <!-- Jugador -->
              <div class="entity player" style="left: ${this.player.x}px; top: ${this.player.y}px;">
                ${this.player.shield ? '🛡️' : '⚔️'}
              </div>
            </div>
          </div>

          <div class="side-panel">
            <div class="panel quest-panel">
              <div class="panel-title">📜 MISIÓN</div>
              <div class="quest-info">
                <p><strong>Derrota de los Oscuros</strong></p>
                <p>Enemigos derrotados: ${this.questKills}/${this.questGoal}</p>
                <div class="stat-bar" style="margin-top: 8px;">
                  <div class="stat-bar-fill" style="width: ${questPercent}%"></div>
                </div>
              </div>
            </div>

            <div class="panel inventory-panel">
              <div class="panel-title">🎒 INVENTARIO</div>
              <div class="inventory-grid">
                ${this.player.inventory.map((item, i) => `
                  <div class="inventory-item" title="${item}">
                    <div>${['🗡️', '🧪', '📜', '💎', '🔥'][i % 5]}</div>
                    <div style="font-size: 0.7rem; margin-top: 3px;">${item.substring(0, 8)}...</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="panel actions-panel">
              <div class="panel-title">⚡ ACCIONES</div>
              <div class="action-buttons">
                <button class="action-btn" onclick="window.game.attack()">🗡️ ATAQUE (15 dmg)</button>
                <button class="action-btn" onclick="window.game.castFireBolt()">🔥 FUEGO (25 mana)</button>
                <button class="action-btn" onclick="window.game.heal()">💚 CURACIÓN (20 mana)</button>
                <button class="action-btn" onclick="window.game.shield()">🛡️ ESCUDO (30 mana)</button>
              </div>
            </div>

            <div class="panel log-panel">
              <div class="panel-title">📝 REGISTRO</div>
              <div class="log-content">
                ${this.log.map((msg, i) => `
                  <div class="log-message ${msg.includes('¡') ? 'success' : msg.includes('No') ? 'warning' : msg.includes('sido') ? 'error' : ''}">
                    ${msg}
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="controls">
              <button class="btn" onclick="window.game.goToMenu()" style="width: 100%; padding: 8px;">← MENÚ</button>
              <div class="controls-info">
                <p>Muévete con WASD o Flechas</p>
                <p>Usa los botones para atacar</p>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }
}

window.game = new Game();