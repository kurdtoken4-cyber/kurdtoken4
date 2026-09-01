const select=document.getElementById('language');
let currentLang=localStorage.getItem('kurdtoken-lang')||'ku';
const labels={
 ku:{close:'داخستن',more:'زانیاری زیاتر',country:'وڵات',population:'دانیشتوان',history:'پێشینە',attractions:'شوێنە سەیرانەکان',notAvailable:'زانیاریی تایبەت بە ساڵی سەرشماری پێویستی بە سەرچاوەی پشتڕاستکراوە هەیە'},
 fa:{close:'بستن',more:'اطلاعات بیشتر',country:'کشور',population:'جمعیت',history:'پیشینه',attractions:'دیدنی‌ها',notAvailable:'اطلاعات دقیق جمعیت وابسته به سال سرشماری و منبع معتبر است'},
 en:{close:'Close',more:'More information',country:'Country',population:'Population',history:'History',attractions:'Attractions',notAvailable:'Verified population data depends on the census year and a reliable source'},
 tr:{close:'Kapat',more:'Daha fazla bilgi',country:'Ülke',population:'Nüfus',history:'Tarihçe',attractions:'Gezilecek yerler',notAvailable:'Doğrulanmış nüfus verisi sayım yılına ve güvenilir kaynağa bağlıdır'},
 ar:{close:'إغلاق',more:'معلومات أكثر',country:'الدولة',population:'السكان',history:'التاريخ',attractions:'المعالم',notAvailable:'تعتمد بيانات السكان الموثوقة على سنة التعداد والمصدر المعتمد'}
};
const regionKey={east:{ku:'ڕۆژهەڵات',fa:'روژهلات',en:'Rojhelat',tr:'Rojhelat',ar:'روج هلات'},north:{ku:'باکوور',fa:'باکوور',en:'Bakur',tr:'Bakur',ar:'باكور'},south:{ku:'باشوور',fa:'باشوور',en:'Başûr',tr:'Başûr',ar:'باشور'},west:{ku:'ڕۆژئاوا',fa:'روژئاوا',en:'Rojava',tr:'Rojava',ar:'روج آفا'}};
const country={ku:{east:'ئێران',north:'تورکیا',south:'عێراق',west:'سوریا'},fa:{east:'ایران',north:'ترکیه',south:'عراق',west:'سوریه'},en:{east:'Iran',north:'Türkiye',south:'Iraq',west:'Syria'},tr:{east:'İran',north:'Türkiye',south:'Irak',west:'Suriye'},ar:{east:'إيران',north:'تركيا',south:'العراق',west:'سوريا'}};
const regionPart={east:'ڕۆژهەڵات',north:'باکوور',south:'باشوور',west:'ڕۆژئاوا'};
const displayName=(c,lang)=>{ const n=c.names||{}; return n[lang]|| (lang==='ku'?c.name:c.wiki||c.name); };
/* Language switching is handled by the single KurdTokenSetLanguage system at the
   bottom of this file. It keeps `currentLang` in sync and re-renders any open
   region/city panels via window.__showKurdPart (exposed inside renderCities). */

