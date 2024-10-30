const API_KEY = "ef58a648aa506d7fdee18f9e119eeb63";
const BIBLE_ID = "de4e12af7f28f599-01";
const API_BASE_URL = "https://api.scripture.api.bible/v1";

export async function fetchRandomVerse() {
    try {
        // Get list of books
        const booksResponse = await fetch(`${API_BASE_URL}/bibles/${BIBLE_ID}/books`, {
            headers: { 'api-key': API_KEY }
        });
        
        if (!booksResponse.ok) throw new Error('Failed to fetch books');
        const booksData = await booksResponse.json();
        const randomBook = booksData.data[Math.floor(Math.random() * booksData.data.length)];

        // Get chapters
        const chaptersResponse = await fetch(
            `${API_BASE_URL}/bibles/${BIBLE_ID}/books/${randomBook.id}/chapters`,
            { headers: { 'api-key': API_KEY } }
        );
        
        if (!chaptersResponse.ok) throw new Error('Failed to fetch chapters');
        const chaptersData = await chaptersResponse.json();
        const randomChapter = chaptersData.data[1 + Math.floor(Math.random() * (chaptersData.data.length - 1))];

        // Get verses
        const versesResponse = await fetch(
            `${API_BASE_URL}/bibles/${BIBLE_ID}/chapters/${randomChapter.id}/verses`,
            { headers: { 'api-key': API_KEY } }
        );
        
        if (!versesResponse.ok) throw new Error('Failed to fetch verses');
        const versesData = await versesResponse.json();
        const randomVerse = versesData.data[Math.floor(Math.random() * versesData.data.length)];

        // Get verse content
        const verseResponse = await fetch(
            `${API_BASE_URL}/bibles/${BIBLE_ID}/verses/${randomVerse.id}?content-type=text`,
            { headers: { 'api-key': API_KEY } }
        );
        
        if (!verseResponse.ok) throw new Error('Failed to fetch verse content');
        const verseData = await verseResponse.json();
        
        return {
            content: cleanVerseText(verseData.data.content),
            reference: `${randomBook.name} ${randomChapter.number}:${randomVerse.number}`
        };
    } catch (error) {
        throw new Error('Failed to fetch verse: ' + error.message);
    }
}

function cleanVerseText(text) {
    return text
        .replace(/ o f /g, ' of ')
        .replace(/ c overed/g, ' covered')
        .replace(/\s+/g, ' ')
        .trim();
}