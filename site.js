const $=(selector,root=document)=>root?.querySelector(selector)??null;
const $$=(selector,root=document)=>root?[...root.querySelectorAll(selector)]:[];

const menuButton=$('.menu-button');
const mainNavigation=$('.main-nav');
const setMenuOpen=open=>{
  if(!menuButton||!mainNavigation)return;
  document.body.classList.toggle('menu-open',open);
  menuButton.setAttribute('aria-expanded',String(open));
  menuButton.setAttribute('aria-label',open?'Close menu':'Open menu');
  menuButton.textContent=open?'×':'☰';
};
menuButton?.addEventListener('click',()=>setMenuOpen(!document.body.classList.contains('menu-open')));
$$('.main-nav a').forEach(link=>link.addEventListener('click',()=>setMenuOpen(false)));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&document.body.classList.contains('menu-open')){setMenuOpen(false);menuButton?.focus();}});
document.addEventListener('click',event=>{if(!document.body.classList.contains('menu-open')||event.target.closest('.site-header'))return;setMenuOpen(false);});

const pathContent={
  today:{title:'Read one story from today’s Japan',copy:'Choose your level, read once, then practise three expressions in a five-minute chat with ご飯子.',meta:['7–10 minutes','Furigana and translation optional','Moves directly into practice'],href:'news.html',cta:'Open News',image:'assets/koko-newsroom.png'},
  culture:{title:'Enter a story through a subject you love',copy:'Start with a chapter about art, food or craft, then use its language in an interactive reading session.',meta:['Print + digital together','Narration and cultural notes','N4 through N2+'],href:'story.html',cta:'Browse Stories',image:'assets/koko-stories.png'},
  speak:{title:'Have one useful, low-pressure conversation',copy:'Pick a theme, borrow a starter when you need one and receive concise corrections without breaking the flow.',meta:['Voice or text','Level-aware support','Chapter-linked topics'],href:'chat.html',cta:'Start Chat',image:'assets/koko-chat-world.png'}
};
$$('[data-path-choices] .choice').forEach(button=>button.addEventListener('click',()=>{
  $$('[data-path-choices] .choice').forEach(item=>item.classList.toggle('active',item===button));
  const data=pathContent[button.dataset.choice],card=$('[data-recommendation]');
  card.querySelector('h3').textContent=data.title;card.querySelector('p:not(.eyebrow)').textContent=data.copy;
  card.querySelector('ul').innerHTML=data.meta.map(item=>`<li>${item}</li>`).join('');
  const action=card.querySelector('a');action.href=data.href;action.textContent=data.cta;card.querySelector('img').src=data.image;
}));

const topicButtons=$$('[data-news-topics] button');
topicButtons.forEach(button=>button.addEventListener('click',()=>{
  topicButtons.forEach(item=>item.classList.toggle('active',item===button));
  const topic=button.dataset.topic;
  $$('[data-topic-card]').forEach(card=>card.hidden=topic!=='all'&&card.dataset.topicCard!==topic);
}));
$('[data-news-level]')?.addEventListener('change',event=>{
  const names={n5:'N5 · Gentle',n4:'N4 · Supported',n3:'N3 · Natural',original:'Original Japanese'};
  const card=$('.level-card b'); if(card) card.textContent=names[event.target.value];
});
// Vocabulary persistence is not part of the current product. Keep any legacy save hooks inert.
$$('[data-save]').forEach(button=>{button.disabled=true;button.textContent='Meaning available';});

let readerFont=18,readerTimer;
$$('[data-reader-toggle]').forEach(button=>button.addEventListener('click',()=>{
  button.classList.toggle('active');
  if(button.dataset.readerToggle==='translation')$$('.reader-body .translation').forEach(item=>item.hidden=!button.classList.contains('active'));
  if(button.dataset.readerToggle==='furigana')$$('.reader-body rt').forEach(item=>item.style.visibility=button.classList.contains('active')?'visible':'hidden');
}));
$('[data-reader-size]')?.addEventListener('click',()=>{readerFont=readerFont>=24?16:readerFont+2;$('[data-reader-content]').style.fontSize=`${readerFont}px`;});
$('[data-reader-play]')?.addEventListener('click',event=>{
  clearInterval(readerTimer);const items=$$('.karaoke');let index=0,playing=event.currentTarget.classList.toggle('playing');event.currentTarget.textContent=playing?'Ⅱ':'▶';
  if(!playing)return;readerTimer=setInterval(()=>{items.forEach((item,i)=>item.classList.toggle('active',i===index));index+=1;if(index>=items.length){clearInterval(readerTimer);event.currentTarget.textContent='▶';event.currentTarget.classList.remove('playing');}},650);
});
$('[data-news-play]')?.addEventListener('click',event=>{event.currentTarget.classList.toggle('playing');event.currentTarget.innerHTML=event.currentTarget.classList.contains('playing')?'<span>Ⅱ</span> Listening…':'<span>▶</span> Listen & read';});

const filterStories=()=>{
  const level=$('[data-story-level]')?.value||'all',interest=$('[data-story-interest]')?.value||'all',tab=$('[data-story-tabs] .active')?.dataset.storyTab||'owned';
  $$('.library-book').forEach(book=>{const matchesLevel=level==='all'||book.dataset.level===level,matchesInterest=interest==='all'||book.dataset.interest.includes(interest),matchesTab=book.dataset.status.includes(tab);book.hidden=!(matchesLevel&&matchesInterest&&matchesTab);});
};
$('[data-story-level]')?.addEventListener('change',filterStories);$('[data-story-interest]')?.addEventListener('change',filterStories);
$$('[data-story-tabs] button').forEach(button=>button.addEventListener('click',()=>{$$('[data-story-tabs] button').forEach(item=>item.classList.toggle('active',item===button));filterStories();}));
$('[data-story-audio]')?.addEventListener('click',event=>{event.currentTarget.classList.toggle('playing');event.currentTarget.textContent=event.currentTarget.classList.contains('playing')?'Ⅱ':'▶';});

const chatInput=$('[data-chat-input]'),conversation=$('[data-conversation]');
$$('[data-insert]').forEach(button=>button.addEventListener('click',()=>{if(chatInput){chatInput.value=button.dataset.insert;chatInput.focus();}}));
$('[data-inspire]')?.addEventListener('click',()=>{if(chatInput){const ideas=['家でも作りますが、屋台のほうがおいしいと思います。','思ったより簡単でした。今度、友達と作りたいです。','たこ焼きも食べたことがあります。でも、焼きそばのほうが好きです。'];chatInput.value=ideas[Math.floor(Math.random()*ideas.length)];chatInput.focus();}});
$$('[data-input-mode]').forEach(button=>button.addEventListener('click',()=>{$$('[data-input-mode]').forEach(item=>item.classList.toggle('active',item===button));if(button.dataset.inputMode==='voice'){chatInput.placeholder='Listening… 話してみよう';chatInput.focus();}else chatInput.placeholder='日本語で返事を書いてみよう…';}));
$('[data-chat-support]')?.addEventListener('click',event=>{event.currentTarget.classList.toggle('active');event.currentTarget.textContent=event.currentTarget.classList.contains('active')?'Support on':'Support off';});
const sendChat=()=>{
  const value=chatInput?.value.trim();if(!value||!conversation)return;
  const user=document.createElement('article');user.className='message user-message';user.innerHTML=`<div><p>${value.replace(/[<>]/g,'')}</p><small>Now</small></div>`;conversation.appendChild(user);chatInput.value='';conversation.scrollTop=conversation.scrollHeight;
  window.setTimeout(()=>{const reply=document.createElement('article');reply.className='message character-message';reply.innerHTML=`<img src="assets/koko-gohanko.png" alt=""><div><p>いいね！「${value.replace(/[<>]/g,'')}」について、もう少し教えて。どうしてそう思ったの？</p><div class="message-tools"><button disabled aria-label="Audio sample pending approval">Audio pending</button><span>Helpful correction</span></div></div>`;conversation.appendChild(reply);conversation.scrollTop=conversation.scrollHeight;},650);
};
$('[data-chat-send]')?.addEventListener('click',sendChat);chatInput?.addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendChat();}});

