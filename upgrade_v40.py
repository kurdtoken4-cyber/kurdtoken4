import json, os, zipfile, re, hashlib
p='/mnt/data/v40/cities-data.js'
s=open(p,encoding='utf-8').read(); a=s.index('['); b=s.rindex(']')+1; d=json.loads(s[a:b])
coords={
'هەولێر':(36.19117106,44.00943291,'GeoNames'),
'سلێمانی':(35.564964,45.432905,'GeoNames'),
'دهۆک':(36.86607573,42.98790402,'GeoNames'),
'کەرکووک':(35.4681,44.3922,'Geographic reference; city-center coordinate'),
'هەڵەبجە':(35.1777778,45.9861111,'GeoNames'),
'زاخۆ':(37.148713,42.685909,'GeoNames'),
'ئاکرێ':(36.73359,43.88038,'GeoNames'),
'ئامێدی':(37.2008,43.6811,'GeoNames regional locality reference'),
'سۆران':(36.65557655,44.54217437,'GeoNames'),
'ڕانیە':(36.255111,44.882389,'GeoNames'),
'ڕەواندز':(36.61139689,44.52194247,'GeoNames'),
'کۆیە':(36.08289,44.628733,'GeoNames'),
'شەقڵاوە':(36.40422,44.32563,'GeoNames'),
'کەلار':(34.628052,45.318518,'GeoNames'),
'چەمچەماڵ':(35.338346,44.89129,'GeoNames district/city reference'),
'قەلادزێ':(36.18254,45.130166,'GeoNames'),
'دەربەندیخان':(35.112066,45.686628,'GeoNames'),
'پێنجوێن':(35.620544,45.949078,'GeoNames'),
'سێمێل':(36.858226,42.848199,'GeoNames'),
'باتیفا':(37.174537,43.01233,'GeoNames district reference'),
'خانەقین':(34.348201,45.390649,'GeoNames')}
gov={
'هەولێر':('Erbil Governorate',2517534,'Iraq 2024 General Population and Housing Census / governorate total'),
'سلێمانی':('Sulaymaniyah Governorate',2401724,'Iraq 2024 General Population and Housing Census / governorate total'),
'دهۆک':('Duhok Governorate',1599871,'Iraq 2024 General Population and Housing Census / governorate total'),
'کەرکووک':('Kirkuk Governorate',2034627,'Iraq 2024 General Population and Housing Census / governorate total')}
source_cosit='https://cosit.gov.iq/ar/?id=1234&layout=edit&option=com_content&view=article'
source_krso='https://krso.gov.krd/en/indicator/population-and-labor-force/population'
source_geo='https://www.geonames.org/'
for x in d:
 if x['part']!='باشوور': continue
 name=x['name']
 if name in coords:
  lat,lon,src=coords[name]; x['coordinates']={'lat':lat,'lon':lon,'source':src}
 x['researchReviewed']='2026-09-07'; x['evidenceStandard']='v4.0-bashur-evidence'
 x['regionalSourceCandidates']=[
   {'label':'Kurdistan Region Statistics Office — 2024 Census population','url':source_krso},
   {'label':'Iraq Central Statistical Organization / COSIT — 2024 Census','url':source_cosit},
   {'label':'GeoNames — geographic reference','url':source_geo}
 ]
 if name in gov:
  gn,val,desc=gov[name]
  x['governoratePopulation2024']={'governorate':gn,'value':val,'source':desc}
  x['populationNote']='The 2024 figure shown in the governorate field is NOT the population of this city. City-level population remains unfilled until a city/urban-center table is verified.'
 else:
  x['populationNote']='City-level population remains unfilled. Governorate/district totals are not promoted to city population.'
 x['populationStatus']='city_level_not_verified'
 x['evidence']['geography']={'status':'documented','label':'Geography'}
 x['evidence']['population']={'status':'source-identified','label':'Population'}
 x['evidence']['sources']={'status':'documented','label':'Sources'}
 x['evidence']['images']={'status':'research-needed','label':'Images'}
 x['evidenceScore']=5
 x['dataStatus']='partial'
 # add source records, de-duplicate by url
 srcs=x.get('sources',[])
 urls={z.get('url') for z in srcs}
 for rec in x['regionalSourceCandidates']:
  if rec['url'] not in urls: srcs.append(rec)
 x['sources']=srcs
open(p,'w',encoding='utf-8').write('window.KURD_CITIES='+json.dumps(d,ensure_ascii=False,separators=(',',':'))+';\n')
# ledger
south=[x for x in d if x['part']=='باشوور']
lines=['# KURDESTAN V4.0 — Başûr Evidence Ledger','', 'Reviewed: 2026-09-07','', '## Scope','21 Başûr city records retained. Coordinates and evidence-source layers were strengthened. City-level population is deliberately not inferred from governorate totals.', '', '## Official population anchors','KRSO reports the 2024 Kurdistan Region census total as 6,519,129, with governorate density indicators for Erbil, Sulaymaniyah, Duhok and Halabja. Iraq COSIT publishes the 2024 national census results. These are regional/governorate controls, not automatic city populations.', '', '## City population rule','A city population field is populated only when a source explicitly identifies the urban/city population. District, governorate, metropolitan or administrative totals are stored separately and are never relabeled as city population.', '', '## Coordinate rule','Coordinates are retained as geographic reference points. Where GeoNames identifies a district/administrative seat rather than a strict city-center record, the record is labeled accordingly instead of presenting it as a surveyed municipal centroid.', '', '## Records']
for x in south:
 lines.append(f"- {x['name']} (`{x['id']}`): score {x['evidenceScore']}/11; population={x['populationStatus']}; coordinates={'yes' if x.get('coordinates') else 'no'}")
lines += ['', '## Sources', f'- KRSO: {source_krso}', f'- COSIT: {source_cosit}', f'- GeoNames: {source_geo}']
open('/mnt/data/v40/EVIDENCE_LEDGER_V4_0.md','w',encoding='utf-8').write('\n'.join(lines)+'\n')
readme=open('/mnt/data/v40/README.md',encoding='utf-8').read()
readme += '\n\n## V4.0 — Başûr Evidence Layer\n- 21 Başûr records retained.\n- Geographic references strengthened.\n- 2024 KRSO/COSIT regional population controls added without mislabeling governorate totals as city populations.\n- City-level population remains pending where a direct city/urban-center table is not verified.\n- Evidence Ledger upgraded to V4.0.\n'
open('/mnt/data/v40/README.md','w',encoding='utf-8').write(readme)
# validate
assert len(d)==96 and len({x['id'] for x in d})==96
assert len(south)==21
# zip
out='/mnt/data/KURDESTAN_V4_0_BASHUR_COMPLETE.zip'
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED) as z:
 for root,dirs,files in os.walk('/mnt/data/v40'):
  for f in files:
   if f==os.path.basename(out): continue
   fp=os.path.join(root,f); z.write(fp,os.path.relpath(fp,'/mnt/data/v40'))
# test
with zipfile.ZipFile(out) as z:
 bad=z.testzip(); assert bad is None
print(out, os.path.getsize(out), '96 cities, 21 Bashur, unique IDs, zip OK')
