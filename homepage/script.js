document.addEventListener('DOMContentLoaded', () => {
  // ... (Semua kode UI Anda yang sudah ada: progress bar, color circle, custom cursor, click wave, dll. TETAP DI SINI) ...
  // =============================================
  // Progress Bar Animation (Existing Code - unchanged)
  // =============================================
  const progressBar = document.getElementById('progress-bar');
  const updateProgressBar = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    if(progressBar) {
      progressBar.style.width = `${scrollPercent}%`;
    }
  };
  window.addEventListener('scroll', updateProgressBar);
  window.addEventListener('load', updateProgressBar);

  // =============================================
  // Color Circle Image Switcher (Existing Code - unchanged IF elements exist on the page)
  // =============================================
  const colorCircles = document.querySelectorAll('.right-card-container .block.rounded-full');
  const mainImage = document.querySelector('.right-card-container img');
  if (colorCircles.length > 0 && mainImage) { // Check if elements exist
    colorCircles.forEach(circle => {
      circle.addEventListener('click', () => {
        const newImageSrc = circle.getAttribute('data-image-src');
        if (mainImage && newImageSrc) {
          mainImage.src = newImageSrc;
        }
      });
    });
  }

  // =============================================
  // Custom Cursor Animation (Existing Code - unchanged)
  // =============================================
  const customCursor = document.getElementById('custom-cursor');
  if (customCursor) {
    let mouseX = 0; mouseY = 0; let cursorX = 0; let cursorY = 0;
    const easingFactor = 0.15; 
    document.body.style.cursor = 'none';
    document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
    function animateCursor() {
      cursorX += (mouseX - cursorX) * easingFactor;
      cursorY += (mouseY - cursorY) * easingFactor;
      customCursor.style.left = cursorX + 'px';
      customCursor.style.top = cursorY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
    const interactiveElements = document.querySelectorAll('a, button, img, input, textarea, select, .color-circle');
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        customCursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        customCursor.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
        customCursor.style.border = '2px solid black';
      });
      element.addEventListener('mouseleave', () => {
        customCursor.style.transform = 'translate(-50%, -50%) scale(1)';
        customCursor.style.backgroundColor = 'black';
        customCursor.style.border = 'none';
      });
    });
  }

  // =============================================
  // Click Wave Animation (Existing Code - unchanged)
  // =============================================
  document.addEventListener('click', (e) => {
    const wave = document.createElement('div');
    wave.classList.add('click-wave');
    wave.style.left = e.clientX + 'px'; wave.style.top = e.clientY + 'px';
    document.body.appendChild(wave);
    wave.addEventListener('animationend', () => { wave.remove(); });
  });

  // =============================================
  // Product Data Loading and Management
  // =============================================
  let allProductData = {}; 
  // Kontainer baru di store.html
  const allProductsSectionsContainer = document.getElementById('all-products-sections-container'); 
  // Kontainer lama dari index.html (mungkin masih digunakan jika script ini dipakai di kedua halaman)
  const productGridContainer = document.getElementById('product-grid-container'); 

  async function loadProductData() {
    try {
      const response = await fetch('product.json'); // Sesuaikan path jika perlu
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - Pastikan file product.json ada.`);
      }
      allProductData = await response.json();
      console.log('Product data loaded successfully.');
      
      // Cek apakah kita di halaman store.html atau index.html
      if (allProductsSectionsContainer) { // Berarti kita di store.html
        displayAllProductSections();
      } else if (productGridContainer && allProductData.newsItems) { // Berarti kita mungkin di index.html
        displayProductsForIndex(allProductData.newsItems); // Fungsi lama untuk index.html
        if (newsItemButton) updateButtonStyles(newsItemButton);
      }

    } catch (error) {
      console.error('Could not load product data:', error);
      if (allProductsSectionsContainer) {
          allProductsSectionsContainer.innerHTML = `<p class='text-center col-span-full text-red-500'>Error loading products: ${error.message}.</p>`;
      } else if (productGridContainer) {
          productGridContainer.innerHTML = `<p class='text-center col-span-full text-red-500'>Error loading products: ${error.message}.</p>`;
      }
    }
  }

  // =============================================
  // Product Card Generation (Tetap sama)
  // =============================================
  function generateProductCardHtml(product) {
    const priceText = product.price ? product.price : 'N/A';
    const ratingText = product.rating ? product.rating : 'N/A';
    const uniqueId = product.id || product.name.replace(/\s+/g, '-').toLowerCase();

    return `
      <div class="relative flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md product-card-item">
        <a class="relative mx-3 mt-3 flex h-[240px] overflow-hidden rounded-xl" href="#">
          <img class="object-cover w-full h-full" src="${product.imageSrc || '/placeholder.jpg'}" alt="${product.name || 'Product Image'}" />
        </a>
        <div class="mt-4 px-5 pb-5 flex flex-col flex-grow">
          <a href="#"><h5 class="text-1xl tracking-tight text-slate-900 min-h-[3em]">${product.name || 'Unnamed Product'}</h5></a>
          <div class="mt-2 mb-5 flex items-center justify-between">
            <p><span class="text-2xl md:text-3xl font-bold text-slate-900">${priceText}</span></p> 
            <div class="flex items-center">
              <svg aria-hidden="true" class="h-5 w-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              <span class="mr-2 ml-3 rounded bg-yellow-200 px-2.5 py-0.5 text-xs font-semibold">${ratingText}</span>
            </div>
          </div>
          <button type="button" class="add-to-cart-btn flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300 mt-auto" data-product-id="${uniqueId}" data-product='${JSON.stringify(product)}'>
            <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-6 w-6 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            Add to cart
          </button>
        </div>
      </div>
    `;
  }

  // =============================================
  // Product Display Functions
  // =============================================

  // FUNGSI BARU: Untuk menampilkan semua section produk di store.html
  function displayAllProductSections() {
    if (!allProductsSectionsContainer || Object.keys(allProductData).length === 0) {
      if (allProductsSectionsContainer) allProductsSectionsContainer.innerHTML = "<p class='text-center text-gray-500'>No product data available to display.</p>";
      return;
    }
    allProductsSectionsContainer.innerHTML = ''; // Kosongkan dulu

    // Tentukan urutan kategori yang ingin ditampilkan
    const categoryOrder = ['newsItems', 'recommended', 'clothing', 'shoes']; 
    const categoryTitles = { // Judul yang lebih ramah pengguna
        newsItems: 'News Items',
        recommended: 'Recommended For You',
        clothing: 'Clothing Collection',
        shoes: 'Shoes Collection'
    };

    categoryOrder.forEach(categoryKey => {
        const products = allProductData[categoryKey];
        if (products && products.length > 0) {
            const sectionWrapper = document.createElement('section');
            sectionWrapper.id = `section-${categoryKey}`; // ID untuk navigasi jika diperlukan nanti
            sectionWrapper.classList.add('mb-12'); // Margin bawah antar section

            const titleElement = document.createElement('h2');
            titleElement.classList.add('text-2xl', 'font-semibold', 'text-black', 'mb-6', 'text-center', 'md:text-left');
            titleElement.textContent = categoryTitles[categoryKey] || categoryKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()); // Format judul
            sectionWrapper.appendChild(titleElement);

            const gridDiv = document.createElement('div');
            gridDiv.classList.add('grid', 'grid-cols-1', 'sm:grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-4', 'gap-6', 'justify-items-center');
            
            products.forEach(product => {
                gridDiv.innerHTML += generateProductCardHtml(product);
            });
            sectionWrapper.appendChild(gridDiv);
            allProductsSectionsContainer.appendChild(sectionWrapper);
        }
    });

    addLikeButtonFunctionality();
    addAddToCartButtonFunctionality();
    // Panggil setupScrollAnimationsForProductCards jika ingin animasi pada kartu produk yang baru dimuat
  }
  
  // Fungsi lama untuk index.html (jika script ini masih dipakai bersama)
  function displayProductsForIndex(products) {
    if (productGridContainer && products && products.length > 0) {
      productGridContainer.innerHTML = '';
      products.forEach(product => {
        productGridContainer.innerHTML += generateProductCardHtml(product);
      });
      addLikeButtonFunctionality();
      addAddToCartButtonFunctionality();
    } else if (productGridContainer) {
      productGridContainer.innerHTML = "<p class='text-center col-span-full'>No products to display.</p>";
    }
  }

  // =============================================
  // Like Button & Add to Cart Functionality (Tetap sama)
  // =============================================
  function addLikeButtonFunctionality() { /* ... kode Anda yang sudah ada ... */ 
    const likeButtons = document.querySelectorAll('.like-button');
    likeButtons.forEach(button => {
      const productId = button.getAttribute('data-product-id'); 
      const productDataString = button.getAttribute('data-product');
      const product = JSON.parse(productDataString); 
      const heartIcon = button.querySelector('i');
      
      let favoriteItems = JSON.parse(localStorage.getItem('favoriteItems')) || [];
      const isLiked = favoriteItems.some(item => (item.id || item.name.replace(/\s+/g, '-').toLowerCase()) === productId);
      
      heartIcon.classList.toggle('text-red-500', isLiked);
      heartIcon.classList.toggle('text-gray-600', !isLiked);

      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        favoriteItems = JSON.parse(localStorage.getItem('favoriteItems')) || [];
        const itemIndex = favoriteItems.findIndex(item => (item.id || item.name.replace(/\s+/g, '-').toLowerCase()) === productId);

        if (itemIndex > -1) { 
          favoriteItems.splice(itemIndex, 1);
          heartIcon.classList.remove('text-red-500');
          heartIcon.classList.add('text-gray-600');
        } else { 
          // Pastikan product yang disimpan memiliki ID yang konsisten
          const productToSave = {...product, id: productId }; 
          favoriteItems.push(productToSave);
          heartIcon.classList.remove('text-gray-600');
          heartIcon.classList.add('text-red-500');
        }
        localStorage.setItem('favoriteItems', JSON.stringify(favoriteItems));
      });
    });
  }

  function addAddToCartButtonFunctionality() { /* ... kode Anda yang sudah ada ... */ 
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const clickedButton = event.currentTarget; 
            const productDataString = clickedButton.getAttribute('data-product');
            const productFromCatalog = JSON.parse(productDataString);
            let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
            const productId = clickedButton.getAttribute('data-product-id'); // Ambil ID unik
            const existingProductIndex = cart.findIndex(item => item.id === productId);
            let priceNumber = 0;
            if (productFromCatalog.price && typeof productFromCatalog.price === 'string') {
                priceNumber = parseInt(productFromCatalog.price.replace(/[^0-9]/g, ''), 10);
            } else if (productFromCatalog.price && typeof productFromCatalog.price === 'number') {
                priceNumber = productFromCatalog.price;
            }

            if (existingProductIndex > -1) {
                cart[existingProductIndex].quantity += 1;
            } else {
                cart.push({
                    id: productId, 
                    name: productFromCatalog.name,
                    price: priceNumber,
                    quantity: 1,
                    imageSrc: productFromCatalog.imageSrc,
                    imageSrcMobile: productFromCatalog.imageSrcMobile || productFromCatalog.imageSrc,
                    details: productFromCatalog.details || { code: productId } 
                });
            }
            localStorage.setItem('shoppingCart', JSON.stringify(cart));
            alert(`"${productFromCatalog.name}" telah ditambahkan ke keranjang!`);
        });
    });
  }
  
  // =============================================
  // Tombol Kategori Produk (Untuk index.html) - JANGAN DIHAPUS jika script ini dipakai bersama
  // =============================================
  const recommendButton = document.getElementById('recommend-button');
  const newsItemButton = document.getElementById('news-item-button');
  // Selector untuk tombol CLOTHES dan SHOE di index.html mungkin perlu disesuaikan jika ID-nya tidak ada
  const clothesButtonIndex = Array.from(document.querySelectorAll('.pt-0.pb-0 button')).find(btn => btn.textContent.trim().toUpperCase() === 'CLOTHES');
  const shoeButtonIndex = Array.from(document.querySelectorAll('.pt-0.pb-0 button')).find(btn => btn.textContent.trim().toUpperCase() === 'SHOE');

  function updateButtonStyles(activeButton) {
    // Pastikan hanya tombol yang ada di halaman saat ini yang di-style
    const buttons = [newsItemButton, recommendButton, clothesButtonIndex, shoeButtonIndex].filter(btn => btn && document.body.contains(btn));
    buttons.forEach(button => {
      if (button === activeButton) {
        button.classList.add('bg-gray-800', 'text-white');
        button.classList.remove('text-gray-800', 'border-gray-800'); 
      } else {
        button.classList.remove('bg-gray-800', 'text-white');
        button.classList.add('text-gray-800', 'border-gray-800');
      }
    });
  }
  
  // Event listener untuk tombol filter di index.html
  // Pastikan tombol ini ada sebelum menambahkan listener
  if (newsItemButton) {
    newsItemButton.addEventListener('click', () => {
      if (allProductData.newsItems && productGridContainer) { // Cek productGridContainer untuk index.html
        displayProductsForIndex(allProductData.newsItems);
        updateButtonStyles(newsItemButton);
      } 
    });
  }
  if (recommendButton) {
    recommendButton.addEventListener('click', () => {
      if (allProductData.recommended && productGridContainer) {
        displayProductsForIndex(allProductData.recommended);
        updateButtonStyles(recommendButton);
      } 
    });
  }
  if (clothesButtonIndex) {
    clothesButtonIndex.addEventListener('click', () => {
      if (allProductData.clothing && productGridContainer) {
        displayProductsForIndex(allProductData.clothing);
        updateButtonStyles(clothesButtonIndex);
      }
    });
  }
  if (shoeButtonIndex) {
    shoeButtonIndex.addEventListener('click', () => {
      if (allProductData.shoes && productGridContainer) { 
        displayProductsForIndex(allProductData.shoes);
        updateButtonStyles(shoeButtonIndex);
      } 
    });
  }

  // Panggil fungsi untuk memuat data produk saat DOM siap
  loadProductData();

  // =============================================
  // Animasi UI Lainnya (Parallax, Testimonial, Brands, Scroll Animations)
  // Pastikan elemen targetnya ada di halaman sebelum menjalankan animasinya
  // =============================================

  // Parallax Scrolling Text Animation (Hero Section - Hanya untuk index.html)
  const parallaxLeftTexts = document.querySelectorAll('section.relative.h-\\[80vh\\] [data-direction="left"]');
  const parallaxRightTexts = document.querySelectorAll('section.relative.h-\\[80vh\\] [data-direction="right"]');
  if (parallaxLeftTexts.length > 0 || parallaxRightTexts.length > 0) {
      function handleParallaxScroll() { /* ... kode parallax Anda ... */ 
        const scrollY = window.scrollY;
        const speed = 0.3;
        parallaxLeftTexts.forEach(text => {
            const translateX = -scrollY * speed;
            text.style.transform = `translateX(${translateX}px)`;
        });
        parallaxRightTexts.forEach(text => {
            const translateX = scrollY * speed;
            text.style.transform = `translateX(${translateX}px)`;
        });
      }
      let tickingParallax = false;
      window.addEventListener('scroll', () => {
        if (!tickingParallax) {
          window.requestAnimationFrame(() => {
            handleParallaxScroll();
            tickingParallax = false;
          });
          tickingParallax = true;
        }
      });
      handleParallaxScroll(); 
  }

  // Testimonial Auto Animation (Hanya untuk index.html)
  const testimonialTextElements = document.querySelectorAll('.bg-neutral-950 [data-direction]');
  let testimonialAnimationFrame;
  if (testimonialTextElements.length > 0) {
      function animateTestimonial() { /* ... kode testimonial Anda ... */ 
        testimonialTextElements.forEach((text) => {
            let currentTransform = parseFloat(text.style.transform.replace(/[^0-9.-]+/g, "")) || 0;
            const speed = 0.3; 
            const direction = text.dataset.direction === 'left' ? -1 : 1;
            let newPosition = currentTransform + (speed * direction);
            const textWidth = text.offsetWidth;
            const parentWidth = text.parentElement.offsetWidth; 
            if (direction === -1 && newPosition < -textWidth) { 
                newPosition = parentWidth; 
            } else if (direction === 1 && newPosition > parentWidth) { 
                newPosition = -textWidth; 
            }
            text.style.transform = `translateX(${newPosition}px)`;
        });
        testimonialAnimationFrame = requestAnimationFrame(animateTestimonial);
      }
      animateTestimonial();
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) { cancelAnimationFrame(testimonialAnimationFrame); } 
        else { animateTestimonial(); }
      });
  }
  
  // Popular Brands Auto Scroll Animation (Hanya untuk index.html)
  const brandScrollContainer = document.getElementById('brand-scroll-container');
  let scrollPosition = 0; let brandScrollSpeed = 0.5; let brandAnimationFrameId; 
  let totalBrandItemWidth = 0; 
  if (brandScrollContainer) { /* ... kode brand scroll Anda ... */ 
    const brandItems = Array.from(brandScrollContainer.children);
    if (brandItems.length > 0) {
        const numOriginalBrands = brandItems.length;
        for(let i = 0; i < numOriginalBrands; i++) {
            const style = getComputedStyle(brandItems[i]);
            totalBrandItemWidth += brandItems[i].offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
        }
        const containerWidth = brandScrollContainer.parentElement.offsetWidth;
        const necessaryDuplicates = Math.ceil(Math.max(containerWidth, totalBrandItemWidth) / totalBrandItemWidth) + 1;
        for (let d = 0; d < necessaryDuplicates; d++) {
             for (let i = 0; i < numOriginalBrands; i++) {
                brandScrollContainer.appendChild(brandItems[i].cloneNode(true));
            }
        }
    }
    function animateBrands() {
        if (!brandScrollContainer || totalBrandItemWidth === 0) return; 
        scrollPosition -= brandScrollSpeed;
        if (scrollPosition <= -totalBrandItemWidth) {
          scrollPosition += totalBrandItemWidth; 
        }
        brandScrollContainer.style.transform = `translateX(${scrollPosition}px)`;
        brandAnimationFrameId = requestAnimationFrame(animateBrands);
    }
    if (totalBrandItemWidth > 0) {
        animateBrands();
        const brandParentContainer = brandScrollContainer.parentElement; 
        if (brandParentContainer) {
            brandParentContainer.addEventListener('mouseenter', () => cancelAnimationFrame(brandAnimationFrameId));
            brandParentContainer.addEventListener('mouseleave', animateBrands);
        }
    }
  }

  // Scroll Animation Setup (Umum, tapi target elemennya mungkin spesifik per halaman)
  const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  function setupScrollAnimations() {
    // Elemen yang umum ada di kedua halaman atau hanya store.html
    const elementsToAnimate = [
        // Untuk index.html:
        '.text-center.pt-30', // Hero content
        '.left-card-container', 
        '.right-card-container',
        '.max-w-7xl.mx-auto.px-4.sm\\:px-6.md\\:px-6.pt-20.pb-12.-mt-1', // Judul Popular products
        '.bg-white.py-17', // Why Choose Us
        '.bg-neutral-950', // Testimonials
        '#brand-scroll-container', // Popular Brands scroll
        // Untuk store.html (dan mungkin beberapa section di index jika ada kesamaan struktur):
        '#all-products-sections-container section h2', // Judul section di store.html
        '.product-card-item' // Kartu produk (perlu di-observe setelah render)
    ];
    
    elementsToAnimate.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => { // Gunakan querySelectorAll
            if (element) { // Cek jika elemen ditemukan
                element.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-1000');
                observer.observe(element);
            }
        });
    });
  }
  
  const style = document.createElement('style');
  style.textContent = `.animate-in { opacity: 1 !important; transform: translateY(0) !important; }`;
  document.head.appendChild(style);

  setupScrollAnimations(); // Panggil ini di akhir
  // Jika kartu produk di-render dinamis, Anda mungkin perlu memanggil observer.observe(card) untuk setiap kartu baru
  // di dalam fungsi displayAllProductSections atau displayProductsForIndex.
  // Atau, panggil setupScrollAnimations lagi setelah produk di-render.
});