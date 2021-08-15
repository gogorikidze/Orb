
function search(keyword){
  var resultsfield = document.getElementById('results');
  var main = document.getElementById('main').style;

  main.top = '7%';
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      if(xhttp.responseText == '0 შედეგი'){
        resultsfield.innerHTML = 'ასეთი არაფერი მოიძებნა';
      }else if(xhttp.responseText == 'error 42069'){
        resultsfield.innerHTML = 'გამოიყენეთ 3-ზე მეტი და 40-ზე ნაკლები სიმბოლო';
      }else{
        displayResults(xhttp.responseText);
      }
    }
  };
  xhttp.open("GET", "./api/el.ge/"+keyword, true);
  xhttp.send();
}
function displayResults(response){
  var resultsfield = document.getElementById('results');

  var result = JSON.parse(response);
  console.log(result);
  result.map(result => {
    document.getElementById('results').innerHTML +=`
    <div class='result'>
        <div class='awaitcover'>${result.imgsrc}altNameOrb${result.name}</div>
        <div class='bookinfo'>
            <div class='bookname'>${result.name}</div>
            <div class='bookauthor'>
                <span class='identifier'>ავტორი: </span>${result.author}
            </div><div class='bookdescription'>
                <span class='identifier'>მოკლე აღწერა: </span>"+description+"
            </div><div class='bottomButtons'>
                <a target='_blank' href='${result.href}'>
                    <div class='downloadButton'>გადმოწერა / ნახვა</div>
                </a>
            </div>
        </div>
    </div>
    <br>`;
  })
  displaybook();
}