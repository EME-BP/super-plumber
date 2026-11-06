const PREVENT = new Set([
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Space",
  " ",
]);

export function createInput(canvas) {
  const keys = new Set();

  const onKeyDown = (e) => {
    if (PREVENT.has(e.code) || PREVENT.has(e.key)) {
      e.preventDefault();
    }
    keys.add(e.code);
    keys.add(e.key);
  };

  const onKeyUp = (e) => {
    keys.delete(e.code);
    keys.delete(e.key);
  };

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  canvas.addEventListener("click", () => canvas.focus());

  return {
    left() {
      return (
        keys.has("ArrowLeft") ||
        keys.has("KeyA") ||
        keys.has("a")
      );
    },
    right() {
      return (
        keys.has("ArrowRight") ||
        keys.has("KeyD") ||
        keys.has("d")
      );
    },
    jumpPressed() {
      return (
        keys.has("Space") ||
        keys.has(" ") ||
        keys.has("ArrowUp") ||
        keys.has("KeyW") ||
        keys.has("w")
      );
    },
    restart() {
      return keys.has("KeyR") || keys.has("r");
    },
    destroy() {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    },
  };
}
