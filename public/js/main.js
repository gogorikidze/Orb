let sources = [
  {
    name: 'ელექტრონული რესურსების პორტალი Eon.ge',
    addr: 'eon.ge',
    imgbg: '#33363b',
    singlePage: true,
    onPageLoad: (index) => {
      document.getElementById('stats'+index).innerHTML = `${selectedSources[index].resultsForCurrentPage} შედეგი | 1 გვერდი`;
    }
  },
  {
    name: 'საქართველოს პარლამენტის ეროვნული ბიბლიოთეკა',
    addr: 'dspace.nplg.gov.ge',
    imgbg: '#7f8f74',
  },
  {
    name: 'ელექტრონული რესურსების პორტალი EL.ge',
    addr: 'el.ge',
    imgbg: '#042a3d',
  },
  {
    name: 'თსუ - ეროვნული სამეცნიერო ბიბლიოთეკა',
    addr: 'sciencelib.ge',
    imgbg: 'white',
  },
  {
    name: 'სამცხე-ჯავახეთის სახელმწიფო უნივერსიტეტის ბიბლიოთეკა',
    addr: 'sjuni.edu.ge',
    imgbg: '#161738',
  }
]
sources.map(sources => sources.selected = false)
let selectedSources;

function search(keyword){
  let main = document.getElementById('main').style;

  main.top = '7%';
  document.getElementById('sources').style.display = 'none';

  if(keyword.length < 1){
    document.getElementById('results').innerHTML = "საძიებო ველი ვერ იქნება ცარიელი!";
    return;
  }

  if(allSelected){
    selectedSources = sources;
  }else{
    selectedSources = sources.filter(x => x.selected);
  }
  
  addResultTabs();
  fetchStats(keyword);
}