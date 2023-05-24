data.sort((a, b) => a.name.localeCompare(b.name));

let gameSelect = document.getElementById("game-select");
gameSelect.addEventListener("input", () => {
      localStorage.setItem("game-selection", gameSelect.value);
      refreshPatternContainer();
});

// Add all option to game selection
let allOption = document.createElement("option");
allOption.value = "All Games";
allOption.textContent = "All Games";
gameSelect.appendChild(allOption);

let tags = [];

let patternsContainer = document.getElementById("patterns-container");

let allPatternHtmlElements = [];

//fill the game options and collect all tags found
data.forEach(function (game) {
      let selectOption = document.createElement("option");
      selectOption.value = game.name;
      selectOption.textContent = game.name;
      gameSelect.appendChild(selectOption);

      game.patterns
            .filter((pattern) => pattern.name.length > 0)
            .forEach(function (pattern) {
                  // Create new DOM elements
                  pattern.tags.forEach(function (tag) {
                        tags.push(tag.toLowerCase());
                  });
            });
});

let loadedGameSelectionValue = localStorage.getItem("game-selection");

if (loadedGameSelectionValue) {
      gameSelect.value = loadedGameSelectionValue;
}

function createPatternDisplay(gameName, pattern) {
      if (!pattern.name || pattern.name.length <= 0) {
            return;
      }

      var elementExists = document.getElementById(gameName + "-" + pattern.name);

      if (elementExists) {
            unhidePatternElement(elementExists);
            return;
      }

      let div = document.createElement("div");
      div.classList.add("pattern-element");
      // div.classList.add("hide");
      div.name = pattern.name;
      div.setAttribute("name", pattern.name);
      div.id = gameName + "-" + pattern.name;

      let h2 = document.createElement("h2");
      h2.classList.add("pattern-element-header");
      h2.textContent = pattern.name;

      let img = document.createElement("img");
      let src = removeLeadingDotDotSlash(pattern.gif);
      img.src = src;
      // img.setAttribute("data-gifffer", src);
      div.setAttribute("gif", src);

      // Append elements
      div.appendChild(h2);

      let imgContainer = document.createElement("div");

      imgContainer.classList.add("pattern-img-container");
      div.appendChild(imgContainer);

      imgContainer.appendChild(img);

      let tagBox = document.createElement("div");
      tagBox.classList.add("tag-box");

      div.appendChild(tagBox);

      patternsContainer.appendChild(div);
      allPatternHtmlElements.push(div);

      addLoadingOverlay(imgContainer);

      img.onload = function () {
            var overlay = imgContainer.querySelector(".loading-overlay");

            if (overlay) {
                  imgContainer.removeChild(overlay);
            }

            addShareButton(imgContainer, () => {
                  spawnCopyNotification("Copied To Clipboard!");
                  navigator.clipboard.writeText(window.location.href + "?search=" + pattern.name.replace(" ", "+"));
            });

            addFavoButton(imgContainer, gameName, pattern.name);
      };

      pattern.tags.sort().forEach(function (tag) {
            div.classList.add(tag.toLowerCase());

            let tagElement = document.createElement("div");
            tagElement.textContent = tag;
            tagElement.classList.add("tag-element");
            tagBox.appendChild(tagElement);
      });
}

var welcomeText = document.getElementById("welcome-text");

function updateWelcomeText(show) {
      if (!show) {
            welcomeText.style.display = "none";
            return;
      }

      let totalPatternCount = 0;
      let gamesCount = 0;
      data.forEach((game) => {
            gamesCount += 1;
            game.patterns.forEach((pattern) => {
                  totalPatternCount += 1;
            });
      });

      welcomeText.style.display = "block";

      if (!isFavoModeOn()) {
            welcomeText.innerHTML = `<b class="bold">Welcome to the Bullet Hell Database!</b><br>You are currently viewing <div class="number">${randomPatterns}</div> random out of <div class="number">${totalPatternCount}</div> bullet hell GIFs spread across a total of <div class="number">${gamesCount}</div> games. <a href="disclaimer.html">Enjoy!</a><br><span class="hint">
            Please note that this is not a complete collection and just contains GIFs deemed noteworthy by the author of this website.</span>`;
      } else {
            welcomeText.innerHTML = "You currently have no favorites. :( Hope you soon find some!";
      }
}

function addLoadingOverlay(parent) {
      // Create overlay element
      var overlay = document.createElement("div");
      overlay.className = "loading-overlay";

      // Create loading text element
      var loadingElement = document.createElement("div");
      loadingElement.className = "loader";
      overlay.appendChild(loadingElement);

      // Append overlay to the div
      parent.appendChild(overlay);
}

