(function () {
	const projects = document.querySelectorAll('.project');
	const modal = document.getElementById('projectModal');
	const overlay = document.getElementById('modalOverlay');
	const closeBtn = document.getElementById('modalClose');

	const modalImage = document.getElementById('modalImage');
	const modalTitle = document.getElementById('modalTitle');
	const modalDescription = document.getElementById('modalDescription');
	const modalGithub = document.getElementById('modalGithub');
	const modalLive = document.getElementById('modalLive');

	const imgPrev = document.getElementById('imgPrev');
	const imgNext = document.getElementById('imgNext');

	let images = [];
	let idx = 0;

	function openModalFromElement(el) {
		const title = el.dataset.title || '';
		const description = el.dataset.description || '';
		const imgs = (el.dataset.images || '').split(',').map(s => s.trim()).filter(Boolean);
		const github = el.dataset.github || '#';
		const live = el.dataset.live || '#';

		images = imgs.length ? imgs : [el.querySelector('img')?.src || ''];
		idx = 0;

		modalTitle.textContent = title;
		modalDescription.textContent = description;
		modalGithub.href = github;
		// Mostrar u ocultar el botón "Ver desplegado" según data-no-live o data-live
		const noLiveFlag = String(el.dataset.noLive || '').toLowerCase() === 'true';
		const hasLiveUrl = !!(el.dataset.live && el.dataset.live.trim() && el.dataset.live !== '#');

		if (!noLiveFlag && hasLiveUrl) {
			modalLive.href = live;
			modalLive.style.display = ''; // restaurar visibilidad
			modalLive.removeAttribute('aria-hidden');
			modalLive.setAttribute('tabindex', '0');
		} else {
			// Ocultar y quitar del tab order / accesibilidad
			modalLive.href = '#';
			modalLive.style.display = 'none';
			modalLive.setAttribute('aria-hidden', 'true');
			modalLive.setAttribute('tabindex', '-1');
		}

		setImage(idx);
		showModal();
	}

	function setImage(i) {
		modalImage.src = images[i] || '';
		modalImage.alt = modalTitle.textContent + ' — imagen ' + (i + 1);
	}

	function showModal() {
		modal.setAttribute('aria-hidden', 'false');
		modal.classList.add('open');
		document.body.style.overflow = 'hidden';
		closeBtn.focus();
	}

	function closeModal() {
		modal.setAttribute('aria-hidden', 'true');
		modal.classList.remove('open');
		document.body.style.overflow = '';
	}

	projects.forEach(p => {
		p.addEventListener('click', () => openModalFromElement(p));
		p.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				openModalFromElement(p);
			}
		});
	});

	overlay.addEventListener('click', closeModal);
	closeBtn.addEventListener('click', closeModal);

	imgPrev.addEventListener('click', () => {
		if (!images.length) return;
		idx = (idx - 1 + images.length) % images.length;
		setImage(idx);
	});
	imgNext.addEventListener('click', () => {
		if (!images.length) return;
		idx = (idx + 1) % images.length;
		setImage(idx);
	});

	document.addEventListener('keydown', (e) => {
		if (!modal.classList.contains('open')) return;
		if (e.key === 'Escape') return closeModal();
		if (e.key === 'ArrowLeft') { idx = (idx - 1 + images.length) % images.length; setImage(idx); }
		if (e.key === 'ArrowRight') { idx = (idx + 1) % images.length; setImage(idx); }
	});
})();