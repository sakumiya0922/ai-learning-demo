import {gitCourse} from './git.js?v=5';
import {dockerCourse} from './docker.js?v=5';
import {pytestCourse} from './pytest.js?v=5';
import {mlflowCourse} from './mlflow.js?v=5';
import {enrichWithVisuals} from './visuals.js?v=5';
import {withKeypoints} from './keypoints.js?v=5';
import {withDeclarativeVoice} from './editorial.js?v=5';
import {organizeCourse} from './parts.js?v=5';

export const STAGES = [
 {id:1,name:'達成目標',short:'達成目標',detail:'この講座のゴールと全体の学習順序を確認する'},
 {id:2,name:'目的',short:'目的',detail:'なぜこの技術が必要なのかを具体例で理解する'},
 {id:3,name:'概念・イメージ',short:'概念',detail:'主要な用語と全体像を図でつかむ'},
 {id:4,name:'仕組み・構造',short:'仕組み',detail:'内部の構造と動作を順序立てて理解する'},
 {id:5,name:'基本操作',short:'操作',detail:'コマンド・コードと実行結果を確認する'},
 {id:6,name:'ユースケース',short:'活用',detail:'実際の開発工程に沿って使い方を考える'},
 {id:7,name:'まとめ',short:'まとめ',detail:'学習内容と各要素の関係を整理する'},
 {id:8,name:'知識問題',short:'問題',detail:'最後に理解度を確認する'}
];

const CHAPTER_BY_ID={
 docker:{why:2,'image-container':3,architecture:4,dockerfile:4,commands:5,volumes:5,network:5,compose:5,demandpilot:6,troubleshoot:6,summary:7,quiz:8},
 pytest:{why:2,types:3,assert:4,cases:4,parametrize:5,fixture:5,errors:5,'ml-specific':6,docker:6,summary:7,quiz:8},
 mlflow:{why:2,hierarchy:3,stores:4,logging:5,artifacts:5,history:5,search:5,git:6,local:6,practice:6,summary:7,quiz:8}
};

function prepareCourse(raw){
 let pages=raw.pages.map(p=>({...p,stage:p.stage||CHAPTER_BY_ID[raw.id]?.[p.id]||2}));
 if(raw.id!=='git'){
  const overview={id:'overview',stage:1,title:'① 達成目標｜この講座の学び方',goal:'講座の到達目標と学習順序を把握する',lead:'はじめに何を学ぶのか、8つの章がどうつながるのか確認します。',minutes:5,blocks:[
    {type:'text',title:'この講座を学ぶ理由',body:`${raw.name}の学習は、用語の暗記よりも、開発の中で「何を」「なぜ」使うのか分かることを目指します。`},
    {type:'list',title:'学習後にできること',items:raw.outcomes},
    {type:'note',title:'進め方',body:'まず全体の順番を確認し、目的・概念・仕組み・操作・ユースケースと進みます。理解度テストは最後にまとめて行います。'}
  ]};
  pages=[overview,...pages];
 }
 return organizeCourse(withDeclarativeVoice(withKeypoints(enrichWithVisuals({...raw,pages}))));
}
export const COURSES=[gitCourse,dockerCourse,pytestCourse,mlflowCourse].map(prepareCourse);
export const getCourse=id=>COURSES.find(c=>c.id===id);
export const getStage=number=>STAGES.find(s=>s.id===number)||STAGES[0];