let navigation = document.getElementById("navigation");
let tagInputsContainer = document.getElementById("tag-inputs");
// tagInputsContainer.id = "tag-inputs";
// navigation.appendChild(tagInputsContainer);

let checkboxElements = [];

const orderedTags = {
      //enemy type
      boss: "enemy-type",
      "non-boss": "enemy-type",

      //Descriptive
      bouba: "descriptive",
      kiki: "descriptive",

      //Emission
      nova: "emission",
      directional: "emission",
      spread: "emission",
      random: "emission",
      parallel: "emission",

      //Shape
      line: "shape",
      squiggly: "shape",
      shape: "shape",
      funny: "shape",

      //Flying
      forward: "flying",
      homing: "flying",
      spiral: "flying",
      spinning: "flying",
      reverse: "flying",
      bounce: "flying",
      boomerang: "flying",

      // non-projectile
      area: "non-projectile",
      laser: "non-projectile",
      shockwave: "non-projectile",
      mortar: "non-projectile",
      trail: "non-projectile",

      //Gimmicks
      summon: "gimmick",

      transformation: "gimmick",
      "on-death": "gimmick",
      "sub-emission": "gimmick",

      //Movement
      teleport: "movement",
      dash: "movement",

      //special
      complex: "special",
      difficult: "special",
      creative: "special",
};

function orderAndCategorizeTags(tags) {
      // Create a new Map to hold categorized tags
      let categorizedTags = new Map();

      // Initialize categories
      for (let category in orderedTags) {
            categorizedTags.set(orderedTags[category], []);
      }

      // Categorize the tags
      for (let tag of tags) {
            if (tag in orderedTags) {
                  let category = orderedTags[tag];
                  categorizedTags.get(category).push(tag);
            } else {
                  // The tag is not categorized
                  if (!categorizedTags.has("uncategorized")) {
                        categorizedTags.set("uncategorized", []);
                  }
                  categorizedTags.get("uncategorized").push(tag);
            }
      }

      // Alphabetically sort the tags in each category
      for (let [category, tags] of categorizedTags.entries()) {
            categorizedTags.set(category, tags.sort());
      }

      // Get the order of categories from orderedTags
      let categoryOrder = [...new Set(Object.values(orderedTags))];

      // Push "uncategorized" at the end
      categoryOrder.push("uncategorized");

      // Merge all categories
      let sortedTags = [];
      for (let category of categoryOrder) {
            if (categorizedTags.has(category)) {
                  sortedTags.push(...categorizedTags.get(category));
            }
      }

      return sortedTags;
}

//set up the tag checkboxes
let tagSetUncategorized = [...new Set(tags)];
let tagSet = orderAndCategorizeTags(tagSetUncategorized);

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

      if (orderedTags[tag]) {
            inputParent.classList.add(orderedTags[tag]);
      }

      const savedValue = localStorage.getItem(checkbox.id);
      if (savedValue) {
            checkbox.checked = savedValue === "true";
      }
      inputParent.appendChild(checkbox);
      checkbox.addEventListener("input", () => {
            localStorage.setItem(checkbox.id, checkbox.checked);
            refreshPatternContainer();
      });
      tagInputsContainer.appendChild(inputParent);
      checkboxElements.push(checkbox);
});

const searchField = document.getElementById("search");
let timeoutId = null;
let timeoutId2 = null;
let timeoutId3 = null;

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

var randomPatterns = 8;

function refreshPatternContainer() {
      // Clear any existing timeouts
      if (timeoutId3) {
            clearTimeout(timeoutId3);
      }

      // Set a new timeout
      timeoutId3 = setTimeout(() => {
            refreshPatternContainerNow();
      }, 1000);
}

var patternQueue = new Queue();

function enqueuePatternElementToShow(gameName, pattern) {
      patternQueue.enqueue({ gameName: gameName, pattern: pattern });
}

function dequeuePatternsAndShow(amount) {
      for (let i = 0; i < amount; i++) {
            if (patternQueue.any()) {
                  let obj = patternQueue.dequeue();
                  showPatternElement(obj.gameName, obj.pattern);
            }
      }

      refreshLoadMoreButton();

      //set tags active and inactive
      console.log("update tags");
      const allTagElements = Array.prototype.slice.call(document.getElementsByClassName("tag-element"), 0);
      allTagElements.forEach(function (tagElement) {
            if (activeTags.includes(tagElement.textContent)) {
                  tagElement.classList.remove("inactive-tag");
            } else {
                  tagElement.classList.add("inactive-tag");
            }
      });

      sortChildrenByName(patternsContainer);
      onSliderChanged();
}

var activeTags = [];

