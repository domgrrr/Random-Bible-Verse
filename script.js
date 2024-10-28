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
    const span = document.createElement('span');
    span.textContent = char;
    span.className = 'char';
    span.style.animationDelay = `${index * 100}ms`;
    element.appendChild(span);
  });
}

function displayVerse(content, reference) {
  const verseElement = document.getElementById('verse');
  const referenceElement = document.getElementById('reference');

  //  Reset classes
  verse.Element.className = '';
  referenceElement.className = '';

  //  Start animation
  setTimeout(() => {
    animateText(content, verseElement);
    referenceElement.textContent = reference;
    referenceElement.classList.add('animate');
  }, 100);

  document.getElementById('copy-button').style.display = 'inline-block';
}

function displayHistoryItem(index) {
  const item = verseHistory[index];
  displayVerse(item.content, item.reference);
}

async function getRandomVerse() {
  const errorElement = document.getElementById('error');
  const loadingSpinner = document.getElementById('loading-spinner');
  const getVerseButton = document.getElementById('get-verse-button');

  errorElement.textContent = '';
  loadingSpinner.style.display = 'inline-block';
  getVerseButton.disabled = true;

  try {
    //  First, get a list of available books
    const booksResponse = await fetch(`${API_BASE_URL}/bibles/${BIBLE_ID}/books`, {
      headers: { 'api-key': API_KEY }
    });

    if (!booksResponse.ok) throw new Error(`API error: ${booksResponse.statusText}`);

    const booksData = await booksResponse.json();
    const randomBook = booksData.data[Math.floor(Math.random() * booksData.data.length)];

    const chaptersResponse = await fetch(
      `${API_BASE_URL}/bibles/${BIBLE_ID}/books/${randomBook.id}/chapters`,
      { headers: { 'api-key': API_KEY } }
    );

    if (!chaptersResponse.ok) thow new Error(`API error: ${chaptersResponse.statusText}`);

    
  }
}