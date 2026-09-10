/* KURD Token — single language system + local city browser + fixed countdown */
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
    ku:'KURD Token | کوردستان', fa:'KURD Token | کردستان', en:'KURD Token | Kurdistan',
    tr:'KURD Token | Kürdistan', ar:'KURD Token | كردستان'
  };
  let lang = localStorage.getItem(LANG_KEY) || 'ku';
  if (!LANGS.includes(lang)) lang = 'ku';
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
    if (Array.isArray(window.KURD_CITIES)) initWeeklyCity();
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
    culture:{ku:'میراثی نەماوی، نەریتە کۆمەڵایەتییەکان، میوانداری، بۆنەکان، بیرەوەریی زارەکی و زانیاریی ناوخۆیی؛ بەبێ دووبارەکردنەوەی کارتە تایبەتەکان.',fa:'میراث ناملموس، سنت‌های اجتماعی، مهمان‌نوازی، آیین‌ها، حافظه شفاهی و دانش محلی؛ بدون تکرار کارت‌های تخصصی.',en:'Intangible heritage, social practices, hospitality, celebrations, oral memory and local knowledge — without repeating the dedicated cards.',tr:'Somut olmayan miras, toplumsal uygulamalar, misafirperverlik, kutlamalar, sözlü hafıza ve yerel bilgi; özel kartlar tekrarlanmaz.',ar:'التراث غير المادي والممارسات الاجتماعية والضيافة والاحتفالات والذاكرة الشفوية والمعرفة المحلية دون تكرار الأقسام المتخصصة.'}
  };

  function renderFourPart(widget, key, region, scroll) {
    const btn = widget.querySelector(`.four-part-btn[data-region="${region}"]`); if (!btn) return;
    widget.querySelectorAll('.four-part-btn').forEach(b=>{ b.classList.toggle('active',b===btn); b.setAttribute('aria-selected',b===btn?'true':'false'); });
    const detail=widget.querySelector('.four-parts-detail');
    widget.querySelector('.four-parts-detail-title').textContent=regionNames[region]?.[lang]||region;
    widget.querySelector('.four-parts-detail-text').textContent=sectionText[key]?.[lang]||'';
    detail.hidden=false; if(scroll) widget.scrollIntoView({behavior:'smooth',block:'nearest'});
  }
  function cityName(city){ return city.names?.[lang] || city.names?.en || city.name; }
  function localFallback(city){ const n=(city?.names?.en||city?.name||'city').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); return `assets/cities/${n}.svg`; }
  function genericFallback(){ return 'assets/city-placeholder.jpg'; }
  const countryByPart={east:{ku:'ئێران',fa:'ایران',en:'Iran',tr:'İran',ar:'إيران'},north:{ku:'تورکیا',fa:'ترکیه',en:'Türkiye',tr:'Türkiye',ar:'تركيا'},south:{ku:'عێراق',fa:'عراق',en:'Iraq',tr:'Irak',ar:'العراق'},west:{ku:'سوریا',fa:'سوریه',en:'Syria',tr:'Suriye',ar:'سوريا'}};
  const cityLabel={
    ku:{population:'دانیشتووان',crafts:'پیشە و دەستکاری',customs:'نەریت و ڕێوڕەسم',income:'سەرچاوەکانی داهات',history:'مێژوو',attractions:'شوێنە مێژووییەکان',source:'سەرچاوەی وێنە'},
    fa:{population:'جمعیت',crafts:'صنایع دستی',customs:'آداب و رسوم',income:'منابع درآمد',history:'تاریخ و قدمت',attractions:'مکان‌های تاریخی',source:'منبع تصویر'},
    en:{population:'Population',crafts:'Handicrafts',customs:'Customs',income:'Main income sources',history:'History',attractions:'Historic places',source:'Image source'},
    tr:{population:'Nüfus',crafts:'El sanatları',customs:'Gelenekler',income:'Başlıca gelir kaynakları',history:'Tarih',attractions:'Tarihî yerler',source:'Görsel kaynağı'},
    ar:{population:'السكان',crafts:'الحرف اليدوية',customs:'العادات والتقاليد',income:'مصادر الدخل',history:'التاريخ',attractions:'المواقع التاريخية',source:'مصدر الصورة'}
  };
  const weeklyText = {
    ku:{week:'هەفتە',next:'نوێکردنەوەی داهاتوو',preview:'پێشبینینی پێش لانچ',region:'بەش',history:'مێژوو',population:'دانیشتووان',crafts:'پیشە و دەستکاری',customs:'نەریت',income:'داهات',attractions:'شوێنە مێژووییەکان',details:'زانیاری تەواو',nextCity:'شاری داهاتوو',loading:'وێنەی شار…',source:'سەرچاوەی وێنە',note:'ئەم بەشە بەرواری هەفتانە بە شێوەی خۆکار نوێ دەکاتەوە؛ هیچ ئاپلۆدێکی هەفتانە پێویست نییە.'},
    fa:{week:'هفته',next:'به‌روزرسانی بعدی',preview:'پیش‌نمایش پیش از لانچ',region:'بخش',history:'تاریخ',population:'جمعیت',crafts:'صنایع دستی',customs:'آداب و رسوم',income:'منابع درآمد',attractions:'مکان‌های تاریخی',details:'اطلاعات کامل',nextCity:'شهر بعدی',loading:'تصویر شهر…',source:'منبع تصویر',note:'این بخش بر اساس تاریخ، هر هفته به‌صورت خودکار به‌روزرسانی می‌شود و نیازی به آپلود هفتگی نیست.'},
    en:{week:'Week',next:'Next update',preview:'Pre-launch preview',region:'Region',history:'History',population:'Population',crafts:'Handicrafts',customs:'Customs',income:'Income',attractions:'Historic places',details:'Full details',nextCity:'Next city',loading:'City image…',source:'Image source',note:'This section rotates automatically every week based on the date; no weekly upload is required.'},
    tr:{week:'Hafta',next:'Sonraki güncelleme',preview:'Lansman öncesi önizleme',region:'Bölge',history:'Tarih',population:'Nüfus',crafts:'El sanatları',customs:'Gelenekler',income:'Gelir',attractions:'Tarihî yerler',details:'Tam bilgi',nextCity:'Sonraki şehir',loading:'Şehir görseli…',source:'Görsel kaynağı',note:'Bu bölüm tarihe göre her hafta otomatik değişir; haftalık yükleme gerekmez.'},
    ar:{week:'الأسبوع',next:'التحديث التالي',preview:'معاينة قبل الإطلاق',region:'المنطقة',history:'التاريخ',population:'السكان',crafts:'الحرف اليدوية',customs:'العادات',income:'الدخل',attractions:'المواقع التاريخية',details:'التفاصيل الكاملة',nextCity:'المدينة التالية',loading:'صورة المدينة…',source:'مصدر الصورة',note:'يتغير هذا القسم تلقائياً كل أسبوع حسب التاريخ؛ ولا يحتاج إلى رفع أسبوعي.'}
  };

  function weeklyRegionKey(part){ return ({'ڕۆژهەڵات':'east','باکوور':'north','باشوور':'south','ڕۆژئاوا':'west'})[part] || 'south'; }
  function buildWeeklyOrder(){
    if(!Array.isArray(window.KURD_CITIES)) return [];
    const groups={east:[],north:[],south:[],west:[]};
    window.KURD_CITIES.forEach(c=>{ const k=weeklyRegionKey(c.part); if(groups[k]) groups[k].push(c); });
    const erbilIndex=groups.south.findIndex(c=>c.names?.en==='Erbil' || c.name==='هەولێر');
    if(erbilIndex>0){ const [erbil]=groups.south.splice(erbilIndex,1); groups.south.unshift(erbil); }
    const order=[]; const rotation=['south','east','north','west']; let cursor=0;
    while(Object.values(groups).some(a=>a.length)){
      for(const region of rotation){ if(groups[region].length) order.push(groups[region].shift()); }
      cursor++; if(cursor>2000) break;
    }
    return order;
  }
  function weeklyInfoText(city){
    const rich=getRich(city);
    return {
      history:rich.history?.[lang]||rich.history||'—',
      population:rich.population?.[lang]||rich.population||'—',
      crafts:rich.crafts?.[lang]||rich.crafts||'—',
      customs:rich.customs?.[lang]||rich.customs||'—',
      income:rich.income?.[lang]||rich.income||'—',
      attractions:rich.attractions?.[lang]||rich.attractions||'—'
    };
  }
  function weeklyDateLabel(date){
    try{
      const opts={year:'numeric',month:'long',day:'numeric'};
      const locale={ku:'ku',fa:'fa-IR',en:'en-US',tr:'tr-TR',ar:'ar' }[lang]||'en-US';
      return new Intl.DateTimeFormat(locale,opts).format(date);
    }catch(_){return date.toLocaleDateString();}
  }
  async function initWeeklyCity(){
    const section=document.getElementById('weekly-city');
    const image=document.getElementById('weekly-city-image');
    if(!section || !Array.isArray(window.KURD_CITIES) || !window.KURD_CITIES.length) return;
    const order=buildWeeklyOrder(); if(!order.length) return;
    const launch=Date.parse('2027-03-11T00:00:00+03:00');
    const now=Date.now();
    let index=0, preview=true;
    if(now>=launch){ index=Math.floor((now-launch)/(7*86400000)); preview=false; }
    index=index%order.length;
    const city=order[index];
    const nextBoundary=preview?new Date(launch):new Date(launch+(Math.floor((now-launch)/(7*86400000))+1)*7*86400000);
    const key=weeklyRegionKey(city.part);
    const info=weeklyInfoText(city);
    const set=(id,text)=>{const el=document.getElementById(id);if(el)el.textContent=text;};
    set('weekly-city-badge',preview?weeklyText[lang].preview:'CITY OF THE WEEK');
    set('weekly-week-label',weeklyText[lang].week);
    set('weekly-week-number',String(index+1));
    set('weekly-region-label',`${weeklyText[lang].region}: ${regionNames[key]?.[lang]||city.part}`);
    set('weekly-next-update',`${weeklyText[lang].next}: ${weeklyDateLabel(nextBoundary)}`);
    set('weekly-city-name',cityName(city));
    set('weekly-city-description',city.description?.[lang]||city.description?.en||'');
    set('weekly-note',weeklyText[lang].note);
    const facts=document.getElementById('weekly-facts');
    if(facts){
      const rows=[['history',info.history],['population',info.population],['crafts',info.crafts],['customs',info.customs],['income',info.income],['attractions',info.attractions]];
      facts.innerHTML=rows.map(([k,v])=>`<div class="weekly-fact"><b>${weeklyText[lang][k]}</b><span>${String(v).replace(/</g,'&lt;').replace(/>/g,'&gt;')}</span></div>`).join('');
    }
    const open=document.getElementById('weekly-open-city');
    if(open){open.textContent=weeklyText[lang].details;open.onclick=()=>{window.__showKurdPart?.(city.part,true); setTimeout(()=>{const names=[...document.querySelectorAll('.city-name')]; const target=names.find(b=>b.textContent===cityName(city)); if(target) target.click();},350);};}
    const next=document.getElementById('weekly-next-city');
    if(next){next.textContent=weeklyText[lang].nextCity;next.onclick=()=>{const nextIndex=(index+1)%order.length; renderWeeklyCityByIndex(nextIndex,order,launch);};}
    await loadWeeklyImage(city,image);
    section.classList.remove('is-loading'); section.classList.add('flash'); setTimeout(()=>section.classList.remove('flash'),500);
    section.dataset.weeklyIndex=String(index); section.dataset.weeklyCity=city.names?.en||city.name;
  }
  async function renderWeeklyCityByIndex(index,order,launch){
    const section=document.getElementById('weekly-city'); const city=order[index%order.length]; const image=document.getElementById('weekly-city-image'); const key=weeklyRegionKey(city.part); const info=weeklyInfoText(city); const set=(id,text)=>{const el=document.getElementById(id);if(el)el.textContent=text;};
    set('weekly-city-badge','CITY OF THE WEEK');set('weekly-week-label',weeklyText[lang].week);set('weekly-week-number',String(index%order.length+1));set('weekly-region-label',`${weeklyText[lang].region}: ${regionNames[key]?.[lang]||city.part}`);set('weekly-city-name',cityName(city));set('weekly-city-description',city.description?.[lang]||city.description?.en||'');
    const facts=document.getElementById('weekly-facts'); if(facts) facts.innerHTML=[['history',info.history],['population',info.population],['crafts',info.crafts],['customs',info.customs],['income',info.income],['attractions',info.attractions]].map(([k,v])=>`<div class="weekly-fact"><b>${weeklyText[lang][k]}</b><span>${String(v).replace(/</g,'&lt;').replace(/>/g,'&gt;')}</span></div>`).join('');
    const open=document.getElementById('weekly-open-city');if(open)open.onclick=()=>{window.__showKurdPart?.(city.part,true);setTimeout(()=>{const b=[...document.querySelectorAll('.city-name')].find(x=>x.textContent===cityName(city));if(b)b.click();},350)};
    const next=document.getElementById('weekly-next-city');if(next)next.onclick=()=>renderWeeklyCityByIndex((index+1)%order.length,order,launch);
    await loadWeeklyImage(city,image); section.classList.add('flash');setTimeout(()=>section.classList.remove('flash'),500);
  }
  async function loadWeeklyImage(city,image){
    const loading=document.getElementById('weekly-photo-loading'),credit=document.getElementById('weekly-photo-credit');
    if(loading) loading.textContent=weeklyText[lang].loading; if(credit) credit.textContent=''; if(image){image.hidden=true;image.removeAttribute('src');}
    let photos=[]; try{if(window.KURDTOKEN_COMMONS) photos=await window.KURDTOKEN_COMMONS.searchMany(city,1);}catch(_){photos=[];}
    if(photos.length && image){image.src=photos[0].url;image.decoding='async';image.loading='eager';image.alt=`${weeklyText[lang].week}: ${cityName(city)}`;image.hidden=false;image.onerror=()=>{image.onerror=null;image.src=localFallback(city);image.hidden=false;};if(credit)credit.innerHTML=window.KURDTOKEN_COMMONS.attribution(photos[0]);if(loading)loading.style.display='none';}
    else if(image){image.src=localFallback(city);image.hidden=false;image.onerror=()=>{image.onerror=null;image.src=genericFallback();};if(loading)loading.style.display='none';if(credit)credit.textContent=`${weeklyText[lang].source}: KURD Token local fallback`;}
  }

  function getRich(city){
    const ml=(v, fallback)=>{ if(v && typeof v==='object') return v; if(v) return {ku:String(v),fa:String(v),en:String(v),tr:String(v),ar:String(v)}; return fallback||{}; };
    const defaultPop={ku:city.population||'ژمارەی وردی دانیشتووان پێویستی بە ساڵ و سەرچاوەی دیاریکراو هەیە.',fa:city.population||'عدد جمعیت فقط با سال و منبع مشخص نمایش داده می‌شود.',en:city.population||'A precise population figure is shown only when a year and source are identified.',tr:city.population||'Kesin nüfus yalnızca yıl ve kaynak belirlendiğinde gösterilir.',ar:city.population||'يُعرض الرقم السكاني الدقيق عند تحديد السنة والمصدر.'};
    return {
      population:defaultPop,
      history:ml(city.history,{ku:'زانیاریی مێژوویی لە حالەتی پەرەپێدانە.',en:'Historical details are being expanded.'}),
      geography:ml(city.geography,{ku:'زانیاریی جۆگرافیایی بە سەرچاوەی شار پشتڕاست دەکرێتەوە.',en:'Detailed geographic information should be tied to a city-level source.'}),
      customs:ml(city.culture,{ku:'کەلتووری شار بە سەرچاوەی ناوخۆیی پێشکەش دەکرێت.',en:'City culture and customs are documented from local or scholarly sources.'}),
      crafts:ml(city.crafts,{ku:'زانیاریی پیشە و دەستکاری بە سەرچاوەی ناوخۆیی پێشکەش دەکرێت.',en:'City-specific handicrafts are documented from regional sources.'}),
      income:ml(city.economy,{ku:'زانیاریی ئابووری بە سەرچاوەی شار پەیوەست دەکرێت.',en:'City-specific economic information is tied to cited sources.'}),
      attractions:ml(city.heritage||city.attraction,{ku:'شوێن و میرات بە سەرچاوەی دیاریکراو پێشکەش دەکرێن.',en:'Heritage places are listed with identified sources.'}),
      languages:ml(city.languages,{ku:'زانیاریی زمان بە سەرچاوەی زانستی/شارستانی پشتڕاست دەکرێتەوە.',en:'City-level language information is verified against scholarly and local sources.'})
    };
  }

  async function initResearchGallery(){
    const host=document.getElementById('heritage-images'); if(!host) return;
    const queries=['Erbil Citadel Iraq','Hawraman Uramanat Iran','Diyarbakir Hevsel Gardens','Bisotun Kermanshah'];
    try{
      const groups=await Promise.all(queries.map(async q=>{
        const url='https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch='+encodeURIComponent(q+' filetype:bitmap')+'&gsrnamespace=6&gsrlimit=2&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=700&format=json&origin=*';
        const r=await fetch(url); const j=await r.json(); return Object.values(j.query?.pages||{});
      }));
      const items=groups.flat();
      if(!items.length) throw new Error('no images');
      host.innerHTML=items.map(p=>{const i=p.imageinfo?.[0]||{}; const meta=i.extmetadata||{}; const title=(p.title||'').replace(/^File:/,''); const artist=(meta.Artist?.value||'').replace(/<[^>]+>/g,'').slice(0,180); const lic=(meta.LicenseShortName?.value||'').replace(/<[^>]+>/g,'').slice(0,100); return `<figure><img loading="lazy" decoding="async" src="${i.thumburl||i.url||''}" alt="${title.replace(/"/g,'&quot;')}"><figcaption><b>${title}</b><br>${artist?artist+' · ':''}${lic}</figcaption></figure>`}).join('');
    }catch(e){ host.innerHTML='<div class="gallery-loading">Images are loaded from Wikimedia Commons when available; each file retains its own attribution and license.</div>'; }
  }

  
  function cityDataQuality(city){
    const status=city.dataStatus||'baseline';
    return status==='verified-core'?'verified':(status==='partial'?'partial':'needs');
  }
