const products = [
  {
    id: 'p-001',
    name: 'ドリフトウッド・ウォールアート',
    category: 'interior',
    price: 16800,
    description: '海岸に漂着した流木を再利用した一点物のウォールアート。お部屋に自然のアクセントを。',
    image:
      'https://images.unsplash.com/photo-1529429617124-aee711a2b32b?auto=format&fit=crop&w=800&q=80',
    featured: true,
  },
  {
    id: 'p-002',
    name: 'セラミック・ドリッパーセット',
    category: 'kitchen',
    price: 9200,
    description: '波模様が施された職人手作りのドリッパー。マグとサーバー、真鍮フィルターがセットです。',
    image:
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80',
    featured: false,
  },
  {
    id: 'p-003',
    name: 'ハーバル・ピロー＆ミスト',
    category: 'wellness',
    price: 4800,
    description: '海辺のハーブをブレンドしたリラックスピローと、ピローミストのセット。',
    image:
      'https://images.unsplash.com/photo-1524594154908-eddffda84c1d?auto=format&fit=crop&w=800&q=80',
    featured: true,
  },
  {
    id: 'p-004',
    name: 'マリンリネン・テーブルクロス',
    category: 'kitchen',
    price: 13200,
    description: '環境に配慮したリネン100%。爽やかなブルーとホワイトのストライプ柄。',
    image:
      'https://images.unsplash.com/photo-1506368083636-6defb67639c8?auto=format&fit=crop&w=800&q=80',
    featured: false,
  },
  {
    id: 'p-005',
    name: 'ソルトキャンドル・トリオ',
    category: 'interior',
    price: 5600,
    description: 'ミネラル豊富な海塩を使ったキャンドル。穏やかな香りでリラックスタイムに。',
    image:
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=800&q=80',
    featured: true,
  },
  {
    id: 'p-006',
    name: 'ポータブル・サンドチェア',
    category: 'outdoor',
    price: 15800,
    description: 'ビーチでもキャンプでも活躍する、軽量折りたたみチェア。キャリーバッグ付属。',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    featured: false,
  },
  {
    id: 'p-007',
    name: 'シーグラス・ランプシェード',
    category: 'interior',
    price: 11800,
    description: '海で磨かれたシーグラスを丁寧につなぎ合わせた、柔らかな光のランプシェード。',
    image:
      'https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=800&q=80',
    featured: false,
  },
  {
    id: 'p-008',
    name: 'オーシャン・ボディオイル',
    category: 'wellness',
    price: 6400,
    description: '海藻エキスと柑橘をブレンドしたボディオイル。しっとりとした保湿力が特徴です。',
    image:
      'https://images.unsplash.com/photo-1542835435-4fa357baa00d?auto=format&fit=crop&w=800&q=80',
    featured: true,
  },
];

const state = {
  search: '',
  category: 'all',
  maxPrice: 20000,
  featuredOnly: false,
  cart: [],
};

const dom = {
  productList: document.querySelector('[data-product-list]'),
  productTemplate: document.getElementById('product-card-template'),
  cartTemplate: document.getElementById('cart-item-template'),
  cartCount: document.querySelector('[data-cart-count]'),
  cartTotal: document.querySelector('[data-cart-total]'),
  cartItems: document.querySelector('[data-cart-items]'),
  cartEmpty: document.querySelector('[data-cart-empty]'),
  cartBody: document.querySelector('[data-cart-body]'),
  cartToggle: document.querySelector('.cart-toggle'),
  cartPanel: document.getElementById('cart-panel'),
  cartClose: document.querySelector('.cart-close'),
  cartBackdrop: document.querySelector('[data-cart-backdrop]'),
  checkoutButton: document.querySelector('.checkout-button'),
  priceValue: document.querySelector('[data-price-value]'),
  emptyState: document.querySelector('[data-empty-state]'),
  searchInput: document.querySelector('[data-search-input]'),
  categoryFilter: document.querySelector('[data-category-filter]'),
  priceFilter: document.querySelector('[data-price-filter]'),
  featuredFilter: document.querySelector('[data-featured-filter]'),
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(value);

function loadCartFromStorage() {
  try {
    const stored = localStorage.getItem('harbor-market-cart');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        state.cart = parsed;
      }
    }
  } catch (error) {
    console.error('カート情報の読み込みに失敗しました', error);
  }
}

function saveCart() {
  try {
    localStorage.setItem('harbor-market-cart', JSON.stringify(state.cart));
  } catch (error) {
    console.error('カート情報の保存に失敗しました', error);
  }
}

function filterProducts() {
  return products.filter((product) => {
    const matchesSearch = product.name.includes(state.search) || product.description.includes(state.search);
    const matchesCategory = state.category === 'all' || product.category === state.category;
    const matchesPrice = product.price <= state.maxPrice;
    const matchesFeatured = !state.featuredOnly || product.featured;
    return matchesSearch && matchesCategory && matchesPrice && matchesFeatured;
  });
}

