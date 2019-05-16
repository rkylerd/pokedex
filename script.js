


window.onload = function () {
    
  localStorage.setItem("leagues-array", JSON.stringify(["ex9", "sm10", "det1", "sm9", "dp1", "sm8"]));
  localStorage.setItem("league-index", 0);
  fetchURL("ex9");

    // document.getElementById("clear").addEventListener("click", function(event) {
      
    //   event.preventDefault();
    //   var leaguesArray = JSON.parse(localStorage.getItem("leagues-array"));
    //   var index = localStorage.getItem("league-index");
    
    //   fetchURL(leaguesArray[index]);
      

    // });

    // document.getElementById("filter-button").addEventListener("click", function() {updateVisual();});
    var checkboxes = document.getElementsByClassName("type_checkbox");
    
           

  function OnChangeCheckbox (event, pokeType) {
    
      updateVisual();

      var returnPokemon = JSON.parse(localStorage.getItem("filteredPokemon"));
      
      var initialList = returnPokemon;

      var removePokemon = [];
      var pokemonList = JSON.parse(localStorage.getItem("pokemonList"));
      
      for (var i = 0; i < pokemonList.length;i++ ) {
        if (pokemonList[i].supertype === "Pokémon") {
          for (var j = 0; j < pokemonList[i].types.length; j++) {
            if (pokeType == pokemonList[i].types[j]) {
              returnPokemon.push(pokemonList[i]);
              removePokemon.push(pokemonList[i]);
              break;
            }
          }    
        }   
      }
      
      var checkbox = event.target;
      if (checkbox.checked) {
          
          localStorage.setItem("filteredPokemon", JSON.stringify(returnPokemon));
          renderCards(returnPokemon);
      }
      else {
          for (var i = 0; i < initialList.length; i++ ) {
            for (var x = 0; x < removePokemon.length; x++ ) {
              if (initialList[i].name == removePokemon[x].name) {
                  initialList.splice(i,1);
              }
            }
          }
          localStorage.setItem("filteredPokemon", JSON.stringify(initialList));
          renderCards(initialList);
          
      }
      var includetypes = [];
      includetypes = findCheckedFilters(includetypes);
      if (includetypes.length == 0) {
        renderCards(pokemonList);
      }
      clearSearchBar();

      
  }





    for (var v = 0; v < checkboxes.length; v++) {
      
      var pokeType = checkboxes[v].id;
      checkboxes[v].addEventListener("change", function() {OnChangeCheckbox(event, pokeType);});
      // checkboxes[v].addEventListener("change", function() {updateVisual();});
    }
    localStorage.setItem("filteredPokemon", JSON.stringify([]));
    document.getElementById("search-box").addEventListener("keyup", function(event) {

      event.preventDefault();
      var searchTerm = document.getElementById("search-box").value;
      searchTerm = searchTerm.toLowerCase();
      var pokemonList = JSON.parse(localStorage.getItem("filteredPokemon"));
      if (pokemonList.length == 0) {
        pokemonList = JSON.parse(localStorage.getItem("pokemonList"));
      }
      var noDuplicates = new Set();

      for (var i = 0; i < pokemonList.length; i++) {
        var name = pokemonList[i].name;
        name = name.toLowerCase();

        // Searching by name
        for (var j = 0; j < name.length; j++) {
          if ( (j + searchTerm.length) > name.length ) {
            break;
          }
          
          var substring = name.substring(j, (j+searchTerm.length));
          
          if (substring == searchTerm) {

              noDuplicates.add(pokemonList[i]);
              continue;
          }
        }

        // Searching for type
        // var type = pokemonList[i].types;
        // alert(type.length);
        // for (var x = 0; x < type.length; x++) {
        //   var currType = type[x].toLowerCase();
        //   for (var j = 0; j < currType.length; j++) {
        //     if ( (j + searchTerm.length) > currType.length ) {
        //       break;
        //     }
            
        //     var substring = currType.substring(j, (j+searchTerm.length));
        //     console.log(substring);
        //     if (substring == searchTerm) {

        //         noDuplicates.add(pokemonList[i]);
        //         continue;
        //     }
        //   }
        // }
    }

        document.getElementById("imageResults").innerHTML = "";
        var imageResults = "";
        noDuplicates = Array.from(noDuplicates);
        
        // for (var p = 0; p < noDuplicates.length; p++) {
          
        //   imageResults += "<div class='card-container'><img class='pokemon-card' src='" + noDuplicates[p].imageUrl + "'></img></div>";
        // }
    
        // document.getElementById("imageResults").innerHTML = imageResults;
      renderCards(noDuplicates);

    });

    // Working Toggle Button
    // document.getElementById("toggle-leagues").addEventListener("click", function(event) {

    //   event.preventDefault();
    //   var leaguesArray = JSON.parse(localStorage.getItem("leagues-array"));
    //   var index = localStorage.getItem("league-index");

    //   fetchURL(leaguesArray[++index % leaguesArray.length]);
    //   localStorage.setItem("league-index", index);

    // });

    // document.getElementById("filter-button").addEventListener("click", function(event) {

    //   event.preventDefault();
    //   var leaguesArray = JSON.parse(localStorage.getItem("leagues-array"));
      
    //   fetchURL(leaguesArray[document.getElementById("")]);
    //   localStorage.setItem("league-index", index);

    // });

    document.getElementById("card-set").addEventListener("change", function(event) {
      event.preventDefault();
      var leaguesArray = JSON.parse(localStorage.getItem("leagues-array"));
      var index = document.getElementById("card-set").value;
      fetchURL(leaguesArray[index]);
      localStorage.setItem("league-index", index);

      //reset the checkboxes
      var checkboxes = document.getElementsByClassName("type_checkbox");
      for (var i = 0; i < checkboxes.length; i++) {
          document.getElementsByClassName("type_checkbox")[i].checked = false;
      }
      clearSearchBar();

    });

        
}

