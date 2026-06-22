(() => {
	const NAV_ID = 'floxybox-sidenav';
	const OVERLAY_ID = 'floxybox-nav-overlay';

	function injectNavStyles() {
		if (document.getElementById('floxybox-nav-styles')) {
			return;
		}

		const style = document.createElement('style');
		style.id = 'floxybox-nav-styles';
		style.textContent = `
			.floxybox-sidenav {
				position: fixed;
				top: 0;
				left: 0;
				height: 100vh;
				width: 0;
				overflow-x: hidden;
				background: #111;
				color: #fff;
				z-index: 2000;
				transition: width 0.35s ease;
				box-shadow: 8px 0 30px rgba(0, 0, 0, 0.22);
				padding-top: 72px;
			}

			.floxybox-sidenav.open {
				width: 290px;
				max-width: 80vw;
			}

			.floxybox-sidenav a {
				display: block;
				padding: 14px 22px;
				text-decoration: none;
				color: #d8d8d8;
				font-size: 16px;
				transition: background-color 0.2s ease, color 0.2s ease;
			}

			.floxybox-sidenav a:hover {
				color: #fff;
				background: rgba(255, 255, 255, 0.08);
			}

			.floxybox-sidenav .closebtn {
				position: absolute;
				top: 10px;
				right: 16px;
				font-size: 34px;
				line-height: 1;
			}

			.floxybox-nav-overlay {
				position: fixed;
				inset: 0;
				background: rgba(0, 0, 0, 0.35);
				opacity: 0;
				pointer-events: none;
				transition: opacity 0.25s ease;
				z-index: 1900;
			}

			.floxybox-nav-overlay.visible {
				opacity: 1;
				pointer-events: auto;
			}

			@media (max-width: 480px) {
				.floxybox-sidenav.open {
					width: 100vw;
					max-width: none;
				}
			}
		`;
		document.head.appendChild(style);
	}

	function ensureOverlay() {
		let overlay = document.getElementById(OVERLAY_ID);

		if (!overlay) {
			overlay = document.createElement('div');
			overlay.id = OVERLAY_ID;
			overlay.className = 'floxybox-nav-overlay';
			document.body.appendChild(overlay);
		}

		overlay.addEventListener('click', closeNav);
		return overlay;
	}

	function ensureSidenav() {
		let sidenav = document.getElementById(NAV_ID);

		if (!sidenav) {
			sidenav = document.createElement('nav');
			sidenav.id = NAV_ID;
			sidenav.className = 'floxybox-sidenav';
			sidenav.innerHTML = `
				<a href="javascript:void(0)" class="closebtn" aria-label="Close menu">&times;</a>
				<a href="#hero">Home</a>
				<a href="#category-section">Category</a>
				<a href="#brand-spotlight">Brand Spotlight</a>
				<a href="#trending-products">Trending Products</a>
			`;
			document.body.appendChild(sidenav);
		}

		const closeButton = sidenav.querySelector('.closebtn');
		if (closeButton && !closeButton.dataset.bound) {
			closeButton.dataset.bound = 'true';
			closeButton.addEventListener('click', (event) => {
				event.preventDefault();
				closeNav();
			});
		}

		return sidenav;
	}

	function openNav() {
		const sidenav = ensureSidenav();
		const overlay = ensureOverlay();

		sidenav.classList.add('open');
		overlay.classList.add('visible');
		document.body.style.overflow = 'hidden';
	}

	function closeNav() {
		const sidenav = document.getElementById(NAV_ID);
		const overlay = document.getElementById(OVERLAY_ID);

		if (sidenav) {
			sidenav.classList.remove('open');
		}

		if (overlay) {
			overlay.classList.remove('visible');
		}

		document.body.style.overflow = '';
	}

	function normalizeCategoryMarkup() {
		document.querySelectorAll('.category-grid > a').forEach((link) => {
			link.classList.add('category-item');

			const imageWrapper = link.querySelector('.category-image0');
			if (imageWrapper) {
				imageWrapper.classList.add('category-image');
			}
		});
	}

	function wireBuyButtons() {
		document.querySelectorAll('.product-card button').forEach((button) => {
			button.addEventListener('click', () => {
				const card = button.closest('.product-card');
				const title = card?.querySelector('h3')?.textContent?.trim() || 'this product';
				alert(`Added ${title} to your cart.`);
			});
		});
	}

	function wireSectionAnchors() {
		document.querySelectorAll('.floxybox-sidenav a[href^="#"]').forEach((anchor) => {
			anchor.addEventListener('click', (event) => {
				const targetId = anchor.getAttribute('href')?.slice(1);
				const target = targetId ? document.getElementById(targetId) : null;

				if (!target) {
					return;
				}

				event.preventDefault();
				closeNav();
				target.scrollIntoView({ behavior: 'smooth', block: 'start' });
			});
		});
	}

	function ensureSectionIds() {
		const mappings = [
			['category-section', '.category-section'],
			['brand-spotlight', '.brand-spotlight'],
			['trending-products', '.trending-products'],
		];

		mappings.forEach(([id, selector]) => {
			const section = document.querySelector(selector);
			if (section && !section.id) {
				section.id = id;
			}
		});

		const hero = document.querySelector('.hero');
		if (hero && !hero.id) {
			hero.id = 'hero';
		}
	}

	function init() {
		injectNavStyles();
		ensureSectionIds();
		normalizeCategoryMarkup();
		ensureSidenav();
		ensureOverlay();
		wireBuyButtons();
		wireSectionAnchors();

		document.addEventListener('keydown', (event) => {
			if (event.key === 'Escape') {
				closeNav();
			}
		});
	}

	window.openNav = openNav;
	window.closeNav = closeNav;

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init, { once: true });
	} else {
		init();
	}
})();
