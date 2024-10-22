## Random Bible Verse

# 1.  index.html

  A.  Create a new file called index.html

  B.  Declare the doc as HTML5 and set as English Language

  C.  Create a head element that includes:

    * UTF-8

    * Responsive for mobile devices

    * Title

    * Import Google Fonts for verse text

    * Link to external CSS file

  D.  Create a body element to contain all visible content that includes:

    * A div with the class of container for centering content

        * Inside the div container an h1 of Random Bible Verse

        * Alongside that h1 another div with the id of verse-container for the verse display area

            * Inside the div verse-container a p element with the id of verse labeled Click the button to get a verse

            * Alongside the p element verse another p element with the id of reference with no label where the verse reference will be displayed (book, chapter, verse)

            * Alongside the p element reference a button element with the id copy-button class button copy-button style display: none labeled Copy Verse to copy verse to clipboard (hidden initially)

        * Alongside the div container include a button element with the id get-verse-button and class button to fetch a new random verse labeled Get Random Verse

            * Inside the div container include a span with the id loading-spinner and class loading style display: none with no label for the loading spinner hidden initially

        * Alongside the div container include a p element with the id error for displaying error messages


# 2.  styles.css

# 3.  script.js