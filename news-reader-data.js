(()=>{
  const root='/content/news/';
  const cache='v=47';
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const assetPath=(value,prefix)=>value?.replace(/^(\.\.\/)+/,prefix)||'';
  const articleId=()=>{
    const query=new URLSearchParams(location.search).get('story');
    const path=location.pathname.match(/-(\d+)\/?$/)?.[1];
    return Number(query||path||document.body.dataset.storyId||7648);
  };
  const rubyText=(text,vocabulary)=>{
    const terms=[...vocabulary].sort((a,b)=>b.surface.length-a.surface.length);
    let output='',index=0;
    while(index<text.length){
      const match=terms.find(item=>text.startsWith(item.surface,index));
      if(match){output+=`<mark data-word="${esc(match.surface)}"><ruby>${esc(match.surface)}<rt>${esc(match.reading)}</rt></ruby></mark>`;index+=match.surface.length;}
      else{output+=esc(text[index]);index+=1;}
    }
    return output;
  };
  const paragraphText=(text,tokens,vocabulary,sentenceIndex)=>{
    const vocab=new Map(vocabulary.map(item=>[item.surface,item]));
    const terms=[...vocabulary].sort((a,b)=>b.surface.length-a.surface.length);
    const renderToken=item=>{
      const exact=vocab.get(item.text);
      if(exact)return `<mark data-word="${esc(exact.surface)}"><ruby>${esc(exact.surface)}<rt>${esc(exact.reading)}</rt></ruby></mark>`;
      const contained=terms.find(term=>{
        const position=item.text.indexOf(term.surface);if(position<0)return false;
        const surrounding=item.text.slice(0,position)+item.text.slice(position+term.surface.length);
        return /^[ぁ-ゖー]*$/.test(surrounding);
      });
      if(contained){
        const position=item.text.indexOf(contained.surface);const before=item.text.slice(0,position);const after=item.text.slice(position+contained.surface.length);
        return `${esc(before)}<mark data-word="${esc(contained.surface)}"><ruby>${esc(contained.surface)}<rt>${esc(contained.reading)}</rt></ruby></mark>${esc(after)}`;
      }
      return item.showRuby&&item.reading?`<ruby>${esc(item.text)}<rt>${esc(item.reading)}</rt></ruby>`:esc(item.text);
    };
    let output='',cursor=0;
    tokens.forEach(item=>{
      const position=text.indexOf(item.text,cursor);if(position<0)return;
      output+=esc(text.slice(cursor,position));
      const start=Math.max(0,Number(item.offsetMs)||0);const end=start+Math.max(1,Number(item.durationMs)||1);
      output+=`<span class="reader-paragraph-token" data-paragraph-token data-sentence-index="${sentenceIndex}" data-token-start="${start}" data-token-end="${end}">${renderToken(item)}</span>`;
      cursor=position+item.text.length;
    });
    return output+esc(text.slice(cursor));
  };
  const tokenPanel=(tokens,vocabulary,audioFile,sentenceIndex)=>{
    const vocab=new Map(vocabulary.map(item=>[item.surface,item]));
    return `<div class="reader-word-mode" lang="ja" data-sentence-index="${sentenceIndex}" hidden>${tokens.map(item=>{
      const word=vocab.get(item.text);const reading=item.reading||word?.reading||'';const annotated=item.showRuby&&reading;
      const display=annotated?`<ruby>${esc(item.text)}<rt>${esc(reading)}</rt></ruby>`:esc(item.text);
      const glossEn=item.en||word?.en||'see sentence translation';const glossZh=item.zhHant||word?.zhHant||'參閱句子翻譯';
      const start=Math.max(0,Number(item.offsetMs)||0);const end=start+Math.max(1,Number(item.durationMs)||1);
      return `<button type="button" class="reader-token" data-token-speech="${esc(word?.speechJa||reading||item.text)}" data-token-audio="${esc(audioFile)}" data-token-start="${start}" data-token-end="${end}" data-sentence-index="${sentenceIndex}" aria-label="Play ${esc(item.text)}"><b>${display}</b><i>${esc(item.romaji||'')}</i><em data-en="${esc(glossEn)}" data-zh="${esc(glossZh)}">${esc(glossEn)}</em></button>`;
    }).join('')}</div>`;
  };
  const load=async()=>{
    const manifest=await fetch(`${root}manifest.json?${cache}`).then(response=>{if(!response.ok)throw new Error(`Manifest ${response.status}`);return response.json();});
    const entry=manifest.articles.find(item=>Number(item.id)===articleId())||manifest.articles[0];
    const article=await fetch(`${root}${entry.dataFile}?${cache}`).then(response=>{if(!response.ok)throw new Error(`Article ${response.status}`);return response.json();});
    document.body.dataset.storyId=String(article.id);
    document.title=`${article.title.ja} — Kokomonster Easy News`;
    const hero=document.querySelector('.reader-hero .news-shell');
    if(hero)hero.innerHTML=`<a class="reader-back" href="/news.html">← Back to Easy News</a><div class="reader-hero__meta"><span>${esc(article.category.key.toUpperCase())}</span><span>${esc(article.level)}</span><time>${esc(new Date(`${article.date}T00:00:00`).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}).toUpperCase())}</time></div><h1 lang="ja">${esc(article.title.ja)}</h1><p data-reader-title-en>${esc(article.title.en)}</p><p data-reader-title-zh lang="zh-Hant" hidden>${esc(article.title.zhHant)}</p><figure><img src="${esc(assetPath(article.cover.file,''))}" alt="Kokomonster illustrated cover for ${esc(article.title.en)}"></figure>`;
    const toolbar=document.querySelector('.reader-toolbar>div:first-child strong');
    if(toolbar)toolbar.textContent=`${article.readingMinutes} min · ${article.keywordCount} keywords`;
    const body=document.querySelector('[data-reader-article]');
    if(body)body.innerHTML=article.sentences.map((sentence,index)=>{
      const image=(article.inlineImages||[]).find(item=>item.afterSentence===index+1);
      const audioFile=assetPath(sentence.audio.file,'content/news/');
      return `<section><p class="reader-japanese" lang="ja" data-play-sentence role="button" tabindex="0" aria-label="Play from this paragraph"><span data-karaoke data-sentence-index="${index}" data-audio="${esc(audioFile)}">${paragraphText(sentence.ja,sentence.tokens||[],article.vocabulary,index)}</span></p>${tokenPanel(sentence.tokens||[],article.vocabulary,audioFile,index)}<p class="reader-translation" data-translation-en>${esc(sentence.en)}</p><p class="reader-translation" data-translation-zh lang="zh-Hant" hidden>${esc(sentence.zhHant)}</p></section>${image?`<figure class="reader-inline-image${image.crop?` reader-inline-image--${esc(image.crop)}`:''}"><img src="${esc(assetPath(image.file,''))}" alt="${esc(image.alt)}" loading="lazy"></figure>`:''}`;
    }).join('');
    const keywordList=document.querySelector('.reader-keyword-list');
    if(keywordList)keywordList.innerHTML=article.vocabulary.map(item=>`<article class="reader-keyword" data-keyword><button class="reader-keyword__play" type="button" data-keyword-play data-audio="${esc(assetPath(item.audio.file,'content/news/'))}" aria-label="Play ${esc(item.surface)}"><span class="play-glyph" aria-hidden="true"></span></button><div><b lang="ja">${esc(item.surface)}</b><i>${esc(item.reading)}</i><strong data-en="${esc(item.en)}" data-zh="${esc(item.zhHant)}">${esc(item.en)}</strong></div><button class="reader-keyword__save" type="button" data-keyword-save aria-pressed="false" aria-label="Save ${esc(item.surface)}">＋</button></article>`).join('');
    const practice=article.vocabulary[0];
    const chat=document.querySelector('.reader-chat-card__dialog');
    if(chat&&practice)chat.innerHTML=`<p><b>You</b>${esc(practice.surface)}を使いたいです。</p><p><b>Boombear</b>「${esc(practice.surface)}」は「${esc(practice.en)}」という意味です。</p>`;
    const others=manifest.articles.filter(item=>item.id!==article.id).sort((a,b)=>(a.level===article.level?-1:1)-(b.level===article.level?-1:1)).slice(0,2);
    const next=await Promise.all(others.map(async item=>fetch(`${root}${item.dataFile}?${cache}`).then(response=>response.json())));
    const grid=document.querySelector('.reader-next__grid');
    if(grid)grid.innerHTML=next.map(item=>`<a href="${esc(item.reservedPath)}"><img src="${esc(assetPath(item.cover.file,''))}" alt="Kokomonster illustrated cover"><span><small>${esc(item.level)} · ${esc(item.category.key.toUpperCase())}</small><b lang="ja">${esc(item.title.ja)}</b><em>${item.readingMinutes} min · ${item.keywordCount} keywords</em></span></a>`).join('');
    document.documentElement.dataset.readerReady='true';
    return {article,manifest};
  };
  window.kkmReaderReady=load().catch(error=>{console.error('Reader data failed to load',error);document.documentElement.dataset.readerError='true';});
})();
