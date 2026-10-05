(()=>{
  const characters=['koko','gohanko','bear','rabbit','yauyau','tree'];
  let favicon=document.querySelector('link[rel~="icon"][data-random-favicon]');
  if(!favicon){
    favicon=document.createElement('link');
    favicon.rel='icon';
    favicon.type='image/png';
    favicon.sizes='64x64';
    favicon.dataset.randomFavicon='';
    document.head.appendChild(favicon);
  }
  const character=characters[Math.floor(Math.random()*characters.length)];
  const assetRoot=(favicon.dataset.faviconRoot||'design/koko-design/logo-collection/favicons/').replace(/\/?$/,'/');
  favicon.href=`${assetRoot}favicon-${character}.png?v=20261005-1`;
  favicon.dataset.character=character;
})();
