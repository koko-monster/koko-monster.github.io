(()=>{
  const menu=document.querySelector('[data-shop-menu]');
  const cart=document.querySelector('[data-cart]');
  const count=document.querySelector('[data-cart-count]');
  const list=document.querySelector('[data-cart-items]');
  const total=document.querySelector('[data-cart-total]');
  const prices={'Everyday News':1180,'Artisan Japan':1480,'Discover Japan':1480,'Japanese Buzzwords':1180,'Discover Japan Trilogy':3280};
  const items=[];
  const copy={
    en:{
      'seo.title':'Japanese Learning Books + Interactive Reader | Kokomonster',
      'seo.description':'Learn Japanese with beautifully designed books, narration, furigana, translation, chapter-linked guided chat and JLPT practice.',
      'nav.news':'Easy News','nav.books':'Books','nav.shop':'Shop','nav.app':'App',
      'hero.eyebrow':'JAPANESE BOOKS + INTERACTIVE LEARNING',
      'hero.headline':'Read the book.<br><em>Keep going</em> in the app.',
      'hero.lede':'Each book unlocks its own interactive reader, chapter-linked guided chat and JLPT practice—so you can hear, understand and use what you read.',
      'hero.primary':'Explore the books','hero.secondary':'Try the interactive reader','hero.included':'Included with every book',
      'hero.feature.reader':'Narration, furigana + translation','hero.feature.chat':'Chapter-linked guided chat','hero.feature.practice':'JLPT practice',
      'carousel.discover.label':'3-BOOK SET · DISCOVER JAPAN','carousel.discover.title':'Discover Japan','carousel.discover.body':'Explore Japan’s landscapes, craft and living culture across three richly visual books.',
      'carousel.exploring.label':'3-BOOK SET · EXPLORING JAPANESE','carousel.exploring.title':'Exploring Japanese','carousel.exploring.body':'Learn everyday Japanese through manga, popular expressions and real news—then hear it, understand it and try it yourself.','carousel.cta':'Explore this set',
      'reader.eyebrow':'TRY THE INTERACTIVE READER','reader.heading':'Choose a book. Try a chapter.',
      'journey.eyebrow':'ONE STORY · THREE WAYS TO MAKE IT YOURS','journey.read':'Read it in context','journey.practice':'Practise what you learned','journey.chat':'Use it in conversation',
      'practice.eyebrow':'BOOK-LINKED PRACTICE','practice.heading':'Read it. Try it.<br><em>Make it yours.</em>','practice.body':'Each book includes five-question vocabulary and grammar practice at its suggested JLPT level, with instant feedback after every answer.','practice.demoHeading':'Build vocabulary. Practise grammar.','practice.mode':'Practice Mode','practice.learning':'JAPANESE LEARNING','practice.pack':'YOUR PRACTICE PACK','practice.rail':'NO.','practice.yourAnswer':'Your answer','practice.correctAnswer':'Correct answer','practice.explanation':'Explanation','practice.selectAnswer':'Select an answer',
      'practice.feature1.title':'Vocabulary from memorable scenes','practice.feature1.body':'Recall useful words through the photography, topics and expressions you have just encountered.',
      'practice.feature2.title':'Grammar you can reuse','practice.feature2.body':'Complete natural Japanese sentences and practise patterns that transfer beyond one chapter.',
      'practice.feature3.title':'Immediate, useful feedback','practice.feature3.body':'Get a concise explanation after every answer, then revisit any question whenever you like.',
      'catalogue.eyebrow':'CHOOSE YOUR NEXT WORLD','catalogue.heading':'Start with what pulls you in.',
      'set.exploring.eyebrow':'SET 02 · EXPLORING JAPANESE','set.exploring.caption':'Everyday language, seen in context','set.exploring.heading':'Japanese as people<br><em>really use it.</em>','set.exploring.body':'Learn the Japanese people use every day through manga, popular expressions and real news. Visual context makes every phrase easier to understand, remember and use.',
      'set.discover.eyebrow':'SET 01 · DISCOVER JAPAN','set.discover.caption':'Land, craft and culture in vivid detail','set.discover.heading':'Read your way<br><em>into Japan.</em>','set.discover.body':'Explore Japan through landscapes, food, craft, performance and the artisans keeping its traditions alive. Rich photography gives every story immediate cultural context.',
      'product.meta':'PRINT BOOK + DIGITAL ACCESS','product.pages':'PAGES','product.position.1':'BOOK 1 OF 3','product.position.2':'BOOK 2 OF 3','product.position.3':'BOOK 3 OF 3','bundle.label':'3-book set','bundle.entitlement':'3 print books + digital access to every included chapter','bundle.cta':'Explore the set','product.cta':'View book','product.translation':'English + Traditional Chinese translations','product.features':'Reader, guided chat + JLPT practice included','product.discover1':'A visual introduction to Japan through its seasons, festivals, landscapes, art and food—authentic stories with bilingual support that keeps you reading.',
      'product.manga':'Four-panel stories place practical Japanese in familiar situations—from meeting friends to exchanging gifts—then explain the language and culture behind each scene.',
      'product.buzzwords':'Learn internet slang, lifestyle terms and expressions used in Japan from 2015 to 2024, with illustrated context that makes each phrase easier to understand and remember.',
      'product.news':'Short news stories about culture, technology, animals and daily life make authentic Japanese approachable, with bilingual guidance that takes you beyond the textbook.',
      'product.discover2':'Explore Japanese craft, spiritual traditions and food through vivid photography, practical vocabulary and learner-friendly stories.',
      'product.artisan':'Meet the artists behind the brush, chisel, music and performance. Atmospheric photography brings Japan’s living craft traditions into close view.',
      'loop.eyebrow':'ONE BOOK. A COMPLETE LEARNING LOOP.','loop.heading':'The story doesn’t end<br>when the page does.',
      'loop.step1.title':'Read the book','loop.step1.body':'Stay immersed in the photography, stories and culture of a beautifully designed book.',
      'loop.step2.title':'Scan and understand','loop.step2.body':'Scan the chapter’s QR code to open the matching article. Add narration, furigana or translation whenever you need it.',
      'loop.step3.title':'Try it in conversation','loop.step3.body':'Practise phrases from the chapter in a guided conversation with Boombear.',
      'loop.step4.title':'Check and improve','loop.step4.body':'Focus on the vocabulary and grammar you need to strengthen.','loop.visual.book':'ARTISAN JAPAN · OPEN SPREAD','loop.visual.chat':'GUIDED CHAT · BOOMBEAR',
      'recommend.eyebrow':'NOT SURE WHICH BOOK?','recommend.heading':'Find your first book.','recommend.body':'Tell us your Japanese level and what interests you. We’ll recommend the best book to start with.','recommend.cta':'Find my book',
      'footer.brand':'Japanese learning that begins with a story and stays with you in real life.','footer.explore':'EXPLORE','footer.home':'Home','footer.news':'Easy News','footer.books':'Books','footer.getStarted':'GET STARTED','footer.shopBooks':'Shop books','footer.downloadApp':'Download the app','footer.help':'HELP','footer.contact':'Contact us','footer.how':'How it works','footer.faq':'FAQ','footer.terms':'Terms of Use','footer.privacy':'Privacy Policy',
      'cart.button':'Cart','cart.heading':'YOUR BAG','cart.subheading':'Books ready to open.','cart.empty':'Your bag is waiting for a story.','cart.total':'Estimated total','cart.checkout':'Checkout securely','cart.note':'Taxes and shipping are calculated at checkout.'
    },
    zh:{
      'seo.title':'日文學習書＋互動閱讀器｜Kokomonster',
      'seo.description':'一本書，搭配朗讀、振假名、翻譯、章節對話與 JLPT 練習，讓日文從讀懂到真正用得出來。',
      'nav.news':'簡易新聞','nav.books':'書籍','nav.shop':'商店','nav.app':'App',
      'hero.eyebrow':'日文學習書＋互動學習','hero.headline':'先讀一本書，<br><em>再到 App 繼續學。</em>','hero.lede':'每本書都附有專屬互動閱讀器、章節對話與 JLPT 練習。讀過的日文，馬上聽懂、看懂、用得出來。','hero.primary':'查看書籍','hero.secondary':'試用互動閱讀器',
      'hero.included':'每本書都包含','hero.feature.reader':'朗讀、振假名與翻譯','hero.feature.chat':'章節連動引導對話','hero.feature.practice':'JLPT 練習',
      'carousel.discover.label':'3 本套書 · DISCOVER JAPAN','carousel.discover.title':'發現日本','carousel.discover.body':'三本影像豐富的書，帶你走進日本的風景、工藝與生活文化。','carousel.exploring.label':'3 本套書 · EXPLORING JAPANESE','carousel.exploring.title':'生活日文','carousel.exploring.body':'從漫畫、流行語到真實新聞，讀懂日本人每天使用的日文，再聽、再練、再開口。','carousel.cta':'查看這組套書',
      'reader.eyebrow':'試用互動閱讀器','reader.heading':'選一本書，試讀一個章節。',
      'journey.eyebrow':'一個故事，三步真正學會。','journey.read':'在情境中讀懂','journey.practice':'練習剛學會的內容','journey.chat':'在對話中用出來',
      'practice.eyebrow':'章節連動練習','practice.heading':'讀懂。練習。<br><em>真正學會。</em>','practice.body':'依照每本書建議的 JLPT 程度，完成 5 題單字與文法練習。每題答完，立即查看解析。','practice.demoHeading':'記住單字。練習文法。','practice.mode':'練習模式','practice.learning':'日文學習','practice.pack':'你的練習題組','practice.rail':'題號','practice.yourAnswer':'你的答案','practice.correctAnswer':'正確答案','practice.explanation':'解析','practice.selectAnswer':'請先選擇答案',
      'practice.feature1.title':'從故事情境記住單字','practice.feature1.body':'從剛看過的照片與主題中，記住真正用得到的單字。','practice.feature2.title':'一學就能用的文法','practice.feature2.body':'完成自然的日文句子，練習可套用到其他情境的句型。','practice.feature3.title':'每題都有即時解析','practice.feature3.body':'答完每一題，立即查看重點解析；也能隨時回頭複習。',
      'catalogue.eyebrow':'下一本，想走進哪個日本？','catalogue.heading':'從你感興趣的主題開始。',
      'set.exploring.eyebrow':'套書 02 · 生活日文','set.exploring.caption':'在情境裡，學會日常日文','set.exploring.heading':'日本人每天都在用的<br><em>日文。</em>','set.exploring.body':'透過漫畫、流行語與真實新聞，學會日本人每天使用的日文。搭配圖像與情境，更容易看懂、記住，也更敢開口。','set.discover.eyebrow':'套書 01 · 發現日本','set.discover.caption':'從風景到工藝，細看日本文化','set.discover.heading':'從閱讀<br><em>走進日本。</em>','set.discover.body':'從風景、美食、工藝與表演，認識持續傳承日本文化的職人。用豐富影像先看見文化，再讀懂故事。',
      'product.meta':'紙本書＋完整數位內容','product.pages':'頁','product.position.1':'第 1 本／共 3 本','product.position.2':'第 2 本／共 3 本','product.position.3':'第 3 本／共 3 本','bundle.label':'3 本套書','bundle.entitlement':'3 本紙本書＋套書內所有章節的數位內容','bundle.cta':'查看套書','product.cta':'查看本書','product.translation':'英文＋繁體中文翻譯','product.features':'包含互動閱讀器、引導對話與 JLPT 練習','product.discover1':'從四季、祭典、風景、藝術到美食，一本看見日本。搭配雙語引導，讀懂故事，也讀懂文化。',
      'product.manga':'四格漫畫帶你走進熟悉的生活場景——見朋友、送禮物，每一格都學得到實用日文與文化。','product.buzzwords':'收錄 2015–2024 年日本常見的網路用語、生活詞彙與流行說法。搭配插圖情境，更快看懂，也更容易記住。','product.news':'用文化、科技、動物與日常生活的短篇新聞，讀懂真實日文。搭配雙語引導，從課本走進實際用法。','product.discover2':'透過鮮明攝影、實用單字與好讀故事，深入認識日本工藝、信仰傳統與飲食文化。','product.artisan':'走近書法、雕刻、音樂與表演背後的創作者。透過充滿氛圍的攝影，感受持續傳承至今的日本技藝。',
      'loop.eyebrow':'一本書，串起完整學習體驗。','loop.heading':'翻過這一頁，<br>學習才正要開始。','loop.step1.title':'閱讀紙本書','loop.step1.body':'沉浸在精心設計的書頁、攝影、故事與文化之中。','loop.step2.title':'掃一下，讀得更懂','loop.step2.body':'掃描章節 QR code，直接開啟對應文章；需要時，再開啟朗讀、振假名或翻譯。','loop.step3.title':'拿來對話試試看','loop.step3.body':'和 Boombear 練習章節裡的日文，把讀到的話真正說出口。','loop.step4.title':'練完，再加強','loop.step4.body':'集中練習你最需要加強的單字與文法。','loop.visual.book':'ARTISAN JAPAN · 跨頁閱讀','loop.visual.chat':'引導對話 · BOOMBEAR',
      'recommend.eyebrow':'還不確定該選哪一本？','recommend.heading':'從哪一本開始？','recommend.body':'告訴我們你的程度與興趣，我們會幫你找到最適合的第一本。','recommend.cta':'幫我選書',
      'footer.brand':'從一個故事開始，讓日文走進你的日常。','footer.explore':'探索','footer.home':'首頁','footer.news':'簡易新聞','footer.books':'書籍','footer.getStarted':'開始學習','footer.shopBooks':'選購書籍','footer.downloadApp':'下載 App','footer.help':'支援','footer.contact':'聯絡我們','footer.how':'使用說明','footer.faq':'常見問題','footer.terms':'使用條款','footer.privacy':'隱私權政策','cart.button':'購物袋','cart.heading':'購物袋','cart.subheading':'把喜歡的書帶回家。','cart.empty':'購物袋目前是空的。選一本故事開始吧。','cart.total':'預估總額','cart.checkout':'安全結帳','cart.note':'稅金與運費將於結帳時計算。'
    }
  };
  let currentLocale='en';
  try{const saved=window.localStorage.getItem('kkm-language');if(saved==='en'||saved==='zh')currentLocale=saved;}catch(error){}

  menu?.addEventListener('click',()=>{
    const open=document.body.classList.toggle('menu-open');
    menu.setAttribute('aria-expanded',String(open));
    menu.setAttribute('aria-label',open?(currentLocale==='zh'?'關閉選單':'Close menu'):(currentLocale==='zh'?'開啟選單':'Open menu'));
    menu.textContent=open?'×':'☰';
  });
  document.querySelectorAll('.main-nav a').forEach(link=>link.addEventListener('click',()=>{
    document.body.classList.remove('menu-open');
    menu?.setAttribute('aria-expanded','false');
    if(menu){menu.setAttribute('aria-label',currentLocale==='zh'?'開啟選單':'Open menu');menu.textContent='☰';}
  }));

  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
    document.querySelectorAll('[data-filter]').forEach(item=>item.classList.toggle('active',item===button));
    const filter=button.dataset.filter;
    document.querySelectorAll('[data-product]').forEach(card=>{
      card.hidden=filter!=='all'&&!card.dataset.category.split(' ').includes(filter);
    });
    document.querySelectorAll('[data-book-set]').forEach(set=>{
      set.hidden=![...set.querySelectorAll('[data-product]')].some(card=>!card.hidden);
    });
  }));

  const productsSection=document.querySelector('.shop-products');
  const discoverCollection=productsSection?.querySelector('.book-collection--discover');
  const exploreCollection=productsSection?.querySelector('.book-collection--explore');
  if(productsSection&&discoverCollection&&exploreCollection)productsSection.insertBefore(discoverCollection,exploreCollection);

  const renderCart=()=>{
    const localeCopy=copy[currentLocale];
    count.textContent=String(items.length);
    total.textContent=`NT$${items.reduce((sum,item)=>sum+prices[item],0).toLocaleString('en-US')}`;
    if(!items.length){list.innerHTML=`<p class="mock-cart__empty">${localeCopy['cart.empty']}</p>`;return;}
    list.innerHTML=items.map(item=>`<article class="mock-cart__item"><div><b>${item}</b><small>${localeCopy['product.features']}</small></div><strong>NT$${prices[item].toLocaleString('en-US')}</strong></article>`).join('');
  };
  const setCart=open=>{
    cart.classList.toggle('is-open',open);
    cart.setAttribute('aria-hidden',String(!open));
    document.body.classList.toggle('body-lock',open);
  };
  document.querySelectorAll('[data-open-cart]').forEach(button=>button.addEventListener('click',()=>setCart(true)));
  document.querySelectorAll('[data-close-cart]').forEach(button=>button.addEventListener('click',()=>setCart(false)));
  document.querySelectorAll('[data-add-product]').forEach(button=>button.addEventListener('click',()=>{
    items.push(button.dataset.addProduct);
    renderCart();
    setCart(true);
  }));

  const demo=document.querySelector('[data-shop-reader]');
  const furiganaButton=demo?.querySelector('[data-demo-furigana]');
  const translationButton=demo?.querySelector('[data-demo-translation]');
  const languageButton=demo?.querySelector('[data-demo-language]');
  const playButton=demo?.querySelector('[data-demo-play]');
  const sizeButton=demo?.querySelector('[data-demo-size]');
  const speedButton=demo?.querySelector('[data-demo-speed]');
  const readerSizes=['clamp(25px,2.8vw,40px)','clamp(29px,3.1vw,46px)','clamp(33px,3.4vw,52px)'];
  const readerSpeeds=[.75,1,1.25];
  let readerSizeIndex=0;
  let readerSpeedIndex=1;
  let readerSpeech;
  let readerAudio;
  let readerAudioKind='';
  let readerKaraokeTokens=[];
  let readerKaraokeStops=[];
  const readerStatus=demo?.querySelector('[data-reader-status]');
  const setReaderStatus=message=>{if(readerStatus)readerStatus.textContent=message;};
  const clearReaderHighlight=()=>readerKaraokeTokens.forEach(token=>token.classList.remove('is-reading'));
  const tokenWeight=token=>Math.max(1,(token.dataset.speech||token.textContent||'').replace(/[。、，,.!?！？\s]/g,'').length);
  const prepareReaderKaraoke=paragraph=>{
    if(!paragraph)return;
    const fragment=document.createDocumentFragment();
    [...paragraph.childNodes].forEach(node=>{
      if(node.nodeType===Node.TEXT_NODE){
        (node.textContent.match(/[^、。！？]+[、。！？]?|\s+/g)||[]).forEach(part=>{
          const span=document.createElement('span');
          span.className='reader-karaoke-token';
          span.dataset.speech=part;
          span.textContent=part;
          fragment.append(span);
        });
        return;
      }
      if(node.nodeType===Node.ELEMENT_NODE){
        node.classList.add('reader-karaoke-token');
        fragment.append(node);
      }
    });
    paragraph.replaceChildren(fragment);
    readerKaraokeTokens=[...paragraph.querySelectorAll('.reader-karaoke-token')];
    const weights=readerKaraokeTokens.map(tokenWeight);
    const total=weights.reduce((sum,value)=>sum+value,0)||1;
    let cursor=0;
    readerKaraokeStops=weights.map(weight=>{cursor+=weight;return cursor/total;});
  };
  const highlightReaderAt=time=>{
    if(readerAudioKind!=='narration'||!readerAudio||!Number.isFinite(readerAudio.duration)||readerAudio.duration<=0)return;
    const progress=Math.min(.9999,time/readerAudio.duration);
    const found=readerKaraokeStops.findIndex(stop=>progress<stop);
    const index=found<0?readerKaraokeTokens.length-1:found;
    readerKaraokeTokens.forEach((token,tokenIndex)=>token.classList.toggle('is-reading',tokenIndex===index));
  };
  furiganaButton?.addEventListener('click',()=>{
    const active=furiganaButton.classList.toggle('active');
    furiganaButton.setAttribute('aria-pressed',String(active));
    demo.querySelectorAll('rt').forEach(item=>item.hidden=!active);
    setReaderStatus(`Furigana ${active?'on':'off'}`);
  });
  translationButton?.addEventListener('click',()=>{
    const active=translationButton.classList.toggle('active');
    translationButton.setAttribute('aria-pressed',String(active));
    const language=languageButton?.textContent==='繁'?'zh':'en';
    demo.querySelectorAll('.shop-reader-translation').forEach(item=>item.hidden=!active||!item.hasAttribute(`data-demo-${language}`));
    setReaderStatus(`Translation ${active?'on':'off'}`);
  });
  const setReaderTranslationLanguage=language=>{
    if(!languageButton)return;
    languageButton.textContent=language==='zh'?'繁':'EN';
    demo.querySelectorAll('[data-demo-en]').forEach(item=>item.hidden=language!=='en'||!translationButton.classList.contains('active'));
    demo.querySelectorAll('[data-demo-zh]').forEach(item=>item.hidden=language!=='zh'||!translationButton.classList.contains('active'));
    demo.querySelectorAll('[data-demo-word]').forEach(word=>{
      word.textContent=language==='zh'?word.dataset.wordZh:word.dataset.wordEn;
    });
    languageButton.setAttribute('aria-label',`Translation language: ${language==='zh'?'Traditional Chinese':'English'}`);
    setReaderStatus(language==='zh'?'Traditional Chinese':'English');
  };
  languageButton?.addEventListener('click',()=>{
    setReaderTranslationLanguage(languageButton.textContent==='EN'?'zh':'en');
  });
  const siteLanguageButton=document.querySelector('[data-site-language]');
  const applyLocale=locale=>{
    currentLocale=locale==='zh'?'zh':'en';
    const localeCopy=copy[currentLocale];
    document.documentElement.lang=currentLocale==='zh'?'zh-Hant':'en';
    document.body.dataset.locale=currentLocale;
    document.title=localeCopy['seo.title'];
    document.querySelector('meta[name="description"]')?.setAttribute('content',localeCopy['seo.description']);
    document.querySelectorAll('[data-i18n]').forEach(element=>{
      const value=localeCopy[element.dataset.i18n];
      if(value!==undefined)element.textContent=value;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(element=>{
      const value=localeCopy[element.dataset.i18nHtml];
      if(value!==undefined)element.innerHTML=value;
    });
    document.querySelectorAll('.book-collection__offer > a').forEach(link=>{link.innerHTML=`${localeCopy['bundle.cta']} <b>↗</b>`;});
    document.querySelectorAll('.book-feature__buy > a').forEach(link=>{link.innerHTML=`${localeCopy['product.cta']} <b>↗</b>`;});
    const discoverOneCopy=document.querySelector('.book-collection--discover [data-product]:first-child .book-feature__content > p:nth-of-type(2)');
    if(discoverOneCopy)discoverOneCopy.textContent=localeCopy['product.discover1'];
    if(siteLanguageButton){
      siteLanguageButton.textContent=currentLocale==='en'?'繁':'EN';
      siteLanguageButton.setAttribute('aria-label',currentLocale==='en'?'切換為繁體中文':'Switch to English');
      siteLanguageButton.setAttribute('aria-pressed',String(currentLocale==='zh'));
    }
    menu?.setAttribute('aria-label',document.body.classList.contains('menu-open')?(currentLocale==='zh'?'關閉選單':'Close menu'):(currentLocale==='zh'?'開啟選單':'Open menu'));
    document.querySelector('.main-nav')?.setAttribute('aria-label',currentLocale==='zh'?'主導覽':'Main navigation');
    document.querySelector('.story-footer__column:nth-of-type(1)')?.setAttribute('aria-label',currentLocale==='zh'?'探索':'Explore');
    document.querySelector('.story-footer__column:nth-of-type(2)')?.setAttribute('aria-label',currentLocale==='zh'?'開始學習':'Get started');
    document.querySelector('.story-footer__column:nth-of-type(3)')?.setAttribute('aria-label',currentLocale==='zh'?'支援':'Help');
    document.querySelector('.story-footer__bottom nav')?.setAttribute('aria-label',currentLocale==='zh'?'法律資訊':'Legal');
    try{window.localStorage.setItem('kkm-language',currentLocale);}catch(error){}
    setReaderTranslationLanguage(currentLocale);
    renderCart();
    window.kkmLocaleReady?.();
  };
  siteLanguageButton?.addEventListener('click',()=>applyLocale(currentLocale==='en'?'zh':'en'));
  applyLocale(currentLocale);
  sizeButton?.addEventListener('click',()=>{
    readerSizeIndex=(readerSizeIndex+1)%readerSizes.length;
    demo.style.setProperty('--reader-copy-size',readerSizes[readerSizeIndex]);
    sizeButton.textContent=readerSizeIndex===0?'Aa':readerSizeIndex===1?'Aa+':'Aa++';
    sizeButton.setAttribute('aria-label',`Text size ${readerSizeIndex+1} of ${readerSizes.length}`);
    setReaderStatus(`Text size ${readerSizeIndex+1} of ${readerSizes.length}`);
  });
  const stopNarration=()=>{
    if(readerAudio){readerAudio.pause();readerAudio.currentTime=0;readerAudio=null;}
    readerAudioKind='';
    clearReaderHighlight();
    window.speechSynthesis?.cancel();
    playButton?.classList.remove('active');
    playButton?.setAttribute('aria-pressed','false');
  };
  const startSpeechFallback=text=>{
    if(!text||!('speechSynthesis' in window)||!('SpeechSynthesisUtterance' in window)){setReaderStatus('Narration is not supported in this browser');return;}
    readerSpeech=new window.SpeechSynthesisUtterance(text);
    readerSpeech.lang='ja-JP';
    readerSpeech.rate=readerSpeeds[readerSpeedIndex];
    readerSpeech.onend=()=>{stopNarration();setReaderStatus('Narration finished');};
    readerSpeech.onerror=()=>{stopNarration();setReaderStatus('Narration could not start');};
    playButton.classList.add('active');
    playButton.setAttribute('aria-pressed','true');
    window.speechSynthesis.speak(readerSpeech);
  };
  const playReaderFile=(file,kind='narration')=>{
    const chapter=readerBooks?.[readerBook]?.[readerChapterIndex];
    stopNarration();
    if(!file){startSpeechFallback(chapter?.plainText||demo.querySelector('[data-reader-japanese]')?.textContent?.trim());return;}
    readerAudio=new Audio(`./audio/${file}`);
    readerAudioKind=kind;
    readerAudio.preload='auto';
    readerAudio.playbackRate=readerSpeeds[readerSpeedIndex];
    readerAudio.preservesPitch=true;
    readerAudio.ontimeupdate=event=>highlightReaderAt(event.currentTarget.currentTime);
    readerAudio.onended=()=>{const wasNarration=readerAudioKind==='narration';stopNarration();setReaderStatus(wasNarration?'Narration finished':'Word audio finished');};
    readerAudio.onerror=()=>{
      const fallbackText=chapter?.plainText||demo.querySelector('[data-reader-japanese]')?.textContent?.trim();
      stopNarration();
      if(kind==='narration')startSpeechFallback(fallbackText);else setReaderStatus('Word audio could not start');
    };
    if(kind==='narration'){
      playButton.classList.add('active');
      playButton.setAttribute('aria-pressed','true');
      setReaderStatus(`Playing at ${readerSpeeds[readerSpeedIndex]}×`);
    }
    readerAudio.play().catch(()=>readerAudio?.onerror?.());
  };
  const startNarration=()=>{
    const chapter=readerBooks?.[readerBook]?.[readerChapterIndex];
    playReaderFile(chapter?.audio,'narration');
  };
  speedButton?.addEventListener('click',()=>{
    readerSpeedIndex=(readerSpeedIndex+1)%readerSpeeds.length;
    speedButton.textContent=`${readerSpeeds[readerSpeedIndex]}×`;
    speedButton.setAttribute('aria-label',`Playback speed ${readerSpeeds[readerSpeedIndex]} times`);
    setReaderStatus(`Playback speed ${readerSpeeds[readerSpeedIndex]}×`);
    if(readerAudio&&!readerAudio.paused)readerAudio.playbackRate=readerSpeeds[readerSpeedIndex];
    if(window.speechSynthesis?.speaking){stopNarration();startNarration();}
  });
  playButton?.addEventListener('click',()=>{
    if((readerAudio&&!readerAudio.paused&&readerAudioKind==='narration')||window.speechSynthesis?.speaking){stopNarration();setReaderStatus('Narration stopped');return;}
    startNarration();
  });

  const mixedRuby={
    '災い':'<ruby>災<rt>わざわ</rt></ruby>い',
    '吸い込み':'<ruby>吸<rt>す</rt></ruby>い<ruby>込<rt>こ</rt></ruby>み',
    '折り合い':'<ruby>折<rt>お</rt></ruby>り<ruby>合<rt>あ</rt></ruby>い',
    '注いで':'<ruby>注<rt>そそ</rt></ruby>いで',
    '安らぎ':'<ruby>安<rt>やす</rt></ruby>らぎ',
    '受け継いだ':'<ruby>受<rt>う</rt></ruby>け<ruby>継<rt>つ</rt></ruby>いだ',
    '伝える':'<ruby>伝<rt>つた</rt></ruby>える',
    '見極め':'<ruby>見極<rt>みきわ</rt></ruby>め',
    'うま味':'うま<ruby>味<rt>み</rt></ruby>',
    '生み出した':'<ruby>生<rt>う</rt></ruby>み<ruby>出<rt>だ</rt></ruby>した',
    '彫り分け':'<ruby>彫<rt>ほ</rt></ruby>り<ruby>分<rt>わ</rt></ruby>け',
    '練り歩き':'<ruby>練<rt>ね</rt></ruby>り<ruby>歩<rt>ある</rt></ruby>き',
    '受け継いで':'<ruby>受<rt>う</rt></ruby>け<ruby>継<rt>つ</rt></ruby>いで',
    '整え':'<ruby>整<rt>ととの</rt></ruby>え',
    '打ち込みます':'<ruby>打<rt>う</rt></ruby>ち<ruby>込<rt>こ</rt></ruby>みます',
    '震わせる':'<ruby>震<rt>ふる</rt></ruby>わせる'
  };
  const vocabButton=(label,reading,index)=>{
    const markup=mixedRuby[label]||(/[一-龯々〆ヵヶ]/.test(label)?`<ruby>${label}<rt>${reading}</rt></ruby>`:label);
    return `<button type="button" class="reader-vocab" data-vocab-index="${index}" data-speech="${label}">${markup}</button>`;
  };
  const rubyText=(kanji,reading)=>`<ruby>${kanji}<rt>${reading}</rt></ruby>`;
  const readerBooks={
    'discover-one':[
      {tab:'祭りで心と土地を清める',label:'DISCOVER JAPAN VOL. 1 · 祭りで心と土地を清める',jp:`${rubyText('神聖','しんせい')}な${rubyText('火','ひ')}を${rubyText('囲','かこ')}み、${rubyText('力強','ちからづよ')}い${vocabButton('祭囃子','まつりばやし',0)}に${rubyText('合','あ')}わせて${rubyText('舞','ま')}うことで、${rubyText('人々','ひとびと')}は${vocabButton('災い','わざわい',1)}を${rubyText('追','お')}い${rubyText('払','はら')}い、${rubyText('心','こころ')}と${rubyText('土地','とち')}を${vocabButton('浄化','じょうか',2)}します。${rubyText('受','う')}け${rubyText('継','つ')}がれてきた${rubyText('所作','しょさ')}の${rubyText('一','ひと')}つひとつに、${rubyText('地域','ちいき')}の${rubyText('祈','いの')}りが${rubyText('込','こ')}められています。`,plainText:'神聖な火を囲み、力強い祭囃子に合わせて舞うことで、人々は災いを追い払い、心と土地を浄化します。受け継がれてきた所作の一つひとつに、地域の祈りが込められています。',en:'People dance around a sacred fire to the powerful rhythm of festival music, driving away misfortune and purifying heart and land. Every inherited gesture carries the prayers of the community.',zh:'人們圍著神聖的火焰，隨著強勁的祭囃子起舞，驅除災厄，淨化心靈與土地。每一個世代相傳的動作，都承載著地方的祈願。',vocab:[['祭囃子 · festival music','祭囃子 · 祭典音樂'],['災いを追い払う · drive away misfortune','災いを追い払う · 驅走災厄'],['浄化する · purify','浄化する · 淨化']],audio:'nanami-books-dj1-festival.mp3',vocabAudio:['nanami-books-word-matsuribayashi.mp3','nanami-books-word-wazawai.mp3','nanami-books-word-jouka.mp3'],image:'../assets/books/library/discover-japan-1/artwork-all/0035-dj1-page-010-image-01.jpg',position:'0% 50%',alt:'A ceremonial procession with musicians and a horse at a Japanese festival'},
      {tab:'雪が舞う',label:'DISCOVER JAPAN VOL. 1 · 雪が舞う',jp:`${rubyText('雪','ゆき')}は${rubyText('音','おと')}を${vocabButton('吸い込み','すいこみ',0)}、${rubyText('山里','やまざと')}を${rubyText('静','しず')}けさで${rubyText('包','つつ')}みます。${rubyText('住民','じゅうみん')}は${rubyText('屋根','やね')}の${rubyText('雪','ゆき')}を${rubyText('下','お')}ろし、${rubyText('道','みち')}を${vocabButton('確保','かくほ',1)}しながら、${rubyText('厳','きび')}しい${rubyText('冬','ふゆ')}と${vocabButton('折り合い','おりあい',2)}をつけて${rubyText('暮','く')}らしてきました。`,plainText:'雪は音を吸い込み、山里を静けさで包みます。住民は屋根の雪を下ろし、道を確保しながら、厳しい冬と折り合いをつけて暮らしてきました。',en:'Snow absorbs sound and wraps the mountain village in silence. Residents clear roofs and secure the roads, learning how to live in balance with the harsh winter.',zh:'雪吸收了聲音，讓山村籠罩在寂靜之中。居民一邊清除屋頂積雪、確保道路，一邊學會與嚴冬相處。',vocab:[['吸い込む · absorb; draw in','吸い込む · 吸入；吸收'],['確保する · secure; ensure','確保する · 確保'],['折り合いをつける · find a workable balance','折り合いをつける · 找到平衡；妥協']],audio:'nanami-books-dj1-snow.mp3',vocabAudio:['nanami-books-word-suikomu.mp3','nanami-books-word-kakuho.mp3','nanami-books-word-oriai.mp3'],image:'../assets/books/library/discover-japan-1/artwork-all/0082-dj1-page-023-image-02.jpg',alt:'Snow-covered Japanese village at night'},
      {tab:'幸せを呼ぶ金魚',label:'DISCOVER JAPAN VOL. 1 · 幸せを呼ぶ金魚',jp:`${rubyText('金魚','きんぎょ')}は${rubyText('長','なが')}い${rubyText('時間','じかん')}をかけて${vocabButton('品種改良','ひんしゅかいりょう',0)}され、${rubyText('色','いろ')}やひれの${rubyText('形','かたち')}が${rubyText('異','こと')}なる${rubyText('多彩','たさい')}な${rubyText('姿','すがた')}へと${rubyText('変化','へんか')}しました。${rubyText('愛情','あいじょう')}を${vocabButton('注いで','そそいで',1)}${rubyText('世話','せわ')}をすると、ゆったり${rubyText('泳','およ')}ぐ${rubyText('姿','すがた')}が${rubyText('暮','く')}らしに${vocabButton('安らぎ','やすらぎ',2)}をもたらします。`,plainText:'金魚は長い時間をかけて品種改良され、色やひれの形が異なる多彩な姿へと変化しました。愛情を注いで世話をすると、ゆったり泳ぐ姿が暮らしに安らぎをもたらします。',en:'Over generations, goldfish were selectively bred into many forms with different colours and fins. Caring for them with affection brings a sense of calm into daily life.',zh:'金魚經過長時間的品種改良，演變出色彩與魚鰭形狀各異的多樣姿態。用心照料牠們，悠然游動的身影便會為生活帶來安定感。',vocab:[['品種改良 · selective breeding','品種改良 · 品種改良'],['愛情を注ぐ · lavish care and affection on','愛情を注ぐ · 傾注愛意'],['安らぎをもたらす · bring calm or comfort','安らぎをもたらす · 帶來安定與慰藉']],audio:'nanami-books-dj1-goldfish.mp3',vocabAudio:['nanami-books-word-hinshukairyou.mp3','nanami-books-word-aijou.mp3','nanami-books-word-yasuragi.mp3'],image:'../assets/books/library/discover-japan-1/artwork/220610artap15052s.png',position:'54% 48%',alt:'Ornamental goldfish displayed in a glass aquarium'}
    ],
    'discover-two':[
      {tab:'「家紋」は想いの結晶',label:'DISCOVER JAPAN VOL. 2 · 「家紋」は想いの結晶',jp:`${rubyText('紋章上絵師','もんしょううわえし')}は、${rubyText('円','えん')}と${rubyText('線','せん')}を${rubyText('組','く')}み${rubyText('合','あ')}わせ、${rubyText('着物','きもの')}に${vocabButton('家紋','かもん',0)}を${rubyText('描','えが')}き${rubyText('入','い')}れます。${rubyText('先祖','せんぞ')}から${vocabButton('受け継いだ','うけついだ',1)}${rubyText('願','ねが')}いを${rubyText('正確','せいかく')}な${rubyText('形','かたち')}に${rubyText('整','ととの')}え、${rubyText('次','つぎ')}の${rubyText('世代','せだい')}へ${vocabButton('伝える','つたえる',2)}${rubyText('仕事','しごと')}です。`,plainText:'紋章上絵師は、円と線を組み合わせ、着物に家紋を描き入れます。先祖から受け継いだ願いを正確な形に整え、次の世代へ伝える仕事です。',en:'A crest painter combines circles and lines to hand-paint a family emblem onto kimono. The craft gives precise form to wishes inherited from ancestors and passes them to the next generation.',zh:'紋章上繪師把圓與線組合起來，在和服上描繪家紋。這門工作把從祖先承繼的願望整理成精準的形狀，再傳給下一代。',vocab:[['家紋 · family crest','家紋 · 家族徽章'],['受け継ぐ · inherit; carry on','受け継ぐ · 繼承；傳承'],['伝える · pass on; communicate','伝える · 傳達；傳承']],audio:'nanami-books-dj2-kamon.mp3',vocabAudio:['nanami-books-word-kamon.mp3','nanami-books-word-uketsugu.mp3','nanami-books-word-tsutaeru.mp3'],image:'../assets/books/library/discover-japan-2/artwork-all/0137-full-page-054-image-01.jpg',position:'50% 45%',alt:'Two artisans designing Japanese family crests'},
      {tab:'魚をつくる、独創の「鮓」職人',label:'DISCOVER JAPAN VOL. 2 · 魚をつくる、独創の「鮓」職人',jp:`${rubyText('職人','しょくにん')}は${rubyText('魚','さかな')}の${rubyText('状態','じょうたい')}を${vocabButton('見極め','みきわめ',0)}、${rubyText('塩','しお')}や${rubyText('酢','す')}を${rubyText('使','つか')}って${vocabButton('鮮度','せんど',1)}を${rubyText('保','たも')}ちながら、うま${rubyText('味','み')}を${rubyText('引','ひ')}き${rubyText('出','だ')}します。${rubyText('素材','そざい')}に${rubyText('手','て')}を${rubyText('加','くわ')}えることで、${rubyText('魚','さかな')}は${rubyText('時間','じかん')}とともに${rubyText('深','ふか')}い${rubyText('味','あじ')}わいへ${rubyText('変化','へんか')}します。`,plainText:'職人は魚の状態を見極め、塩や酢を使って鮮度を保ちながら、うま味を引き出します。素材に手を加えることで、魚は時間とともに深い味わいへ変化します。',en:'The artisan judges the condition of each fish, preserving freshness with salt and vinegar while drawing out its savoury character. Careful intervention lets the flavour deepen over time.',zh:'職人判斷每條魚的狀態，以鹽與醋維持鮮度，同時引出鮮味。透過細緻處理，魚的風味會隨時間變得更深厚。',vocab:[['見極める · discern; assess carefully','見極める · 看清；判斷'],['鮮度を保つ · preserve freshness','鮮度を保つ · 保持鮮度'],['うま味を引き出す · bring out umami','うま味を引き出す · 引出鮮味']],audio:'nanami-books-dj2-sushi.mp3',vocabAudio:['nanami-books-word-mikiwameru.mp3','nanami-books-word-sendo.mp3','nanami-books-word-umami.mp3'],image:'../assets/books/library/discover-japan-2/artwork-all/0361-full-page-128-image-01.jpg',position:'42% 50%',alt:'A sushi artisan shaping fish and rice by hand'},
      {tab:'未来につなげるMINGEI',label:'DISCOVER JAPAN VOL. 2 · 未来につなげるMINGEI',jp:`${vocabButton('民藝','みんげい',0)}は、${rubyText('名','な')}もない${rubyText('職人','しょくにん')}が${rubyText('日々','ひび')}の${rubyText('暮','く')}らしのために${vocabButton('生み出した','うみだした',1)}${rubyText('道具','どうぐ')}の${rubyText('美','うつく')}しさを${rubyText('見直','みなお')}す${rubyText('運動','うんどう')}です。${rubyText('使','つか')}い${rubyText('続','つづ')}けることで${rubyText('育','そだ')}つ${rubyText('形','かたち')}や${rubyText('手触','てざわ')}りを、${rubyText('未来','みらい')}の${rubyText('生活','せいかつ')}へ${vocabButton('つなげよう','つなげよう',2)}としています。`,plainText:'民藝は、名もない職人が日々の暮らしのために生み出した道具の美しさを見直す運動です。使い続けることで育つ形や手触りを、未来の生活へつなげようとしています。',en:'Mingei is a movement that rediscovers the beauty of everyday objects made by anonymous craftspeople. It carries into the future the forms and textures that grow richer through continued use.',zh:'民藝是一場重新發現無名職人為日常生活所創造器物之美的運動。它希望把經長期使用而越發成熟的形態與觸感，連接到未來的生活。',vocab:[['民藝 · Japanese folk craft movement','民藝 · 日本民藝運動'],['生み出す · create; bring forth','生み出す · 創造；孕育'],['未来につなげる · carry into the future','未来につなげる · 連接到未來']],audio:'nanami-books-dj2-mingei.mp3',vocabAudio:['nanami-books-word-mingei.mp3','nanami-books-word-umidasu.mp3','nanami-books-word-mirai-tsunageru.mp3'],image:'../assets/books/library/discover-japan-2/artwork/02-koi-artwork.jpg',position:'50% 50%',alt:'Expressive koi artwork from Discover Japan Vol. 2'}
    ],
    artisan:[
      {tab:'線に宿す浮世絵の美学',label:'ARTISAN JAPAN · 線に宿す浮世絵の美学',jp:`${rubyText('浮世絵師','うきよえし')}の${rubyText('描','えが')}いた${vocabButton('下絵','したえ',0)}は、${rubyText('彫師','ほりし')}と${rubyText('摺師','すりし')}の${rubyText('手','て')}を${rubyText('経','へ')}て、${rubyText('鮮','あざ')}やかな${rubyText('木版画','もくはんが')}に${rubyText('仕上','しあ')}がります。${rubyText('細','ほそ')}い${rubyText('線','せん')}を${vocabButton('彫り分け','ほりわけ',1)}、${rubyText('色','いろ')}を${rubyText('何度','なんど')}も${rubyText('重','かさ')}ねることで、${rubyText('表情','ひょうじょう')}や${rubyText('衣服','いふく')}の${vocabButton('質感','しつかん',2)}まで${rubyText('生','い')}き${rubyText('生','い')}きと${rubyText('表現','ひょうげん')}されます。`,plainText:'浮世絵師の描いた下絵は、彫師と摺師の手を経て、鮮やかな木版画に仕上がります。細い線を彫り分け、色を何度も重ねることで、表情や衣服の質感まで生き生きと表現されます。',en:'The artist’s drawing passes through the hands of carvers and printers before becoming a vivid woodblock print. Fine lines are carved separately and colours layered again and again to bring faces and fabrics to life.',zh:'浮世繪師的下繪會經過雕師與摺師之手，完成為鮮明的木版畫。細線被逐一雕出，色彩反覆疊印，連表情與衣服質感都能生動呈現。',vocab:[['下絵 · preliminary drawing','下絵 · 底稿'],['彫り分ける · carve distinct details','彫り分ける · 分別雕刻細節'],['質感 · texture; material quality','質感 · 質感']],audio:'nanami-books-artisan-ukiyoe.mp3',vocabAudio:['nanami-books-word-shitae.mp3','nanami-books-word-horiwakeru.mp3','nanami-books-word-shitsukan.mp3'],images:['../assets/books/library/artisan-japan/artwork-all/0126-painting-page-035-image-01.jpg','../assets/books/library/artisan-japan/artwork-all/0127-painting-page-035-image-02.jpg','../assets/books/library/artisan-japan/artwork-all/0130-painting-page-039-image-01.jpg'],alt:'A square collage of contemporary ukiyo-e artwork'},
      {tab:'江戸のつづきを生きる男',label:'ARTISAN JAPAN · 江戸のつづきを生きる男',jp:`${rubyText('野良着姿','のらぎすがた')}の${rubyText('男','おとこ')}たちは、${rubyText('太鼓','たいこ')}や${rubyText('笛','ふえ')}を${rubyText('鳴','な')}らしながら${rubyText('町','まち')}を${vocabButton('練り歩き','ねりあるき',0)}、${rubyText('江戸','えど')}から${rubyText('続','つづ')}く${vocabButton('反骨','はんこつ',1)}の${rubyText('精神','せいしん')}を${rubyText('現代','げんだい')}によみがえらせます。${rubyText('古','ふる')}い${rubyText('作法','さほう')}を${rubyText('守','まも')}るだけでなく、${rubyText('自分','じぶん')}たちの${rubyText('暮','く')}らしに${rubyText('合','あ')}わせて${vocabButton('受け継いで','うけついで',2)}います。`,plainText:'野良着姿の男たちは、太鼓や笛を鳴らしながら町を練り歩き、江戸から続く反骨の精神を現代によみがえらせます。古い作法を守るだけでなく、自分たちの暮らしに合わせて受け継いでいます。',en:'Dressed in traditional work clothes, the men parade through town with drums and flutes, reviving Edo’s rebellious spirit. They do more than preserve old customs: they adapt and carry them into present-day life.',zh:'身穿傳統工作服的男人們一邊敲鼓吹笛，一邊列隊穿過街道，讓延續自江戶的反骨精神在現代復甦。他們不只是守護舊規矩，也讓傳統配合當代生活繼續傳承。',vocab:[['練り歩く · parade through','練り歩く · 列隊前行'],['反骨の精神 · rebellious spirit','反骨の精神 · 反骨精神'],['受け継ぐ · inherit and carry on','受け継ぐ · 繼承並延續']],audio:'nanami-books-artisan-edo.mp3',vocabAudio:['nanami-books-word-neriaruku.mp3','nanami-books-word-hankotsu.mp3','nanami-books-word-uketsugu.mp3'],image:'../assets/books/library/discover-japan-1/artwork-all/0001-dj1-page-002-image-01.jpg',position:'50% 50%',alt:'Festival musicians in traditional dress, continuing a living Edo tradition'},
      {tab:'静と動の間で生まれる無二の響き',label:'ARTISAN JAPAN · 静と動の間で生まれる無二の響き',jp:`${rubyText('演奏者','えんそうしゃ')}は${rubyText('静','しず')}かに${rubyText('呼吸','こきゅう')}を${vocabButton('整え','ととのえ',0)}、${rubyText('一瞬','いっしゅん')}の${rubyText('間','ま')}を${rubyText('置','お')}いてから${rubyText('全身','ぜんしん')}で${rubyText('太鼓','たいこ')}を${vocabButton('打ち込みます','うちこみます',1)}。${rubyText('張','は')}りつめた${rubyText('静','しず')}けさと${rubyText('激','はげ')}しい${rubyText('動','うご')}きが${rubyText('交','まじ')}わると、${rubyText('会場','かいじょう')}を${vocabButton('震わせる','ふるわせる',2)}${rubyText('唯一無二','ゆいいつむに')}の${rubyText('響','ひび')}きが${rubyText('生','う')}まれます。`,plainText:'演奏者は静かに呼吸を整え、一瞬の間を置いてから全身で太鼓を打ち込みます。張りつめた静けさと激しい動きが交わると、会場を震わせる唯一無二の響きが生まれます。',en:'The performer steadies their breath, pauses for an instant, then strikes the drum with the whole body. When taut silence meets explosive movement, a singular sound shakes the hall.',zh:'演奏者先靜靜調整呼吸，停頓片刻，再以全身力量擊鼓。緊繃的寂靜與激烈動作交會時，便誕生出震動全場、獨一無二的音色。',vocab:[['呼吸を整える · steady one’s breathing','呼吸を整える · 調整呼吸'],['打ち込む · strike with full force','打ち込む · 全力打入；敲擊'],['震わせる · make something shake','震わせる · 使震動']],audio:'nanami-books-artisan-taiko.mp3',vocabAudio:['nanami-books-word-kokyuu-totonoeru.mp3','nanami-books-word-uchikomu.mp3','nanami-books-word-furuwaseru.mp3'],image:'../assets/books/library/artisan-japan/artwork-all/0227-sounds-page-017-image-01.jpg',alt:'Taiko drummer in ceremonial costume'}
    ]
  };
  let readerBook='discover-one';
  let readerChapterIndex=0;
  const renderReaderChapter=index=>{
    const chapter=readerBooks[readerBook][index];
    if(!chapter)return;
    readerChapterIndex=index;
    stopNarration();
    demo.querySelector('[data-reader-label]').textContent=chapter.label;
    const paragraph=demo.querySelector('[data-reader-japanese]');
    paragraph.innerHTML=chapter.jp;
    prepareReaderKaraoke(paragraph);
    demo.querySelector('[data-reader-en]').textContent=chapter.en;
    demo.querySelector('[data-reader-zh]').textContent=chapter.zh;
    const word=demo.querySelector('[data-reader-word]');
    const firstVocab=chapter.vocab?.[0]||['Tap a highlighted word','點按標示詞語'];
    word.dataset.wordEn=firstVocab[0];word.dataset.wordZh=firstVocab[1];
    word.textContent=languageButton?.textContent==='繁'?firstVocab[1]:firstVocab[0];
    const media=demo.querySelector('[data-reader-media]');
    const images=chapter.images||[chapter.image];
    media.classList.toggle('is-collage',images.length>1);
    media.innerHTML=images.map((source,imageIndex)=>`<img data-reader-image src="${source}" alt="${imageIndex===0?chapter.alt:''}" style="object-position:${chapter.position||'50% 50%'}">`).join('');
    demo.querySelectorAll('[data-reader-chapter-index]').forEach((button,buttonIndex)=>{
      const active=buttonIndex===index;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));
    });
    demo.querySelectorAll('rt').forEach(item=>item.hidden=!furiganaButton.classList.contains('active'));
    demo.querySelector('[data-vocab-index]')?.classList.add('active');
    setReaderStatus(chapter.tab);
  };
  const selectReaderBook=book=>{
    readerBook=book;
    demo.querySelectorAll('[data-hero-book]').forEach(button=>{const active=button.dataset.heroBook===book;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
    demo.querySelectorAll('[data-reader-chapter-index]').forEach((button,index)=>button.textContent=readerBooks[book][index].tab);
    renderReaderChapter(0);
  };
  demo?.querySelectorAll('[data-hero-book]').forEach(button=>button.addEventListener('click',()=>selectReaderBook(button.dataset.heroBook)));
  demo?.querySelectorAll('[data-reader-chapter-index]').forEach(button=>button.addEventListener('click',()=>renderReaderChapter(Number(button.dataset.readerChapterIndex))));
  demo?.addEventListener('click',event=>{
    const vocabTarget=event.target.closest('[data-vocab-index]');
    if(!vocabTarget)return;
    const entry=readerBooks[readerBook][readerChapterIndex]?.vocab?.[Number(vocabTarget.dataset.vocabIndex)];
    if(!entry)return;
    demo.querySelectorAll('[data-vocab-index]').forEach(button=>button.classList.toggle('active',button===vocabTarget));
    const word=demo.querySelector('[data-reader-word]');
    word.dataset.wordEn=entry[0];word.dataset.wordZh=entry[1];
    word.textContent=languageButton?.textContent==='繁'?entry[1]:entry[0];
    setReaderStatus(languageButton?.textContent==='繁'?entry[1]:entry[0]);
    const vocabFile=readerBooks[readerBook][readerChapterIndex]?.vocabAudio?.[Number(vocabTarget.dataset.vocabIndex)];
    playReaderFile(vocabFile,'vocabulary');
  });
  renderReaderChapter(0);

  const carousel=document.querySelector('[data-hero-carousel]');
  const carouselViewport=carousel?.querySelector('[data-carousel-viewport]');
  const carouselSlides=[...(carousel?.querySelectorAll('[data-carousel-slide]')||[])];
  const carouselDots=[...(carousel?.querySelectorAll('[data-carousel-dot]')||[])];
  const carouselPause=carousel?.querySelector('[data-carousel-pause]');
  const carouselPrev=carousel?.querySelector('[data-carousel-prev]');
  const carouselNext=carousel?.querySelector('[data-carousel-next]');
  const bookMarquee=carousel?.querySelector('[data-book-marquee]');
  const bookMarqueeTrack=carousel?.querySelector('[data-book-marquee-track]');
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  let carouselIndex=0;
  let carouselFrame;
  let carouselPaused=reducedMotion.matches;
  let carouselTimer;
  const updateCarousel=index=>{
    carouselIndex=Math.max(0,Math.min(index,carouselSlides.length-1));
    carouselSlides.forEach((slide,slideIndex)=>slide.classList.toggle('active',slideIndex===carouselIndex));
    carouselDots.forEach((dot,dotIndex)=>{
      const active=dotIndex===carouselIndex;
      dot.classList.toggle('active',active);
      dot.setAttribute('aria-pressed',String(active));
    });
    if(carouselPrev)carouselPrev.disabled=carouselIndex===0;
    if(carouselNext)carouselNext.disabled=carouselIndex===carouselSlides.length-1;
  };
  const goToCarouselSlide=(index,smooth=true)=>{
    if(!carouselViewport||!carouselSlides.length)return;
    const next=Math.max(0,Math.min(index,carouselSlides.length-1));
    const slide=carouselSlides[next];
    const left=slide.offsetLeft-(carouselViewport.clientWidth-slide.clientWidth)/2;
    carouselViewport.scrollTo({left,behavior:smooth?'smooth':'auto'});
    updateCarousel(next);
  };
  const startCarouselTimer=()=>{
    clearInterval(carouselTimer);
    if(carouselPaused||reducedMotion.matches||carouselSlides.length<2)return;
    carouselTimer=setInterval(()=>{
      if(document.hidden||carousel?.matches(':hover')||carousel?.contains(document.activeElement))return;
      goToCarouselSlide((carouselIndex+1)%carouselSlides.length);
    },6500);
  };
  const setCarouselPaused=paused=>{
    carouselPaused=paused;
    carousel?.classList.toggle('paused',paused);
    bookMarquee?.classList.toggle('paused',paused);
    if(carouselPause){
      carouselPause.setAttribute('aria-pressed',String(paused));
      carouselPause.setAttribute('aria-label',paused?'Resume moving book row':'Pause moving book row');
    }
    startCarouselTimer();
  };
  carouselPrev?.addEventListener('click',()=>goToCarouselSlide(carouselIndex-1));
  carouselNext?.addEventListener('click',()=>goToCarouselSlide(carouselIndex+1));
  carouselPause?.addEventListener('click',()=>setCarouselPaused(!carouselPaused));
  carouselDots.forEach(dot=>dot.addEventListener('click',()=>goToCarouselSlide(Number(dot.dataset.carouselDot))));
  carouselViewport?.addEventListener('scroll',()=>{
    cancelAnimationFrame(carouselFrame);
    carouselFrame=requestAnimationFrame(()=>{
      const center=carouselViewport.scrollLeft+carouselViewport.clientWidth/2;
      const nearest=carouselSlides.reduce((best,slide,index)=>Math.abs(slide.offsetLeft+slide.clientWidth/2-center)<best.distance?{index,distance:Math.abs(slide.offsetLeft+slide.clientWidth/2-center)}:best,{index:0,distance:Infinity});
      updateCarousel(nearest.index);
    });
  },{passive:true});
  if(bookMarqueeTrack){
    const originalTiles=[...bookMarqueeTrack.children];
    originalTiles.forEach(tile=>{
      const clone=tile.cloneNode(true);
      clone.setAttribute('aria-hidden','true');
      clone.tabIndex=-1;
      bookMarqueeTrack.append(clone);
    });
    const setMarqueeDistance=()=>{
      const gap=parseFloat(getComputedStyle(bookMarqueeTrack).columnGap)||0;
      const distance=originalTiles.reduce((sum,tile)=>sum+tile.getBoundingClientRect().width,0)+(gap*originalTiles.length);
      bookMarqueeTrack.style.setProperty('--marquee-shift',`${-distance}px`);
    };
    setMarqueeDistance();
    window.addEventListener('resize',setMarqueeDistance,{passive:true});
  }
  reducedMotion.addEventListener?.('change',event=>{
    setCarouselPaused(event.matches);
  });
  updateCarousel(0);
  requestAnimationFrame(()=>{
    goToCarouselSlide(0,false);
  });
  setCarouselPaused(carouselPaused);

  const practiceDemo=document.querySelector('[data-practice-demo]');
  const practiceSets={
    n4:[
      {category:'N4 · VOCABULARY',prompt:'Choose the closest meaning of the highlighted expression.',question:'雪は音を「吸い込み」、山里を静けさで包みます。',options:['中へ取り込む','外へ押し出す','細かく分ける'],answer:0,explanation:'「吸い込む」は、空気・音・液体などを中へ取り込むことです。',tip:'吸う＋込む combines an action with inward movement.'},
      {category:'N4 · GRAMMAR',prompt:'Choose the particle that completes the sentence.',question:'塩や酢を使って、鮮度 ___ 保ちます。',options:['を','に','へ'],answer:0,explanation:'他動詞「保つ」の対象には助詞「を」を使います。',tip:'N を保つ = maintain N.'},
      {category:'N4 · VOCABULARY',prompt:'Choose the best meaning of the highlighted verb.',question:'先祖から受け継いだ願いを、次の世代へ「伝えます」。',options:['消します','受け渡します','隠します'],answer:1,explanation:'「伝える」は、考え・情報・文化などを別の人へ受け渡すことです。',tip:'次の世代へ伝える = pass on to the next generation.'},
      {category:'N4 · GRAMMAR',prompt:'Choose the most natural form.',question:'愛情を注いで世話を ___ 、金魚は元気に育ちます。',options:['すると','しても','したらしい'],answer:0,explanation:'「〜すると」は、ある行動の結果として自然に起こることを表します。',tip:'Vる＋と = whenever/when V happens, a result follows.'},
      {category:'N4 · VOCABULARY',prompt:'Choose the closest meaning of the highlighted word.',question:'厳しい冬と「折り合い」をつけて暮らしてきました。',options:['完全に戦うこと','うまく調整すること','すぐに忘れること'],answer:1,explanation:'「折り合いをつける」は、違いや難しさを受け入れて、うまく調整することです。',tip:'A common expression for finding a workable balance.'}
    ],
    n3:[
      {category:'N3 · VOCABULARY',prompt:'Choose the closest meaning of the highlighted verb.',question:'職人は魚の状態を「見極め」ます。',options:['注意深く判断する','大きく切り分ける','短く説明する'],answer:0,explanation:'「見極める」は、よく観察して本質や状態を正確に判断することです。',tip:'見極める often implies expert judgement.'},
      {category:'N3 · GRAMMAR',prompt:'Choose the expression that best completes the sentence.',question:'色を何度も重ねる ___ 、質感まで表現されます。',options:['ことによって','ところで','ばかりに'],answer:0,explanation:'「〜ことによって」は、方法や手段を示します。',tip:'V dictionary form＋ことによって = by means of doing V.'},
      {category:'N3 · VOCABULARY',prompt:'Choose the closest meaning of the highlighted expression.',question:'古い作法を現代によみがえらせる「反骨の精神」。',options:['権威に屈しない気持ち','失敗を恐れる気持ち','伝統を捨てる考え'],answer:0,explanation:'「反骨」は、権力や時流に簡単には従わない強い気概を表します。',tip:'反骨精神 is often positive: independence and defiance.'},
      {category:'N3 · GRAMMAR',prompt:'Choose the most natural connector.',question:'古い作法を守る ___ 、暮らしに合わせて受け継いでいます。',options:['だけでなく','にかかわらず','にすぎず'],answer:0,explanation:'「〜だけでなく」は「それに加えて」という意味で、後ろにもう一つの内容を加えます。',tip:'AだけでなくB = not only A but also B.'},
      {category:'N3 · VOCABULARY',prompt:'Choose the closest meaning of the highlighted expression.',question:'演奏者は呼吸を「整えて」から、太鼓を打ち込みます。',options:['乱れた状態を調える','息を完全に止める','声を大きくする'],answer:0,explanation:'「整える」は、乱れたものをきちんとした状態にすることです。',tip:'呼吸を整える = steady or regulate one’s breathing.'}
    ]
  };
  let practiceLevel='n4';
  let practiceQuestions=practiceSets[practiceLevel];
  let practiceIndex=0;
  const practiceResponses={n4:Array(5).fill(null),n3:Array(5).fill(null)};
  const practicePromptZh={
    'Choose the closest meaning of the highlighted expression.':'請選出與畫線詞語最接近的意思。','Choose the particle that completes the sentence.':'選出能完成句子的助詞。','Choose the best meaning of the highlighted verb.':'選出畫線動詞最適合的意思。','Choose the most natural form.':'選出最自然的形式。','Choose the closest meaning of the highlighted word.':'選出畫線詞語最接近的意思。','Choose the closest meaning of the highlighted verb.':'選出畫線動詞最接近的意思。','Choose the expression that best completes the sentence.':'選出最適合完成句子的表達。','Choose the most natural connector.':'選出最自然的連接方式。'
  };
  const practiceTipZh={
    '吸う＋込む combines an action with inward movement.':'「吸う＋込む」表示動作朝內部進行。','N を保つ = maintain N.':'「N を保つ」表示維持 N。','次の世代へ伝える = pass on to the next generation.':'「次の世代へ伝える」表示傳承給下一代。','Vる＋と = whenever/when V happens, a result follows.':'「Vる＋と」表示做了 V 之後自然出現的結果。','A common expression for finding a workable balance.':'常用來表示在現實中取得合適平衡。','見極める often implies expert judgement.':'「見極める」常帶有專業判斷的語感。','V dictionary form＋ことによって = by means of doing V.':'「動詞辭書形＋ことによって」表示藉由做某事。','反骨精神 is often positive: independence and defiance.':'「反骨精神」常帶有獨立、不向權威屈服的正面意思。','AだけでなくB = not only A but also B.':'「AだけでなくB」表示不只 A，也包含 B。','呼吸を整える = steady or regulate one’s breathing.':'「呼吸を整える」表示調整並穩定呼吸。'
  };
  const renderPractice=()=>{
    if(!practiceDemo)return;
    const item=practiceQuestions[practiceIndex];
    const responses=practiceResponses[practiceLevel];
    const selected=responses[practiceIndex];
    const answered=selected!==null;
    const correct=answered&&selected===item.answer;
    practiceDemo.querySelector('[data-practice-category]').textContent=currentLocale==='zh'?item.category.replace('VOCABULARY','單字').replace('GRAMMAR','文法'):item.category;
    practiceDemo.querySelector('[data-practice-count]').textContent=currentLocale==='zh'?`第 ${practiceIndex+1} 題／共 ${practiceQuestions.length} 題`:`QUESTION ${practiceIndex+1} OF ${practiceQuestions.length}`;
    practiceDemo.querySelector('[data-practice-prompt]').textContent=currentLocale==='zh'?(practicePromptZh[item.prompt]||item.prompt):item.prompt;
    practiceDemo.querySelector('[data-practice-question]').textContent=item.question;
    practiceDemo.querySelector('[data-practice-pack-title]').textContent=`Discover Japan · JLPT ${practiceLevel.toUpperCase()}`;
    const options=practiceDemo.querySelector('[data-practice-options]');
    if(answered)options.dataset.answered='true';else delete options.dataset.answered;
    options.innerHTML=item.options.map((option,index)=>`<button type="button" data-practice-option="${index}" class="${answered&&index===item.answer?'is-correct':''} ${answered&&index===selected&&selected!==item.answer?'is-incorrect':''}" ${answered?'disabled':''}>${String.fromCharCode(65+index)} <b>${option}</b></button>`).join('');
    const feedback=practiceDemo.querySelector('[data-practice-feedback]');
    feedback.hidden=!answered;
    feedback.classList.remove('is-correct','is-incorrect');
    if(answered){
      feedback.classList.add(correct?'is-correct':'is-incorrect');
      practiceDemo.querySelector('[data-practice-result]').textContent=currentLocale==='zh'?(correct?'答對了':'再想一下'):(correct?'CORRECT':'NOT QUITE');
      practiceDemo.querySelector('[data-practice-user-answer]').textContent=item.options[selected];
      practiceDemo.querySelector('[data-practice-answer]').textContent=item.options[item.answer];
      practiceDemo.querySelector('[data-practice-explanation]').textContent=item.explanation;
      practiceDemo.querySelector('[data-practice-tip]').textContent=currentLocale==='zh'?(practiceTipZh[item.tip]||item.tip):item.tip;
      practiceDemo.querySelector('.exai-answer-review').hidden=correct;
    }
    const next=practiceDemo.querySelector('[data-practice-next]');
    next.disabled=!answered;
    next.textContent=currentLocale==='zh'?(answered?(practiceIndex===practiceQuestions.length-1?'重新開始':'下一題'):copy.zh['practice.selectAnswer']):(answered?(practiceIndex===practiceQuestions.length-1?'Restart practice':'Next question'):copy.en['practice.selectAnswer']);
    practiceDemo.querySelectorAll('[data-practice-jump]').forEach((marker,index)=>{
      marker.classList.toggle('active',index===practiceIndex);
      const markerResponse=responses[index];
      marker.classList.toggle('is-correct',markerResponse!==null&&markerResponse===practiceQuestions[index].answer);
      marker.classList.toggle('is-incorrect',markerResponse!==null&&markerResponse!==practiceQuestions[index].answer);
      marker.setAttribute('aria-current',index===practiceIndex?'step':'false');
    });
    practiceDemo.querySelectorAll('[data-practice-level]').forEach(button=>{
      const active=button.dataset.practiceLevel===practiceLevel;
      button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));
    });
    const answeredCount=responses.filter(response=>response!==null).length;
    practiceDemo.querySelector('[data-practice-progress]').textContent=currentLocale==='zh'?`已完成 ${answeredCount}／${practiceQuestions.length} 題`:`${answeredCount} of ${practiceQuestions.length} answered`;
    const reviewLabels=practiceDemo.querySelectorAll('.exai-answer-review small');
    if(reviewLabels[0])reviewLabels[0].textContent=copy[currentLocale]['practice.yourAnswer'];
    if(reviewLabels[1])reviewLabels[1].textContent=copy[currentLocale]['practice.correctAnswer'];
    const explanationLabel=practiceDemo.querySelector('.exai-answer-feedback p > b');
    if(explanationLabel)explanationLabel.textContent=copy[currentLocale]['practice.explanation'];
  };
  practiceDemo?.addEventListener('click',event=>{
    const option=event.target.closest('[data-practice-option]');
    if(option&&!option.parentElement.dataset.answered){
      practiceResponses[practiceLevel][practiceIndex]=Number(option.dataset.practiceOption);
      renderPractice();
    }
    const level=event.target.closest('[data-practice-level]');
    if(level){practiceLevel=level.dataset.practiceLevel;practiceQuestions=practiceSets[practiceLevel];practiceIndex=0;renderPractice();}
    const jump=event.target.closest('[data-practice-jump]');
    if(jump){practiceIndex=Number(jump.dataset.practiceJump);renderPractice();}
    const nextButton=event.target.closest('[data-practice-next]');
    if(nextButton&&!nextButton.disabled){
      if(practiceIndex===practiceQuestions.length-1){practiceResponses[practiceLevel]=Array(practiceQuestions.length).fill(null);practiceIndex=0;}
      else practiceIndex+=1;
      renderPractice();
    }
  });
  document.querySelector('[data-site-language]')?.addEventListener('click',()=>renderPractice());
  renderPractice();
  document.addEventListener('keydown',event=>{if(event.key==='Escape')setCart(false)});
})();
