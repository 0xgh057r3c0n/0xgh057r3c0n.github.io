// Toggle navbar for small screens
document.getElementById('menu').onclick = function () {
  this.classList.toggle('fa-times');
  document.querySelector('.navbar').classList.toggle('nav-toggle');
};

// Scroll Top Button
window.onscroll = () => {
  document
    .getElementById('scroll-top')
    .classList.toggle('active', window.scrollY > 60);
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

      // project.image already contains the full GitHub image URL
      box.innerHTML = `
        <div class="box">
          <img src="${project.image}" alt="${project.name}" />
          <div class="content">
            <div class="tag">
              <h3>${project.name}</h3>
            </div>
            <div class="desc">
              <p>${project.desc}</p>
              <div class="btns">
                <a href="${project.links.view}" class="btn" target="_blank" rel="noopener noreferrer">View</a>
                <a href="${project.links.code}" class="btn" target="_blank" rel="noopener noreferrer">Code</a>
              </div>
            </div>
          </div>
        </div>
      `;

      container.appendChild(box);
    });

    // Initialize Isotope only after items are added
    if (typeof $ !== 'undefined' && typeof $.fn.isotope !== 'undefined') {
      const $grid = $('.box-container').isotope({
        itemSelector: '.grid-item',
        layoutMode: 'fitRows'
      });

      $('.button-group .btn').on('click', function () {
        $('.button-group .btn').removeClass('is-checked');
        $(this).addClass('is-checked');

        const filterValue = $(this).attr('data-filter');
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
    }

    if (typeof VanillaTilt !== 'undefined') {
      VanillaTilt.init(document.querySelectorAll('.box'), {
        max: 15,
        speed: 400
      });
    }
  })
  .catch((error) => {
    console.error('Failed to load projects:', error);
  });
