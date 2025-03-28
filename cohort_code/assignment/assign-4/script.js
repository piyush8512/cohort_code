let books = [];
let currentPage = 1;
let pageLimit = 20;
let totalBooks = 0;
let totalPages = 1;
let visiblePages = 3;

const main = document.querySelector('main');
const gridViewBtn = document.querySelector('.grid-view');
const listViewBtn = document.querySelector('.list-view');
const searchInput = document.querySelector('#search');
const searchBtn = document.querySelector('#search-btn');
const sortSelect = document.querySelector('#sort');

async function fetchData() {
    // Defineing variable  API with paage limit and current page
    const url = `https://api.freeapi.app/api/v1/public/books?page=${currentPage}&limit=${pageLimit}`;
    // Set up get request and header
    const options = { method: 'GET', headers: { accept: 'application/json' } };
    try {
        // Fetching data from the API 
        const response = await fetch(url, options);     
        // Convert the response into JSON format
        const data = await response.json();
        // Check if the API response was successful and contains data
        if (data.success && data.data) {
            // Get the total number of books available
            totalBooks = data.data.totalItems;    
            // Calculate the total number of pages based on the page limit
            totalPages = Math.ceil(totalBooks / pageLimit);           
            // Extract the books data from the API response
            books = data.data.data;
            // Render books default format grid
            renderBooks(books, 'grid'); 
            // call the renderPagination function
            renderPagination();
        }
    } catch (error) {
        console.log('Error fetching data:', error);
    }
}

//breakdown long description
function truncateDescription(description) {
    // Checking if description is empty or undefined, return an empty
    if (!description) return '';
    // Split the description into an array of words
    const words = description.split(' ');
    // If the description has more than 15 words, truncate it and add '...'
    if (words.length > 15) {
        return words.slice(0, 15).join(' ') + '...';
    }
    return description;
}

function renderBooks(books, viewType) {
    main.innerHTML = '';
    // book loop
    books.forEach((book) => {
        const { imageLinks, title, authors, description, publishedDate, previewLink } = book.volumeInfo || {};
        const thumbnail = imageLinks?.thumbnail || 'https://via.placeholder.com/150x200?text=No+Image';
        const authorText = authors?.join(', ') || 'Unknown Author'
        const dateText = publishedDate || 'Unknown Date';
        // truncated description if available, otherwise show a default message
        const descText = description ? truncateDescription(description) : 'No description available';
        // Create a new div element for the book card
        const card = document.createElement('div');
        card.classList.add(viewType === 'grid' ? 'card-grid' : 'card-list');
        // Seting the inner HTML structure of the book card
        card.innerHTML = `
            <img class="img" src="${thumbnail}" alt="${title || 'Untitled'}">
            <div class="card-content">
              <h3 class="title">${title || 'Untitled'}</h3>
              <p class="author">By ${authorText}</p>
              <p class="description">${descText}</p>
              <p class="date">${dateText}</p>
              <!-- Show 'Show More' link only if the description is longer than 15 characters -->
              ${description && description.length > 15 ? `<span><a href="${previewLink || '#'}" target="_blank" class="show-more">Show More</a></span>` : ''}
            </div>
        `;
        main.appendChild(card);
    });
}


function renderPagination() {
    const pageNumbers = document.getElementById('page-numbers');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    // Disable the "Previous" button if on the first page
    prevBtn.disabled = currentPage === 1;
    // Disable the "Next" button if on the last page
    nextBtn.disabled = currentPage === totalPages;
    pageNumbers.innerHTML = '';
    // Calculating the starting page number
// Ensure the startPage is at least 1 and centered around the current page
let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
// Calculate the ending page number
// It should not exceed the total number of pages
let endPage = Math.min(totalPages, startPage + visiblePages - 1);
// Adjust startPage if the number of pages displayed is less than visiblePages
// This ensures that we always display the correct number of pages if possible
if (endPage - startPage + 1 < visiblePages) {
    startPage = Math.max(1, endPage - visiblePages + 1);
}
    // Generate page number buttons dynamically
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        if (i === currentPage) {
            pageBtn.classList.add('active');
        }
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            fetchData(); 
        });
        pageNumbers.appendChild(pageBtn);
    }
}


function handlePrevPage() {
    if (currentPage > 1) {
        currentPage--;
        fetchData();
    }
}

function handleNextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        fetchData();
        console.log(fetchData())
    }
}

gridViewBtn.addEventListener('click', () => {
    gridViewBtn.classList.add('active');
    listViewBtn.classList.remove('active');
    renderBooks(books, 'grid');
});

listViewBtn.addEventListener('click', () => {
    listViewBtn.classList.add('active');
    gridViewBtn.classList.remove('active');
    renderBooks(books, 'list');
});

searchInput.addEventListener('input', () => {
    currentPage = 1;
    searchBooks();
});

searchBtn.addEventListener('click', searchBooks);

sortSelect.addEventListener('change', () => {
    currentPage = 1;
    sortBooks();
});

document.getElementById('prev-btn').addEventListener('click', handlePrevPage);
document.getElementById('next-btn').addEventListener('click', handleNextPage);

//intial 
gridViewBtn.classList.add('active');
fetchData();

function searchBooks() {
    const search = searchInput.value.toLowerCase();
    const filteredBooks = books.filter((book) => {
        const title = book.volumeInfo?.title?.toLowerCase();
        const author = book.volumeInfo?.authors?.join(' ')?.toLowerCase();
        return title.includes(search) || author.includes(search);
    });

    renderBooks(filteredBooks, gridViewBtn.classList.contains('active') ? 'grid' : 'list');
}

function sortBooks() {
    const sortValue = sortSelect.value;
    let sortedBooks = [...books];
    if (sortValue === 'title-asc') {
        sortedBooks.sort((a, b) => a.volumeInfo?.title.localeCompare(b.volumeInfo?.title));
    } else if (sortValue === 'title-desc') {
        sortedBooks.sort((a, b) => b.volumeInfo?.title.localeCompare(a.volumeInfo?.title));
    } else if (sortValue === 'date-asc') {
        sortedBooks.sort((a, b) => a.volumeInfo?.publishedDate.localeCompare(b.volumeInfo?.publishedDate));
    } else if (sortValue === 'date-desc') {
        sortedBooks.sort((a, b) => b.volumeInfo?.publishedDate.localeCompare(a.volumeInfo?.publishedDate));
    }

    renderBooks(sortedBooks, gridViewBtn.classList.contains('active') ? 'grid' : 'list');
    renderPagination();
}       