/* KURDTOKEN — single language system + local city browser + fixed countdown */
(() => {
  const LANGS = ['ku','fa','en','tr','ar'];
  const LANG_KEY = 'kurdtoken-lang';
  const labels = {
    ku:{close:'داخستن',country:'وڵات',history:'پێشینە',attractions:'شوێنە سەیرانەکان',image:'وێنەی شار'},
    fa:{close:'بستن',country:'کشور',history:'پیشینه',attractions:'دیدنی‌ها',image:'تصویر شهر'},
    en:{close:'Close',country:'Country',history:'History',attractions:'Attractions',image:'City image'},
    tr:{close:'Kapat',country:'Ülke',history:'Tarihçe',attractions:'Gezilecek yerler',image:'Şehir görseli'},
    ar:{close:'إغلاق',country:'الدولة',history:'التاريخ',attractions:'المعالم',image:'صورة المدينة'}
  };
  const titles = {
    ku:'KURDTOKEN | کوردستان', fa:'KURDTOKEN | کردستان', en:'KURDTOKEN | Kurdistan',
    tr:'KURDTOKEN | Kürdistan', ar:'KURDTOKEN | كردستان'
  };
  let lang = localStorage.getItem(LANG_KEY);
  if (!LANGS.includes(lang)) lang = document.documentElement.lang && LANGS.includes(document.documentElement.lang) ? document.documentElement.lang : 'ku';
  let activePart = null;
  let activeCity = null;

  function applyLanguage(next) {
    lang = LANGS.includes(next) ? next : 'ku';
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'en' || lang === 'tr') ? 'ltr' : 'rtl';
    document.title = titles[lang];
    document.querySelectorAll(`[data-${lang}]`).forEach(el => el.textContent = el.getAttribute(`data-${lang}`));
    document.querySelectorAll(`[data-alt-${lang}]`).forEach(el => el.alt = el.getAttribute(`data-alt-${lang}`));
    const select = document.getElementById('language');
    if (select) select.value = lang;
    refreshFourParts();
    if (activePart) renderPart(activePart, false);
  }

  function refreshFourParts() {
    document.querySelectorAll('[data-four-parts-widget]').forEach(widget => {
      const sectionKey = widget.closest('[data-cultural-section]')?.dataset.culturalSection || 'culture';
      widget.querySelectorAll('.four-part-btn').forEach(btn => {
        const value = btn.getAttribute(`data-${lang}`);
        if (value) btn.textContent = value;
      });
      const active = widget.querySelector('.four-part-btn.active');
      if (active) renderFourPart(widget, sectionKey, active.dataset.region, false);
    });
  }

  const regionNames = {
    east:{ku:'ڕۆژهەڵات',fa:'روژهلات',en:'Rojhelat',tr:'Rojhelat',ar:'روج هلات'},
    north:{ku:'باکوور',fa:'باکوور',en:'Bakur',tr:'Bakur',ar:'باكور'},
    south:{ku:'باشوور',fa:'باشور',en:'Başûr',tr:'Başûr',ar:'باشور'},
    west:{ku:'ڕۆژئاوا',fa:'روژئاوا',en:'Rojava',tr:'Rojava',ar:'روج آفا'}
  };
  const sectionText = {
    places:{ku:'شوێنە مێژوویی و سروشتییەکان و شارە گرنگەکانی ئەم ناوچەیە بە پەیوەندیی جۆگرافیایی و مێژوویی ناسێنراون.',fa:'مکان‌های تاریخی، طبیعی و شهرهای مهم این بخش با زمینه جغرافیایی و تاریخی معرفی می‌شوند.',en:'Important cities and historical or natural places in this region are presented with geographic and historical context.',tr:'Bu bölgenin önemli şehirleri ile tarihî ve doğal alanları coğrafi ve tarihî bağlamıyla tanıtılır.',ar:'تُعرّف المدن المهمة والمواقع التاريخية والطبيعية في هذه المنطقة ضمن سياق جغرافي وتاريخي.'},
    people:{ku:'شاعیران، زانایان، مێژووناسان و هونەرمەندانی ناوچەکە بە پشتبەستن بە سەرچاوەی باوەڕپێکراو ناسێنراون.',fa:'شاعران، دانشمندان، تاریخ‌نگاران و هنرمندان این بخش بر پایه منابع معتبر معرفی می‌شوند.',en:'Poets, scholars, historians and artists associated with this region are presented using reliable sources.',tr:'Bu bölgeyle ilişkili şairler, bilginler, tarihçiler ve sanatçılar güvenilir kaynaklarla tanıtılır.',ar:'تُعرض الشخصيات الأدبية والعلمية والتاريخية والفنية المرتبطة بهذه المنطقة بالاعتماد على مصادر موثوقة.'},
    music:{ku:'میراثی دنگبێژی، گۆرانیی نەریتی و مۆسیقای نوێی ناوچەکە بە جیاوازیی کەلتووری ناسێنراوە.',fa:'میراث دنگ‌بێژی، موسیقی سنتی و موسیقی معاصر این بخش با توجه به تنوع فرهنگی معرفی می‌شود.',en:'Dengbêj traditions, traditional music and contemporary artists of the region are presented in their cultural context.',tr:'Bölgenin dengbêj geleneği, geleneksel müziği ve çağdaş sanatçıları kültürel bağlamıyla tanıtılır.',ar:'تُعرض تقاليد الدنغبج والموسيقى التقليدية والفنانون المعاصرون في المنطقة ضمن سياقهم الثقافي.'},
    handicrafts:{ku:'قالین، جاجم، بافت و پیشەسازییە دەستییەکان بە پەیوەندیی ناوچە و شێوازی کارکردن ناسێنراون.',fa:'قالی، جاجیم، بافته‌ها و صنایع دستی با توجه به تفاوت‌های منطقه‌ای معرفی می‌شوند.',en:'Carpets, jajim, textiles and other crafts are presented with attention to regional techniques and traditions.',tr:'Halı, jajim, dokuma ve diğer el sanatları bölgesel teknik ve geleneklerle birlikte tanıtılır.',ar:'تُعرض السجاد والجاجيم والمنسوجات والحرف اليدوية مع إبراز التقنيات والتقاليد الإقليمية.'},
    clothing:{ku:'جل و بەرگی ژن و پیاوی کورد بە شێوەی جیاواز لە هەر ناوچەیەکدا ناسێنراوە.',fa:'پوشاک زنان و مردان کرد با تفاوت‌های منطقه‌ای هر بخش معرفی می‌شود.',en:'Kurdish women’s and men’s clothing is presented according to the distinctive style of each region.',tr:'Kürt kadın ve erkek kıyafetleri her bölgenin kendine özgü tarzına göre tanıtılır.',ar:'تُعرض ملابس النساء والرجال الكرد وفق الأنماط المميزة لكل منطقة.'},
    food:{ku:'خواردن و شیرینی و شێوازی چێشتلێنان بە پەیوەندیی بەرهەم و نەریتی ناوچەکە ناسێنراوە.',fa:'غذاها، شیرینی‌ها و شیوه‌های آشپزی با توجه به مواد و سنت‌های هر منطقه معرفی می‌شوند.',en:'Foods, sweets and cooking traditions are presented according to local ingredients and regional customs.',tr:'Yemekler, tatlılar ve pişirme gelenekleri yerel malzemeler ve bölgesel adetlerle tanıtılır.',ar:'تُعرض الأطعمة والحلويات وتقاليد الطبخ وفق المكونات المحلية والعادات الإقليمية.'},
    languages:{ku:'زمان و شێوەزارەکانی ناوچەکە بە پەیوەندیی مێژوویی و کۆمەڵایەتی ناسێنراون.',fa:'زبان‌ها و گونه‌های زبانی این بخش در زمینه تاریخی و اجتماعی معرفی می‌شوند.',en:'The languages and varieties used in this region are presented in their historical and social context.',tr:'Bu bölgede kullanılan diller ve dil çeşitleri tarihî ve toplumsal bağlamıyla tanıtılır.',ar:'تُعرض اللغات والتنوعات اللغوية المستخدمة في هذه المنطقة ضمن سياقها التاريخي والاجتماعي.'},
    culture:{ku:'میراثی مێژوویی و کەلتووری ناوچەکە لەگەڵ شار، زمان، هونەر و نەریتەکانیدا ناسێنراوە.',fa:'میراث تاریخی و فرهنگی این بخش همراه با شهرها، زبان، هنر و سنت‌ها معرفی می‌شود.',en:'The region’s historical and cultural heritage is presented together with its cities, language, arts and traditions.',tr:'Bölgenin tarihî ve kültürel mirası şehirleri, dili, sanatı ve gelenekleriyle birlikte tanıtılır.',ar:'يُعرض التراث التاريخي والثقافي للمنطقة مع مدنها ولغتها وفنونها وتقاليدها.'}
  };

  function renderFourPart(widget, key, region, scroll) {
    const btn = widget.querySelector(`.four-part-btn[data-region="${region}"]`);
    if (!btn) return;
    widget.querySelectorAll('.four-part-btn').forEach(b => { b.classList.toggle('active', b === btn); b.setAttribute('aria-selected', b === btn ? 'true' : 'false'); });
    const detail = widget.querySelector('.four-parts-detail');
    widget.querySelector('.four-parts-detail-title').textContent = regionNames[region]?.[lang] || region;
    widget.querySelector('.four-parts-detail-text').textContent = sectionText[key]?.[lang] || '';
    detail.hidden = false;
    if (scroll) widget.scrollIntoView({behavior:'smooth', block:'nearest'});
  }

  function cityName(city) {
    return city.names?.[lang] || city.names?.en || city.name;
  }
  function cityImageFallback(city, variant) {
    return `assets/cities/${encodeURIComponent(city.name)}-${variant}.png`;
  }

  function initCities() {
    const host = document.getElementById('regionCities');
    if (!host || !Array.isArray(window.KURD_CITIES)) return;
    const buttons = [...document.querySelectorAll('.region-card')];
    const grouped = {};
    window.KURD_CITIES.forEach(city => (grouped[city.part] ||= []).push(city));

    window.__showKurdPart = (part, scroll = true) => renderPart(part, scroll);
    function renderPart(part, scroll = true) {
      activePart = part;
      host.hidden = false;
      host.innerHTML = '';
      const cities = grouped[part] || [];
      const title = document.createElement('div'); title.className='region-cities-head';
      const h = document.createElement('h3'); h.textContent = ({'ڕۆژهەڵات':regionNames.east,'باکوور':regionNames.north,'باشوور':regionNames.south,'ڕۆژئاوا':regionNames.west}[part]?.[lang] || part); title.appendChild(h);
      const close = document.createElement('button'); close.type='button'; close.className='close-region'; close.textContent='×'; close.setAttribute('aria-label', labels[lang].close);
      close.onclick=()=>{ activePart=null; activeCity=null; host.hidden=true; host.innerHTML=''; buttons.forEach(b=>b.classList.remove('active')); };
      title.appendChild(close); host.appendChild(title);
      const list=document.createElement('div'); list.className='city-list';
      cities.forEach(city=>{
        const b=document.createElement('button'); b.type='button'; b.className='city-name'; b.textContent=cityName(city);
        if(activeCity && activeCity.name===city.name) b.classList.add('active');
        b.onclick=()=>renderCity(city,b); list.appendChild(b);
      });
      host.appendChild(list);
      buttons.forEach(b=>b.classList.toggle('active', b.dataset.part===part));
      if(activeCity && activeCity.part===part) renderCity(activeCity, host.querySelector('.city-name.active'), false);
      if(scroll) host.scrollIntoView({behavior:'smooth',block:'start'});
    }
    function renderCity(city, clicked, scroll=true) {
      activeCity=city;
      const old=host.querySelector('.city-detail'); if(old) old.remove();
      const detail=document.createElement('article'); detail.className='city-detail';
      const gallery=document.createElement('div'); gallery.className='city-gallery';
      [0,1].forEach(i=>{
        const img=document.createElement('img');
        const src=city.images?.[i] || cityImageFallback(city,i+1);
        img.src=src; img.alt=`${labels[lang].image}: ${cityName(city)}`; img.loading='lazy';
        img.onerror=()=>{ img.onerror=null; img.src=cityImageFallback(city,i+1); };
        gallery.appendChild(img);
      });
      const body=document.createElement('div'); body.className='city-detail-body';
      const h=document.createElement('h4'); h.textContent=cityName(city); body.appendChild(h);
      const key={east:'east',north:'north',south:'south',west:'west'}[city.part] || Object.keys(regionNames).find(k=>regionNames[k].ku===city.part);
      const p1=document.createElement('p'); p1.innerHTML=`<b>${labels[lang].country}:</b> ${({'east':{ku:'ئێران',fa:'ایران',en:'Iran',tr:'İran',ar:'إيران'},'north':{ku:'تورکیا',fa:'ترکیه',en:'Türkiye',tr:'Türkiye',ar:'تركيا'},'south':{ku:'عێراق',fa:'عراق',en:'Iraq',tr:'Irak',ar:'العراق'},'west':{ku:'سوریا',fa:'سوریه',en:'Syria',tr:'Suriye',ar:'سوريا'}}[key]||{})[lang] || city.country}`; body.appendChild(p1);
      const p2=document.createElement('p'); p2.innerHTML=`<b>${labels[lang].history}:</b> ${city.description?.[lang] || city.description?.ku || '—'}`; body.appendChild(p2);
      const p3=document.createElement('p'); p3.innerHTML=`<b>${labels[lang].attractions}:</b> ${city.attraction || '—'}`; body.appendChild(p3);
      detail.append(gallery,body); host.appendChild(detail);
      host.querySelectorAll('.city-name').forEach(x=>x.classList.remove('active')); if(clicked) clicked.classList.add('active');
      if(scroll) detail.scrollIntoView({behavior:'smooth',block:'nearest'});
    }
    buttons.forEach(b=>b.addEventListener('click',()=>renderPart(b.dataset.part)));
  }

  document.addEventListener('click', e => {
    const b=e.target.closest('.four-part-btn');
    if(b){ const w=b.closest('[data-four-parts-widget]'); const key=w.closest('[data-cultural-section]')?.dataset.culturalSection || 'culture'; renderFourPart(w,key,b.dataset.region,true); return; }
    const card=e.target.closest('.click-card');
    if(card){ const expanded=card.classList.toggle('expanded'); card.setAttribute('aria-expanded',expanded?'true':'false'); }
  });
  document.addEventListener('keydown', e => { if((e.key==='Enter'||e.key===' ') && e.target.classList.contains('click-card')){e.preventDefault();e.target.click();} });

  // Countdown: 20 Reşeme 2726 = 11 March 2027. Numbers stay English and do not change with language.
  function initCountdown(){
    const target=Date.parse('2027-03-11T00:00:00+03:30');
    const box=document.querySelector('.bannerCountdown');
    const ids={d:document.getElementById('cd-days'),h:document.getElementById('cd-hours'),m:document.getElementById('cd-minutes'),s:document.getElementById('cd-seconds')};
    if(!box || !ids.d) return;
    function tick(){
      let diff=target-Date.now();
      if(diff<=0){ ['d','h','m','s'].forEach(k=>ids[k].textContent='0'.repeat(k==='d'?3:2)); return; }
      let total=Math.floor(diff/1000), d=Math.floor(total/86400); total%=86400; let h=Math.floor(total/3600); total%=3600; let m=Math.floor(total/60), s=total%60;
      ids.d.textContent=String(d).padStart(3,'0'); ids.h.textContent=String(h).padStart(2,'0'); ids.m.textContent=String(m).padStart(2,'0'); ids.s.textContent=String(s).padStart(2,'0');
    }
    tick(); setInterval(tick,1000);
  }

  document.addEventListener('DOMContentLoaded', () => {
    const select=document.getElementById('language');
    if(select) select.addEventListener('change',e=>applyLanguage(e.target.value));
    initCities(); initCountdown(); applyLanguage(lang);
  });
})();
