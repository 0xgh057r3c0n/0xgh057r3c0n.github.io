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
    
    container.innerHTML = ''; // Clear container
    
    projects.forEach((project) => {
      const gridItem = document.createElement('div');
      const categoryClass = getCategoryClass(project.name, project.category);
      gridItem.classList.add('grid-item', categoryClass);

      // Handle image URL - use GitHub raw URL if possible
      let imgUrl = project.image || '';
      // Convert github blob URL to raw URL if needed
      if (imgUrl.includes('github.com') && imgUrl.includes('/blob/')) {
        imgUrl = imgUrl.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
      }
      
      // Fallback image if none provided
      if (!imgUrl) {
        imgUrl = `https://via.placeholder.com/350x200/1a1a2a/00ff88?text=${encodeURIComponent(project.name.substring(0, 20))}`;
      }

      gridItem.innerHTML = `
        <div class="box">
          <img src="${imgUrl}" alt="${project.name}" onerror="this.src='https://via.placeholder.com/350x200/1a1a2a/00ff88?text=${encodeURIComponent(project.name.substring(0, 20))}'" />
          <div class="content">
            <div class="tag">
              <h3><i class="fas fa-shield-alt" style="font-size:1.4rem; margin-right:0.8rem;"></i>${escapeHtml(project.name)}</h3>
            </div>
            <div class="desc">
              <p>${escapeHtml(project.desc || 'No description available')}</p>
              <div class="btns">
                <a href="${project.links.view}" class="btn" target="_blank" rel="noopener noreferrer">
                  <i class="fas fa-external-link-alt"></i> View
                </a>
                <a href="${project.links.code}" class="btn" target="_blank" rel="noopener noreferrer">
                  <i class="fab fa-github"></i> Code
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

      // Filter buttons
      $('.button-group .btn').on('click', function () {
        $('.button-group .btn').removeClass('is-checked');
        $(this).addClass('is-checked');

        var filterValue = $(this).attr('data-filter');
        $grid.isotope({ filter: filterValue });
      });
    } else {
      console.warn('jQuery or Isotope is not loaded. Using fallback filtering.');
      // Fallback filtering
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
}// script.js - Fixed version with proper image handling
document.getElementById('menu').onclick = function () {
  this.classList.toggle('fa-times');
  document.querySelector('.navbar').classList.toggle('nav-toggle');
};

// Scroll Top Button
window.onscroll = () => {
  document.getElementById('scroll-top').classList.toggle('active', window.scrollY > 60);
};

// Fetch and display projects
fetch('./projects.json')
  .then((res) => res.json())
  .then((projects) => {
    const container = document.querySelector('.box-container');
    if (!container) {
      console.error('Container element .box-container not found.');
      return;
    }
    
    projects.forEach((project) => {
      const box = document.createElement('div');
      // Add proper category class for filtering
      let categoryClass = 'tools'; // default
      if (project.name.toLowerCase().includes('cve')) categoryClass = 'vuln';
      if (project.name.toLowerCase().includes('bypass')) categoryClass = 'webapp';
      if (project.name.toLowerCase().includes('phish')) categoryClass = 'pentest';
      
      box.classList.add('grid-item', categoryClass);

      // Use a fallback image if GitHub image fails to load
      const imgUrl = project.image || `https://via.placeholder.com/350x200/1a1a2a/00ff88?text=${encodeURIComponent(project.name.substring(0, 15))}`;
      
      box.innerHTML = `
        <div class="box">
          <img src="${imgUrl}" alt="${project.name}" onerror="this.src='https://via.placeholder.com/350x200/1a1a2a/00ff88?text=${encodeURIComponent(project.name.substring(0, 15))}'" />
          <div class="content">
            <div class="tag">
              <h3>${project.name}</h3>
            </div>
            <div class="desc">
              <p>${project.desc}</p>
              <div class="btns">
                <a href="${project.links.view}" class="btn" target="_blank">View <i class="fas fa-external-link-alt"></i></a>
                <a href="${project.links.code}" class="btn" target="_blank">Code <i class="fab fa-github"></i></a>
              </div>
            </div>
          </div>
        </div>
      `;

      container.appendChild(box);
    });

    // Add gap between grid items
    container.style.display = 'grid';
    container.style.gap = '25px';
    container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(320px, 1fr))';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'stretch';
    container.style.padding = '10px';

    // Ensure all boxes have equal height
    const boxes = document.querySelectorAll('.box');
    boxes.forEach(box => {
      box.style.height = 'auto';
      box.style.minHeight = '320px';
    });

    // Initialize Isotope if available
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
      console.warn('jQuery or Isotope is not loaded.');
    }

    // Scroll Reveal animations
    if (typeof ScrollReveal !== 'undefined') {
      ScrollReveal().reveal('.grid-item', {
        distance: '50px',
        duration: 800,
        easing: 'ease-out',
        origin: 'bottom',
        interval: 100
      });
    }

    // Vanilla Tilt effect
    if (typeof VanillaTilt !== 'undefined') {
      VanillaTilt.init(document.querySelectorAll(".box"), {
        max: 8,
        speed: 300,
        glare: true,
        'max-glare': 0.2
      });
    }
  })
  .catch((error) => {
    console.error('Failed to load projects:', error);
    const container = document.querySelector('.box-container');
    if (container) {
      container.innerHTML = '<div style="text-align:center;padding:2rem;color:#fff;">Failed to load projects. Please check console.</div>';
    }
  });// Toggle navbar for small screens
