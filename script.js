(() => {
  const cities = Array.isArray(window.KURDTOKEN_CITIES) ? window.KURDTOKEN_CITIES : [];
  const map = L.map("kurd-map", { zoomControl: false, tap: true }).setView([37.0, 43.0], 5);
  L.control.zoom({ position: "bottomright" }).addTo(map);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap &copy; CARTO'
  }).addTo(map);

  const layer = L.layerGroup().addTo(map);
  const cityById = new Map(cities.map(c => [String(c.id), c]));
  const details = document.getElementById("city-details");
  const count = document.getElementById("city-count");
  let currentPart = "all";

  function esc(v) {
    return String(v ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }

  function imageFallback(img) {
    img.onerror = () => {
      img.onerror = null;
      img.src = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="500"><rect width="100%" height="100%" fill="#161616"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#ffcc00" font-family="Arial" font-size="34">${esc(img.dataset.city || 'CITY PHOTO')}</text></svg>`
      );
    };
  }

  window.openCity = async function(id) {
    const c = cityById.get(String(id));
    if (!c) return;
    details.classList.remove("empty");
    details.innerHTML = `
      <div class="city-title">
        <div><h3>${esc(c.name_ku)}</h3><span>${esc(c.name_en)}</span></div>
        <span>${esc(c.part)}</span>
      </div>
      <div class="city-photos loading"><div class="photo-loading">وێنەی ڕاستەقینەی شار دەگیرێت…</div></div>
      <p class="city-description">${esc(c.desc_ku)}</p>
      <div class="culture-grid">
        <div class="culture-item"><b>🍲 خواردن</b><span>${esc(c.culture.food)}</span></div>
        <div class="culture-item"><b>👗 جل و بەرگ</b><span>${esc(c.culture.clothing)}</span></div>
        <div class="culture-item"><b>🎵 مۆسیقا</b><span>${esc(c.culture.music)}</span></div>
        <div class="culture-item"><b>📜 مێژوو</b><span>${esc(c.culture.history)}</span></div>
      </div>
      <div class="city-actions">
        <a class="primary" href="#city-details">زیاتر بناسە</a>
        <a href="https://www.openstreetmap.org/?mlat=${c.lat}&mlon=${c.lng}#map=12/${c.lat}/${c.lng}" target="_blank" rel="noopener">لەسەر نەخشە</a>
      </div>
    `;

    const photo = await window.KURDTOKEN_COMMONS.searchOne(c);
    const box = details.querySelector('.city-photos');
    if (photo) {
      box.classList.remove('loading');
      box.innerHTML = `<figure class="city-real-photo"><img src="${photo.url}" data-city="${esc(c.name_en)}" alt="${esc(c.name_ku)} — ${esc(c.name_en)}" loading="lazy"><figcaption>${window.KURDTOKEN_COMMONS.attribution(photo)}</figcaption></figure>`;
      const img = box.querySelector('img');
      img.addEventListener('error', () => imageFallback(img), {once:true});
    } else {
      box.classList.remove('loading');
      box.innerHTML = `<div class="photo-loading">وێنەی ئازاد لە Wikimedia Commons بۆ ئەم شارە لە ئێستا نەدۆزرایەوە.</div>`;
    }
    location.hash = `city-${c.id}`;
  };

  function render(part = "all") {
    currentPart = part;
    layer.clearLayers();
    const visible = cities.filter(c => part === "all" || c.part === part);
    count.textContent = visible.length;

    visible.forEach(c => {
      const marker = L.circleMarker([c.lat, c.lng], {
        radius: 7,
        color: "#ffcc00",
        weight: 2,
        fillColor: "#ffcc00",
        fillOpacity: 0.9
      }).addTo(layer);

      marker.bindPopup(`
        <div dir="rtl">
          <h3 class="popup-title">${esc(c.name_ku)}</h3>
          <div class="popup-part">${esc(c.name_en)} • ${esc(c.part)}</div>
          <p>${esc(c.desc_ku)}</p>
          <button class="popup-btn" onclick="openCity(${c.id}); map.closePopup();">بناسه</button>
        </div>
      `);
    });
  }

  document.querySelectorAll(".filter").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter").forEach(x => x.classList.remove("active"));
      btn.classList.add("active");
      render(btn.dataset.part);
      if (currentPart !== "all") {
        const pts = cities.filter(c => c.part === currentPart).map(c => [c.lat, c.lng]);
        if (pts.length) map.fitBounds(pts, { padding: [25, 25] });
      } else map.setView([37.0, 43.0], 5);
    });
  });

  render();
  const hash = location.hash.match(/^#city-(\d+)$/);
  if (hash) setTimeout(() => openCity(hash[1]), 300);
})();
