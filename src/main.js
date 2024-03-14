import './header/header.css';
import './slider/slider.css';
import { initHeader } from './header/header.js';
import { initSlider } from './slider/slider.js';

document.addEventListener("DOMContentLoaded", function () {
    const apiKey = 'AIzaSyB-Fn0Nf_MkamDRE-b3wyVCxaTKvXCTMS8';
    let booksData = [];
    let cartCount = 0;
    let startIndex = 0;
    const maxResults = 6;
    let currentCategory;

    const cartBadgeElement = document.querySelector('.cart-badge');
    const booksContainer = document.querySelector('.content-book-cards');
    const sliderImages = document.querySelector(".slider-images");
    const sliderDots = document.querySelector(".slider-dots");

    let images = [
        {
            url: "images/jpg/banner1.jpg",
            title: "Black friday sale"
        },
        {
            url: "images/jpg/banner2.jpg",
            title: "Top 10 books"
        },
        {
            url: "images/jpg/banner3.jpg",
            title: "Check out"
        }
    ];

    initSlider(images, sliderImages, sliderDots);
    initHeader();

    function fetchBooksByCategory(category, startIndex, maxResults) {
        if (!category) {
            return Promise.resolve([]);
        }

        const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=subject:${category}&key=${apiKey}&printType=books&startIndex=${startIndex}&maxResults=${maxResults}&langRestrict=en`;

        return fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                return data.items ? data.items.map(item => processBookData(item)) : [];
            })
            .catch(error => {
                console.error('Error fetching books data:', error);
                return [];
            });
    }

    function processBookData(item) {
        const volumeInfo = item.volumeInfo || {};
        const saleInfo = item.saleInfo || {};
        const imageLinks = volumeInfo.imageLinks || {};

        return {
            img: imageLinks.thumbnail || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 192" width="128" height="192"%3E%3Crect width="100%" height="100%" fill="%23ccc" /%3E%3Ctext x="50%" y="50%" font-size="16" dy=".3em" fill="%23fff" text-anchor="middle"%3ENo image%3C/text%3E%3C/svg%3E',
            title: volumeInfo.title || 'No Title',
            authors: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'No Author',
            averageRating: volumeInfo.averageRating || 0,
            ratingsCount: volumeInfo.ratingsCount || 0,
            description: volumeInfo.description || '',
            saleInfo: saleInfo.listPrice ? `$${saleInfo.listPrice.amount}` : ''
        };
    }

    function loadMoreBooks(category) {
        let newStartIndex = startIndex + maxResults;
        fetchBooksByCategory(category, newStartIndex, maxResults)
            .then(function (books) {
                if (books.length > 0) {
                    booksData = [...booksData, ...books];
                    startIndex = newStartIndex; 
                    updateCardInfo();
                } else {
                    const loadMoreBtn = document.querySelector('.load-more-btn');
                    if (loadMoreBtn) {
                        loadMoreBtn.remove();
                    }
                }
            })
            .catch(error => {
                console.error('Error fetching books data:', error);
            });
    }

    function addLoadMoreButton() {
        const loadMoreBtn = document.querySelector('.load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.remove();
        }

        const newLoadMoreBtn = document.createElement('button');
        newLoadMoreBtn.classList.add('load-more-btn');
        newLoadMoreBtn.textContent = 'LOAD MORE';

        newLoadMoreBtn.addEventListener('click', function () {
            if (!newLoadMoreBtn.disabled) {
                loadMoreBooks(currentCategory);
            }
        });

        booksContainer.appendChild(newLoadMoreBtn);
    }

    function updateCardInfo() {
        let bookContainer = document.querySelector(".content-book-cards");
        bookContainer.innerHTML = '';
    
        for (let i = 0; i < booksData.length; i++) {
            let currentBook = booksData[i];
            let bookCard = document.createElement('div');
            bookCard.classList.add('book-card');
            
            // Добавляем класс в зависимости от того, находится ли книга в корзине
            let buttonClass = isBookInCart(currentBook) ? 'book-cart-btn' : 'buy-now-btn';
            
            bookCard.innerHTML = `
                <img src="${currentBook.img}" alt="${currentBook.title}">
                <div class="book-info">
                    <div class="book-authors">${currentBook.authors}</div>
                    <div class="book-title">${currentBook.title}</div>
                    <div class="star-rating">
                        ${getStarRating(currentBook.averageRating)}
                        <div class="book-ratings">${formatRatings(currentBook.ratingsCount)}</div>
                    </div>
                    <div class="book-description">${currentBook.description}</div>
                    ${currentBook.saleInfo ? `<div class="book-price">${currentBook.saleInfo}</div>` : ''}
                    <button class="${buttonClass}" data-book="${i}">
                        ${isBookInCart(currentBook) ? 'IN THE CART' : 'BUY NOW'}
                    </button>
                </div>
            `;
    
            bookContainer.appendChild(bookCard);
        }
    
        addLoadMoreButton();
    }
    

    function isBookInCart(book) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        return cart.some(item => item.title === book.title && item.authors === book.authors);
    }

    function getStarRating(rating) {
        if (!rating) {
            return '';
        }

        const filledStars = Math.round(rating);
        const emptyStars = 5 - filledStars;

        return Array.from({ length: filledStars }, (_, index) => '<div class="star filled-star"></div>')
            .concat(Array.from({ length: emptyStars }, (_, index) => '<div class="star"></div>'))
            .join('');
    }

    function formatRatings(ratingsCount) {
        if (!ratingsCount || isNaN(ratingsCount)) {
            return '';
        }

        if (ratingsCount >= 1000000) {
            return `${(ratingsCount / 1000000).toFixed(1)}M review`;
        } else if (ratingsCount >= 1000) {
            return `${(ratingsCount / 1000).toFixed(1)}K review`;
        } else {
            return `${ratingsCount} review`;
        }
    }

    let links = document.querySelectorAll('.aside-link');

    links.forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault();

            links.forEach(function (item) {
                item.classList.remove('active');
            });

            link.classList.add('active');

            let category = link.dataset.category;
            currentCategory = category;

            fetchBooksByCategory(category, 0, 6)
                .then(function (books) {
                    booksData = books; 
                    updateCardInfo();
                });
        });
    });

    function simulateClickOnFirstCategory() {
        const firstLink = document.querySelector('.aside-link');
        if (firstLink) {
            firstLink.click();
        }
    }

    simulateClickOnFirstCategory();

    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('buy-now-btn') || event.target.classList.contains('book-cart-btn')) {
            handleBuyNowClick(event);
        }
    });
    
    function applyButtonStyles(button, inCart) {
        if (inCart) {
            button.classList.remove('buy-now-btn');
            button.classList.add('book-cart-btn');
            button.textContent = 'IN THE CART';
        } else {
            button.classList.remove('book-cart-btn');
            button.classList.add('buy-now-btn');
            button.textContent = 'BUY NOW';
        }
    }

    function handleBuyNowClick(event) {
        try {
            let button = event.target;
            if (button.tagName !== 'BUTTON') {
                return;
            }
    
            let bookIndex = button.getAttribute('data-book');
    
            if (bookIndex === null || bookIndex === undefined || isNaN(bookIndex)) {
                console.error('Error handling click: Invalid book index');
                return;
            }
    
            let book = booksData[bookIndex];
    
            if (!book || !book.title || !book.authors) {
                console.error('Error handling click: Book, title, or authors are undefined', book);
                return;
            }
    
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            let bookInCart = cart.find(item => item.title === book.title && item.authors === book.authors);
    
            if (!bookInCart) {
                cart.push({
                    title: book.title,
                    authors: book.authors,
                    img: book.img || '',
                    averageRating: book.averageRating || '',
                    ratingsCount: book.ratingsCount || '',
                    description: book.description || '',
                    saleInfo: book.saleInfo || ''
                });
                cartCount++;
            } else {
                cart = cart.filter(item => !(item.title === book.title && item.authors === book.authors));
                cartCount--;
            }
    
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCardInfo();
            applyButtonStyles(button, !bookInCart);
            updateCartBadge();
        } catch (error) {
            console.error('Error handling click:', error);
        }
    }

    function updateCartBadgeDisplay() {
        const cartBadgeElement = document.querySelector('.cart-badge');
        
        if (cartBadgeElement) {
            if (cartCount > 0) {
                cartBadgeElement.textContent = cartCount;
                cartBadgeElement.style.display = 'block';
            } else {
                cartBadgeElement.style.display = 'none';
            }
        }
    }    

    function updateCartBadge() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartCount = cart.length;
        updateCartBadgeDisplay();
    }

    initSlider(images, sliderImages, sliderDots);
    updateCartBadgeDisplay();
});
