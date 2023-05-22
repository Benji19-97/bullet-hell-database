let gameSelect = document.getElementById("game-select");
gameSelect.addEventListener("input", refreshPatternContainer);

// Add all option to game selection
let allOption = document.createElement("option");
allOption.value = "All Games";
allOption.textContent = "All Games";
gameSelect.appendChild(allOption);

let tags = [];

let patternsContainer = document.getElementById("patterns-container");

let allPatternHtmlElements = [];

data.forEach(function (game) {
      let selectOption = document.createElement("option");
      selectOption.value = game.name;
      selectOption.textContent = game.name;
      gameSelect.appendChild(selectOption);

      game.patterns
            .filter((pattern) => pattern.name.length > 0)
            .forEach(function (pattern) {
                  // Create new DOM elements
                  let div = document.createElement("div");
                  div.classList.add("pattern-element");
                  div.classList.add("hide");
                  div.name = pattern.name;

                  let h2 = document.createElement("h2");
                  h2.textContent = pattern.name;

                  let img = document.createElement("img");
                  let src = removeLeadingDotDotSlash(pattern.gif);
                  img.setAttribute("data-gifffer", src);
                  // img.src = src;
                  // img.loading = "lazy";

                  div.setAttribute("gif", src);

                  // Append elements
                  div.appendChild(h2);
                  div.appendChild(img);

                  let tagBox = document.createElement("div");
                  tagBox.classList.add("tag-box");

                  div.appendChild(tagBox);

                  patternsContainer.appendChild(div);
                  allPatternHtmlElements.push(div);

                  pattern.tags.sort().forEach(function (tag) {
                        tags.push(tag);
                        div.classList.add(tag);

                        let tagElement = document.createElement("div");
                        tagElement.textContent = tag;
                        tagElement.classList.add("tag-element");
                        tagBox.appendChild(tagElement);
                  });
            });
});

let navigation = document.getElementById("navigation");
let tagInputsContainer = document.getElementById("tag-inputs");
// tagInputsContainer.id = "tag-inputs";
navigation.appendChild(tagInputsContainer);

let checkboxElements = [];

const tagSet = [...new Set(tags)].sort();
tagSet.forEach(function (tag) {
      let inputParent = document.createElement("div");
      inputParent.classList.add("tag-input");

      let label = document.createElement("label");
      label.textContent = tag;
      label.setAttribute("for", tag);
      inputParent.appendChild(label);

      let checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = tag;
      checkbox.name = tag;
      checkbox.id = tag + "checkbox";
      inputParent.appendChild(checkbox);
      checkbox.addEventListener("input", refreshPatternContainer);
      tagInputsContainer.appendChild(inputParent);
      checkboxElements.push(checkbox);
});

const searchField = document.getElementById("search");
let timeoutId = null;

searchField.addEventListener("input", (event) => {
      // Clear any existing timeouts
      if (timeoutId) {
            clearTimeout(timeoutId);
      }

      // Set a new timeout
      timeoutId = setTimeout(() => {
            refreshPatternContainer();
      }, 250); // 1000 milliseconds = 1 second
});

function removeLeadingDotDotSlash(path) {
      while (path.startsWith("../")) {
            path = path.substring(3);
      }
      return path;
}

function refreshPatternContainer() {
      let activeTags = [];
      checkboxElements.forEach(function (checkbox) {
            if (checkbox.checked) {
                  activeTags.push(checkbox.value);
            }
      });

      allPatternHtmlElements.forEach(function (patternElement) {
            hidePatternElement(patternElement);
      });

      let relevantElements = allPatternHtmlElements.filter(
            (patternElement) =>
                  patternElement.name.toLowerCase().includes(searchField.value.toLowerCase()) ||
                  searchField.value.length == 0
      );
      const allTagElements = Array.prototype.slice.call(document.getElementsByClassName("tag-element"), 0);
      allTagElements.forEach(function (tagElement) {
            if (activeTags.includes(tagElement.textContent)) {
                  tagElement.classList.remove("inactive-tag");
            } else {
                  tagElement.classList.add("inactive-tag");
            }
      });

      if (activeTags.length == 0 && searchField.value.length == 0) {
            const [activeElements, hiddenElements] = splitArray(relevantElements, 12);

            activeElements.forEach((patternElement) => {
                  patternElement.classList.remove("hide");
            });

            hiddenElements.forEach((patternElement) => {
                  patternElement.classList.add("hide");
            });
      } else {
            relevantElements.forEach(function (patternElement) {
                  if (activeTags.length == 0 || activeTags.every((tag) => patternElement.classList.contains(tag))) {
                        //should be shown

                        toggleDisplayingPatternElement(patternElement, true);
                  } else {
                        //should not be shown
                        toggleDisplayingPatternElement(patternElement, false);
                  }
            });
      }
}

function toggleDisplayingPatternElement(patternElement, state) {
      if (state) {
            showPatternElement(patternElement);
      } else {
            hidePatternElement(patternElement);
      }
}

function hidePatternElement(patternElement) {
      patternElement.classList.add("hide");
}

function showPatternElement(patternElement) {
      loadGIF(patternElement.getAttribute("gif"), patternElement);
}

function splitArray(arr, maxSize) {
      if (arr.length <= maxSize) {
            return [arr, []];
      } else {
            const shuffledArray = arr.slice(); // Create a shallow copy of the original array
            for (let i = shuffledArray.length - 1; i > 0; i--) {
                  // Shuffle the elements in the array using Fisher-Yates algorithm
                  const j = Math.floor(Math.random() * (i + 1));
                  [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
            }
            const firstArray = shuffledArray.slice(0, maxSize);
            const secondArray = shuffledArray.slice(maxSize);

            return [firstArray, secondArray];
      }
}

refreshPatternContainer();

function loadGIF(gifUrl, patternElement) {
      var img = new Image();

      img.onload = function () {
            patternElement.classList.remove("hide");
      };

      img.src = gifUrl;

      if (img.complete) {
            patternElement.classList.remove("hide");
      }
}
window.onload = () => {
      var gifs = Gifffer();
};