const miniNews={
  n5:{title:'東京で桜が咲きました',copy:'<button data-vocab="さくら">桜</button>が 東京で 咲きました。ことしは いつもの年より 早いです。'},
  n4:{title:'東京で桜の開花が発表されました',copy:'東京で <button data-vocab="かいか">桜の開花</button>が 発表されました。今年は 平年より 早く、週末には 見ごろを迎えるそうです。'}
};
const bindMiniVocab=()=>{$$('[data-mini-news] [data-vocab]').forEach(button=>button.addEventListener('click',()=>{const meaning=button.dataset.vocab==='さくら'?'cherry blossom':'blossom';const note=$('[data-mini-news-copy]');if(note)note.setAttribute('aria-label',`${button.textContent.trim()}: ${meaning}`);}));};
$$('[data-mini-level]').forEach(button=>button.addEventListener('click',()=>{$$('[data-mini-level]').forEach(item=>item.classList.toggle('active',item===button));const content=miniNews[button.dataset.miniLevel];$('[data-mini-news-title]').textContent=content.title;$('[data-mini-news-copy]').innerHTML=content.copy;bindMiniVocab();}));
bindMiniVocab();

$$('[data-mini-reader-toggle]').forEach(button=>button.addEventListener('click',()=>{button.classList.toggle('active');const reader=$('[data-mini-reader]');if(button.dataset.miniReaderToggle==='furigana')reader.classList.toggle('hide-furigana',!button.classList.contains('active'));if(button.dataset.miniReaderToggle==='translation')$('.mini-translation',reader).hidden=!button.classList.contains('active');}));
$('[data-mini-reader-play]')?.addEventListener('click',event=>{event.currentTarget.disabled=true;event.currentTarget.innerHTML='<span>▶</span> Audio pending';});

const miniFeedback={
  '花火を見たいです。':'いいですね！ニュースと物語で覚えた「花火」を会話でも使えました。「友達と花火を見に行きたいです」と広げることもできます。',
  '映画を見たいです。':'自然で分かりやすいです。「週末は映画を見に行きたいです」と言うと、予定がさらに伝わります。',
  '友達と山に行きたいです。':'いいですね。「友達と山へハイキングに行きたいです」も自然な表現です。',
  '家で休みたいです。':'とても自然です。理由を加えて「疲れたので、家でゆっくり休みたいです」とも言えます。'
};
$$('[data-mini-reply]').forEach(button=>button.addEventListener('click',()=>{$$('[data-mini-reply]').forEach(item=>item.classList.toggle('selected',item===button));const result=$('[data-mini-chat-result]');result.hidden=false;result.innerHTML=`<div class="user">${button.dataset.miniReply}</div><div class="feedback"><b>GENTLE FEEDBACK</b>${miniFeedback[button.dataset.miniReply]}</div>`;}));

