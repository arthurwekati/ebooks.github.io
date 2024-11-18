// Global Variable for using multiple Times
const errorMessage = document.getElementById('error-message');
const totalFound = document.getElementById('total-found');
const searchResult = document.getElementById('search-result');

// Loading spinner functions
const loadingDisplay = (display) => {
    document.getElementById('loading').style.display = display;
};
const searchResultDisplay = (display) => {
    document.getElementById('search-result').style.display = display;
};

const loadData = () => {
    // Input value
    const inputValue = document.getElementById('search-field');

    // Error handling for empty input
    if (inputValue.value === '') {
        totalFound.innerHTML = '';
        errorMessage.innerHTML = `<span class='d-block text-gray'>Please, Input a Valid Book Name..!</span>`;
        searchResult.innerHTML = '';
        return;
    }

    // Display spinner
    loadingDisplay('block');
    searchResultDisplay('none');

    // Google Books API URL
    const url = `https://www.googleapis.com/books/v1/volumes?q=${inputValue.value}&maxResults=20`;

    // Fetch data from Google Books API
    fetch(url)
        .then((res) => res.json())
        .then((data) => displayData(data.items))
        .catch((error) => {
            errorMessage.innerHTML = `<span class='d-block text-gray'>Couldn't Get Data. API Error.</span>`;
            loadingDisplay('none');
        });

    // Clear input and error message
    inputValue.value = '';
    totalFound.innerHTML = '';
    errorMessage.innerHTML = '';
};

const displayData = (books) => {
    if (!books || books.length === 0) {
        errorMessage.innerText = `No Results Found!`;
        loadingDisplay('none');
        totalFound.innerHTML = '';
        return;
    }

    // Display total found
    totalFound.innerHTML = `<span class='d-block text-gray'>About ${books.length} Results Found</span>`;

    // Clear previous results
    searchResult.innerHTML = '';

    // Display book details
    books.forEach((book) => {
        const volumeInfo = book.volumeInfo;
        const title = volumeInfo.title || 'Unknown Title';
        const authors = volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author';
        const publisher = volumeInfo.publisher || 'Unknown Publisher';
        const publishYear = volumeInfo.publishedDate || 'Unknown Year';
        const thumbnail = volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/150';

        const div = document.createElement('div');
        div.classList.add('col');
        div.innerHTML = `
      <div class="card mb-3 shadow rounded">
        <div class="row g-0">
          <div class="col-md-4">
            <img class="card-img-top w-100 h-100" src="${thumbnail}" alt="${title}">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title text-success">${title}</h5>
              <p class="card-text"><strong>Author(s):</strong> ${authors}</p>
              <p class="card-text"><strong>Publisher:</strong> ${publisher}</p>
              <p class="card-text"><small class="text-muted">Published: ${publishYear}</small></p>
            </div>
          </div>
        </div>
      </div>`;
        searchResult.appendChild(div);
    });

    // Hide spinner
    loadingDisplay('none');
    searchResultDisplay('flex');
};