function refreshPatternContainerNow() {
      activeTags = [];
      checkboxElements.forEach(function (checkbox) {
            if (checkbox.checked) {
                  activeTags.push(checkbox.value);
            }
      });

      allPatternHtmlElements.forEach(function (patternElement) {
            hidePatternElement(patternElement);
      });

      patternQueue.clear();

      let randomSelection = getRandomPatterns(randomPatterns);

      updateWelcomeText(false);
      clearBadFavorites();

      if (
            searchField.value.length == 0 &&
            activeTags.length == 0 &&
            !isFavoModeOn() &&
            gameSelect.value == "All Games"
      ) {
            randomSelection.forEach(function (pattern) {
                  showPatternElement(pattern.gameName, pattern);
            });
            updateWelcomeText(true);
      } else {
            data.forEach(function (game) {
                  if (gameSelect.value == "All Games" || gameSelect.value == game.name) {
                        game.patterns.forEach(function (pattern) {
                              if (
                                    pattern.name.toLowerCase().includes(searchField.value.toLowerCase()) ||
                                    searchField.value.length == 0
                              ) {
                                    if (
                                          activeTags.length == 0 ||
                                          activeTags.every((tag) => pattern.tags.includes(tag))
                                    ) {
                                          if (isFavoModeOn()) {
                                                if (getFavorites().length == 0) {
                                                      updateWelcomeText(true);
                                                }

                                                if (isFavourited(game.name, pattern.name)) {
                                                      enqueuePatternElementToShow(game.name, pattern);
                                                }
                                          } else {
                                                enqueuePatternElementToShow(game.name, pattern);
                                          }
                                    }
                              }
                        });
                  }
            });
      }

      patternQueue.sort();
      dequeuePatternsAndShow(10);
}

var loadMoreButton = document.getElementById("load-more-button");
loadMoreButton.addEventListener("click", onPressLoadMoreButton);

function refreshLoadMoreButton() {
      if (patternQueue.isEmpty()) {
            loadMoreButton.style.display = "none";
      } else {
            loadMoreButton.style.display = "block";
            let visibleElements = countVisibleElements("pattern-element");
            loadMoreButton.innerText = `LOAD 10 MORE [showing ${visibleElements}/${
                  visibleElements + patternQueue.size()
            }]`;
      }
}

function countVisibleElements(className) {
      const elements = document.getElementsByClassName(className);
      let count = 0;

      for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const computedStyle = window.getComputedStyle(element);

            if (computedStyle.display !== "none") {
                  count++;
            }
      }

      return count;
}

function sortChildrenByName(parentElement) {
      const children = Array.from(parentElement.children);
      children.sort(function (a, b) {
            var nameA = a.getAttribute("name").toLowerCase();
            var nameB = b.getAttribute("name").toLowerCase();

            // Extract name parts and numeric values from names
            var namePartA = nameA.replace(/\d+$/, "").trim();
            var namePartB = nameB.replace(/\d+$/, "").trim();
            var numberA = parseInt(nameA.match(/\d+$/));
            var numberB = parseInt(nameB.match(/\d+$/));

            // Compare alphabetically first
            if (namePartA < namePartB) return -1;
            if (namePartA > namePartB) return 1;

            // If names are equal alphabetically, compare numerically if numbers exist
            if (!isNaN(numberA) && !isNaN(numberB)) {
                  return numberA - numberB;
            } else if (!isNaN(numberA)) {
                  // 'a' has a number, but 'b' does not, 'a' should come after 'b'
                  return 1;
            } else if (!isNaN(numberB)) {
                  // 'b' has a number, but 'a' does not, 'b' should come after 'a'
                  return -1;
            }

            // if both are NaN, they are equal
            return 0;
      });

      for (const child of children) {
            parentElement.appendChild(child);
      }
}

function onPressLoadMoreButton() {
      dequeuePatternsAndShow(10);
}

function hidePattern(gameName, patternName) {
      let patternElement = document.getElementById(gameName + "-" + patternName);
      if (patternElement) {
            hidePatternElement(patternElement);
      }
}

function hidePatternElement(patternElement) {
      patternElement.classList.add("hide");
}

function unhidePatternElement(patternElement) {
      patternElement.classList.remove("hide");
}

function showPatternElement(gameName, pattern) {
      createPatternDisplay(gameName, pattern);
}

function getRandomPatterns(count) {
      const allPatterns = data.flatMap((game) =>
            game.patterns
                  .filter((pattern) => pattern.name && pattern.name.length > 0)
                  .map((pattern) => ({ ...pattern, gameName: game.name }))
      );

      const shuffledPatterns = shuffleArray(allPatterns);
      const selectedPatterns = shuffledPatterns.slice(0, count);

      return selectedPatterns;
}

