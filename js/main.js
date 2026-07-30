import { getProducts, getBouquets } from "./api.js";
import { createProductMarkup } from "./render.js";
import { renderBouquets } from "./renderBouquets.js";

(() => {
  // ================= MOBILE MENU =================

  const mobileMenu = document.querySelector(".js-menu-container");
  const openMenuBtn = document.querySelector(".js-open-menu");
  const closeMenuBtns = document.querySelectorAll(".js-close-menu");

  const toggleMenu = () => {
    const isOpen = mobileMenu.classList.toggle("is-open");

    if (openMenuBtn) {
      openMenuBtn.setAttribute("aria-expanded", String(isOpen));
    }
  };

  if (openMenuBtn) {
    openMenuBtn.addEventListener("click", toggleMenu);
  }

  closeMenuBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      if (mobileMenu?.classList.contains("is-open")) {
        toggleMenu();
      }
    });
  });

  window
    .matchMedia("(min-width: 1440px)")
    .addEventListener("change", e => {
      if (!e.matches) return;

      mobileMenu?.classList.remove("is-open");

      if (openMenuBtn) {
        openMenuBtn.setAttribute("aria-expanded", "false");
      }
    });

  // ================= MODALS =================

  const productModal = document.querySelector("[data-modal]");
  const closeProductBtn = document.querySelector("[data-modal-close]");

  const openProductModal = () => {
    productModal?.classList.remove("is-hidden");
  };

  const closeProductModal = () => {
    productModal?.classList.add("is-hidden");
  };

  if (closeProductBtn) {
    closeProductBtn.addEventListener("click", closeProductModal);
  }

  if (productModal) {
    productModal.addEventListener("click", e => {
      if (e.target === productModal) {
        closeProductModal();
      }
    });
  }

  const orderModal = document.querySelector("[data-order-modal]");
  const openOrderBtn = document.querySelector("[data-order-open]");
  const closeOrderBtn = document.querySelector("[data-order-close]");

  const openOrderModal = () => {
    closeProductModal();
    orderModal?.classList.remove("is-hidden");
  };

  const closeOrderModal = () => {
    orderModal?.classList.add("is-hidden");
  };

  if (openOrderBtn) {
    openOrderBtn.addEventListener("click", openOrderModal);
  }

  if (closeOrderBtn) {
    closeOrderBtn.addEventListener("click", closeOrderModal);
  }

  if (orderModal) {
    orderModal.addEventListener("click", e => {
      if (e.target === orderModal) {
        closeOrderModal();
      }
    });
  }

  window.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeProductModal();
      closeOrderModal();
    }
  });

  // ================= PRODUCTS =================

  const productsList = document.querySelector(".products-list");

  (async () => {
    productsList.innerHTML = "<p>Loading...</p>";

    try {
      const products = await getProducts();
        
      productsList.innerHTML = "";

      productsList.insertAdjacentHTML(
        "beforeend",
        createProductMarkup(products)
      );

      const productCards = document.querySelectorAll("[data-modal-open]");

      productCards.forEach(card => {
        card.addEventListener("click", openProductModal);

        card.addEventListener("keydown", e => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openProductModal();
          }
        });
      });

    } catch (error) {
      productsList.innerHTML = "<p>Failed to load products.</p>";
      console.error("Помилка отримання товарів:", error);
    }
  })();

  // ================= BOUQUETS =================

  const bouquetsList = document.querySelector(".bouquets-list");
  const loadMoreBtn = document.querySelector(".bouquets-btn");

  const state = {
    page: 1,
    limit: 8,
    isLastPage: false,
  };

  async function loadBouquets() {
    if (state.isLastPage) return;

    try {
      const bouquets = await getBouquets(state.page, state.limit);

      if (bouquets.length === 0) {
        state.isLastPage = true;
        
        if (loadMoreBtn) {
          loadMoreBtn.style.display = "none";
        }

        if (!bouquetsList.children.length) {
          bouquetsList.innerHTML =
            "<p class='empty-message'>No bouquets found.</p>";
        }

        return;
      }

      bouquetsList.insertAdjacentHTML(
        "beforeend",
        renderBouquets(bouquets)
      );

      if (bouquets.length < state.limit) {
        state.isLastPage = true;
        
        if (loadMoreBtn) {
          loadMoreBtn.style.display = "none";
        }
      } else {
        state.page++;
      }

    } catch (error) {
      bouquetsList.innerHTML =
        "<p class='empty-message'>Failed to load bouquets.</p>";

      if (loadMoreBtn) {
        loadMoreBtn.style.display = "none";
      }

      console.error(error);
    }
  }

  loadBouquets();

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      loadBouquets();
    });
  }

})();