function renderProducts() {
  const filtered = filterProducts();
  dom.productList.innerHTML = '';

  if (filtered.length === 0) {
    dom.emptyState.hidden = false;
    return;
  }

  dom.emptyState.hidden = true;

  filtered.forEach((product) => {
    const card = dom.productTemplate.content.firstElementChild.cloneNode(true);
    const img = card.querySelector('img');
    img.src = product.image;
    img.alt = product.name;

    card.querySelector('h3').textContent = product.name;
    card.querySelector('.product-description').textContent = product.description;
    card.querySelector('.product-price').textContent = formatCurrency(product.price);
    card.querySelector('.product-category').textContent = `#${product.category}`;

    const button = card.querySelector('.add-to-cart');
    button.addEventListener('click', () => {
      addToCart(product.id);
    });

    dom.productList.appendChild(card);
  });
}

function addToCart(productId) {
  const existing = state.cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({ id: productId, quantity: 1 });
  }
  updateCart();
  openCart();
  saveCart();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter((item) => item.id !== productId);
  updateCart();
  saveCart();
}

function updateQuantity(productId, quantity) {
  const item = state.cart.find((cartItem) => cartItem.id === productId);
  if (!item) return;

  const parsed = Number(quantity);
  if (Number.isNaN(parsed) || parsed < 1) {
    item.quantity = 1;
  } else {
    item.quantity = Math.floor(parsed);
  }
  updateCart();
  saveCart();
}

function getProductById(id) {
  return products.find((product) => product.id === id);
}

function updateCart() {
  dom.cartItems.innerHTML = '';

  if (state.cart.length === 0) {
    dom.cartEmpty.hidden = false;
    dom.cartTotal.textContent = formatCurrency(0);
    dom.cartCount.textContent = '0';
    return;
  }

  dom.cartEmpty.hidden = true;

  let total = 0;
  let count = 0;

  state.cart.forEach((cartItem) => {
    const product = getProductById(cartItem.id);
    if (!product) return;

    const node = dom.cartTemplate.content.firstElementChild.cloneNode(true);
    node.querySelector('.cart-item-name').textContent = product.name;
    node.querySelector('.cart-item-price').textContent = formatCurrency(product.price * cartItem.quantity);

    const quantityInput = node.querySelector('input[type="number"]');
    quantityInput.value = cartItem.quantity;
    quantityInput.addEventListener('change', (event) => {
      updateQuantity(cartItem.id, event.target.value);
    });

    const removeButton = node.querySelector('.remove-item');
    removeButton.addEventListener('click', () => removeFromCart(cartItem.id));

    dom.cartItems.appendChild(node);

    total += product.price * cartItem.quantity;
    count += cartItem.quantity;
  });

  dom.cartTotal.textContent = formatCurrency(total);
  dom.cartCount.textContent = String(count);
}

function openCart() {
  dom.cartPanel.classList.add('open');
  dom.cartPanel.setAttribute('aria-hidden', 'false');
  dom.cartToggle.setAttribute('aria-expanded', 'true');
  dom.cartBackdrop.hidden = false;
}

function closeCart() {
  dom.cartPanel.classList.remove('open');
  dom.cartPanel.setAttribute('aria-hidden', 'true');
  dom.cartToggle.setAttribute('aria-expanded', 'false');
  dom.cartBackdrop.hidden = true;
}

function initEvents() {
  dom.searchInput.addEventListener('input', (event) => {
    state.search = event.target.value.trim();
    renderProducts();
  });

  dom.categoryFilter.addEventListener('change', (event) => {
    state.category = event.target.value;
    renderProducts();
  });

  dom.priceFilter.addEventListener('input', (event) => {
    state.maxPrice = Number(event.target.value);
    dom.priceValue.textContent = formatCurrency(state.maxPrice);
    renderProducts();
  });

  dom.featuredFilter.addEventListener('change', (event) => {
    state.featuredOnly = event.target.checked;
    renderProducts();
  });

  dom.cartToggle.addEventListener('click', () => {
    const isOpen = dom.cartPanel.classList.contains('open');
    if (isOpen) {
      closeCart();
    } else {
      openCart();
    }
  });

  dom.cartClose.addEventListener('click', closeCart);
  dom.cartBackdrop.addEventListener('click', closeCart);
  dom.checkoutButton.addEventListener('click', () => {
    alert('ご注文ありがとうございます！現在はデモサイトのため注文は確定されません。');
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeCart();
    }
  });
}

function initialize() {
  const yearEl = document.querySelector('[data-current-year]');
  yearEl.textContent = new Date().getFullYear();

  loadCartFromStorage();
  renderProducts();
  updateCart();
  initEvents();
}

initialize();
