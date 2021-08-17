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
let selectedSources;

function search(keyword){
  let main = document.getElementById('main').style;

  main.top = '7%';
  document.getElementById('sources').style.display = 'none';

  if(allSelected){
    selectedSources = sources;
  }else{
    selectedSources = sources.filter(x => x.selected);
  }
  
  addResultTabs();
  fetchStats(keyword);
}