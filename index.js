let films;
let selectedFilms = [];

//read the dataset
const readFilms = () => d3.tsv("http:/localhost:8000/cleanedData.tsv");

//autocomplete HTMLElement
const configAutoComplete = (filmNames) => {
    let autocomplete = document.getElementById("autocomplete");
    new Awesomplete(autocomplete, {
        list: filmNames
    });
}

//recomendation algorithm given 3 films
const recommend = (selectedFilms,allFilms,nFilms) => {
    
    //calculating genres weights
    let weights = {};
    selectedFilms.forEach(film => {
        allFilms[allFilms.map(f=>f.primaryTitle).indexOf(film)].genres.split(",").forEach(genre => {
            weights[genre] = genre in weights ? weights[genre]+1 : 1;
        })
    });

    //calculating films preferences
    let calculatedFilms = allFilms.map((film)=>{
        return {
                primaryTitle: film.primaryTitle,
                startYear: film.startYear,
                weight: film.genres.split(",").reduce((ac,genre)=>parseInt(ac) + (genre in weights ? weights[genre] : 0),0)
            }
    })

    //sorting films
    //calculatedFilms.sort((a,b) => a.startYear - b.startYear)
    calculatedFilms.sort((a,b) => a.weight - b.weight)
    calculatedFilms.reverse();

    return calculatedFilms.slice(0,nFilms);
}


//select films logic
document.getElementById("add").onclick = () =>{
    
    let input = document.getElementById("autocomplete");

    let filmHTML = document.createElement("li");
    filmHTML.innerHTML = input.value;
    document.getElementById("selectedFilms").appendChild(filmHTML);

    selectedFilms.push(input.value);
    input.value = "";

    if(selectedFilms.length>=3){
        let recommendedFilms = recommend(selectedFilms,films,10);
        document.getElementById("step1").style.display="none";
        document.getElementById("step2").style.display="flex";
        recommendedFilms.forEach(film=>{
            let rfilmHTML = document.createElement("li");
            rfilmHTML.innerHTML = film.primaryTitle + ", "+film.startYear;
            document.getElementById("recommendedFilms").appendChild(rfilmHTML);
        })
    }

}

//load films logic
readFilms().then((loadedFilms)=>{
    
    films = loadedFilms
                .filter(f=>f.startYear<=(new Date()).getFullYear()) //films till this year
                .map(f=>{return {
                                primaryTitle:f.primaryTitle,
                                startYear: f.startYear,
                                genres:f.genres
                            }
                        });

    configAutoComplete(films.map(f=>f.primaryTitle));
    console.log("loaded!");
    })