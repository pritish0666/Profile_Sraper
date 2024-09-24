let profileLinks = [];
let currentIndex = 0;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "collectData") {
    profileLinks = request.links;
    currentIndex = 0;
    processNextProfile();
  } else if (request.action === "profileDataCollected") {
    sendDataToBackend(request.data);
  }
});

function processNextProfile() {
  if (currentIndex < profileLinks.length) {
    chrome.tabs.update({ url: profileLinks[currentIndex] }, function (tab) {
      setTimeout(function () {
        chrome.tabs.sendMessage(tab.id, { action: "collectProfileData" });
      }, 5000); 
    });
  }
}

function sendDataToBackend(data) {
  fetch("http://localhost:3000/api/profiles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      currentIndex++;
      processNextProfile();
    })
    .catch((error) => {
      console.error("Error:", error);
      currentIndex++;
      processNextProfile();
    });
}