function initCities(){
    const host=document.getElementById('regionCities'); if(!host||!Array.isArray(window.KURD_CITIES)) return;
    const buttons=[...document.querySelectorAll('.region-card')]; const grouped={}; window.KURD_CITIES.forEach(c=>(grouped[c.part] ||= []).push(c));
    window.__showKurdPart=(part,scroll=true)=>renderPart(part,scroll);
    function renderPart(part,scroll=true){
      activePart=part; activeCity=null; host.hidden=false; host.innerHTML='';
      const cities=grouped[part]||[]; const title=document.createElement('div'); title.className='region-cities-head';
      const h=document.createElement('h3'); const key=({ 'ڕۆژهەڵات':'east','باکوور':'north','باشوور':'south','ڕۆژئاوا':'west'})[part]; h.textContent=regionNames[key]?.[lang]||part; title.appendChild(h);
      const count=document.createElement('span'); count.className='city-count'; count.textContent=`${cities.length}`; title.appendChild(count);
      const close=document.createElement('button'); close.type='button'; close.className='close-region'; close.textContent='×'; close.setAttribute('aria-label',labels[lang].close); close.onclick=()=>{activePart=null;activeCity=null;host.hidden=true;host.innerHTML='';buttons.forEach(b=>b.classList.remove('active'));}; title.appendChild(close); host.appendChild(title);
      const list=document.createElement('div'); list.className='city-list'; cities.forEach(city=>{ const b=document.createElement('button'); b.type='button'; b.className='city-name'; b.textContent=cityName(city); b.onclick=()=>renderCity(city,b); list.appendChild(b); }); host.appendChild(list);
      buttons.forEach(b=>b.classList.toggle('active',b.dataset.part===part)); if(scroll) host.scrollIntoView({behavior:'smooth',block:'start'});
    }
    function cityResearchStatus(city){
      const fields=[city.population,city.history,city.attraction,city.description?.en,city.description?.ku];
      const filled=fields.filter(v=>v && !/needs|should be|being expanded|در حال|پێویستی|نوێ دەکرێتەوە/i.test(String(v))).length;
      if(city.dataStatus==='verified-core') return {key:'verified-core',ku:'بەڵگەدار / پڕتر',fa:'مستند / تکمیل‌تر',en:'Documented / richer profile',tr:'Belgeli / daha kapsamlı',ar:'موثق / ملف أوسع'};
      if(filled>=3) return {key:'partial',ku:'پروفایلی بنەڕەتی',fa:'پروفایل پایه',en:'Baseline profile',tr:'Temel profil',ar:'ملف أساسي'};
      return {key:'needs',ku:'پێویستی بە توێژینەوەی زیاتر هەیە',fa:'نیازمند پژوهش بیشتر',en:'Further research required',tr:'Ek araştırma gerekli',ar:'يحتاج إلى بحث إضافي'};
    }
    const cityDetailLabels={
      ku:{overview:'پوختەی شار',identity:'ناسنامە',research:'دۆخی توێژینەوە',region:'ناوچە',country:'وڵات',population:'دانیشتووان',history:'مێژوو و پێشینە',geography:'جۆگرافیا و شوێن',culture:'کەلتوور و نەریت',crafts:'پیشە و دەستکاری',economy:'ئابووری و سەرچاوەکانی داهات',heritage:'شوێن و میرات',languages:'زمان و شێوەزار',sources:'سەرچاوە و تێبینی',map:'کردنەوە لە نەخشە',googleMap:'Google Maps',populationYear:'ساڵی ئامار',close:'داخستن',sourceNote:'ژمارەی دانیشتووان تەنها کاتێک بە ژمارەی ورد نوسراوە کە ساڵ و سەرچاوەی دیاریکراو هەبێت.'},
      fa:{overview:'پرونده کامل شهر',identity:'شناسه',research:'وضعیت پژوهش',region:'منطقه',country:'کشور',population:'جمعیت',history:'تاریخ و پیشینه',geography:'جغرافیا و موقعیت',culture:'فرهنگ و رسوم',crafts:'صنایع دستی',economy:'اقتصاد و منابع درآمد',heritage:'مکان‌ها و میراث',languages:'زبان و گونه‌های زبانی',sources:'منابع و یادداشت',map:'باز کردن در نقشه',googleMap:'Google Maps',populationYear:'سال آمار',close:'بستن',sourceNote:'عدد جمعیت فقط زمانی به‌صورت دقیق نمایش داده می‌شود که سال و منبع مشخص داشته باشد.'},
      en:{overview:'Full City Dossier',identity:'Identity',research:'Research status',region:'Region',country:'Country',population:'Population',history:'History & background',geography:'Geography & location',culture:'Culture & customs',crafts:'Handicrafts',economy:'Economy & income sources',heritage:'Places & heritage',languages:'Languages & varieties',sources:'Sources & notes',map:'Open map',googleMap:'Google Maps',populationYear:'Data year',close:'Close',sourceNote:'A precise population figure is shown only when a year and source are identified.'},
      tr:{overview:'Tam Şehir Dosyası',identity:'Kimlik',research:'Araştırma durumu',region:'Bölge',country:'Ülke',population:'Nüfus',history:'Tarih ve geçmiş',geography:'Coğrafya ve konum',culture:'Kültür ve gelenekler',crafts:'El sanatları',economy:'Ekonomi ve gelir kaynakları',heritage:'Mekânlar ve miras',languages:'Diller ve çeşitler',sources:'Kaynaklar ve notlar',map:'Haritada aç',googleMap:'Google Maps',populationYear:'Veri yılı',close:'Kapat',sourceNote:'Kesin nüfus yalnızca yıl ve kaynak belirlendiğinde verilir.'},
      ar:{overview:'ملف المدينة الكامل',identity:'الهوية',research:'حالة البحث',region:'المنطقة',country:'الدولة',population:'السكان',history:'التاريخ والخلفية',geography:'الجغرافيا والموقع',culture:'الثقافة والعادات',crafts:'الحرف اليدوية',economy:'الاقتصاد ومصادر الدخل',heritage:'المواقع والتراث',languages:'اللغات والتنوعات',sources:'المصادر والملاحظات',map:'فتح الخريطة',googleMap:'خرائط Google',populationYear:'سنة البيانات',close:'إغلاق',sourceNote:'يُعرض رقم سكاني دقيق فقط عند تحديد السنة والمصدر.'}
    };
    async function renderCity(city,clicked,scroll=true){
      activeCity=city; const old=host.querySelector('.city-detail'); if(old) old.remove();
      const L=cityDetailLabels[lang]||cityDetailLabels.en;
      const key=({'ڕۆژهەڵات':'east','باکوور':'north','باشوور':'south','ڕۆژئاوا':'west'})[city.part];
      const rich=getRich(city), status=cityResearchStatus(city);
      const detail=document.createElement('article'); detail.className='city-detail city-dossier';
      const gallery=document.createElement('div'); gallery.className='city-gallery city-dossier-gallery';
      const loading=document.createElement('div'); loading.className='photo-loading'; loading.textContent=(weeklyText[lang]?.loading||'City image')+'…'; gallery.appendChild(loading);
      const body=document.createElement('div'); body.className='city-detail-body city-dossier-body';
      const head=document.createElement('div'); head.className='city-dossier-head';
      const h=document.createElement('h4'); h.textContent=cityName(city); head.appendChild(h);
      const badge=document.createElement('span'); badge.className='city-research-badge '+status.key; badge.textContent=status[lang]||status.en; head.appendChild(badge);
      body.appendChild(head);
      const meta=document.createElement('div'); meta.className='city-meta-grid';
      [[L.region,regionNames[key]?.[lang]||city.part],[L.country,(countryByPart[key]||{})[lang]||city.country||'—'],[L.population,rich.population?.[lang]||city.population||'—']].forEach(([a,b])=>{const x=document.createElement('div');x.innerHTML=`<small>${a}</small><strong>${b}</strong>`;meta.appendChild(x);}); body.appendChild(meta);
      const sections=[
        ['history',L.history,rich.history],
        ['geography',L.geography,rich.geography],
        ['culture',L.culture,rich.customs],
        ['crafts',L.crafts,rich.crafts],
        ['economy',L.economy,rich.income],
        ['heritage',L.heritage,rich.attractions],
        ['languages',L.languages,rich.languages]
      ];
      sections.forEach(([keyName,title,val])=>{const sec=document.createElement('section');sec.className='city-dossier-section';const sh=document.createElement('h5');sh.textContent=title;const pp=document.createElement('p');pp.textContent=val?.[lang]||val?.en||val||'—';sec.append(sh,pp);body.appendChild(sec);});
      const notes=document.createElement('section');notes.className='city-dossier-sources';
      const statusBadge=status.key==='verified-core'?'verified':(status.key==='partial'?'partial':'needs');
      const mapQuery=city.coordinates ? `${city.coordinates.lat},${city.coordinates.lon}` : cityName(city);
      const sourceLinks=(city.sources||[]).map(s=>`<a target="_blank" rel="noopener" href="${s.url}">${s.label}</a>`).join('');
      notes.innerHTML=`<h5>${L.sources}</h5><p>${L.sourceNote}</p><div class="city-quality"><span class="quality-badge ${statusBadge}">${status[lang]||status.en}</span>${city.populationYear?`<span>${L.populationYear}: ${city.populationYear}</span>`:''}</div><div class="city-source-actions"><a target="_blank" rel="noopener" href="https://www.openstreetmap.org/search?query=${encodeURIComponent(mapQuery)}">${L.map}</a>${city.coordinates?`<a target="_blank" rel="noopener" href="https://www.google.com/maps?q=${city.coordinates.lat},${city.coordinates.lon}">${L.googleMap}</a>`:''}</div>${sourceLinks?`<div class="city-source-list">${sourceLinks}</div>`:''}`; body.appendChild(notes);
      detail.append(gallery,body); host.appendChild(detail); host.querySelectorAll('.city-name').forEach(x=>x.classList.remove('active')); if(clicked) clicked.classList.add('active');
      let photos=[]; if(window.KURDTOKEN_COMMONS) photos=await window.KURDTOKEN_COMMONS.searchMany(city,3);
      gallery.innerHTML='';
      if(!photos.length){ const img=document.createElement('img'); img.src=localFallback(city); img.decoding='async'; img.loading='lazy'; img.onerror=()=>{img.onerror=null;img.src=genericFallback();}; img.alt=`${cityName(city)}`; gallery.appendChild(img); const note=document.createElement('div'); note.className='photo-credit'; note.textContent=labels[lang].source+': KURD Token local fallback'; gallery.appendChild(note); }
      else photos.forEach(photo=>{ const wrap=document.createElement('figure'); const img=document.createElement('img'); img.src=photo.url; img.decoding='async'; img.loading='lazy'; img.alt=`${cityName(city)}`; img.loading='lazy'; img.onerror=()=>{img.onerror=null;img.src=localFallback(city);}; wrap.appendChild(img); wrap.insertAdjacentHTML('beforeend',window.KURDTOKEN_COMMONS.attribution(photo)); gallery.appendChild(wrap); });
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

  // Launch target: 20 ڕه‌شه‌مێ 2726 = 20 اسفند 1405 = 11 March 2027. This aligns the planned launch date with National Clothing Day listed by the Kurdistan Region official calendar.
  function initCountdown(){
    const target=Date.parse('2027-03-11T00:00:00+03:00');
    const ids={d:document.getElementById('cd-days'),h:document.getElementById('cd-hours'),m:document.getElementById('cd-minutes'),s:document.getElementById('cd-seconds')};
    if(!ids.d) return;
    function tick(){let diff=target-Date.now(); if(diff<=0){ids.d.textContent='000';ids.h.textContent='00';ids.m.textContent='00';ids.s.textContent='00';return;} let t=Math.floor(diff/1000),d=Math.floor(t/86400);t%=86400;let h=Math.floor(t/3600);t%=3600;let m=Math.floor(t/60),ss=t%60;ids.d.textContent=String(d).padStart(3,'0');ids.h.textContent=String(h).padStart(2,'0');ids.m.textContent=String(m).padStart(2,'0');ids.s.textContent=String(ss).padStart(2,'0');}
    tick();setInterval(tick,1000);
  }

  // Trading links are intentionally inactive until the official KURD contract is deployed.
  // Set the real BNB Smart Chain contract address here after deployment; never publish a placeholder.
  const KURD_CONTRACT_ADDRESS = '';
  function initTradeButtons(){
    const buy=document.getElementById('buy-kurd'), sell=document.getElementById('sell-kurd'), status=document.getElementById('trade-status');
    if(!buy||!sell) return;
    if(/^0x[a-fA-F0-9]{40}$/.test(KURD_CONTRACT_ADDRESS)){
      const base='https://pancakeswap.finance/swap?chain=bsc';
      buy.disabled=false; sell.disabled=false;
      buy.onclick=()=>window.open(base+'&inputCurrency=BNB&outputCurrency='+KURD_CONTRACT_ADDRESS,'_blank','noopener');
      sell.onclick=()=>window.open(base+'&inputCurrency='+KURD_CONTRACT_ADDRESS+'&outputCurrency=BNB','_blank','noopener');
      if(status) status.textContent='PancakeSwap trading is enabled for the deployed KURD contract on BNB Smart Chain.';
    }
  }
  document.addEventListener('DOMContentLoaded', () => {
    const select=document.getElementById('language');
    if(select) select.addEventListener('change',e=>applyLanguage(e.target.value));
    initCities(); initWeeklyCity(); initCountdown(); initTradeButtons(); initResearchGallery(); applyLanguage(lang);
  });
})();