document.getElementById('menu').onclick = function () {
  this.classList.toggle('fa-times');
  document.querySelector('.navbar').classList.toggle('nav-toggle');
};

// Scroll Top Button
window.onscroll = () => {
  document.getElementById('scroll-top').classList.toggle('active', window.scrollY > 60);
};

// Fetch and display projects
fetch('./projects.json')
  .then((res) => res.json())
  .then((projects) => {
    const container = document.querySelector('.box-container');
    if (!container) {
      console.error('Container element .box-container not found.');
      return;
    }
    projects.forEach((project) => {
      const box = document.createElement('div');
      box.classList.add('grid-item', project.category);

      box.innerHTML = `
        <div class="box">
          <img src="assets/images/${project.image}.png" alt="${project.name}" />
          <div class="content">
            <div class="tag">
              <h3>${project.name}</h3>
            </div>
            <div class="desc">
              <p>${project.desc}</p>
              <div class="btns">
                <a href="${project.links.view}" class="btn" target="_blank">View</a>
                <a href="${project.links.code}" class="btn" target="_blank">Code</a>
              </div>
            </div>
          </div>
        </div>
      `;

      container.appendChild(box);
    });

    // Add gap between grid items using inline style as fallback
    container.style.display = 'grid';
    container.style.gridGap = '20px';
    container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';

    // Ensure dependencies are loaded before using them
    if (typeof $ !== 'undefined' && typeof $.fn.isotope !== 'undefined') {
      var $grid = $('.box-container').isotope({
        itemSelector: '.grid-item',
        layoutMode: 'fitRows'
      });

      $('.button-group .btn').on('click', function () {
        $('.button-group .btn').removeClass('is-checked');
        $(this).addClass('is-checked');

        var filterValue = $(this).attr('data-filter');
        $grid.isotope({ filter: filterValue });
      });
    } else {
      console.warn('jQuery or Isotope is not loaded.');
    }

    if (typeof ScrollReveal !== 'undefined') {
      ScrollReveal().reveal('.box', {
        distance: '50px',
        duration: 1000,
        easing: 'ease-out',
        origin: 'bottom',
        interval: 200
      });
    } else {
      console.warn('ScrollReveal is not loaded.');
    }

    if (typeof VanillaTilt !== 'undefined') {
      VanillaTilt.init(document.querySelectorAll(".box"), {
        max: 15,
        speed: 400
      });
    } else {
      console.warn('VanillaTilt is not loaded.');
    }
  })
    .catch((error) => {
      console.error('Failed to load projects:', error);
    });
