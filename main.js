document.addEventListener('DOMContentLoaded', function () {
    const bookshelf = {
      incomplete: document.getElementById('incompleteBookshelfList'),
      complete: document.getElementById('completeBookshelfList'),
    };
  
    function buatBuku(id, title, author, year, isComplete) {
      let book = {
        id: +new Date(),
        title,
        author,
        year,
        isComplete,
      };
      return book;
    }
  
    function tambahKeRak(book, targetShelf) {
      const bookItem = buatBukuItem(book);
      targetShelf.appendChild(bookItem);
      updateLocalStorage();
    }
  
    function hapusDariRak(bookItem) {
      const parentShelf = bookItem.parentNode;
      parentShelf.removeChild(bookItem);
      updateLocalStorage();
    }
  
    function pindahBukuKe(bookItem, targetShelf) {
      const clonedBookItem = bookItem.cloneNode(true);
      const isCompleteButton = clonedBookItem.querySelector('button.green');
      if (isCompleteButton) {
        isCompleteButton.innerText = targetShelf.id === 'completeBookshelfList' ? 'Belum selesai dibaca' : 'Selesai dibaca';
      }
      targetShelf.appendChild(clonedBookItem);
      hapusDariRak(bookItem);
      updateLocalStorage();
    }
  
    function buatBukuItem(book) {
      const bookItem = document.createElement('article');
      bookItem.classList.add('book_item');
  
      const titleElement = document.createElement('h3');
      titleElement.innerText = book.title;
  
      const authorElement = document.createElement('p');
      authorElement.innerText = `Penulis: ${book.author}`;
  
      const yearElement = document.createElement('p');
      yearElement.innerText = `Tahun: ${book.year}`;
  
      const actionElement = document.createElement('div');
      actionElement.classList.add('action');
  
      const buttonComplete = document.createElement('button');
      buttonComplete.classList.add('green');
      buttonComplete.innerText = book.isComplete ? 'Belum selesai di Baca' : 'Selesai dibaca';
      buttonComplete.addEventListener('click', function () {
        toggleBookStatus(book);
      });
  
      const buttonDelete = document.createElement('button');
      buttonDelete.classList.add('red');
      buttonDelete.innerText = 'Hapus buku';
  
      actionElement.appendChild(buttonComplete);
      actionElement.appendChild(buttonDelete);
  
      bookItem.appendChild(titleElement);
      bookItem.appendChild(authorElement);
      bookItem.appendChild(yearElement);
      bookItem.appendChild(actionElement);
  
      return bookItem;
    }
  
    function toggleBookStatus(book) {
      book.isComplete = !book.isComplete;
      updateLocalStorage();
    }
  
    function updateLocalStorage() {
      const incompleteBooks = Array.from(bookshelf.incomplete.children).map(getBookData);
      const completeBooks = Array.from(bookshelf.complete.children).map(getBookData);
  
      localStorage.setItem('incompleteBooks', JSON.stringify(incompleteBooks));
      localStorage.setItem('completeBooks', JSON.stringify(completeBooks));
    }
  
    function getBookData(bookItem) {
      const title = bookItem.querySelector('h3').innerText;
      const author = bookItem.querySelector('p:nth-child(2)').innerText.replace('Penulis: ', '');
      const year = parseInt(bookItem.querySelector('p:nth-child(3)').innerText.replace('Tahun: ', ''), 10);
      const isComplete = bookItem.querySelector('button.green').innerText === 'Belum selesai dibaca';
  
      return buatBuku(Date.now(), title, author, year, isComplete);
    }
  
    function loadBooksFromLocalStorage() {
      const incompleteBooks = JSON.parse(localStorage.getItem('incompleteBooks')) || [];
      const completeBooks = JSON.parse(localStorage.getItem('completeBooks')) || [];
  
      incompleteBooks.forEach(book => tambahKeRak(book, bookshelf.incomplete));
      completeBooks.forEach(book => tambahKeRak(book, bookshelf.complete));
    }
  
    const inputBookForm = document.getElementById('inputBook');
    inputBookForm.addEventListener('submit', function (event) {
      event.preventDefault();
  
      const title = document.getElementById('inputBookTitle').value;
      const author = document.getElementById('inputBookAuthor').value;
      const year = document.getElementById('inputBookYear').value;
      const isComplete = document.getElementById('inputBookIsComplete').checked;
  
      const newBook = buatBuku(Date.now(), title, author, parseInt(year, 10), isComplete);
      tambahKeRak(newBook, isComplete ? bookshelf.complete : bookshelf.incomplete);
  
      inputBookForm.reset();
    });
  
    // Cari buku dengan submit
    const cariBuku = document.getElementById('searchBook');
    cariBuku.addEventListener('submit', function (event) {
      event.preventDefault();
  
      const judulBuku = document.getElementById('searchBookTitle').value.toLowerCase();
      const allBooks = Array.from(bookshelf.incomplete.children).concat(Array.from(bookshelf.complete.children));
  
      allBooks.forEach(bookItem => {
        const title = bookItem.querySelector('h3').innerText.toLowerCase();
        const isVisible = title.includes(judulBuku);
  
        bookItem.style.display = isVisible ? 'block' : 'none';
      });
    });
  
    // Cari buku live dengan event change
    const cariBukuRealtime = document.getElementById('searchBookTitle');
    cariBukuRealtime.addEventListener('change', function (event) {
      event.preventDefault();
  
      const judulBuku = cariBukuRealtime.value.toLowerCase();
      const semuaBuku = Array.from(bookshelf.incomplete.children).concat(Array.from(bookshelf.complete.children));
  
      semuaBuku.forEach(bookItem => {
        const title = bookItem.querySelector('h3').innerText.toLowerCase();
        const isVisible = title.includes(judulBuku);
  
        bookItem.style.display = isVisible ? 'block' : 'none';
      });
    });

    // Event untuk Pindahkan buku / Hapus
    document.addEventListener('click', function (event) {
      const target = event.target;
      const bookItem = target.closest('.book_item');
  
      if (bookItem) {
        const isCompleteButton = target.classList.contains('green');
        const isDeleteButton = target.classList.contains('red');
  
        if (isCompleteButton) {
          toggleBookStatus(getBookData(bookItem));
          const targetShelf = bookItem.closest('.book_list');
          const destinationShelf = targetShelf.id === 'incompleteBookshelfList'
            ? bookshelf.complete
            : bookshelf.incomplete;
  
          pindahBukuKe(bookItem, destinationShelf);
        } else if (isDeleteButton) {
          const confirmation = confirm('Apakah anda yakin akan menghapus buku ini?');
          if (confirmation) {
            hapusDariRak(bookItem);
          }
        }
      }
    });
  
    loadBooksFromLocalStorage();
  });
  