/* === MASTER SECTION CARDS: every major site section opens as a focused detail view === */
(function(){
  function initMasterCards(){
    const grid=document.getElementById('master-card-grid');
    // Add the official KURD token image to every section card without changing the card content.
    grid.querySelectorAll('.master-nav-card').forEach(card=>{
      if(!card.querySelector('.card-token-logo')){
        const img=document.createElement('img');
        img.className='card-token-logo';
        img.src='assets/kurd-logo.png';
        img.decoding='async';
        img.alt='KURD Token';
        img.loading='lazy';
        card.prepend(img);
      }
    });
    const modal=document.getElementById('master-modal');
    const body=document.getElementById('master-modal-body');
    const title=document.getElementById('master-modal-title');
    let previousFocus=null;
    if(!grid||!modal||!body) return;
    const sections={};
    const placeholders={};
    document.querySelectorAll('main > section[data-master-section="true"]').forEach(sec=>{
      sections[sec.id]=sec;
      const ph=document.createComment('KURDESTAN-CARD-PLACEHOLDER-'+sec.id);
      sec.parentNode.insertBefore(ph,sec); placeholders[sec.id]=ph;
      sec.classList.add('master-hidden-section');
    });
    const restore=()=>{
      const sec=body.querySelector(':scope > section[data-master-section="true"]');
      if(!sec) return;
      const id=sec.id;
      const ph=placeholders[id];
      if(ph && ph.parentNode) ph.parentNode.insertBefore(sec,ph.nextSibling);
      else document.getElementById('site-sections').after(sec);
      sec.classList.add('master-hidden-section');
      body.innerHTML='';
      modal.classList.remove('is-open'); modal.setAttribute('aria-hidden','true');
      document.body.classList.remove('master-modal-lock');
      window.scrollTo({top:document.getElementById('site-sections')?.offsetTop||0,behavior:'smooth'});
      if(previousFocus && typeof previousFocus.focus==='function') previousFocus.focus();
      previousFocus=null;
    };
    const open=(id)=>{
      const sec=sections[id]||document.getElementById(id); if(!sec) return;
      previousFocus=document.activeElement;
      body.innerHTML=''; body.appendChild(sec); sec.classList.remove('master-hidden-section');
      const h=sec.querySelector('h2');
      title.textContent=(h?.getAttribute('data-'+(window.KURD_LANG||'ku'))||h?.textContent||id);
      modal.classList.add('is-open'); modal.setAttribute('aria-hidden','false'); document.body.classList.add('master-modal-lock');
      const close=modal.querySelector('.master-modal-close'); if(close) close.focus();
      dialogScrollTop();
    };
    function dialogScrollTop(){const d=modal.querySelector('.master-modal-dialog'); if(d)d.scrollTop=0;}
    grid.addEventListener('click',e=>{const card=e.target.closest('.master-nav-card');if(card)open(card.dataset.target);});
    grid.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.closest('.master-nav-card')){e.preventDefault();e.target.closest('.master-nav-card').click();}});
    modal.addEventListener('click',e=>{
      if(e.target===modal || e.target.closest('.master-modal-close') || e.target.closest('.master-modal-back')) restore();
    });
    document.addEventListener('keydown',e=>{
      if(!modal.classList.contains('is-open')) return;
      if(e.key==='Escape'){restore();return;}
      if(e.key==='Tab'){
        const focusable=[...modal.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(x=>x.offsetParent!==null);
        if(!focusable.length) return;
        const first=focusable[0],last=focusable[focusable.length-1];
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
      }
    });
    // Route all existing hash navigation to the corresponding card.
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      const id=a.getAttribute('href').slice(1); if(!sections[id]) return;
      a.addEventListener('click',e=>{e.preventDefault();open(id);history.replaceState(null,'','#'+id);});
    });
    // Keep card titles/descriptions synchronized with the active language.
    const sync=()=>{
      const lang=window.KURD_LANG||document.documentElement.lang||'ku';
      grid.querySelectorAll('.master-nav-card').forEach(c=>{
        const t=c.querySelector('.card-title'),d=c.querySelector('.card-desc'),o=c.querySelector('.card-open');
        if(t&&c.dataset['title'+lang.charAt(0).toUpperCase()+lang.slice(1)]) t.textContent=c.dataset['title'+lang.charAt(0).toUpperCase()+lang.slice(1)];
        if(o&&o.getAttribute('data-'+lang)) o.textContent=o.getAttribute('data-'+lang);
        if(d&&d.getAttribute('data-'+lang)) d.textContent=d.getAttribute('data-'+lang);
      });
      const active=body.querySelector('section[data-master-section="true"]');
      if(active){const h=active.querySelector('h2');if(h)title.textContent=h.getAttribute('data-'+lang)||h.textContent;}
    };
    // applyLanguage in the original script updates data-* nodes; observe language changes safely.
    const sel=document.getElementById('language'); if(sel) sel.addEventListener('change',()=>setTimeout(sync,0));
    sync();
    window.__openKurdSection=open;
    window.__closeKurdSection=restore;
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initMasterCards); else initMasterCards();
})();

