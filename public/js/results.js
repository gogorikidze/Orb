function addResultTabs(){
    let resultsfield = document.getElementById('results');
    resultsfield.innerHTML = "";
    
    selectedSources.map((source, index) => {
      let html = `
      <div class="tab">
        <div class="header" onclick="toggleResultSource(${index})">
          <div class="logo">${source.name}</div>
          <div id="stats${index}">შედეგები იტვირთება...</div>
        </div>
        <div id="results${index}" class='resultsHolder'></div>
      </div>
      `
      resultsfield.innerHTML += html;
    })
  }
function fetchResults(index, keyword){
  let source = selectedSources[index];
  fetch("./api/"+source.addr+"/search/"+keyword+"/"+source.currentPage+"/"+source.pages)
    .then(response => {
      if(response.status == 204){
        console.log('f', source.name);
      }else{
        return response.json()
      }
    })
    .then(data => {
        displayResults(data, index, keyword);
      });
}
function displayResults(results, index, keyword){
  var resultsfield = document.getElementById('results'+index);

  resultsfield.innerHTML = "";

  results.map(result => {
    resultsfield.innerHTML +=`
    <div class="result">
      <div class='awaitcover'>${result.imgsrc}altNameOrb${result.name}</div>
      <div class='info'>
        <div><span class='identifier'>სახელი: </span> ${result.name}</div>
        <div><span class='identifier'>ავტორი: </span> ${result.author}</div>
        <a target='_blank' style="margin: 10px;" href='${result.href}'>ვრცლად</a>
      </div>
    </div>
    <hr>`;
  })

  //add pagination
  let source = selectedSources[index];
  source.resultsForCurrentPage = results.length;

  let html = `
  <div class='pagination'>
    <a ${(source.currentPage == 1) ? "class='disabled'" : `onclick="navigate(-1, ${index}, '${keyword}')" class="enabled`}">წინა გვერდი</a>
    <text>${source.currentPage}</text>
    <a ${(source.currentPage == source.pages) ? "class='disabled'" : `onclick="navigate(1, ${index}, '${keyword}')" class="enabled`}">შემდეგი გვერდი</a>
  </div>`;
  resultsfield.innerHTML += source.singlePage ? "<text class='enabled'>ამ წყაროდან მეტი შედეგი არ არის :(</text>" : html;

  if(source.onPageLoad) source.onPageLoad(index);

  displaybook();
}
function fetchStats(keyword){
  selectedSources.map((source, index) => {
    fetch("./api/"+source.addr+"/stats/"+keyword)
      .then(response => {
        if(response.status == 204){
          return "204"
        }else{
          return response.json();
        }
      })
      .then(data => {
        var statsfield = document.getElementById('stats'+index);

        if(data == "204") {
          statsfield.innerText = "შედეგები არ არის";
          return;
        }

        source.pages = data.pages;
        source.currentPage = 1;
        statsfield.innerText = `${data.results} შედეგი | ${(source.singlePage) ? 1 : data.pages} გვერდი`;
        fetchResults(index, keyword, source.currentPage);
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
function navigate(amount, index, keyword){
  selectedSources[index].currentPage += amount;
  fetchResults(index,keyword);
  document.getElementById('stats'+index).scrollIntoView();
}