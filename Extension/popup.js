document.getElementById("collectData").addEventListener("click", function () {
  const links = document
    .getElementById("links")
    .value.split("\n")
    .filter((link) => link.trim() !== "");

  if (links.length < 3) {
    alert("Please provide at least 3 LinkedIn profile links.");
    return;
  }

  chrome.runtime.sendMessage({ action: "collectData", links: links });
  window.close();
});
