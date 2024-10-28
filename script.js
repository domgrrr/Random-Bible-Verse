const API_KEY = "ef58a648aa506d7fdee18f9e119eeb63";
const BIBLE_ID = "9879dbb7cfe39e4d-01";
const API_BASE_URL = "https://api.scripture.api.bible/v1";

const versHistory = [];
const maxHistoryItems = 5;

//  Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('get-verse-button').addEventListener('click', getRandomVerse);
  document.getElementById('copy-button').addEventListener('click', copyVerse);
});

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  
}