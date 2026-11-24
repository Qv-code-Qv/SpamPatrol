import json, csv, os, re
from docx import Document

base='backend/src/data/arcep'
meta=json.load(open(os.path.join(base,'metadata.json'),encoding='utf-8'))
print('METADATA',json.dumps(meta,ensure_ascii=False,indent=2))
prefixes=json.load(open('backend/src/data/prefixes.json',encoding='utf-8'))
print('PREFIXES',json.dumps(prefixes,ensure_ascii=False,indent=2))
idxpath=os.path.join(base,meta['indexFile'])
index=json.load(open(idxpath,encoding='utf-8'))
print('INDEX_COUNT',len(index),'KEYS',sorted(set().union(*(x.keys() for x in index))))
for row in index[:8]: print('ROW',json.dumps(row,ensure_ascii=False))
print('RANGE_LENGTHS',json.dumps({str(k):sum(1 for r in index if len(r.get('start',''))==k) for k in sorted(set(len(r.get('start','')) for r in index))}))
print('MISSING', {k:sum(1 for r in index if r.get(k) in (None,'')) for k in ('allocationCode','entityName','territory','allocationDate','resource')})
print('FIRST_END',[(r['start'],r['end'],r['resource']) for r in index[:20]])
doc=Document('docs/etude-sources-professionnelles.docx')
print('STUDY_TITLE',doc.core_properties.title,'PARAGRAPHS',len(doc.paragraphs),'TABLES',len(doc.tables))
for p in doc.paragraphs:
    if p.text.strip(): print(p.style.name+':',p.text)
for n,t in enumerate(doc.tables):
    print('TABLE',n,'ROWS',len(t.rows))
    for row in t.rows: print(' | '.join(c.text for c in row.cells))