// Previous landing-page reader scripts, restored by request.
const sourcePassages={
  fireworks:{
    english:'On summer nights in Japan, fireworks spread across the sky.',
    compact:'<span data-story-hero-karaoke><ruby>日本<rt>にほん</rt></ruby></span><span data-story-hero-karaoke>の</span><span data-story-hero-karaoke><ruby>夏<rt>なつ</rt></ruby>の<ruby>夜<rt>よる</rt></ruby>には、</span><span data-story-hero-karaoke><ruby>空<rt>そら</rt></ruby>いっぱいに</span><mark data-story-hero-karaoke data-vocab-audio="hanabi" tabindex="0" role="button" aria-label="Play 花火 pronunciation"><ruby>花火<rt>はなび</rt></ruby></mark><span data-story-hero-karaoke>が</span><span data-story-hero-karaoke><ruby>広<rt>ひろ</rt></ruby>がります。</span>',
    reader:'<button class="hero-token hero-karaoke-token" data-karaoke data-speech="日本" data-word="日本" data-reading="にほん" data-meaning="Japan" data-meaning-zh="日本" data-vocab-audio="nihon"><ruby>日本<rt>にほん</rt></ruby></button><span class="hero-karaoke-token" data-karaoke data-speech="の">の</span><button class="hero-token hero-karaoke-token" data-karaoke data-speech="夏の夜" data-word="夏の夜" data-reading="なつのよる" data-meaning="summer night" data-meaning-zh="夏夜" data-vocab-audio="natsu-no-yoru"><ruby>夏<rt>なつ</rt></ruby>の<ruby>夜<rt>よる</rt></ruby></button><span class="hero-karaoke-token" data-karaoke data-speech="には、">には、</span><button class="hero-token hero-karaoke-token" data-karaoke data-speech="空" data-word="空" data-reading="そら" data-meaning="sky" data-meaning-zh="天空" data-vocab-audio="sora"><ruby>空<rt>そら</rt></ruby></button><span class="hero-karaoke-token" data-karaoke data-speech="いっぱいに">いっぱいに</span><button class="hero-token hero-karaoke-token" data-karaoke data-speech="花火" data-word="花火" data-reading="はなび" data-meaning="fireworks" data-meaning-zh="煙花" data-vocab-audio="hanabi"><ruby>花火<rt>はなび</rt></ruby></button><span class="hero-karaoke-token" data-karaoke data-speech="が">が</span><button class="hero-token hero-karaoke-token" data-karaoke data-speech="広がります" data-word="広がります" data-reading="ひろがります" data-meaning="spread" data-meaning-zh="鋪展開來" data-vocab-audio="hirogarimasu"><ruby>広<rt>ひろ</rt></ruby>がります</button><span class="hero-karaoke-token" data-karaoke data-speech="。">。</span>'
  },
  shinto:{
    english:'At a shrine in the snowy mountains, a shrine maiden dances with prayer and respect for nature and her ancestors.',
    markup:'<span class="SOURCE_TOKEN"><ruby>雪<rt>ゆき</rt></ruby>の</span><span class="SOURCE_TOKEN"><ruby>山<rt>やま</rt></ruby>にある</span><span class="SOURCE_TOKEN"><ruby>神社<rt>じんじゃ</rt></ruby>では、</span><span class="SOURCE_TOKEN"><ruby>白<rt>しろ</rt></ruby>い</span><span class="SOURCE_TOKEN"><ruby>衣装<rt>いしょう</rt></ruby>を</span><span class="SOURCE_TOKEN"><ruby>着<rt>き</rt></ruby>た</span><span class="SOURCE_TOKEN"><ruby>巫女<rt>みこ</rt></ruby>が</span><span class="SOURCE_TOKEN"><ruby>静<rt>しず</rt></ruby>かに</span><span class="SOURCE_TOKEN"><ruby>舞<rt>ま</rt></ruby>います。</span><span class="SOURCE_TOKEN"><ruby>雪<rt>ゆき</rt></ruby>が</span><span class="SOURCE_TOKEN"><ruby>積<rt>つ</rt></ruby>もる</span><span class="SOURCE_TOKEN"><ruby>中<rt>なか</rt></ruby>、</span><span class="SOURCE_TOKEN"><ruby>祈<rt>いの</rt></ruby>りを</span><span class="SOURCE_TOKEN">こめて、</span><span class="SOURCE_TOKEN">一つ一つの</span><span class="SOURCE_TOKEN"><ruby>動<rt>うご</rt></ruby>きを</span><span class="SOURCE_TOKEN"><ruby>大切<rt>たいせつ</rt></ruby>に</span><span class="SOURCE_TOKEN">します。</span><span class="SOURCE_TOKEN"><ruby>自然<rt>しぜん</rt></ruby>や</span><span class="SOURCE_TOKEN"><ruby>先祖<rt>せんぞ</rt></ruby>を</span><span class="SOURCE_TOKEN"><ruby>敬<rt>うやま</rt></ruby>う</span><span class="SOURCE_TOKEN"><ruby>心<rt>こころ</rt></ruby>を</span><span class="SOURCE_TOKEN"><ruby>表<rt>あらわ</rt></ruby>す</span><span class="SOURCE_TOKEN"><ruby>舞<rt>まい</rt></ruby>です。</span>'
  }
};
const sourceHeroCompact=$('.story-reader-card__jp');
if(sourceHeroCompact)sourceHeroCompact.innerHTML=sourcePassages.fireworks.compact;
const sourceHeroCompactTranslation=$('[data-story-hero-translation-copy="en"]');
if(sourceHeroCompactTranslation)sourceHeroCompactTranslation.textContent=sourcePassages.fireworks.english;
$('[data-story-hero-translation]')?.addEventListener('click',event=>{
  if(!sourceHeroCompactTranslation)return;
  const active=event.currentTarget.getAttribute('aria-pressed')!=='true';
  event.currentTarget.setAttribute('aria-pressed',String(active));
  event.currentTarget.setAttribute('aria-label',active?'Hide English translation':'Show English translation');
  $$('[data-story-hero-translation-copy]').forEach(item=>item.hidden=!active||item.dataset.storyHeroTranslationCopy!==($('[data-story-hero-language]')?.dataset.lang||'en'));
});
$('[data-story-hero-language]')?.addEventListener('click',event=>{
  const button=event.currentTarget,next=button.dataset.lang==='en'?'zh':'en';
  button.dataset.lang=next;button.textContent=next==='zh'?'繁':'EN';button.setAttribute('aria-label',next==='en'?'Switch translation to Chinese':'Switch translation to English');
  const visible=$('[data-story-hero-translation]')?.getAttribute('aria-pressed')==='true';
  $$('[data-story-hero-translation-copy]').forEach(item=>item.hidden=!visible||item.dataset.storyHeroTranslationCopy!==next);
});
const sourceHeroPassage=$('[data-hero-passage]');if(sourceHeroPassage)sourceHeroPassage.innerHTML=sourcePassages.fireworks.reader;
const sourceHeroEnglish=$('[data-hero-translation="en"]');if(sourceHeroEnglish)sourceHeroEnglish.textContent=sourcePassages.fireworks.english;
const sourceCompactBook=$('.story-book-moment__passage');if(sourceCompactBook)sourceCompactBook.innerHTML=sourcePassages.shinto.markup.replaceAll('SOURCE_TOKEN','story-book-karaoke-token');
const sourceCompactBookTranslation=$('.story-book-moment__reader > small');if(sourceCompactBookTranslation)sourceCompactBookTranslation.textContent=sourcePassages.shinto.english;
const sourceBookTitle=$('.story-book-app__reader-title');if(sourceBookTitle)sourceBookTitle.innerHTML='<ruby>雪<rt>ゆき</rt></ruby>の<ruby>山<rt>やま</rt></ruby>で、<mark><ruby>祈<rt>いの</rt></ruby>り</mark>をこめて';
const sourceBookCopy=$('.story-book-app__reader-copy');if(sourceBookCopy)sourceBookCopy.innerHTML=sourcePassages.shinto.markup.replaceAll('SOURCE_TOKEN','story-book-app-karaoke-token');
const sourceBookTranslation=$('[data-book-app-translation-copy]');if(sourceBookTranslation)sourceBookTranslation.textContent=sourcePassages.shinto.english;