// Places card: four-region interactive tabs
(function initPlacesRegionTabs(){
  function bind(){
    const root=document.querySelector('#places');
    if(!root || root.dataset.placesTabsReady==='1') return;
    root.dataset.placesTabsReady='1';
    const buttons=[...root.querySelectorAll('.places-region-btn')];
    const panels=[...root.querySelectorAll('.places-region-panel')];
    buttons.forEach(btn=>btn.addEventListener('click',()=>{
      const target=btn.dataset.regionPanel;
      buttons.forEach(b=>b.classList.toggle('active',b===btn));
      panels.forEach(p=>p.classList.toggle('active',p.dataset.regionContent===target));
    }));
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bind); else bind();
})();


// Card 08 music filters
(function(){
  function initMusicFilters(){
    const root=document.querySelector('#music'); if(!root) return;
    const buttons=root.querySelectorAll('.music-filter'); const artists=root.querySelectorAll('.artist-profile');
    buttons.forEach(btn=>btn.addEventListener('click',()=>{
      buttons.forEach(b=>b.classList.remove('active')); btn.classList.add('active');
      const filter=btn.dataset.filter||'all';
      artists.forEach(a=>{
        const tags=(a.dataset.tags||'')+' '+(a.dataset.region||'');
        a.style.display=(filter==='all'||tags.includes(filter))?'grid':'none';
      });
    }));
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initMusicFilters); else initMusicFilters();
})();

