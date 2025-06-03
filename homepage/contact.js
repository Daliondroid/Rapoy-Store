// Simple scroll reveal animations
const revealElements = document.querySelectorAll(".reveal");

const revealOnScroll = () => {
  revealElements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (elementTop < windowHeight - 100) {
      element.classList.add("opacity-100", "translate-y-0");
      element.classList.remove("opacity-0", "translate-y-10");
    }
  });
};

// Initial check for elements in view
window.addEventListener("load", revealOnScroll);
window.addEventListener("scroll", revealOnScroll);

// Progress bar animation
window.addEventListener('scroll', () => {
  const winScroll = document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  document.querySelector('.progress-bar-fill').style.width = scrolled + '%';
});

// Fade-in animation on scroll
const fadeElements = document.querySelectorAll(".fade-in");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.1,
  }
);

fadeElements.forEach((element) => {
  observer.observe(element);
});

// Form handling with animation
const form = document.getElementById("contactForm");
if (form) {
  const submitBtn = form.querySelector('.submit-btn');
  const buttonText = submitBtn.querySelector('.button-text');
  const loadingSpinner = submitBtn.querySelector('.loading');
  const successMessage = document.querySelector('.success-message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Show loading state
    buttonText.style.display = 'none';
    loadingSpinner.style.display = 'inline-block';
    submitBtn.disabled = true;

    // Simulate form submission (replace with actual form submission)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Show success message
    successMessage.style.display = 'block';
    form.reset();

    // Reset button state
    buttonText.style.display = 'inline';
    loadingSpinner.style.display = 'none';
    submitBtn.disabled = false;

    // Hide success message after 5 seconds
    setTimeout(() => {
      successMessage.style.display = 'none';
    }, 5000);
  });
}

// Input focus animations
const inputs = document.querySelectorAll(".form-input");
inputs.forEach((input) => {
  input.addEventListener("focus", () => {
    input.classList.add("scale-105");
  });

  input.addEventListener("blur", () => {
    input.classList.remove("scale-105");
  });
});

// Simple hover effects
const contactItems = document.querySelectorAll(".contact-item");
contactItems.forEach((item) => {
  item.addEventListener("mouseenter", () => {
    item.classList.add("translate-x-2");
  });

  item.addEventListener("mouseleave", () => {
    item.classList.remove("translate-x-2");
  });
});

document.addEventListener('DOMContentLoaded', function() {
    // Custom cursor functionality
    const cursor = document.getElementById('custom-cursor');
    
    // Initialize cursor position
    cursor.style.display = 'block';
    
    // Prevent default cursor on all elements
    document.querySelectorAll('*').forEach(element => {
        element.style.cursor = 'none';
    });

    // Smooth cursor movement
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    function updateCursor() {
        // Smooth movement using lerp
        cursorX = lerp(cursorX, mouseX, 0.2);
        cursorY = lerp(cursorY, mouseY, 0.2);
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(updateCursor);
    }
    
    updateCursor();

    // Add active class to cursor when hovering over interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .contact-item, .submit-btn');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
        });
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
        });
    });

    // Smooth scroll with easing
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
          const startPosition = window.pageYOffset;
          const distance = targetPosition - startPosition;
          let startTime = null;

          function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, 1000);
            window.scrollTo(0, run);
            if (timeElapsed < 1000) requestAnimationFrame(animation);
          }

          function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
          }

          requestAnimationFrame(animation);
        }
      });
    });

    // Enhanced scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          if (entry.target.classList.contains('contact-item')) {
            entry.target.style.transitionDelay = `${entry.target.dataset.delay || 0}s`;
          }
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observe elements with enhanced animations
    document.querySelectorAll('.contact-hero, .contact-form, .contact-info, .map-section').forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
      observer.observe(element);
    });

    // Add delay to contact items
    document.querySelectorAll('.contact-item').forEach((item, index) => {
      item.dataset.delay = index * 0.1;
      observer.observe(item);
    });
});
