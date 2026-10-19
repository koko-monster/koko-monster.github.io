(function(){
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
