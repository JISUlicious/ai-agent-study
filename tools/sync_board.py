# 화이트보드(llm-to-agent-evo)의 요소를 읽어 llm-to-agent-evo.html의 NODES/EDGES를 바꾸고
# site/index.html(독립 실행판)을 다시 만듭니다.
# 사용: python3 tools/sync_board.py <보드 덤프 폴더> [--check]
#   <보드 덤프 폴더>: 보드의 elements 컬렉션을 문서마다 JSON 파일로 내려받은 폴더 (<폴더>/elements/<id>.json)
#   --check: 파일을 바꾸지 않고 페이지와 보드의 차이만 출력합니다.
import json,glob,os,sys
src=sys.argv[1]; check='--check' in sys.argv
P=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..')+os.sep
E={}
for f in glob.glob(src+'/elements/*.json'):
    d=json.load(open(f)); E[os.path.basename(f)[:-5]]=d.get('data',d)
LEG={'e17','e18','e19','e20','e21'}
nodes=[{'id':i,'x':round(d['x']),'y':round(d['y']),'w':d['w'],'h':d['h'],'c':d.get('color','blue'),'k':d.get('kind','rect'),'t':d.get('text','').strip()} for i,d in E.items() if d['type']=='shape' and i not in LEG]
edges=[]
for i,d in E.items():
    if d['type']=='arrow' and isinstance(d['from'],str) and isinstance(d['to'],str) and d['from'] in E and d['to'] in E:
        e={'f':d['from'],'t':d['to']}
        if d.get('fromSide'): e['fs']=d['fromSide']
        if d.get('toSide'): e['ts']=d['toSide']
        if d.get('bends'): e['b']=[b if isinstance(b,str) else round(b) for b in d['bends']]
        if d.get('dash'): e['d']=1
        if d.get('label'): e['l']=d['label']
        edges.append(e)
L=open(P+'llm-to-agent-evo.html').read().split('\n')
ni=next(i for i,l in enumerate(L) if l.lstrip().startswith('const NODES=')); ei=ni+1
N0=json.loads(L[ni].strip()[len('const NODES='):-1]); E0=json.loads(L[ei][len('const EDGES='):-1])
key=lambda n:(n['id'],n['x'],n['y'],n['w'],n['h'],n['c'],n['k'],n['t'])
a=set(map(key,N0)); b=set(map(key,nodes))
ea=set((e['f'],e['t'],e.get('d',0),e.get('l','')) for e in E0); eb=set((e['f'],e['t'],e.get('d',0),e.get('l','')) for e in edges)
nm={n['id']:n['t'].split('\n')[0] for n in nodes+N0}
print('nodes page/board',len(N0),len(nodes),'| changed nodes:',sorted(nm[k[0]] for k in a^b))
print('edges page/board',len(E0),len(edges),'| only page:',[(nm[x[0]],nm[x[1]]) for x in ea-eb],'| only board:',[(nm[x[0]],nm[x[1]]) for x in eb-ea])
if check: sys.exit()
L[ni]='  const NODES='+json.dumps(nodes,ensure_ascii=False)+';'; L[ei]='const EDGES='+json.dumps(edges,ensure_ascii=False)+';'
s='\n'.join(L); open(P+'llm-to-agent-evo.html','w').write(s)
j=s.index('</style>')+len('</style>')
open(P+'site/index.html','w').write('<!doctype html>\n<html lang="ko">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n'+s[:j]+'\n</head>\n<body>\n'+s[j:]+'\n</body>\n</html>\n')
print('written')
