var movieController = (function(){
    let Movie = function(id, data){
        this.id = id;
        this.poster = data.Poster;
        this.title = data.Title;
        this.imdbRating = data.imdbRating;
    };

    let movies = [];

    return {
        addMovie: function(data){
            let newMovie, ID;
            ID = movies.length > 0 ? movies[movies.length - 1].id + 1 : 0;
            newMovie = new Movie(ID, data);
            movies.push(newMovie);
            return newMovie;
        },
        deleteMovie: function(id){
            let index, deleteMovieIDs;
            deleteMovieIDs = movies.map(i => i.id);
            index = deleteMovieIDs.indexOf(id);
            if(index !== -1){
                movies.splice(index,1);
            }                
        },   
        testing: () => {
            console.log(movies);
        }
    };
})();

var UIController = (function(){
    let DOMStrings = {
        movieContainer: ".movie-list",
        input: ".input",
        inputButton: ".add-btn",
        container: '.container'
    };

    return {
        addListItem: function(obj){
            let html;           
            html = $('#template').html();
            html=html.replace('_id',obj.id);
            html=html.replace('_src',obj.poster);
            html=html.replace('_alt',obj.title);
			html=html.replace('_title',obj.title);
			html=html.replace('_rate',obj.imdbRating);
            $(DOMStrings.movieContainer).append(html);    
        },
        clearField: function(){
            let fields;
            /* fields = document.querySelector(DOMStrings.input); */
            fields = $(DOMStrings.input);
            fields.val("").focus();
        },
        deleteListItem: function(selectorID){
            let element = document.getElementById(selectorID);
            element.parentNode.removeChild(element);
        },
        getDOMStrings: function(){
            return DOMStrings;
        },
        getInput: function(){
            return {
                movieName: $(DOMStrings.input).val()
            };  
        }
    };
})();


//GLOBAL APP CONTROLLER
var controller = (function(movieCtrl, UICtrl){
    var ctrlAddMovie = function(){
        const URL = "http://www.omdbapi.com/?apikey=63f944af&t=";
        let input, newMovie;
        //get the field input data
        input = UICtrl.getInput();
        if(input.movieName === ""){alert("You must enter a movie name"); return;}
/**********************************************
*** FETCH()
**********************************************/
        /* fetch(URL+input.movieName)
        .then(result =>{
            return result.json();
        })
        .then(data => {
            if(data.Title === undefined){alert("Movie not found");return;}
            console.log(data.Title);
            newMovie = movieCtrl.addItem(data);
            UIController.addListItem(newMovie);
            UIController.clearField();
            return data;
        })
        .catch(error => console.log("Unhandled exception")); */

/**********************************************
*** XMLHttpRequest()
**********************************************/
    /* let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        // Only run if the request is complete
    if (xhr.readyState !== 4) {
        return;
        }
        // Process our return data
    if (xhr.status >= 200 && xhr.status < 300) {
        // What do when the request is successful
        var data = JSON.parse(xhr.responseText);
        if(data.Title === undefined){
            alert("Movie not found");return;
        }
        newMovie = movieCtrl.addMovie(data);
        UIController.addListItem(newMovie);
        UIController.clearField();
    } else {
        console.log('error', xhr);
        }
    };
    xhr.open('GET', URL+input.movieName);
    xhr.send(); */
/**********************************************
*** ajax()
**********************************************/
    $.ajax({
        url: URL + input.movieName,
        type: "GET",
        success: (data) => {
            if(data.Title === undefined){alert("Movie not found");return;}
            newMovie = movieCtrl.addMovie(data);
            UIController.addListItem(newMovie);
            UIController.clearField();
        },
        error: (error) => {
            console.log(error)
        }
    })
    };
    var ctrlDeleteItem = function(event){
        let itemID, ID;
        itemID = (event.target.parentNode.parentNode.parentNode.id);
        if(itemID){
            ID = parseInt(itemID);
            movieCtrl.deleteMovie(ID);
            UICtrl.deleteListItem(itemID);
        }
    };
    var setupEventListeners = function(){
        let DOMStrings = UIController.getDOMStrings();
        $(DOMStrings.inputButton).click(ctrlAddMovie);
        $(document).keypress((event) => {
            if(event.keyCode === 13 || event.which === 13 /*for old browser*/){
                ctrlAddMovie(); 
            }
        });
        $(DOMStrings.container).click(ctrlDeleteItem);
    };

    return {
      init: function(){
          console.log("Application has started.");
          setupEventListeners();
      }  
    };
})(movieController, UIController);

controller.init();

