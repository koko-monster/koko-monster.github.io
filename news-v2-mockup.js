(()=>{
  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
  const favicon=$('link[rel~="icon"]');
  if(favicon){
    const characters=['koko','gohanko','bear','rabbit','yauyau','tree'];
    const character=characters[Math.floor(Math.random()*characters.length)];
    favicon.href=new URL(`favicon-${character}.png`,favicon.href).href;
    favicon.dataset.character=character;
  }
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
  const moreButton=$('[data-news-more]');
  const leadCard=$('.news-lead[data-news-card]');
  const gridCards=$$('.news-grid [data-news-card]');
  let currentTopic='all';
  let currentLevel=levelSelect?.value||'all';
  let visibleLimit=3;
  const matchesFilters=card=>(currentTopic==='all'||card.dataset.topic===currentTopic)&&(currentLevel==='all'||card.dataset.level===currentLevel);
  const updateFeed=()=>{
    if(leadCard)leadCard.hidden=!matchesFilters(leadCard);
    const eligible=gridCards.filter(matchesFilters);
    gridCards.forEach(card=>{const index=eligible.indexOf(card);card.hidden=index<0||index>=visibleLimit;});
    if(moreButton){moreButton.hidden=eligible.length<=visibleLimit;moreButton.setAttribute('aria-hidden',String(eligible.length<=visibleLimit));}
  };
  topics.forEach(button=>{
    button.setAttribute('aria-pressed',String(button.classList.contains('active')));
    button.addEventListener('click',()=>{
      currentTopic=button.dataset.topic||'all';
      visibleLimit=3;
      topics.forEach(item=>{const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-pressed',String(active));});
      updateFeed();
    });
  });
  levelSelect?.addEventListener('change',()=>{currentLevel=levelSelect.value;visibleLimit=3;updateFeed();});
  moreButton?.addEventListener('click',()=>{visibleLimit+=3;updateFeed();});
  updateFeed();

  const preview=$('[data-news-preview]');
  const previewFurigana=$('[data-preview-furigana]');
  const previewTranslation=$('[data-preview-translation]');
  const previewPlay=$('[data-preview-play]');
  const previewTokens=$$('[data-preview-token]');
  let previewTimer=0;
  let previewIndex=0;
  const stopPreview=()=>{window.clearTimeout(previewTimer);previewTokens.forEach(token=>token.classList.remove('playing'));previewIndex=0;if(previewPlay){previewPlay.textContent='▶';previewPlay.setAttribute('aria-pressed','false');previewPlay.setAttribute('aria-label','Play preview');}};
  const stepPreview=()=>{
    if(previewIndex>=previewTokens.length){stopPreview();return;}
    previewTokens.forEach((token,index)=>token.classList.toggle('playing',index===previewIndex));
    previewIndex+=1;
    previewTimer=window.setTimeout(stepPreview,650);
  };
  previewFurigana?.addEventListener('click',()=>{const hidden=preview.classList.toggle('hide-furigana');previewFurigana.classList.toggle('active',!hidden);previewFurigana.setAttribute('aria-pressed',String(!hidden));previewFurigana.setAttribute('aria-label',hidden?'Show furigana':'Hide furigana');});
  previewTranslation?.addEventListener('click',()=>{const hidden=preview.classList.toggle('hide-translation');previewTranslation.classList.toggle('active',!hidden);previewTranslation.setAttribute('aria-pressed',String(!hidden));previewTranslation.setAttribute('aria-label',hidden?'Show translation':'Hide translation');});
  previewPlay?.addEventListener('click',()=>{if(previewPlay.getAttribute('aria-pressed')==='true'){stopPreview();return;}previewPlay.textContent='Ⅱ';previewPlay.setAttribute('aria-pressed','true');previewPlay.setAttribute('aria-label','Pause preview');stepPreview();});

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

  const wordPlay=$('[data-word-play]');
  wordPlay?.addEventListener('click',()=>{
    if(!('speechSynthesis' in window))return;
    window.speechSynthesis.cancel();
    const utterance=new SpeechSynthesisUtterance(wordPlay.dataset.wordSpeech||'立場');
    utterance.lang='ja-JP';utterance.rate=.82;
    wordPlay.classList.add('playing');wordPlay.setAttribute('aria-pressed','true');
    const finish=()=>{wordPlay.classList.remove('playing');wordPlay.setAttribute('aria-pressed','false');};
    utterance.onend=finish;utterance.onerror=finish;
    window.speechSynthesis.speak(utterance);
  });
})();