function renderCities(){
 const host=document.getElementById('regionCities');if(!host||!window.KURD_CITIES)return;
 const buttons=[...document.querySelectorAll('.region-card')];const grouped={};
 KURD_CITIES.forEach(c=>(grouped[c.part]??=[]).push(c));
 function showPart(part,scroll=true){
  const cities=grouped[part]||[];host.hidden=false;host.innerHTML='';
  const key=Object.keys(regionPart).find(k=>regionPart[k]===part);
  const title=document.createElement('div');title.className='region-cities-head';
  const h=document.createElement('h3');h.textContent=regionKey[key]?.[currentLang]||part;title.appendChild(h);
  const close=document.createElement('button');close.type='button';close.className='close-region';close.textContent='×';close.setAttribute('aria-label',labels[currentLang].close);close.onclick=()=>{host.hidden=true;host.innerHTML='';buttons.forEach(b=>b.classList.remove('active'));};title.appendChild(close);host.appendChild(title);
  const list=document.createElement('div');list.className='city-list';
  cities.forEach(c=>{const item=document.createElement('button');item.type='button';item.className='city-name';item.textContent=displayName(c,currentLang);item.onclick=()=>showCity(c,item);list.appendChild(item);});host.appendChild(list);
  buttons.forEach(b=>b.classList.toggle('active',b.dataset.part===part));
  if(scroll)host.scrollIntoView({behavior:'smooth',block:'start'});
 }
 function showCity(c,clicked){
  let detail=host.querySelector('.city-detail');if(detail)detail.remove();
  detail=document.createElement('article');detail.className='city-detail';
  const gallery=document.createElement('div');gallery.className='city-gallery';
  (c.images||[]).slice(0,2).forEach(src=>{const img=document.createElement('img');img.src=src;img.alt=displayName(c,currentLang);img.loading='lazy';gallery.appendChild(img);});
  const body=document.createElement('div');body.className='city-detail-body';
  const title=document.createElement('h4');title.textContent=displayName(c,currentLang);body.appendChild(title);
  const key=Object.keys(regionPart).find(k=>regionPart[k]===c.part);
  const p1=document.createElement('p');p1.innerHTML='<b>'+labels[currentLang].country+':</b> '+(country[currentLang]?.[key]||c.country);body.appendChild(p1);
  const p2=document.createElement('p');p2.innerHTML='<b>'+labels[currentLang].history+':</b> '+(c.description?.[currentLang]||c.description?.ku||'—');body.appendChild(p2);
  const p3=document.createElement('p');p3.innerHTML='<b>'+labels[currentLang].attractions+':</b> '+(c.attraction?.[currentLang]||c.attraction||labels[currentLang].notAvailable);body.appendChild(p3);
  const p4=document.createElement('p');p4.innerHTML='<b>'+labels[currentLang].population+':</b> '+(c.population?.[currentLang]||c.population||labels[currentLang].notAvailable);body.appendChild(p4);
  detail.append(gallery,body);host.appendChild(detail);document.querySelectorAll('.city-name').forEach(x=>x.classList.remove('active'));clicked.classList.add('active');detail.scrollIntoView({behavior:'smooth',block:'nearest'});
 }
 buttons.forEach(b=>b.addEventListener('click',()=>showPart(b.dataset.part)));
 window.__showKurdPart=showPart; // exposes the region/city renderer so language switching can refresh it
}
renderCities();

// Exact launch countdown: 20 Reşeme 2726 = 11 March 2027 in the Kurdish solar calendar.
(function(){
 const target=new Date('2027-03-11T00:00:00');
 const ids={d:document.getElementById('cd-days'),h:document.getElementById('cd-hours'),m:document.getElementById('cd-minutes'),s:document.getElementById('cd-seconds')};
 if(!ids.d)return;
 function tick(){let diff=Math.max(0,target.getTime()-Date.now());let total=Math.floor(diff/1000);let d=Math.floor(total/86400);total%=86400;let h=Math.floor(total/3600);total%=3600;let m=Math.floor(total/60);let sec=total%60;ids.d.textContent=String(d).padStart(3,'0');ids.h.textContent=String(h).padStart(2,'0');ids.m.textContent=String(m).padStart(2,'0');ids.s.textContent=String(sec).padStart(2,'0');}
tick();setInterval(tick,1000);
})();




