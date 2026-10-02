const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];

$('.menu-button')?.addEventListener('click',()=>document.body.classList.toggle('menu-open'));
$$('.main-nav a').forEach(link=>link.addEventListener('click',()=>document.body.classList.remove('menu-open')));

const pathContent={
  today:{title:'Read one story from today’s Japan',copy:'Choose your level, listen once, then save three expressions for a five-minute chat with ご飯子.',meta:['7–10 minutes','Furigana and translation optional','Moves directly into practice'],href:'news.html',cta:'Open News',image:'assets/koko-newsroom.png'},
  culture:{title:'Enter a story through a subject you love',copy:'Start with a chapter about art, food or craft, then use its language in an interactive reading session.',meta:['Print + digital together','Narration and cultural notes','N4 through N2+'],href:'story.html',cta:'Browse Stories',image:'assets/koko-stories.png'},
  speak:{title:'Have one useful, low-pressure conversation',copy:'Pick a theme, borrow a starter when you need one and receive concise corrections without breaking the flow.',meta:['Voice or text','Level-aware support','Saved words included'],href:'chat.html',cta:'Start Chat',image:'assets/koko-chat-world.png'}
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
$$('[data-save]').forEach(button=>button.addEventListener('click',()=>{
  const saved=button.classList.toggle('saved');button.textContent=saved?'✓ Saved':'＋ Save expressions';
  const count=$('[data-saved-count]');if(count)count.textContent=Number(count.textContent)+(saved?1:-1);
}));

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
  window.setTimeout(()=>{const reply=document.createElement('article');reply.className='message character-message';reply.innerHTML=`<img src="assets/koko-gohanko.png" alt=""><div><p>いいね！「${value.replace(/[<>]/g,'')}」について、もう少し教えて。どうしてそう思ったの？</p><div class="message-tools"><button>▶ Listen</button><button>☆ Save expression</button></div></div>`;conversation.appendChild(reply);conversation.scrollTop=conversation.scrollHeight;},650);
};
$('[data-chat-send]')?.addEventListener('click',sendChat);chatInput?.addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendChat();}});

const miniNews={
  n5:{title:'東京で桜が咲きました',copy:'<button data-vocab="さくら">桜</button>が 東京で 咲きました。ことしは いつもの年より 早いです。'},
  n4:{title:'東京で桜の開花が発表されました',copy:'東京で <button data-vocab="かいか">桜の開花</button>が 発表されました。今年は 平年より 早く、週末には 見ごろを迎えるそうです。'}
};
const bindMiniVocab=()=>{$$('[data-mini-news] [data-vocab]').forEach(button=>button.addEventListener('click',()=>{const saved=button.classList.toggle('saved');const count=$('[data-mini-saved]');if(count)count.textContent=$$('[data-mini-news] [data-vocab].saved').length;const carry=$('[data-carry-word]');if(carry){carry.hidden=!saved;const word=$('b',carry);if(word)word.textContent=button.textContent.trim();}}));};
$$('[data-mini-level]').forEach(button=>button.addEventListener('click',()=>{$$('[data-mini-level]').forEach(item=>item.classList.toggle('active',item===button));const content=miniNews[button.dataset.miniLevel];$('[data-mini-news-title]').textContent=content.title;$('[data-mini-news-copy]').innerHTML=content.copy;$('[data-mini-saved]').textContent='0';bindMiniVocab();}));
bindMiniVocab();
$('[data-mini-listen]')?.addEventListener('click',event=>{const playing=event.currentTarget.classList.toggle('active');event.currentTarget.innerHTML=playing?'<span>Ⅱ</span> Listening…':'<span>▶</span> Listen';});

$$('[data-mini-reader-toggle]').forEach(button=>button.addEventListener('click',()=>{button.classList.toggle('active');const reader=$('[data-mini-reader]');if(button.dataset.miniReaderToggle==='furigana')reader.classList.toggle('hide-furigana',!button.classList.contains('active'));if(button.dataset.miniReaderToggle==='translation')$('.mini-translation',reader).hidden=!button.classList.contains('active');}));
$('[data-mini-reader-play]')?.addEventListener('click',event=>{const playing=event.currentTarget.classList.toggle('active');event.currentTarget.innerHTML=playing?'<span>Ⅱ</span> Reading…':'<span>▶</span> Read aloud';});

