import json, pathlib
p=pathlib.Path('/mnt/data/v39/cities-data.js')
s=p.read_text(encoding='utf-8')
arr=json.loads(s.split('=',1)[1].rstrip(';\n'))
coords={
'qamishli':(37.052152,41.231422,454),'hasakah':(36.50237,40.74772,305),'kobani':(36.890952,38.353471,None),'afrin':(36.511935,36.869541,None),'al-malikiyah':(37.177008,42.140062,None),'amuda':(37.104167,40.93,None),'al-darbasiyah':(37.072792,40.651992,None),'ras-al-ayn':(36.8475,40.0706,None),'ras-al-ayn-2':(36.8475,40.0706,None),'tal-tamr':(36.655558,40.370793,None),'manbij':(36.528153,37.954954,None),'ayn-issa':(36.3817,38.8983,None)
}
for x in arr:
    if x['part']!='ڕۆژئاوا': continue
    c=coords.get(x['id'])
    if c:
        x['coordinates']={'lat':c[0],'lon':c[1]}
        if c[2] is not None: x['elevationMeters']=c[2]
        x['coordinateSource']='GeoNames geographical database'
    x['populationStatus']='not_currently_verified'
    x['populationNote']='Current city-level population should not be inferred from governorate/district totals; conflict-related displacement and changing administrative conditions require a dated source before publication.'
    x['regionalSourceCandidates']=[
      {'label':'Central Bureau of Statistics — Syria','url':'https://cbssyr.sy/'},
      {'label':'UNESCO World Heritage Centre — Syrian Arab Republic','url':'https://whc.unesco.org/en/statesparties/sy'},
      {'label':'GeoNames geographical database — coordinate reference','url':'https://www.geonames.org/'}
    ]
    ev=x.get('evidence',{})
    ev['identity']={'status':'documented','label':'Identity'}
    ev['geography']={'status':'documented','label':'Geography'}
    ev['population']={'status':'research-needed','label':'Population'}
    ev['history']={'status':'research-needed','label':'History'}
    ev['heritage']={'status':'research-needed','label':'Heritage'}
    ev['culture']={'status':'research-needed','label':'Culture'}
    ev['languages']={'status':'research-needed','label':'Language'}
    ev['economy']={'status':'research-needed','label':'Economy'}
    ev['crafts']={'status':'research-needed','label':'Handicrafts'}
    ev['images']={'status':'research-needed','label':'Images'}
    ev['sources']={'status':'documented','label':'Sources'}
    x['evidence']=ev
    x['evidenceStandard']='v3.9-rojava-evidence'
    x['researchReviewed']='2026-09-06'
    x['researchProfile']=True
    x['evidenceScore']=3
    x['evidenceTotal']=11
# Add exact city-specific coordinate source records
byid={x['id']:x for x in arr}
for iid in coords:
    x=byid[iid]
    x['sources']=[s for s in x.get('sources',[]) if s.get('label')!='GeoNames geographical database — coordinate reference']
    x['sources'].append({'label':'GeoNames geographical database — city coordinate reference','url':'https://www.geonames.org/'})
# serialize compactly
p.write_text('window.KURD_CITIES='+json.dumps(arr,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
