import confetti from "canvas-confetti";

export function launchCelebrationConfetti() {
  void confetti({
    particleCount: 150,
    spread: 70,
    zIndex: 9999,
    origin: { y: 0.6 },
  });
}
