/**
 * 教材表示は「1パート=意味のまとまり」。図・文章・コード・注意書きの
 * ブロック種別ではパートを増やさない。
 * 3パートを超えたときは同じ章の続きページに分割する。
 */
const VISUAL = new Set(['visual', 'diagram']);

// 内容が重なる旧図解は、後から追加した説明付きの図1枚へ統一。
const DUPLICATE_DIAGRAMS = {
  git: new Set(['three-areas-concept', 'git-commit-mechanism'])
};

export function groupPageBlocks(courseId, page) {
  const hasReplacement=page.blocks.some(b=>b.type==='visual');
  const blocks=page.blocks.filter(b=> !(hasReplacement && DUPLICATE_DIAGRAMS[courseId]?.has(page.id) && b.type==='diagram'));
  const groups=[];
  let i=0;
  while(i<blocks.length){
    const block=blocks[i];
    if(block.type==='note'){
      if(groups.length)groups.at(-1).push(block);
      else groups.push([block]);
      i++;continue;
    }
    const group=[block];
    const next=blocks[i+1];
    if(next){
      if(VISUAL.has(block.type) && ['table','text','code'].includes(next.type)){
        // 図とその読み方・補足は一つのパート。必要ならコード例も合わせて表示。
        group.push(next);i++;
      }else if(block.type==='text' && VISUAL.has(next.type)){
        group.push(next);i++;
      }else if(block.type==='text' && next.type==='code'){
        group.push(next);i++;
      }else if(block.type==='code' && next.type==='text'){
        group.push(next);i++;
      }
    }
    groups.push(group);
    i++;
  }
  // 先頭が「図」と「表」の説明で分かれてしまう場合、両者を統合する。
  return groups;
}

const NEXT_PAGE = {
  'git/three-areas-concept': {title:'ステージングとコミットの状態を確かめる',takeaway:'**作業中の変更・ステージ済み内容・確定済みの履歴は、それぞれ独立した状態。**'},
  'git/git-commit-mechanism': {title:'Gitオブジェクトが履歴をつなぐ仕組み',takeaway:'**CommitはTreeと親コミットを参照し、過去のファイル構成と履歴をつなぐ。**'},
  'git/merge-mechanism': {title:'マージコミットとコンフリクト',takeaway:'**分岐した双方にコミットがある場合は、共通の祖先から変更を統合する。**'},
  'git/remote-operations': {title:'GitHubに送信し、更新を取得する',takeaway:'**pushは送信、fetchとpullは取得側の操作。ローカルのコミットだけではGitHubは変わらない。**'},
  'git/start-project': {title:'リポジトリ初期化後の状態を確認する',takeaway:'**git initの時点では履歴はまだ存在せず、初回コミットによって履歴が作られる。**'},
  'git/scenario-run': {title:'Runを分けて実験結果を追跡する',takeaway:'**コードが同じならGitコミットは共通でも、学習条件を変えた実験には別のRun IDが付く。**'},
};
const shortTitle=title=>String(title).replace(/^[①②③④⑤⑥⑦⑧]\s*[^｜|]+[｜|]\s*/,'').trim();
const strip=(s='')=>String(s).replace(/\*\*/g,'').replace(/`/g,'');
function partHeading(part){return part.find(b=>b?.title)?.title||'操作と確認';}
export function organizeCourse(course){
 const pages=[];
 for(const page of course.pages){
  if(page.id==='quiz'){pages.push({...page,parts:[]});continue;}
  const groups=groupPageBlocks(course.id,page);
  if(groups.length===0){pages.push({...page,parts:[]});continue;}
  const chunks=[];
  for(let i=0;i<groups.length;i+=3)chunks.push(groups.slice(i,i+3));
  chunks.forEach((parts,i)=>{
   const old=i===0;
   const heading=partHeading(parts[0]);
   const override=NEXT_PAGE[`${course.id}/${page.id}`];
   const title=old?page.title:
    `第${page.stage}章｜${i===1&&override?.title?override.title:strip(heading)}`;
   const takeaway=old?page.takeaway:
    (i===1&&override?.takeaway?override.takeaway:`**${strip(heading)}**を確認し、実行前後の違いを整理する。`);
   const id=old?page.id:`${page.id}-continue-${i}`;
   pages.push({...page,id,title,takeaway,parts,
     blocks:parts.flat(),
     lead:old?page.lead:`${strip(heading)}を確認する。`,
     minutes:Math.max(3,Math.round(page.minutes/chunks.length))
   });
  });
 }
 return {...course,pages,minutes:pages.reduce((n,p)=>n+(p.minutes||0),0)};
}

export function partHeadingFor(blocks){return partHeading(blocks)}