/* KURDTOKEN PROFESSIONAL UI — one language system, no duplicate language handlers. */
(function(){
  const LANG_KEY='kurdtoken-lang';
  const regionNames={
    east:{ku:'ڕۆژهەڵات',fa:'روژهلات',en:'Rojhelat',tr:'Rojhelat',ar:'روج هلات'},
    north:{ku:'باکوور',fa:'باکوور',en:'Bakur',tr:'Bakur',ar:'باكور'},
    south:{ku:'باشوور',fa:'باشور',en:'Başûr',tr:'Başûr',ar:'باشور'},
    west:{ku:'ڕۆژئاوا',fa:'روژئاوا',en:'Rojava',tr:'Rojava',ar:'روج آفا'}
  };
  const sectionText={
    places:{ku:'شوێنە مێژوویی و سروشتییەکان و شارە گرنگەکانی ئەم ناوچەیە بە پەیوەندیی جۆگرافیایی و مێژوویی ناسێنراون.',fa:'مکان‌های تاریخی، طبیعی و شهرهای مهم این بخش با زمینه جغرافیایی و تاریخی معرفی می‌شوند.',en:'Important cities and historical or natural places in this region are presented with geographic and historical context.',tr:'Bu bölgenin önemli şehirleri ile tarihî ve doğal alanları coğrafi ve tarihî bağlamıyla tanıtılır.',ar:'تُعرّف المدن المهمة والمواقع التاريخية والطبيعية في هذه المنطقة ضمن سياق جغرافي وتاريخي.'},
    people:{ku:'شاعیران، زانایان، مێژووناسان و هونەرمەندانی ناوچەکە بە پشتبەستن بە بەڵگە و سەرچاوەی باوەڕپێکراو ناسێنراون.',fa:'شاعران، دانشمندان، تاریخ‌نگاران و هنرمندان این بخش بر پایه منابع معتبر معرفی می‌شوند.',en:'Poets, scholars, historians and artists associated with this region are presented using reliable sources.',tr:'Bu bölgeyle ilişkili şairler, bilginler, tarihçiler ve sanatçılar güvenilir kaynaklarla tanıtılır.',ar:'تُعرض الشخصيات الأدبية والعلمية والتاريخية والفنية المرتبطة بهذه المنطقة بالاعتماد على مصادر موثوقة.'},
    music:{ku:'میراثی دنگبێژی، گۆرانیی نەریتی و مۆسیقای نوێی ناوچەکە بە جیاوازیی کەلتووری ناسێنراوە.',fa:'میراث دنگ‌بێژی، موسیقی سنتی و موسیقی معاصر این بخش با توجه به تنوع فرهنگی معرفی می‌شود.',en:'Dengbêj traditions, traditional music and contemporary artists of the region are presented in their cultural context.',tr:'Bölgenin dengbêj geleneği, geleneksel müziği ve çağdaş sanatçıları kültürel bağlamıyla tanıtılır.',ar:'تُعرض تقاليد الدنغبج والموسيقى التقليدية والفنانون المعاصرون في المنطقة ضمن سياقهم الثقافي.'},
    handicrafts:{ku:'قالین، جاجم، بافت و پیشەسازییە دەستییەکان بە پەیوەندیی ناوچە و شێوازی کارکردن ناسێنراون.',fa:'قالی، جاجیم، بافته‌ها و صنایع دستی با توجه به تفاوت‌های منطقه‌ای معرفی می‌شوند.',en:'Carpets, jajim, textiles and other crafts are presented with attention to regional techniques and traditions.',tr:'Halı, jajim, dokuma ve diğer el sanatları bölgesel teknik ve geleneklerle birlikte tanıtılır.',ar:'تُعرض السجاد والجاجيم والمنسوجات والحرف اليدوية مع إبراز التقنيات والتقاليد الإقليمية.'},
    clothing:{ku:'جل و بەرگی ژن و پیاوی کورد بە شێوەی جیاواز لە هەر ناوچەیەکدا ناسێنراوە.',fa:'پوشاک زنان و مردان کرد با تفاوت‌های منطقه‌ای هر بخش معرفی می‌شود.',en:'Kurdish women’s and men’s clothing is presented according to the distinctive style of each region.',tr:'Kürt kadın ve erkek kıyafetleri her bölgenin kendine özgü tarzına göre tanıtılır.',ar:'تُعرض ملابس النساء والرجال الكرد وفق الأنماط المميزة لكل منطقة.'},
    food:{ku:'خواردن و شیرینی و شێوازی چێشتلێنان بە پەیوەندیی بەرهەم و نەریتی ناوچەکە ناسێنراوە.',fa:'غذاها، شیرینی‌ها و شیوه‌های آشپزی با توجه به مواد و سنت‌های هر منطقه معرفی می‌شوند.',en:'Foods, sweets and cooking traditions are presented according to local ingredients and regional customs.',tr:'Yemekler, tatlılar ve pişirme gelenekleri yerel malzemeler ve bölgesel adetlerle tanıtılır.',ar:'تُعرض الأطعمة والحلويات وتقاليد الطبخ وفق المكونات المحلية والعادات الإقليمية.'},
    languages:{ku:'زمان و شێوەزارەکانی ناوچەکە بە پەیوەندیی مێژوویی و کۆمەڵایەتی ناسێنراون.',fa:'زبان‌ها و گونه‌های زبانی این بخش در زمینه تاریخی و اجتماعی معرفی می‌شوند.',en:'The languages and varieties used in this region are presented in their historical and social context.',tr:'Bu bölgede kullanılan diller ve dil çeşitleri tarihî ve toplumsal bağlamıyla tanıtılır.',ar:'تُعرض اللغات والتنوعات اللغوية المستخدمة في هذه المنطقة ضمن سياقها التاريخي والاجتماعي.'},
    culture:{ku:'میراثی مێژوویی و کەلتووری ناوچەکە لەگەڵ شار، زمان، هونەر و نەریتەکانیدا ناسێنراوە.',fa:'میراث تاریخی و فرهنگی این بخش همراه با شهرها، زبان، هنر و سنت‌ها معرفی می‌شود.',en:'The region’s historical and cultural heritage is presented together with its cities, language, arts and traditions.',tr:'Bölgenin tarihî ve kültürel mirası şehirleri, dili, sanatı ve gelenekleriyle birlikte tanıtılır.',ar:'يُعرض التراث التاريخي والثقافي للمنطقة مع مدنها ولغتها وفنونها وتقاليدها.'}
  };

  function currentLanguage(){ return localStorage.getItem(LANG_KEY)||document.documentElement.lang||'ku'; }
  function applyAllLanguage(lang){
    lang=['ku','fa','en','tr','ar'].includes(lang)?lang:'ku';
    currentLang=lang; // keep the shared variable used by renderCities()/showPart()/showCity() in sync
    localStorage.setItem(LANG_KEY,lang);
    document.documentElement.lang=lang;
    document.documentElement.dir=(lang==='en'||lang==='tr')?'ltr':'rtl';
    document.querySelectorAll('[data-'+lang+']').forEach(el=>{ el.textContent=el.getAttribute('data-'+lang); });
    document.querySelectorAll('[data-alt-'+lang+']').forEach(el=>{ el.alt=el.getAttribute('data-alt-'+lang); });
    const sel=document.getElementById('language'); if(sel) sel.value=lang;
    document.title=({ku:'KURDTOKEN | کوردستان',fa:'KURDTOKEN | کردستان',en:'KURDTOKEN | Kurdistan',tr:'KURDTOKEN | Kürdistan',ar:'KURDTOKEN | كردستان'})[lang];
    refreshFourParts(lang);
    const open=document.querySelector('.region-card.active'); if(open && window.__showKurdPart) window.__showKurdPart(open.dataset.part,false);
  }

  function refreshFourParts(lang){
    document.querySelectorAll('[data-four-parts-widget]').forEach(widget=>{
      const sec=widget.closest('[data-cultural-section]'); const key=sec?.getAttribute('data-cultural-section');
      const buttons=[...widget.querySelectorAll('.four-part-btn')];
      buttons.forEach(b=>b.textContent=b.getAttribute('data-'+lang)||b.textContent);
      const active=widget.querySelector('.four-part-btn.active');
      if(active) renderFourPart(widget,key,active.dataset.region,lang,false);
    });
  }
  function renderFourPart(widget,key,region,lang,scroll){
    const btn=widget.querySelector('.four-part-btn[data-region="'+region+'"]'); if(!btn)return;
    widget.querySelectorAll('.four-part-btn').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-selected',b===btn?'true':'false');});
    const detail=widget.querySelector('.four-parts-detail'); const title=widget.querySelector('.four-parts-detail-title'); const text=widget.querySelector('.four-parts-detail-text');
    title.textContent=regionNames[region]?.[lang]||region;
    text.textContent=sectionText[key]?.[lang]||'';
    detail.hidden=false;
    if(scroll) widget.scrollIntoView({behavior:'smooth',block:'nearest'});
  }
  document.addEventListener('click',e=>{
    const b=e.target.closest('.four-part-btn');
    if(b){ const w=b.closest('[data-four-parts-widget]'); const key=w.closest('[data-cultural-section]')?.getAttribute('data-cultural-section'); renderFourPart(w,key,b.dataset.region,currentLanguage(),true); return; }
    const card=e.target.closest('.click-card');
    if(card){
      const expanded=card.classList.toggle('expanded'); card.setAttribute('aria-expanded',expanded?'true':'false');
    }
  });
  document.addEventListener('keydown',e=>{
    if((e.key==='Enter'||e.key===' ') && e.target.classList.contains('click-card')){e.preventDefault();e.target.click();}
  });
  window.KurdTokenSetLanguage=applyAllLanguage;
  if(select) select.addEventListener('change',e=>applyAllLanguage(e.target.value));
  window.addEventListener('DOMContentLoaded',()=>applyAllLanguage(currentLanguage()));
})();
