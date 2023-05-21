// Now you can use gameData as if it was the parsed JSON
data.forEach(function (game) {
      game.patterns.forEach(function (pattern) {
            // Create new DOM elements
            let div = document.createElement("div");
            let h2 = document.createElement("h2");
            let img = document.createElement("img");

            // Set contents
            h2.textContent = pattern.name;
            img.src = convertDriveLink(pattern.gif);

            // Append elements
            div.appendChild(h2);
            div.appendChild(img);

            // Add to the body of the document
            document.body.appendChild(div);
      });
});

function convertDriveLink(originalLink) {
      // Regular expression to match the file id in the Google Drive link
      const regex = /\/file\/d\/(.*?)\/view\?usp=sharing/;

      // Check if the link is a valid Google Drive link
      if (regex.test(originalLink)) {
            // Extract the file id from the link
            const fileId = originalLink.match(regex)[1];

            // Construct the new link using the file id
            const newLink = `https://drive.google.com/uc?id=${fileId}`;

            // Return the new link
            return newLink;
      } else {
            throw new Error("Invalid Google Drive link.");
      }
}