/* KURDESTAN V3 — fast site-wide section search */
(function initV3Search(){
  function bind(){
    const input=document.getElementById('site-search'), grid=document.getElementById('master-card-grid');
    if(!input||!grid||input.dataset.ready==='1') return; input.dataset.ready='1';
    const syncPlaceholder=()=>{const l=window.KURD_LANG||document.documentElement.lang||'ku'; const v=input.getAttribute('data-placeholder-'+l); if(v) input.placeholder=v;};
    const filter=()=>{
      const q=input.value.trim().toLocaleLowerCase(); let shown=0;
      grid.querySelectorAll('.master-nav-card').forEach(card=>{
        const text=[card.textContent,...['ku','en','fa','tr','ar'].flatMap(l=>[card.querySelector('[data-'+l+']')?.getAttribute('data-'+l)||''])].join(' ').toLocaleLowerCase();
        const ok=!q||text.includes(q); card.hidden=!ok; if(ok) shown++;
      });
      grid.classList.toggle('is-filtered',!!q);
      let empty=grid.querySelector('.v3-no-results');
      if(!shown){if(!empty){empty=document.createElement('div');empty.className='v3-no-results box';empty.setAttribute('data-ku','هیچ بەشێک نەدۆزرایەوە.');empty.setAttribute('data-en','No matching section found.');empty.setAttribute('data-fa','بخش منطبق پیدا نشد.');empty.setAttribute('data-tr','Eşleşen bölüm bulunamadı.');empty.setAttribute('data-ar','لم يتم العثور على قسم مطابق.');grid.appendChild(empty);} const l=window.KURD_LANG||'ku'; empty.textContent=empty.getAttribute('data-'+l)||empty.getAttribute('data-ku');}
      else if(empty) empty.remove();
    };
    input.addEventListener('input',filter); const sel=document.getElementById('language'); if(sel) sel.addEventListener('change',()=>{syncPlaceholder();filter();}); syncPlaceholder();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bind); else bind();
})();

