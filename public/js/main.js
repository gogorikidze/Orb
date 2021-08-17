let sources = [
  {
      name: 'ელექტრონული რესურსების პორტალი EL.ge',
      addr: 'el.ge',
      imgsrc: 'parts/logos/el.ge.png',
      imgbg: '#042a3d',
      selected: false
  },
  {
      name: 'საქართველოს პარლამენტის ეროვნული ბიბლიოთეკა',
      addr: 'dspace.nplg.gov.ge',
      imgsrc: 'parts/logos/dspace.nplg.gov.ge.png',
      imgbg: '#7f8f74',
      selected: false
  }
]
function search(keyword){
  let main = document.getElementById('main').style;

  main.top = '7%';
  document.getElementById('sources').style.display = 'none';

  let selectedSources;
  if(allSelected){
    selectedSources = sources;
  }else{
    selectedSources = sources.filter(x => x.selected);
  }

  console.log(selectedSources)
  addResultTabs(selectedSources);
  fetchStats(selectedSources, keyword);
}
function addResultTabs(selectedSources){
  let resultsfield = document.getElementById('results');
  resultsfield.innerHTML = "";
  
  selectedSources.map((source, index) => {
    let html = `
    <div class="tab">
      <div class="header" onclick="toggleResultSource(${index})">
        <div class="logo">${source.name}</div>
        <div id="stats${index}">შედეგები იტვირთება...</div>
      </div>
      <div id="results${index}" style="display:none"></div>
    </div>
    `
    resultsfield.innerHTML += html;
  })
}
function fetchResults(selectedSources, index, keyword, page){
  let source = selectedSources[index];
  fetch("./api/"+source.addr+"/search/"+keyword+"/"+page)
    .then(response => response.json())
    .then(data => {
      if(data == "Nothing found"){
        console.log('f', source.name);
      }else{
        displayResults(data, index);
      }
    });
}
function displayResults(results, index){
  var resultsfield = document.getElementById('results'+index);

  console.log(results.length);
  results.map(result => {
    /*
    resultsfield.innerHTML +=`
    <div class='result'>
        <div class='awaitcover'>${result.imgsrc}altNameOrb${result.name}</div>
        <div class='bookinfo'>
            <div class='bookname'>${result.name}</div>
            <div class='bookauthor'>
                <span class='identifier'>ავტორი: </span>${result.author}
            </div>
            <div class='bookdescription'>
                <span class='identifier'></span>
            </div>
            <div class='bottomButtons'>
                <a target='_blank' href='${result.href}'>
                    <div class='downloadButton'>სრულად</div>
                </a>
            </div>
        </div>
    </div>
    <br>`;
    */
    resultsfield.innerHTML +=`
    <div style="display: flex; justify-content: center; align-items: center">
            <div style="border-right: 1px solid gray"> ${result.name} </div>
            <div style="border-right: 1px solid gray"> ${result.author} </div>
            <a target='_blank' href='${result.href}'>ვრცლად
            </a>
    </div>
    <hr>`;
  })
  displaybook();
}
function fetchStats(selectedSources, keyword){
  selectedSources.map((source, index) => {
    fetch("./api/"+source.addr+"/stats/"+keyword)
      .then(response => response.json())
      .then(data => {
        var statsfield = document.getElementById('stats'+index);
        if(data == "Nothing found"){
          console.log('f', source.name);
          statsfield.innerText = "შედეგები არ არის";
        }else{
          console.log(data);
          statsfield.innerText = data.results+" შედეგი | "+data.pages+" გვერდი";
          fetchResults(selectedSources, index, keyword, 1);
        }
      });
  })  
}
function toggleResultSource(index){
  let resultsHolder = document.getElementById('results'+index);
  let state = resultsHolder.style.display;
  if(state == 'none'){
    //closes any other open tabs
    for(let i = 0; i < document.getElementById('results').children.length; i++){
      if(i != index) document.getElementById('results'+i).style.display = 'none';
    }
    resultsHolder.style.display = 'block';
    document.getElementById('stats'+index).scrollIntoView();
  }else{
    resultsHolder.style.display = 'none';
  }
}