// function typeSort(type) {
//   type = type.toLowerCase();
//   var returnPokemon = [];
//   var pokemonList = JSON.parse(localStorage.getItem("pokemonList"));
//   for (var i = 0; i < pokemonList.length;i++ ) {
//       // alert(pokemonList[i].type);
//       if (pokemonList[i].type.toLowerCase() == type) {
//         returnPokemon.push(pokemonList[i]);
//       }
//   }
//   return pokemonList;
// }

function fetchURL(cardSet) {
  const url = "https://api.pokemontcg.io/v1/cards?setCode=" + cardSet;
  fetch(url)
          .then(function(response) {
            return response.json();
          }).then(function(json) {	
            console.log(json);
            localStorage.setItem("pokemonList", JSON.stringify(json.cards));
            
            renderCards(json.cards);
            
          });
}

function renderCards(pokemonList) {
  pokemonList = sortAlphabetically(pokemonList);
  // var pokemonList = JSON.parse(localStorage.getItem("pokemonList"));
    var imageResults = "";
    
    for (var i = 0; i < pokemonList.length; i++) {
      
      if (pokemonList[i].supertype == "Pokémon"){
        imageResults += "<div class='card-container'><img class='pokemon-card' src='" + pokemonList[i].imageUrl + "'></img></div>";
      }
      
    }
    
    document.getElementById("imageResults").innerHTML = imageResults;
}

function sortAlphabetically(array) {
    for (var i = 0; i < array.length; i ++) {
        for (var y = i+1; y < array.length-1;y++) {
          
          if (array[i].name > array[y].name) {
            var temp = array[i];
            array[i] = array[y];
            array[y] = temp; 
          }
        }
    }
    return array;
}

function findCheckedFilters(includetypes) {

  var inputElements = document.getElementsByClassName('type_checkbox');
  for(var i=0; i < inputElements.length; ++i) {
    if(inputElements[i].checked){
        
        includetypes.push(inputElements[i].id);
    }
  }
  return includetypes;

}

function updateVisual() {
  
  var includetypes = []; 
  includetypes = findCheckedFilters(includetypes);

  var returnPokemon = [];
  var pokemonList = JSON.parse(localStorage.getItem("pokemonList"));
  // if (pokemonList.length == 0 ) {
  //   pokemonList = JSON.parse(localStorage.getItem("pokemonList"));
  // }
  for (var i = 0; i < pokemonList.length;i++ ) {
    if (pokemonList[i].supertype === "Pokémon") {
      for (var j = 0; j < pokemonList[i].types.length; j++) {
        if (includetypes.includes(pokemonList[i].types[j])) {
          returnPokemon.push(pokemonList[i]);
          break;
        }
      }    
    }   
  }

  localStorage.setItem("filteredPokemon", JSON.stringify(returnPokemon));
}

function clearSearchBar() {
    document.getElementById("search-box").value = "";
}

// function updateVisual() {
  
//   var includetypes = []; 
//   var inputElements = document.getElementsByClassName('type_checkbox');
//   for(var i=0; i < inputElements.length; ++i) {
//     if(inputElements[i].checked){
        
//         includetypes.push(inputElements[i].id);
//     }
//   }

  

//   var returnPokemon = [];
//   var pokemonList = JSON.parse(localStorage.getItem("filteredPokemon"));
  
//   for (var i = 0; i < pokemonList.length;i++ ) {
//     if (pokemonList[i].supertype === "Pokémon") {
//       for (var j = 0; j < pokemonList[i].types.length; j++) {
//         if (includetypes.includes(pokemonList[i].types[j])) {
//           returnPokemon.push(pokemonList[i]);
//           break;
//         }
//       }    
//     }   
//   }

//   localStorage.setItem("filteredPokemon", JSON.stringify(returnPokemon));

//   document.getElementById("imageResults").innerHTML = "";
//   var imageResults = "";
//   for (var i = 0; i < returnPokemon.length; i++) {
//     imageResults += "<div class='card-container'><img class='pokemon-card' src='" + returnPokemon[i].imageUrl + "'></img></div>";
//   }
//   document.getElementById("imageResults").innerHTML = imageResults;
// }