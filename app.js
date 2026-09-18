(() => {
  let lastWheelTime = 0;

  document.addEventListener('wheel', (event) => {
    if (event.defaultPrevented || !event.deltaY) return;
    const now = Date.now();
    if (now - lastWheelTime < 8) return;
    lastWheelTime = now;
    window.scrollBy({ top: event.deltaY, behavior: 'auto' });
  }, { passive: true });

  const categoryButtons = [...document.querySelectorAll('.category-pill')];
  const serviceCards = [...document.querySelectorAll('.service-card')];

  const categoryForCard = (card) => {
    return card.dataset.category || 'haircuts';
  };

  const showToast = (message) => {
    let toast = document.querySelector('[data-toast]');
    if (!toast) {
      toast = document.createElement('div');
      toast.dataset.toast = 'true';
      toast.className = 'fixed bottom-24 left-1/2 z-[100] -translate-x-1/2 rounded-lg bg-primary px-4 py-3 text-center text-sm font-medium text-on-primary shadow-xl transition-opacity';
      document.body.append(toast);
    }
    toast.textContent = message;
    toast.classList.remove('opacity-0');
    clearTimeout(toast.dismissTimer);
    toast.dismissTimer = setTimeout(() => toast.classList.add('opacity-0'), 2400);
  };

  const openBooking = () => {
    let dialog = document.querySelector('[data-booking-dialog]');
    if (!dialog) {
      dialog = document.createElement('dialog');
      dialog.dataset.bookingDialog = 'true';
      dialog.className = 'w-[min(92vw,440px)] rounded-2xl border border-primary/30 bg-surface-container p-0 text-text-on-dark-high shadow-2xl backdrop:bg-black/70';
      dialog.innerHTML = `
        <form method="dialog" class="p-5">
          <div class="mb-5 flex items-start justify-between gap-4">
            <div><p class="mb-1 text-xs uppercase tracking-widest text-primary">Royal appointment</p><h2 class="font-title-card text-2xl">Reserve your chair</h2></div>
            <button value="cancel" aria-label="Close booking dialog" class="rounded-full p-2 text-text-on-dark-medium hover:bg-surface-container-high">close</button>
          </div>
          <label class="mb-4 block text-sm">Selected services<input data-booking-services readonly class="mt-2 w-full rounded-lg border border-outline bg-surface-container-high p-3 text-text-on-dark-high"></label>
          <label class="mb-4 block text-sm">Preferred date<input type="date" required class="mt-2 w-full rounded-lg border border-outline bg-surface-container-high p-3 text-text-on-dark-high"></label>
          <label class="mb-5 block text-sm">Preferred time<select required class="mt-2 w-full rounded-lg border border-outline bg-surface-container-high p-3 text-text-on-dark-high"><option value="">Choose a time</option><option>10:00 AM</option><option>12:30 PM</option><option>3:00 PM</option><option>5:30 PM</option></select></label>
          <button value="confirm" class="w-full rounded-lg bg-primary p-3 font-label-caps text-sm uppercase text-on-primary">Request appointment</button>
        </form>`;
      document.body.append(dialog);
      dialog.addEventListener('close', () => {
        if (dialog.returnValue === 'confirm') showToast('Appointment request received. We will confirm shortly.');
      });
    }
    const drawerService = document.querySelector('#drawer-service-name')?.innerText.trim();
    dialog.querySelector('[data-booking-services]').value = drawerService || 'Choose a service at the salon';
    dialog.showModal();
  };

  const setCategory = (category) => {
    categoryButtons.forEach((button) => {
      const active = button.dataset.category === category;
      button.classList.toggle('active', active);
      button.classList.toggle('bg-primary', active);
      button.classList.toggle('text-on-primary', active);
      button.classList.toggle('bg-surface-container-high', !active);
      button.classList.toggle('text-text-on-dark-medium', !active);
    });
    serviceCards.forEach((card) => {
      const visible = category === 'all' || categoryForCard(card) === category;
      card.hidden = !visible;
    });
  };

  categoryButtons.forEach((button) => {
    const label = button.innerText.trim().toLowerCase();
    const category = label.includes('all') ? 'all' : label.includes('beard') ? 'detailing' : label.includes('tailored') ? 'specialized' : 'haircuts';
    button.dataset.category = category;
    button.addEventListener('click', () => setCategory(category));
  });

  [...document.querySelectorAll('button')].filter((button) => button.innerText.includes('RESERVE')).forEach((button) => {
    button.addEventListener('click', openBooking);
  });

  document.querySelectorAll('[data-path="booking-flow"], .service-card button:first-of-type').forEach((element) => {
    if (element.closest('.service-card')) return;
    element.addEventListener('click', (event) => {
      event.preventDefault();
      openBooking();
    });
  });

  document.querySelectorAll('[data-path]').forEach((link) => {
    if (link.dataset.path === 'booking-flow') return;
    link.addEventListener('click', (event) => {
      event.preventDefault();
      document.querySelectorAll('[data-path]').forEach((item) => item.classList.toggle('text-primary', item === link));
      showToast(`${link.innerText.replace(/\s+/g, ' ').trim()} selected`);
    });
  });

  [...document.querySelectorAll('.service-card button')].filter((button) => button.innerText.includes('ADD TO CUT')).forEach((button) => {
    button.addEventListener('click', () => showToast('Upgrade added to your cut'));
  });
})();
