"""Refresh the public snapshot. GET only; requires Python 3 and curl."""
import json, subprocess, time, pathlib
ROOT=pathlib.Path(__file__).resolve().parents[1]
TARGET=ROOT/'data/snapshot.json'
cache=json.loads(TARGET.read_text())
POST_KEYS={'id','title','thumbnail','category','content','format','format_content','fav_count','comment_count','excerpt','mode','style','name','views','time','date','timestamp','comment_count','comments','related'}
def clean(x):
 if isinstance(x,dict):return {k:clean(v) for k,v in x.items() if k not in ('current_user','map_key','favs','email','user_id')}
 if isinstance(x,list):return [clean(v) for v in x]
 return x
def post(p):
 q={k:v for k,v in p.items() if k in POST_KEYS}
 if 'comments' in q:q['comments']=[{k:c.get(k) for k in ['id','content','timestamp','date','digg_count']}|{'nickname':c.get('author',{}).get('nickname','微信用户'),'avatar':c.get('author',{}).get('avatar','')} for c in q['comments']]
 if 'related' in q:q['related']=[{k:c.get(k) for k in ['id','title','thumbnail','mode']} for c in q['related']]
 if 'category' in q:q['category']=[{k:c[k] for k in ['id','name'] if k in c} for c in q['category']]
 return q
def normalize(key,d):
 d=clean(d)
 for k in ['share_image','share_title','sticky']:d.pop(k,None)
 if 'posts' in d:d['posts']=[post(p) for p in d['posts']]
 if 'post' in d:d['post']=post(d['post'])
 if key!='categories':d.pop('categories',None)
 if key!='discovery':d.pop('config',None)
 for m in d.get('modules',[]):
  if m['type']=='post':m['content']=[post(p) for p in m['content']]
 return d
def fetch(key,path):
 r=subprocess.run(['curl','-fsSL','--max-time','18','--retry','1','https://crow.richs.vip/api/'+path],capture_output=True)
 try:
  d=json.loads(r.stdout)
  if d.get('errcode')!=0:raise ValueError()
  cache[key]=normalize(key,d)
  TARGET.write_text(json.dumps(cache,ensure_ascii=False,separators=(',',':')))
  print(key,'updated',flush=True)
 except Exception:print(key,'unavailable; retained snapshot',flush=True)
 time.sleep(.6)
for key,path in [('home','module/page.json?key=home'),('discovery','module/page.json?key=discovery'),('about','module/page.json?key=about'),('module175','module/page.json?key=module_page&id=175'),('module177','module/page.json?key=module_page&id=177'),('categories','category/list.json'),('all','post/list.json')]:fetch(key,path)
cats=[]
def walk(xs):
 for x in xs:cats.append(x);walk(x.get('children',[]))
walk(cache['categories']['categories'])
for c in cats:
 if c['count']:fetch('cat'+str(c['id']),'post/list.json?category_id='+str(c['id']))
ids={p['id'] for m in cache['about']['modules'] if m['type']=='post' for p in m['content']}
for key,value in list(cache.items()):
 if key.startswith('cat'):ids.update(p['id'] for p in value.get('posts',[])[:1])
for i in sorted(ids):fetch('post'+str(i),'post/get.json?id='+str(i))
print('Done. Rebuild the app to use the updated snapshot.')
