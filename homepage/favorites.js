document.addEventListener('DOMContentLoaded', () => {
  // Progress bar functionality
  const progressBar = document.getElementById('progress-bar');
  const updateProgressBar = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = `${scrollPercent}%`;
  };

  window.addEventListener('scroll', updateProgressBar);
  window.addEventListener('load', updateProgressBar);

  // Custom cursor functionality
  const customCursor = document.getElementById('custom-cursor');
  if (!customCursor) return;

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  const easingFactor = 0.15;

  document.body.style.cursor = 'none';

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * easingFactor;
    cursorY += (mouseY - cursorY) * easingFactor;
    customCursor.style.left = cursorX + 'px';
    customCursor.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  // Click wave effect
  document.addEventListener('click', (e) => {
    const wave = document.createElement('div');
    wave.classList.add('click-wave');
    wave.style.left = e.clientX + 'px';
    wave.style.top = e.clientY + 'px';
    document.body.appendChild(wave);

    wave.addEventListener('animationend', () => {
      wave.remove();
    });
  });

  // Function to generate product card HTML
  function generateProductCardHtml(product) {
    return `
      <div class="relative flex w-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
        <a class="relative mx-3 mt-3 flex h-[240px] overflow-hidden rounded-xl" href="#">
          <img class="object-cover w-[300px] h-[240px]" src="${product.imageSrc}" alt="product image" />
          ${product.discount ? `<span class="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-center text-sm font-medium text-white">${product.discount}</span>` : ''}
          <span class="absolute top-2 right-2 text-red-500 z-10">
            <i class="fas fa-heart"></i>
          </span>
        </a>
        <div class="mt-4 px-5 pb-5">
          <a href="#">
            <h5 class="text-xl tracking-tight text-slate-900">${product.name}</h5>
          </a>
          <div class="mt-2 mb-5 flex items-center justify-between">
            <p>
              <span class="text-3xl font-bold text-slate-900">${product.price}</span>
              ${product.originalPrice ? `<span class="text-sm text-slate-900 line-through">${product.originalPrice}</span>` : ''}
            </p>
            <div class="flex items-center">
              <svg aria-hidden="true" class="h-5 w-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <span class="mr-2 ml-3 rounded bg-yellow-200 px-2.5 py-0.5 text-xs font-semibold">${product.rating}</span>
            </div>
          </div>
          <a href="#" class="flex items-center justify-center rounded-md bg-slate-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Add to cart</a>
        </div>
      </div>
    `;
  }

  // Load and display favorite items
  function loadFavoriteItems() {
    const favoritesGrid = document.getElementById('favorites-grid');
    const emptyState = document.getElementById('empty-state');
    const favoriteItems = JSON.parse(localStorage.getItem('favoriteItems')) || [];

    if (favoriteItems.length === 0) {
      favoritesGrid.classList.add('hidden');
      emptyState.classList.remove('hidden');
    } else {
      favoritesGrid.classList.remove('hidden');
      emptyState.classList.add('hidden');
      favoritesGrid.innerHTML = favoriteItems.map(product => generateProductCardHtml(product)).join('');
    }
  }

  // Initial load of favorite items
  loadFavoriteItems();
}); 