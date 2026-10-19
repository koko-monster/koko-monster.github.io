(function(){
  if(window.location.protocol!=='file:'){
    const cleanRoutes={
      '/index.html':'/',
      '/news.html':'/news/',
      '/shop-redesign.html':'/books/'
    };
    const storyRoutes={
      '7648':'/ja/news/Global/king-charles-clarifies-harry-meghan-royal-status-7648/',
      '9991':'/ja/news/Sports/onosato-promoted-to-yokozuna-9991/',
      '9992':'/ja/news/Business/suica-mascot-public-vote-9992/',
      '9993':'/ja/news/Environment/aomori-earthquake-magnitude-7-5-9993/',
      '7642':'/ja/news/Global/un-adopts-equal-earth-world-map-7642/',
      '7611':'/ja/news/Global/nepal-china-border-landslides-7611/',
      '7606':'/ja/news/Global/russian-drone-attack-near-kyiv-7606/',
      '7605':'/ja/news/Environment/nepal-tibet-landslides-7605/',
      '7596':'/ja/news/Global/nepal-china-border-flash-flood-7596/',
      '7594':'/ja/news/Global/prince-harry-family-returns-to-britain-7594/',
      '7581':'/ja/news/Global/iran-hijab-rules-women-resist-7581/',
      '7567':'/ja/news/Business/canada-pauses-us-trade-talks-7567/',
      '7561':'/ja/news/Global/israel-west-bank-settlement-homes-7561/',
      '7542':'/ja/news/Global/uss-george-washington-malacca-strait-7542/'
    };
    const storyId=new URLSearchParams(window.location.search).get('story');
    const cleanPath=window.location.pathname==='/news-reader.html'
      ?(storyRoutes[storyId]||'/news/')
      :cleanRoutes[window.location.pathname];
    if(cleanPath){
      const cleanSearch=window.location.pathname==='/news-reader.html'?'':window.location.search;
      window.history.replaceState(null,'',cleanPath+cleanSearch+window.location.hash);
    }
  }

  const root=document.documentElement;
  let locale='en';
  try{
    const saved=window.localStorage.getItem('kkm-language');
    if(saved==='en'||saved==='zh')locale=saved;
  }catch(error){}

  root.dataset.initialLocale=locale;
  root.lang=locale==='zh'?'zh-Hant':'en';

  if(locale!=='zh')return;

  const style=document.createElement('style');
  style.id='kkm-locale-bootstrap-style';
  style.textContent='html.kkm-locale-pending body{visibility:hidden}';
  document.head.appendChild(style);
  root.classList.add('kkm-locale-pending');

  let fallbackTimer=window.setTimeout(reveal,2000);
  function reveal(){
    window.clearTimeout(fallbackTimer);
    root.classList.remove('kkm-locale-pending');
    style.remove();
  }

  window.kkmLocaleReady=function(){
    window.requestAnimationFrame(reveal);
  };
})();