// Landing hero: the reading controls are the product demonstration.
const heroReader=$('[data-hero-reader]');
const heroControls=$$('[data-hero-control]',heroReader||document);
const heroTranslations=$$('[data-hero-translation]',heroReader||document);
const heroLanguageToggle=$('[data-hero-language-toggle]',heroReader);
const heroTokens=$$('[data-word]',heroReader||document);
const heroKaraokeTokens=$$('[data-karaoke]',heroReader||document);
let heroNarrationFallbacks=[],heroNarrationIndex=0,heroNarrationRun=0,heroIsNarrating=false,heroSpeed=1,heroTextSize=0,heroTranslationVisible=true,heroLanguage='en',activeHeroToken=heroTokens.find(token=>token.dataset.word==='花火')||null,preferredJapaneseVoice=null;
// Narration uses the approved Nanami audio files below; browser TTS remains disabled.
const speakJapanese=()=>null;
heroControls.forEach(button=>button.addEventListener('click',()=>{
  heroReader?.classList.add('has-interacted');
  if(button.dataset.heroControl==='furigana'){
    const active=button.classList.toggle('active');button.setAttribute('aria-pressed',String(active));heroReader?.classList.toggle('hide-furigana',!active);
  }
}));
const updateHeroWordDetail=token=>{const detail=$('[data-hero-word-detail]',heroReader);if(!detail||!token)return;const meaning=heroLanguage==='zh'?(token.dataset.meaningZh||token.dataset.meaning):token.dataset.meaning;detail.classList.add('has-word');detail.innerHTML=`<span>${token.dataset.word} · ${token.dataset.reading}</span><b>${meaning}</b>`;};
$('[data-hero-translation-toggle]',heroReader)?.addEventListener('click',event=>{
  heroReader?.classList.add('has-interacted');heroTranslationVisible=!heroTranslationVisible;const button=event.currentTarget;button.setAttribute('aria-pressed',String(heroTranslationVisible));button.setAttribute('aria-label',heroTranslationVisible?'Hide translation':'Show translation');$('[data-hero-translation-control]',heroReader)?.classList.toggle('active',heroTranslationVisible);heroTranslations.forEach(item=>item.hidden=!heroTranslationVisible||item.dataset.heroTranslation!==heroLanguage);
});
heroLanguageToggle?.addEventListener('click',event=>{
  heroReader?.classList.add('has-interacted');heroLanguage=heroLanguage==='en'?'zh':'en';event.currentTarget.dataset.heroLang=heroLanguage;event.currentTarget.setAttribute('aria-label',heroLanguage==='en'?'Switch translation to Chinese':'Switch translation to English');heroTranslations.forEach(item=>item.hidden=!heroTranslationVisible||item.dataset.heroTranslation!==heroLanguage);updateHeroWordDetail(activeHeroToken);
});
$('[data-hero-size]',heroReader)?.addEventListener('click',event=>{
  heroReader?.classList.add('has-interacted');heroTextSize=heroTextSize===0?1:heroTextSize===1?-1:0;heroReader.classList.toggle('text-large',heroTextSize===1);heroReader.classList.toggle('text-small',heroTextSize===-1);event.currentTarget.querySelector('b').textContent=heroTextSize===1?'A+':heroTextSize===-1?'A−':'Aa';
});
const clearHeroNarrationFallbacks=()=>{heroNarrationFallbacks.forEach(window.clearTimeout);heroNarrationFallbacks=[];};
const showHeroKaraoke=index=>{heroNarrationIndex=Math.max(0,index);heroKaraokeTokens.forEach((item,itemIndex)=>item.classList.toggle('speaking',itemIndex===index));};
const setHeroNarrationUi=playing=>{const button=$('[data-hero-narrate]',heroReader);if(!button)return;button.classList.toggle('active',playing);button.setAttribute('aria-pressed',String(playing));button.setAttribute('aria-label',playing?'Pause reading preview':'Play reading preview');button.title=playing?'Pause reading preview':'Play reading preview';button.querySelector('b').textContent=playing?'⏸':'▶';};
const stopHeroNarration=(cancelSpeech=true)=>{heroNarrationRun+=1;heroIsNarrating=false;clearHeroNarrationFallbacks();heroKaraokeTokens.forEach(item=>item.classList.remove('speaking'));setHeroNarrationUi(false);};
const startHeroNarration=(startIndex=0)=>{
  if(!heroKaraokeTokens.length)return;heroNarrationRun+=1;const run=heroNarrationRun;clearHeroNarrationFallbacks();heroIsNarrating=true;setHeroNarrationUi(true);showHeroKaraoke(startIndex);
  const segments=heroKaraokeTokens.slice(startIndex).map((item,index)=>({index:startIndex+index,text:item.dataset.speech||item.textContent.trim()}));let cursor=0;const offsets=segments.map(segment=>{const offset=cursor;cursor+=segment.text.length;return {...segment,offset};});const speechText=segments.map(segment=>segment.text).join('');let boundarySeen=false;
  let elapsed=0;segments.forEach(segment=>{heroNarrationFallbacks.push(window.setTimeout(()=>{if(run===heroNarrationRun&&!boundarySeen)showHeroKaraoke(segment.index);},elapsed));elapsed+=Math.max(240,segment.text.length*145)/heroSpeed;});
  const finish=()=>{if(run!==heroNarrationRun)return;heroIsNarrating=false;clearHeroNarrationFallbacks();window.setTimeout(()=>{if(run===heroNarrationRun){heroKaraokeTokens.forEach(item=>item.classList.remove('speaking'));setHeroNarrationUi(false);}},220);};
  const utterance=speakJapanese(speechText,{boundary:event=>{if(run!==heroNarrationRun)return;if(!boundarySeen){boundarySeen=true;clearHeroNarrationFallbacks();}const localIndex=Math.max(0,event.charIndex||0);const segment=[...offsets].reverse().find(item=>item.offset<=localIndex)||offsets[0];if(segment)showHeroKaraoke(segment.index);},end:finish,error:finish});if(!utterance)heroNarrationFallbacks.push(window.setTimeout(finish,elapsed+250));
};
$('[data-hero-speed]',heroReader)?.addEventListener('click',event=>{heroReader?.classList.add('has-interacted');const resumeAt=heroNarrationIndex,wasPlaying=heroIsNarrating;heroSpeed=heroSpeed===.75?1:heroSpeed===1?1.25:.75;event.currentTarget.textContent=`${heroSpeed}×`;if(wasPlaying)startHeroNarration(resumeAt);});
heroTokens.forEach(token=>token.addEventListener('click',()=>{
  heroReader?.classList.add('has-interacted');stopHeroNarration();heroTokens.forEach(item=>item.classList.toggle('speaking',item===token));
  activeHeroToken=token;updateHeroWordDetail(token);
  window.setTimeout(()=>token.classList.remove('speaking'),Math.round(900/heroSpeed));
}));
$('[data-hero-narrate]',heroReader)?.addEventListener('click',event=>{
  heroReader?.classList.add('has-interacted');if(heroIsNarrating)stopHeroNarration();else startHeroNarration(0);
});

$$('[data-quiz-answer]').forEach(button=>button.addEventListener('click',()=>{
  const quiz=button.closest('[data-quiz]'),correct=button.dataset.quizAnswer==='correct';$$('[data-quiz-answer]',quiz).forEach(item=>{item.classList.remove('correct','wrong');item.disabled=true;});button.classList.add(correct?'correct':'wrong');$('[data-quiz-answer="correct"]',quiz).classList.add('correct');$('[data-quiz-score]',quiz).textContent=correct?'+ 20 XP':'+ 10 XP';$('[data-quiz-feedback]',quiz).textContent=correct?'Correct — 昨日 calls for the past form 見ました. You used 花火 again.':'Almost. 昨日 points to the past, so 見ました is the natural choice.';
}));

