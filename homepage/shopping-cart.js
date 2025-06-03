document.addEventListener('DOMContentLoaded', () => {
        const sellerWhatsAppNumber = '6281283794234'; // Nomor WhatsApp Anda
        let shoppingCart = []; // Ini akan menyimpan data keranjang kita (array of objects)

        const productListItemsContainer = document.getElementById('product-list-items');
        const checkoutButton = document.getElementById('checkout-button');
        const shippingCostSelect = document.getElementById('shipping-cost');

        // --- Fungsi Utama untuk Data Keranjang ---

        async function initializeCart() {
            const storedCart = localStorage.getItem('shoppingCart');
            if (storedCart) {
                shoppingCart = JSON.parse(storedCart);
            } else {
                // Jika localStorage kosong, coba load dari data.json
                try {
                    const response = await fetch('data.json'); // Pastikan data.json ada di path yang benar
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    shoppingCart = await response.json();
                    saveCart(); // Simpan data awal dari JSON ke localStorage
                    console.log('Cart initialized from data.json');
                } catch (error) {
                    console.error("Could not load initial cart data from data.json:", error);
                    // Jika data.json gagal dimuat, keranjang akan tetap kosong
                    shoppingCart = [];
                }
            }
            renderCart();
            updateOrderSummary();
        }

        function saveCart() {
            localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
        }

        // --- Fungsi untuk Merender Tampilan ---

        function renderCart() {
            productListItemsContainer.innerHTML = ''; // Kosongkan kontainer sebelum render ulang

            if (shoppingCart.length === 0) {
                productListItemsContainer.innerHTML = '<p class="py-8 text-center text-gray-500">Keranjang belanja Anda kosong.</p>';
                updateOrderSummary(); // Pastikan summary juga update jika kosong
                return;
            }

            shoppingCart.forEach(item => {
                const itemSubtotal = item.price * item.quantity;

                const productItemDiv = document.createElement('div');
                productItemDiv.classList.add('product-item', 'md:flex', 'items-stretch', 'py-8', 'md:py-10', 'lg:py-8');
                productItemDiv.setAttribute('data-product-id', item.id);

                // Gunakan imageSrcMobile jika ada dan layar kecil, atau imageSrc default
                // Untuk contoh ini, kita sederhanakan dengan memakai imageSrc saja
                const image = item.imageSrcMobile && window.innerWidth < 768 ? item.imageSrcMobile : item.imageSrc;

                productItemDiv.innerHTML = `
                    <div class="md:w-4/12 2xl:w-1/4 w-full flex-shrink-0 
                                md:h-40 lg:h-48  bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
                        <img src="${image}" alt="${item.name}" 
                             class="w-full h-full object-contain md:object-cover md:block hidden" />
                        <img src="${item.imageSrcMobile || item.imageSrc}" alt="${item.name}" 
                             class="w-full h-full object-contain md:object-cover md:hidden" />
                    </div>
                    <div class="md:pl-3 md:w-8/12 2xl:w-3/4 flex flex-col justify-center">
                        <p class="text-xs leading-3 text-gray-800 md:pt-0 pt-4">${item.details.code || item.id}</p>
                        <div class="flex items-center justify-between w-full pr-6">
                            <p class="product-name text-base font-black leading-none text-gray-800">${item.name}</p>
                            <div class="flex items-center">
                                <button class="quantity-btn quantity-minus p-1 md:p-2 border rounded-l hover:bg-gray-100 focus:outline-none" data-id="${item.id}">
                                    <svg class="w-4 h-4 fill-current text-gray-600 pointer-events-none" viewBox="0 0 20 20"><path d="M10 3a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4V4a1 1 0 011-1z" clip-rule="evenodd" fill-rule="evenodd" transform="rotate(180 10 10) scale(0.8, 0.2) translate(0, 20)"></path></svg>
                                </button>
                                <span class="quantity-display text-center w-8 md:w-10 p-1 md:p-2 border-t border-b font-semibold">${item.quantity}</span>
                                <button class="quantity-btn quantity-plus p-1 md:p-2 border rounded-r hover:bg-gray-100 focus:outline-none" data-id="${item.id}">
                                    <svg class="w-4 h-4 fill-current text-gray-600 pointer-events-none" viewBox="0 0 20 20"><path d="M10 3a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4V4a1 1 0 011-1z" clip-rule="evenodd" fill-rule="evenodd"></path></svg>
                                </button>
                            </div>  
                        </div>
                        ${item.details.height ? `<p class="text-xs leading-3 text-gray-600 pt-2">Height: ${item.details.height}</p>` : ''}
                        ${item.details.color ? `<p class="text-xs leading-3 text-gray-600 py-2">Color: ${item.details.color}</p>` : ''}
                        ${item.details.composition ? `<p class="w-96 text-xs leading-3 text-gray-600">${item.details.composition}</p>` : ''}
                        ${item.details.size ? `<p class="text-xs leading-3 text-gray-600 pt-2">Size: ${item.details.size}</p>` : ''}
                        ${item.details.material ? `<p class="text-xs leading-3 text-gray-600 py-2">Material: ${item.details.material}</p>` : ''}
                        <div class="flex items-center justify-between pt-5">
                            <div class="flex items-center">
                                <button class="remove-item-btn flex items-center text-red-500 hover:text-red-700 text-xs focus:outline-none" data-id="${item.id}">
                                    <i class="fas fa-trash-alt mr-1 pointer-events-none"></i>
                                    Remove
                                </button>
                            </div>
                            <p class="product-price text-base font-black leading-none text-gray-800">${formatCurrency(itemSubtotal)}</p>
                        </div>
                    </div>
                `;
                productListItemsContainer.appendChild(productItemDiv);
            });
            addEventListenersToCartItems(); // Tambahkan event listener setelah item di-render
            updateOrderSummary();
        }

        function formatCurrency(amount) {
            return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
        }

        function updateOrderSummary() {
            let subtotal = 0;
            shoppingCart.forEach(item => {
                subtotal += item.price * item.quantity;
            });

            const shippingCost = parseFloat(shippingCostSelect.value) || 0;
            const totalCost = subtotal + shippingCost;

            document.getElementById('summary-subtotal').textContent = formatCurrency(subtotal);
            document.getElementById('summary-total-cost').textContent = formatCurrency(totalCost);
            document.getElementById('cart-item-count-display').textContent = `${shoppingCart.length} Item${shoppingCart.length !== 1 ? 's' : ''}`;
            document.getElementById('summary-item-count').textContent = `Items ${shoppingCart.length}`;

            // Update daftar produk di ringkasan
            const summaryProductList = document.getElementById('summary-product-list');
            summaryProductList.innerHTML = '';
            if (shoppingCart.length > 0) {
                shoppingCart.forEach(item => {
                    const itemSubtotal = item.price * item.quantity;
                    const productDetailDiv = document.createElement('div');
                    productDetailDiv.classList.add('flex', 'justify-between', 'py-1', 'border-b', 'border-dashed', 'border-gray-200');
                    
                    const nameAndQtySpan = document.createElement('span');
                    nameAndQtySpan.textContent = `${item.name} (x${item.quantity})`;
                    nameAndQtySpan.classList.add('truncate', 'pr-2');
                    
                    const itemSubtotalSpan = document.createElement('span');
                    itemSubtotalSpan.textContent = formatCurrency(itemSubtotal);
                    itemSubtotalSpan.classList.add('whitespace-nowrap');

                    productDetailDiv.appendChild(nameAndQtySpan);
                    productDetailDiv.appendChild(itemSubtotalSpan);
                    summaryProductList.appendChild(productDetailDiv);
                });
            } else {
                summaryProductList.innerHTML = '<p class="text-center text-gray-400 text-xs">Tidak ada item.</p>';
            }
        }

        // --- Fungsi untuk Menangani Interaksi ---
        function addEventListenersToCartItems() {
            document.querySelectorAll('.quantity-minus').forEach(button => {
                button.addEventListener('click', handleQuantityChange);
            });
            document.querySelectorAll('.quantity-plus').forEach(button => {
                button.addEventListener('click', handleQuantityChange);
            });
            document.querySelectorAll('.remove-item-btn').forEach(button => {
                button.addEventListener('click', handleRemoveItem);
            });
        }
        
        function handleQuantityChange(event) {
            const productId = event.target.dataset.id;
            const itemIndex = shoppingCart.findIndex(item => item.id === productId);

            if (itemIndex > -1) {
                if (event.target.classList.contains('quantity-minus')) {
                    if (shoppingCart[itemIndex].quantity > 1) {
                        shoppingCart[itemIndex].quantity--;
                    } else {
                        // Jika kuantitas 1 dan dikurangi, bisa juga diartikan hapus item
                        // Untuk sekarang, kita batasi minimal 1. Jika mau hapus, gunakan tombol remove.
                        // Atau bisa tampilkan konfirmasi hapus di sini.
                        // shoppingCart.splice(itemIndex, 1);
                    }
                } else if (event.target.classList.contains('quantity-plus')) {
                    shoppingCart[itemIndex].quantity++;
                }
                saveCart();
                renderCart(); // Render ulang seluruh keranjang untuk update tampilan
            }
        }

        function handleRemoveItem(event) {
            const productId = event.target.dataset.id;
            if (window.confirm("Apakah Anda yakin ingin menghapus item ini dari keranjang?")) {
                const itemIndex = shoppingCart.findIndex(item => item.id === productId);
                if (itemIndex > -1) {
                    shoppingCart.splice(itemIndex, 1); // Hapus item dari array
                    saveCart();
                    renderCart(); // Render ulang
                }
            }
        }

        if (checkoutButton) {
            checkoutButton.addEventListener('click', () => {
                if (shoppingCart.length === 0) {
                    alert('Keranjang belanja Anda masih kosong.');
                    return;
                }

                // Hitung ulang subtotal dan totalCost di sini agar nilainya paling update
                // sebelum dikirim, atau pastikan updateOrderSummary() sudah terpanggil
                // dan kita bisa ambil nilainya dari DOM atau variabel global jika ada.
                // Untuk cara paling langsung, kita hitung di sini:
                let subtotal = 0;
                shoppingCart.forEach(item => {
                    subtotal += item.price * item.quantity;
                });

                const shippingCost = parseFloat(shippingCostSelect.value) || 0;
                const totalCost = subtotal + shippingCost;
                const formattedTotalCost = formatCurrency(totalCost); // Gunakan fungsi formatCurrency yang sudah ada

                let messageText = 'Halo, saya ingin memesan barang berikut:\n\n'; // Tambah baris baru untuk spasi
                shoppingCart.forEach((product, index) => {
                    const itemSubtotal = product.price * product.quantity;
                    messageText += `${index + 1}. ${product.name}\n`;
                    messageText += `   Kuantitas: ${product.quantity}\n`;
                    messageText += `   Harga Satuan: ${formatCurrency(product.price)}\n`;
                    messageText += `   Subtotal Item: ${formatCurrency(itemSubtotal)}\n\n`; // Tambah baris baru antar item
                });
                
                messageText += `----------------------------------\n`;
                messageText += `Subtotal Belanja: ${formatCurrency(subtotal)}\n`;
                messageText += `Biaya Pengiriman: ${formatCurrency(shippingCost)}\n`;
                messageText += `TOTAL BELANJA: ${formattedTotalCost}\n\n`; // TAMBAHKAN TOTAL HARGA DI SINI
                messageText += `Terima kasih!`; // Pesan penutup opsional

                // Hapus spasi ekstra di akhir jika ada sebelum encode
                messageText = messageText.trim(); 

                const encodedMessage = encodeURIComponent(messageText);
                const whatsappUrl = `https://wa.me/${sellerWhatsAppNumber}?text=${encodedMessage}`;
                
                window.location.href = whatsappUrl;
            });
        }

        // Event listener untuk perubahan biaya pengiriman
        if (shippingCostSelect) {
            shippingCostSelect.addEventListener('change', updateOrderSummary);
        }

        // --- Inisialisasi Keranjang Saat Halaman Dimuat ---
        initializeCart();
    });