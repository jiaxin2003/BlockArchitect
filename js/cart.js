(function () {
  const STORAGE_KEY = "blockArchitectCart";
  let memoryCart = [];
  let pendingRemovalId = null;

  const priceFormatter = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  });

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
      return;
    }

    callback();
  }

  function getCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [...memoryCart];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [...memoryCart];
    }
  }

  function saveCart(items) {
    memoryCart = [...items];

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Fallback silencioso a memoria en sesión
    }

    renderAll();
  }

  function getCartCount(items = getCart()) {
    return items.reduce((total, item) => total + item.qty, 0);
  }

  function getCartTotal(items = getCart()) {
    return items.reduce((total, item) => total + (item.price * item.qty), 0);
  }

  function formatPrice(value) {
    return priceFormatter.format(Number(value) || 0);
  }

  function addItem(product) {
    const items = getCart();
    const existingItem = items.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.qty += product.qty;
    } else {
      items.push(product);
    }

    saveCart(items);
  }

  function removeItem(productId) {
    const items = getCart().filter((item) => item.id !== productId);
    saveCart(items);
  }

  function updateItemQuantity(productId, delta) {
    const items = getCart();
    const item = items.find((entry) => entry.id === productId);

    if (!item) return;

    item.qty += delta;

    if (item.qty <= 0) {
      openConfirmModal(productId);
      return;
    }

    saveCart(items);
  }

  function getSelectedQuantity() {
    const quantityElement = document.getElementById("quantity");
    const quantity = Number.parseInt(quantityElement?.textContent || "1", 10);
    return Number.isNaN(quantity) || quantity < 1 ? 1 : quantity;
  }

  function ensureCartUi() {
    if (!document.getElementById("cart-overlay")) {
      document.body.insertAdjacentHTML(
        "beforeend",
        `
          <div id="cart-overlay" class="cart-overlay" hidden></div>
          <aside id="cart-drawer" class="cart-drawer" aria-hidden="true" aria-labelledby="cart-drawer-title" hidden inert>
            <div class="cart-drawer-header">
              <div>
                <h2 id="cart-drawer-title">Tu carrito</h2>
                <p class="cart-drawer-subtitle">Resumen rápido de productos</p>
              </div>
              <button type="button" class="cart-close-btn" aria-label="Cerrar resumen del carrito">×</button>
            </div>
            <div id="cart-drawer-items" class="cart-drawer-items"></div>
            <div class="cart-drawer-footer">
              <p class="cart-total-line">Total: <strong id="cart-drawer-total">0,00 €</strong></p>
              <a href="cart.html" class="cart-link-btn">Ir al carrito completo</a>
            </div>
          </aside>

          <div id="cart-modal" class="cart-modal" aria-hidden="true" hidden>
            <div class="cart-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="cart-modal-title">
              <h2 id="cart-modal-title">Eliminar producto</h2>
              <p>¿Seguro que quieres eliminar este producto del carrito?</p>
              <div class="cart-modal-actions">
                <button type="button" id="cart-modal-cancel" class="cart-modal-cancel">Cancelar</button>
                <button type="button" id="cart-modal-confirm" class="cart-modal-confirm">Eliminar</button>
              </div>
            </div>
          </div>
        `
      );
    }
  }

  function openDrawer() {
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-overlay");
    if (!drawer || !overlay) return;

    renderDrawer();
    drawer.hidden = false;
    drawer.inert = false;
    window.requestAnimationFrame(() => drawer.classList.add("open"));
    drawer.setAttribute("aria-hidden", "false");
    overlay.hidden = false;
    document.body.classList.add("cart-open");
  }

  function closeDrawer() {
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-overlay");
    if (!drawer || !overlay) return;

    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    drawer.inert = true;
    window.setTimeout(() => {
      drawer.hidden = true;
    }, 250);
    overlay.hidden = true;
    document.body.classList.remove("cart-open");
  }

  function openConfirmModal(productId) {
    const modal = document.getElementById("cart-modal");
    if (!modal) return;

    pendingRemovalId = productId;
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    modal.classList.add("open");
  }

  function closeConfirmModal() {
    const modal = document.getElementById("cart-modal");
    if (!modal) return;

    pendingRemovalId = null;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    modal.hidden = true;
  }

  function renderCartBadges(items = getCart()) {
    const count = getCartCount(items);

    document.querySelectorAll("[data-cart-toggle]").forEach((button) => {
      button.style.position = "relative";
      let badge = button.querySelector(".cart-count-badge");

      if (!badge) {
        badge = document.createElement("span");
        badge.className = "cart-count-badge";
        button.appendChild(badge);
      }

      badge.textContent = String(count);
      badge.hidden = count === 0;
    });
  }

  function renderDrawer() {
    const container = document.getElementById("cart-drawer-items");
    const totalElement = document.getElementById("cart-drawer-total");
    if (!container || !totalElement) return;

    const items = getCart();
    totalElement.textContent = formatPrice(getCartTotal(items));

    if (!items.length) {
      container.innerHTML = '<p class="cart-empty-message">Tu carrito está vacío por ahora.</p>';
      return;
    }

    container.innerHTML = items.map((item) => `
      <article class="cart-mini-item">
        <img src="${item.image}" alt="${item.name}" class="cart-mini-image" loading="lazy">
        <div class="cart-mini-content">
          <p class="cart-mini-title">${item.name}</p>
          <p class="cart-mini-meta">${item.qty} × ${formatPrice(item.price)}</p>
        </div>
        <button type="button" class="cart-remove-mini" data-cart-remove="${item.id}" aria-label="Eliminar ${item.name}">✕</button>
      </article>
    `).join("");
  }

  function renderCartPage() {
    const list = document.getElementById("cart-page-items");
    const total = document.getElementById("cart-page-total");
    const emptyState = document.getElementById("cart-empty-state");
    const page = document.getElementById("cart-page");

    if (!list || !total || !page) return;

    const items = getCart();
    total.textContent = formatPrice(getCartTotal(items));

    if (!items.length) {
      list.innerHTML = "";
      if (emptyState) emptyState.hidden = false;
      return;
    }

    if (emptyState) emptyState.hidden = true;

    list.innerHTML = items.map((item) => `
      <div class="cart-row">
        <div class="cart-product-info">
          <img src="${item.image}" alt="${item.name}" class="cart-product-image" loading="lazy">
          <div>
            <h3>${item.name}</h3>
            <p>Precio por unidad: ${formatPrice(item.price)}</p>
          </div>
        </div>
        <div class="cart-qty-controls" aria-label="Cantidad de ${item.name}">
          <button type="button" data-cart-qty="-1" data-cart-id="${item.id}" aria-label="Reducir cantidad de ${item.name}">−</button>
          <span>${item.qty}</span>
          <button type="button" data-cart-qty="1" data-cart-id="${item.id}" aria-label="Aumentar cantidad de ${item.name}">+</button>
        </div>
        <p class="cart-row-subtotal">${formatPrice(item.price * item.qty)}</p>
        <button type="button" class="cart-row-remove" data-cart-remove="${item.id}">Eliminar</button>
      </div>
    `).join("");
  }

  function renderAll() {
    renderCartBadges();
    renderDrawer();
    renderCartPage();
  }

  function initProductQuantityControls() {
    const quantityElement = document.getElementById("quantity");
    const decreaseButton = document.querySelector('[aria-label="Disminuir cantidad"]');
    const increaseButton = document.querySelector('[aria-label="Aumentar cantidad"]');

    if (!quantityElement || !decreaseButton || !increaseButton) return;

    const updateDisplay = (nextValue) => {
      quantityElement.textContent = String(Math.max(1, nextValue));
    };

    decreaseButton.addEventListener("click", () => {
      updateDisplay(getSelectedQuantity() - 1);
    });

    increaseButton.addEventListener("click", () => {
      updateDisplay(getSelectedQuantity() + 1);
    });
  }

  function initCartEvents() {
    document.addEventListener("click", (event) => {
      const toggleButton = event.target.closest("[data-cart-toggle]");
      if (toggleButton) {
        event.preventDefault();
        openDrawer();
        return;
      }

      const addButton = event.target.closest("[data-cart-add]");
      if (addButton) {
        const quantity = addButton.dataset.usePageQuantity === "true" ? getSelectedQuantity() : 1;
        addItem({
          id: addButton.dataset.cartId,
          name: addButton.dataset.cartName,
          price: Number.parseFloat(addButton.dataset.cartPrice || "0"),
          image: addButton.dataset.cartImage,
          qty: quantity,
        });
        return;
      }

      const removeButton = event.target.closest("[data-cart-remove]");
      if (removeButton) {
        event.preventDefault();
        openConfirmModal(removeButton.dataset.cartRemove);
        return;
      }

      const quantityButton = event.target.closest("[data-cart-qty]");
      if (quantityButton) {
        event.preventDefault();
        updateItemQuantity(quantityButton.dataset.cartId, Number(quantityButton.dataset.cartQty));
        return;
      }

      if (event.target.closest(".cart-close-btn") || event.target.id === "cart-overlay") {
        closeDrawer();
      }

      if (event.target.id === "cart-modal-cancel") {
        closeConfirmModal();
      }

      if (event.target.id === "cart-modal-confirm" && pendingRemovalId) {
        removeItem(pendingRemovalId);
        closeConfirmModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeDrawer();
        closeConfirmModal();
      }
    });
  }

  onReady(() => {
    ensureCartUi();
    initProductQuantityControls();
    initCartEvents();
    renderAll();
  });
})();