const landingBooks={
  dj1:{title:'Discover Japan Vol. 1',level:'N4–N3',count:'10 cultural stories',image:'assets/book-dj1.jpg',color:'#ef554f',summary:'Festivals, art, nature and delicacies—read as culture first and a lesson second.',japanese:'<ruby>日本<rt>にほん</rt></ruby>の<ruby>夏<rt>なつ</rt></ruby>の<ruby>夜空<rt>よぞら</rt></ruby>には、<ruby>大<rt>おお</rt></ruby>きな<ruby>花火<rt>はなび</rt></ruby>が<ruby>咲<rt>さ</rt></ruby>きます。',translation:'Large fireworks bloom across Japan’s summer night sky.'},
  artisan:{title:'Artisan Japan',level:'N3–N2',count:'12 artisan profiles',image:'assets/book-artisan.jpg',color:'#f7ca49',summary:'Meet the people keeping Japanese craft alive through wood, metal, cloth, paper and patient practice.',japanese:'<ruby>職人<rt>しょくにん</rt></ruby>は、<ruby>長<rt>なが</rt></ruby>い<ruby>時間<rt>じかん</rt></ruby>をかけて<ruby>技<rt>わざ</rt></ruby>を<ruby>磨<rt>みが</rt></ruby>き、<ruby>伝統<rt>でんとう</rt></ruby>を<ruby>未来<rt>みらい</rt></ruby>へつなぎます。',translation:'Artisans refine their skills over many years and carry tradition into the future.'},
  dj2:{title:'Discover Japan Vol. 2',level:'N4–N2',count:'12 new journeys',image:'assets/book-dj2.jpg',color:'#72f06b',summary:'Continue through regional food, seasonal customs and the rituals hidden inside everyday Japanese life.',japanese:'<ruby>季節<rt>きせつ</rt></ruby>の<ruby>行事<rt>ぎょうじ</rt></ruby>には、<ruby>地域<rt>ちいき</rt></ruby>の<ruby>歴史<rt>れきし</rt></ruby>と<ruby>人々<rt>ひとびと</rt></ruby>の<ruby>願<rt>ねが</rt></ruby>いが<ruby>込<rt>こ</rt></ruby>められています。',translation:'Seasonal customs hold the history of each region and the wishes of its people.'}
};
const bookPreview=$('[data-book-preview]');
$$('[data-book-select]').forEach(button=>button.addEventListener('click',()=>{
  const data=landingBooks[button.dataset.bookSelect];if(!data||!bookPreview)return;
  $$('[data-book-select]').forEach(item=>{const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-selected',String(active));});
  $('[data-book-title]',bookPreview).textContent=data.title;$('[data-book-level]',bookPreview).textContent=data.level;$('[data-book-count]',bookPreview).textContent=data.count;$('[data-book-summary]',bookPreview).textContent=data.summary;
  const cover=$('[data-book-cover]',bookPreview);cover.src=data.image;cover.alt=`${data.title} book cover`;$('[data-book-japanese]',bookPreview).innerHTML=data.japanese;$('[data-book-translation-copy]',bookPreview).textContent=data.translation;$('.book-preview__cover',bookPreview).style.background=data.color;
}));
$('[data-book-furigana]',bookPreview)?.addEventListener('click',event=>{const active=event.currentTarget.classList.toggle('active');event.currentTarget.setAttribute('aria-pressed',String(active));$('[data-book-sample]',bookPreview).classList.toggle('hide-furigana',!active);});
$('[data-book-translation]',bookPreview)?.addEventListener('click',event=>{const active=event.currentTarget.classList.toggle('active');event.currentTarget.setAttribute('aria-pressed',String(active));$('[data-book-translation-copy]',bookPreview).hidden=!active;});
 $('[data-book-audio]',bookPreview)?.addEventListener('click',event=>{const active=event.currentTarget.classList.toggle('active');event.currentTarget.setAttribute('aria-pressed',String(active));event.currentTarget.firstChild.textContent=active?'Ⅱ ': '▶ ';$('[data-book-sample]',bookPreview).classList.toggle('playing',active);if(active)speakJapanese($('[data-book-japanese]',bookPreview).textContent);});

// The full Book + App reader keeps the same accessible controls as the hero demo.
const bookAppReader=$('.story-book-app__reader');
const bookAppFurigana=$('[data-book-app-furigana]',bookAppReader);
const bookAppTranslation=$('[data-book-app-translation]',bookAppReader);
const bookAppLanguage=$('[data-book-app-language]',bookAppReader);
const bookAppTranslations=$$('[data-book-app-translation-copy]',bookAppReader);
bookAppFurigana?.addEventListener('click',event=>{
  const active=event.currentTarget.getAttribute('aria-pressed')!=='true';
  event.currentTarget.setAttribute('aria-pressed',String(active));
  event.currentTarget.setAttribute('aria-label',active?'Hide furigana':'Show furigana');
  bookAppReader?.classList.toggle('hide-furigana',!active);
});
bookAppTranslation?.addEventListener('click',event=>{
  const active=event.currentTarget.getAttribute('aria-pressed')!=='true';
  event.currentTarget.setAttribute('aria-pressed',String(active));
  event.currentTarget.setAttribute('aria-label',active?'Hide translation':'Show translation');
  const language=bookAppLanguage?.dataset.lang||'en';
  bookAppTranslations.forEach(copy=>copy.hidden=!active||copy.dataset.lang!==language);
});
bookAppLanguage?.addEventListener('click',event=>{
  const button=event.currentTarget,next=button.dataset.lang==='en'?'zh':'en',visible=bookAppTranslation?.getAttribute('aria-pressed')==='true';
  button.dataset.lang=next;button.textContent=next==='zh'?'繁':'EN';button.setAttribute('aria-label',next==='en'?'Switch translation to Chinese':'Switch translation to English');bookAppTranslations.forEach(copy=>copy.hidden=!visible||copy.dataset.lang!==next);$$('[data-book-app-word-gloss]').forEach(gloss=>gloss.hidden=gloss.dataset.lang!==next);
});
// Upgrade the compact-reader labels into real controls and keep their display
// options independent from playback.
const installCompactReaderControls=({reader,toolSelector,furiganaAttr,translationAttr,translationCopies,languageButton,glosses=[]})=>{
  if(!reader)return;
  const tools=$(toolSelector,reader),labels=tools?[...tools.children].slice(0,2):[];
  const makeButton=(label,attribute,ariaLabel)=>{
    if(!label)return null;
    const button=document.createElement('button');
    button.type='button';button.textContent=label.textContent;button.setAttribute(attribute,'');
    button.setAttribute('aria-pressed','true');button.setAttribute('aria-label',ariaLabel);
    label.replaceWith(button);return button;
  };
  const furigana=makeButton(labels[0],furiganaAttr,'Hide furigana');
  const translation=makeButton(labels[1],translationAttr,'Hide translation');
  furigana?.addEventListener('click',event=>{
    const active=event.currentTarget.getAttribute('aria-pressed')!=='true';
    event.currentTarget.setAttribute('aria-pressed',String(active));
    event.currentTarget.setAttribute('aria-label',active?'Hide furigana':'Show furigana');
    reader.classList.toggle('hide-furigana',!active);
  });
  translation?.addEventListener('click',event=>{
    const active=event.currentTarget.getAttribute('aria-pressed')!=='true';
    event.currentTarget.setAttribute('aria-pressed',String(active));
    event.currentTarget.setAttribute('aria-label',active?'Hide translation':'Show translation');
    const language=languageButton?.dataset.lang||'en';
    translationCopies.forEach(copy=>copy.hidden=!active||copy.dataset.lang!==language);
  });
  languageButton?.addEventListener('click',event=>{
    const button=event.currentTarget,next=button.dataset.lang==='en'?'zh':'en',visible=translation?.getAttribute('aria-pressed')==='true';
    button.dataset.lang=next;button.textContent=next==='zh'?'繁':'EN';button.setAttribute('aria-label',next==='en'?'Switch translation to Chinese':'Switch translation to English');translationCopies.forEach(copy=>copy.hidden=!visible||copy.dataset.lang!==next);glosses.forEach(gloss=>gloss.hidden=gloss.dataset.lang!==next);
  });
};
const compactSnowReader=$('.story-book-moment__reader');
const compactSnowTranslations=$$(':scope > [data-reader-translation]',compactSnowReader);
const compactSnowTranslation=compactSnowTranslations.find(item=>item.dataset.lang==='en');
if(compactSnowTranslation)compactSnowTranslation.textContent=sourcePassages.shinto.english;
installCompactReaderControls({reader:compactSnowReader,toolSelector:'.story-book-moment__tools',furiganaAttr:'data-story-book-furigana',translationAttr:'data-story-book-translation',translationCopies:compactSnowTranslations,languageButton:$('[data-story-book-language]',compactSnowReader)});
const compactNewsReader=$('.story-news-reader');
const compactNewsTranslations=$$(':scope > [data-reader-translation]',compactNewsReader);
const compactNewsTranslation=compactNewsTranslations.find(item=>item.dataset.lang==='en');
if(compactNewsTranslation)compactNewsTranslation.textContent='Ōnosato has reached yokozuna, the highest rank in sumo. Attention is now focused on his performances in the ring.';
installCompactReaderControls({reader:compactNewsReader,toolSelector:'.story-news-reader__tools',furiganaAttr:'data-news-reader-furigana',translationAttr:'data-news-reader-translation',translationCopies:compactNewsTranslations,languageButton:$('[data-news-reader-language]',compactNewsReader),glosses:$$('[data-news-word-gloss]')});

// Compact hero sample: spoken Japanese plus word-by-word visual timing.
const storyHeroPlay=$('[data-story-hero-play]');
const storyHeroTokens=$$('[data-story-hero-karaoke]');
let storyHeroTimer=[],storyHeroPlaying=false;
const setStoryHeroPlayUi=playing=>{if(!storyHeroPlay)return;storyHeroPlay.setAttribute('aria-pressed',String(playing));storyHeroPlay.setAttribute('aria-label',playing?'Pause reading preview':'Play reading preview');storyHeroPlay.textContent=playing?'Ⅱ':'▶';};
const stopStoryHero=()=>{storyHeroTimer.forEach(window.clearTimeout);storyHeroTimer=[];storyHeroPlaying=false;storyHeroTokens.forEach(token=>token.classList.remove('speaking'));setStoryHeroPlayUi(false);};
storyHeroPlay?.addEventListener('click',()=>{
  if(storyHeroPlaying){stopStoryHero();return;}
  stopStoryHero();storyHeroPlaying=true;setStoryHeroPlayUi(true);
  const phrase='日本の夏には、花火が空いっぱいに広がります。';
  let elapsed=0;storyHeroTokens.forEach((token,index)=>{storyHeroTimer.push(window.setTimeout(()=>{storyHeroTokens.forEach(item=>item.classList.remove('speaking'));token.classList.add('speaking');if(index===storyHeroTokens.length-1)storyHeroTimer.push(window.setTimeout(stopStoryHero,620));},elapsed));elapsed+=index===3||index===5?430:360;});
  // The approved audio player below owns final playback; this keeps a visual fallback state.
});
$('[data-story-hero-frame-play]')?.addEventListener('click',()=>storyHeroPlay?.click());
$('[data-story-hero-furigana]')?.addEventListener('click',event=>{const active=event.currentTarget.getAttribute('aria-pressed')!=='true';event.currentTarget.setAttribute('aria-pressed',String(active));event.currentTarget.setAttribute('aria-label',active?'Hide furigana':'Show furigana');$('.story-reader-card')?.classList.toggle('hide-furigana',!active);});

// Reader previews share a lightweight visual fallback; approved audio overrides playback below.
const bindPreviewPlayer=(button,tokens)=>{
  if(!button||!tokens.length)return;
  let timer=0,index=0,playing=false;
  const stop=()=>{window.clearInterval(timer);tokens.forEach(token=>token.classList.remove('is-reading'));playing=false;button.setAttribute('aria-pressed','false');button.setAttribute('aria-label','Play reading preview');button.textContent='▶';};
  button.addEventListener('click',()=>{
    if(playing){stop();return;}
    playing=true;index=0;button.setAttribute('aria-pressed','true');button.setAttribute('aria-label','Pause reading preview');button.textContent='Ⅱ';
    const step=()=>{tokens.forEach(token=>token.classList.remove('is-reading'));if(index>=tokens.length){stop();return;}tokens[index++].classList.add('is-reading');};
    step();timer=window.setInterval(step,620);
  });
};
bindPreviewPlayer($('[data-story-book-play]'),$$('.story-path--book .story-book-karaoke-token'));
bindPreviewPlayer($('[data-news-reader-play]'),$$('.story-news-reader p ruby, .story-news-reader p mark'));
bindPreviewPlayer($('[data-book-app-play]'),$$('.story-book-app__reader-copy ruby, .story-book-app__reader-title'));

// Production narration uses one Nanami master per passage. Playback speed is applied
// in the UI, so all rates share the same source and word-highlight timeline.
const landingAudioBase='./audio/';
const landingAudioPlayers=[];
const stopLandingAudio=(except=null)=>landingAudioPlayers.forEach(player=>{if(player!==except)player.stop();});
const tokenWeight=token=>Math.max(1,(token.dataset.speech||token.textContent||'').replace(/[。、，,.!?！？\s]/g,'').length);
const createLandingAudioPlayer=({button,file,tokens,activeClass='is-reading',speedButton=null})=>{
  if(!button||!tokens.length)return null;
  const audio=new Audio(`${landingAudioBase}${file}`);
  audio.preload='none';audio.playbackRate=1;audio.preservesPitch=true;
  let playing=false,rate=1;
  const weights=tokens.map(tokenWeight),totalWeight=weights.reduce((sum,value)=>sum+value,0);
  const stops=[];let cursor=0;weights.forEach(weight=>{cursor+=weight;stops.push(cursor/totalWeight);});
  const clearHighlight=()=>tokens.forEach(token=>token.classList.remove(activeClass));
  const setButtonState=active=>{button.setAttribute('aria-pressed',String(active));button.setAttribute('aria-label',active?'Pause reading preview':'Play reading preview');const icon=button.querySelector('b');if(icon)icon.textContent=active?'⏸':'▶';else button.textContent=active?'Ⅱ':'▶';};
  const highlightAt=time=>{if(!Number.isFinite(audio.duration)||audio.duration<=0)return;const progress=Math.min(.9999,time/audio.duration);const index=Math.max(0,stops.findIndex(stop=>progress<stop));tokens.forEach((token,itemIndex)=>token.classList.toggle(activeClass,itemIndex===index));};
  const stop=(reset=true)=>{audio.pause();if(reset)audio.currentTime=0;playing=false;clearHighlight();setButtonState(false);};
  const play=async()=>{stopLandingAudio(api);audio.playbackRate=rate;playing=true;setButtonState(true);highlightAt(audio.currentTime);try{await audio.play();}catch(error){stop();button.setAttribute('aria-label','Narration is being prepared');}};
  const toggle=()=>{if(playing){stop(false);return;}play();};
  const api={audio,stop,play,toggle};landingAudioPlayers.push(api);
  button.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();toggle();},{capture:true});
  audio.addEventListener('timeupdate',()=>highlightAt(audio.currentTime));
  audio.addEventListener('ended',()=>stop());
  audio.addEventListener('pause',()=>{if(audio.ended)return;playing=false;clearHighlight();setButtonState(false);});
  if(speedButton)speedButton.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();const rates=[.8,1,1.2],next=(rates.indexOf(rate)+1)%rates.length;rate=rates[next];audio.playbackRate=rate;speedButton.textContent=`${rate}×`;},{capture:true});
  return api;
};

