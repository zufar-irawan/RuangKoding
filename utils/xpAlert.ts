import Swal from "sweetalert2";
import confetti from "canvas-confetti";

type XPAlertOptions = {
  xp: number;
  title: string;
  message?: string;
};

export const showXPAlert = ({ xp, title, message }: XPAlertOptions) => {
  // Trigger confetti animation
  const duration = 2000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 200, ticks: 50, zIndex: 9999 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval: NodeJS.Timeout = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    // Confetti from left
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });

    // Confetti from right
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);

  // Show SweetAlert2
  Swal.fire({
    title: title,
    html: `
      <div style="text-align: center;">
        <div style="font-size: 4rem; margin: 1rem 0; animation: bounce 1s infinite;">
          🎉
        </div>
        ${message ? `<p style="font-size: 1.1rem; margin-bottom: 1rem;">${message}</p>` : ""}
        <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 0.75rem 1.5rem; border-radius: 9999px; font-weight: bold; font-size: 1.25rem; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
          <span style="font-size: 1.5rem;">⭐</span>
          <span>+${xp} XP</span>
        </div>
      </div>
      <style>
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      </style>
    `,
    confirmButtonText: "Mantap!",
    confirmButtonColor: "#667eea",
    timer: 5000,
    timerProgressBar: true,
    showClass: {
      popup: "animate__animated animate__fadeInDown",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutUp",
    },
  });
};
