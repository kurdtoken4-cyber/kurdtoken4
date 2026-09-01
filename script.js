(function(){
  const select=document.getElementById('language');
  const supported=['ku','fa','en','tr','ar'];
  // 20 Reşeme 2726 = 20 March 2027. Countdown target: 00:00 Rojhelat (UTC+03:30).
  const launchTarget=new Date('2027-03-20T00:00:00+03:30').getTime();
  const launchDates={
    ku:{date:'٢٠ ڕەشەمە ٢٧٢٦',calendar:'ساڵنامەی کوردی'},
    fa:{date:'۲۹ اسفند ۱۴۰۵',calendar:'تقویمی هەتاوی'},
    en:{date:'20 March 2027',calendar:'Gregorian calendar'},
    tr:{date:'20 Mart 2027',calendar:'Miladi takvim'},
    ar:{date:'١٢ شوال ١٤٤٨',calendar:'التقويم الهجري'}
  };
  function setLang(lang){
    if(!supported.includes(lang)) lang='ku';
    document.querySelectorAll('[data-ku]').forEach(el=>{ const value=el.getAttribute('data-'+lang); if(value!==null) el.textContent=value; });
    document.documentElement.lang=lang;
    document.documentElement.dir=(lang==='ar'||lang==='fa'||lang==='ku')?'rtl':'ltr';
    document.body.dataset.lang=lang;
    if(select) select.value=lang;
    localStorage.setItem('kurdtoken-lang',lang);
    document.querySelectorAll('.launch-date').forEach(el=>el.textContent=launchDates[lang].date);
    document.querySelectorAll('.launch-calendar').forEach(el=>el.textContent=launchDates[lang].calendar);
    updateCountdown();
  }
  function digits(value,lang){ const s=String(value).padStart(2,'0'); return (lang==='ku'||lang==='fa'||lang==='ar') ? s.replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[Number(d)]) : s; }
  function updateCountdown(){
    const lang=(select&&supported.includes(select.value))?select.value:'ku';
    let diff=Math.max(0,launchTarget-Date.now());
    const days=Math.floor(diff/86400000); diff%=86400000;
    const hours=Math.floor(diff/3600000); diff%=3600000;
    const minutes=Math.floor(diff/60000); diff%=60000;
    const seconds=Math.floor(diff/1000);
    [['cd-days',days],['cd-hours',hours],['cd-minutes',minutes],['cd-seconds',seconds],['banner-cd-days',days],['banner-cd-hours',hours],['banner-cd-minutes',minutes],['banner-cd-seconds',seconds]].forEach(([id,v])=>{ const el=document.getElementById(id); if(el) el.textContent=digits(v,lang); });
  }
  if(select) select.addEventListener('change',e=>setLang(e.target.value));
  setLang(localStorage.getItem('kurdtoken-lang')||'ku');
  setInterval(updateCountdown,1000);
})();
