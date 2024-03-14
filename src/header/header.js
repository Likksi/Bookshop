let cartCount = 0;

function updateCartButton(cartButtonElement) {
    if (cartButtonElement) {
        const cartBadgeElement = cartButtonElement.querySelector('.cart-badge');
        if (cartBadgeElement) {
            cartBadgeElement.textContent = cartCount > 0 ? cartCount : '';
            cartBadgeElement.style.display = cartCount > 0 ? 'block' : 'none';
        }
    }
}

export function initHeader() {
    let activeTab = 'BOOKS';

    function createHeader() {
        const header = document.createElement('header');
        header.classList.add('header');

        const logo = document.createElement('div');
        logo.classList.add('logo');
        logo.textContent = 'Bookshop';

        const nav = document.createElement('div');
        nav.classList.add('header-nav');

        const navigation = document.createElement('nav');
        navigation.classList.add('header-nav-navigation');

        const navLinks = document.createElement('ul');
        navLinks.classList.add('nav-navigation-links');

        const categories = ['BOOKS', 'AUDIOBOOKS', 'STATIONERY & GIFTS', 'BLOG'];

        function updateActiveTab(category) {
            const prevActiveLink = navLinks.querySelector('.navigation-link a.active');
            if (prevActiveLink) {
                prevActiveLink.classList.remove('active');
            }

            const newActiveLink = navLinks.querySelector(`.navigation-link a[data-category="${category}"]`);
            if (newActiveLink) {
                newActiveLink.classList.add('active');
            }
        }

        categories.forEach(category => {
            const linkItem = document.createElement('li');
            linkItem.classList.add('navigation-link');

            const link = document.createElement('a');
            link.href = '#';
            link.textContent = category;
            link.setAttribute('data-category', category);

            if (category === activeTab) {
                link.classList.add('active');
            }

            link.addEventListener('click', function (event) {
                event.preventDefault();

                updateActiveTab(category);

                activeTab = category;
            });

            linkItem.appendChild(link);
            navLinks.appendChild(linkItem);
        });

        navigation.appendChild(navLinks);
        nav.appendChild(navigation);
        const setButtons = document.createElement('div');
        setButtons.classList.add('set-buttons');

        const userButton = document.createElement('a');
        userButton.classList.add('set-button');
        userButton.href = '#';
        userButton.innerHTML = '<img src="images/svg/user.svg" alt="User">';
        setButtons.appendChild(userButton);

        const searchButton = document.createElement('a');
        searchButton.classList.add('set-button');
        searchButton.href = '#';
        searchButton.innerHTML = '<img src="images/svg/search.svg" alt="Search">';
        setButtons.appendChild(searchButton);

        const cartButton = document.createElement('a');
        cartButton.classList.add('set-button', 'cart-icon');
        cartButton.href = '#';
        cartButton.innerHTML = `
            <img src="images/svg/shopbag.svg" alt="Shopbag">
            <div class="cart-badge">${cartCount}</div>
        `;
        cartButton.addEventListener('click', function (event) {
            event.preventDefault();
        });
        setButtons.appendChild(cartButton);

        header.appendChild(logo);
        header.appendChild(nav);
        header.appendChild(setButtons);

        document.body.insertBefore(header, document.body.firstChild);

        return {
            cartButtonElement: cartButton
        };
    }

    const { cartButtonElement } = createHeader();

    document.addEventListener('DOMContentLoaded', function () {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartCount = cart.length;
        cartButtonElement.querySelector('.cart-badge').textContent = cartCount > 0 ? cartCount : '';

        if (cartCount > 0) {
            const cartButton = document.querySelector('.cart-icon');
            if (cartButton) {
                cartButton.addEventListener('click', function (event) {
                    event.preventDefault();
                });
            }
        }
    });

    return {
        updateCartBadge: () => {
            const cartButton = document.querySelector('.cart-icon .cart-badge');
            if (cartButton) {
                cartButton.textContent = cartCount > 0 ? cartCount : '';
                cartButton.style.display = cartCount > 0 ? 'block' : 'none';
            }
        },
    };
}