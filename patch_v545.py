from bs4 import BeautifulSoup
from pathlib import Path
p=Path('/mnt/data/v544/index.html')
s=BeautifulSoup(p.read_text(encoding='utf-8'),'html.parser')
imgs={
'kurd-token':'assets/hero-main.webp',
'trade':'https://commons.wikimedia.org/wiki/Special:Redirect/file/BNB%2C_native_cryptocurrency_for_the_Binance_Smart_Chain.svg',
'weekly-city':'assets/city-placeholder.jpg',
'kurdistan':'https://commons.wikimedia.org/wiki/Special:Redirect/file/Geopolitical_Map_of_Greater_Kurdistan_and_Middle_East.jpg',
'history':'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ancient_Kurdistan.png',
'places':'https://commons.wikimedia.org/wiki/Special:Redirect/file/Bisotoun%20Inscription.jpg',
'people':'https://commons.wikimedia.org/wiki/Special:FilePath/Melay%C3%AA%C3%A7o.png',
'music':'https://upload.wikimedia.org/wikipedia/commons/e/ee/Hassan_Zirak-Hesen_Z%C3%AErek_Kurdish_Composer_and_folk_Singer.jpg',
'handicrafts':'https://commons.wikimedia.org/wiki/Special:Redirect/file/Detail._A_mannequin_with_traditional_Kurdish_attire_and_a_multitude_of_accessories._The_dress_and_silver_accessories_were_made_by_Jewish_craftsmanship_in_Sulaymaniyah%2C_100_years_ago._Kurds_Heritage_Museum%2C_Sulaymaniyah%2C_Iraq.jpg',
'clothing':'https://commons.wikimedia.org/wiki/Special:Redirect/file/Traditional_Kurdish_Clothing_-_Kurdish_national_costumes.jpg',
'food':'https://commons.wikimedia.org/wiki/Special:Redirect/file/Kurdish%20Food.jpeg',
'languages':'https://commons.wikimedia.org/wiki/Special:Redirect/file/Branches_of_the_Kurdish_language,_Northern,_Central,_Southern.png',
'research':'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ancient_Kurdistan.png',
'culture':'https://commons.wikimedia.org/wiki/Special:Redirect/file/Kurdish_people_dancing_during_newroz.jpg',
'community':'https://commons.wikimedia.org/wiki/Special:Redirect/file/Kurdish_people_dancing_during_newroz.jpg',
'religion':'https://commons.wikimedia.org/wiki/Special:Redirect/file/Great%20Mosque%20of%20Diyarbakir%2C%20Turkey.jpg'
}
for b in s.select('.master-nav-card[data-target]'):
    t=b.get('data-target')
    if t in imgs:
        b['data-card-image']=imgs[t]
# Add a semantic hidden label for the visual cover (not visible, but accessible context)
css=Path('/mnt/data/v544/styles.css')
style='''\n/* V5.45 — photographic editorial card covers */\n.master-nav-card{\n  --card-image:none;\n  --card-accent:#c79a45;\n  min-height:238px!important;\n  padding:22px!important;\n  isolation:isolate;\n  background-image:\n    linear-gradient(180deg,rgba(5,8,6,.10) 0%,rgba(5,8,6,.22) 28%,rgba(5,8,6,.82) 72%,rgba(5,8,6,.97) 100%),\n    var(--card-image)!important;\n  background-size:cover!important;\n  background-position:center!important;\n  background-repeat:no-repeat!important;\n  border:1px solid color-mix(in srgb,var(--card-accent) 52%,transparent)!important;\n  box-shadow:0 14px 36px rgba(0,0,0,.30),inset 0 0 0 1px rgba(255,255,255,.035);\n}\n.master-nav-card::before{\n  content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;\n  background:linear-gradient(115deg,rgba(0,0,0,.02),color-mix(in srgb,var(--card-accent) 15%,transparent) 58%,rgba(0,0,0,.15));\n}\n.master-nav-card::after{\n  content:""!important;position:absolute;left:18px;right:18px;bottom:11px;z-index:0;height:2px;\n  background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--card-accent) 92%,white 8%),transparent);\n  opacity:.9;transform:none!important;\n}\n.master-nav-card .card-number{position:relative;z-index:2;display:inline-flex;width:max-content;padding:5px 8px;border-radius:999px;background:rgba(4,6,5,.55);backdrop-filter:blur(7px);color:#f4dfb1!important;border:1px solid color-mix(in srgb,var(--card-accent) 65%,transparent);margin-bottom:22px!important;text-shadow:0 1px 8px rgba(0,0,0,.7)}\n.master-nav-card .card-icon{position:relative;z-index:2;background:rgba(4,6,5,.55)!important;border-color:color-mix(in srgb,var(--card-accent) 75%,transparent)!important;color:#fff0c9!important;box-shadow:0 8px 20px rgba(0,0,0,.25)}\n.master-nav-card .card-title,.master-nav-card .card-desc,.master-nav-card .card-open{position:relative;z-index:2;text-shadow:0 2px 12px rgba(0,0,0,.9)}\n.master-nav-card .card-title{color:#fff7e7!important;font-size:1.13rem!important}\n.master-nav-card .card-desc{color:#f0eadf!important;opacity:.96!important;line-height:1.65!important}\n.master-nav-card .card-open{color:#f5d38c!important;font-weight:800}\n.master-nav-card:hover,.master-nav-card:focus-visible{transform:translateY(-6px) scale(1.012);border-color:color-mix(in srgb,var(--card-accent) 90%,white 10%)!important;box-shadow:0 22px 55px rgba(0,0,0,.42),0 0 0 1px color-mix(in srgb,var(--card-accent) 25%,transparent)}\n.master-nav-card:hover{background-position:center!important}\n@media(max-width:700px){.master-nav-card{min-height:245px!important;padding:20px!important}.master-nav-card .card-title{font-size:1.16rem!important}.master-nav-card .card-desc{font-size:.88rem!important}}\n@media(prefers-reduced-motion:reduce){.master-nav-card,.master-nav-card:hover{transform:none}}\n'''
css.write_text(css.read_text(encoding='utf-8')+style,encoding='utf-8')
# add JS that maps image variable, and for weekly city updates cover when image changes
js=Path('/mnt/data/v544/script.js')
j=js.read_text(encoding='utf-8')
append='''\n\n/* V5.45 — bind thematic photography to master cards */\n(function(){\n  const cards=[...document.querySelectorAll('.master-nav-card[data-card-image]')];\n  cards.forEach(card=>{ const u=card.getAttribute('data-card-image'); if(u) card.style.setProperty('--card-image', `url("${u.replace(/"/g,'\\\\"')}")`); });\n  const weekly=document.getElementById('weekly-city-image');\n  const weeklyCard=document.querySelector('.master-nav-card[data-target="weekly-city"]');\n  if(weekly && weeklyCard){\n    const sync=()=>{ if(weekly.src && !weekly.hidden && weekly.naturalWidth>0) weeklyCard.style.setProperty('--card-image',`url("${weekly.currentSrc || weekly.src}")`); };\n    weekly.addEventListener('load',sync); sync();\n  }\n})();\n'''
js.write_text(j+append,encoding='utf-8')
