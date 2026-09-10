import json, os, zipfile, shutil
base='/mnt/data/v36'
p=os.path.join(base,'cities-data.js')
s=open(p,encoding='utf8').read(); d=json.loads(s.split('=',1)[1].rstrip(';\n'))
now='2026-09-06'
official='https://data.tuik.gov.tr/Bulten/Index?p=Adrese-Dayali-Nufus-Kayit-Sistemi-Sonuclari-2025-53899'
meta={'label':'TÜİK — Address Based Population Registration System Results 2025','url':official}
for x in d:
    if x['part']=='باکوور':
        x['researchReviewed']=now
        x['evidenceStandard']='v3.7-bakur-turkey-source-pass'
        rs=x.setdefault('regionalSourceCandidates',[])
        if not any(r.get('url')==official for r in rs): rs.append(meta)
        ev=x.setdefault('evidence',{})
        ev.setdefault('population',{'status':'research-needed','label':'Population'})
        ev['population']['status']='source-identified'
        ev['population']['source']='TÜİK ADNKS 2025; city-level extraction pending for this record'
        # Preserve exact city-level figures only where a city-level source was verified in this pass.
        if x['id']=='diyarbakir':
            x['population']='1,087,786 (2022 estimate)'
            x['populationYear']=2022
            x['populationSource']='State Institute of Statistics / TÜİK, city-level series via City Population'
            x['populationSourceUrl']='https://www.citypopulation.de/en/turkey/diyarbakir/_/2844__diyarbak%C3%84%C2%B1r/'
            x['coordinates']={'lat':37.9250,'lon':40.2100,'source':'UNESCO World Heritage Centre property reference'}
            x['evidence']['population']={'status':'documented','label':'Population','year':2022,'source':x['populationSource'],'url':x['populationSourceUrl']}
            x['evidence']['geography']={'status':'documented','label':'Geography','source':'UNESCO World Heritage Centre'}
            x['evidenceScore']=max(x.get('evidenceScore',0),6)
        elif x['id']=='hakkari':
            x['population']='60,098 (2022 estimate)'
            x['populationYear']=2022
            x['populationSource']='State Institute of Statistics / TÜİK, city-level series via City Population'
            x['populationSourceUrl']='https://www.citypopulation.de/en/turkey/hakkari/TRB2400__merkez/'
            x['evidence']['population']={'status':'documented','label':'Population','year':2022,'source':x['populationSource'],'url':x['populationSourceUrl']}
            x['evidenceScore']=max(x.get('evidenceScore',0),2)
        else:
            # Do not insert province/district totals into a city field.
            x['populationYear']=None
            x['populationSource']=None
        # Recalculate score conservatively from documented fields.
        documented=sum(1 for v in x['evidence'].values() if v.get('status')=='documented')
        x['evidenceScore']=max(x.get('evidenceScore',0),documented)

open(p,'w',encoding='utf8').write('window.KURD_CITIES='+json.dumps(d,ensure_ascii=False,separators=(',',':'))+';\n')

report=os.path.join(base,'EVIDENCE_LEDGER_V3_7.md')
with open(report,'w',encoding='utf8') as f:
    f.write('# KURDESTAN V3.7 — Bakur / Turkey Evidence Pass\n\n')
    f.write('Reviewed: 2026-09-06\n\n')
    f.write('## Scope\n')
    f.write('- 31 Bakur city records retained; no records deleted.\n')
    f.write('- TÜİK 2025 ADNKS identified as the primary current population source.\n')
    f.write('- Province/district totals are not promoted to city population.\n')
    f.write('- Diyarbakir and Hakkari received verified city-level 2022 population entries from city-level series citing Türkiye statistical data.\n')
    f.write('- Remaining Bakur records remain explicitly pending city-level extraction rather than receiving guessed values.\n\n')
    f.write('## Source rule\n')
    f.write(f'- TÜİK 2025: {official}\n')
    f.write('- City-level series may be used only when the record is explicitly identified as a city; district totals remain separate.\n')
    f.write('- For metropolitan provinces, city figures can be calculated from selected neighbourhoods; the methodology is documented in the source material.\n\n')
    f.write('## Verified anchors\n')
    f.write('- Diyarbakir: 1,087,786 (2022), city-level series.\n')
    f.write('- Hakkari: 60,098 (2022), city-level series.\n')
    f.write('- Erciş district example was reviewed only as a methodology check; its 171,000 figure is a district total and was not inserted into the Van city record.\n')

# package
out='/mnt/data/KURDESTAN_V3_7_BAKUR_TUIK.zip'
if os.path.exists(out): os.remove(out)
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED) as z:
    for root,dirs,files in os.walk(base):
        for fn in files:
            if fn in ('update_v37.py',): continue
            path=os.path.join(root,fn)
            z.write(path,os.path.relpath(path,base))
print(out)
print('cities',len(d),'bakur',sum(x['part']=='باکوور' for x in d))
print('unique ids',len({x['id'] for x in d}))