createLandingAudioPlayer({button:storyHeroPlay,file:'nanami-fireworks.mp3',tokens:storyHeroTokens,activeClass:'speaking'});
createLandingAudioPlayer({button:$('[data-hero-narrate]',heroReader),file:'nanami-fireworks.mp3',tokens:heroKaraokeTokens,activeClass:'speaking',speedButton:$('[data-hero-speed]',heroReader)});
createLandingAudioPlayer({button:$('[data-story-book-play]'),file:'nanami-snow-maiden.mp3',tokens:$$('.story-path--book .story-book-karaoke-token')});
createLandingAudioPlayer({button:$('[data-news-reader-play]'),file:'nanami-yokozuna.mp3',tokens:$$('.story-news-reader .story-news-karaoke-token')});
createLandingAudioPlayer({button:$('[data-book-app-play]'),file:'nanami-snow-maiden.mp3',tokens:$$('.story-book-app__reader-copy .story-book-app-karaoke-token')});

const vocabularyAudioFiles={nihon:'nanami-word-nihon.mp3','natsu-no-yoru':'nanami-word-natsu-no-yoru.mp3',sora:'nanami-word-sora.mp3',hanabi:'nanami-word-hanabi.mp3',hirogarimasu:'nanami-word-hirogarimasu.mp3',inori:'nanami-word-inori.mp3',yokozuna:'nanami-word-yokozuna.mp3'};
let activeVocabularyAudio=null;
const playVocabulary=element=>{
  const file=vocabularyAudioFiles[element.dataset.vocabAudio];if(!file)return;
  stopLandingAudio();if(activeVocabularyAudio)activeVocabularyAudio.pause();
  const audio=new Audio(`${landingAudioBase}${file}`);activeVocabularyAudio=audio;audio.preservesPitch=true;element.classList.add('speaking');
  const finish=()=>{element.classList.remove('speaking');if(activeVocabularyAudio===audio)activeVocabularyAudio=null;};
  audio.addEventListener('ended',finish,{once:true});audio.addEventListener('error',finish,{once:true});audio.play().catch(finish);
};
$$('[data-vocab-audio]').forEach(element=>{
  element.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();if(element.dataset.word){activeHeroToken=element;updateHeroWordDetail(element);}playVocabulary(element);},{capture:true});
  if(element.getAttribute('role')==='button')element.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();playVocabulary(element);}});
});

