export function renderBouquets(items) {
  return items
    .map(
      ({ name, price, image, image2x, alt }) => `
<li class="bouquets-card">
  <div class="bouquets-thumb">
    <img
      src="${image}"
      srcset="${image} 1x, ${image2x} 2x"
      alt="${alt}"
      loading="lazy"
    >
  </div>

  <div class="bouquets-content">
    <h3 class="bouquets-card-title">${name}</h3>
    <p class="bouquets-price">$${price}</p>
  </div>
</li>
`
    )
    .join("");
}