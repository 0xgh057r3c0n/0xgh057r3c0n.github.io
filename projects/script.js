// Toggle navbar for small screens
document.getElementById('menu').onclick = function () {
  this.classList.toggle('fa-times');
  document.querySelector('.navbar').classList.toggle('nav-toggle');
};

// Scroll Top Button
window.onscroll = () => {
  const scrollBtn = document.getElementById('scroll-top');
  if (scrollBtn) {
    scrollBtn.classList.toggle('active', window.scrollY > 60);
  }
};

// Function to determine category class based on project name
function getCategoryClass(projectName, projectCategory) {
  const name = projectName.toLowerCase();
  if (name.includes('cve')) return 'vuln';
  if (name.includes('bypass') || name.includes('auth')) return 'webapp';
  if (name.includes('phish') || name.includes('hack')) return 'pentest';
  if (name.includes('osint') || name.includes('sherlock')) return 'research';
  return 'tools';
}

// Fetch and display projects
fetch('./projects.json')
  .then((res) => {
    if (!res.ok) throw new Error('Failed to load projects.json');
    return res.json();
  })
  .then((projects) => {
    const container = document.querySelector('.box-container');
    if (!container) {
      console.error('Container element .box-container not found.');
      return;
    }
    
    container.innerHTML = '';
    
    projects.forEach((project) => {
      const gridItem = document.createElement('div');
      const categoryClass = getCategoryClass(project.name, project.category);
      gridItem.classList.add('grid-item', categoryClass);

      // Handle image URL - make it round with fallback
      let imgUrl = project.image || '';
      if (imgUrl.includes('github.com') && imgUrl.includes('/blob/')) {
        imgUrl = imgUrl.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
      }
      
      if (!imgUrl || imgUrl === '') {
        imgUrl = `https://via.placeholder.com/200x200/1a1a2a/00ff88?text=${encodeURIComponent(project.name.substring(0, 3))}`;
      }

      // Get GitHub repo link
      const repoLink = project.links.view || project.links.code || '#';

      gridItem.innerHTML = `
        <div class="box">
          <img src="${imgUrl}" alt="${project.name}" onerror="this.src='https://via.placeholder.com/200x200/1a1a2a/00ff88?text=${encodeURIComponent(project.name.substring(0, 3))}'" />
          <div class="content">
            <div class="tag">
              <h3><i class="fas fa-shield-alt" style="font-size:1.4rem; margin-right:0.8rem;"></i>${escapeHtml(project.name)}</h3>
            </div>
            <div class="desc">
              <p>${escapeHtml(project.desc || 'No description available')}</p>
              <div class="btns">
                <a href="${repoLink}" class="btn-try" target="_blank" rel="noopener noreferrer">
                  <i class="fab fa-github"></i> Try for Free
                </a>
              </div>
            </div>
          </div>
        </div>
      `;

      container.appendChild(gridItem);
    });

    // Initialize Isotope after all items are added
    if (typeof $ !== 'undefined' && typeof $.fn.isotope !== 'undefined') {
      var $grid = $('.box-container').isotope({
        itemSelector: '.grid-item',
        layoutMode: 'fitRows',
        transitionDuration: '0.4s'
      });

      $('.button-group .btn').on('click', function () {
        $('.button-group .btn').removeClass('is-checked');
        $(this).addClass('is-checked');

        var filterValue = $(this).attr('data-filter');
        $grid.isotope({ filter: filterValue });
      });
    } else {
      console.warn('jQuery or Isotope is not loaded. Using fallback filtering.');
      const filterBtns = document.querySelectorAll('.button-group .btn');
      filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
          const filter = this.getAttribute('data-filter');
          const items = document.querySelectorAll('.grid-item');
          filterBtns.forEach(b => b.classList.remove('is-checked'));
          this.classList.add('is-checked');
          
          items.forEach(item => {
            if (filter === '*' || item.classList.contains(filter.substring(1))) {
              item.style.display = '';
            } else {
              item.style.display = 'none';
            }
          });
        });
      });
    }

    // Scroll Reveal animations
    if (typeof ScrollReveal !== 'undefined') {
      ScrollReveal().reveal('.grid-item', {
        distance: '50px',
        duration: 800,
        easing: 'ease-out',
        origin: 'bottom',
        interval: 100,
        reset: false
      });
    }

    // Vanilla Tilt effect
    if (typeof VanillaTilt !== 'undefined') {
      VanillaTilt.init(document.querySelectorAll(".box"), {
        max: 8,
        speed: 300,
        glare: true,
        'max-glare': 0.15,
        scale: 1.02
      });
    }
  })
  .catch((error) => {
    console.error('Failed to load projects:', error);
    const container = document.querySelector('.box-container');
    if (container) {
      container.innerHTML = `
        <div style="grid-column:1/-1; text-align:center; padding:3rem; color:#00ff88;">
          <i class="fas fa-exclamation-triangle" style="font-size:3rem; margin-bottom:1rem; display:block;"></i>
          <p style="font-size:1.6rem;">Failed to load projects. Please check the console.</p>
          <p style="font-size:1.3rem; margin-top:1rem; color:#aaa;">Make sure projects.json file exists and is valid.</p>
        </div>
      `;
    }
  });

// Helper function to escape HTML
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
