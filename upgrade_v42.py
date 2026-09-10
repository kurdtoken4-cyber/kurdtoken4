import json, os, zipfile, hashlib
from collections import Counter
base='/mnt/data/v41'
out='/mnt/data/v42'
os.makedirs(out,exist_ok=True)
# copy whole tree
import shutil
for name in os.listdir(base):
    src=os.path.join(base,name); dst=os.path.join(out,name)
    if os.path.isdir(src): shutil.copytree(src,dst,dirs_exist_ok=True)
    else: shutil.copy2(src,dst)

path=os.path.join(out,'cities-data.js')
s=open(path,encoding='utf-8').read(); t=s.split('=',1)[1].strip(); t=t[:-1] if t.endswith(';') else t
data=json.loads(t)

REG={
 'ڕۆژهەڵات':[
  {'label':'Statistical Center of Iran — official','url':'https://www.amar.org.ir/'},
  {'label':'Iran 2016 Urban Population Census workbook','url':'https://www.amar.org.ir/Portals/0/census/1395/results/population-urban-95.xlsx'},
  {'label':'UNESCO World Heritage Centre — Iran','url':'https://whc.unesco.org/en/statesparties/ir'}],
 'باکوور':[
  {'label':'TÜİK — Address Based Population Registration System 2025','url':'https://data.tuik.gov.tr/Bulten/Index?p=Adrese-Dayali-Nufus-Kayit-Sonuclari-2025-53899'},
  {'label':'TÜİK Data Portal','url':'https://data.tuik.gov.tr/'},
  {'label':'UNESCO World Heritage Centre — Türkiye','url':'https://whc.unesco.org/en/statesparties/tr'}],
 'باشوور':[
  {'label':'Kurdistan Region Statistics Office — Population/Census 2024','url':'https://krso.gov.krd/en/indicator/population-and-labor-force/population'},
  {'label':'UNESCO World Heritage Centre — Iraq','url':'https://whc.unesco.org/en/statesparties/iq'},
  {'label':'Iraq Central Statistical Organization','url':'https://cosit.gov.iq/'}],
 'ڕۆژئاوا':[
  {'label':'Central Bureau of Statistics — Syria','url':'https://cbssyr.sy/'},
  {'label':'UNESCO World Heritage Centre — Syrian Arab Republic','url':'https://whc.unesco.org/en/statesparties/sy'},
  {'label':'GeoNames geographical database — coordinate reference','url':'https://www.geonames.org/'}]
}
FIELDS=['identity','geography','population','history','heritage','culture','languages','economy','crafts','images','sources']
for c in data:
    c['researchReviewed']='2026-09-07'
    c['evidenceStandard']='v4.2-all-city-dossier'
    # Preserve existing evidence; ensure all 11 dimensions exist.
    ev=c.get('evidence') or {}
    for f in FIELDS:
        ev.setdefault(f, {'status':'research-needed','label':f.title()})
    c['evidence']=ev
    c['evidenceTotal']=11
    c['regionalSourceCandidates']=REG[c['part']]
    # Explicit research contract: no field is treated as verified merely because a regional source exists.
    c['researchPlan']={
      'identity':'city identity/name and administrative status',
      'geography':'coordinates, elevation and geographic setting from a city-level source',
      'population':'city/urban-centre population with year and primary/secondary source; never substitute province/district totals',
      'history':'dated historical claims with a named scholarly/institutional source',
      'heritage':'named heritage places with official/academic documentation and status',
      'culture':'documented local practices; avoid exclusive-ownership claims without evidence',
      'languages':'city-level or locality-specific linguistic evidence; no inferred percentages',
      'economy':'documented principal sectors with dated official/local sources',
      'crafts':'documented crafts with locality attribution and source',
      'images':'rights-safe/attributed image source and alt text',
      'sources':'traceable URLs and source type for every published claim'
    }
    # A concise machine-readable quality statement.
    c['dataQuality']={
      'populationRule':'city-level-only',
      'regionalTotalsMayBeUsedAsCityPopulation':False,
      'unverifiedClaimsMustBeLabeled':True,
      'sourceDateRequiredForPopulation':True
    }
    # Normalize status label without fabricating completion.
    documented=sum(1 for f in FIELDS if ev.get(f,{}).get('status')=='documented')
    c['evidenceScore']=documented
    c['dataStatus']='documented' if documented>=9 else ('partial' if documented>=5 else 'baseline')