// The guided-chat response is a one-time in-view demonstration, not a looping fake input.
const guidedChatSection=$('.story-guided-chat');
if(guidedChatSection){
  const guidedChatResponse=$('[data-guided-chat-response]',guidedChatSection);
  const revealGuidedChat=()=>{
    guidedChatSection.classList.add('is-visible');
    if(!guidedChatResponse||guidedChatResponse.dataset.played)return;
    guidedChatResponse.dataset.played='true';
    const response='夏の花火はきれいですよ。';
    let index=0;
    guidedChatResponse.classList.add('is-typing');
    const typeNext=()=>{
      guidedChatResponse.textContent=response.slice(0,index+=1);
      if(index<response.length){window.setTimeout(typeNext,82);return;}
      guidedChatResponse.classList.remove('is-typing');
      guidedChatResponse.classList.add('is-complete');
    };
    window.setTimeout(typeNext,360);
  };
  if('IntersectionObserver' in window){
    const guidedChatObserver=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.isIntersecting)){revealGuidedChat();guidedChatObserver.disconnect();}
    },{threshold:.38});
    guidedChatObserver.observe(guidedChatSection);
  }else revealGuidedChat();
}

// Page-wide EN / Traditional Chinese interface switch. Reader language controls
// remain independently usable, but follow the page language when this switch runs.
const interfaceLanguageButton=$('[data-interface-language]');
if(interfaceLanguageButton){
  const landingZh=new Map(Object.entries({
    'Easy News':'簡易新聞','Books':'書籍','Guided Chat':'AI 對話','Shop':'商店','App':'應用程式','Find your level':'測出你的程度',
    'JAPANESE FOR REAL LIFE':'實用生活日語','Japanese you can':'你真正能用上的','actually use.':'日語。',
    'Read a story. Hear every sentence. Meet useful words in context. Then try them in a real conversation.':'讀一個故事，聽懂每一句，在情境中掌握實用詞彙，再把它們帶進真實對話。','Find your starting level':'找到適合你的起點',
    'TAP · LISTEN · UNDERSTAND':'點選 · 聆聽 · 理解','TRY THE READER':'試用閱讀器','A real page.':'真實頁面。','Help':'支援','when you need it.':'需要時即時出現。',
    'Furigana':'振假名','Translation':'翻譯','Text size':'文字大小','READ IT IN THE BOOK':'在書中閱讀',
    'START WHERE YOU ARE':'從適合你的地方開始','One goal.':'一個目標。','Three ways in.':'三條起點。','Not sure where to begin?':'不知道從哪裡開始？','Find your level in 3 minutes →':'3 分鐘測出你的程度 →',
    'LEVEL 1 · 初心者':'程度 1 · 初學者','LEVEL 2 · もっと読みたい':'程度 2 · 想讀更多','LEVEL 3 · 話してみたい':'程度 3 · 想開口說','I know some kana.':'我認得一些假名。','I want useful words.':'我想學實用詞彙。','EASY NEWS · STARTS WITH あ':'簡易新聞 · 從「あ」開始','breakfast':'早餐','TODAY · N5':'今日 · N5','Tap for meaning':'點擊查看意思',
    'Start with the kana you know. Meet useful words in short, real news.':'從你認得的假名開始，在簡短的真實新聞中學習實用詞彙。','Explore Easy News':'瀏覽簡易新聞',
    'I can read a little.':'我已經能讀一點。','I want to go deeper.':'我想讀得更深入。','BOOK + READER':'書籍 + 閱讀器','OPEN A REAL PAGE':'打開真實書頁','Hear and understand Japanese from a real page.':'從真實書頁聆聽並理解日語。','Find your book':'找到適合你的書',
    'I understand Japanese.':'我看得懂日語。','I want to speak':'我想說得','more naturally.':'更自然。','That sounds natural.':'這樣說很自然。','Finding a natural reply…':'正在尋找自然的回覆⋯',
    'Boombear is ready to help.':'Boombear 已準備好幫助你。','Try one reply. Get one useful improvement, then keep the conversation going.':'試著回覆一句，獲得一個實用改進，再繼續聊下去。','Start a guided chat':'開始 AI 對話',
    'EASY NEWS · JAPAN TODAY':'簡易新聞 · 今日日本','Today’s Japan,':'今日日本，','in readable Japanese.':'用讀得懂的日語呈現。','FEATURED · N4':'精選 · N4','READ · LISTEN · UNDERSTAND':'閱讀 · 聆聽 · 理解',
    'Meet the newest wrestler to reach sumo’s highest rank.':'認識最新晉升相撲最高級別的力士。','Explore this story in Easy News':'前往簡易新聞閱讀這篇故事','Click to hear this word. Meet it again in News and Guided Chat.':'點擊聆聽這個詞，並在新聞與 AI 對話中再次遇見它。',
    'BOOK + APP READER':'書籍 + 應用程式閱讀器','Read the page.':'閱讀書頁。','Make the Japanese yours.':'把日語化為自己的語言。','Read in print, then use the app to hear, understand and practise the Japanese.':'先閱讀紙本，再用應用程式聆聽、理解並練習日語。',
    'READ IN THE BOOK':'在書中閱讀','MAKE IT YOURS':'學以致用','READING WITH KOKO':'和 Koko 一起閱讀','Click to hear this word':'點擊聆聽這個詞','Read naturally':'自然閱讀','Understand more':'深入理解','Make it yours':'學以致用',
    'Take in the story, photography and cultural details on a real page.':'從真實書頁感受故事、攝影與文化細節。','Tap a phrase for furigana, meaning and audio.':'點選詞句，查看振假名、意思並聆聽發音。','Practise a phrase, then bring it into guided chat when you are ready.':'練習一句表達，準備好後把它帶進 AI 對話。','Explore the book and reader':'瀏覽書籍與閱讀器',
    'Say it your way.':'用你的方式說。','Make it sound':'讓表達更','natural.':'自然。','Start with what you know.':'從你會的開始。','Use a phrase from your reading—or simply say what you mean.':'使用閱讀中學到的句子，或直接說出你想表達的意思。',
    'Keep the conversation going.':'讓對話繼續。','Boombear gives one clear, useful improvement without stopping your flow.':'Boombear 會給你一個清楚實用的改進，不打斷對話節奏。','Take a more natural phrase with you.':'帶走一句更自然的表達。','Practise the version you want to use again in real life.':'練習你想在現實生活中再次使用的說法。',
    'GUIDED CHAT':'AI 對話','● LIVE PRACTICE':'● 即時練習','FROM YOUR READING':'來自你的閱讀','YOU':'你','For plans, try 〜に行きたいです.':'談論計畫時，可以試試「〜に行きたいです」。','よ adds a friendly, sharing tone.':'「よ」帶有親切、分享資訊的語氣。','Boombear is your guide':'Boombear 是你的引導夥伴','Try a reply. I’ll help you make it sound like you.':'試著回覆，我會幫你說得更自然、更像你。',
    'YOUR BOOK IS THE KEY':'你的書就是鑰匙','Buy a book.':'購買一本書。','Unlock its full Japanese experience.':'解鎖完整的日語學習體驗。','Redeem the code included with your book to access every article from that title in the app—with narration, translation and the interactive reader.':'兌換書中附帶的代碼，即可在應用程式中閱讀該書全部文章，並使用朗讀、翻譯與互動閱讀器。','Scan a QR code in the book to jump straight to its matching interactive article.':'掃描書中的 QR Code，即可直接開啟對應的互動文章。',
    'FULL DIGITAL READER ACCESS':'完整數位閱讀權限','Read every article':'閱讀書中每一篇','from your book.':'文章。','Furigana, narration and translation help when you need them.':'需要時可使用振假名、朗讀與翻譯。','Choose your book':'選擇你的書','WHAT YOUR BOOK UNLOCKS':'你的書可解鎖',
    'Full digital reader access':'完整數位閱讀權限','Read every article from your book with furigana, narration and translation.':'使用振假名、朗讀與翻譯，閱讀書中每一篇文章。','Chapter-linked guided chat':'章節連動 AI 對話','Practise conversation topics connected to the chapters included in your book.':'練習與書中章節相關的對話主題。','Free Easy News':'免費簡易新聞','Keep reading current, level-friendly Japanese—free for everyone.':'持續閱讀符合程度的最新日語新聞，所有人都能免費使用。','Redeem once per book for one Kokomonster account. Book-content access continues while the product remains available.':'每本書可供一個 Kokomonster 帳號兌換一次；產品供應期間可持續存取書籍內容。',
    'Japanese learning that begins with a story and stays with you in real life.':'從一則故事開始，讓日語走進真實生活。','Download the app':'下載應用程式','EXPLORE':'探索','GET STARTED':'開始學習','HELP':'幫助','Shop books':'選購書籍','Contact us':'聯絡我們','How it works':'使用方式','Terms of Use':'使用條款','Privacy Policy':'隱私權政策'
  }));
  const textOriginals=new WeakMap();
  const attributeOriginals=new WeakMap();
  const translateTextNodes=language=>{
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    let node;
    while((node=walker.nextNode())){
      if(['SCRIPT','STYLE','NOSCRIPT'].includes(node.parentElement?.tagName))continue;
      if(!textOriginals.has(node))textOriginals.set(node,node.nodeValue);
      const original=textOriginals.get(node),key=original.trim(),replacement=language==='zh'?landingZh.get(key):key;
      if(replacement===undefined)continue;
      node.nodeValue=original.replace(key,replacement);
    }
  };
  const ariaZh=new Map(Object.entries({'Main navigation':'主導覽','Open menu':'開啟選單','Close menu':'關閉選單','Kokomonster home':'Kokomonster 首頁','Kokomonster companions and reading preview':'Kokomonster 角色與閱讀預覽','Reading controls':'閱讀控制','Reading preview controls':'閱讀預覽控制','More Easy News stories':'更多簡易新聞','App reader preview':'應用程式閱讀預覽','How book reading flows into the app':'書籍閱讀如何延伸至應用程式','What Guided Chat helps with':'AI 對話如何幫助你','Guided Chat conversation preview':'AI 對話預覽','What your book unlocks':'你的書可解鎖內容','Legal':'法律資訊','Explore':'探索','Get started':'開始學習','Help':'幫助'}));
  const translateAttributes=language=>$$('[aria-label]').forEach(element=>{
    if(!attributeOriginals.has(element))attributeOriginals.set(element,element.getAttribute('aria-label'));
    const original=attributeOriginals.get(element),translated=ariaZh.get(original);
    if(translated)element.setAttribute('aria-label',language==='zh'?translated:original);
  });
  const syncReaderLanguages=language=>{
    const compactReaders=[['.story-reader-card','[data-story-hero-language]','[data-story-hero-translation-copy]','[data-story-hero-translation]'],['.story-book-moment__reader','[data-story-book-language]','[data-reader-translation]','[data-story-book-translation]'],['.story-news-reader','[data-news-reader-language]','[data-reader-translation]','[data-news-reader-translation]'],['.story-book-app__reader','[data-book-app-language]','[data-book-app-translation-copy]','[data-book-app-translation]']];
    compactReaders.forEach(([readerSelector,buttonSelector,copySelector,toggleSelector])=>{const reader=$(readerSelector),button=$(buttonSelector,reader);if(!reader||!button)return;button.dataset.lang=language;button.textContent=language==='zh'?'繁':'EN';button.setAttribute('aria-label',language==='en'?'Switch translation to Chinese':'Switch translation to English');const visible=$(toggleSelector,reader)?.getAttribute('aria-pressed')!=='false';$$(copySelector,reader).forEach(copy=>{const copyLanguage=copy.dataset.lang||copy.dataset.storyHeroTranslationCopy;copy.hidden=!visible||copyLanguage!==language;});});
    if(heroLanguageToggle){heroLanguage=language;heroLanguageToggle.dataset.heroLang=language;heroLanguageToggle.setAttribute('aria-label',language==='en'?'Switch translation to Chinese':'Switch translation to English');heroTranslations.forEach(copy=>copy.hidden=!heroTranslationVisible||copy.dataset.heroTranslation!==language);updateHeroWordDetail(activeHeroToken);}
    $$('[data-book-app-word-gloss],[data-news-word-gloss]').forEach(gloss=>gloss.hidden=gloss.dataset.lang!==language);
  };
  let interfaceLanguage='en';
  try{const saved=window.localStorage.getItem('kkm-language');if(saved==='en'||saved==='zh')interfaceLanguage=saved;}catch(error){}
  const applyInterfaceLanguage=()=>{
    document.documentElement.lang=interfaceLanguage==='zh'?'zh-Hant':'en';
    document.title=interfaceLanguage==='zh'?'Kokomonster｜從真實書籍開始學日語':'Kokomonster | Japanese Learning That Starts With a Real Book';
    $('meta[name="description"]')?.setAttribute('content',interfaceLanguage==='zh'?'從真實故事、書籍與新聞開始，透過朗讀、翻譯和引導對話，把日語帶進生活。':'Learn practical Japanese through real books, readable news, narration, translation and guided conversation.');
    translateTextNodes(interfaceLanguage);translateAttributes(interfaceLanguage);syncReaderLanguages(interfaceLanguage);
    interfaceLanguageButton.textContent=interfaceLanguage==='zh'?'EN':'繁';
    interfaceLanguageButton.setAttribute('aria-label',interfaceLanguage==='zh'?'語言：繁體中文。切換至英文':'Language: English. Switch to Traditional Chinese');
    try{window.localStorage.setItem('kkm-language',interfaceLanguage);}catch(error){}
  };
  interfaceLanguageButton.addEventListener('click',()=>{interfaceLanguage=interfaceLanguage==='en'?'zh':'en';applyInterfaceLanguage();});
  applyInterfaceLanguage();
}
