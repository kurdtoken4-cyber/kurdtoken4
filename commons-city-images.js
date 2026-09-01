/* KURDTOKEN — Wikimedia Commons city photo loader */
window.KURDTOKEN_COMMONS = (() => {
  const cache = new Map();
  const api = 'https://commons.wikimedia.org/w/api.php';
  const esc = v => String(v || '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  async function searchMany(city, limit=2){
    const name = city?.names?.en || city?.name_en || city?.name || '';
    const key = name.toLowerCase();
    if(cache.has(key)) return cache.get(key);
    const queries=[`"${name}"`,`${name} city`,`${name} Kurdistan`];
    const results=[]; const seen=new Set();
    for(const q of queries){
      try{
        const u=new URL(api); u.searchParams.set('action','query'); u.searchParams.set('generator','search'); u.searchParams.set('gsrsearch',q); u.searchParams.set('gsrnamespace','6'); u.searchParams.set('gsrlimit','20'); u.searchParams.set('prop','imageinfo'); u.searchParams.set('iiprop','url|extmetadata'); u.searchParams.set('iiurlwidth','1000'); u.searchParams.set('format','json'); u.searchParams.set('origin','*');
        const r=await fetch(u,{mode:'cors'}); if(!r.ok) continue; const data=await r.json();
        for(const p of Object.values(data?.query?.pages||{})){
          const ii=p.imageinfo?.[0]; if(!ii || !(ii.thumburl||ii.url)) continue;
          const title=p.title||''; if(seen.has(title)) continue;
          const lower=title.toLowerCase();
          const score=(lower.includes(name.toLowerCase())?100:0)+(lower.includes('city')?15:0)+(lower.includes('citadel')?10:0);
          seen.add(title); results.push({score,title:title.replace(/^File:/,''),url:ii.thumburl||ii.url,source:`https://commons.wikimedia.org/wiki/${encodeURIComponent(title.replaceAll(' ','_'))}`,author:ii.extmetadata?.Artist?.value||ii.extmetadata?.Credit?.value||'Unknown',license:ii.extmetadata?.LicenseShortName?.value||ii.extmetadata?.License?.value||'See source page'});
        }
      }catch(_){ }
      if(results.length>=limit*2) break;
    }
    results.sort((a,b)=>b.score-a.score); const out=results.slice(0,limit); cache.set(key,out); return out;
  }
  function attribution(photo){ return photo ? `<div class="photo-credit">📷 ${esc(photo.title)}<br>© ${esc(photo.author)} · ${esc(photo.license)} · <a href="${photo.source}" target="_blank" rel="noopener">Wikimedia Commons</a></div>` : ''; }
  return {searchMany, attribution};
})();
