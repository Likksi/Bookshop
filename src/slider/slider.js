export function initSlider(images, sliderImages, sliderDots) {
    let currentIndex = 0;
    let intervalId;

    function startAutoSlider() {
        intervalId = setInterval(() => {
            currentIndex = (currentIndex + 1) % images.length;
            moveSlider(currentIndex);
        }, 5000);
    }

    function moveSlider(num) {
        clearInterval(intervalId);
        currentIndex = num;

        let currentImage = document.querySelector(`.image.active`);
        currentImage.classList.remove("active");

        let nextImage = document.querySelector(`.image.n${num}`);
        nextImage.classList.add("active");

        redrawDots(num);

        startAutoSlider();
    }

    function redrawDots(currentIndex) {
        document.querySelectorAll('.slider-dots-item').forEach(dot => {
            dot.classList.remove('active');
        });

        const currentDot = document.querySelector(`.slider-dots-item.n${currentIndex}`);
        currentDot.classList.add('active');
    }

    function initDots() {
        sliderDots.innerHTML = "";
        images.forEach((image, index) => {
            let dot = `<div class="slider-dots-item n${index} ${index === 0 ? "active" : ""}" data-index="${index}"></div>`;
            sliderDots.innerHTML += dot;
        });

        sliderDots.addEventListener("click", function (event) {
            if (event.target.classList.contains("slider-dots-item")) {
                let index = parseInt(event.target.getAttribute("data-index"));
                moveSlider(index);
            }
        });
    }

    function initImages() {
        sliderImages.innerHTML = "";
        images.forEach((image, index) => {
            let altText = images[index].title;
            let imageUrl = images[index].url || '';
    
            let imageDiv = `<div class="image n${index} ${index === 0 ? "active" : ""}" data-index="${index}" style="${imageUrl ? `background-image:url(${imageUrl});` : 'background-color: #ccc; color: #fff; display: flex; align-items: center; justify-content: center;'}">
                  <img src="${imageUrl}" alt="${altText}">
                  ${imageUrl ? '' : 'No Image'}
                </div>`;
    
            sliderImages.innerHTML += imageDiv;
        });
    }
    
    function initSliderInternal() {
        initImages();
        initDots();
        startAutoSlider();
    }

    initSliderInternal();
}
