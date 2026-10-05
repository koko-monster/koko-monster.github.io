from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import json,base64,io,hashlib
root=Path(__file__).resolve().parent; output=root/'rotation-frames';output.mkdir(exist_ok=True)
font=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf',18); register=[]
for source in sorted((root/'rotation-sources').glob('*.json')):
 a=json.loads(source.read_bytes());name=source.stem;folder=output/name;folder.mkdir(exist_ok=True);assets={x['id']:x for x in a['assets']};frames=[]
 for layer in sorted(a['layers'],key=lambda x:x['ip']):
  assert layer['ty']==2 and layer['op']-layer['ip']==1
  assert layer['ks']['s']['k']==[100,100,100] and layer['ks']['r']['k']==0
  asset=assets[layer['refId']];data=base64.b64decode(asset['p'].split(',',1)[1]);im=Image.open(io.BytesIO(data)).convert('RGBA');im.save(folder/f"frame-{int(layer['ip']):02d}.png");frames.append(im)
 sheet=Image.new('RGB',(1500,((len(frames)+5)//6)*280+65),'#eeeae2');d=ImageDraw.Draw(sheet);d.text((20,15),name+' / every authored frame / source order',font=font,fill='#253655')
 for i,im in enumerate(frames):
  small=im.copy();small.thumbnail((245,245));x=(i%6)*250;y=60+(i//6)*280;sheet.paste(small,(x,y),small);d.text((x+10,y+245),f'Frame {i:02d}',font=font,fill='#253655')
 sheet.save(root/(name+'-all-frames.jpg'),quality=94)
 register.append({'file':str(source.relative_to(root)),'sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'bytes':source.stat().st_size,'canvas':[a['w'],a['h']],'fps':a['fr'],'frameCount':len(frames),'durationSeconds':(a['op']-a['ip'])/a['fr'],'embeddedFrameDimensions':list(frames[0].size),'alphaExtrema':list(frames[0].getchannel('A').getextrema()),'type':'embedded-raster-image-sequence','externalAssets':False,'sourceFolder':'https://drive.google.com/drive/u/1/folders/1p2s5mejBbgOjJe6nkAVDBClTUeYdEI3W'})
(root/'rotation-manifest.json').write_text(json.dumps(register,indent=2));print(json.dumps(register,indent=2))
