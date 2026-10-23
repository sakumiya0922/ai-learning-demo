/** 教材の説明文を常体（言い切り）に統一する。
 *  コード例の source は絶対に書き換えない。
 *  ページ冒頭の「結論」は keypoints.js の明示的な1文を使用する。
 */
const irregular = [
  [/できません(?=[。！？\n]|$)/g,'できない'],
  [/ありません(?=[。！？\n]|$)/g,'ない'],
  [/いません(?=[。！？\n]|$)/g,'いない'],
  [/なりません(?=[。！？\n]|$)/g,'ならない'],
  [/できました(?=[。！？\n]|$)/g,'できた'],
  [/あります(?=[。！？\n]|$)/g,'ある'],
  [/ています(?=[。！？\n]|$)/g,'ている'],
  [/できます(?=[。！？\n]|$)/g,'できる'],
  [/なります(?=[。！？\n]|$)/g,'なる'],
  // 「押します→押する」といった誤変換を防ぐ。複合語を先に処理。
  [/試しましょう(?=[。！？\n]|$)/g,'試す'],
  [/覚えましょう(?=[。！？\n]|$)/g,'覚える'],
  [/分けましょう(?=[。！？\n]|$)/g,'分ける'],
  [/確認しましょう(?=[。！？\n]|$)/g,'確認する'],
  [/実行しましょう(?=[。！？\n]|$)/g,'実行する'],
  [/観察してください(?=[。！？\n]|$)/g,'観察する'],
  [/区別してください(?=[。！？\n]|$)/g,'区別する'],
  [/確認してください(?=[。！？\n]|$)/g,'確認する'],
  [/使ってください(?=[。！？\n]|$)/g,'使う'],
  [/保存してください(?=[。！？\n]|$)/g,'保存する'],
  [/表示します(?=[。！？\n]|$)/g,'表示する'],
  [/明示します(?=[。！？\n]|$)/g,'明示する'],
  [/指示します(?=[。！？\n]|$)/g,'指示する'],
  [/目指します(?=[。！？\n]|$)/g,'目指す'],
  [/押します(?=[。！？\n]|$)/g,'押す'],
  [/示します(?=[。！？\n]|$)/g,'示す'],
  [/指します(?=[。！？\n]|$)/g,'指す'],
  [/表します(?=[。！？\n]|$)/g,'表す'],
  [/試します(?=[。！？\n]|$)/g,'試す'],
  [/戻します(?=[。！？\n]|$)/g,'戻す'],
  [/直します(?=[。！？\n]|$)/g,'直す'],
  [/探します(?=[。！？\n]|$)/g,'探す'],
  [/消します(?=[。！？\n]|$)/g,'消す'],
  [/返します(?=[。！？\n]|$)/g,'返す'],
  [/話します(?=[。！？\n]|$)/g,'話す'],
  [/渡します(?=[。！？\n]|$)/g,'渡す'],
  [/します(?=[。！？\n]|$)/g,'する'],

  [/でしょう(?=[。！？\n]|$)/g,'と考えられる'],
  [/です(?=[。！？\n]|$)/g,''],
];
const negative = {い:'わない',き:'かない',ぎ:'がない',し:'しない',ち:'たない',に:'なない',び:'ばない',み:'まない',り:'らない',れ:'れない',け:'けない',せ:'せない',め:'めない',え:'えない',じ:'じない'};
const godan = {い:'う',き:'く',ぎ:'ぐ',し:'す',ち:'つ',に:'ぬ',び:'ぶ',み:'む',り:'る',れ:'れる',け:'ける',せ:'せる',め:'める',え:'える',べ:'べる',じ:'じる',て:'てる'};
export function toPlain(input){
 if(typeof input!=='string')return input;
 let result=input;
 // 教材文を機械的に「〜だ」とするだけでは、説明調・誤活用が残る。
 // 表現の意味を保つため、実際に使われている文を先に明示的に整える。
 result=result
  .replace(/説明できることです(?=[。！？\n]|$)/g,'説明できる状態にすること')
  .replace(/戻って構いません(?=[。！？\n]|$)/g,'戻って確認する')
  .replace(/作っても構いません(?=[。！？\n]|$)/g,'作成する方法もある')
  .replace(/扱います(?=[。！？\n]|$)/g,'扱う')
  .replace(/登録されました(?=[。！？\n]|$)/g,'登録された')
  .replace(/確認できました(?=[。！？\n]|$)/g,'確認できた')
  .replace(/〜できることです(?=[。！？\n]|$)/g,'〜できること');
 for(const [pattern,replacement] of irregular)result=result.replace(pattern,replacement);
 result=result.replace(/([ぁ-ん])ません(?=[。！？\n]|$)/g,(whole,kana)=>negative[kana]??whole);
 // 補助動詞「〜られます」「〜れます」なども終止形へ変換。
 result=result.replace(/([ぁ-ん])ます(?=[。！？\n]|$)/g,(whole,kana)=>{
   const replacement=godan[kana];
   return replacement??whole;
 });
 return result;
}
function editBlock(block){
 const item={...block};
 for(const key of ['title','body','caption','footer','description']){
   if(typeof item[key]==='string')item[key]=toPlain(item[key]);
 }
 if(Array.isArray(item.items))item.items=item.items.map(x=>typeof x==='string'?toPlain(x):({...x,label:toPlain(x.label),detail:toPlain(x.detail)}));
 if(Array.isArray(item.nodes))item.nodes=item.nodes.map(arr=>arr.map(toPlain));
 if(Array.isArray(item.headers))item.headers=item.headers.map(toPlain);
 if(Array.isArray(item.rows))item.rows=item.rows.map(row=>row.map(toPlain));
 return item;
}
export function withDeclarativeVoice(course){
 return {...course,description:toPlain(course.description),pages:course.pages.map(page=>({...page,
   lead:toPlain(page.lead),
   blocks:page.blocks.map(editBlock)
 })),quiz:course.quiz.map(q=>({...q,reason:toPlain(q.reason)}))};
}
