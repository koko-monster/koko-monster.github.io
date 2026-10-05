(()=>{
  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
  const menu=$('.news-menu');
  const nav=$('.news-nav');
  const menuScrim=$('[data-menu-close]');
  const closeMenu=()=>{document.body.classList.remove('news-menu-open');menuScrim&&(menuScrim.hidden=true);menu?.setAttribute('aria-expanded','false');if(menu){menu.textContent='☰';menu.setAttribute('aria-label','Open menu');}};
  menu?.addEventListener('click',()=>{const opening=!document.body.classList.contains('news-menu-open');document.body.classList.toggle('news-menu-open',opening);if(menuScrim)menuScrim.hidden=!opening;menu.setAttribute('aria-expanded',String(opening));menu.textContent=opening?'×':'☰';menu.setAttribute('aria-label',opening?'Close menu':'Open menu');});
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
  const leadCard=$('.news-lead[data-news-card]');
  const gridCards=$$('.news-grid [data-news-card]');
  const allCards=[leadCard,...gridCards].filter(Boolean);
  const wordTerm=$('[data-word-term]');
  const wordMeaning=$('[data-word-meaning]');
  const wordSource=$('[data-word-source]');
  const wordExample=$('[data-word-example]');
  const wordExampleTranslation=$('[data-word-example-translation]');
  const wordPlay=$('[data-word-play]');
  const wordsByTopic={
    all:{speech:'立場',audio:'nanami-word-tachiba.mp3',term:'<ruby>立場<rt>たちば</rt></ruby>',meaning:'position · standpoint · role',source:'FROM THE LATEST GLOBAL STORY',example:'<mark>立場</mark>を<ruby>明確<rt>めいかく</rt></ruby>にする。',translation:'to make a position clear'},
    global:{speech:'立場',audio:'nanami-word-tachiba.mp3',term:'<ruby>立場<rt>たちば</rt></ruby>',meaning:'position · standpoint · role',source:'FROM THE GLOBAL SECTION',example:'<mark>立場</mark>を<ruby>明確<rt>めいかく</rt></ruby>にする。',translation:'to make a position clear'},
    environment:{speech:'土石流',audio:'nanami-word-dosekiryu.mp3',term:'<ruby>土石流<rt>どせきりゅう</rt></ruby>',meaning:'debris flow · mudslide',source:'FROM THE ENVIRONMENT SECTION',example:'<ruby>大雨<rt>おおあめ</rt></ruby>で<mark>土石流</mark>が<ruby>発生<rt>はっせい</rt></ruby>しました。',translation:'A debris flow occurred after heavy rain.'},
    business:{speech:'交渉',audio:'nanami-word-kosho.mp3',term:'<ruby>交渉<rt>こうしょう</rt></ruby>',meaning:'negotiation · talks',source:'FROM THE BUSINESS SECTION',example:'<ruby>両国<rt>りょうこく</rt></ruby>は<ruby>貿易<rt>ぼうえき</rt></ruby><mark>交渉</mark>を<ruby>続<rt>つづ</rt></ruby>けています。',translation:'The two countries are continuing trade negotiations.'}
  };
  let currentTopic='all';
  let currentLevel=levelSelect?.value||'all';
  let visibleLimit=3;
  const matchesFilters=card=>(currentTopic==='all'||card.dataset.topic===currentTopic)&&(currentLevel==='all'||card.dataset.level===currentLevel);
  const updateWord=()=>{
    const firstMatchingCard=allCards.find(matchesFilters);
    const wordTopic=currentTopic==='all'?(firstMatchingCard?.dataset.topic||'all'):currentTopic;
    const data=wordsByTopic[wordTopic]||wordsByTopic.all;
    if(wordTerm)wordTerm.innerHTML=data.term;
    if(wordMeaning)wordMeaning.textContent=data.meaning;
    if(wordSource){const sourceLevel=(firstMatchingCard?.dataset.level||currentLevel||'').toUpperCase();wordSource.textContent=`${sourceLevel&&sourceLevel!=='ALL'?`${sourceLevel} · `:''}${data.source}`;}
    if(wordExample)wordExample.innerHTML=data.example;
    if(wordExampleTranslation)wordExampleTranslation.textContent=data.translation;
    if(wordPlay){wordPlay.dataset.wordSpeech=data.speech;wordPlay.dataset.wordAudio=data.audio;wordPlay.setAttribute('aria-label',`Play ${data.speech} pronunciation`);}
  };
  const updateTopicAvailability=()=>{
    topics.forEach(button=>{
      const topic=button.dataset.topic||'all';
      const available=topic==='all'||allCards.some(card=>card.dataset.topic===topic&&(currentLevel==='all'||card.dataset.level===currentLevel));
      button.disabled=!available;
      button.setAttribute('aria-disabled',String(!available));
      button.title=available?'':`No ${button.textContent.trim()} stories at this reading level yet`;
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
    if(leadCard)leadCard.hidden=!matchesFilters(leadCard);
    const eligible=gridCards.filter(matchesFilters);
    gridCards.forEach(card=>{const index=eligible.indexOf(card);card.hidden=index<0||index>=visibleLimit;});
    if(moreButton){moreButton.hidden=eligible.length<=visibleLimit;moreButton.setAttribute('aria-hidden',String(eligible.length<=visibleLimit));}
    updateWord();
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
  syncLevelPicker();
  syncTopicPicker();
  updateFeed();

  const preview=$('[data-news-preview]');
  const previewFurigana=$('[data-preview-furigana]');
  const previewTranslation=$('[data-preview-translation]');
  const previewPlay=$('[data-preview-play]');
  const previewTokens=$$('[data-preview-token]');
  const previewAudio=new Audio('./audio/nanami-news-preview.mp3');
  previewAudio.preload='metadata';
  let previewTimer=0;
  let previewIndex=0;
  const stopPreview=()=>{window.clearTimeout(previewTimer);previewAudio.pause();previewAudio.currentTime=0;previewTokens.forEach(token=>token.classList.remove('playing'));previewIndex=0;if(previewPlay){previewPlay.textContent='▶';previewPlay.setAttribute('aria-pressed','false');previewPlay.setAttribute('aria-label','Play preview');}};
  const stepPreview=()=>{
    if(previewIndex>=previewTokens.length){stopPreview();return;}
    previewTokens.forEach((token,index)=>token.classList.toggle('playing',index===previewIndex));
    previewIndex+=1;
    previewTimer=window.setTimeout(stepPreview,650);
  };
  previewFurigana?.addEventListener('click',()=>{const hidden=preview.classList.toggle('hide-furigana');previewFurigana.classList.toggle('active',!hidden);previewFurigana.setAttribute('aria-pressed',String(!hidden));previewFurigana.setAttribute('aria-label',hidden?'Show furigana':'Hide furigana');});
  previewTranslation?.addEventListener('click',()=>{const hidden=preview.classList.toggle('hide-translation');previewTranslation.classList.toggle('active',!hidden);previewTranslation.setAttribute('aria-pressed',String(!hidden));previewTranslation.setAttribute('aria-label',hidden?'Show translation':'Hide translation');});
  previewAudio.addEventListener('timeupdate',()=>{if(!Number.isFinite(previewAudio.duration)||previewAudio.duration<=0)return;const index=Math.min(previewTokens.length-1,Math.floor(previewAudio.currentTime/previewAudio.duration*previewTokens.length));previewTokens.forEach((token,itemIndex)=>token.classList.toggle('playing',itemIndex===index));});
  previewAudio.addEventListener('ended',stopPreview);
  previewPlay?.addEventListener('click',async()=>{if(previewPlay.getAttribute('aria-pressed')==='true'){stopPreview();return;}previewPlay.textContent='Ⅱ';previewPlay.setAttribute('aria-pressed','true');previewPlay.setAttribute('aria-label','Pause preview');try{await previewAudio.play();}catch(error){stepPreview();}});

  const article=$('[data-reader-article]');
  const furigana=$('[data-reader-furigana]');
  const translation=$('[data-reader-translation]');
  const language=$('[data-reader-language]');
  const size=$('[data-reader-size]');
  const play=$('[data-reader-play]');
  const speed=$('[data-reader-speed]');
  const interfaceLanguage=$('.news-language');
  let languageCode='en';
  let fontLarge=false;
  let speedRate=1;
  let timer=0;
  let tokenIndex=0;
  const tokens=$$('[data-karaoke]');
  const updateTranslations=()=>{$$('[data-translation-en]').forEach(item=>item.hidden=languageCode!=='en');$$('[data-translation-zh]').forEach(item=>item.hidden=languageCode!=='zh');};
  furigana?.addEventListener('click',()=>{const hidden=article.classList.toggle('hide-furigana');furigana.classList.toggle('active',!hidden);furigana.setAttribute('aria-pressed',String(!hidden));furigana.setAttribute('aria-label',hidden?'Show furigana':'Hide furigana');});
  translation?.addEventListener('click',()=>{const hidden=article.classList.toggle('hide-translation');translation.classList.toggle('active',!hidden);translation.setAttribute('aria-pressed',String(!hidden));translation.setAttribute('aria-label',hidden?'Show translation':'Hide translation');});
  const updateLanguage=()=>{if(language){language.textContent=languageCode==='zh'?'繁':'EN';language.setAttribute('aria-label',languageCode==='en'?'Switch translation to Chinese':'Switch translation to English');}if(interfaceLanguage){interfaceLanguage.textContent=languageCode==='zh'?'繁':'EN';interfaceLanguage.setAttribute('aria-label',languageCode==='en'?'Language: English. Switch to Chinese':'語言：繁體中文。切換至英文');}updateTranslations();};
  language?.addEventListener('click',()=>{languageCode=languageCode==='en'?'zh':'en';updateLanguage();});
  interfaceLanguage?.addEventListener('click',()=>{languageCode=languageCode==='en'?'zh':'en';updateLanguage();});
  size?.addEventListener('click',()=>{fontLarge=!fontLarge;article.classList.toggle('large-text',fontLarge);size.classList.toggle('active',fontLarge);});
  speed?.addEventListener('click',()=>{speedRate=speedRate===1?.75:speedRate===.75?1.25:1;speed.textContent=`${speedRate}×`;});
  const stop=()=>{window.clearTimeout(timer);tokens.forEach(item=>item.classList.remove('playing'));tokenIndex=0;if(play){play.textContent='▶';play.setAttribute('aria-pressed','false');play.setAttribute('aria-label','Play article');}};
  const step=()=>{tokens.forEach((item,index)=>item.classList.toggle('playing',index===tokenIndex));if(tokenIndex>=tokens.length){stop();return;}tokenIndex+=1;timer=window.setTimeout(step,Math.round(760/speedRate));};
  play?.addEventListener('click',()=>{if(play.getAttribute('aria-pressed')==='true'){stop();return;}play.textContent='Ⅱ';play.setAttribute('aria-pressed','true');play.setAttribute('aria-label','Pause article');step();});

  const wordCard=$('[data-word-card]');
  $$('[data-word]').forEach(word=>word.addEventListener('click',()=>{if(!wordCard)return;wordCard.querySelector('b').textContent=word.dataset.word;wordCard.querySelector('i').textContent=word.dataset.reading;wordCard.querySelector('strong').textContent=languageCode==='zh'?word.dataset.zh:word.dataset.en;wordCard.scrollIntoView({block:'nearest',behavior:'smooth'});}));

  let wordAudio=null;
  wordPlay?.addEventListener('click',async()=>{
    if(wordAudio&&!wordAudio.paused){wordAudio.pause();wordAudio.currentTime=0;wordPlay.classList.remove('playing');wordPlay.setAttribute('aria-pressed','false');return;}
    wordAudio=new Audio(`./audio/${wordPlay.dataset.wordAudio||'nanami-word-tachiba.mp3'}`);
    const finish=()=>{wordPlay.classList.remove('playing');wordPlay.setAttribute('aria-pressed','false');};
    wordAudio.addEventListener('ended',finish,{once:true});wordAudio.addEventListener('error',finish,{once:true});
    wordPlay.classList.add('playing');wordPlay.setAttribute('aria-pressed','true');
    try{await wordAudio.play();}catch(error){finish();}
  });
})();
