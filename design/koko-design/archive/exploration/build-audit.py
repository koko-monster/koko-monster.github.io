from pathlib import Path
from PIL import Image,ImageDraw
import json
root=Path('/Users/snapask/Documents/ChatGPT/Work/kokomonster-shopify-theme'); out=root.parent/'kokomonster-character-style-exploration'; rows=[]
for family in ['jp108','365']:
 m=json.loads((root/f'assets/design-library/{family}-extraction-manifest.json').read_text())
 for a in m['assets']:
  p=(root/'preview'/a['file']).resolve() if family=='jp108' else root/'assets/design-library'/a['workingPng']
  im=Image.open(p); alpha=im.getchannel('A'); rows.append(dict(family=family,code=a.get('code',a.get('cutoutCode')),name=a['name'],path=str(p),size=list(im.size),mode=im.mode,alpha=list(alpha.getextrema()),bbox=list(alpha.getbbox()),source=a.get('sourceMaster')))
for fam in ['jp108','365']:
 rr=[r for r in rows if r['family']==fam]
 for start in range(0,len(rr),30):
  sheet=Image.new('RGB',(1500,1320),'#eeeae2'); d=ImageDraw.Draw(sheet)
  for i,r in enumerate(rr[start:start+30]):
   x=(i%6)*250;y=(i//6)*264
   im=Image.open(r['path']); im=im.crop(im.getchannel('A').getbbox()); im.thumbnail((230,225));sheet.paste(im,(x+(250-im.width)//2,y+5),im)
   d.text((x+8,y+234),r['code'],fill='black');d.text((x+8,y+249),r['name'],fill='black')
  sheet.save(out/f'audit-{fam}-{start//30+1}.jpg',quality=90)
(out/'source-audit.json').write_text(json.dumps(rows,indent=2))
print('Audited',len(rows),'files; sizes',set(tuple(r['size']) for r in rows),'modes',set(r['mode'] for r in rows),'alpha',set(tuple(r['alpha']) for r in rows))
