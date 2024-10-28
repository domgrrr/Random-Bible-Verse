const API_KEY = "ef58a648aa506d7fdee18f9e119eeb63";
const BIBLE_ID = "9879dbb7cfe39e4d-01";
const API_BASE_URL = "https://api.scripture.api.bible/v1";

const verseHistory = [];
const maxHistoryItems = 5;

//  Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('get-verse-button').addEventListener('click', getRandomVerse);
  document.getElementById('copy-button').addEventListener('click', copyVerse);
});

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}

async function copyVerse() {
  const verse = document.getElementById('verse').textContent;
  const reference = document.getElementById('reference').textContent;
  const textToCopy = `${verse} - ${reference}`;

  try {
    await navigator.clipboard.writeText(textToCopy);
    showToast('Verse copied to clipboard!');
  } catch (err) {
    showToast('Failed to copy verse');
    console.error('Failed to copy text: ', err);
  }
}

function addToHistory(content, reference) {
  const historyItem = { content, reference };
  verseHistory.unshift(historyItem);

  if (verseHistory.length > maxHistoryItems) {
      verseHistory.pop();
  }

  updateHistoryDisplay();
}

function updateHistoryDisplay() {
  const historyContainer = document.getElementById('verse-history');
  historyContainer.innerHTML = verseHistory.map((item, index) => `
    <div class="history-item" onclick="displayHistoryItem(${index})">
      <strong>${item.reference}</strong><br>
      ${item.content.substring(0, 50)}...
    </div>
  `).join('');
}

function animateText(text, element) {
  element.textContent = '';
  element.style.opacity = 1;

  const chars = text.split('');
  chars.forEach((char, index) => {
    
  })
}