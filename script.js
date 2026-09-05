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
    culture:{ku:'میراثی مێژوویی و کەلتووری ناوچەکە لەگەڵ شار، زمان، هونەر و نەریتەکانیدا ناسێنراوە.',fa:'میراث تاریخی و فرهنگی این بخش همراه با شهرها، زبان، هنر و سنت‌ها معرفی می‌شود.',en:'The region’s historical and cultural heritage is presented together with its cities, language, arts and traditions.',tr:'Bölgenin tarihî ve kültürel mirası şehirleri, dili, sanatı ve gelenekleriyle birlikte tanıtılır.',ar:'يُعرض التراث التاريخي والثقافي للمنطقة مع مدنها ولغتها وفنونها وتقاليدها.'}
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
    const launch=Date.parse('2027-03-11T00:00:00+03:30');
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
    if(photos.length && image){image.src=photos[0].url;image.alt=`${weeklyText[lang].week}: ${cityName(city)}`;image.hidden=false;image.onerror=()=>{image.onerror=null;image.src=localFallback(city);image.hidden=false;};if(credit)credit.innerHTML=window.KURDTOKEN_COMMONS.attribution(photos[0]);if(loading)loading.style.display='none';}
    else if(image){image.src=localFallback(city);image.hidden=false;image.onerror=()=>{image.onerror=null;image.src=genericFallback();};if(loading)loading.style.display='none';if(credit)credit.textContent=`${weeklyText[lang].source}: KURD Token local fallback`;}
  }

  function getRich(city){
    if(city.name==='هەولێر' || city.names?.en==='Erbil') return {
      population:{ku:'نزیکەی ٨٤٦ هەزار (ئاماری ٢٠١٥؛ ژمارەکە بە پێی سنووری ئاماری جیاواز دەگۆڕێت)',fa:'حدود ۸۴۶ هزار نفر (رقم شهری ۲۰۱۵؛ بسته به محدوده آماری متفاوت است)',en:'About 846,000 (2015 city figure; varies by statistical boundary)',tr:'Yaklaşık 846.000 (2015 şehir verisi; istatistiksel sınıra göre değişebilir)',ar:'نحو 846 ألف نسمة (رقم مديني لعام 2015؛ يختلف حسب الحدود الإحصائية)'},
      history:{ku:'هەولێر شارێکی زۆر کۆنە و قەڵاکەی لە ٢٠١٤ لە میراتی جیهانی یونسکۆ تۆمارکرا.',fa:'هەولێر شهری بسیار کهن است و ارگ آن در سال ۲۰۱۴ در فهرست میراث جهانی یونسکو ثبت شد.',en:'Erbil is an ancient city; its citadel was inscribed as a UNESCO World Heritage Site in 2014.',tr:'Erbil çok eski bir şehirdir; kalesi 2014 yılında UNESCO Dünya Mirası Listesi’ne alındı.',ar:'أربيل مدينة عريقة؛ وأُدرجت قلعتها ضمن قائمة التراث العالمي لليونسكو عام 2014.'},
      crafts:{ku:'قالین و بەرهەمی دەستی، نەساجی، زیوەر و کاری فلزی لە بازاڕە کۆنەکاندا ناسراون.',fa:'قالی و بافته‌ها، صنایع دستی، زیورآلات و فلزکاری در بازارهای سنتی شهر دیده می‌شوند.',en:'Carpets and textiles, crafts, jewelry and metalwork are associated with the city’s traditional markets.',tr:'Halı ve dokuma, el sanatları, takı ve metal işçiliği geleneksel çarşılarda görülür.',ar:'ترتبط السجاد والمنسوجات والحرف والمجوهرات والأعمال المعدنية بالأسواق التقليدية في المدينة.'},
      customs:{ku:'میوانداری، بازاڕی قیصەری، بۆنە کوردییەکان و خواردنی ناوخۆیی بەشێکن لە ژیانی کەلتووری شار.',fa:'مهمان‌نوازی، بازار قیصری، آیین‌های کردی و غذاهای محلی از عناصر فرهنگی شهر هستند.',en:'Hospitality, the Qaysari Bazaar, Kurdish celebrations and local food are part of the city’s cultural life.',tr:'Misafirperverlik, Kayseri Çarşısı, Kürt kutlamaları ve yerel yemekler şehrin kültürel yaşamının parçalarıdır.',ar:'الضيافة والبازار القيصري والاحتفالات الكردية والأطعمة المحلية من عناصر الحياة الثقافية للمدينة.'},
      income:{ku:'خزمەتگوزاری و دامەزراوە حکومییەکان، بازرگانی و بازاڕ، بیناسازی، گەشتیاری و هەندێک چالاکیی کشتوکاڵی لە ناوچەی دەوروبەر.',fa:'خدمات و بخش عمومی، بازرگانی و تجارت، ساخت‌وساز، گردشگری و بخشی از کشاورزی پیرامون شهر.',en:'Public services, trade and commerce, construction, tourism and some surrounding agriculture are important parts of the local economy.',tr:'Kamu hizmetleri, ticaret, inşaat, turizm ve çevredeki tarım yerel ekonominin önemli parçalarıdır.',ar:'تشكل الخدمات العامة والتجارة والبناء والسياحة وبعض الزراعة المحيطة أجزاء مهمة من الاقتصاد المحلي.'},
      attractions:{ku:'قەڵای هەولێر، بازاڕی قیصەری، مینارەی مەظفەری و ناوچە کۆنەکانی شار.',fa:'ارگ اربیل، بازار قیصری، مناره مظفری و بافت تاریخی شهر.',en:'Erbil Citadel, Qaysari Bazaar, Mudhafaria Minaret and the historic urban core.',tr:'Erbil Kalesi, Kayseri Çarşısı, Mudhafaria Minaresi ve tarihî şehir merkezi.',ar:'قلعة أربيل والبازار القيصري ومنارة المظفرية والنواة التاريخية للمدينة.'}
    };
    return {
      population:{ku:city.population||'زانیاریی دانیشتووان لە پەڕەی سەرچاوەدا نوێ دەکرێتەوە',fa:city.population||'آمار جمعیت باید با منبع و سال سرشماری ثبت شود',en:city.population||'Population figure should be tied to a cited census year',tr:city.population||'Nüfus verisi kaynak ve sayım yılıyla verilmelidir',ar:city.population||'يجب ربط رقم السكان بمصدر وسنة تعداد'},
      history:{ku:city.description?.ku||'زانیاریی مێژوویی لە حالەتی پەرەپێدانە',fa:city.history||city.description?.fa||'اطلاعات تاریخی در حال تکمیل است',en:city.history||city.description?.en||'Historical details are being expanded',tr:city.history||city.description?.tr||'Tarih bilgileri geliştiriliyor',ar:city.history||city.description?.ar||'يجري توسيع المعلومات التاريخية'},
      crafts:{ku:'پێویستی بە زانیاریی تایبەتی شارەکە هەیە',fa:'برای این شهر اطلاعات اختصاصی در حال تکمیل است',en:'City-specific information is being expanded',tr:'Şehre özel bilgiler geliştiriliyor',ar:'يجري استكمال المعلومات الخاصة بالمدينة'},
      customs:{ku:'پێویستی بە زانیاریی تایبەتی شارەکە هەیە',fa:'برای این شهر اطلاعات اختصاصی در حال تکمیل است',en:'City-specific information is being expanded',tr:'Şehre özel bilgiler geliştiriliyor',ar:'يجري استكمال المعلومات الخاصة بالمدينة'},
      income:{ku:'پێویستی بە سەرچاوەی ئابووری تایبەتی شارەکە هەیە',fa:'منابع درآمد اختصاصی شهر باید با منبع معتبر ثبت شود',en:'City-specific economic data should be tied to reliable sources',tr:'Şehre özgü ekonomik veriler güvenilir kaynaklara bağlanmalıdır',ar:'يجب ربط البيانات الاقتصادية الخاصة بالمدينة بمصادر موثوقة'},
      attractions:{ku:city.attraction||'—',fa:city.attraction||'—',en:city.attraction||'—',tr:city.attraction||'—',ar:city.attraction||'—'}
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
      host.innerHTML=items.map(p=>{const i=p.imageinfo?.[0]||{}; const meta=i.extmetadata||{}; const title=(p.title||'').replace(/^File:/,''); const artist=(meta.Artist?.value||'').replace(/<[^>]+>/g,'').slice(0,180); const lic=(meta.LicenseShortName?.value||'').replace(/<[^>]+>/g,'').slice(0,100); return `<figure><img loading="lazy" src="${i.thumburl||i.url||''}" alt="${title.replace(/"/g,'&quot;')}"><figcaption><b>${title}</b><br>${artist?artist+' · ':''}${lic}</figcaption></figure>`}).join('');
    }catch(e){ host.innerHTML='<div class="gallery-loading">Images are loaded from Wikimedia Commons when available; each file retains its own attribution and license.</div>'; }
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
    async function renderCity(city,clicked,scroll=true){
      activeCity=city; const old=host.querySelector('.city-detail'); if(old) old.remove();
      const detail=document.createElement('article'); detail.className='city-detail'; const gallery=document.createElement('div'); gallery.className='city-gallery';
      const loading=document.createElement('div'); loading.className='photo-loading'; loading.textContent=labels[lang].image+'…'; gallery.appendChild(loading);
      const body=document.createElement('div'); body.className='city-detail-body'; const h=document.createElement('h4'); h.textContent=cityName(city); body.appendChild(h);
      const key=({ 'ڕۆژهەڵات':'east','باکوور':'north','باشوور':'south','ڕۆژئاوا':'west'})[city.part]; const p0=document.createElement('p'); p0.innerHTML=`<b>${labels[lang].country}:</b> ${(countryByPart[key]||{})[lang]||city.country||'—'}`; body.appendChild(p0);
      const rich=getRich(city); const rows=[['history',rich.history],['population',rich.population],['crafts',rich.crafts],['customs',rich.customs],['income',rich.income],['attractions',rich.attractions]];
      rows.forEach(([k,v])=>{const p=document.createElement('p'); p.innerHTML=`<b>${cityLabel[lang][k]}:</b> ${v?.[lang]||v||'—'}`; body.appendChild(p);});
      detail.append(gallery,body); host.appendChild(detail); host.querySelectorAll('.city-name').forEach(x=>x.classList.remove('active')); if(clicked) clicked.classList.add('active');
      let photos=[]; if(window.KURDTOKEN_COMMONS) photos=await window.KURDTOKEN_COMMONS.searchMany(city,2);
      gallery.innerHTML='';
      if(!photos.length){ const img=document.createElement('img'); img.src=localFallback(city); img.onerror=()=>{img.onerror=null;img.src=genericFallback();}; img.alt=`${labels[lang].image}: ${cityName(city)}`; gallery.appendChild(img); const note=document.createElement('div'); note.className='photo-credit'; note.textContent=labels[lang].source+': KURD Token local fallback'; gallery.appendChild(note); }
      else photos.forEach(photo=>{ const wrap=document.createElement('figure'); const img=document.createElement('img'); img.src=photo.url; img.alt=`${labels[lang].image}: ${cityName(city)}`; img.loading='lazy'; img.onerror=()=>{img.src=localFallback(city); img.onerror=()=>{img.onerror=null;img.src=genericFallback();};}; wrap.appendChild(img); wrap.insertAdjacentHTML('beforeend',window.KURDTOKEN_COMMONS.attribution(photo)); gallery.appendChild(wrap); });
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

  // Launch target: 20 ڕه‌شه‌مێ 2726 = 20 اسفند 1405 = 11 March 2027. National Clothing Day is 10 March in the Kurdistan Region calendar; the site does not claim the launch date is the clothing day.
  function initCountdown(){
    const target=Date.parse('2027-03-11T00:00:00+03:30');
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
        img.alt='KURD Token';
        img.loading='lazy';
        card.prepend(img);
      }
    });
    const modal=document.getElementById('master-modal');
    const body=document.getElementById('master-modal-body');
    const title=document.getElementById('master-modal-title');
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
    };
    const open=(id)=>{
      const sec=sections[id]||document.getElementById(id); if(!sec) return;
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
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('is-open'))restore();});
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
