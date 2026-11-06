---
name: probar-movimiento-jugador
description: Corre pruebas básicas de movimiento del jugador en Super Plumber al cambiar el código de mario-platformer. Use when editing mario-platformer, js-v3 game files, physics, entities, levels, or player controls.
---

# Probar movimiento del jugador

Al cambiar código de `mario-platformer/` (sobre todo `js-v3/`), corre las pruebas de humo **después** de los cambios.

## Cómo correrlas

Desde `mario-platformer/`:

```bash
node --import ./.cursor/skills/probar-movimiento-jugador/scripts/register-loader.mjs ./.cursor/skills/probar-movimiento-jugador/scripts/smoke-player.mjs
```

Desde la raíz del workspace (`CursorTrainning/`):

```bash
node --import ./mario-platformer/.cursor/skills/probar-movimiento-jugador/scripts/register-loader.mjs ./mario-platformer/.cursor/skills/probar-movimiento-jugador/scripts/smoke-player.mjs
```

El script siempre termina con código 0.

## Qué cubre

1. Entrar al nivel uno
2. Hacer el doble salto
3. Caminar hacia la izquierda
4. Caminar hacia la derecha
5. Matar a un adversario
6. Agregar una moneda y verificar que el contador de monedas se actualice

## Si una prueba falla

- Solo **notifica** el resultado (WARN / aviso en consola y en el chat).
- **No pauses ni bloquees el juego.** No cambies `STATE`, no lances excepciones en el loop, no pongas overlays que detengan la partida.
- El juego debe seguir corriendo con normalidad.
- Las fallas se reportan como aviso, no como error que detenga la ejecución.
- No uses `process.exit(1)` ni `throw` que corte el servidor o el frame loop.

## Qué no hacer

- No quites doble salto, meta ni reinicio con R (regla del proyecto).
- No conviertas un fallo de prueba en un crash de gameplay.
