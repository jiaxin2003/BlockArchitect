// ================================
// MENÚ, CARRUSELES, ATAJOS Y FOOTER MÓVIL
// ================================
(function () {
  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
      return;
    }

    callback();
  }

  function initMobileMenu() {
    const menuBtn = document.getElementById("menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    let hideMenuTimer = null;

    if (!menuBtn || !mobileMenu) return;

    const closeMenu = () => {
      window.clearTimeout(hideMenuTimer);
      mobileMenu.classList.remove("open");
      mobileMenu.setAttribute("aria-hidden", "true");
      menuBtn.setAttribute("aria-expanded", "false");
      hideMenuTimer = window.setTimeout(() => mobileMenu.classList.add("hidden"), 250);
      menuBtn.innerHTML = '<img src="Imagenes Pagina Web/hamburguesa.png" alt="Menú" class="w-7 h-7" loading="lazy">';
    };

    const openMenu = () => {
      window.clearTimeout(hideMenuTimer);
      mobileMenu.classList.remove("hidden");
      mobileMenu.setAttribute("aria-hidden", "false");
      menuBtn.setAttribute("aria-expanded", "true");
      window.requestAnimationFrame(() => mobileMenu.classList.add("open"));
      menuBtn.innerHTML = '<img src="Imagenes Pagina Web/cerrar.png" alt="Cerrar menú" class="w-7 h-7" loading="lazy">';
    };

    menuBtn.addEventListener("click", () => {
      const isOpen = menuBtn.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("click", (event) => {
      const isOpen = menuBtn.getAttribute("aria-expanded") === "true";
      if (isOpen && !mobileMenu.contains(event.target) && !menuBtn.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuBtn.getAttribute("aria-expanded") === "true") {
        closeMenu();
        menuBtn.focus();
      }
    });
  }

  function initAllCarousels() {
    const carousels = document.querySelectorAll(".carousel");

    carousels.forEach((carousel, index) => {
      if (carousel.dataset.ready === "true") return;
      carousel.dataset.ready = "true";

      carousel.classList.add("flex", "overflow-x-auto", "gap-6", "snap-x", "snap-mandatory", "scroll-smooth", "pb-4");
      carousel.setAttribute("tabindex", "0");
      if (!carousel.hasAttribute("role")) {
        carousel.setAttribute("role", "list");
      }
      carousel.setAttribute("aria-label", `Carrusel ${index + 1}`);

      const items = carousel.querySelectorAll(".carousel-item");
      items.forEach((item) => {
        item.classList.add("flex-shrink-0", "snap-center", "w-64", "md:w-72", "text-center");
        if (!item.hasAttribute("role")) {
          item.setAttribute("role", "listitem");
        }
      });

      const prevBtn = document.getElementById(index === 0 ? "carousel-prev" : `carousel-prev-${index + 1}`);
      const nextBtn = document.getElementById(index === 0 ? "carousel-next" : `carousel-next-${index + 1}`);

      function getScrollAmount() {
        const item = carousel.querySelector(".carousel-item");
        if (!item) return carousel.clientWidth * 0.8;

        return Math.max(item.getBoundingClientRect().width, carousel.clientWidth * 0.6);
      }

      const scrollNext = () => carousel.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
      const scrollPrev = () => carousel.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });

      if (nextBtn) nextBtn.addEventListener("click", scrollNext);
      if (prevBtn) prevBtn.addEventListener("click", scrollPrev);

      carousel.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }

        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        }
      });
    });
  }

  function initFooterAccordion() {
    const toggles = document.querySelectorAll(".footer-toggle");
    if (!toggles.length) return;

    toggles.forEach((btn, index) => {
      if (btn.dataset.ready === "true") return;
      btn.dataset.ready = "true";

      const item = btn.parentElement;
      const content = item.querySelector(".footer-content");
      const arrow = btn.querySelector(".arrow");
      const contentId = `footer-content-${index + 1}`;

      content.id = contentId;
      content.hidden = true;
      content.setAttribute("aria-hidden", "true");
      btn.setAttribute("aria-controls", contentId);
      btn.setAttribute("aria-expanded", "false");

      btn.addEventListener("click", () => {
        const isOpen = btn.getAttribute("aria-expanded") === "true";

        toggles.forEach((otherBtn) => {
          const otherItem = otherBtn.parentElement;
          const otherContent = otherItem.querySelector(".footer-content");
          const otherArrow = otherBtn.querySelector(".arrow");

          otherBtn.setAttribute("aria-expanded", "false");
          otherContent.hidden = true;
          otherContent.setAttribute("aria-hidden", "true");
          otherContent.style.maxHeight = "0px";
          if (otherArrow) otherArrow.style.transform = "rotate(0deg)";
        });

        if (!isOpen) {
          btn.setAttribute("aria-expanded", "true");
          content.hidden = false;
          content.setAttribute("aria-hidden", "false");
          content.style.maxHeight = `${content.scrollHeight}px`;
          if (arrow) arrow.style.transform = "rotate(180deg)";
        }
      });
    });
  }

  function initKeyboardShortcut() {
    document.addEventListener("keydown", (event) => {
      const activeElement = document.activeElement;
      const isWriting = activeElement && (
        activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA" ||
        activeElement.tagName === "SELECT" ||
        activeElement.isContentEditable
      );

      if (isWriting) return;

      if (event.altKey && event.key.toLowerCase() === "t") {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  function initBackToTop() {
    const button = document.getElementById("back-to-top");
    if (!button) return;

    const toggleVisibility = () => {
      const isVisible = window.scrollY > 80;
      button.classList.toggle("is-visible", isVisible);
      button.setAttribute("aria-hidden", String(!isVisible));
    };

    button.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    toggleVisibility();
  }

  function initTabs() {
    const tabLists = document.querySelectorAll('[role="tablist"]');
    if (!tabLists.length) return;

    tabLists.forEach((tabList) => {
      const tabs = Array.from(tabList.querySelectorAll('[role="tab"]'));
      if (!tabs.length) return;

      const activateTab = (selectedTab) => {
        tabs.forEach((tab) => {
          const isSelected = tab === selectedTab;
          const panelId = tab.getAttribute("aria-controls");
          const panel = document.getElementById(panelId);

          tab.classList.toggle("active", isSelected);
          tab.setAttribute("aria-selected", String(isSelected));
          tab.tabIndex = isSelected ? 0 : -1;

          if (panel) {
            panel.hidden = !isSelected;
            panel.classList.toggle("active", isSelected);
          }
        });
      };

      tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => activateTab(tab));

        tab.addEventListener("keydown", (event) => {
          let nextIndex = index;

          if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
          if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
          if (event.key === "Home") nextIndex = 0;
          if (event.key === "End") nextIndex = tabs.length - 1;

          if (nextIndex !== index) {
            event.preventDefault();
            tabs[nextIndex].focus();
            activateTab(tabs[nextIndex]);
          }
        });
      });
    });
  }

  function initNotifications() {
    const buttons = document.querySelectorAll("[data-notify-message]");
    if (!buttons.length) return;

    const container = document.createElement("div");
    container.className = "notification-container";
    container.setAttribute("aria-live", "polite");
    container.setAttribute("aria-atomic", "true");
    document.body.appendChild(container);

    const showNotification = (message, type = "info") => {
      const alert = document.createElement("div");
      alert.className = `site-alert ${type}`;
      alert.setAttribute("role", "status");
      alert.textContent = message;
      container.appendChild(alert);

      window.requestAnimationFrame(() => alert.classList.add("show"));

      window.setTimeout(() => {
        alert.classList.remove("show");
        window.setTimeout(() => alert.remove(), 250);
      }, 2200);
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        showNotification(button.dataset.notifyMessage, button.dataset.notifyType || "info");
      });
    });
  }

  onReady(() => {
    initMobileMenu();
    initAllCarousels();
    initFooterAccordion();
    initKeyboardShortcut();
    initBackToTop();
    initTabs();
    initNotifications();
  });
})();
