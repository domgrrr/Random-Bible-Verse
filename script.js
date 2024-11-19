const API_KEY = "ef58a648aa506d7fdee18f9e119eeb63";
const BIBLE_ID = "de4e12af7f28f599-01";
const API_BASE_URL = "https://api.scripture.api.bible/v1";

const verseHistory = [];
const maxHistoryItems = 5;

// Initialize Lottie animation with error handling
let doveAnimation;
try {
    doveAnimation = lottie.loadAnimation({
        container: document.getElementById('dove-animation'),
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: './animations/dove.json'
    });
} catch (error) {
    console.error('Error initializing Lottie:', error);
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    const getVerseButton = document.getElementById('get-verse-button');
    const copyButton = document.getElementById('copy-button');
    
    if (getVerseButton) {
        getVerseButton.addEventListener('click', getRandomVerse);
    }
    
    if (copyButton) {
        copyButton.addEventListener('click', copyVerse);
    }

    // Hide dove initially if it exists
    const doveContainer = document.getElementById('dove-animation');
    if (doveContainer) {
        doveContainer.style.opacity = '0';
    }
});

function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.style.display = 'block';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }
}

async function copyVerse() {
    const verse = document.getElementById("verse")?.textContent || '';
    const reference = document.getElementById("reference")?.textContent || '';
    const textToCopy = `${verse} - ${reference}`;
    
    try {
        await navigator.clipboard.writeText(textToCopy);
        showToast('Verse copied to clipboard!');
    } catch (err) {
        console.error('Failed to copy text:', err);
        showToast('Failed to copy verse');
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
    if (historyContainer) {
        historyContainer.innerHTML = verseHistory.map((item, index) => `
            <div class="history-item" onclick="displayHistoryItem(${index})">
                <strong>${item.reference}</strong><br>
                ${item.content.substring(0, 50)}...
            </div>
        `).join('');
    }
}

function animateText(text, element) {
    if (!element) return;
    
    element.textContent = '';
    element.style.opacity = 1;
    
    let totalDelay = 0;
    const words = text.split(' ');
    
    words.forEach((word, wordIndex) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word';
        wordSpan.style.display = 'inline';
        
        word.split('').forEach((char) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.className = 'char';
            span.style.animationDelay = `${totalDelay * 50}ms`;
            wordSpan.appendChild(span);
            totalDelay++;
        });
        
        element.appendChild(wordSpan);
        
        if (wordIndex < words.length - 1) {
            const spaceSpan = document.createElement('span');
            spaceSpan.innerHTML = '&nbsp;';
            spaceSpan.className = 'char space';
            spaceSpan.style.animationDelay = `${totalDelay * 50}ms`;
            element.appendChild(spaceSpan);
            totalDelay++;
        }
    });
}

function displayVerse(content, reference) {
    const verseElement = document.getElementById("verse");
    const referenceElement = document.getElementById("reference");
    const doveContainer = document.getElementById('dove-animation');
    const copyButton = document.getElementById("copy-button");
    
    if (!verseElement || !referenceElement) return;
    
    // Reset classes
    verseElement.className = '';
    referenceElement.className = '';
    
    // Handle dove animation if it exists
    if (doveAnimation && doveContainer) {
        doveContainer.style.opacity = '1';
        doveAnimation.goToAndPlay(0);
        
        // Only add event listener if it hasn't been added before
        const animationCompleteHandler = () => {
            setTimeout(() => {
                doveContainer.style.opacity = '0';
            }, 1000);
            doveAnimation.removeEventListener('complete', animationCompleteHandler);
        };
        
        doveAnimation.addEventListener('complete', animationCompleteHandler);
    }
    
    // Start verse animations
    setTimeout(() => {
        animateText(content, verseElement);
        referenceElement.textContent = reference;
        referenceElement.classList.add('animated');
    }, 100);
    
    // Show copy button
    if (copyButton) {
        copyButton.style.display = "inline-block";
    }
}

function displayHistoryItem(index) {
    const item = verseHistory[index];
    if (item) {
        displayVerse(item.content, item.reference);
    }
}

async function getRandomVerse() {
    const errorElement = document.getElementById("error");
    const loadingSpinner = document.getElementById("loading-spinner");
    const getVerseButton = document.getElementById("get-verse-button");
    
    if (!errorElement || !loadingSpinner || !getVerseButton) return;
    
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
        const verseElement = document.getElementById("verse");
        const referenceElement = document.getElementById("reference");
        
        if (verseElement) {
            verseElement.textContent = "An error occurred while fetching the verse. Please try again.";
        }
        if (referenceElement) {
            referenceElement.textContent = "";
        }
    } finally {
        loadingSpinner.style.display = "none";
        getVerseButton.disabled = false;
    }
}