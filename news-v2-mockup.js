(()=>{const start=()=>{
  const $=(selector,root=document)=>root?.querySelector(selector)||null;
  const $$=(selector,root=document)=>root?[...root.querySelectorAll(selector)]:[];
  const isNewsIndex=document.body?.dataset.newsPage==='index';
  const isNewsReader=document.body?.dataset.newsPage==='reader';
  const storyRoutes={7648:'/ja/news/Global/king-charles-clarifies-harry-meghan-royal-status-7648',9991:'/ja/news/Sports/onosato-promoted-to-yokozuna-9991',9992:'/ja/news/Business/suica-mascot-public-vote-9992',9993:'/ja/news/Environment/aomori-earthquake-magnitude-7-5-9993',7642:'/ja/news/Global/un-adopts-equal-earth-world-map-7642',7611:'/ja/news/Global/nepal-china-border-landslides-7611',7606:'/ja/news/Global/russian-drone-attack-near-kyiv-7606',7605:'/ja/news/Environment/nepal-tibet-landslides-7605',7596:'/ja/news/Global/nepal-china-border-flash-flood-7596',7594:'/ja/news/Global/prince-harry-family-returns-to-britain-7594',7581:'/ja/news/Global/iran-hijab-rules-women-resist-7581',7567:'/ja/news/Business/canada-pauses-us-trade-talks-7567',7561:'/ja/news/Global/israel-west-bank-settlement-homes-7561',7542:'/ja/news/Global/uss-george-washington-malacca-strait-7542'};
  const mediaArtworkFor=id=>{const leaf=storyRoutes[id]?.split('/').filter(Boolean).at(-1)||'';const slug=leaf.replace(new RegExp(`-${id}$`),'');return slug?new URL(`/assets/news-media/${id}-${slug}-512.jpg`,document.baseURI).href:'';};
  const setMediaMetadata=({title,album,artwork})=>{if(!('mediaSession' in navigator)||!('MediaMetadata' in window))return;const image=artwork||'';navigator.mediaSession.metadata=new MediaMetadata({title:title||'Kokomonster Easy News',artist:'Kokomonster Easy News',album:album||'Easy News',artwork:image?[{src:image,sizes:'512x512',type:'image/jpeg'}]:[]});};
  const setMediaPlaybackState=state=>{if('mediaSession' in navigator)navigator.mediaSession.playbackState=state;};
  let languageCode='en';
  try{const saved=window.localStorage.getItem('kkm-language');if(saved==='en'||saved==='zh')languageCode=saved;}catch(error){}
  const t=(en,zh)=>languageCode==='zh'?zh:en;
  const menu=$('.news-menu');
  const nav=$('.news-nav');
  const menuScrim=$('[data-menu-close]');
  const closeMenu=()=>{document.body.classList.remove('news-menu-open');menuScrim&&(menuScrim.hidden=true);menu?.setAttribute('aria-expanded','false');if(menu){menu.textContent='☰';menu.setAttribute('aria-label',t('Open menu','開啟選單'));}};
  menu?.addEventListener('click',()=>{const opening=!document.body.classList.contains('news-menu-open');document.body.classList.toggle('news-menu-open',opening);if(menuScrim)menuScrim.hidden=!opening;menu.setAttribute('aria-expanded',String(opening));menu.textContent=opening?'×':'☰';menu.setAttribute('aria-label',opening?t('Close menu','關閉選單'):t('Open menu','開啟選單'));});
  menuScrim?.addEventListener('click',closeMenu);
  nav?.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
  document.addEventListener('click',event=>{if(document.body.classList.contains('news-menu-open')&&!event.target.closest('.news-nav,.news-menu'))closeMenu();});

  const loginModal=$('[data-login-modal]');
  const loginDialog=$('.login-modal__dialog');
  let loginReturnFocus=null;
  const openLogin=trigger=>{if(!loginModal)return;loginReturnFocus=trigger;loginModal.hidden=false;document.body.classList.add('login-modal-open');window.setTimeout(()=>$('.login-modal__close',loginModal)?.focus(),0);};
  const closeLogin=()=>{if(!loginModal)return;loginModal.hidden=true;document.body.classList.remove('login-modal-open');loginReturnFocus?.focus();};
  $$('[data-login-open],[data-requires-login]').forEach(button=>button.addEventListener('click',event=>{event.preventDefault();openLogin(button);}));
  $$('[data-login-close]').forEach(button=>button.addEventListener('click',closeLogin));
  loginModal?.addEventListener('click',event=>{if(event.target===loginModal)closeLogin();});
  loginDialog?.addEventListener('keydown',event=>{if(event.key!=='Tab')return;const focusable=$$('button,a[href]',loginDialog);if(!focusable.length)return;const first=focusable[0],last=focusable.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!loginModal?.hidden)closeLogin();});

  const topics=$$('.news-topics button');
  const levelSelect=$('[data-news-level]');
  const levelPicker=$('[data-level-picker]');
  const levelTrigger=$('[data-level-trigger]');
  const levelMenu=$('[data-level-menu]');
  const levelLabel=$('[data-level-label]');
  const levelOptions=$$('[data-level-option]');
  const topicPicker=$('[data-topic-picker]');
  const topicTrigger=$('[data-topic-trigger]');
  const topicMenu=$('[data-topic-menu]');
  const topicLabel=$('[data-topic-label]');
  const topicOptions=$$('[data-topic-option]');
  const moreButton=$('[data-news-more]');
  const leadCard=$('[data-news-lead]');
  const gridCards=$$('.news-grid [data-news-card]');
  const allCards=gridCards;
  const openInNewTab=link=>{if(!link)return;link.target='_blank';link.rel='noopener noreferrer';};
  gridCards.forEach(card=>{const link=$('a',card);if(link&&storyRoutes[card.dataset.storyId])link.href=storyRoutes[card.dataset.storyId];openInNewTab(link);});
  openInNewTab($('[data-lead-link]',leadCard));
  openInNewTab($('[data-lead-cta]',leadCard));
  openInNewTab($('.news-intro a[href^="/ja/news/"]'));
  $$('a[href^="https://apps.apple.com/"]').forEach(openInNewTab);
  const preview=$('[data-news-preview]');
  const previewFurigana=$('[data-preview-furigana]');
  const previewTranslation=$('[data-preview-translation]');
  const previewPlay=$('[data-preview-play]');
  const wordTerm=$('[data-word-term]');
  const wordMeaning=$('[data-word-meaning]');
  const wordSource=$('[data-word-source]');
  const wordExample=$('[data-word-example]');
  const wordExampleTranslation=$('[data-word-example-translation]');
  const wordPlay=$('[data-word-play]');
  const topicLabels={all:['Latest','最新'],sports:['Sports','體育'],business:['Business','商業'],history:['History','歷史'],music:['Music','音樂'],global:['Global','國際'],health:['Health','健康'],environment:['Environment','環境'],technology:['Technology','科技'],science:['Science','科學']};
  const levelLabels={all:['All levels','所有程度'],n5:['N5 · Gentle','N5 · 入門'],n4:['N4 · Guided reading','N4 · 引導閱讀'],n3:['N3 · Natural','N3 · 自然日語']};
  const topicName=value=>(topicLabels[value]||[value,value])[languageCode==='zh'?1:0];
  const levelName=value=>(levelLabels[value]||[value,value])[languageCode==='zh'?1:0];
  const minuteCount=card=>parseInt(card?.dataset.duration,10)||1;
  const monthNumbers={JAN:1,FEB:2,MAR:3,APR:4,MAY:5,JUN:6,JUL:7,AUG:8,SEP:9,OCT:10,NOV:11,DEC:12};
  const dateText=value=>{if(languageCode!=='zh')return value;const [day,month,year]=(value||'').split(/\s+/);return monthNumbers[month]?`${year}年${monthNumbers[month]}月${parseInt(day,10)}日`:value;};
  const keywordCount=card=>{if(!card)return 0;if(!card.dataset.keywordCount){const match=$('.news-card__body small',card)?.textContent.match(/(\d+)\s+keywords/i);card.dataset.keywordCount=match?.[1]||'0';}return parseInt(card.dataset.keywordCount,10)||0;};
  const summaryText=card=>languageCode==='zh'?`${minuteCount(card)} 分鐘 · ${keywordCount(card)} 個關鍵字`:`${minuteCount(card)} min · ${keywordCount(card)} keywords`;
  const wordsByStory={
    9991:{speech:'横綱',audio:'content/news/audio/9991-onosato-promoted-to-yokozuna/KM-NEWS-9991-onosato-promoted-to-yokozuna-vocab-02-ja-Nanami.mp3',term:'<ruby>横綱<rt>よこづな</rt></ruby>',meaning:'yokozuna · grand champion',example:'<ruby>大の里<rt>おおのさと</rt></ruby>が<mark>横綱</mark>に<ruby>昇進<rt>しょうしん</rt></ruby>しました。',translation:'Ōnosato was promoted to yokozuna.'},
    9992:{speech:'投票',audio:'content/news/audio/9992-suica-mascot-public-vote/KM-NEWS-9992-suica-mascot-public-vote-vocab-02-ja-Nanami.mp3',term:'<ruby>投票<rt>とうひょう</rt></ruby>',meaning:'vote · voting',example:'<ruby>好<rt>す</rt></ruby>きな<ruby>候補<rt>こうほ</rt></ruby>に<mark>投票</mark>できます。',translation:'You can vote for your favourite candidate.'},
    9993:{speech:'地震',audio:'content/news/audio/9993-aomori-earthquake-magnitude-7-5/KM-NEWS-9993-aomori-earthquake-magnitude-7-5-vocab-01-ja-Nanami.mp3',term:'<ruby>地震<rt>じしん</rt></ruby>',meaning:'earthquake',example:'<ruby>青森県<rt>あおもりけん</rt></ruby>の<ruby>沖<rt>おき</rt></ruby>で<mark>地震</mark>がありました。',translation:'An earthquake occurred off Aomori Prefecture.'},
    7648:{speech:'立場',audio:'content/news/audio/7648-king-charles-clarifies-harry-meghan-royal-status/KM-NEWS-7648-king-charles-clarifies-harry-meghan-royal-status-vocab-03-ja-Nanami.mp3',term:'<ruby>立場<rt>たちば</rt></ruby>',meaning:'position · status',example:'<mark>立場</mark>を<ruby>明確<rt>めいかく</rt></ruby>にしました。',translation:'They clarified the position.'},
    7642:{speech:'採用',audio:'content/news/audio/7642-un-adopts-equal-earth-world-map/KM-NEWS-7642-un-adopts-equal-earth-world-map-vocab-01-ja-Nanami.mp3',term:'<ruby>採用<rt>さいよう</rt></ruby>',meaning:'adoption · to adopt',example:'<ruby>新<rt>あたら</rt></ruby>しい<ruby>世界地図<rt>せかいちず</rt></ruby>を<mark>採用</mark>しました。',translation:'They adopted a new world map.'},
    7611:{speech:'土石流',audio:'content/news/audio/7611-nepal-china-border-landslides/KM-NEWS-7611-nepal-china-border-landslides-vocab-01-ja-Nanami.mp3',term:'<ruby>土石流<rt>どせきりゅう</rt></ruby>',meaning:'debris flow · landslide',example:'<ruby>国境<rt>こっきょう</rt></ruby>で<mark>土石流</mark>が<ruby>発生<rt>はっせい</rt></ruby>しました。',translation:'A landslide occurred at the border.'},
    7606:{speech:'爆発',audio:'content/news/audio/7606-russian-drone-attack-near-kyiv/KM-NEWS-7606-russian-drone-attack-near-kyiv-vocab-01-ja-Nanami.mp3',term:'<ruby>爆発<rt>ばくはつ</rt></ruby>',meaning:'explosion',example:'<ruby>攻撃<rt>こうげき</rt></ruby>で<mark>爆発</mark>が<ruby>起<rt>お</rt></ruby>きました。',translation:'The attack caused an explosion.'},
    7605:{speech:'大規模',audio:'content/news/audio/7605-nepal-tibet-landslides/KM-NEWS-7605-nepal-tibet-landslides-vocab-01-ja-Nanami.mp3',term:'<ruby>大規模<rt>だいきぼ</rt></ruby>',meaning:'large-scale',example:'<mark>大規模</mark>な<ruby>土石流<rt>どせきりゅう</rt></ruby>が<ruby>発生<rt>はっせい</rt></ruby>しました。',translation:'A large-scale landslide occurred.'},
    7596:{speech:'鉄砲水',audio:'content/news/audio/7596-nepal-china-border-flash-flood/KM-NEWS-7596-nepal-china-border-flash-flood-vocab-01-ja-Nanami.mp3',term:'<ruby>鉄砲水<rt>てっぽうみず</rt></ruby>',meaning:'flash flood',example:'<ruby>国境<rt>こっきょう</rt></ruby>で<mark>鉄砲水</mark>が<ruby>発生<rt>はっせい</rt></ruby>しました。',translation:'A flash flood occurred at the border.'},
    7594:{speech:'帰国',audio:'content/news/audio/7594-prince-harry-family-returns-to-britain/KM-NEWS-7594-prince-harry-family-returns-to-britain-vocab-01-ja-Nanami.mp3',term:'<ruby>帰国<rt>きこく</rt></ruby>',meaning:'return to one’s country',example:'<ruby>家族<rt>かぞく</rt></ruby>と<ruby>共<rt>とも</rt></ruby>にイギリスへ<mark>帰国</mark>しました。',translation:'They returned to Britain with their family.'},
    7581:{speech:'抵抗',audio:'content/news/audio/7581-iran-hijab-rules-women-resist/KM-NEWS-7581-iran-hijab-rules-women-resist-vocab-02-ja-Nanami.mp3',term:'<ruby>抵抗<rt>ていこう</rt></ruby>',meaning:'resistance · to resist',example:'<ruby>多<rt>おお</rt></ruby>くの<ruby>女性<rt>じょせい</rt></ruby>が<ruby>規則<rt>きそく</rt></ruby>に<mark>抵抗</mark>しています。',translation:'Many women are resisting the rules.'},
    7567:{speech:'関税',audio:'content/news/audio/7567-canada-pauses-us-trade-talks/KM-NEWS-7567-canada-pauses-us-trade-talks-vocab-02-ja-Nanami.mp3',term:'<ruby>関税<rt>かんぜい</rt></ruby>',meaning:'tariff',example:'<ruby>輸入品<rt>ゆにゅうひん</rt></ruby>に<mark>関税</mark>を<ruby>課<rt>か</rt></ruby>します。',translation:'They will impose tariffs on imported goods.'},
    7561:{speech:'入植者',audio:'content/news/audio/7561-israel-west-bank-settlement-homes/KM-NEWS-7561-israel-west-bank-settlement-homes-vocab-01-ja-Nanami.mp3',term:'<ruby>入植者<rt>にゅうしょくしゃ</rt></ruby>',meaning:'settler',example:'<mark>入植者</mark>のための<ruby>住宅<rt>じゅうたく</rt></ruby>を<ruby>建設<rt>けんせつ</rt></ruby>します。',translation:'They will build homes for settlers.'},
    7542:{speech:'空母',audio:'content/news/audio/7542-uss-george-washington-malacca-strait/KM-NEWS-7542-uss-george-washington-malacca-strait-vocab-01-ja-Nanami.mp3',term:'<ruby>空母<rt>くうぼ</rt></ruby>',meaning:'aircraft carrier',example:'<ruby>米軍<rt>べいぐん</rt></ruby>の<mark>空母</mark>が<ruby>海峡<rt>かいきょう</rt></ruby>を<ruby>航行<rt>こうこう</rt></ruby>しました。',translation:'A US aircraft carrier sailed through the strait.'}
  };
  const wordZh={
    9991:['橫綱 · 相撲最高位階','大之里晉升為橫綱。'],9992:['投票','你可以投票給喜歡的候選者。'],9993:['地震','青森縣外海發生了地震。'],
    7648:['立場 · 身分','他們說明了立場。'],7642:['採用 · 選用','他們採用了新版世界地圖。'],7611:['山泥傾瀉 · 土石流','邊境地區發生山泥傾瀉。'],
    7606:['爆炸','襲擊引發了爆炸。'],7605:['大規模','發生了大型山泥傾瀉。'],7596:['山洪 · 暴洪','邊境發生了山洪。'],
    7594:['回國 · 返回本國','他們與家人一同返回英國。'],7581:['反抗 · 抵抗','許多女性正在反抗這些規定。'],7567:['關稅','他們將對進口商品徵收關稅。'],
    7561:['定居者','他們將為定居者興建住宅。'],7542:['航空母艦','美國航空母艦航經海峽。']
  };
  const AUDIO_VERSION='20261007-keywords';
  const versionedAudio=source=>source?`${source}${source.includes('?')?'&':'?'}v=${AUDIO_VERSION}`:source;
  const storyDetails={
    9991:{summary:'新横綱の誕生に、地元や相撲ファンから大きな期待が寄せられています。',firstHtml:'<ruby>大の里<rt>おおのさと</rt></ruby>は、<ruby>相撲<rt>すもう</rt></ruby>でいちばん<ruby>高<rt>たか</rt></ruby>い<ruby>地位<rt>ちい</rt></ruby>、<ruby>横綱<rt>よこづな</rt></ruby>になりました。',firstEn:'Ōnosato has reached yokozuna, the highest rank in sumo.',firstZh:'大之里晉升為相撲最高級別「橫綱」。',firstAudio:'content/news/audio/9991-onosato-promoted-to-yokozuna/KM-NEWS-9991-onosato-promoted-to-yokozuna-sentence-01-ja-Nanami.mp3'},
    9992:{summary:'利用者の投票で、駅やアプリに登場する新しい顔を決めます。',firstHtml:'<ruby>交通系<rt>こうつうけい</rt></ruby>ICカードのSuicaが、<ruby>新<rt>あたら</rt></ruby>しいキャラクターの<ruby>候補<rt>こうほ</rt></ruby>を<ruby>発表<rt>はっぴょう</rt></ruby>しました。',firstEn:'Transit IC card Suica has announced candidates for a new mascot.',firstZh:'交通IC卡Suica公布了新吉祥物的候選角色。',firstAudio:'content/news/audio/9992-suica-mascot-public-vote/KM-NEWS-9992-suica-mascot-public-vote-sentence-01-ja-Nanami.mp3'},
    9993:{summary:'沿岸の住民が避難し、交通や建物への影響が確認されています。',firstHtml:'<ruby>青森県<rt>あおもりけん</rt></ruby>の<ruby>沖<rt>おき</rt></ruby>で、マグニチュード7.5の<ruby>強<rt>つよ</rt></ruby>い<ruby>地震<rt>じしん</rt></ruby>がありました。',firstEn:'A strong magnitude 7.5 earthquake struck off Aomori Prefecture.',firstZh:'青森縣外海發生7.5級強烈地震。',firstAudio:'content/news/audio/9993-aomori-earthquake-magnitude-7-5/KM-NEWS-9993-aomori-earthquake-magnitude-7-5-sentence-01-ja-Nanami.mp3'},
    7648:{summary:'王室は、夫妻が公務を担わない立場を今後も維持すると説明しました。',firstHtml:'チャールズ<ruby>国王<rt>こくおう</rt></ruby>は<ruby>7日<rt>なのか</rt></ruby>、ヘンリー<ruby>王子<rt>おうじ</rt></ruby>とメーガン<ruby>妃<rt>ひ</rt></ruby>について<ruby>公務<rt>こうむ</rt></ruby>に<ruby>就<rt>つ</rt></ruby>かない<ruby>王族<rt>おうぞく</rt></ruby>であると<ruby>表明<rt>ひょうめい</rt></ruby>しました。',firstEn:'King Charles said on the 7th that Prince Harry and Meghan are members of the royal family who do not undertake official duties.',firstZh:'查理斯國王於7日表示，哈里王子與梅根是不履行王室公務的王室成員。',firstAudio:'content/news/audio/7648-king-charles-clarifies-harry-meghan-royal-status/KM-NEWS-7648-king-charles-clarifies-harry-meghan-royal-status-sentence-01-ja-Nanami.mp3'},
    7642:{summary:'地域の実際の大きさを、より公平に表すことが目的です。',firstHtml:'<ruby>国連総会<rt>こくれんそうかい</rt></ruby>は<ruby>4日<rt>よっか</rt></ruby>、<ruby>各国<rt>かっこく</rt></ruby>の<ruby>実際<rt>じっさい</rt></ruby>の<ruby>相対的<rt>そうたいてき</rt></ruby>な<ruby>大<rt>おお</rt></ruby>きさを<ruby>反映<rt>はんえい</rt></ruby>した<ruby>新<rt>あら</rt></ruby>たな<ruby>世界地図<rt>せかいちず</rt></ruby>を<ruby>採用<rt>さいよう</rt></ruby>する<ruby>決議案<rt>けつぎあん</rt></ruby>を<ruby>可決<rt>かけつ</rt></ruby>しました。',firstEn:'On the 4th, the UN General Assembly approved a resolution to adopt a new world map that reflects countries’ actual relative sizes.',firstZh:'聯合國大會於4日通過決議，採用能反映各國實際相對面積的新版世界地圖。',firstAudio:'content/news/audio/7642-un-adopts-equal-earth-world-map/KM-NEWS-7642-un-adopts-equal-earth-world-map-sentence-01-ja-Nanami.mp3'},
    7611:{summary:'国境周辺で多くの死者と行方不明者が出て、救助活動が続いています。',firstHtml:'ネパールと<ruby>中国<rt>ちゅうごく</rt></ruby>・チベットの<ruby>国境<rt>こっきょう</rt></ruby><ruby>沿<rt>ぞ</rt></ruby>いで<ruby>大<rt>おお</rt></ruby>きな<ruby>土石流<rt>どせきりゅう</rt></ruby>が<ruby>発生<rt>はっせい</rt></ruby>しました。',firstEn:'A major landslide occurred along the border between Nepal and China’s Tibet region.',firstZh:'尼泊爾與中國西藏地區的邊境一帶發生大型山泥傾瀉。',firstAudio:'content/news/audio/7611-nepal-china-border-landslides/KM-NEWS-7611-nepal-china-border-landslides-sentence-01-ja-Nanami.mp3'},
    7606:{summary:'首都キーウ近郊の攻撃で多くの死傷者が出て、調査が始まります。',firstHtml:'ウクライナの<ruby>首都<rt>しゅと</rt></ruby>キーウ<ruby>近郊<rt>きんこう</rt></ruby>で<ruby>爆発<rt>ばくはつ</rt></ruby>が<ruby>発生<rt>はっせい</rt></ruby>しました。',firstEn:'An explosion occurred near Kyiv, the capital of Ukraine.',firstZh:'烏克蘭首都基輔附近發生爆炸。',firstAudio:'content/news/audio/7606-russian-drone-attack-near-kyiv/KM-NEWS-7606-russian-drone-attack-near-kyiv-sentence-01-ja-Nanami.mp3'},
    7605:{summary:'外国人旅行者も被害に巻き込まれ、各地で救助活動が続いています。',firstHtml:'ネパールと<ruby>中国<rt>ちゅうごく</rt></ruby>・チベットの<ruby>国境<rt>こっきょう</rt></ruby>で<ruby>大規模<rt>だいきぼ</rt></ruby>な<ruby>土石流<rt>どせきりゅう</rt></ruby>が<ruby>発生<rt>はっせい</rt></ruby>しました。',firstEn:'A major landslide occurred along the border between Nepal and China’s Tibet region.',firstZh:'尼泊爾與中國西藏地區邊境發生大型山泥傾瀉。',firstAudio:'content/news/audio/7605-nepal-tibet-landslides/KM-NEWS-7605-nepal-tibet-landslides-sentence-01-ja-Nanami.mp3'},
    7596:{summary:'洪水で重要なインフラが流され、被災地への救助が難しくなっています。',firstHtml:'ネパールと<ruby>中国<rt>ちゅうごく</rt></ruby>の<ruby>国境<rt>こっきょう</rt></ruby>で、<ruby>26日<rt>にじゅうろくにち</rt></ruby>に<ruby>鉄砲水<rt>てっぽうみず</rt></ruby>が<ruby>発生<rt>はっせい</rt></ruby>しました。',firstEn:'Flash floods occurred on the 26th along the border between Nepal and China.',firstZh:'尼泊爾與中國邊境於26日發生山洪。',firstAudio:'content/news/audio/7596-nepal-china-border-flash-flood/KM-NEWS-7596-nepal-china-border-flash-flood-sentence-01-ja-Nanami.mp3'},
    7594:{summary:'一家はイギリスで私的に生活し、公務には復帰しない見通しです。',firstHtml:'イギリス<ruby>王室<rt>おうしつ</rt></ruby>のサセックス<ruby>公<rt>こう</rt></ruby>ハリー<ruby>王子<rt>おうじ</rt></ruby>と<ruby>妻<rt>つま</rt></ruby>のメガン<ruby>妃<rt>ひ</rt></ruby>が<ruby>家族<rt>かぞく</rt></ruby>と<ruby>共<rt>とも</rt></ruby>にイギリスに<ruby>帰国<rt>きこく</rt></ruby>しました。',firstEn:'Britain’s Prince Harry, Duke of Sussex, and his wife Meghan have returned to Britain with their family.',firstZh:'英國王室薩塞克斯公爵哈里王子與妻子梅根，已與家人一同返回英國。',firstAudio:'content/news/audio/7594-prince-harry-family-returns-to-britain/KM-NEWS-7594-prince-harry-family-returns-to-britain-sentence-01-ja-Nanami.mp3'},
    7581:{summary:'多くの女性が規則に抵抗し、SNSでも抗議の声を上げています。',firstHtml:'イランでは、<ruby>政治的混乱<rt>せいじてきこんらん</rt></ruby>の<ruby>中<rt>なか</rt></ruby>、<ruby>女性<rt>じょせい</rt></ruby>のヒジャブ<ruby>着用<rt>ちゃくよう</rt></ruby>に<ruby>関<rt>かん</rt></ruby>する<ruby>問題<rt>もんだい</rt></ruby>が<ruby>再浮上<rt>さいふじょう</rt></ruby>しています。',firstEn:'Amid political turmoil in Iran, the issue of women wearing the hijab has returned to the forefront.',firstZh:'伊朗政局動盪之際，女性佩戴頭巾的問題再次成為焦點。',firstAudio:'content/news/audio/7581-iran-hijab-rules-women-resist/KM-NEWS-7581-iran-hijab-rules-women-resist-sentence-01-ja-Nanami.mp3'},
    7567:{summary:'関税をめぐる合意に至らず、カナダは対抗措置を準備しています。',firstHtml:'カナダのカーニー<ruby>首相<rt>しゅしょう</rt></ruby>は<ruby>21日<rt>にじゅういちにち</rt></ruby><ruby>遅<rt>おそ</rt></ruby>く、<ruby>米国<rt>べいこく</rt></ruby>との<ruby>貿易交渉<rt>ぼうえきこうしょう</rt></ruby>を<ruby>停止<rt>ていし</rt></ruby>しました。',firstEn:'Late on the 21st, Canadian Prime Minister Carney suspended trade talks with the United States.',firstZh:'加拿大總理卡尼於21日深夜宣布，暫停與美國的貿易談判。',firstAudio:'content/news/audio/7567-canada-pauses-us-trade-talks/KM-NEWS-7567-canada-pauses-us-trade-talks-sentence-01-ja-Nanami.mp3'},
    7561:{summary:'国際社会は計画が中東の緊張を高めるとして、強く懸念しています。',firstHtml:'イスラエルは、<ruby>占領<rt>せんりょう</rt></ruby>したパレスチナのヨルダン<ruby>川西岸地区<rt>がわせいがんちく</rt></ruby>で、<ruby>入植者<rt>にゅうしょくしゃ</rt></ruby><ruby>向<rt>む</rt></ruby>けの<ruby>住宅<rt>じゅうたく</rt></ruby>1200<ruby>戸<rt>こ</rt></ruby>を<ruby>建設<rt>けんせつ</rt></ruby>する<ruby>計画<rt>けいかく</rt></ruby>を<ruby>発表<rt>はっぴょう</rt></ruby>しました。',firstEn:'Israel announced plans to build 1,200 homes for settlers in the occupied Palestinian West Bank.',firstZh:'以色列宣布，計劃在被佔領的巴勒斯坦約旦河西岸興建1,200個定居者住宅。',firstAudio:'content/news/audio/7561-israel-west-bank-settlement-homes/KM-NEWS-7561-israel-west-bank-settlement-homes-sentence-01-ja-Nanami.mp3'},
    7542:{summary:'空母は中東へ向かいながら、インド洋で航空任務を実施しています。',firstHtml:'<ruby>米軍<rt>べいぐん</rt></ruby>は、<ruby>空母<rt>くうぼ</rt></ruby>ジョージ・ワシントンがマレーシアとインドネシアを<ruby>結<rt>むす</rt></ruby>ぶマラッカ<ruby>海峡<rt>かいきょう</rt></ruby>を<ruby>航行<rt>こうこう</rt></ruby>したと<ruby>発表<rt>はっぴょう</rt></ruby>しました。',firstEn:'The US military said the aircraft carrier USS George Washington sailed through the Strait of Malacca between Malaysia and Indonesia.',firstZh:'美軍表示，航空母艦喬治・華盛頓號航經連接馬來西亞與印度尼西亞的馬六甲海峽。',firstAudio:'content/news/audio/7542-uss-george-washington-malacca-strait/KM-NEWS-7542-uss-george-washington-malacca-strait-sentence-01-ja-Nanami.mp3'}
  };
  let currentTopic='all';
  let currentLevel=levelSelect?.value||'all';
  let visibleLimit=3;
  let currentFeatured=null;
  let previewAudio=null;
  let previewTimer=0;
  let previewIndex=0;
  let cardAudio=null;
  let cardAudioButton=null;
  const matchesFilters=card=>(currentTopic==='all'||card.dataset.topic===currentTopic)&&(currentLevel==='all'||card.dataset.level===currentLevel);
  const previewTokens=()=>$$('[data-preview-token]');
  const stopPreview=()=>{window.clearTimeout(previewTimer);if(previewAudio){previewAudio.pause();previewAudio.currentTime=0;}previewTokens().forEach(token=>token.classList.remove('playing'));previewIndex=0;previewPlay?.classList.remove('is-playing');previewPlay?.setAttribute('aria-pressed','false');previewPlay?.setAttribute('aria-label',t('Play preview','播放新聞預覽'));};
  const setPreviewAudio=source=>{stopPreview();previewAudio=source?new Audio(versionedAudio(source)):null;if(!previewAudio)return;previewAudio.preload='metadata';previewAudio.addEventListener('timeupdate',()=>{if(!Number.isFinite(previewAudio.duration)||previewAudio.duration<=0)return;const tokens=previewTokens();const index=Math.min(tokens.length-1,Math.floor(previewAudio.currentTime/previewAudio.duration*tokens.length));tokens.forEach((token,itemIndex)=>token.classList.toggle('playing',itemIndex===index));});previewAudio.addEventListener('ended',stopPreview);};
  const updateLead=card=>{
    if(!card||!leadCard)return;
    currentFeatured=card;
    const route=storyRoutes[card.dataset.storyId];
    const leadLink=$('[data-lead-link]',leadCard);if(leadLink&&route)leadLink.href=route;
    const leadCta=$('[data-lead-cta]',leadCard);if(leadCta&&route)leadCta.href=route;
    leadCard.dataset.storyId=card.dataset.storyId;leadCard.dataset.topic=card.dataset.topic;leadCard.dataset.level=card.dataset.level;
    const image=$('[data-lead-image]',leadCard);if(image){image.src=card.dataset.image;image.alt=languageCode==='zh'?'新聞封面插圖':card.dataset.alt||'';}
    const badge=$('[data-lead-badge]',leadCard);if(badge)badge.textContent=t(`TOP STORY · ${topicName(card.dataset.topic).toUpperCase()}`,`精選新聞 · ${topicName(card.dataset.topic)}`);
    const level=$('[data-lead-level]',leadCard);if(level)level.textContent=card.dataset.level.toUpperCase();
    const duration=$('[data-lead-duration]',leadCard);if(duration)duration.textContent=t(card.dataset.duration,`${minuteCount(card)} 分鐘`);
    const date=$('[data-lead-date]',leadCard);if(date)date.textContent=dateText(card.dataset.date);
    const summary=$('[data-lead-summary]',leadCard);if(summary)summary.textContent=summaryText(card);
    const title=$('[data-lead-title]',leadCard);if(title)title.textContent=card.dataset.title;
    const details=storyDetails[card.dataset.storyId];
    const snippet=$('[data-lead-snippet]',leadCard);if(snippet)snippet.textContent=details?.summary||card.dataset.snippet;
    const previewLine=$('[data-preview-line]',leadCard);if(previewLine){previewLine.innerHTML=`<span data-preview-token>${details?.firstHtml||card.dataset.snippet}</span>`;}
    const en=$('[data-translation-en]',leadCard);if(en)en.textContent=details?.firstEn||card.dataset.en;
    const zh=$('[data-translation-zh]',leadCard);if(zh)zh.textContent=details?.firstZh||card.dataset.zh;
    setPreviewAudio(details?.firstAudio||card.dataset.previewAudio);
  };
  const updateWord=card=>{
    const data=wordsByStory[card?.dataset.storyId]||wordsByStory[9991];
    const zh=wordZh[card?.dataset.storyId]||wordZh[9991];
    if(wordTerm)wordTerm.innerHTML=data.term;
    if(wordMeaning)wordMeaning.textContent=languageCode==='zh'?zh[0]:data.meaning;
    if(wordSource)wordSource.textContent=t(`${(card?.dataset.level||'n4').toUpperCase()} · FROM THE HIGHLIGHTED ${topicName(card?.dataset.topic||'sports').toUpperCase()} STORY`,`${(card?.dataset.level||'n4').toUpperCase()} · 來自精選${topicName(card?.dataset.topic||'sports')}新聞`);
    if(wordExample)wordExample.innerHTML=data.example;
    if(wordExampleTranslation)wordExampleTranslation.textContent=languageCode==='zh'?zh[1]:data.translation;
    if(wordPlay){wordPlay.dataset.wordSpeech=data.speech;wordPlay.dataset.wordAudio=data.audio;wordPlay.setAttribute('aria-label',t(`Play ${data.speech} pronunciation`,`播放「${data.speech}」發音`));}
  };
  const updateTopicAvailability=()=>{
    topics.forEach(button=>{
      const topic=button.dataset.topic||'all';
      const available=topic==='all'||allCards.some(card=>card.dataset.topic===topic&&(currentLevel==='all'||card.dataset.level===currentLevel));
      button.disabled=!available;
      button.setAttribute('aria-disabled',String(!available));
      button.title=available?'':t(`No ${topicName(topic)} stories at this reading level yet`,`此閱讀程度目前沒有「${topicName(topic)}」新聞`);
    });
    topicOptions.forEach(option=>{
      const topic=option.dataset.topicOption||'all';
      const available=topic==='all'||allCards.some(card=>card.dataset.topic===topic&&(currentLevel==='all'||card.dataset.level===currentLevel));
      option.disabled=!available;
      option.setAttribute('aria-disabled',String(!available));
    });
    const selected=topics.find(button=>button.dataset.topic===currentTopic);
    if(selected?.disabled){currentTopic='all';topics.forEach(button=>{const active=button.dataset.topic==='all';button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});}
    syncTopicPicker();
  };
  const updateFeed=()=>{
    updateTopicAvailability();
    const eligible=gridCards.filter(matchesFilters);
    const featured=eligible[0]||gridCards[0];
    updateLead(featured);
    const remaining=eligible.filter(card=>card!==featured);
    gridCards.forEach(card=>{const index=remaining.indexOf(card);card.hidden=index<0||index>=visibleLimit;});
    if(moreButton){moreButton.hidden=remaining.length<=visibleLimit;moreButton.setAttribute('aria-hidden',String(remaining.length<=visibleLimit));}
    updateWord(featured);
  };
  const setTopicMenu=open=>{if(!topicMenu||!topicTrigger)return;topicMenu.hidden=!open;topicPicker?.classList.toggle('open',open);topicTrigger.setAttribute('aria-expanded',String(open));};
  const syncTopicPicker=()=>{const selected=topicOptions.find(option=>(option.dataset.topicOption||'all')===currentTopic);if(topicLabel&&selected)topicLabel.textContent=selected.textContent.trim();topicOptions.forEach(option=>option.setAttribute('aria-selected',String(option===selected)));};
  const applyTopic=value=>{currentTopic=value;visibleLimit=3;topics.forEach(item=>{const active=(item.dataset.topic||'all')===value;item.classList.toggle('active',active);item.setAttribute('aria-pressed',String(active));});syncTopicPicker();setTopicMenu(false);updateFeed();};
  topics.forEach(button=>{button.setAttribute('aria-pressed',String(button.classList.contains('active')));button.addEventListener('click',()=>applyTopic(button.dataset.topic||'all'));});
  topicTrigger?.addEventListener('click',()=>setTopicMenu(topicMenu?.hidden!==false));
  topicOptions.forEach(option=>option.addEventListener('click',()=>{if(!option.disabled)applyTopic(option.dataset.topicOption||'all');}));
  const setLevelMenu=open=>{if(!levelMenu||!levelTrigger)return;levelMenu.hidden=!open;levelPicker?.classList.toggle('open',open);levelTrigger.setAttribute('aria-expanded',String(open));};
  const syncLevelPicker=()=>{const selected=levelOptions.find(option=>option.dataset.levelOption===currentLevel);if(levelLabel&&selected)levelLabel.textContent=selected.textContent.trim();levelOptions.forEach(option=>option.setAttribute('aria-selected',String(option===selected)));};
  const applyLevel=value=>{currentLevel=value;if(levelSelect)levelSelect.value=value;visibleLimit=3;syncLevelPicker();setLevelMenu(false);updateFeed();};
  levelTrigger?.addEventListener('click',()=>setLevelMenu(levelMenu?.hidden!==false));
  levelOptions.forEach(option=>option.addEventListener('click',()=>applyLevel(option.dataset.levelOption||'all')));
  levelSelect?.addEventListener('change',()=>applyLevel(levelSelect.value));
  document.addEventListener('click',event=>{if(levelPicker&&!levelPicker.contains(event.target))setLevelMenu(false);});
  document.addEventListener('click',event=>{if(topicPicker&&!topicPicker.contains(event.target))setTopicMenu(false);});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){setLevelMenu(false);setTopicMenu(false);}});
  moreButton?.addEventListener('click',()=>{visibleLimit+=3;updateFeed();});
  $$('[data-card-play]').forEach(button=>button.setAttribute('aria-pressed','false'));
  document.addEventListener('click',async event=>{const button=event.target.closest('[data-card-play]');if(!button)return;event.preventDefault();event.stopPropagation();const card=button.closest('[data-news-card]');if(!card)return;if(cardAudioButton===button&&cardAudio&&!cardAudio.paused){cardAudio.pause();cardAudio.currentTime=0;button.classList.remove('is-playing');button.setAttribute('aria-pressed','false');button.dataset.audioState='paused';setMediaPlaybackState('paused');return;}if(cardAudio){cardAudio.pause();cardAudio.currentTime=0;}cardAudioButton?.classList.remove('is-playing');cardAudioButton?.setAttribute('aria-pressed','false');cardAudioButton=button;cardAudio=new Audio(versionedAudio(card.dataset.previewAudio));setMediaMetadata({title:card.dataset.title,album:`${card.dataset.level?.toUpperCase()||''} · ${card.dataset.topic?.toUpperCase()||'NEWS'}`,artwork:mediaArtworkFor(card.dataset.storyId)});if('mediaSession' in navigator){try{navigator.mediaSession.setActionHandler('play',async()=>{if(!cardAudio)return;button.classList.add('is-playing');button.setAttribute('aria-pressed','true');try{await cardAudio.play();}catch(error){button.dataset.audioState=error?.name||'play-error';}});navigator.mediaSession.setActionHandler('pause',()=>{cardAudio?.pause();button.classList.remove('is-playing');button.setAttribute('aria-pressed','false');setMediaPlaybackState('paused');});}catch(error){}}button.dataset.audioState='loading';const finish=()=>{button.classList.remove('is-playing');button.setAttribute('aria-pressed','false');setMediaPlaybackState('paused');};cardAudio.addEventListener('playing',()=>{button.dataset.audioState='playing';setMediaPlaybackState('playing');},{once:true});cardAudio.addEventListener('ended',()=>{button.dataset.audioState='ended';finish();},{once:true});cardAudio.addEventListener('error',()=>{button.dataset.audioState=`error-${cardAudio.error?.code||'unknown'}`;finish();},{once:true});button.classList.add('is-playing');button.setAttribute('aria-pressed','true');try{await cardAudio.play();}catch(error){button.dataset.audioState=error?.name||'play-error';finish();}},true);
  syncLevelPicker();
  syncTopicPicker();
  updateFeed();

  const stepPreview=()=>{
    const tokens=previewTokens();
    if(previewIndex>=tokens.length){stopPreview();return;}
    tokens.forEach((token,index)=>token.classList.toggle('playing',index===previewIndex));
    previewIndex+=1;
    previewTimer=window.setTimeout(stepPreview,650);
  };
  previewFurigana?.addEventListener('click',()=>{const hidden=preview.classList.toggle('hide-furigana');previewFurigana.classList.toggle('active',!hidden);previewFurigana.setAttribute('aria-pressed',String(!hidden));previewFurigana.setAttribute('aria-label',hidden?t('Show furigana','顯示振假名'):t('Hide furigana','隱藏振假名'));});
  previewTranslation?.addEventListener('click',()=>{const hidden=preview.classList.toggle('hide-translation');previewTranslation.classList.toggle('active',!hidden);previewTranslation.setAttribute('aria-pressed',String(!hidden));previewTranslation.setAttribute('aria-label',hidden?t('Show translation','顯示翻譯'):t('Hide translation','隱藏翻譯'));});
  previewPlay?.addEventListener('click',async()=>{if(previewPlay.getAttribute('aria-pressed')==='true'){stopPreview();return;}previewPlay.classList.add('is-playing');previewPlay.setAttribute('aria-pressed','true');previewPlay.setAttribute('aria-label',t('Pause preview','暫停新聞預覽'));try{await previewAudio?.play();}catch(error){stepPreview();}});

  const article=$('[data-reader-article]');
  const furigana=$('[data-reader-furigana]');
  const translation=$('[data-reader-translation]');
  const language=$('[data-reader-language]');
  const mode=$('[data-reader-mode]');
  const size=$('[data-reader-size]');
  const play=$('[data-reader-play]');
  const speed=$('[data-reader-speed]');
  const interfaceLanguage=$('.news-language');
  let textSizeIndex=1;
  let speedRate=1;
  let timer=0;
  let tokenIndex=0;
  const tokens=$$('[data-karaoke]');
  const timedWordTokens=$$('.reader-token[data-token-start]');
  const paragraphTokens=$$('.reader-paragraph-token[data-token-start]');
  const wordModeParagraphs=[
    [['チャールズ国王','ちゃーるずこくおう','chaaruzu kokuou'],['は','は','wa'],['7日','なのか','nanoka'],['ヘンリー王子','へんりーおうじ','henrii ouji'],['と','と','to'],['メーガン妃','めーがんひ','meegan hi'],['について','について','ni tsuite'],['公務','こうむ','koumu'],['に就かない','につかない','ni tsukanai'],['王族','おうぞく','ouzoku'],['であると','であると','de aru to'],['表明しました','ひょうめいしました','hyoumei shimashita']],
    [['侍従長','じじゅうちょう','jijuuchou'],['は','は','wa'],['書簡','しょかん','shokan'],['で','で','de'],['公爵夫妻','こうしゃくふさい','koushaku fusai'],['が','が','ga'],['王室','おうしつ','oushitsu'],['の公務','のこうむ','no koumu'],['を担う','をになう','o ninau'],['メンバーではない','めんばーではない','menbaa dewa nai'],['ことが','ことが','koto ga'],['周知の事実','しゅうちのじじつ','shuuchi no jijitsu'],['であると述べました','であるとのべました','de aru to nobemashita']],
    [['この','この','kono'],['立場','たちば','tachiba'],['は','は','wa'],['今後も','こんごも','kongo mo'],['尊重される','そんちょうされる','sonchou sareru'],['と','と','to'],['強調されています','きょうちょうされています','kyouchou sareteimasu'],['書簡','しょかん','shokan'],['は','は','wa'],['政府や軍の高官','せいふやぐんのこうかん','seifu ya gun no koukan'],['夫妻の関係者','ふさいのかんけいしゃ','fusai no kankeisha'],['に送付されました','にそうふされました','ni soufu saremashita']],
    [['ヘンリー王子','へんりーおうじ','henrii ouji'],['と','と','to'],['メーガン妃','めーがんひ','meegan hi'],['は','は','wa'],['王室の公務','おうしつのこうむ','oushitsu no koumu'],['から退いて','からしりぞいて','kara shirizoite'],['北米','ほくべい','hokubei'],['に移住し','にいじゅうし','ni ijuu shi'],['慈善活動','じぜんかつどう','jizen katsudou'],['を続けています','をつづけています','o tsuzuketeimasu']]
  ];
  const wordGlosses={
    'チャールズ国王':['King Charles','查理斯國王'],'は':['topic marker','主題助詞'],'7日':['the 7th','7日'],'ヘンリー王子':['Prince Harry','哈里王子'],'と':['and / that','和／表示'],'メーガン妃':['Meghan','梅根王妃'],'について':['about','關於'],'公務':['official duties','公務'],'に就かない':['does not undertake','不履行'],'王族':['royal family member','王室成員'],'であると':['is / are','是'],'表明しました':['stated','表示'],
    '侍従長':['private secretary','侍從長'],'書簡':['written letter','書函'],'で':['in / by','在／以'],'公爵夫妻':['the Duke and Duchess','公爵夫婦'],'が':['subject marker','主語助詞'],'王室':['royal household','王室'],'の公務':['official duties','公務'],'を担う':['undertake','承擔'],'メンバーではない':['are not members','並非成員'],'ことが':['the fact that','這項事實'],'周知の事実':['widely known fact','廣為人知的事實'],'であると述べました':['said that it is','指出這是'],
    'この':['this','這個'],'立場':['position / status','立場／身分'],'今後も':['from now on','今後仍會'],'尊重される':['will be respected','獲得尊重'],'強調されています':['is emphasized','獲得強調'],'政府や軍の高官':['senior officials','政府與軍方高官'],'夫妻の関係者':['people connected to the couple','夫婦的相關人士'],'に送付されました':['was sent to','已送交'],
    '王室の公務':['official royal duties','王室公務'],'から退いて':['stepped back from','退出'],'北米':['North America','北美'],'に移住し':['moved to','移居'],'慈善活動':['charitable work','慈善工作'],'を続けています':['continue','繼續進行'],'に':['to / in','向／在']
  };
  if(article)$$('section',article).forEach((section,index)=>{
    if($('.reader-word-mode',section))return;
    const words=wordModeParagraphs[index];if(!words)return;
    const panel=document.createElement('div');panel.className='reader-word-mode';panel.lang='ja';panel.hidden=true;
    panel.innerHTML=words.map(([term,kana,romaji])=>{const [en,zh]=wordGlosses[term]||[term,term];const annotated=/[一-龯々ァ-ヶー]/.test(term);const display=annotated?`<ruby>${term}<rt>${kana}</rt></ruby>`:term;return `<button type="button" class="reader-token" data-token-speech="${term}" aria-label="Play ${term}"><b>${display}</b><i>${romaji}</i><em data-en="${en}" data-zh="${zh}">${en}</em></button>`;}).join('');
    $('.reader-japanese',section)?.insertAdjacentElement('afterend',panel);
  });
  const updateTranslations=()=>{
    const activeLanguage=languageCode;
    $$('[data-translation-en],[data-reader-title-en]').forEach(item=>item.hidden=activeLanguage!=='en');
    $$('[data-translation-zh],[data-reader-title-zh]').forEach(item=>item.hidden=activeLanguage!=='zh');
    $$('[data-keyword] strong').forEach(item=>{item.textContent=activeLanguage==='zh'?item.dataset.zh:item.dataset.en;});
    $$('.reader-token em').forEach(item=>{item.textContent=activeLanguage==='zh'?item.dataset.zh:item.dataset.en;});
    if(language){language.textContent=activeLanguage==='zh'?'EN':'繁';language.dataset.language=activeLanguage;language.setAttribute('aria-label',activeLanguage==='zh'?'Switch reader translation to English':'Switch reader translation to Traditional Chinese');}
  };
  furigana?.addEventListener('click',()=>{const hidden=article.classList.toggle('hide-furigana');furigana.classList.toggle('active',!hidden);furigana.setAttribute('aria-pressed',String(!hidden));furigana.setAttribute('aria-label',hidden?t('Show furigana','顯示振假名'):t('Hide furigana','隱藏振假名'));});
  translation?.addEventListener('click',()=>{const hidden=article.classList.toggle('hide-translation');translation.classList.toggle('active',!hidden);translation.setAttribute('aria-pressed',String(!hidden));translation.setAttribute('aria-label',hidden?t('Show translation','顯示翻譯'):t('Hide translation','隱藏翻譯'));});
  const setText=(selector,en,zh)=>$$(selector).forEach(item=>{item.textContent=t(en,zh);});
  const setHtml=(selector,en,zh)=>$$(selector).forEach(item=>{item.innerHTML=t(en,zh);});
  const applyFooterLanguage=()=>{
    const footer=$('.news-footer.story-footer');
    if(!footer)return;
    const copy=[
      ['.story-footer__brand > p','Japanese learning that begins with a story and stays with you in real life.','從一則故事開始，讓日語走進真實生活。'],
      ['.story-footer__app','Download the app','下載應用程式'],
      ['.story-footer__column:nth-of-type(1) > b','EXPLORE','探索'],
      ['.story-footer__column:nth-of-type(2) > b','GET STARTED','開始學習'],
      ['.story-footer__column:nth-of-type(3) > b','HELP','幫助'],
      ['a[href="test.html"]','Find your level','測出你的程度'],['a[href="news.html"]','Easy News','簡易新聞'],['a[href="story.html"]','Books','書籍'],['a[href="chat.html"]','Guided Chat','AI 對話'],
      ['.story-footer__column:nth-of-type(2) a[href="https://store.kokomonster.com/"]','Shop books','選購書籍'],['a[href="https://apps.apple.com/us/app/kokomonster/id6462056577"]','Download the app','下載應用程式'],
      ['a[href="https://store.kokomonster.com/pages/contact"]','Contact us','聯絡我們'],['a[href="https://store.kokomonster.com/pages/app"]','How it works','使用方式'],
      ['.story-footer__column:nth-of-type(3) a[href="https://store.kokomonster.com/"]','FAQ','常見問題'],
      ['a[href="https://store.kokomonster.com/policies/terms-of-service"]','Terms of Use','使用條款'],['a[href="https://store.kokomonster.com/policies/privacy-policy"]','Privacy Policy','隱私權政策']
    ];
    copy.forEach(([selector,en,zh])=>setText(`.news-footer ${selector}`,en,zh));
    const appLink=$('.news-footer .story-footer__app');if(appLink)appLink.innerHTML=`${t('Download the app','下載應用程式')} <b>↗</b>`;
    const columns=$$('.news-footer .story-footer__column');
    columns[0]?.setAttribute('aria-label',t('Explore','探索'));
    columns[1]?.setAttribute('aria-label',t('Get started','開始學習'));
    columns[2]?.setAttribute('aria-label',t('Help','幫助'));
    $('.news-footer .story-footer__bottom nav')?.setAttribute('aria-label',t('Legal','法律資訊'));
    $('.news-footer .footer-heads-link')?.setAttribute('aria-label',t('Kokomonster home','Kokomonster 首頁'));
    $('.news-footer .footer-heads')?.setAttribute('alt',t('Kokomonster characters','Kokomonster 角色'));
  };
  const applyIndexLanguage=()=>{
    if(!isNewsIndex)return;
    document.documentElement.lang=languageCode==='zh'?'zh-Hant':'en';
    document.title=t('Easy News — Kokomonster','簡易新聞 — Kokomonster');
    $('meta[name="description"]')?.setAttribute('content',t('Read current stories in approachable Japanese with furigana, translation and guided reading support.','閱讀真實時事，用振假名、朗讀、翻譯與引導閱讀，輕鬆理解日語新聞。'));
    const copy=[
      ['.news-nav a[href="news.html"]','Easy News','簡易新聞'],['.news-nav a[href="story.html"]','Books','書籍'],['.news-nav a[href="chat.html"]','Guided Chat','AI 對話'],['.news-nav a[href*="store.kokomonster"]','Shop','商店'],['.news-nav a[href*="apps.apple"]','App','應用程式'],
      ['.news-login','Login','登入'],['.news-intro .news-kicker','EASY NEWS · JAPAN TODAY','簡易新聞 · 今日日本'],['.news-lede','Real current stories with furigana, narration and translation when you need them. Read one useful article, keep one useful word.','真實時事，加上需要時可開啟的振假名、朗讀與翻譯。讀完一篇實用新聞，帶走一個真正用得到的詞。'],
      ['.news-daily-card > span','TODAY’S 5-MINUTE READ','今日 5 分鐘閱讀'],['.news-daily-card strong small','Level','程度'],['.news-feed .news-kicker','LATEST STORIES','最新新聞'],['.news-feed__bar h2','Choose what you want to understand.','選擇你想讀懂的主題。'],
      ['.news-level-picker > span','Reading level','閱讀程度'],['.news-topic-picker > span','Section','分類'],['.news-word .news-kicker','WORD FROM THIS SECTION','本分類精選單字'],
      ['.login-modal .news-kicker','YOUR KOKOMONSTER ACCOUNT','你的 KOKOMONSTER 帳號'],['#login-title','Log in to keep learning.','登入，繼續你的學習。'],['.login-modal__dialog > p:not(.news-kicker)','Save useful words, keep your reading history and bring expressions into Guided Chat.','儲存實用單字、保留閱讀紀錄，並把學到的表達帶進 AI 對話。'],['.login-modal__later','Not now','暫時不要']
    ];
    copy.forEach(([selector,en,zh])=>setText(selector,en,zh));
    setHtml('.news-intro h1','Today’s world.<br><em>Readable Japanese.</em>','今日世界。<br><em>讀得懂的日語。</em>');
    setHtml('.news-daily-card a','Start today’s story <b>→</b>','開始閱讀今日新聞 <b>→</b>');
    setHtml('.news-more','Load more stories <b>↓</b>','載入更多新聞 <b>↓</b>');
    setHtml('[data-lead-cta]','Read · listen · understand <b><span class="play-glyph" aria-hidden="true"></span></b>','閱讀 · 聆聽 · 理解 <b><span class="play-glyph" aria-hidden="true"></span></b>');
    setHtml('.login-modal__dialog > a','Continue to login <b>→</b>','前往登入 <b>→</b>');
    levelOptions.forEach(option=>{option.textContent=levelName(option.dataset.levelOption);});
    $$('[data-news-level] option').forEach(option=>{option.textContent=levelName(option.value);});
    topicOptions.forEach(option=>{option.textContent=topicName(option.dataset.topicOption||'all');});
    topics.forEach(button=>{button.textContent=topicName(button.dataset.topic||'all');});
    gridCards.forEach(card=>{
      const badge=$('.news-card__image span',card);if(badge)badge.textContent=`${card.dataset.level.toUpperCase()} · ${languageCode==='zh'?topicName(card.dataset.topic):topicName(card.dataset.topic).toUpperCase()}`;
      const cardSummary=$('.news-card__body small',card);if(cardSummary)cardSummary.textContent=summaryText(card);
      const cardDate=$('time',card);if(cardDate)cardDate.textContent=dateText(card.dataset.date);
      const image=$('img',card);if(image)image.alt=languageCode==='zh'?'新聞封面插圖':card.dataset.alt||'';
      const playButton=$('[data-card-play]',card);playButton?.setAttribute('aria-label',t('Play story preview','播放新聞預覽'));
    });
    syncLevelPicker();syncTopicPicker();
    nav?.setAttribute('aria-label',t('Main navigation','主導覽'));
    menuScrim?.setAttribute('aria-label',t('Close menu','關閉選單'));
    $('.news-daily-card')?.setAttribute('aria-label',t('Today’s reading suggestion','今日閱讀建議'));
    levelMenu?.setAttribute('aria-label',t('Reading level','閱讀程度'));
    topicMenu?.setAttribute('aria-label',t('News section','新聞分類'));
    $('.news-topics')?.setAttribute('aria-label',t('Filter news by topic','按主題篩選新聞'));
    $('.login-modal__close')?.setAttribute('aria-label',t('Close login prompt','關閉登入提示'));
    $$('.news-brand').forEach(brand=>brand.setAttribute('aria-label',t('Kokomonster home','Kokomonster 首頁')));
    $('.footer-heads')?.setAttribute('alt',t('Kokomonster characters','Kokomonster 角色'));
    previewFurigana?.setAttribute('aria-label',preview?.classList.contains('hide-furigana')?t('Show furigana','顯示振假名'):t('Hide furigana','隱藏振假名'));
    previewTranslation?.setAttribute('aria-label',preview?.classList.contains('hide-translation')?t('Show translation','顯示翻譯'):t('Hide translation','隱藏翻譯'));
    previewPlay?.setAttribute('aria-label',previewPlay.getAttribute('aria-pressed')==='true'?t('Pause preview','暫停新聞預覽'):t('Play preview','播放新聞預覽'));
    closeMenu();
    updateFeed();
  };
  const applyReaderLanguage=()=>{
    if(!isNewsReader)return;
    document.documentElement.lang=languageCode==='zh'?'zh-Hant':'en';
    const copy=[
      ['.news-nav a[href="news.html"]','Easy News','簡易新聞'],['.news-nav a[href="story.html"]','Books','書籍'],['.news-nav a[href="chat.html"]','Guided Chat','AI 對話'],['.news-nav a[href*="store.kokomonster"]','Shop','商店'],['.news-nav a[href*="apps.apple"]','App','應用程式'],['.news-login','Login','登入'],
      ['.reader-back','← Back to Easy News','← 返回簡易新聞'],['.reader-toolbar>div:first-child span','READ · LISTEN · UNDERSTAND','閱讀 · 聆聽 · 理解'],['.reader-toolbar>div:first-child strong','2 min · 7 keywords','2 分鐘 · 7 個關鍵字'],['.reader-word-card__head>span','KEYWORDS IN THIS STORY','本篇新聞關鍵字'],['.reader-word-card>p','Play a word or save it to your library.','播放單字，或儲存至你的單字庫。'],
      ['.reader-progress>span','YOUR DAILY PROGRESS','你的每日進度'],['.reader-progress__heading small','Daily goal · 3 stories','每日目標 · 3 篇新聞'],['.reader-chat-card__copy>small','AFTER READING','閱讀之後'],['.reader-chat-card__copy>strong','Use today’s words with Boombear.','和 Boombear 練習今天的單字。'],['.reader-chat-card__copy>em','Start a guided chat →','開始 AI 對話 →'],
      ['.reader-next .news-kicker','KEEP READING','繼續閱讀'],['.reader-next h2','More current stories, at your level.','更多符合你程度的時事新聞。'],['.login-modal .news-kicker','YOUR KOKOMONSTER ACCOUNT','你的 KOKOMONSTER 帳號'],['#login-title','Log in to save this word.','登入以儲存這個單字。'],['.login-modal__dialog>p:not(.news-kicker)','Your saved words stay with your reading history and can be used later in Guided Chat.','儲存的單字會保留在閱讀紀錄中，之後亦可用於 AI 對話。'],['.login-modal__later','Not now','暫時不要']
    ];
    copy.forEach(([selector,en,zh])=>setText(selector,en,zh));
    setHtml('.login-modal__dialog>a','Continue to login <b>→</b>','前往登入 <b>→</b>');
    const demo=$('[data-demo-login]');const demoLabel=$('b',demo);if(demoLabel)demoLabel.textContent=demo.getAttribute('aria-pressed')==='true'?t('Signed-in demo','已登入示範'):t('Signed-out demo','未登入示範');
    const progress=$('[data-reader-progress]');const count=Number(progress?.dataset.count||1);const remaining=Math.max(0,3-count);
    const countLabel=$('[data-story-count]',progress);if(countLabel)countLabel.textContent=t(`${count} ${count===1?'story':'stories'} today`, `今天已讀 ${count} 篇`);
    const message=$('[data-progress-message]',progress);if(message)message.textContent=count>=3?t('Daily goal complete — badge earned!','已完成每日目標，獲得徽章！'):t(`${remaining} more ${remaining===1?'story':'stories'} to earn today’s reading badge.`,`再讀 ${remaining} 篇即可獲得今日閱讀徽章。`);
    $$('.reader-next__grid em').forEach(item=>{const match=item.textContent.match(/(\d+)\s*(?:min|分鐘)\s*·\s*(\d+)\s*(?:keywords|個關鍵字)/i);if(match)item.textContent=t(`${match[1]} min · ${match[2]} keywords`,`${match[1]} 分鐘 · ${match[2]} 個關鍵字`);});
    nav?.setAttribute('aria-label',t('Main navigation','主導覽'));menuScrim?.setAttribute('aria-label',t('Close menu','關閉選單'));$('.login-modal__close')?.setAttribute('aria-label',t('Close login prompt','關閉登入提示'));
    mode?.setAttribute('aria-label',article?.classList.contains('word-by-word')?t('Switch to paragraph mode','切換至段落模式'):t('Switch to word-by-word mode','切換至逐詞模式'));size?.setAttribute('aria-label',t('Change text size','調整文字大小'));speed?.setAttribute('aria-label',t('Change reading speed','調整朗讀速度'));closeMenu();
  };
  const updateLanguage=()=>{
    if(interfaceLanguage){interfaceLanguage.textContent=languageCode==='zh'?'EN':'繁';interfaceLanguage.setAttribute('aria-label',t('Language: English. Switch to Traditional Chinese','語言：繁體中文。切換至英文'));}
    try{window.localStorage.setItem('kkm-language',languageCode);}catch(error){}
    updateTranslations();
    applyIndexLanguage();applyReaderLanguage();applyFooterLanguage();
  };
  language?.addEventListener('click',()=>{languageCode=languageCode==='en'?'zh':'en';updateLanguage();});
  interfaceLanguage?.addEventListener('click',()=>{languageCode=languageCode==='en'?'zh':'en';updateLanguage();});
  updateLanguage();updateTranslations();
  mode?.addEventListener('click',()=>{const enabled=article.classList.toggle('word-by-word');mode.classList.toggle('active',enabled);mode.setAttribute('aria-pressed',String(enabled));mode.textContent=enabled?'文':'語';mode.setAttribute('aria-label',enabled?t('Switch to paragraph mode','切換至段落模式'):t('Switch to word-by-word mode','切換至逐詞模式'));$$('.reader-word-mode',article).forEach(panel=>panel.hidden=!enabled);});
  size?.addEventListener('click',()=>{textSizeIndex=(textSizeIndex+1)%3;article.classList.toggle('text-medium',textSizeIndex===1);article.classList.toggle('text-large',textSizeIndex===2);size.classList.toggle('active',textSizeIndex>0);size.textContent=['A−','Aa','A+'][textSizeIndex];size.setAttribute('aria-label',t(`Text size: ${['small','medium','large'][textSizeIndex]}. Activate for next size`,`文字大小：${['小','中','大'][textSizeIndex]}。按下切換至下一級`));});
  speed?.addEventListener('click',()=>{speedRate=speedRate===1?.75:speedRate===.75?1.25:1;speed.textContent=`${speedRate}×`;if(articleAudio)articleAudio.playbackRate=speedRate;});
  const articleAudio=isNewsReader?new Audio():null;
  if(articleAudio){articleAudio.preload='auto';articleAudio.playsInline=true;}
  let articleRun=0;
  let tokenAudio=null;
  let activeWordToken=null;
  let activeParagraphToken=null;
  const clearWordTracking=()=>{timedWordTokens.forEach(item=>item.classList.remove('playing'));paragraphTokens.forEach(item=>item.classList.remove('playing'));activeWordToken=null;activeParagraphToken=null;};
  const syncWordTracking=(sentenceIndex,currentTime)=>{
    const currentMs=currentTime*1000;
    const matches=item=>Number(item.dataset.sentenceIndex)===sentenceIndex&&currentMs>=Number(item.dataset.tokenStart)&&currentMs<Number(item.dataset.tokenEnd);
    const match=timedWordTokens.find(matches);const paragraphMatch=paragraphTokens.find(matches);
    if(match===activeWordToken&&paragraphMatch===activeParagraphToken)return;
    clearWordTracking();
    if(match){match.classList.add('playing');activeWordToken=match;}
    if(paragraphMatch){paragraphMatch.classList.add('playing');activeParagraphToken=paragraphMatch;}
  };
  const stopTokenAudio=()=>{if(tokenAudio){tokenAudio.pause();tokenAudio.removeAttribute('src');tokenAudio.load();}tokenAudio=null;clearWordTracking();};
  const stop=()=>{articleRun+=1;window.clearTimeout(timer);articleAudio?.pause();if(articleAudio)articleAudio.currentTime=0;stopTokenAudio();tokens.forEach(item=>item.classList.remove('sentence-playing'));tokenIndex=0;setMediaPlaybackState('paused');if(play){play.textContent='▶';play.setAttribute('aria-pressed','false');play.setAttribute('aria-label',t('Play article','播放文章'));}};
  const step=async runId=>{if(runId!==articleRun)return;if(tokenIndex>=tokens.length){stop();return;}clearWordTracking();tokens.forEach((item,index)=>item.classList.toggle('sentence-playing',index===tokenIndex));const sentenceIndex=tokenIndex;const token=tokens[tokenIndex++];const source=token.dataset.audio;if(!source){timer=window.setTimeout(()=>step(runId),Math.round(760/speedRate));return;}if(!articleAudio)return;articleAudio.pause();articleAudio.src=versionedAudio(source);articleAudio.playbackRate=speedRate;articleAudio.ontimeupdate=()=>{if(runId===articleRun)syncWordTracking(sentenceIndex,articleAudio.currentTime);};articleAudio.onended=()=>{if(runId!==articleRun)return;clearWordTracking();step(runId);};articleAudio.onerror=()=>{if(runId!==articleRun)return;clearWordTracking();step(runId);};try{await articleAudio.play();}catch(error){if(runId!==articleRun)return;clearWordTracking();timer=window.setTimeout(()=>step(runId),Math.round(760/speedRate));}};
  const playFromSentence=sentenceIndex=>{
    if(!Number.isInteger(sentenceIndex)||sentenceIndex<0||sentenceIndex>=tokens.length)return;
    articleRun+=1;const runId=articleRun;window.clearTimeout(timer);articleAudio?.pause();stopTokenAudio();tokens.forEach(item=>item.classList.remove('sentence-playing'));
    tokenIndex=sentenceIndex;if(play){play.textContent='Ⅱ';play.setAttribute('aria-pressed','true');play.setAttribute('aria-label',t('Pause article','暫停文章'));}setMediaPlaybackState('playing');step(runId);
  };
  play?.addEventListener('click',()=>{if(play.getAttribute('aria-pressed')==='true'){stop();return;}articleRun+=1;const runId=articleRun;play.textContent='Ⅱ';play.setAttribute('aria-pressed','true');play.setAttribute('aria-label',t('Pause article','暫停文章'));setMediaPlaybackState('playing');step(runId);});
  if(isNewsReader&&'mediaSession' in navigator){try{navigator.mediaSession.setActionHandler('play',()=>{if(play?.getAttribute('aria-pressed')!=='true')play?.click();});navigator.mediaSession.setActionHandler('pause',()=>{if(play?.getAttribute('aria-pressed')==='true')stop();});}catch(error){}}
  article?.addEventListener('click',event=>{
    const token=event.target.closest('.reader-token[data-token-audio]');
    if(!token){
      const paragraph=event.target.closest('[data-play-sentence]');if(!paragraph||event.target.closest('[data-word]'))return;
      const sentence=paragraph.querySelector('[data-karaoke]');playFromSentence(Number(sentence?.dataset.sentenceIndex));return;
    }
    event.preventDefault();
    articleRun+=1;window.clearTimeout(timer);articleAudio?.pause();tokens.forEach(item=>item.classList.remove('sentence-playing'));tokenIndex=0;setMediaPlaybackState('paused');if(play){play.textContent='▶';play.setAttribute('aria-pressed','false');}
    if(activeWordToken===token&&tokenAudio){stopTokenAudio();return;}
    stopTokenAudio();
    const start=Number(token.dataset.tokenStart)/1000;const end=Number(token.dataset.tokenEnd)/1000;
    const audio=new Audio(versionedAudio(token.dataset.tokenAudio));tokenAudio=audio;audio.playbackRate=speedRate;syncWordTracking(Number(token.dataset.sentenceIndex),(start+.001));
    const finish=()=>{if(tokenAudio!==audio)return;audio.pause();tokenAudio=null;clearWordTracking();};
    audio.addEventListener('timeupdate',()=>{if(audio.currentTime>=end)finish();});
    audio.addEventListener('ended',finish,{once:true});audio.addEventListener('error',finish,{once:true});
    audio.addEventListener('loadedmetadata',async()=>{if(tokenAudio!==audio)return;audio.currentTime=Math.min(start,Math.max(0,audio.duration-.05));try{await audio.play();}catch(error){finish();}},{once:true});
    audio.load();
  });
  article?.addEventListener('keydown',event=>{
    if(event.key!=='Enter'&&event.key!==' ')return;
    const paragraph=event.target.closest('[data-play-sentence]');if(!paragraph)return;
    event.preventDefault();const sentence=paragraph.querySelector('[data-karaoke]');playFromSentence(Number(sentence?.dataset.sentenceIndex));
  });

  const wordCard=$('[data-word-card]');
  $$('[data-word]').forEach(word=>word.addEventListener('click',()=>{
    if(!wordCard)return;
    const rows=$$('[data-keyword]',wordCard);
    const match=rows.find(row=>$('b',row)?.textContent.trim()===word.dataset.word);
    rows.forEach(row=>row.classList.remove('is-flashing'));
    if(match){match.classList.add('is-flashing');match.scrollIntoView({block:'nearest',behavior:'smooth'});window.setTimeout(()=>match.classList.remove('is-flashing'),900);const audioButton=$('[data-keyword-play]',match);if(audioButton)playKeyword(audioButton);}
  }));

  let keywordAudio=null;
  let keywordButton=null;
  const playKeyword=async button=>{
    if(keywordAudio){keywordAudio.pause();keywordAudio.currentTime=0;}
    keywordButton?.classList.remove('playing');keywordButton?.setAttribute('aria-pressed','false');
    if(keywordButton===button){keywordAudio=null;keywordButton=null;return;}
    keywordButton=button;keywordAudio=new Audio(versionedAudio(button.dataset.audio));
    const finish=()=>{button.classList.remove('playing');button.setAttribute('aria-pressed','false');keywordAudio=null;keywordButton=null;};
    keywordAudio.addEventListener('ended',finish,{once:true});keywordAudio.addEventListener('error',finish,{once:true});
    button.classList.add('playing');button.setAttribute('aria-pressed','true');
    try{await keywordAudio.play();}catch(error){finish();}
  };
  $$('[data-keyword-play]').forEach(button=>button.addEventListener('click',()=>playKeyword(button)));

  let demoSignedIn=false;
  const demoLogin=$('[data-demo-login]');
  demoLogin?.addEventListener('click',()=>{demoSignedIn=!demoSignedIn;demoLogin.setAttribute('aria-pressed',String(demoSignedIn));demoLogin.classList.toggle('active',demoSignedIn);const label=$('b',demoLogin);if(label)label.textContent=demoSignedIn?t('Signed-in demo','已登入示範'):t('Signed-out demo','未登入示範');});
  $$('[data-keyword-save]').forEach(button=>button.addEventListener('click',event=>{event.preventDefault();if(!demoSignedIn){openLogin(button);return;}const saved=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',String(saved));button.textContent=saved?'':'＋';const term=$('b',button.closest('[data-keyword]'))?.textContent||'word';button.setAttribute('aria-label',`${saved?'Remove':'Save'} ${term}`);}));

  const progress=$('[data-reader-progress]');
  if(progress){
    const storyId=document.body.dataset.storyId||location.pathname;
    let stories=[];
    try{stories=JSON.parse(window.sessionStorage.getItem('kkm-news-session-stories')||'[]');if(!Array.isArray(stories))stories=[];}catch(error){stories=[];}
    if(!stories.includes(storyId))stories.push(storyId);
    try{window.sessionStorage.setItem('kkm-news-session-stories',JSON.stringify(stories));}catch(error){}
    const count=Math.min(stories.length,3);
    progress.dataset.count=String(count);
    const complete=count>=3;
    const countLabel=$('[data-story-count]',progress);if(countLabel)countLabel.textContent=`${count} ${count===1?'story':'stories'} today`;
    const badgeCount=$('[data-badge-count]',progress);if(badgeCount)badgeCount.textContent=`${count}/3`;
    const fill=$('[data-progress-fill]',progress);if(fill)fill.style.width=`${count/3*100}%`;
    $$('.reader-progress__steps span',progress).forEach((step,index)=>step.classList.toggle('complete',index<count));
    const badge=$('[data-goal-badge]',progress);badge?.classList.toggle('earned',complete);
    const message=$('[data-progress-message]',progress);if(message)message.textContent=complete?'Daily goal complete — badge earned!':`${3-count} more ${3-count===1?'story':'stories'} to earn today’s reading badge.`;
    applyReaderLanguage();
  }

  let wordAudio=null;
  wordPlay?.addEventListener('click',async()=>{
    if(wordAudio&&!wordAudio.paused){wordAudio.pause();wordAudio.currentTime=0;wordPlay.classList.remove('playing');wordPlay.setAttribute('aria-pressed','false');return;}
    const audioFile=wordPlay.dataset.wordAudio;
    if(!audioFile){
      window.speechSynthesis?.cancel();
      const utterance=new SpeechSynthesisUtterance(wordPlay.dataset.wordSpeech||'');
      utterance.lang='ja-JP';utterance.rate=.9;
      const finish=()=>{wordPlay.classList.remove('playing');wordPlay.setAttribute('aria-pressed','false');};
      utterance.onend=finish;utterance.onerror=finish;wordPlay.classList.add('playing');wordPlay.setAttribute('aria-pressed','true');window.speechSynthesis?.speak(utterance);return;
    }
    wordAudio=new Audio(versionedAudio(audioFile.includes('/')?audioFile:`./audio/${audioFile}`));
    const finish=()=>{wordPlay.classList.remove('playing');wordPlay.setAttribute('aria-pressed','false');};
    wordAudio.addEventListener('ended',finish,{once:true});wordAudio.addEventListener('error',finish,{once:true});
    wordPlay.classList.add('playing');wordPlay.setAttribute('aria-pressed','true');
    try{await wordAudio.play();}catch(error){finish();}
  });
};if(document.body?.dataset.newsPage==='reader'&&window.kkmReaderReady)window.kkmReaderReady.finally(start);else start();})();
