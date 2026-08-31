/* KURDTOKEN — real city photos from Wikimedia Commons
 * The browser requests a real photo for the selected city at runtime.
 * We do not bundle copyrighted images into the repository.
 * Each returned file is accompanied by its author/license/source metadata.
 */
window.KURDTOKEN_COMMONS = (() => {
  const cache = new Map();
  const api = 'https://commons.wikimedia.org/w/api.php';

  function esc(v) {
    return String(v || '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }

  async function searchOne(city) {
    const key = city.name_en;
    if (cache.has(key)) return cache.get(key);
    const queries = [
      `"${city.name_en}"`,
      `${city.name_en} city`,
      `${city.name_en} Kurdistan`
    ];
    for (const q of queries) {
      const url = new URL(api);
      url.searchParams.set('action','query');
      url.searchParams.set('generator','search');
      url.searchParams.set('gsrsearch',q);
      url.searchParams.set('gsrnamespace','6');
      url.searchParams.set('gsrlimit','8');
      url.searchParams.set('prop','imageinfo');
      url.searchParams.set('iiprop','url|extmetadata');
      url.searchParams.set('iiurlwidth','1000');
      url.searchParams.set('format','json');
      url.searchParams.set('origin','*');
      try {
        const r = await fetch(url.toString(), {mode:'cors'});
        if (!r.ok) continue;
        const data = await r.json();
        const pages = Object.values(data?.query?.pages || {});
        const cityLower = city.name_en.toLowerCase();
        const ranked = pages
          .filter(p => p.imageinfo?.[0]?.thumburl || p.imageinfo?.[0]?.url)
          .map(p => {
            const title = String(p.title || '').toLowerCase();
            const score = (title.includes(cityLower) ? 100 : 0) +
              (title.includes('city') ? 10 : 0) +
              (title.includes('street') ? 2 : 0);
            return {p, score};
          })
          .sort((a,b)=>b.score-a.score);
        if (ranked.length) {
          const p = ranked[0].p;
          const ii = p.imageinfo[0];
          const meta = ii.extmetadata || {};
          const result = {
            url: ii.thumburl || ii.url,
            source: `https://commons.wikimedia.org/wiki/${encodeURIComponent(p.title.replaceAll(' ','_'))}`,
            title: p.title.replace(/^File:/,''),
            author: meta.Artist?.value || meta.Credit?.value || 'Unknown',
            license: meta.LicenseShortName?.value || meta.License?.value || 'See source page',
            description: meta.ImageDescription?.value || ''
          };
          cache.set(key,result);
          return result;
        }
      } catch (_) {}
    }
    cache.set(key,null);
    return null;
  }

  function attribution(photo) {
    if (!photo) return '';
    return `<div class="photo-credit">📷 ${esc(photo.title)}<br>© ${esc(photo.author)} · ${esc(photo.license)} · <a href="${photo.source}" target="_blank" rel="noopener">Wikimedia Commons</a></div>`;
  }

  return {searchOne, attribution};
})();
