// Initial array of villains
var villains = [];
var originalvillains = ["Thanos", "Cersei Lannister", "Ice King", "The Joker", "O-Ren Ishii", "Sauron", "Putin", "Ursula", "Skeletor", "The Janitor", "Darth Vader"];
//This will store any buttons added by the user
var previouslyAddedVillains = [];

//Function for retrieving local buttons added by user
function retrieveData(){
  var retrievedData = localStorage.getItem('newvillains');
  var newVillains = JSON.parse(retrievedData);
  if (newVillains !== null){
    for (var n = 0; n < newVillains.length; n++){
    previouslyAddedVillains.push(newVillains[n]);
    };
  };
};

// Function for displaying villain data
function renderButtons() {
  // (this is necessary otherwise we will have repeat buttons)
  $("#buttons-view").empty();
  villains = originalvillains.concat(previouslyAddedVillains);
  
  // Looping through the array of villains
  for (var i = 0; i < villains.length; i++) {
    
    // Then dynamicaly generating buttons for each villain in the array
    // This code $("<button>") is all jQuery needs to create the start and end tag. (<button></button>)
    var a = $("<button>");
    // Adding a class of villain to our button
    a.addClass("villain");
    // Adding a data-attribute
    a.attr("data-name", villains[i]);
    // Providing the initial button text
    a.text(villains[i]);
    // Adding the button to the HTML
    $("#buttons-view").append(a);
  };
};

//Function for user to add buttons
$("#add-villain").on("click", function(event) {
  // Preventing the buttons default behavior when clicked (which is submitting a form)
  event.preventDefault();
  
  // This line grabs the input from the textbox
  var villain = $("#villain-input").val().trim();
  //This step prevents blank buttons AND buttons that are already there on the page
  if(villain !== "" && originalvillains.indexOf(villain) === -1 && previouslyAddedVillains.indexOf(villain) === -1){
    // Adding the villain from the textbox to our array
    previouslyAddedVillains.push(villain);
    // Stores the user added villains locally
    localStorage.setItem("newvillains", JSON.stringify(previouslyAddedVillains));
    // Calling renderButtons which handles the processing of our villain array
    renderButtons();
    //Clears the input from the textbox
    $("#villain-input").val("");
  };
});
//Function for user to clear any buttons they have added
$("#clear-villain").on("click", function(event){
  localStorage.clear();
  renderButtons();
})

// Function for displaying the villain info
// We're adding a click event listener to all elements with the class "villain"
// We're adding the event listener to the document because it will work for dynamically generated elements
// $(".villains").on("click") will only add listeners to elements that are on the page at that time
$(document).on("click", ".villain", function(){
  // Storing our giphy API URL for a random villain image
  var villainName = $(this).attr("data-name");
  var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
  villainName+ "&api_key=abN4Fr8cyWyyBd3GM8ffaL9DW1vyySRA&limit=10";
  // Perfoming an AJAX GET request to our queryURL
  $.ajax({
    url: queryURL,
    method: "GET"
  })
  // After the data from the AJAX request comes back
  .then(function(response) {
    var results = response.data;
    console.log(results);
    // Looping over every result item
    for (var i = 0; i < results.length; i++) {
      
      // Only taking action if the photo has an appropriate rating
      if (results[i].rating !== "r" && results[i].rating !== "pg-13") {
        // Creating a div for the gif
        var gifDiv = $("<div>");
        
        // Storing the result item's rating
        var rating = results[i].rating;
        var title = results[i].title;
        
        // Creating a paragraph tag with the result item's rating
        var p = $("<p>").text("Rating: " + rating);
        var t = $("<p>").text("Title: " + title);
        
        // Creating an image tag
        var villainImage = $("<img>");
        
        // Giving the image tag an src attribute of a proprty pulled off the
        // result item
        villainImage.attr("src", results[i].images.fixed_height_still.url);
        villainImage.attr("data-still", results[i].images.fixed_height_still.url);
        villainImage.attr("data-animate", results[i].images.fixed_height.url);
        villainImage.attr("data-state", "still");
        villainImage.addClass("gif")
        // Appending the paragraph and villainImage we created to the "gifDiv" div we created
        gifDiv.append(p);
        gifDiv.append(villainImage);
        gifDiv.append(t);
        
        // Prepending the gifDiv to the "#gifs-appear-here" div in the HTML
        $("#gifs-appear-here").prepend(gifDiv);
      };
    };
  });
});
$(document).on("click", ".gif", function() {
  // The attr jQuery method allows us to get or set the value of any attribute on our HTML element
  var state = $(this).attr("data-state");
  // If the clicked image's state is still, update its src attribute to what its data-animate value is.
  // Then, set the image's data-state to animate
  // Else set src to the data-still value
  if (state === "still") {
    $(this).attr("src", $(this).attr("data-animate"));
    $(this).attr("data-state", "animate");
  } else {
    $(this).attr("src", $(this).attr("data-still"));
    $(this).attr("data-state", "still");
  };
});
// Calling the renderButtons and retrieveData functions to display the intial buttons

retrieveData();
renderButtons(); 