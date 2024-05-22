document.addEventListener('DOMContentLoaded', () => {
    const quoteList = document.getElementById('quote-list');
    const newQuoteForm = document.getElementById('new-quote-form');
  
    // Function to fetch quotes and populate the list
    function fetchQuotes() {
      fetch('http://localhost:3000/quotes?_embed=likes')
        .then(response => response.json())
        .then(quotes => {
          quoteList.innerHTML = '';
          quotes.forEach(renderQuote);
        });
    }
  
    // Function to render a single quote
    function renderQuote(quote) {
      const li = document.createElement('li');
      li.classList.add('quote-card');
      li.innerHTML = `
        <blockquote class="blockquote">
          <p class="mb-0">${quote.quote}</p>
          <footer class="blockquote-footer">${quote.author}</footer>
          <br>
          <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
          <button class='btn-danger'>Delete</button>
        </blockquote>
      `;
  
      // Delete quote
      li.querySelector('.btn-danger').addEventListener('click', () => {
        deleteQuote(quote.id, li);
      });
  
      // Like quote
      li.querySelector('.btn-success').addEventListener('click', () => {
        likeQuote(quote.id, li);
      });
  
      quoteList.appendChild(li);
    }
  
    // Function to delete a quote
    function deleteQuote(id, element) {
      fetch(`http://localhost:3000/quotes/${id}`, {
        method: 'DELETE'
      })
      .then(response => {
        if (response.ok) {
          element.remove();
        }
      });
    }
  
    // Function to like a quote
    function likeQuote(id, element) {
      fetch('http://localhost:3000/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quoteId: id,
          createdAt: Math.floor(Date.now() / 1000)
        })
      })
      .then(response => response.json())
      .then(() => {
        const likesSpan = element.querySelector('.btn-success span');
        likesSpan.textContent = parseInt(likesSpan.textContent) + 1;
      });
    }
  
    // Function to handle new quote submission
    newQuoteForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const newQuote = document.getElementById('new-quote').value;
      const author = document.getElementById('author').value;
  
      fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quote: newQuote,
          author: author
        })
      })
      .then(response => response.json())
      .then(quote => {
        quote.likes = []; // Initialize likes array for the new quote
        renderQuote(quote);
        newQuoteForm.reset();
      });
    });
  
    // Initial fetch to populate quotes
    fetchQuotes();
  });
  