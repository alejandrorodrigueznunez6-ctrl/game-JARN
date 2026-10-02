# ⚔️ GAME JARN ⚔️
## RPG de Aventura Épica - Creator: Alejandro

### 🎮 Descripción
Game JARN es un RPG dinámico y entretenido donde el jugador debe derrotar enemigos, recolectar tesoros, subir de nivel y completar misiones épicas. Cuenta con gráficos atractivos, sistema de sonido, inventario y múltiples habilidades mágicas.

### ⭐ Características Principales

✅ **Mapa Dinámico**: Área de juego interactiva con grid y efectos visuales
✅ **Enemigos Móviles**: 5+ enemigos que se mueven hacia el jugador
✅ **Sistema de Combate**: Ataque básico, Fuego Arcano, Curación y Escudo
✅ **Progresión de Nivel**: Sube de nivel ganando experiencia
✅ **Inventario**: Sistema de items y objetos coleccionables
✅ **Tesoros**: Recolecta oro y gemas en el mapa
✅ **Sistema de Misiones**: Completa objetivos principales
✅ **Efectos de Sonido**: Audio dinamicamente generado con Web Audio API
✅ **HUD Completo**: Barras de vida, mana, experiencia
✅ **Registro de Eventos**: Sigue todas tus acciones en tiempo real
✅ **Sistema de Escudo**: Reduce daño recibido temporalmente
✅ **Interfaz Responsiva**: Funciona en desktop, tablet y móvil

### 🕹️ Cómo Jugar

1. Abre `index.html` en tu navegador
2. Presiona "INICIAR AVENTURA" en el menú principal
3. Usa las teclas:
   - **WASD** o **Flechas** para moverte
   - **Botones en pantalla** para usar habilidades

4. Objetivo: Derrotar 15 enemigos y completar la misión

### 🎯 Acciones Disponibles

- **Ataque (🗡️)**: Golpe básico, 15 daño aprox.
- **Fuego Arcano (🔥)**: Hechizo, 25 mana, ~40 daño
- **Curación (💚)**: Recupera 40 HP, 20 mana
- **Escudo (🛡️)**: Reduce daño 50%, 30 mana, 5 seg duración

### 📊 Estadísticas del Jugador

- **Nivel**: Sube ganando EXP
- **HP**: Vida actual
- **Mana**: Energía mágica
- **EXP**: Experiencia hacia el siguiente nivel
- **Oro**: Moneda principal
- **Gemas**: Moneda premium

### 🎨 Tecnologías Utilizadas

- **HTML5**: Estructura y contenido
- **CSS3**: Estilos, animaciones y gradientes
- **JavaScript Vanilla**: Lógica del juego sin dependencias
- **Web Audio API**: Generación de sonido en tiempo real
- **Canvas-like Positioning**: Posicionamiento absoluto para entidades

### 📁 Archivos del Proyecto

```
game-JARN/
├── index.html       # Estructura HTML principal
├── styles.css       # Estilos y animaciones
├── game.js          # Lógica del juego
├── sound.js         # Sistema de sonido
└── README.md        # Este archivo
```

### 🚀 Cómo Ejecutar

**Opción 1: Abrir directamente**
```bash
# Simplemente abre index.html en tu navegador
open index.html
```

**Opción 2: Con servidor local (Python)**
```bash
python -m http.server 8000
# Luego abre http://localhost:8000
```

**Opción 3: Con Node.js**
```bash
npx http-server
# Luego abre http://localhost:8080
```

### 🎮 Controles Rápidos

| Tecla | Acción |
|-------|--------|
| W / ↑ | Arriba |
| S / ↓ | Abajo |
| A / ← | Izquierda |
| D / → | Derecha |
| Click en botones | Usar habilidad |

### 📈 Progresión en el Juego

1. **Nivel 1-3**: Aprende a combatir y usa habilidades básicas
2. **Nivel 4-7**: Los enemigos son más fuertes, necesitas estrategia
3. **Nivel 8+**: Batalla final, derrota a todos los enemigos

### 🔧 Próximas Características (v2.0)

- [ ] Multijugador online con WebSocket
- [ ] Más tipos de enemigos y bosses
- [ ] Sistema de tienda y upgrades
- [ ] Dungeons y áreas diferentes
- [ ] Achievements y rankings
- [ ] Guardado de partida en localStorage
- [ ] Animaciones más fluidas
- [ ] Efectos de partículas
- [ ] Música de fondo

### 👨‍💻 Créditos

**Creator: Alejandro**

Game JARN © 2026 - Todos los derechos reservados

---

¡Gracias por jugar Game JARN! 🎮⚔️🎉