const miniFeedback={
  '花火を見たいです。':'いいですね！ニュースと物語で覚えた「花火」を会話でも使えました。「友達と花火を見に行きたいです」と広げることもできます。',
  '映画を見たいです。':'自然で分かりやすいです。「週末は映画を見に行きたいです」と言うと、予定がさらに伝わります。',
  '友達と山に行きたいです。':'いいですね。「友達と山へハイキングに行きたいです」も自然な表現です。',
  '家で休みたいです。':'とても自然です。理由を加えて「疲れたので、家でゆっくり休みたいです」とも言えます。'
};
$$('[data-mini-reply]').forEach(button=>button.addEventListener('click',()=>{$$('[data-mini-reply]').forEach(item=>item.classList.toggle('selected',item===button));const result=$('[data-mini-chat-result]');result.hidden=false;result.innerHTML=`<div class="user">${button.dataset.miniReply}</div><div class="feedback"><b>GENTLE FEEDBACK</b>${miniFeedback[button.dataset.miniReply]}</div>`;}));

// Landing hero: the reading controls are the product demonstration.
const heroReader=$('[data-hero-reader]');
const heroControls=$$('[data-hero-control]',heroReader||document);
const heroTranslations=$$('[data-hero-translation]',heroReader||document);
const heroTokens=$$('[data-word]',heroReader||document);
const heroKaraokeTokens=$$('[data-karaoke]',heroReader||document);
let heroNarrationFallbacks=[],heroNarrationIndex=0,heroNarrationRun=0,heroIsNarrating=false,heroSpeed=1,heroTextSize=0,heroLanguage='zh',heroTranslationVisible=true,activeHeroToken=heroTokens.find(token=>token.dataset.word==='花火')||null,preferredJapaneseVoice=null;
const selectJapaneseVoice=()=>{
  if(!('speechSynthesis' in window))return;
  const voices=window.speechSynthesis.getVoices().filter(voice=>voice.lang.toLowerCase().startsWith('ja'));
  const preferredNames=['O-ren','Kyoko','Siri','Nanami','Haruka','Google 日本語'];
  preferredJapaneseVoice=preferredNames.map(name=>voices.find(voice=>voice.name.includes(name))).find(Boolean)||voices.find(voice=>voice.localService)||voices[0]||null;
};
selectJapaneseVoice();if('speechSynthesis' in window)window.speechSynthesis.addEventListener?.('voiceschanged',selectJapaneseVoice);
const speakJapanese=(text,handlers={})=>{
  if(!('speechSynthesis' in window))return;
  window.speechSynthesis.cancel();
  const utterance=new SpeechSynthesisUtterance(text);utterance.lang='ja-JP';utterance.rate=heroSpeed;utterance.pitch=1.04;if(preferredJapaneseVoice)utterance.voice=preferredJapaneseVoice;if(handlers.boundary)utterance.onboundary=handlers.boundary;if(handlers.end)utterance.onend=handlers.end;if(handlers.error)utterance.onerror=handlers.error;window.speechSynthesis.speak(utterance);return utterance;
};
heroControls.forEach(button=>button.addEventListener('click',()=>{
  heroReader?.classList.add('has-interacted');
  if(button.dataset.heroControl==='furigana'){
    const active=button.classList.toggle('active');button.setAttribute('aria-pressed',String(active));heroReader?.classList.toggle('hide-furigana',!active);
  }
}));
const updateHeroWordDetail=token=>{const detail=$('[data-hero-word-detail]',heroReader);if(!detail||!token)return;detail.classList.add('has-word');detail.innerHTML=`<span>${token.dataset.word} · ${token.dataset.reading}</span><b>${heroLanguage==='zh'?token.dataset.meaningZh:token.dataset.meaning}</b>`;};
$('[data-hero-translation-toggle]',heroReader)?.addEventListener('click',event=>{
  heroReader?.classList.add('has-interacted');heroTranslationVisible=!heroTranslationVisible;const button=event.currentTarget;button.setAttribute('aria-pressed',String(heroTranslationVisible));button.setAttribute('aria-label',heroTranslationVisible?'Hide translation':'Show translation');$('[data-hero-translation-control]',heroReader)?.classList.toggle('active',heroTranslationVisible);heroTranslations.forEach(item=>item.hidden=!heroTranslationVisible||item.dataset.heroTranslation!==heroLanguage);
});
$('[data-hero-language-toggle]',heroReader)?.addEventListener('click',event=>{
  heroReader?.classList.add('has-interacted');heroLanguage=heroLanguage==='zh'?'en':'zh';const button=event.currentTarget;button.dataset.heroLang=heroLanguage;button.setAttribute('aria-label',`Switch translation to ${heroLanguage==='zh'?'English':'Traditional Chinese'}`);heroTranslations.forEach(item=>item.hidden=!heroTranslationVisible||item.dataset.heroTranslation!==heroLanguage);updateHeroWordDetail(activeHeroToken);
});
$('[data-hero-size]',heroReader)?.addEventListener('click',event=>{
  heroReader?.classList.add('has-interacted');heroTextSize=heroTextSize===0?1:heroTextSize===1?-1:0;heroReader.classList.toggle('text-large',heroTextSize===1);heroReader.classList.toggle('text-small',heroTextSize===-1);event.currentTarget.querySelector('b').textContent=heroTextSize===1?'A+':heroTextSize===-1?'A−':'Aa';
});
const clearHeroNarrationFallbacks=()=>{heroNarrationFallbacks.forEach(window.clearTimeout);heroNarrationFallbacks=[];};
const showHeroKaraoke=index=>{heroNarrationIndex=Math.max(0,index);heroKaraokeTokens.forEach((item,itemIndex)=>item.classList.toggle('speaking',itemIndex===index));};
const setHeroNarrationUi=playing=>{const button=$('[data-hero-narrate]',heroReader);if(!button)return;button.classList.toggle('active',playing);button.setAttribute('aria-pressed',String(playing));button.querySelector('b').textContent=playing?'⏸':'▶';};
const stopHeroNarration=(cancelSpeech=true)=>{heroNarrationRun+=1;heroIsNarrating=false;clearHeroNarrationFallbacks();heroKaraokeTokens.forEach(item=>item.classList.remove('speaking'));setHeroNarrationUi(false);if(cancelSpeech&&'speechSynthesis' in window)window.speechSynthesis.cancel();};
const startHeroNarration=(startIndex=0)=>{
  if(!heroKaraokeTokens.length)return;heroNarrationRun+=1;const run=heroNarrationRun;clearHeroNarrationFallbacks();if('speechSynthesis' in window)window.speechSynthesis.cancel();heroIsNarrating=true;setHeroNarrationUi(true);showHeroKaraoke(startIndex);
  const segments=heroKaraokeTokens.slice(startIndex).map((item,index)=>({index:startIndex+index,text:item.dataset.speech||item.textContent.trim()}));let cursor=0;const offsets=segments.map(segment=>{const offset=cursor;cursor+=segment.text.length;return {...segment,offset};});const speechText=segments.map(segment=>segment.text).join('');let boundarySeen=false;
  let elapsed=0;segments.forEach(segment=>{heroNarrationFallbacks.push(window.setTimeout(()=>{if(run===heroNarrationRun&&!boundarySeen)showHeroKaraoke(segment.index);},elapsed));elapsed+=Math.max(240,segment.text.length*145)/heroSpeed;});
  const finish=()=>{if(run!==heroNarrationRun)return;heroIsNarrating=false;clearHeroNarrationFallbacks();window.setTimeout(()=>{if(run===heroNarrationRun){heroKaraokeTokens.forEach(item=>item.classList.remove('speaking'));setHeroNarrationUi(false);}},220);};
  const utterance=speakJapanese(speechText,{boundary:event=>{if(run!==heroNarrationRun)return;if(!boundarySeen){boundarySeen=true;clearHeroNarrationFallbacks();}const localIndex=Math.max(0,event.charIndex||0);const segment=[...offsets].reverse().find(item=>item.offset<=localIndex)||offsets[0];if(segment)showHeroKaraoke(segment.index);},end:finish,error:finish});if(!utterance)heroNarrationFallbacks.push(window.setTimeout(finish,elapsed+250));
};
$('[data-hero-speed]',heroReader)?.addEventListener('click',event=>{heroReader?.classList.add('has-interacted');const resumeAt=heroNarrationIndex,wasPlaying=heroIsNarrating;heroSpeed=heroSpeed===.75?1:heroSpeed===1?1.25:.75;event.currentTarget.textContent=`${heroSpeed}×`;if(wasPlaying)startHeroNarration(resumeAt);});
heroTokens.forEach(token=>token.addEventListener('click',()=>{
  heroReader?.classList.add('has-interacted');stopHeroNarration();heroTokens.forEach(item=>item.classList.toggle('speaking',item===token));
  activeHeroToken=token;updateHeroWordDetail(token);
  speakJapanese(token.dataset.word);window.setTimeout(()=>token.classList.remove('speaking'),Math.round(900/heroSpeed));
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
$('[data-book-audio]',bookPreview)?.addEventListener('click',event=>{const active=event.currentTarget.classList.toggle('active');event.currentTarget.setAttribute('aria-pressed',String(active));event.currentTarget.firstChild.textContent=active?'Ⅱ ': '▶ ';$('[data-book-sample]',bookPreview).classList.toggle('playing',active);if(active)speakJapanese($('[data-book-japanese]',bookPreview).textContent);else if('speechSynthesis' in window)window.speechSynthesis.cancel();});

// Compact hero sample: spoken Japanese plus word-by-word visual timing.
const storyHeroPlay=$('[data-story-hero-play]');
const storyHeroTokens=$$('[data-story-hero-karaoke]');
let storyHeroTimer=[],storyHeroPlaying=false;
const setStoryHeroPlayUi=playing=>{if(!storyHeroPlay)return;storyHeroPlay.setAttribute('aria-pressed',String(playing));$('strong',storyHeroPlay).textContent=playing?'Playing sentence':'Listen to this sentence';$('i',storyHeroPlay).textContent=playing?'Ⅱ':'▶';};
const stopStoryHero=()=>{storyHeroTimer.forEach(window.clearTimeout);storyHeroTimer=[];storyHeroPlaying=false;storyHeroTokens.forEach(token=>token.classList.remove('speaking'));setStoryHeroPlayUi(false);if('speechSynthesis'in window)window.speechSynthesis.cancel();};
storyHeroPlay?.addEventListener('click',()=>{
  if(storyHeroPlaying){stopStoryHero();return;}
  stopStoryHero();storyHeroPlaying=true;setStoryHeroPlayUi(true);
  const phrase='日本の夏には、花火が空いっぱいに広がります。';
  let elapsed=0;storyHeroTokens.forEach((token,index)=>{storyHeroTimer.push(window.setTimeout(()=>{storyHeroTokens.forEach(item=>item.classList.remove('speaking'));token.classList.add('speaking');if(index===storyHeroTokens.length-1)storyHeroTimer.push(window.setTimeout(stopStoryHero,620));},elapsed));elapsed+=index===3||index===5?430:360;});
  if('speechSynthesis'in window){const utterance=new SpeechSynthesisUtterance(phrase);utterance.lang='ja-JP';utterance.rate=1;utterance.pitch=1.03;if(preferredJapaneseVoice)utterance.voice=preferredJapaneseVoice;utterance.onend=()=>window.setTimeout(stopStoryHero,180);utterance.onerror=stopStoryHero;window.speechSynthesis.speak(utterance);}
});
$('[data-story-hero-frame-play]')?.addEventListener('click',()=>storyHeroPlay?.click());
$('[data-story-hero-furigana]')?.addEventListener('click',event=>{const active=event.currentTarget.getAttribute('aria-pressed')!=='true';event.currentTarget.setAttribute('aria-pressed',String(active));event.currentTarget.setAttribute('aria-label',active?'Hide furigana':'Show furigana');$('.story-reader-card')?.classList.toggle('hide-furigana',!active);});
$('[data-story-hero-translation]')?.addEventListener('click',event=>{const next=event.currentTarget.dataset.language==='en'?'zh':'en';event.currentTarget.dataset.language=next;event.currentTarget.textContent=next==='en'?'EN':'繁';event.currentTarget.setAttribute('aria-label',next==='en'?'Switch translation to Traditional Chinese':'Switch translation to English');$$('[data-story-hero-translation-copy]').forEach(copy=>{copy.hidden=copy.dataset.storyHeroTranslationCopy!==next;});});

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