/* V3.2 — research coverage dashboard */
(function initResearchDashboard(){
  function render(){
    const cities=Array.isArray(window.KURD_CITIES)?window.KURD_CITIES:[];
    const metrics=document.getElementById('research-metrics'), table=document.getElementById('research-region-table');
    if(!metrics||!table||!cities.length) return;
    const groups={}; cities.forEach(c=>(groups[c.part] ||= []).push(c));
    const verified=cities.filter(c=>c.dataStatus==='documented').length;
    const partial=cities.filter(c=>c.dataStatus==='partial').length;
    const needs=cities.filter(c=>c.dataStatus==='baseline').length;
    const pct=Math.round((verified/cities.length)*100);
    const labels={ku:{cities:'شار',verified:'بەڵگەدار',partial:'کەمتر بەڵگەدار',needs:'بنەڕەتی / پێویستی بە توێژینەوە',coverage:'پۆششی بەڵگەدار'},en:{cities:'Cities',verified:'Documented',partial:'Partial',needs:'Baseline / research queue',coverage:'Documented coverage'},fa:{cities:'شهر',verified:'مستند',partial:'ناقص',needs:'پایه / نیازمند پژوهش',coverage:'پوشش مستند'},tr:{cities:'Şehir',verified:'Belgeli',partial:'Kısmi',needs:'Temel / araştırma kuyruğu',coverage:'Belgeli kapsam'},ar:{cities:'المدن',verified:'موثق',partial:'جزئي',needs:'أساسي / بحاجة إلى بحث',coverage:'نطاق موثق'}};
    const l=labels[window.currentLang||'ku']||labels.ku;
    metrics.innerHTML=`<div><strong>${cities.length}</strong><span>${l.cities}</span></div><div><strong>${verified}</strong><span>${l.verified}</span></div><div><strong>${partial}</strong><span>${l.partial}</span></div><div><strong>${needs}</strong><span>${l.needs}</span></div><div class="coverage"><strong>${pct}%</strong><span>${l.coverage}</span></div>`;
    table.innerHTML=Object.entries(groups).map(([part,items])=>{const v=items.filter(c=>c.dataStatus==='documented').length;const p=items.filter(c=>c.dataStatus==='partial').length;const n=items.filter(c=>c.dataStatus==='baseline').length;return `<div class="research-region-row"><b>${part}</b><span>${items.length} ${l.cities}</span><span class="r-good">${v} ${l.verified}</span><span class="r-base">${p} ${l.partial}</span><span class="r-needs">${n} ${l.needs}</span></div>`}).join('');
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',render); else render();
  window.__refreshResearchDashboard=render;
  const sel=document.getElementById('language'); if(sel) sel.addEventListener('change',()=>setTimeout(render,0));
})();

/* V3 Atlas controls */
(function initCityAtlas(){
  function wire(){
    const search=document.getElementById('city-atlas-search'); const clear=document.getElementById('city-atlas-clear'); const regionBtns=[...document.querySelectorAll('.atlas-region')];
    if(!search || search.dataset.wired) return; search.dataset.wired='1';
    const allCities=()=>Array.isArray(window.KURD_CITIES)?window.KURD_CITIES:[];
    const setSearchPlaceholder=()=>{ const l=window.currentLang||document.documentElement.lang||'ku'; const v=search.dataset['placeholder-'+l]||search.dataset.placeholderKu; if(v) search.placeholder=v; };
    function filter(){
      const q=search.value.trim().toLocaleLowerCase();
      document.querySelectorAll('.city-name').forEach(b=>{b.hidden=!!q && !b.textContent.toLocaleLowerCase().includes(q);});
      if(q){ document.getElementById('regionCities')?.removeAttribute('hidden'); regionBtns.forEach(b=>b.classList.remove('active')); }
      const no=document.getElementById('atlas-no-results'); const visible=[...document.querySelectorAll('.city-name')].some(b=>!b.hidden);
      if(no) no.hidden=visible||!q;
    }
    function select(part){ regionBtns.forEach(b=>b.classList.toggle('active',b.dataset.atlasPart===part)); window.__showKurdPart?.(part,true); setTimeout(filter,80); }
    regionBtns.forEach(b=>b.addEventListener('click',()=>select(b.dataset.atlasPart)));
    search.addEventListener('input',filter); clear?.addEventListener('click',()=>{search.value='';filter();search.focus();});
    setSearchPlaceholder(); window.__refreshCityAtlasLanguage=setSearchPlaceholder;
    if(!document.getElementById('atlas-no-results')){const n=document.createElement('div');n.id='atlas-no-results';n.className='v3-no-results';n.hidden=true;n.textContent='No cities found.';document.getElementById('regionCities')?.appendChild(n);}
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',wire); else wire();
  const old=window.__setLang; if(old && !old.__atlasWrapped){window.__setLang=function(){const r=old.apply(this,arguments);window.__refreshCityAtlasLanguage?.();return r;};window.__setLang.__atlasWrapped=true;}
})();


/* V3.5 — field-level evidence ledger */
(function initEvidenceLedger(){
  const fields=['population','history','heritage','culture','languages','economy','sources'];
  const labels={
    ku:{all:'هەموو',none:'هیچ شارێک نەدۆزرایەوە',score:'نمرە',documented:'بەڵگەدار',needed:'پێویستی بە توێژینەوە',duplicate:'ناوی دووبارە'},
    en:{all:'All',none:'No cities found',score:'Score',documented:'Documented',needed:'Research needed',duplicate:'Duplicate name'},
    fa:{all:'همه',none:'شهری پیدا نشد',score:'امتیاز',documented:'مستند',needed:'نیازمند پژوهش',duplicate:'نام تکراری'},
    tr:{all:'Tümü',none:'Şehir bulunamadı',score:'Puan',documented:'Belgeli',needed:'Araştırma gerekli',duplicate:'Yinelenen ad'},
    ar:{all:'الكل',none:'لم يتم العثور على مدن',score:'النتيجة',documented:'موثق',needed:'بحاجة إلى بحث',duplicate:'اسم مكرر'}
  };
  const fieldKeys=['population','history','heritage','culture','languages','economy','sources'];
  function cityLabel(c){return c.names?.en||c.name||''}
  function render(){
    const body=document.getElementById('evidence-table-body'), summary=document.getElementById('evidence-summary');
    if(!body||!summary||!Array.isArray(window.KURD_CITIES)) return;
    const region=document.getElementById('evidence-region')?.value||'all';
    const min=Number(document.getElementById('evidence-score')?.value||0);
    const q=(document.getElementById('evidence-search')?.value||'').trim().toLocaleLowerCase();
    const cities=window.KURD_CITIES.filter(c=>{
      const okR=region==='all'||c.part===region; const okS=(c.evidenceScore||0)>=min; const hay=[c.name,c.names?.en,c.names?.ku,c.names?.fa,c.names?.tr,c.names?.ar].filter(Boolean).join(' ').toLocaleLowerCase(); return okR&&okS&&(!q||hay.includes(q));
    });
    const lang=window.currentLang||'ku', L=labels[lang]||labels.ku;
    const countDoc=cities.reduce((n,c)=>n+(c.evidenceScore||0),0), max=cities.length*11;
    summary.textContent=`${cities.length} | ${L.score}: ${cities.length?Math.round(countDoc/max*100):0}%`;
    body.innerHTML=cities.map(c=>{
      const e=c.evidence||{}; const cell=k=>`<span class="evidence-dot ${e[k]?.status==='documented'?'yes':'no'}">${e[k]?.status==='documented'?'✓':'○'}</span>`;
      const integrity=c.recordIntegrity==='duplicate-name'?L.duplicate:'✓';
      return `<tr><td><button class="evidence-city-link" type="button" data-city-id="${c.id}">${cityLabel(c)}</button></td><td>${c.part}</td><td><b>${c.evidenceScore||0}/11</b></td><td>${cell('population')}</td><td>${cell('history')}</td><td>${cell('heritage')}</td><td>${cell('culture')}</td><td>${cell('languages')}</td><td>${cell('economy')}</td><td>${cell('sources')}</td><td>${integrity}</td></tr>`;
    }).join('') || `<tr><td colspan="11">${L.none}</td></tr>`;
    body.querySelectorAll('.evidence-city-link').forEach(b=>b.addEventListener('click',()=>{const c=window.KURD_CITIES.find(x=>x.id===b.dataset.cityId); if(!c)return; window.__showKurdPart?.(c.part,true); setTimeout(()=>{const target=[...document.querySelectorAll('.city-name')].find(x=>x.textContent===cityLabel(c)); if(target)target.click();},300);}));
  }
  function wire(){['evidence-region','evidence-score','evidence-search'].forEach(id=>document.getElementById(id)?.addEventListener('input',render)); render();}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',wire); else wire();
  window.__refreshEvidenceLedger=render;
  const sel=document.getElementById('language'); if(sel)sel.addEventListener('change',()=>setTimeout(render,0));
})();

/* === V4.3-C — Mobile navigation + accessibility controls === */
(function(){
  function initMobileNav(){
    const toggle=document.getElementById('mobile-nav-toggle');
    const nav=document.getElementById('site-nav');
    const header=document.querySelector('header');
    if(!toggle||!nav||!header||toggle.dataset.ready==='1') return;
    toggle.dataset.ready='1';
    const setLabel=(open)=>{
      const lang=window.KURD_LANG||document.documentElement.lang||'ku';
      const key=open?'ariaClose':'ariaOpen';
      toggle.setAttribute('aria-label',toggle.getAttribute('data-'+key+'-'+lang)||toggle.getAttribute('data-'+key+'-en')||'Menu');
    };
    const setOpen=(open,focusNav)=>{
      header.classList.toggle('mobile-nav-open',open);
      toggle.setAttribute('aria-expanded',String(open));
      setLabel(open);
      if(open&&focusNav){const first=nav.querySelector('a'); if(first) first.focus();}
    };
    toggle.addEventListener('click',()=>setOpen(!header.classList.contains('mobile-nav-open'),true));
    nav.addEventListener('click',e=>{if(e.target.closest('a')) setOpen(false,false);});
    document.addEventListener('click',e=>{
      if(header.classList.contains('mobile-nav-open') && !header.contains(e.target)) setOpen(false,false);
    });
    document.addEventListener('keydown',e=>{
      if(e.key==='Escape' && header.classList.contains('mobile-nav-open')){setOpen(false,false);toggle.focus();}
    });
    const sel=document.getElementById('language'); if(sel) sel.addEventListener('change',()=>setLabel(header.classList.contains('mobile-nav-open')));
    setOpen(false,false);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initMobileNav); else initMobileNav();
})();

/* V4.3-C — keep dynamic images efficient and accessible */
(function(){
  function hardenImages(){
    document.querySelectorAll('img').forEach(img=>{
      if(!img.hasAttribute('decoding')) img.setAttribute('decoding','async');
      if(!img.hasAttribute('alt')) img.setAttribute('alt','');
      if(img.closest('.hero-art')){
        img.loading='eager';
        img.setAttribute('fetchpriority','high');
      }else if(!img.hasAttribute('loading')){
        img.loading='lazy';
      }
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',hardenImages); else hardenImages();
})();
