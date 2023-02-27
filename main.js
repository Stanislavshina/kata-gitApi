const inputSearch = document.querySelector('.search__input'),
      autocomplite = document.querySelector('.autocomplite'),
      repoList = document.querySelector('.repo__list'),
      repos = repoList.getElementsByClassName('repo__item');


 async function fetchData(e) {
  if(!e) return;
  const data = await fetch(`https://api.github.com/search/repositories?q=${e}`)
  .then(e=> e.json())
  .then(arr => {
    autocomplite.textContent = '';
    const renderData = arr.items.slice(0,5);
    autocomplite.style.display = 'block'
    renderData.forEach(el => {
      const owner = el.owner.login;
      const stars = el.stargazers_count;
      autocomplite.insertAdjacentHTML('beforeend', `
        <li class='autocomplite__item'>
        <button class='autocomlite__link' data-login=${owner} data-stars=${stars}>${el.name}</button>
        </li>
      `);
    });
  })
  .catch(e=> {throw new Error(`не поймал дату: ${e}`)});
};


const debounce = (f, delay) => {
  let timeout;
  return function(){
    const fnCall = () => {f.apply(this, arguments)};
    clearTimeout(timeout);
    timeout = setTimeout(fnCall, delay);
  };
};

const repoDel = (arr, elToRemove) => {
  const toRemove = elToRemove.children[0].dataset.name; 
  let x = [...arr];
  x = x.filter(el => el.dataset.name === toRemove ? el.remove() : el)
};

fetchData = debounce(fetchData, 500);
inputSearch.addEventListener('input', (e) => {
  let val = e.target.value;
  if(!val) autocomplite.style.display = 'none';
  fetchData(val)
});

autocomplite.addEventListener('click', (e)=>{
  if(e.target.classList.contains('autocomlite__link')){
    const {login, stars} = e.target.dataset;
    repoList.insertAdjacentHTML('beforeend', `
    <li class='repo__item' data-name=${e.target.textContent}>
    <div class="repo__about repo-about">
        <p class="repo-about__name">Name: ${e.target.textContent}</p>
        <p class="repo-about__owner">Owner: ${login}</p>
        <p class="repo-about__stars">Stars: ${stars}</p>
      </div>
      <button class="delete">
        <svg width="46" height="42" viewBox="0 0 46 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 40.5L44 2" stroke="#FF0000" stroke-width="4"></path>
          <path d="M44 40.5L2 2" stroke="#FF0000" stroke-width="4"></path>
          </svg>
          
        </button>
    </li>
    `)
  }
  inputSearch.value = ''
  autocomplite.style.display = 'none'
})

repoList.addEventListener('click', (e) => {
  repoDel(repos, e.currentTarget)
} )
// console.log(x);