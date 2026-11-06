# Plumber Jump — platformer en el navegador

Juego tipo Mario en HTML5 Canvas (JavaScript vanilla, sin dependencias npm para jugar).

## Requisitos

- [Node.js](https://nodejs.org/) (LTS recomendado), para servir los archivos con módulos ES.

No hace falta Python ni `npm install`: el servidor usa solo Node estándar.

## Cómo ejecutar

En PowerShell:

```powershell
cd "C:\Users\Blue People\Documents\Cursor\CursorTrainning\mario-platformer"
npm start
```

Alternativas:

```powershell
node serve.js
```

```powershell
.\serve.ps1
```

```powershell
npx --yes serve .
```

Abre **http://localhost:8080** (puerto por defecto de `serve.js`). Haz clic en el canvas si el teclado no responde.

Si el puerto 8080 está ocupado:

```powershell
$env:PORT=8081; npm start
```

## Controles

| Acción | Teclas |
|--------|--------|
| Mover | `A` / `D` o flechas ← → |
| Saltar | `Espacio`, `W` o ↑ |
| Reiniciar (tras ganar o perder) | `R` |

## Objetivo

Avanza por el nivel, recoge monedas (+50), salta sobre enemigos (+100) y evita golpes laterales. Llega a la **bandera** al final del mapa. Tienes **3 vidas**; caer en un hueco o chocar con un enemigo resta una vida.

## Pantalla en blanco al abrir `index.html`

El juego usa `<script type="module">`. Al abrir el archivo con `file://`, algunos navegadores bloquean la carga por CORS. Usa siempre un servidor local (`npm start`).

## Estructura

- `index.html` — canvas y HUD
- `js/` — lógica del juego
- `serve.js` — servidor estático mínimo
