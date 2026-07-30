export function createProductMarkup(products) {
  return products
    .map(
      ({ name, price, image, image2x, alt }) => `
        <li class="product-card" data-modal-open tabindex="0">
          <img
            src="${image}"
            srcset="${image} 1x, ${image2x} 2x"
            alt="${alt}"
            class="product-img"
          />

          <div class="product-info">
            <h3 class="product-name">${name}</h3>
            <p class="product-price">$${price}</p>
          </div>
        </li>
      `
    )
    .join("");
}