# integrity
ids=[c['id'] for c in data]
assert len(data)==96 and len(set(ids))==96
assert Counter(c['part'] for c in data)==Counter({'ڕۆژهەڵات':32,'باکوور':31,'باشوور':21,'ڕۆژئاوا':12})
with open(path,'w',encoding='utf-8') as f:
    f.write('window.KURD_CITIES='+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n')

# README
readme='''# KURDESTAN V4.2 — ALL-CITY DOSSIER STANDARD\n\nThis release applies one evidence standard to all 96 city records across the four project regions.\n\n## Coverage\n- Rojhelat: 32 records\n- Bakur: 31 records\n- Bashur: 21 records\n- Rojava: 12 records\n- Total: 96 records / 96 unique IDs\n\n## Accuracy rule\nNo province, governorate, district or metropolitan total is silently promoted to city population. Every population value must carry a year and source. Missing city-level values remain unverified rather than being guessed.\n\n## 11 evidence dimensions\nIdentity, geography, population, history, heritage, culture, languages, economy, crafts, images, sources.\n\nEach record now includes a city-level research plan, regional primary-source candidates, data-quality rules and the review date 2026-09-07.\n\n## Key primary-source anchors\n- Iran: Statistical Center of Iran / 2016 urban census workbook.\n- Türkiye: TÜİK / ADNKS 2025.\n- Kurdistan Region of Iraq: KRSO / 2024 census population indicators.\n- Syria: Central Bureau of Statistics Syria; city-level values require dated, traceable evidence.\n- Heritage: UNESCO World Heritage Centre where applicable.\n\n## Important limitation\n“Complete dossier structure” does not mean every factual field is verified. A field marked research-needed is intentionally left open to prevent invented or weakly sourced claims.\n'''
open(os.path.join(out,'README_V4_2.md'),'w',encoding='utf-8').write(readme)

# ledger
lines=['# Evidence Ledger V4.2 — All 96 City Dossiers','',f'Total records: {len(data)}','Unique IDs: {len(set(ids))}','Review date: 2026-09-07','', '## Regional coverage']
for p,n in Counter(c['part'] for c in data).items(): lines.append(f'- {p}: {n}')
lines += ['', '## Standard', 'Every record contains the same 11 evidence dimensions and a city-level research plan.', 'Population fields follow a strict city-level-only rule; regional/district totals are not promoted to city population.', '', '## Status distribution']
for p in ['ڕۆژهەڵات','باکوور','باشوور','ڕۆژئاوا']:
    cc=[c for c in data if c['part']==p]
    lines.append(f'### {p}')
    for st,n in sorted(Counter(c['dataStatus'] for c in cc).items()): lines.append(f'- {st}: {n}')
lines += ['', '## Primary source anchors', '- Iran: Statistical Center of Iran — official population/census data.', '- Türkiye: TÜİK — ADNKS 2025.', '- Başûr: KRSO — Census 2024 population indicators; COSIT where relevant.', '- Rojava: Central Bureau of Statistics Syria; city-level population remains date-sensitive.', '- UNESCO World Heritage Centre for heritage status where applicable.']
open(os.path.join(out,'EVIDENCE_LEDGER_V4_2.md'),'w',encoding='utf-8').write('\n'.join(lines)+'\n')

# QA report
qa=[]
qa.append(f'Records: {len(data)}')
qa.append(f'Unique IDs: {len(set(ids))}')
qa.append(f'IDs missing: {sum(not x for x in ids)}')
qa.append(f'Records with all 11 evidence keys: {sum(all(k in c["evidence"] for k in FIELDS) for c in data)}')
qa.append(f'Records with researchPlan: {sum("researchPlan" in c for c in data)}')
qa.append(f'Records with regionalSourceCandidates: {sum(bool(c.get("regionalSourceCandidates")) for c in data)}')
open(os.path.join(out,'QA_V4_2.txt'),'w').write('\n'.join(qa)+'\n')

# package
zip_path='/mnt/data/KURDESTAN_V4_2_ALL_CITY_DOSSIER.zip'
with zipfile.ZipFile(zip_path,'w',zipfile.ZIP_DEFLATED) as z:
    for root,dirs,files in os.walk(out):
        for fn in files:
            if fn.endswith('.zip'): continue
            p=os.path.join(root,fn); z.write(p,os.path.relpath(p,out))
print(zip_path)
print('\n'.join(qa))
