(()=>{
  const VERSION='20261005-1';
  const heads=[
    'LOGO-005-01-koko-head-original.png','LOGO-005-02-gohanko-head-original.png',
    'LOGO-005-03-bear-head-original.png','LOGO-005-04-rabbit-head-original.png',
    'LOGO-005-05-yauyau-head-original.png','LOGO-005-06-tree-head-original.png'
  ];
  const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  const asset=(root,path)=>`${root}${path}${path.includes('?')?'&':'?'}v=${VERSION}`;

  function mount(host){
    if(!host||host.dataset.logoMounted==='true')return;
    const root=(host.dataset.logoRoot||'design/koko-design/logo-collection/').replace(/\/?$/,'/');
    host.dataset.logoMounted='true';
    host.classList.add('kkm-logo');
    host.setAttribute('role','img');
    if(!host.getAttribute('aria-label'))host.setAttribute('aria-label','Kokomonster');
    host.innerHTML=`<span class="kkm-logo__row" aria-hidden="true">${heads.map(name=>`<span class="kkm-logo__slot"><img class="kkm-logo__head" src="${asset(root+'original-heads/',name)}" alt=""></span>`).join('')}<img class="kkm-logo__wordmark" src="${asset(root,'LOGO-001-kokomonster-wordmark-source.png')}" alt=""></span>`;
    const images=[...host.querySelectorAll('.kkm-logo__head')];
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){
      images[0]?.classList.add('is-visible');
      host.classList.add('is-wordmark');
      return;
    }
    (async()=>{
      for(const image of images){image.classList.add('is-visible');await wait(520)}
      await wait(2000);
      host.classList.add('is-wordmark');
    })();
  }

  function mountAll(root=document){root.querySelectorAll('[data-kkm-logo]').forEach(mount)}
  window.KokomonsterBrand={mount,mountAll};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>mountAll());
  else mountAll();
})();
