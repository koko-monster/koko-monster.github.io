from PIL import Image,ImageDraw,ImageFont
from pathlib import Path
import json,collections
out=Path('/Users/snapask/Documents/ChatGPT/Work/kokomonster-character-style-exploration'); rows=json.loads((out/'source-audit.json').read_text()); by={r['code']:r for r in rows}
fontpath='/System/Library/Fonts/Supplemental/Arial.ttf'
f=lambda n:ImageFont.truetype(fontpath,n)
sheet=Image.new('RGB',(1800,1490),'#f7f2e9'); d=ImageDraw.Draw(sheet)
d.text((60,40),'KOKOMONSTER / CHARACTER STUDY 01',font=f(21),fill='#58524a')
d.text((60,83),'Soft editorial. Consistent identity.',font=f(53),fill='#253655')
d.text((60,158),'Proposed direction from existing art | Reference board, not newly designed characters',font=f(24),fill='#58524a')
sets=[('01 / Lead with soft Japan Editorial',['KM-CUT-JP108-437','KM-CUT-JP108-436','KM-CUT-JP108-440','KM-CUT-JP108-447','KM-CUT-JP108-438','KM-CUT-JP108-441']),('02 / Use 365 to check identity across everyday actions',['KM-CUT-365-377','KM-CUT-365-384','KM-CUT-365-311','KM-CUT-365-308','KM-CUT-365-385','KM-CUT-365-378'])]
for s,(title,codes) in enumerate(sets):
 y=230+s*485;d.text((60,y),title,font=f(28),fill='#253655')
 for i,code in enumerate(codes):
  x=60+i*280;im=Image.open(by[code]['path']);im=im.crop(im.getchannel('A').getbbox());im.thumbnail((260,330));sheet.paste(im,(x+(260-im.width)//2,y+52+(330-im.height)//2),im)
  d.text((x,y+395),code,font=f(17),fill='#58524a')
d.line((60,1220,1740,1220),fill='#cfc5b5',width=2)
for x,heading,lines in [(60,'LOCK IDENTITY',['Silhouette and face map','Species features and signature marks','Character colour relationships']),(640,'CONTROL RENDERING',['Flat fills, soft irregular edges','Sparse local-colour contour lines','Texture kept away from the face']),(1220,'TEST NEXT REFERENCES',['Change one visual variable at a time','Same pose, scale and palette','Review all six characters together'])]:
 d.text((x,1260),heading,font=f(22),fill='#253655')
 for j,line in enumerate(lines):d.text((x,1308+j*35),line,font=f(21),fill='#58524a')
sheet.save(out/'direction-board.jpg',quality=94)
# Exact frequent opaque RGB values, recorded as evidence candidates, not official palette.
palette={}
for code in ['KM-CUT-365-377','KM-CUT-365-384','KM-CUT-365-385','KM-CUT-365-378','KM-CUT-JP108-447','KM-CUT-365-311']:
 im=Image.open(by[code]['path']); counts=collections.Counter((r,g,b) for r,g,b,a in im.getdata() if a==255);palette[code]=[{'hex':'#%02X%02X%02X'%c,'opaquePixelCount':n} for c,n in counts.most_common(12)]
(out/'palette-evidence.json').write_text(json.dumps(palette,indent=2))
print(json.dumps(palette,indent=2))
