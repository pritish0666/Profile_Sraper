chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "collectProfileData") {
    
    const profileData = {
      name:
        document.querySelector(
          ".text-heading-xlarge.inline.t-24.v-align-middle.break-words"
        )?.innerText || "N/A", 
      url: window.location.href,
      
      bio:
        document.querySelector(".text-body-medium.break-words")?.innerText ||
        "N/A",
      location:
        document.querySelector(
          ".text-body-small.inline.t-black--light.break-words"
        )?.innerText || "N/A",
      followerCount:
        document
          .querySelector(".text-body-small.t-black--light.inline-block")
          ?.innerText.replace(/\D/g, "") || "0", 
      connectionCount:
        document
          .querySelector(".text-body-small .t-bold")
          ?.innerText.replace(/\D/g, "") || "0", 
    };

    
    chrome.runtime.sendMessage({
      action: "profileDataCollected",
      data: profileData,
    });
  }
});
