(function () {
  const THEME_KEY = "blockArchitectTheme";
  const RATING_KEY = "blockArchitectRating";

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
      return;
    }

    callback();
  }

  function applyTheme(theme) {
    const isDark = theme === "dark";
    document.body.classList.toggle("theme-dark", isDark);

    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      const icon = button.querySelector(".theme-toggle-icon");
      const label = button.querySelector(".theme-toggle-label");

      if (icon) {
        icon.textContent = isDark ? "☀" : "🌙";
      }

      if (label) {
        label.classList.remove("sr-only");
        label.classList.add("theme-toggle-text");
        label.textContent = isDark ? "Tema claro" : "Tema oscuro";
      }

      button.setAttribute("aria-label", isDark ? "Tema claro" : "Tema oscuro");
      button.setAttribute("title", isDark ? "Tema claro" : "Tema oscuro");
      button.setAttribute("aria-pressed", String(isDark));
    });
  }

  function initThemeToggle() {
    const storedTheme = localStorage.getItem(THEME_KEY) || "light";
    applyTheme(storedTheme);

    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        const nextTheme = document.body.classList.contains("theme-dark") ? "light" : "dark";
        localStorage.setItem(THEME_KEY, nextTheme);
        applyTheme(nextTheme);
      });
    });
  }

  function initReadMoreToggles() {
    document.querySelectorAll("[data-read-toggle]").forEach((button) => {
      const targetId = button.getAttribute("aria-controls");
      const target = document.getElementById(targetId);
      if (!target) return;

      button.addEventListener("click", () => {
        const expanded = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", String(!expanded));
        target.hidden = expanded;
        button.textContent = expanded ? "Leer más" : "Leer menos";
      });
    });
  }

  function initStarRating() {
    document.querySelectorAll(".rating-widget").forEach((widget, widgetIndex) => {
      const ratingId = widget.dataset.ratingId || `default-${widgetIndex}`;
      const buttons = Array.from(widget.querySelectorAll(".star-rating button"));
      const message = widget.querySelector("[data-rating-message]");
      if (!buttons.length) return;

      const labels = {
        1: "Has dado 1 estrella: mejorable.",
        2: "Has dado 2 estrellas: aceptable.",
        3: "Has dado 3 estrellas: buena experiencia.",
        4: "Has dado 4 estrellas: muy buen producto.",
        5: "Has dado 5 estrellas: excelente elección.",
      };

      let currentRating = Number.parseInt(localStorage.getItem(`${RATING_KEY}:${ratingId}`) || "0", 10);

      function paintStars(value) {
        buttons.forEach((button) => {
          const starValue = Number.parseInt(button.dataset.value || "0", 10);
          button.classList.toggle("active", starValue <= value);
        });
      }

      function updateMessage(value) {
        if (!message) return;
        message.textContent = value ? labels[value] : "Pulsa sobre las estrellas para valorar este producto.";
      }

      paintStars(currentRating);
      updateMessage(currentRating);

      buttons.forEach((button) => {
        button.addEventListener("click", () => {
          currentRating = Number.parseInt(button.dataset.value || "0", 10);
          localStorage.setItem(`${RATING_KEY}:${ratingId}`, String(currentRating));
          paintStars(currentRating);
          updateMessage(currentRating);
        });
      });
    });
  }

  onReady(() => {
    initThemeToggle();
    initReadMoreToggles();
    initStarRating();
  });
})();
