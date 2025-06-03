// Progress bar animation
window.addEventListener('scroll', () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  document.getElementById('progress-bar').style.width = scrolled + '%';
});

// Fade-in animation on scroll
const fadeElements = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.1
});

fadeElements.forEach(element => {
  observer.observe(element);
});

// FAQ Category Switching
const categoryButtons = document.querySelectorAll('.faq-category-btn');
const categories = document.querySelectorAll('.faq-category');

categoryButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    // Update button styles
    categoryButtons.forEach(btn => {
      btn.classList.remove('active', 'bg-black', 'text-white');
      btn.classList.add('bg-gray-100', 'text-gray-800');
    });
    button.classList.add('active', 'bg-black', 'text-white');
    button.classList.remove('bg-gray-100', 'text-gray-800');

    // Show selected category
    categories.forEach(category => {
      category.classList.add('hidden');
    });
    categories[index].classList.remove('hidden');
  });
});

// FAQ Item Toggle
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');

  question.addEventListener('click', () => {
    // Toggle active state
    question.classList.toggle('active');
    answer.classList.toggle('active');
    
    // Close other answers
    faqItems.forEach(otherItem => {
      if (otherItem !== item) {
        const otherQuestion = otherItem.querySelector('.faq-question');
        const otherAnswer = otherItem.querySelector('.faq-answer');
        otherQuestion.classList.remove('active');
        otherAnswer.classList.remove('active');
      }
    });
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
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .faq-question');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
        });
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
        });
    });

    // Elements
    const searchInput = document.getElementById('faqSearch');
    const faqItems = document.querySelectorAll('.faq-item');
    const categoryButtons = document.querySelectorAll('.faq-category-btn');
    const faqCategories = document.querySelectorAll('.faq-category');

    // Search functionality
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      
      faqItems.forEach(item => {
        const question = item.querySelector('.faq-question h3').textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
        
        if (question.includes(searchTerm) || answer.includes(searchTerm)) {
          item.style.display = 'block';
          // Add highlight effect
          item.classList.add('search-highlight');
          setTimeout(() => item.classList.remove('search-highlight'), 1000);
        } else {
          item.style.display = 'none';
        }
      });
    });

    // Category filtering
    categoryButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        // Update active button
        categoryButtons.forEach(btn => {
          btn.classList.remove('active');
          btn.classList.remove('bg-black', 'text-white');
          btn.classList.add('bg-gray-100', 'text-gray-800');
        });
        button.classList.add('active');
        button.classList.remove('bg-gray-100', 'text-gray-800');
        button.classList.add('bg-black', 'text-white');

        // Show selected category
        faqCategories.forEach((category, catIndex) => {
          if (catIndex === index) {
            category.classList.add('active');
            category.style.display = 'block';
            // Add fade-in animation
            category.style.opacity = '0';
            setTimeout(() => {
              category.style.opacity = '1';
            }, 50);
          } else {
            category.classList.remove('active');
            category.style.display = 'none';
          }
        });
      });
    });

    // FAQ accordion functionality
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      const icon = question.querySelector('.fa-chevron-down');

      question.addEventListener('click', () => {
        // Toggle current item
        const isOpen = item.classList.contains('active');
        
        // Close all items
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-answer').style.maxHeight = null;
          otherItem.querySelector('.fa-chevron-down').style.transform = 'rotate(0deg)';
        });

        // Open clicked item if it was closed
        if (!isOpen) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          icon.style.transform = 'rotate(180deg)';
        }
      });
    });

    // Add loading animation to search
    let searchTimeout;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchInput.classList.add('searching');
      
      searchTimeout = setTimeout(() => {
        searchInput.classList.remove('searching');
      }, 500);
    });
}); 