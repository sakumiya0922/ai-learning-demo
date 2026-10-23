// Git course curriculum v2 — 8-stage beginner-first lessons.
// Content-only module: the existing Web app renders these blocks.
export const gitCourse = {
  "id": "git",
  "label": "01",
  "name": "Git",
  "tagline": "コードが「どこに」「どの状態で」保存されるかを理解する",
  "description": "目的から内部構造・基本操作・機械学習での活用までを、丁寧な図解と操作例で学びます。",
  "symbol": "⑂",
  "minutes": 317,
  "accent": "#2676d3",
  "curriculumVersion": 2,
  "outcomes": [
    "GitとGitHubの役割を分けて説明できる",
    "3つの管理領域とコミットの内部構造を理解できる",
    "Gitの基本操作で変更を確認・記録・復元できる",
    "ブランチとGitHubの共有の流れを説明できる",
    "機械学習の実験結果とGitコミットを結びつけて考えられる"
  ],
  "pages": [
    {
      "id": "goal",
      "stage": 1,
      "title": "① 達成目標｜この講座でできるようになること",
      "goal": "Gitの目的から操作・復元まで、学習後に説明・実行できる内容を把握する",
      "lead": "Gitを初めて学ぶ人でも、最後には「何をどこに記録し、変更をどう戻すか」を理解できるように設計しています。コマンドの暗記だけを目的にしません。",
      "blocks": [
        {
          "type": "text",
          "title": "ゴールは「操作の意味が分かる」こと",
          "body": "この講座の目標は、Pythonのコードを編集したときに、Gitがその変更をどう把握し、どの操作で履歴に保存するのか説明できることです。また、ブランチを使って改善を試し、問題があれば過去の状態を確認できるようになることを目指します。"
        },
        {
          "type": "list",
          "title": "修了時にできること",
          "items": [
            "GitとGitHubの違いを説明できる",
            "作業ディレクトリ・ステージングエリア・リポジトリの役割を説明できる",
            "status・diff・add・commit・logを目的に応じて使える",
            "ブランチの作成・切り替え・統合を説明できる",
            "過去のコードを比較し、安全な方法で戻せる",
            "MLflowのRun IDとGitコミットIDの違いを説明できる"
          ]
        },
        {
          "type": "note",
          "title": "学び方",
          "body": "図解・操作例の順に確認し、分からなければ一つ前のページに戻って構いません。ブラウザ内の疑似演習ではPCのGitを実際には操作しません。実コマンドは自分の練習用フォルダで試しましょう。",
          "level": "info"
        }
      ],
      "minutes": 5
    },
    {
      "id": "scope",
      "stage": 1,
      "title": "① 達成目標｜この講座で扱う範囲",
      "goal": "Gitの基本範囲と、別講座に任せる範囲を区別できる",
      "lead": "Gitは機械学習開発を支える複数の技術のうち「実装コードの履歴」を担当します。どこまでGitで管理するかも重要です。",
      "blocks": [
        {
          "type": "table",
          "title": "開発で使う技術の役割分担",
          "headers": [
            "対象",
            "主な管理方法",
            "Gitだけで十分？"
          ],
          "rows": [
            [
              "Pythonコード・テスト・設定ファイル",
              "Git",
              "はい（通常）"
            ],
            [
              "学習条件・評価指標・保存モデル",
              "MLflow",
              "いいえ"
            ],
            [
              "実行環境・OSライブラリ",
              "Docker・依存関係固定",
              "いいえ"
            ],
            [
              "大量の学習データ",
              "データストレージ・DVC等",
              "通常はいいえ"
            ]
          ]
        },
        {
          "type": "text",
          "title": "なぜ役割を分けるのか",
          "body": "例えば学習済みモデルの重みは巨大になることがあります。コードと同じ方法でモデルのバイナリファイルを何度もGitに積むと、リポジトリが膨らみ、履歴管理も扱いづらくなります。Gitはコードの履歴に集中させ、実験結果はMLflowへ、環境はDockerへ分担させます。"
        },
        {
          "type": "note",
          "title": "前提知識",
          "body": "Pythonのファイルを作成・保存したことがあれば進められます。ターミナルの経験がなくても、コマンドの意味を1つずつ説明します。",
          "level": "info"
        }
      ],
      "minutes": 6
    },
    {
      "id": "problem-overwrite",
      "stage": 2,
      "title": "② 目的｜上書き保存だけでは困る理由",
      "goal": "Gitが必要になる具体的な問題を説明できる",
      "lead": "昨日まで精度が良かった需要予測プログラムを今日改修したところ、精度が悪くなった場面を考えます。",
      "blocks": [
        {
          "type": "text",
          "title": "変更前に戻したくても、ファイルを上書きしている",
          "body": "`train.py`に特徴量を追加して保存すると、通常は新しい内容がファイルに残ります。前のコードを保存していなければ、「どの行を変えたか」「以前のコードはどうだったか」を簡単には確かめられません。"
        },
        {
          "type": "text",
          "title": "ファイル名にv1・v2を付ける方法の問題",
          "body": "`train_v1.py`、`train_final.py`、`train_final2.py`のように複製する方法では、どのファイルが正式版か分かりにくくなります。変更理由や、複数ファイルの組み合わせも記録しづらくなります。"
        },
        {
          "type": "diagram",
          "title": "Gitがある場合の考え方",
          "nodes": [
            [
              "最初の状態",
              "動くコードを記録"
            ],
            [
              "改善",
              "新しいコードへ変更"
            ],
            [
              "比較・復元",
              "過去と現在を追跡"
            ]
          ],
          "footer": "Gitが記録するのは過去のファイル状態とその履歴です。モデルの精度そのものは自動で記録しません。"
        },
        {
          "type": "note",
          "title": "この時点ではコマンドを覚えなくてよい",
          "body": "「コードを変更したとき、以前の状態を安全に取り出せるようにしたい」という問題意識がGitを学ぶ出発点です。",
          "level": "info"
        }
      ],
      "minutes": 7
    },
    {
      "id": "problem-team",
      "stage": 2,
      "title": "② 目的｜複数の作業を並行して進める理由",
      "goal": "ブランチが必要になる状況を説明できる",
      "lead": "予測モデルを改善しながら、既存のWeb画面の不具合も直したい場合を考えます。",
      "blocks": [
        {
          "type": "text",
          "title": "すべて同じコードで作業すると混ざりやすい",
          "body": "「モデルの特徴量を追加する」変更と「画面を修正する」変更を同時に進めると、途中の不完全なコードが混ざることがあります。どちらか一方だけを取り込んだり、元に戻したりする作業も複雑になります。"
        },
        {
          "type": "text",
          "title": "ブランチで作業の流れを分ける",
          "body": "Gitでは、同じ履歴から新たな開発の流れを始められます。例えば `main` を動作確認済みの版として残し、`feature/add-feature` で新しい特徴量を試します。改善を確認した後にmainへ統合できます。"
        },
        {
          "type": "code",
          "title": "作業の分岐イメージ",
          "source": "A --- B ------------------- M   main\n       \\                 /\n        C --- D ----------     feature/add-feature",
          "caption": "A・B・C・D・Mは説明用のコミットです。横線はコミットのつながり、Mは両方を統合した場合の例です。",
          "lang": "text"
        }
      ],
      "minutes": 6
    },
    {
      "id": "problem-ml",
      "stage": 2,
      "title": "② 目的｜機械学習でGitが重要になる理由",
      "goal": "機械学習の実験結果とコードの関係を説明できる",
      "lead": "同じデータでも前処理やモデルの計算を変えれば予測精度は変化します。その結果の理由を調べるには、実験時点のコードを特定する必要があります。",
      "blocks": [
        {
          "type": "text",
          "title": "精度だけでは原因を追えない",
          "body": "ある実験のMAEが「274」、別の実験が「260」だったとします。数字だけでは、学習率の変更によるものか、特徴量の計算式の変更によるものか分かりません。評価対象データが同一かも重要です。"
        },
        {
          "type": "diagram",
          "title": "役割を組み合わせる",
          "nodes": [
            [
              "Git",
              "どのコードで実行したか"
            ],
            [
              "MLflow",
              "どの条件・結果だったか"
            ],
            [
              "分析",
              "差異の理由を調べる"
            ]
          ],
          "footer": "同じGitコミットから複数のRunを実行することもできます。"
        },
        {
          "type": "text",
          "title": "GitコミットIDとMLflow Run ID",
          "body": "GitコミットIDはコードの履歴上の特定の状態を指し、Run IDは1回の実験実行を識別します。モデルの学習条件を変えて繰り返し実験する場合、Gitコミットは同じでもRun IDは毎回別になります。"
        }
      ],
      "minutes": 6
    },
    {
      "id": "what-is-git",
      "stage": 3,
      "title": "③ 概念・イメージ｜GitとGitHubは何が違う？",
      "goal": "GitとGitHubを混同せず説明できる",
      "lead": "GitはローカルPCでも利用できるソフトウェアです。GitHubはGitの履歴を保存・共有できるオンラインサービスです。",
      "blocks": [
        {
          "type": "table",
          "title": "役割の違い",
          "headers": [
            "項目",
            "Git",
            "GitHub"
          ],
          "rows": [
            [
              "種類",
              "バージョン管理ソフトウェア",
              "Gitを利用したホスティングサービス"
            ],
            [
              "主な場所",
              "自分のPC",
              "インターネット上"
            ],
            [
              "ネット接続",
              "通常のコミットには不要",
              "共有時には必要"
            ],
            [
              "主な用途",
              "編集履歴とブランチ",
              "共有・レビュー・公開"
            ]
          ]
        },
        {
          "type": "text",
          "title": "ローカルで履歴を作る",
          "body": "Gitでファイルの履歴を記録するには、GitHubアカウントは不要です。PC内にGitが管理する情報を置いて、`git add`・`git commit`を実行できます。"
        },
        {
          "type": "text",
          "title": "GitHubへ送るのは別の操作",
          "body": "ローカルでコミットしただけではGitHubの画面は更新されません。コミットをリモートリポジトリへ送る操作が `git push` です。逆にGitHub側から変更を取り込む操作には `git fetch` や `git pull` があります。"
        },
        {
          "type": "diagram",
          "title": "コードと履歴の基本的な位置関係",
          "nodes": [
            [
              "ローカルPC",
              "編集・コミット"
            ],
            [
              "push",
              "コミットを送信"
            ],
            [
              "GitHub",
              "共有・公開"
            ]
          ],
          "footer": "GitHub PagesはGitHub上のWebファイルを公開する別の機能です。"
        }
      ],
      "minutes": 7
    },
    {
      "id": "repo-concept",
      "stage": 3,
      "title": "③ 概念・イメージ｜リポジトリと管理フォルダ",
      "goal": "リポジトリがどの範囲のファイルを管理するか説明できる",
      "lead": "Gitを使う単位がリポジトリです。一般的には1つのプロジェクトフォルダを、1つのリポジトリとして扱います。",
      "blocks": [
        {
          "type": "text",
          "title": "リポジトリの範囲",
          "body": "DemandPilotというプロジェクトに `src/`、`tests/`、`README.md` がある場合、それらを1つの履歴として管理できます。個々のファイルごとではなく、プロジェクト全体の状態をコミットできます。"
        },
        {
          "type": "code",
          "title": "ファイルとフォルダの例",
          "source": "demandpilot/           【プロジェクトフォルダ】\n├── .git/               【Gitの管理フォルダ】\n├── src/                【ソースコードフォルダ】\n│   └── train.py        【Pythonファイル】\n├── tests/              【テストフォルダ】\n│   └── test_train.py   【Pythonファイル】\n└── README.md           【説明ファイル】",
          "caption": "`.git/`が履歴・参照情報を格納します。プロジェクトの実ファイルは、これとは別の場所にあります。",
          "lang": "text"
        },
        {
          "type": "text",
          "title": "`.git/`は何をしているのか",
          "body": "Gitはコミット履歴、ファイルの保存内容、ブランチの参照情報、ステージング情報などを `.git/` の内部に保存します。GitHubへ送るときも、それらから必要なGitオブジェクトや参照情報を送ります。"
        },
        {
          "type": "note",
          "title": "注意",
          "body": "`.git` フォルダを手動で編集・削除すると、履歴情報が壊れたり失われたりする可能性があります。中身は通常Gitコマンドで操作します。",
          "level": "warn"
        }
      ],
      "minutes": 8
    },
    {
      "id": "three-areas-concept",
      "stage": 3,
      "title": "③ 概念・イメージ｜3つの領域をイメージする",
      "goal": "作業・ステージング・履歴の3領域を区別できる",
      "lead": "Gitはファイルを編集しただけでは履歴を確定しません。変更を確定する前に、一時的に「次のコミットに入れる内容」を選べる仕組みがあります。",
      "blocks": [
        {
          "type": "diagram",
          "title": "Gitの3領域",
          "nodes": [
            [
              "作業ディレクトリ",
              "編集しているファイル"
            ],
            [
              "ステージング",
              "次に記録する内容"
            ],
            [
              "Git履歴",
              "確定したコミット"
            ]
          ],
          "footer": "`git add`で内容をステージングへ登録、`git commit`でその内容をコミットとして確定します。"
        },
        {
          "type": "text",
          "title": "作業ディレクトリ",
          "body": "VS Codeなどで直接編集するファイルが置かれる場所です。ここで `train.py` を直しても、それだけではGit履歴は変わりません。"
        },
        {
          "type": "text",
          "title": "ステージングエリア",
          "body": "コミットに含める内容を準備する場所です。正確にはGitが `.git/index` で管理する「次のコミットの候補」の状態です。ファイルの追加・変更・削除のうち、どの状態を記録するか選びます。"
        },
        {
          "type": "text",
          "title": "Git履歴（リポジトリ）",
          "body": "`git commit`で確定した結果はコミットとして記録されます。後でコミットを指定して、その時点のファイル状態を確認・復元できます。"
        },
        {
          "type": "note",
          "title": "重要",
          "body": "ステージングは「ファイルを別の作業フォルダに移動する」という意味ではありません。記録する内容のスナップショットを準備する処理です。",
          "level": "info"
        },
        {
          "type": "lab",
          "kind": "git",
          "title": "Gitの3領域を操作して確認する（疑似演習）",
          "description": "まず「編集する」を押し、次に「git add」「git commit」を押します。操作ごとに作業中の変更・ステージ済み内容・コミット数がどう変わるかを観察してください。"
        }
      ],
      "minutes": 10
    },
    {
      "id": "snapshot-concept",
      "stage": 3,
      "title": "③ 概念・イメージ｜コミットは「状態の記録」",
      "goal": "コミットが差分だけでなくプロジェクトの状態を表すことを説明できる",
      "lead": "コミットとは、その時点で追跡対象になっているファイルの状態を示す保存記録です。",
      "blocks": [
        {
          "type": "text",
          "title": "コミットをセーブポイントとして考える",
          "body": "ゲームのセーブポイントのように「この時点では、どのファイルがどの内容だったか」を参照できます。後のコミットが追加されても、前のコミットを指す情報は通常残ります。"
        },
        {
          "type": "table",
          "title": "コミットごとのファイル内容（例）",
          "headers": [
            "コミット",
            "train.py",
            "evaluate.py"
          ],
          "rows": [
            [
              "A",
              "平均値予測",
              "Accuracy計算"
            ],
            [
              "B",
              "LightGBM予測",
              "Accuracy計算"
            ],
            [
              "C",
              "LightGBM予測",
              "MAE計算"
            ]
          ]
        },
        {
          "type": "text",
          "title": "毎回ファイルを丸ごと複製するのか？",
          "body": "Gitは論理的には各コミットをファイル状態のスナップショットとして扱います。一方、同じ内容のファイルはオブジェクトを再利用し、内部では圧縮や差分表現を利用することもあります。各コミットごとにすべてのソースファイルを別名で複製する仕組みではありません。"
        },
        {
          "type": "note",
          "title": "ここが混同しやすい",
          "body": "コミットIDはモデルの学習条件を示すIDではありません。コードと履歴の特定の状態を識別するものです。",
          "level": "info"
        }
      ],
      "minutes": 7
    },
    {
      "id": "branch-concept",
      "stage": 3,
      "title": "③ 概念・イメージ｜ブランチとHEADのイメージ",
      "goal": "ブランチとHEADが何を指すか説明できる",
      "lead": "ブランチは「別フォルダ」でも「履歴全体のコピー」でもなく、コミットを指す名前付きの参照です。",
      "blocks": [
        {
          "type": "code",
          "title": "分岐している履歴のイメージ",
          "source": "A --- B --- C   ← main\n       \\--- D   ← feature/model\n            ↑\n        HEAD（現在のブランチがfeatureの場合）",
          "caption": "ブランチ名は最新のコミットを指し、新しいコミットを作るとその参照が進みます。HEADは現在どこで作業しているかを示します。",
          "lang": "text"
        },
        {
          "type": "text",
          "title": "なぜ名前が動くのか",
          "body": "`feature/model`でDの次にEをコミットすると、feature/modelはDではなくEを指すようになります。一方、mainの参照はCのままです。こうして、安定したmainを残しながら別の改善を試せます。"
        },
        {
          "type": "text",
          "title": "HEADとは",
          "body": "通常HEADは「現在選択しているブランチ」を指します。例えば `git switch main`すると、HEADはmainを選び、作業ディレクトリもmainのコミットに合わせて切り替わります。ただし未コミット変更があると、衝突防止のため切り替えが拒否される場合があります。"
        }
      ],
      "minutes": 7
    },
    {
      "id": "remote-concept",
      "stage": 3,
      "title": "③ 概念・イメージ｜ローカルとリモートのリポジトリ",
      "goal": "ローカルのコミットとGitHub上のコミットの違いを説明できる",
      "lead": "Gitの履歴は、自分のPCとGitHubに別々に存在します。同期は明示的な操作で行います。",
      "blocks": [
        {
          "type": "diagram",
          "title": "ローカルとリモートの関係",
          "nodes": [
            [
              "ローカルGit",
              "編集・commit"
            ],
            [
              "push",
              "GitHubへ送る"
            ],
            [
              "リモートGit",
              "共有される履歴"
            ]
          ],
          "footer": "GitHubから取得した変更を取り込むときは逆方向にfetch/pullします。"
        },
        {
          "type": "text",
          "title": "originとは",
          "body": "`origin`はリモートリポジトリの名前としてよく使われる既定の名前です。GitHubの固有コマンドではありません。`git remote -v` で登録先URLを確認できます。"
        },
        {
          "type": "text",
          "title": "コミットしたのにWebサイトが更新されない理由",
          "body": "PCで `git commit`しただけではGitHubのmainには新しいコミットがありません。公開サイトのコードもその時点では更新されません。ローカルで変更したコミットをGitHubへpushし、Pagesがデプロイして初めて公開が変わります。"
        },
        {
          "type": "note",
          "title": "この段階のポイント",
          "body": "「Gitで履歴を保存する」と「GitHubに送る」は別です。2つの操作を必ず区別してください。",
          "level": "info"
        }
      ],
      "minutes": 7
    },
    {
      "id": "git-internal-files",
      "stage": 4,
      "title": "④ 仕組み・構造｜`.git`フォルダの内部",
      "goal": "Gitの主な管理ファイル・フォルダの保存先を理解する",
      "lead": "Gitは「見えないところで勝手に履歴を管理する魔法」ではありません。履歴を管理するための情報を `.git/` に実際に記録しています。",
      "blocks": [
        {
          "type": "code",
          "title": "内部構成のイメージ",
          "source": ".git/                     【フォルダ】\n├── HEAD                   【テキストファイル】\n├── index                  【バイナリファイル】\n├── config                 【設定ファイル】\n├── refs/                  【参照を管理するフォルダ】\n│   └── heads/            【ローカルブランチへの参照】\n└── objects/               【オブジェクト保存フォルダ】\n    ├── xx/               【圧縮された個別オブジェクト】\n    └── pack/             【まとめて圧縮したオブジェクト】",
          "caption": "典型的な構成です。Gitの最適化や参照保存方式によって、ファイルの有無は異なります。",
          "lang": "text"
        },
        {
          "type": "table",
          "title": "内部データの役割",
          "headers": [
            "場所",
            "何を保持するか"
          ],
          "rows": [
            [
              "`.git/HEAD`",
              "現在のブランチやコミットを示す参照"
            ],
            [
              "`.git/index`",
              "ステージング中のファイルの状態"
            ],
            [
              "`.git/objects/`",
              "ファイル内容・ツリー・コミット等のGitオブジェクト"
            ],
            [
              "`.git/refs/heads/`",
              "ブランチ名からコミットを参照する情報"
            ],
            [
              "`.git/config`",
              "このリポジトリ固有の設定"
            ]
          ]
        },
        {
          "type": "text",
          "title": "ファイル名をそのまま保存するとは限らない",
          "body": "`train.py`をコミットした場合、Gitはファイルの内容をBlobオブジェクトとして保存します。元のファイル名やフォルダ構造との関係はTreeオブジェクトが保持します。したがって `.git/` に同名の `train.py` がそのまま置かれるとは限りません。"
        }
      ],
      "minutes": 8
    },
    {
      "id": "tracked-ignored",
      "stage": 4,
      "title": "④ 仕組み・構造｜追跡・未追跡・除外の仕組み",
      "goal": "tracked / untracked / ignoredの区別を説明できる",
      "lead": "Gitはフォルダに存在するすべてのファイルを、無条件にコミットするわけではありません。",
      "blocks": [
        {
          "type": "table",
          "title": "ファイルの状態",
          "headers": [
            "状態",
            "意味",
            "例"
          ],
          "rows": [
            [
              "Tracked（追跡中）",
              "Gitの管理対象として記録されたことがある",
              "`src/train.py`"
            ],
            [
              "Untracked（未追跡）",
              "作業フォルダにあるがまだGitで追跡されていない",
              "新規作成した `memo.txt`"
            ],
            [
              "Ignored（除外）",
              "通常の追加候補から外す設定がある",
              "`__pycache__/` や `.env`"
            ]
          ]
        },
        {
          "type": "text",
          "title": "`.gitignore`の役割",
          "body": "`.gitignore`は、通常の `git add` などで自動的に追加したくないパスを指定するテキストファイルです。Pythonのキャッシュ、秘密情報、実験で生成された大きなファイルなどを除外するために使います。"
        },
        {
          "type": "code",
          "title": "`.gitignore` の例",
          "source": ".env\n__pycache__/\n.pytest_cache/\ndata/raw/\nartifacts/",
          "caption": "`.gitignore`自体はGitで管理できます。これは「未追跡ファイルの追加を避ける」ための設定です。",
          "lang": "gitignore"
        },
        {
          "type": "note",
          "title": "よくある誤解",
          "body": "すでに一度コミットして追跡中のファイルは、後から `.gitignore`に書いても追跡が解除されません。追跡をやめたい場合は `git rm --cached` など別の操作が必要です。",
          "level": "warn"
        }
      ],
      "minutes": 9
    },
    {
      "id": "git-add-mechanism",
      "stage": 4,
      "title": "④ 仕組み・構造｜`git add`は何を保存するのか",
      "goal": "git addが実行時点のファイル内容をステージすることを説明できる",
      "lead": "ステージングは、コミットしたい内容を選んで準備する工程です。重要なのは「いつの内容が記録されるのか」です。",
      "blocks": [
        {
          "type": "text",
          "title": "ステージされるのはaddした時点の内容",
          "body": "`train.py`を修正して `git add train.py`を実行すると、その時点でGitが確認したファイル内容がステージングへ登録されます。その後さらにファイルを編集した場合、追加した変更は自動でステージングに反映されません。"
        },
        {
          "type": "table",
          "title": "同じファイルを2回編集した場合",
          "headers": [
            "時点",
            "作業ディレクトリ",
            "ステージング"
          ],
          "rows": [
            [
              "① 初期状態",
              "予測A",
              "予測A"
            ],
            [
              "② 編集してadd",
              "予測B",
              "予測B"
            ],
            [
              "③ さらに編集",
              "予測C",
              "予測B"
            ],
            [
              "④ commit",
              "予測C",
              "予測Bがコミットされる"
            ]
          ]
        },
        {
          "type": "text",
          "title": "なぜこの仕組みが役に立つのか",
          "body": "作業中の変更から「ここまでの修正だけを1コミットにしたい」と選べるためです。同じファイルを後で追加編集した場合でも、いったん整理した変更を独立したコミットにできます。"
        },
        {
          "type": "note",
          "title": "どう確認するか",
          "body": "`git diff`は主に作業ディレクトリとステージングの差、`git diff --staged`はステージングと直近のコミットの差を表示します。この2つを見ると、何がコミットされるのか区別できます。",
          "level": "info"
        }
      ],
      "minutes": 9
    },
    {
      "id": "git-commit-mechanism",
      "stage": 4,
      "title": "④ 仕組み・構造｜`git commit`の内部処理",
      "goal": "Blob・Tree・Commitオブジェクトの役割と履歴のつながりを説明できる",
      "lead": "`git commit`は単に変更ファイルをコピーする処理ではありません。ステージングの状態から、後で参照できるコミットを作ります。",
      "blocks": [
        {
          "type": "diagram",
          "title": "3種類のGitオブジェクト",
          "nodes": [
            [
              "Blob",
              "ファイルの内容"
            ],
            [
              "Tree",
              "名前・フォルダの構成"
            ],
            [
              "Commit",
              "Treeと履歴の情報"
            ]
          ],
          "footer": "この3種類を組み合わせて、ある時点のコードの状態を表します。"
        },
        {
          "type": "text",
          "title": "Blob：ファイルの中身",
          "body": "Blobオブジェクトにはファイル内容が保存されます。Gitは内容をハッシュ化して識別します。内容が同じであれば、名前の違うファイルでも同じBlobを参照する場合があります。"
        },
        {
          "type": "text",
          "title": "Tree：ファイル名や階層の対応",
          "body": "Treeオブジェクトには「この名前のファイルがどのBlobを参照するか」「このサブフォルダがどのTreeを参照するか」という関係が保存されます。Gitのスナップショット全体の構造を表すものです。"
        },
        {
          "type": "text",
          "title": "Commit：いつ誰が、どの状態を確定したか",
          "body": "Commitオブジェクトには、参照するTree、親コミット、作成者・コミッター、時刻、コミットメッセージなどの情報が保存されます。現在のブランチは新しいコミットを指すように更新されます。"
        },
        {
          "type": "code",
          "title": "コミットと内部情報の関係",
          "source": "コミット C\n  ├── Tree（当時のファイル一覧）\n  │    ├── src/train.py → Blob #1\n  │    └── README.md    → Blob #2\n  └── 親コミット B\n       └── 親コミット A",
          "caption": "これは概念図です。実際のGitは専用のオブジェクト形式を使い、Gitのハッシュ値を参照します。",
          "lang": "text"
        },
        {
          "type": "note",
          "title": "全履歴を理解するための要点",
          "body": "どのコミットを指定すれば、どのTree・Blobへ到達するか追跡できます。これにより、過去時点のファイル内容を取り出せます。",
          "level": "info"
        }
      ],
      "minutes": 11
    },
    {
      "id": "git-branches-head",
      "stage": 4,
      "title": "④ 仕組み・構造｜コミットするとブランチはどう動く？",
      "goal": "HEAD・ブランチ参照・コミットの更新関係を説明できる",
      "lead": "コミットを作ったときに更新されるのは、通常、現在のブランチが指す先です。",
      "blocks": [
        {
          "type": "code",
          "title": "コミット前後の参照",
          "source": "【コミット前】\nA --- B ← main ← HEAD\n\n【main上でCをコミット】\nA --- B --- C ← main ← HEAD",
          "caption": "HEADは通常「今選択しているブランチ」を通じて新しいコミットを指します。",
          "lang": "text"
        },
        {
          "type": "text",
          "title": "ブランチの正体は参照情報",
          "body": "mainブランチはフォルダ内に「main用のソースコード一式」を毎回コピーする仕組みではありません。コミットを参照する名前として、Gitの内部情報に保持されます。"
        },
        {
          "type": "text",
          "title": "ブランチを切り替えるとどうなるか",
          "body": "`git switch feature/x`を実行すると、通常はHEADがそのブランチを指すようになります。同時に作業ディレクトリとステージングが、そのブランチのコミット内容に合わせて更新されます。未コミット変更が破壊される可能性がある場合、Gitが切り替えを拒否することがあります。"
        },
        {
          "type": "note",
          "title": "Detached HEAD",
          "body": "コミットIDを直接チェックアウトした場合などには、HEADがブランチではなく特定コミットを直接指す状態もあります。初学者はまず「通常はHEADが現在のブランチを指す」と覚えましょう。",
          "level": "info"
        }
      ],
      "minutes": 8
    },
    {
      "id": "merge-mechanism",
      "stage": 4,
      "title": "④ 仕組み・構造｜マージの2つの形",
      "goal": "fast-forwardとマージコミットの違いを説明できる",
      "lead": "マージは変更の履歴を統合する操作ですが、状況によって履歴の形が変わります。",
      "blocks": [
        {
          "type": "text",
          "title": "Fast-forward：mainだけが先に進んでいなかった場合",
          "body": "mainから分岐してfeatureでコミットし、その間mainが変化していなければ、mainの参照先をfeatureの先端まで進めるだけで統合できる場合があります。これをfast-forwardといいます。"
        },
        {
          "type": "code",
          "title": "Fast-forwardのイメージ",
          "source": "変更前: A --- B ← main\n                 \\--- C --- D ← feature\n\n変更後: A --- B --- C --- D ← main, feature",
          "caption": "mainがC・Dへ進むだけで、通常新しいマージコミットを作る必要はありません。",
          "lang": "text"
        },
        {
          "type": "text",
          "title": "マージコミット：両方で開発が進んだ場合",
          "body": "mainでもfeatureでも新しいコミットが増えている場合、双方の変更を統合した新しいコミットを作ることがあります。マージコミットは通常、2つの親コミットを持ちます。"
        },
        {
          "type": "code",
          "title": "マージコミットのイメージ",
          "source": "A --- B --- C ---------- M ← main\n       \\                /\n        D --- E --------  ← feature",
          "caption": "CとEの両方の履歴を親として、Mで統合します。",
          "lang": "text"
        },
        {
          "type": "note",
          "title": "コンフリクトとは",
          "body": "同じ部分の変更が両立しない場合、Gitが自動で統合できず、どの内容を残すか人間の判断が必要です。",
          "level": "info"
        }
      ],
      "minutes": 9
    },
    {
      "id": "recover-mechanism",
      "stage": 4,
      "title": "④ 仕組み・構造｜復元と取り消しの考え方",
      "goal": "restore・revert・resetを安全性の観点で区別できる",
      "lead": "Gitには「元に戻す」操作が複数ありますが、何を戻すかが異なります。コマンド名だけで判断しないようにします。",
      "blocks": [
        {
          "type": "table",
          "title": "どの範囲に影響する？",
          "headers": [
            "操作",
            "主な用途",
            "注意点"
          ],
          "rows": [
            [
              "`git restore`",
              "作業ファイルやステージの内容を戻す",
              "未コミット変更が消える場合がある"
            ],
            [
              "`git revert`",
              "過去のコミットを打ち消す新しいコミットを作る",
              "通常は共有済み履歴に向く"
            ],
            [
              "`git reset`",
              "HEADやステージの位置を変更する",
              "オプション次第で履歴・作業内容を失う"
            ]
          ]
        },
        {
          "type": "text",
          "title": "例：まだコミットしていない変更を取り消したい",
          "body": "`train.py`を編集しただけなら、`git restore train.py`でGitに記録済みの状態へ戻せる場合があります。ただし編集途中の未保存・未コミット変更は失われるため、内容を確認してから使います。"
        },
        {
          "type": "text",
          "title": "例：push済みの不具合修正を打ち消したい",
          "body": "共有済みのコミットを「なかったこと」にするより、`git revert <commit>`で取り消し用の新しいコミットを作る方法が一般的です。履歴を消さずに原因と対応を追跡できます。"
        },
        {
          "type": "note",
          "title": "最初は使わないもの",
          "body": "`git reset --hard`、`git push --force` などは作業内容や共有履歴を失う原因になります。必要性が明確でない限り、この講座では通常操作として推奨しません。",
          "level": "warn"
        }
      ],
      "minutes": 9
    },
    {
      "id": "start-project",
      "stage": 5,
      "title": "⑤ 基本操作｜練習用リポジトリを作る",
      "goal": "安全な練習フォルダを作りGit管理を開始できる",
      "lead": "ここからはMacのターミナルで実際に実行できる例です。既存のDemandPilotを壊さないよう、独立した練習用フォルダで作業します。",
      "blocks": [
        {
          "type": "text",
          "title": "まずフォルダを分ける理由",
          "body": "すでにGitで管理しているリポジトリの中で `git init` を実行すると、意図しない状態になることがあります。初学者は、自分で新しい空の練習用フォルダを作って試す方が安全です。"
        },
        {
          "type": "code",
          "title": "空のGitリポジトリを作成",
          "source": "mkdir git-practice\ncd git-practice\ngit init -b main\ngit status",
          "caption": "`mkdir` はフォルダ作成、`cd` は移動、`git init -b main` はmainという名前の初期ブランチを使うGitリポジトリの初期化です。",
          "lang": "bash"
        },
        {
          "type": "text",
          "title": "実行後の状態",
          "body": "作業フォルダに隠しフォルダ `.git/` が生成され、まだコミットがない空のリポジトリになります。`git status`では「main上にいてコミットがない」ことが確認できます。"
        },
        {
          "type": "code",
          "title": "表示例（環境で多少異なります）",
          "source": "On branch main\n\nNo commits yet\n\nnothing to commit (create/copy files and use \"git add\" to track)",
          "caption": "これは実行結果の例であり、コマンドではありません。",
          "lang": "text"
        },
        {
          "type": "note",
          "title": "設定について",
          "body": "コミットで名前・メールの設定を求められた場合は `git config user.name \"Learner\"` と `git config user.email \"learner@example.invalid\"` を練習フォルダ内で設定できます。公開用ではGitHubのnoreplyメールを使ってください。",
          "level": "info"
        }
      ],
      "minutes": 9
    },
    {
      "id": "create-file",
      "stage": 5,
      "title": "⑤ 基本操作｜ファイルを作成した直後の状態",
      "goal": "新しいファイルがuntrackedになることとstatusの表示を理解する",
      "lead": "Gitは新しいファイルを作っただけでは追跡しません。まず状態を確認します。",
      "blocks": [
        {
          "type": "code",
          "title": "Pythonファイルを作る（Macのターミナル例）",
          "source": "cat > train.py <<'PY'\nsales = [10, 20, 30, 40, 50, 60, 70]\nprediction = sum(sales[-7:])\nprint(prediction)\nPY\n\ngit status",
          "caption": "`cat` の部分は新規ファイルを作るための例です。VS Codeで同じtrain.pyを作っても構いません。",
          "lang": "bash"
        },
        {
          "type": "code",
          "title": "出力例",
          "source": "Untracked files:\n  train.py\n\nnothing added to commit but untracked files present",
          "caption": "Gitはtrain.pyの存在を把握していますが、まだ次のコミットに含める設定になっていません。",
          "lang": "text"
        },
        {
          "type": "text",
          "title": "なぜ自動で追跡されないのか",
          "body": "一時的なメモ、実験時に生成したログ、秘密情報まで無条件にコミット対象にしないためです。Gitでは開発者が追加するファイルを選びます。"
        },
        {
          "type": "note",
          "title": "この段階の確認",
          "body": "`git status`は「何が未追跡で、何が編集され、何がステージ済みか」を知るための最も基本的なコマンドです。",
          "level": "info"
        }
      ],
      "minutes": 7
    },
    {
      "id": "add-first-file",
      "stage": 5,
      "title": "⑤ 基本操作｜`git add`で記録対象にする",
      "goal": "未追跡のファイルをステージングに追加し状態を確認できる",
      "lead": "次のコミットへ含めるファイルを選択します。",
      "blocks": [
        {
          "type": "code",
          "title": "ファイルをステージする",
          "source": "git add train.py\ngit status",
          "caption": "指定したtrain.pyの内容がステージングに登録されます。まだコミットは作られていません。",
          "lang": "bash"
        },
        {
          "type": "code",
          "title": "出力例",
          "source": "Changes to be committed:\n  new file:   train.py",
          "caption": "「Changes to be committed」は次にコミットされる予定の内容です。",
          "lang": "text"
        },
        {
          "type": "text",
          "title": "ここで何が変わった？",
          "body": "作業ディレクトリには引き続きtrain.pyが存在します。加えてGitのステージング（index）に、その時点のファイルの内容を参照する情報が登録されました。コミット履歴はまだ増えていません。"
        },
        {
          "type": "note",
          "title": "補足",
          "body": "`git add .`は現在のディレクトリ以下の変更をまとめて登録します。便利ですが、追加してはいけないファイルが紛れないよう、最初はファイル名を指定してaddすると理解しやすいです。",
          "level": "info"
        }
      ],
      "minutes": 8
    },
    {
      "id": "commit-first",
      "stage": 5,
      "title": "⑤ 基本操作｜`git commit`で履歴を確定する",
      "goal": "初回コミットを作成し、commitとpushを区別できる",
      "lead": "ステージングに登録した内容から、最初のコミットを作ります。",
      "blocks": [
        {
          "type": "code",
          "title": "最初のコミットを作る",
          "source": "git commit -m \"最初の需要予測コードを追加\"\ngit status\ngit log --oneline",
          "caption": "`-m`の後ろはコミットメッセージです。「なぜ・何を変更したか」が伝わる短い文章にします。",
          "lang": "bash"
        },
        {
          "type": "text",
          "title": "実行後の状態",
          "body": "`git log --oneline`には新しいコミットのIDとメッセージが表示されます。作業内容がコミットと同じなら `git status`は「working tree clean」といった状態を示します。"
        },
        {
          "type": "code",
          "title": "表示例",
          "source": "a1b2c3d (HEAD -> main) 最初の需要予測コードを追加",
          "caption": "`a1b2c3d`は説明用の短縮IDです。実際のIDは実行環境ごとに異なります。",
          "lang": "text"
        },
        {
          "type": "note",
          "title": "忘れやすい点",
          "body": "この段階ではコミットがPC内に保存されただけです。GitHubには自動送信されません。",
          "level": "info"
        }
      ],
      "minutes": 8
    },
    {
      "id": "edit-diff",
      "stage": 5,
      "title": "⑤ 基本操作｜編集内容を`git diff`で確認",
      "goal": "差分表示の + と - の意味を読み取れる",
      "lead": "既存ファイルを修正したとき、何が変わったか確認します。",
      "blocks": [
        {
          "type": "code",
          "title": "train.pyを編集する例",
          "source": "sales = [10, 20, 30, 40, 50, 60, 70]\nprediction = sum(sales[-7:]) / 7\nprint(prediction)",
          "caption": "さきほど作ったtrain.pyの2行目だけを、合計値から平均値の計算へ変更する例です。",
          "lang": "python"
        },
        {
          "type": "code",
          "title": "変更を確認",
          "source": "git status\ngit diff -- train.py",
          "caption": "`git diff`はこの場面で、ステージングと作業ディレクトリの違いを表示します。",
          "lang": "bash"
        },
        {
          "type": "code",
          "title": "差分の表示例",
          "source": "-prediction = sum(sales[-7:])\n+prediction = sum(sales[-7:]) / 7",
          "caption": "先頭が`-`の行は取り除く行、`+`の行は追加する行を表します。変更のない周辺行も表示されることがあります。",
          "lang": "text"
        },
        {
          "type": "text",
          "title": "差分を見る意味",
          "body": "「平均値に変更したつもりが、別のファイルも編集していた」などのミスをコミット前に発見できます。機械学習では特徴量や期間指定の細かな修正も精度に影響するため、差分確認が特に重要です。"
        }
      ],
      "minutes": 8
    },
    {
      "id": "staged-diff",
      "stage": 5,
      "title": "⑤ 基本操作｜ステージ後の差分を読む",
      "goal": "git diffとgit diff --stagedを区別できる",
      "lead": "変更をaddした後、実際にコミットされる内容を確認します。",
      "blocks": [
        {
          "type": "code",
          "title": "ステージして2種類の差分を見る",
          "source": "git add train.py\ngit diff -- train.py\ngit diff --staged -- train.py",
          "caption": "変更した後すぐaddしたなら、最初のdiffは空になり、`--staged`は合計から平均への差分を表示するはずです。",
          "lang": "bash"
        },
        {
          "type": "text",
          "title": "2つの比較対象",
          "body": "`git diff`は作業中のファイルとステージングを比較します。一方 `git diff --staged`はステージングと直近コミットを比較します。つまり後者が「次にコミットする変更の候補」を確認するためのコマンドです。"
        },
        {
          "type": "code",
          "title": "もう一度編集するとどうなる？",
          "source": "git add train.py\n# ここでVS Codeからtrain.pyをさらに変更する\ngit status\ngit diff\ngit diff --staged",
          "caption": "新たな変更は作業側にだけ残り、以前の変更はステージ済みです。再びgit addしない限り、最新の編集すべてがコミットに入るわけではありません。",
          "lang": "bash"
        },
        {
          "type": "note",
          "title": "確認の習慣",
          "body": "コミット前に `git status` と `git diff --staged` を見る習慣を付けると、意図しないファイルや変更の混入に気づきやすくなります。",
          "level": "info"
        }
      ],
      "minutes": 8
    },
    {
      "id": "unstage-and-restore",
      "stage": 5,
      "title": "⑤ 基本操作｜ステージングを取り消す",
      "goal": "ステージ取り消しとファイル編集の取り消しを区別できる",
      "lead": "間違えて `git add`したとき、作業中のファイルを消さずにステージだけ解除できます。",
      "blocks": [
        {
          "type": "code",
          "title": "ステージのみ解除する",
          "source": "git restore --staged train.py\ngit status",
          "caption": "通常、作業ディレクトリのtrain.pyは変更されたまま残り、ステージングから外れます。",
          "lang": "bash"
        },
        {
          "type": "text",
          "title": "「保存対象の選択を解除」と考える",
          "body": "`git restore --staged`は次のコミット対象から戻す操作です。作業ディレクトリでせっかく書いたコードを直ちに消すものではありません。"
        },
        {
          "type": "code",
          "title": "作業ファイル自体を元に戻す操作",
          "source": "git restore -- train.py",
          "caption": "こちらは作業ディレクトリの未ステージ変更を戻すため、未コミットの編集が消える可能性があります。実行前にdiffを確認してください。",
          "lang": "bash"
        },
        {
          "type": "note",
          "title": "安全策",
          "body": "最初は `git status` → `git diff` / `git diff --staged` → 対象を指定したrestore、という順番で確認しましょう。",
          "level": "warn"
        }
      ],
      "minutes": 7
    },
    {
      "id": "git-log-show",
      "stage": 5,
      "title": "⑤ 基本操作｜過去のコミット内容を見る",
      "goal": "log・show・diffを使って変更内容を確認できる",
      "lead": "履歴を残すメリットは、後から内容を確認できる点にあります。",
      "blocks": [
        {
          "type": "code",
          "title": "直近の履歴と変更を確認",
          "source": "git log --oneline --max-count=5\ngit show --stat HEAD\ngit show HEAD:train.py",
          "caption": "`HEAD`は現在参照中のコミットです。`--stat`は変更ファイルの概要、`HEAD:train.py`はコミット内のファイル内容を表示します。",
          "lang": "bash"
        },
        {
          "type": "text",
          "title": "過去と現在の差を見る",
          "body": "コミットIDが分かれば、`git diff <古いID> HEAD -- train.py`でその時点と現在を比較できます。例えばモデルの予測ロジックを変えた場所を探すときに利用します。"
        },
        {
          "type": "code",
          "title": "2つのコミットを比較する例",
          "source": "git diff a1b2c3d HEAD -- train.py",
          "caption": "`a1b2c3d`は説明用。実際は `git log --oneline` に表示されたコミットIDに置き換えます。",
          "lang": "bash"
        },
        {
          "type": "note",
          "title": "コミットIDの意味",
          "body": "コミットIDはバージョン番号のように通し番号で増えるのではなく、コミット内容等に基づくハッシュで生成されます。",
          "level": "info"
        }
      ],
      "minutes": 8
    },
    {
      "id": "branch-operations",
      "stage": 5,
      "title": "⑤ 基本操作｜ブランチを作って切り替える",
      "goal": "switch・branchコマンドで独立した変更を管理できる",
      "lead": "動いているコードをmainに残しながら、新しい予測方法を試す例です。",
      "blocks": [
        {
          "type": "code",
          "title": "改善用のブランチを作る",
          "source": "git switch -c feature/mean-model\ngit branch\ngit status",
          "caption": "`switch -c`はブランチを作成して、そのブランチに切り替える操作です。`git branch`は一覧を表示し、現在のブランチには`*`が付きます。",
          "lang": "bash"
        },
        {
          "type": "text",
          "title": "切り替え直後に何が変わるのか",
          "body": "作成した直後はmainと同じコミットを指します。ここから別のコードに変更してコミットすると、featureブランチだけが先に進み、mainは元のコミットを指したままになります。"
        },
        {
          "type": "code",
          "title": "切り替えと確認",
          "source": "git switch main\ngit log --oneline -3\ngit switch feature/mean-model\ngit log --oneline -3",
          "caption": "作業ディレクトリの内容は、選択したブランチが指すコミットに合わせて切り替わります。",
          "lang": "bash"
        },
        {
          "type": "note",
          "title": "作業途中で切り替えられない場合",
          "body": "未コミット変更が切り替え先のファイルと衝突する場合、Gitは変更を守るため切り替えを拒否します。コミットするか、変更を退避してから切り替えます。",
          "level": "info"
        }
      ],
      "minutes": 8
    },
    {
      "id": "branch-merge",
      "stage": 5,
      "title": "⑤ 基本操作｜ブランチを統合する",
      "goal": "mergeを実行する順番と結果を説明できる",
      "lead": "feature側の改修が動作確認できたら、安定版として使うmainに取り込みます。",
      "blocks": [
        {
          "type": "code",
          "title": "統合の基本操作",
          "source": "git switch main\ngit merge feature/mean-model\ngit log --oneline --graph --all -6",
          "caption": "`git merge`は「現在のブランチに、指定したブランチの変更を取り込む」操作です。ここではmainへfeatureを取り込みます。",
          "lang": "bash"
        },
        {
          "type": "text",
          "title": "どんな結果になるのか",
          "body": "mainが分岐後に進んでいなければfast-forwardになることがあります。mainでも別変更が進んでいればマージコミットが作られる場合があります。履歴は `git log --graph` で確認します。"
        },
        {
          "type": "text",
          "title": "コンフリクトが起きたら",
          "body": "自動で統合できないファイルはGitが衝突を報告します。該当箇所を確認して正しいコードへ編集し、`git add <対象>`で解決済みにします。マージコミットを作る必要がある場合は `git commit` などで完了します。"
        },
        {
          "type": "note",
          "title": "マージ前後のテスト",
          "body": "機械学習の前処理を変えた場合は、統合の前後でテストを実行しましょう。コードとして整合していても、予測値が意図しない形に変わる可能性があります。",
          "level": "info"
        }
      ],
      "minutes": 9
    },
    {
      "id": "remote-operations",
      "stage": 5,
      "title": "⑤ 基本操作｜GitHubと共有する基本操作",
      "goal": "clone・remote・push・pullの意味と実行順序を理解する",
      "lead": "GitHubはGitのコミット履歴を他者や別のPCと共有する場所です。",
      "blocks": [
        {
          "type": "code",
          "title": "リモートの状態を確認",
          "source": "git remote -v\ngit branch -vv",
          "caption": "リモートのURLとブランチの追跡設定を確認します。設定がないリポジトリでは何も表示されないことがあります。",
          "lang": "bash"
        },
        {
          "type": "code",
          "title": "GitHubの既存リポジトリを取得",
          "source": "git clone https://github.com/your-account/git-practice.git",
          "caption": "`your-account`は自分のGitHubユーザー名に置き換えます。実在するリポジトリURLが必要です。",
          "lang": "bash"
        },
        {
          "type": "code",
          "title": "コミットをGitHubに送る",
          "source": "git push -u origin main",
          "caption": "`-u`は以降のpush/pullに利用する追跡先を設定します。リモートが未登録なら `git remote add origin <URL>` が必要です。",
          "lang": "bash"
        },
        {
          "type": "code",
          "title": "リモートの更新をローカルへ反映",
          "source": "git fetch origin\ngit pull --ff-only origin main",
          "caption": "`fetch`はリモートの情報を取得、`pull`はローカルの現在ブランチへ取り込みます。`--ff-only`は履歴をfast-forwardできる場合に限って実行します。",
          "lang": "bash"
        },
        {
          "type": "note",
          "title": "混乱しやすい点",
          "body": "`git pull`はGitHubに送るコマンドではなく、GitHubなどから更新を取り込むためのコマンドです。",
          "level": "info"
        }
      ],
      "minutes": 10
    },
    {
      "id": "safe-restore",
      "stage": 5,
      "title": "⑤ 基本操作｜履歴を消さずに過去のコードを扱う",
      "goal": "show・restore・revertの使い分けを具体的に説明できる",
      "lead": "動いていた時点のコードを確認したい場合と、誤った変更を取り消したい場合では操作が異なります。",
      "blocks": [
        {
          "type": "code",
          "title": "過去のコードを読む（変更しない）",
          "source": "git show a1b2c3d:train.py\ngit diff a1b2c3d HEAD -- train.py",
          "caption": "この2つは表示・比較が目的です。実行しても作業ディレクトリのファイルは基本的に書き換えません。",
          "lang": "bash"
        },
        {
          "type": "code",
          "title": "過去版を作業ファイルへ取り出す",
          "source": "git restore --source=a1b2c3d -- train.py\ngit status",
          "caption": "実際のコミットIDに置き換えます。作業ディレクトリのtrain.pyを過去版で置き換えるので、編集内容を失うおそれがあります。",
          "lang": "bash"
        },
        {
          "type": "code",
          "title": "共有済みの不具合コミットを取り消す",
          "source": "git revert <取り消したいコミットID>",
          "caption": "通常は取り消しのための新しいコミットを作ります。衝突がある場合は手動の解決が必要です。",
          "lang": "bash"
        },
        {
          "type": "note",
          "title": "初心者が避けたい操作",
          "body": "`reset --hard`や履歴のforce pushは、別の目的を持つ強い操作です。今回は「見る」「作業ファイルへ取り出す」「新しいコミットで取り消す」を区別できれば十分です。",
          "level": "warn"
        }
      ],
      "minutes": 9
    },
    {
      "id": "ignore-limits",
      "stage": 5,
      "title": "⑤ 基本操作｜Gitに入れないデータと秘密情報",
      "goal": "除外設定を理解し、モデル・ログ・認証情報を誤って公開しない",
      "lead": "機械学習プロジェクトは学習データ・モデル・一時ファイルが大きくなるため、Gitへ追加する範囲を決める必要があります。",
      "blocks": [
        {
          "type": "code",
          "title": "典型的な.gitignore",
          "source": "# 秘密情報\n.env\n\n# Pythonの一時ファイル\n__pycache__/\n.pytest_cache/\n\n# 大容量データ・学習成果物\ndata/raw/\nartifacts/\nmlflow/",
          "caption": "必要な設定ファイルやデータの保存方針はプロジェクトに合わせて調整します。",
          "lang": "gitignore"
        },
        {
          "type": "text",
          "title": "記録する必要がある情報とGit管理は別",
          "body": "学習データやモデルをGitから除外しても、実験の再現に必要な情報を管理しなくてよいわけではありません。データの取得元、スナップショット、環境、MLflowのRunなどは別途記録します。"
        },
        {
          "type": "code",
          "title": "すでに追跡していたファイルを追跡対象から外す",
          "source": "git rm --cached .env\ngit commit -m \"認証情報ファイルの追跡を解除\"",
          "caption": "`.env`の実ファイルは作業フォルダに残しつつ、次のコミットからGitの追跡対象を外せます。ただし過去の履歴から秘密情報は消えません。",
          "lang": "bash"
        },
        {
          "type": "note",
          "title": "秘密情報が履歴に入った場合",
          "body": "GitHubへ公開してから `.env` を削除しただけでは、過去コミットに残る場合があります。該当の認証情報を無効化・再発行し、必要に応じて履歴の除去と公開状況の確認を行う必要があります。",
          "level": "warn"
        }
      ],
      "minutes": 9
    },
    {
      "id": "scenario-intro",
      "stage": 6,
      "title": "⑥ ユースケース｜DemandPilotで特徴量を追加する",
      "goal": "現実の開発でなぜGitの各操作が必要になるか一連の作業で理解する",
      "lead": "ここではDemandPilotの需要予測コードに新しい特徴量を加える流れを想定します。実プロジェクトを直接変更せず、考え方を確認する例です。",
      "blocks": [
        {
          "type": "text",
          "title": "作業の前提",
          "body": "すでに `main` には動作確認済みのコードがあり、GitHubへ共有されているものとします。ここから新しい特徴量を追加し、モデルの精度を比較したい状況です。"
        },
        {
          "type": "diagram",
          "title": "安全に進める標準的な流れ",
          "nodes": [
            [
              "mainの状態を確認",
              "git status / log"
            ],
            [
              "改善ブランチ",
              "switch -c"
            ],
            [
              "編集・テスト",
              "diff / pytest"
            ],
            [
              "変更を確定",
              "add / commit"
            ]
          ],
          "footer": "検証・レビューが完了してからmainへ取り込みます。"
        },
        {
          "type": "code",
          "title": "最初の確認と作業ブランチ",
          "source": "git status\ngit log --oneline -3\ngit switch -c feature/new-demand-feature",
          "caption": "作業前に意図しない未コミット変更がないことを確認してからブランチを作ります。",
          "lang": "bash"
        },
        {
          "type": "note",
          "title": "DemandPilotの実行環境",
          "body": "DemandPilotのようにDockerでPythonを実行する構成なら、実際のテストもDockerコンテナ内で実行します。ここでのGitコマンド自体は通常ホストPCから操作します。",
          "level": "info"
        }
      ],
      "minutes": 8
    },
    {
      "id": "scenario-edit",
      "stage": 6,
      "title": "⑥ ユースケース｜変更・テスト・コミットを一連で実行",
      "goal": "複数のGit操作を組み合わせて、意味のある変更履歴を残せる",
      "lead": "特徴量を加えた後、すぐにコミットせず差分とテストを確認します。",
      "blocks": [
        {
          "type": "text",
          "title": "コード変更とテストが1セット",
          "body": "例えば「販売数量の直近7日平均」を特徴量に加える場合、その計算式だけでなく、データリークを起こしていないか確認するテストも必要になります。コードと関連テストを同じ目的のコミットにまとめます。"
        },
        {
          "type": "code",
          "title": "実行手順の例（説明用）",
          "source": "# src/features.py を編集し、tests/test_features.py を更新\ngit status\ngit diff -- src/features.py tests/test_features.py\n\n# Docker運用の場合のテスト例\ndocker compose run --rm --entrypoint pytest pipeline -q\n\n# 変更内容をステージして確認\ngit add src/features.py tests/test_features.py\ngit diff --staged\ngit commit -m \"需要予測の特徴量を追加\"",
          "caption": "上記のDockerコマンドはDemandPilotで使っているCompose構成を想定した例です。テストの実行後にコミットします。",
          "lang": "bash"
        },
        {
          "type": "text",
          "title": "なぜすぐcommitしないのか",
          "body": "動作確認前のコードも履歴に残せますが、機械学習では前処理や評価期間を誤ると数値だけが良く見える場合があります。少なくともテスト結果・意図しない差分の有無を確認してからコミットすると、履歴の意味が明確になります。"
        },
        {
          "type": "note",
          "title": "履歴から確認できること",
          "body": "このコミットには、特徴量の実装とテストの変更が含まれています。後日、評価の変化を調べる際に `git show <コミットID>` を使って「何を変えたか」を確認できます。",
          "level": "info"
        }
      ],
      "minutes": 9
    },
    {
      "id": "scenario-run",
      "stage": 6,
      "title": "⑥ ユースケース｜学習条件とコードのバージョンを記録",
      "goal": "GitのコミットIDを実験記録と紐づける意味を説明できる",
      "lead": "改修後のコードで複数のパラメータを試すと、Gitだけでは「どの実験が何を出したか」までは管理できません。ここからMLflowと役割分担します。",
      "blocks": [
        {
          "type": "code",
          "title": "学習前にコミットIDを確認",
          "source": "git status\ngit rev-parse HEAD",
          "caption": "最初に `git status`で未コミット変更がないことを確認します。`git rev-parse HEAD`は現在参照しているコミットのIDを表示します。",
          "lang": "bash"
        },
        {
          "type": "table",
          "title": "実験とコードの対応（数値は架空）",
          "headers": [
            "Gitコミット",
            "MLflow Run",
            "学習率",
            "MAE"
          ],
          "rows": [
            [
              "`f3a91bc`",
              "Run 001",
              "0.01",
              "280"
            ],
            [
              "`f3a91bc`",
              "Run 002",
              "0.001",
              "260"
            ],
            [
              "`f3a91bc`",
              "Run 003",
              "0.0001",
              "267"
            ]
          ]
        },
        {
          "type": "text",
          "title": "なぜGitコミットが同じでも良いのか",
          "body": "学習率は実行時のパラメータとして変えられるため、学習コードを変更しなければGitの履歴は増えません。一方MLflowのRunは実験のたびに別のIDを持ち、学習条件・精度・学習済みモデルなどを管理できます。"
        },
        {
          "type": "code",
          "title": "Docker内でGitコミットIDを渡す例",
          "source": "# MacなどGitがある作業PC側\nGIT_SHA=$(git rev-parse HEAD)\ndocker compose run --rm -e GIT_SHA=\"$GIT_SHA\" pipeline train\n\n# Pythonの学習処理側（考え方）\n# mlflow.set_tag(\"git_commit\", os.environ[\"GIT_SHA\"])",
          "caption": "この例はGitHub Pagesで動くものではなく、ローカルDocker/MLflowを組み合わせた運用例です。Python側で明示的なタグ記録処理が必要です。",
          "lang": "bash"
        },
        {
          "type": "note",
          "title": "コンテナの場合の注意",
          "body": "Dockerイメージに `.git`を含めていない場合、学習プロセス内ではコミットIDを自動取得できないことがあります。ホスト側でコミットIDを取得し、環境変数などでコンテナへ渡す方法があります。",
          "level": "info"
        }
      ],
      "minutes": 10
    },
    {
      "id": "scenario-investigate",
      "stage": 6,
      "title": "⑥ ユースケース｜精度が悪化した原因を追う",
      "goal": "MLflowのRunから対応するコードを特定する調査手順を説明できる",
      "lead": "モデルのMAEが悪くなったとき、まず「学習コードを変えたのか、実験条件が変わったのか」を切り分けます。",
      "blocks": [
        {
          "type": "diagram",
          "title": "不具合・精度悪化時の調査",
          "nodes": [
            [
              "MLflow",
              "Runの条件と評価"
            ],
            [
              "Git",
              "Runに対応するコミット"
            ],
            [
              "差分確認",
              "変更内容を比較"
            ]
          ],
          "footer": "データ期間、ライブラリ、乱数などの条件も合わせて確認します。"
        },
        {
          "type": "text",
          "title": "同じGitコミットの場合",
          "body": "同じコミットのRun間で精度が変わったなら、まず学習パラメータ、使用データ、データの分割、乱数シードなどを確認します。コードが同じでも、実行条件が違えば結果は変わります。"
        },
        {
          "type": "text",
          "title": "異なるGitコミットの場合",
          "body": "精度の差がある2つのRunに異なるコミットIDが記録されているなら、Gitでコードの差分を確認します。例えば特徴量のウィンドウ幅、対象期間、欠損値処理などが変更されていないか調べます。"
        },
        {
          "type": "code",
          "title": "2つのコードの違いを確認",
          "source": "git diff <以前のコミットID> <現在のコミットID> -- src/features.py\ngit show <現在のコミットID> --stat",
          "caption": "`<...>`は説明用の置換箇所です。実行時には実際のコミットIDを指定します。",
          "lang": "bash"
        }
      ],
      "minutes": 8
    },
    {
      "id": "scenario-share",
      "stage": 6,
      "title": "⑥ ユースケース｜GitHubへ公開・共有する",
      "goal": "ローカル変更が公開サイトへ届くまでの流れを説明できる",
      "lead": "改修が完了したら、ローカルの履歴をGitHubに送ります。これで他者がコードを参照したり、GitHub Pagesでサイトを公開したりできるようになります。",
      "blocks": [
        {
          "type": "code",
          "title": "コミット済みの変更を確認",
          "source": "git status\ngit log --oneline -3\ngit remote -v",
          "caption": "push先のURLが正しいことを確認します。別リポジトリへ誤って送信しないためにも重要です。",
          "lang": "bash"
        },
        {
          "type": "code",
          "title": "リモートへpushする",
          "source": "git push -u origin feature/new-demand-feature",
          "caption": "改善ブランチをGitHubに送る例です。mainへ統合する前にプルリクエストを作成してレビューする運用もあります。",
          "lang": "bash"
        },
        {
          "type": "text",
          "title": "GitHub Pagesの場合",
          "body": "Web教材のような静的サイトなら、GitHubの対象ブランチへHTML・CSS・JavaScriptなどをpushした後、GitHub Pagesのデプロイ処理によって公開ページへ反映されます。単なるGit commitと、Webページの公開は異なる段階です。"
        },
        {
          "type": "note",
          "title": "公開前に必ず見るもの",
          "body": "GitHubのPublicリポジトリは第三者がコードやコミット履歴を確認できます。秘密情報・社内ソース・個人情報・ライセンス条件に問題がないか、push前に確認してください。",
          "level": "warn"
        }
      ],
      "minutes": 8
    },
    {
      "id": "summary-map",
      "stage": 7,
      "title": "⑦ まとめ｜全体を1枚で振り返る",
      "goal": "Gitの目的・概念・操作をつなげて説明できる",
      "lead": "Gitで重要なのは、コードをどの時点で記録しているかを整理することです。",
      "blocks": [
        {
          "type": "diagram",
          "title": "変更が履歴になるまで",
          "nodes": [
            [
              "編集",
              "作業ディレクトリ"
            ],
            [
              "git add",
              "ステージング"
            ],
            [
              "git commit",
              "ローカルの履歴"
            ],
            [
              "git push",
              "GitHubへ共有"
            ]
          ],
          "footer": "履歴を確認するときはlog/show/diff、別の作業を試すときはswitch/mergeを使います。"
        },
        {
          "type": "table",
          "title": "何がしたい？→どのコマンド？",
          "headers": [
            "やりたいこと",
            "主なコマンド"
          ],
          "rows": [
            [
              "現在の変更状態を知る",
              "`git status`"
            ],
            [
              "未ステージの差分を知る",
              "`git diff`"
            ],
            [
              "次のコミットに入れる",
              "`git add`"
            ],
            [
              "変更を履歴として残す",
              "`git commit`"
            ],
            [
              "履歴を一覧で見る",
              "`git log`"
            ],
            [
              "過去の中身を見る",
              "`git show`"
            ],
            [
              "別の改善を始める",
              "`git switch -c`"
            ],
            [
              "別のブランチを取り込む",
              "`git merge`"
            ],
            [
              "共有済みの修正を打ち消す",
              "`git revert`"
            ],
            [
              "GitHubへコミットを送る",
              "`git push`"
            ]
          ]
        },
        {
          "type": "text",
          "title": "Gitと他の技術の関係",
          "body": "Gitはコード履歴、Dockerは実行環境、pytestは動作確認、MLflowは実験とモデルの記録を主に担当します。機械学習の再現性を高めるには、これらを組み合わせて使う必要があります。"
        }
      ],
      "minutes": 10
    },
    {
      "id": "summary-checklist",
      "stage": 7,
      "title": "⑦ まとめ｜現場で迷わないための確認事項",
      "goal": "コミット前・学習前・公開前の確認項目を判断できる",
      "lead": "実際の開発で役立つのは、コマンドをただ暗記するより「いつ何を確認するか」を覚えることです。",
      "blocks": [
        {
          "type": "list",
          "title": "コミット前",
          "items": [
            "`git status`で意図しないファイルがないか確認する",
            "`git diff`と`git diff --staged`で変更内容を読む",
            "変更の目的が伝わるコミットメッセージを書く",
            "必要なテストを実行し、結果を確認する"
          ]
        },
        {
          "type": "list",
          "title": "モデル学習前",
          "items": [
            "再現に使うコードがコミット済みであることを確認する",
            "GitコミットID・使用データ・分割方法・ライブラリ環境を特定できるようにする",
            "パラメータ・指標・モデルの保存先を決める"
          ]
        },
        {
          "type": "list",
          "title": "GitHub公開前",
          "items": [
            "push先リポジトリとブランチを確認する",
            "機密データ・個人情報・不要なモデルファイルがコミットに含まれていないことを確認する",
            "公開後にWebサイトやREADMEのリンクが正常か確認する"
          ]
        },
        {
          "type": "note",
          "title": "最後の知識問題",
          "body": "次のページで、用語だけでなく「ある状況で何をすべきか」を問います。回答後に、理由を付けて正誤を確認できます。",
          "level": "good"
        }
      ],
      "minutes": 7
    },
    {
      "id": "quiz",
      "stage": 8,
      "title": "⑧ 知識問題｜理解度テスト",
      "goal": "目的・概念・仕組み・操作・活用方法の理解を確認する",
      "lead": "知識問題はこの講座の最後にまとめています。暗記だけでなく、具体的な場面で適切な判断ができるかを確認してください。全15問です。",
      "blocks": [],
      "minutes": 10
    }
  ],
  "quiz": [
    {
      "prompt": "Gitでローカルのコミットを作ると、自動的にGitHubの公開サイトも更新される？",
      "choices": [
        "はい。commitするとすぐ更新される",
        "いいえ。通常はpushなどが必要",
        "ブランチを作れば必ず更新される"
      ],
      "answer": 1,
      "reason": "git commitはローカルの履歴を作る操作です。GitHubへ送るには通常git pushが必要です。"
    },
    {
      "prompt": "新しく作成したtrain.pyをGitの管理対象に入れる前の状態は？",
      "choices": [
        "通常は未追跡（Untracked）",
        "すでにコミット済み",
        "自動的にステージ済み"
      ],
      "answer": 0,
      "reason": "新規ファイルはgit addするまで原則として未追跡です。"
    },
    {
      "prompt": "作業ディレクトリ・ステージング・コミットの順に相当する操作は？",
      "choices": [
        "commit → add → 編集",
        "編集 → add → commit",
        "push → commit → add"
      ],
      "answer": 1,
      "reason": "まずファイルを編集し、addで対象をステージして、commitで履歴に確定します。"
    },
    {
      "prompt": "train.pyをaddした後、さらに編集した。次にcommitすると基本的にどの内容が入る？",
      "choices": [
        "addした時点の内容",
        "最後に編集した内容が必ずすべて入る",
        "どちらも入らない"
      ],
      "answer": 0,
      "reason": "addした時点でステージした内容が対象です。後から編集した分は再度addしないと通常コミットに入りません。"
    },
    {
      "prompt": "ステージ済み内容と直近のコミットの差分を見たいときは？",
      "choices": [
        "git diff --staged",
        "git log --oneline",
        "git push"
      ],
      "answer": 0,
      "reason": "git diff --staged（--cachedも可）はステージングとHEADの差分を表示します。"
    },
    {
      "prompt": "ある時点の追跡ファイル全体の構造を表すGitオブジェクトはどれ？",
      "choices": [
        "Blobだけ",
        "Tree",
        "HEADというソースコードファイル"
      ],
      "answer": 1,
      "reason": "Blobは内容、Treeは名前とフォルダ構造との対応、CommitはTreeと履歴情報を保持します。"
    },
    {
      "prompt": "Gitのブランチについて正しい説明は？",
      "choices": [
        "必ずファイル一式を新しいフォルダに複製する",
        "コミットを指す名前付きの参照である",
        "GitHubでしか使えない"
      ],
      "answer": 1,
      "reason": "ブランチはコミットを参照する情報です。ローカルGitだけでも利用できます。"
    },
    {
      "prompt": "HEADは通常何を示す？",
      "choices": [
        "現在選択しているブランチ",
        "最も精度が良いモデル",
        "直近のMLflow Run ID"
      ],
      "answer": 0,
      "reason": "通常HEADは現在選択中のブランチを示し、そこからコミットを参照します。"
    },
    {
      "prompt": "すでに追跡中の.envを.gitignoreに追加すると、過去の履歴から秘密情報が消える？",
      "choices": [
        "はい。全履歴から消える",
        "いいえ。追跡や履歴の除去には別対応が必要",
        "GitHub Pagesだけから消える"
      ],
      "answer": 1,
      "reason": ".gitignoreは未追跡ファイルの追加除外が中心です。追跡済みファイルや過去履歴は消しません。"
    },
    {
      "prompt": "未コミットの編集を残したまま、ステージだけ解除したいときは？",
      "choices": [
        "git restore --staged train.py",
        "git reset --hard",
        "git push"
      ],
      "answer": 0,
      "reason": "git restore --stagedはステージ側の状態を戻し、通常は作業ファイルの変更を保持します。"
    },
    {
      "prompt": "共有済みの不具合コミットを、履歴を消さずに打ち消したいときの代表的な操作は？",
      "choices": [
        "git revert",
        "git init",
        "git diff"
      ],
      "answer": 0,
      "reason": "git revertは新しい取り消しコミットを作り、共有された履歴を保持します。"
    },
    {
      "prompt": "mainが分岐以降に変わらず、featureだけ新しいコミットを積んだ。単純にmainへ取り込むと？",
      "choices": [
        "fast-forwardできる場合がある",
        "必ずコンフリクトする",
        "リモートを必ず削除する"
      ],
      "answer": 0,
      "reason": "mainの参照先をfeatureの先端に進めるだけで統合できる場合があります。"
    },
    {
      "prompt": "同じGitコミットで学習率を変えて3回実験した場合、MLflowのRun IDは？",
      "choices": [
        "同じコミットならRun IDも同じ",
        "3回の実験で別々のRun ID",
        "Gitのブランチ名と等しい"
      ],
      "answer": 1,
      "reason": "Gitコミットはコードの状態、MLflow Runは1回の実験を識別します。"
    },
    {
      "prompt": "Dockerイメージから.gitを除外した場合、コンテナ内でGitコミットIDを自動取得できないことがある。対応例は？",
      "choices": [
        "ホスト側でコミットIDを取得して学習処理へ渡す",
        "モデル重みをGitHubへ必ず登録する",
        "GitHub Pagesを停止する"
      ],
      "answer": 0,
      "reason": "ホストでgit rev-parse HEADを実行し、環境変数や実験タグを通じて学習プロセスに渡せます。"
    },
    {
      "prompt": "精度の悪化を再現・分析するために、Gitコミットだけで十分？",
      "choices": [
        "十分。Gitのコードだけで必ず再現できる",
        "データ・依存環境・パラメータ等も必要",
        "GitHubの星の数があれば十分"
      ],
      "answer": 1,
      "reason": "コードが同じでもデータ、乱数、ライブラリ、学習条件などで結果は変わります。これらの追跡も必要です。"
    }
  ]
};
