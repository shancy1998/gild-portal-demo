// Shared demo interactions for the GILD portal prototype.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-year]').forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const nav = document.querySelector('.site-nav');

  if (nav) {
    const header = nav.closest('.site-header');
    if (header) {
      const menuButton = document.createElement('button');
      menuButton.type = 'button';
      menuButton.className = 'mobile-menu-toggle';
      menuButton.setAttribute('aria-label', 'Open navigation menu');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.textContent = '☰';
      header.insertBefore(menuButton, nav);
      menuButton.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('is-open');
        menuButton.setAttribute('aria-expanded', String(isOpen));
        menuButton.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
        menuButton.textContent = isOpen ? '×' : '☰';
      });
      nav.addEventListener('click', (event) => {
        if (event.target.closest('a')) {
          nav.classList.remove('is-open');
          menuButton.setAttribute('aria-expanded', 'false');
          menuButton.setAttribute('aria-label', 'Open navigation menu');
          menuButton.textContent = '☰';
        }
      });
    }

    const links = [
      ['index.html', 'Home'],
      ['jobs.html', 'Jobs'],
      ['ranking.html', 'Ranking'],
      ['dashboard.html', 'Dashboard'],
      ['profile.html', 'Profile']
    ];

    const navHtml = links.map(([href, label]) => {
      const isActive = currentPage === href;
      return `<a href="${href}" class="${isActive ? 'is-active' : ''}">${label}</a>`;
    }).join('');

    const actionHtml = currentPage === 'login.html'
      ? '<a class="button button-primary" href="register.html">Create account</a>'
      : currentPage === 'register.html'
        ? '<a class="button button-outline" href="login.html">Log in</a>'
        : '<a class="button button-outline" href="login.html">Log in</a><a class="button button-primary" href="register.html">Create account</a>';

    nav.innerHTML = navHtml + actionHtml;
  }

  const searchInput = document.querySelector('.search-input');
  const jobList = document.querySelector('.job-list');
  if (searchInput && jobList) {
    const jobs = [...jobList.querySelectorAll('.job-card')];
    const emptyState = document.createElement('p');
    emptyState.className = 'empty-state muted';
    emptyState.setAttribute('aria-live', 'polite');
    emptyState.hidden = true;
    jobList.append(emptyState);

    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim().toLowerCase();
      let visibleJobs = 0;
      jobs.forEach((job) => {
        const matches = job.textContent.toLowerCase().includes(query);
        job.hidden = !matches;
        if (matches) visibleJobs += 1;
      });
      emptyState.textContent = visibleJobs ? '' : 'No sample roles match your search. Try another keyword.';
      emptyState.hidden = visibleJobs > 0;
    });
  }
});

document.addEventListener('click', (event) => {
  const scoreButton = event.target.closest('[data-score-change]');
  if (scoreButton) {
    const input = document.querySelector('#admin-score');
    if (!input) return;
    const next = Math.max(0, Math.min(100, Number(input.value || 0) + Number(scoreButton.dataset.scoreChange)));
    input.value = String(next);
    return;
  }

  const applyButton = event.target.closest('[data-demo-apply]');
  if (applyButton) {
    applyButton.textContent = 'Applied • Demo';
    applyButton.disabled = true;
    applyButton.classList.add('is-success');
    return;
  }

  const actionButton = event.target.closest('[data-admin-action]');
  if (!actionButton) return;
  const action = actionButton.dataset.adminAction;
  const row = actionButton.closest('tr');

  if (action === 'approve' || action === 'reject') {
    const badge = row?.querySelector('.status-pill');
    if (badge) {
      badge.textContent = action === 'approve' ? 'Approved' : 'Rejected';
      badge.className = `status-pill ${action === 'approve' ? 'status-approved' : 'status-rejected'}`;
    }
  } else if (action === 'verify') {
    const badge = row?.querySelector('.status-pill');
    if (badge) {
      badge.textContent = 'Verified';
      badge.className = 'status-pill status-approved';
    }
    actionButton.textContent = 'Verified';
    actionButton.disabled = true;
  } else if (action === 'delete' || action === 'delete-job') {
    if (row && window.confirm('Delete this sample row from the demo? This does not affect stored data.')) row.remove();
  } else if (action === 'assign-level') {
    const score = Math.max(0, Math.min(100, Number(document.querySelector('#admin-score')?.value || 0)));
    const level = score <= 25 ? 'Bronze' : score <= 50 ? 'Silver' : score <= 75 ? 'Gold' : 'Platinum';
    const target = document.querySelector('#assigned-level');
    if (target) target.textContent = level;
  } else if (action === 'edit-job' && row) {
    const current = row.cells[0]?.textContent || '';
    const revised = window.prompt('Edit sample job title:', current);
    if (revised && revised.trim()) row.cells[0].textContent = revised.trim();
  }
});

