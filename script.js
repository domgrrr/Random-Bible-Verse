const API_KEY = "ef58a648aa506d7fdee18f9e119eeb63";
const BIBLE_ID = "de4e12af7f28f599-01";
const API_BASE_URL = "https://api.scripture.api.bible/v1";

const verseHistory = [];
const maxHistoryItems = 5;

// Initialize event listeners
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
    const verse = document.getElementById("verse").textContent;
    const reference = document.getElementById("reference").textContent;
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
    
    const words = text.split('');

    words.forEach((word, index) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word';

        word.split('').forEach((char, charIndex) => {
          const span = document.createElement('span');
          span.textContent = char;
          span.className = 'char';
          span.style.animationDelay = `${(index * words.length + charIndex) * 100}ms`;
          element.appendChild(span);
        });

        //  Add space after word
        if (index < words.length - 1) {
          const space = document.createTextNode(' ');
          element.appendChild(wordSpan);
          element.appendChile(space);
        }
    });
}

function displayVerse(content, reference) {
    const verseElement = document.getElementById("verse");
    const referenceElement = document.getElementById("reference");
    
    // Reset classes
    verseElement.className = '';
    referenceElement.className = '';

    //  Cleanup the content by fixing common split and issues
    content = content
      .replace(/ o f /g, ' of ')
      .replace(/ c overed/g, ' covered')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Start animations
    setTimeout(() => {
        animateText(content, verseElement);
        referenceElement.textContent = reference
          .replace(/undefined/g, '')
          .trim();
        referenceElement.classList.add('animated');
    }, 100);
    
    document.getElementById("copy-button").style.display = "inline-block";
}

function displayHistoryItem(index) {
    const item = verseHistory[index];
    displayVerse(item.content, item.reference);
}

async function getRandomVerse() {
    const errorElement = document.getElementById("error");
    const loadingSpinner = document.getElementById("loading-spinner");
    const getVerseButton = document.getElementById("get-verse-button");
    
    errorElement.textContent = "";
    loadingSpinner.style.display = "inline-block";
    getVerseButton.disabled = true;

    try {
        // First, get a list of available books
        const booksResponse = await fetch(`${API_BASE_URL}/bibles/${BIBLE_ID}/books`, {
            headers: { 'api-key': API_KEY }
        });

        if (!booksResponse.ok) throw new Error(`API error: ${booksResponse.statusText}`);
        
        const booksData = await booksResponse.json();
        const randomBook = booksData.data[Math.floor(Math.random() * booksData.data.length)];

        // Get chapters for the selected book
        const chaptersResponse = await fetch(
            `${API_BASE_URL}/bibles/${BIBLE_ID}/books/${randomBook.id}/chapters`,
            { headers: { 'api-key': API_KEY } }
        );

        if (!chaptersResponse.ok) throw new Error(`API error: ${chaptersResponse.statusText}`);
        
        const chaptersData = await chaptersResponse.json();
        const randomChapter = chaptersData.data[1 + Math.floor(Math.random() * (chaptersData.data.length - 1))];

        // Get verses for the selected chapter
        const versesResponse = await fetch(
            `${API_BASE_URL}/bibles/${BIBLE_ID}/chapters/${randomChapter.id}/verses`,
            { headers: { 'api-key': API_KEY } }
        );

        if (!versesResponse.ok) throw new Error(`API error: ${versesResponse.statusText}`);
        
        const versesData = await versesResponse.json();
        const randomVerse = versesData.data[Math.floor(Math.random() * versesData.data.length)];

        // Get the content of the selected verse
        const verseResponse = await fetch(
            `${API_BASE_URL}/bibles/${BIBLE_ID}/verses/${randomVerse.id}?content-type=text`,
            { headers: { 'api-key': API_KEY } }
        );

        if (!verseResponse.ok) throw new Error(`API error: ${verseResponse.statusText}`);
        
        const verseData = await verseResponse.json();
        const content = verseData.data.content;
        const reference = `${randomBook.name} ${randomChapter.number}:${randomVerse.number}`;
        
        displayVerse(content, reference);
        addToHistory(content, reference);

    } catch (error) {
        console.error("Error:", error);
        errorElement.textContent = `Error: ${error.message}. Please check the console for more details.`;
        document.getElementById("verse").textContent = "An error occurred while fetching the verse. Please try again.";
        document.getElementById("reference").textContent = "";
    } finally {
        loadingSpinner.style.display = "none";
        getVerseButton.disabled = false;
    }
}