// Helper function to shuffle an array randomly
function shuffleArray(array) {
      const shuffledArray = [...array];
      for (let i = shuffledArray.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[randomIndex]] = [shuffledArray[randomIndex], shuffledArray[i]];
      }
      return shuffledArray;
}

const sizeSlider = document.getElementById("size-slider");
sizeSlider.addEventListener("input", onSliderChanged);

function onSliderChanged() {
      let val = sizeSlider.value;

      let minWidthElement = 220;
      let maxWidthElement = 880;

      let elements = Array.prototype.slice.call(document.getElementsByClassName("pattern-element"));
      elements.forEach(function (element) {
            element.style.width = lerp(minWidthElement, maxWidthElement, val) + "px";
      });

      let headerFontSizeMin = 14;
      let headerFontSizeMax = 36;

      let headers = Array.prototype.slice.call(document.getElementsByClassName("pattern-element-header"));
      headers.forEach(function (header) {
            header.style.fontSize = lerp(headerFontSizeMin, headerFontSizeMax, val) + "px";
      });

      let tagsFontSizeMin = 10;
      let tagsFontSizeMax = 28;

      let tagBoxes = Array.prototype.slice.call(document.getElementsByClassName("tag-box"));
      tagBoxes.forEach(function (tagBox) {
            tagBox.style.fontSize = lerp(tagsFontSizeMin, tagsFontSizeMax, val) + "px";
      });
}

//t goes from 0 to 100
function lerp(start, end, t) {
      return start * (1 - t / 100) + end * (t / 100);
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

// ?search=Lich
const searchInput = urlParams.get("search");

if (searchInput && searchInput.length > 0) {
      searchField.value = searchInput.replace("+", " ");
      gameSelect.value = "All Games";
      checkboxElements.forEach(function (checkbox) {
            checkbox.checked = false;
      });
}

refreshPatternContainer();

function addShareButton(parent, callback) {
      // Create a new share button element
      var shareButton = document.createElement("button");

      // Apply CSS styles to the share button
      shareButton.classList.add("share-button");

      // Add the SVG icon to the share button
      var icon = document.createElement("img");
      icon.src = "assets/website/share.svg";
      icon.alt = "Share";
      shareButton.appendChild(icon);

      // Add a click event listener to the share button
      shareButton.addEventListener("click", callback);

      // Append the share button to the parent element
      parent.appendChild(shareButton);
}

function addFavoButton(parent, gameName, patternName) {
      // Create a new share button element
      var favoButton = document.createElement("button");

      // Apply CSS styles to the share button
      favoButton.classList.add("favo-button");

      // Add the SVG icon to the share button
      var icon = document.createElement("img");

      icon.alt = "Favo";
      favoButton.appendChild(icon);

      // Add a click event listener to the share button
      favoButton.addEventListener("click", () => {
            if (isFavourited(gameName, patternName)) {
                  unfavorite(gameName, patternName);
                  spawnCopyNotification("Unfavorited!");
            } else {
                  addToFavorites(gameName, patternName);
                  spawnCopyNotification("Favorited!");
            }

            updateFavoButtonImage(icon, gameName, patternName);

            if (timeoutId2) {
                  clearTimeout(timeoutId2);
            }

            timeoutId2 = setTimeout(() => {
                  if (isFavoModeOn()) {
                        refreshPatternContainer();
                  }
            }, 1000);
      });

      parent.appendChild(favoButton);
      updateFavoButtonImage(icon, gameName, patternName);
}

function updateFavoButtonImage(iconElement, gameName, patternName) {
      if (isFavourited(gameName, patternName)) {
            iconElement.src = "assets/website/favo-filled.svg";
      } else {
            iconElement.src = "assets/website/favo-empty.svg";
      }
}

function spawnCopyNotification(text) {
      var notification = document.createElement("div");
      notification.classList.add("copyNotification");
      notification.textContent = text;

      document.body.appendChild(notification);

      var mouseX = event.clientX;
      var mouseY = event.clientY + window.pageYOffset; // Add scroll offset
      notification.style.left = mouseX + "px";
      notification.style.top = mouseY + "px";

      setTimeout(function () {
            notification.style.animation = "floatUp 2s forwards";
      }, 10); // Start the animation after a brief delay

      setTimeout(function () {
            notification.parentNode.removeChild(notification);
      }, 2000); // Remove notification after 2 seconds
}

window.addEventListener("load", () => {
      let header = document.getElementById("header");
      let height = header.getBoundingClientRect().height;

      let bodyOffsetElement = document.getElementById("body-offset");
      bodyOffsetElement.style.height = height * 1.05 + "px";
});