document.addEventListener('submit', (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement) || !form.matches('[data-demo-form]')) return;

  event.preventDefault();

  const message = form.querySelector('.form-message');

  if (form.id === 'registration-form') {
    const password = form.querySelector('#password')?.value || '';
    const confirmPassword = form.querySelector('#confirm-password')?.value || '';

    if (password !== confirmPassword) {
      if (message) {
        message.textContent = 'Passwords do not match. Please enter the same password in both fields.';
        message.style.color = '#c45d5d';
      }
      return;
    }

      if (message) {
        message.textContent = 'Demo flow only: no account or details were saved. Opening the sample dashboard...';
        message.style.color = '#268b68';
      }

    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 600);
    return;
  }

  if (form.id === 'login-form') {
    if (message) {
      message.textContent = 'Demo only: credentials were not checked and no session was created. Opening the sample dashboard...';
      message.style.color = '#94620e';
    }
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 700);
    return;
  }

  if (form.id === 'password-reset-form') {
    if (message) {
      message.textContent = 'Password recovery is a visual preview only; no reset request was sent.';
      message.style.color = '#94620e';
    }
    return;
  }

  if (form.querySelector('input[name="identity"]') || form.querySelector('input[name="resetIdentity"]')) {
    const identity = form.querySelector('input[name="identity"]') || form.querySelector('input[name="resetIdentity"]');
    if (message) {
      message.textContent = identity && identity.value
        ? 'Demo mode: request accepted. Please continue with the prototype flow.'
        : 'Please enter your email or mobile number.';
      message.style.color = identity && identity.value ? '#268b68' : '#c45d5d';
    }

    if (identity && identity.value) {
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 700);
    }
    return;
  }

  if (message) {
      message.textContent = form.id === 'profile-form'
        ? 'Demo only: profile changes were not saved because no secure account service is connected.'
        : 'Demo only: this action was not saved or sent to a server.';
      message.style.color = '#946413';
  }

  if (form.querySelector('input[name="name"]') && form.querySelector('textarea[name="experience"]')) {
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }
});

document.addEventListener('submit', (event) => {
  if (event.target.id !== 'admin-job-form') return;
  event.preventDefault();
  const titleInput = document.querySelector('#new-job-title');
  const locationInput = document.querySelector('#new-job-location');
  const jobs = document.querySelector('#admin-jobs');
  if (!titleInput || !locationInput || !jobs) return;

  const row = document.createElement('tr');
  const titleCell = document.createElement('td');
  titleCell.textContent = titleInput.value.trim();
  const locationCell = document.createElement('td');
  locationCell.textContent = locationInput.value.trim();
  const actionsCell = document.createElement('td');
  actionsCell.className = 'admin-actions';
  [['Edit Job', 'edit-job', 'button button-small'], ['Delete Job', 'delete-job', 'button button-small button-danger']].forEach(([label, action, classes]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = classes;
    button.dataset.adminAction = action;
    button.textContent = label;
    actionsCell.append(button);
  });
  row.append(titleCell, locationCell, actionsCell);
  jobs.append(row);
  event.target.reset();
});
