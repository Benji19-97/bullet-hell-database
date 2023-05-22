// Function to add a favorited object to the localStorage
function addToFavorites(gameName, patternName) {
      // Get the existing favorites from localStorage or initialize an empty array
      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

      // Create a new favorite object
      const favorite = {
            gameName: gameName,
            patternName: patternName,
      };

      // Add the new favorite to the array
      favorites.push(favorite);

      // Save the updated array back to localStorage
      localStorage.setItem("favorites", JSON.stringify(favorites));
}

// Function to remove a favorited object from the localStorage
function unfavorite(gameName, patternName) {
      // Get the favorites from localStorage
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

      // Find the index of the object to be removed
      const index = favorites.findIndex(
            (favorite) => favorite.gameName == gameName && favorite.patternName == patternName
      );

      // If the object is found, remove it from the array
      if (index !== -1) {
            favorites.splice(index, 1);

            // Save the updated array back to localStorage
            localStorage.setItem("favorites", JSON.stringify(favorites));
      }
}

function getFavorites() {
      // Get the favorites from localStorage
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

      // Return the favorites array
      return favorites;
}

function clearBadFavorites() {
      getFavorites().forEach(function (favorite) {
            if (!favorite.gameName) {
                  unfavorite(null, favorite.patternName);
            } else if (!data.some((game) => game.name == favorite.gameName)) {
                  unfavorite(gameName, favorite.patternName);
            }
      });
}

function isFavourited(gameName, patternName) {
      // Get the favorites from localStorage
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

      // Check if the object exists in the favorites array
      const isFavorite = favorites.some(
            (favorite) => favorite.gameName === gameName && favorite.patternName === patternName
      );

      return isFavorite;
}

var toggleFavoModeButton = document.getElementById("show-favo-button");
toggleFavoModeButton.addEventListener("click", toggleFavoMode);

var favoIcon = document.getElementById("show-favo-icon");

document.addEventListener("DOMContentLoaded", function () {
      let favoMode = localStorage.getItem("favoMode");
      if (favoMode === "true") {
            favoIcon.src = "assets/website/favo-filled.svg";
      } else {
            favoIcon.src = "assets/website/favo-empty.svg";
      }
});

function toggleFavoMode() {
      let favoMode = localStorage.getItem("favoMode") === "true";

      if (favoMode) {
            favoMode = false;
      } else {
            favoMode = true;
      }

      localStorage.setItem("favoMode", favoMode); // Don't forget to save new state to localStorage
      refreshFavoModeButtonDisplay();
      refreshPatternContainer();
}

function isFavoModeOn() {
      return localStorage.getItem("favoMode") == "true";
}

function refreshFavoModeButtonDisplay() {
      let favoMode = localStorage.getItem("favoMode") === "true";
      if (favoMode) {
            favoIcon.src = "assets/website/favo-filled.svg";
      } else {
            favoIcon.src = "assets/website/favo-empty.svg";
      }
}
