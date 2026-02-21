/**
 * Premium Estates - Professional JavaScript
 * Enhanced Interactivity & Functionality
 */

document.addEventListener('DOMContentLoaded', function() {
  
  // ========================================
  // CONFIGURATION
  // ========================================
  const CONFIG = {
    scrollThreshold: 50,
    animationDelay: 100,
    notificationDuration: 4000,
    debounceDelay: 300
  };
  
  // ========================================
  // NAVBAR SCROLL EFFECT
  // ========================================
  const navbar = document.getElementById('navbar');
  
  function handleScroll() {
    if (window.scrollY > CONFIG.scrollThreshold) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }
  
  if (navbar) {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state
  }
  
  // ========================================
  // MOBILE MENU TOGGLE
  // ========================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', function() {
      this.classList.toggle('active');
      navLinks.classList.toggle('mobile-active');
      
      // Animate hamburger
      const spans = this.querySelectorAll('span');
      if (this.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });
  }
  
  // ========================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ========================================
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      if (targetId !== '#' && targetId !== '' && targetId !== 'javascript:void(0)') {
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          e.preventDefault();
          const navbarHeight = navbar ? navbar.offsetHeight : 0;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Close mobile menu if open
          if (mobileMenuBtn) {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('mobile-active');
          }
        }
      }
    });
  });
  
  // ========================================
  // PROPERTY WISHLIST FUNCTIONALITY
  // ========================================
  const wishlistButtons = document.querySelectorAll('.property-wishlist');
  const wishlist = new Set(JSON.parse(localStorage.getItem('wishlist') || '[]'));
  
  function updateWishlistButtons() {
    wishlistButtons.forEach(function(btn) {
      const card = btn.closest('.property-card');
      const propertyTitle = card?.querySelector('.property-title')?.textContent || '';
      
      if (wishlist.has(propertyTitle)) {
        btn.textContent = '♥';
        btn.style.color = 'white';
        btn.style.background = '#ef4444';
      } else {
        btn.textContent = '♡';
        btn.style.color = '';
        btn.style.background = '';
      }
    });
  }
  
  wishlistButtons.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const card = this.closest('.property-card');
      const propertyTitle = card?.querySelector('.property-title')?.textContent || '';
      
      if (wishlist.has(propertyTitle)) {
        wishlist.delete(propertyTitle);
        this.textContent = '♡';
        this.style.color = '';
        this.style.background = '';
        showNotification('Removed from wishlist', 'info');
      } else {
        wishlist.add(propertyTitle);
        this.textContent = '♥';
        this.style.color = 'white';
        this.style.background = '#ef4444';
        showNotification('Added to wishlist!', 'success');
      }
      
      localStorage.setItem('wishlist', JSON.stringify([...wishlist]));
    });
  });
  
  updateWishlistButtons();
  
  // ========================================
  // PROPERTY CARD CLICK - NAVIGATE TO DETAIL
  // ========================================
  document.querySelectorAll('.property-card').forEach(function(card) {
    card.addEventListener('click', function() {
      const title = this.querySelector('.property-title')?.textContent || '';
      // In production, this would navigate to actual property detail
      // For demo, show notification
      console.log('Navigating to:', title);
    });
  });
  
  // ========================================
  // FILTER BUTTONS FUNCTIONALITY
  // ========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      const parent = this.parentElement;
      parent.querySelectorAll('.filter-btn').forEach(function(sibling) {
        sibling.classList.remove('active');
      });
      this.classList.add('active');
      
      // Filter properties (demo)
      const filterValue = this.textContent.toLowerCase();
      filterProperties(filterValue);
    });
  });
  
  function filterProperties(filter) {
    const cards = document.querySelectorAll('.properties-grid .property-card');
    
    cards.forEach(function(card) {
      const badge = card.querySelector('.property-badge');
      const badgeText = badge?.textContent.toLowerCase() || '';
      
      if (filter === 'all' || filter === 'all properties') {
        card.style.display = 'block';
      } else if (filter === 'for sale') {
        card.style.display = badgeText === 'for sale' ? 'block' : 'none';
      } else if (filter === 'for rent') {
        card.style.display = badgeText === 'for rent' ? 'block' : 'none';
      } else {
        card.style.display = 'block';
      }
    });
    
    showNotification(`Filtered: ${filter}`, 'info');
  }
  
  // ========================================
  // VIEW TOGGLE FUNCTIONALITY
  // ========================================
  const viewButtons = document.querySelectorAll('.view-btn');
  
  viewButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      viewButtons.forEach(function(b) {
        b.classList.remove('active');
      });
      this.classList.add('active');
      
      const propertiesGrid = document.querySelector('.properties-grid');
      if (propertiesGrid) {
        propertiesGrid.classList.toggle('list-view');
      }
    });
  });
  
  // ========================================
  // PAGINATION FUNCTIONALITY
  // ========================================
  const pageButtons = document.querySelectorAll('.page-btn');
  
  pageButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      const text = this.textContent.trim();
      
      if (text === '←') {
        showNotification('Previous page', 'info');
      } else if (text === '→') {
        showNotification('Next page', 'info');
      } else if (text !== '...') {
        pageButtons.forEach(function(b) {
          b.classList.remove('active');
        });
        this.classList.add('active');
        showNotification(`Page ${text}`, 'info');
      }
    });
  });
  
  // ========================================
  // CONTACT FORM SUBMISSION
  // ========================================
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);
      
      // Validation
      if (!data.firstName || !data.lastName || !data.email || !data.message) {
        showNotification('Please fill in all required fields.', 'error');
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
      }
      
      // Simulate submission
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      const originalDisabled = submitBtn.disabled;
      
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
      
      setTimeout(function() {
        showNotification('Message sent successfully! We\'ll contact you soon.', 'success');
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = originalDisabled;
        submitBtn.style.opacity = '1';
      }, 1500);
    });
  }
  
  // ========================================
  // TOUR REQUEST FORM
  // ========================================
  const tourForm = document.getElementById('tourForm');
  
  if (tourForm) {
    tourForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = 'Sending Request...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
      
      setTimeout(function() {
        showNotification('Tour request sent! Agent will contact you within 24 hours.', 'success');
        tourForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        
        // Close modal if in one
        const modal = submitBtn.closest('.modal-overlay');
        if (modal) {
          closeModal(modal);
        }
      }, 1500);
    });
  }
  
  // ========================================
  // SEARCH FUNCTIONALITY
  // ========================================
  const searchBtn = document.querySelector('.search-btn');
  
  if (searchBtn) {
    searchBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      const inputs = document.querySelectorAll('.search-field input, .search-field select');
      const searchParams = {};
      let hasValue = false;
      
      inputs.forEach(function(input) {
        const label = input.parentElement.querySelector('label')?.textContent.toLowerCase() || 'field';
        if (input.value) {
          searchParams[label] = input.value;
          hasValue = true;
        }
      });
      
      if (!hasValue) {
        showNotification('Please enter a location or select filters.', 'warning');
        return;
      }
      
      // Animate button
      const originalHTML = this.innerHTML;
      this.innerHTML = '<span class="spinner"></span> Searching...';
      this.disabled = true;
      
      setTimeout(function() {
        showNotification(`Found properties matching your criteria!`, 'success');
        searchBtn.innerHTML = originalHTML;
        searchBtn.disabled = false;
        
        // Redirect to listings (in production)
        // window.location.href = 'listings.html?' + new URLSearchParams(searchParams);
      }, 1200);
    });
    
    // Enter key search
    document.querySelectorAll('.search-field input').forEach(function(input) {
      input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          searchBtn.click();
        }
      });
    });
  }
  
  // ========================================
  // ANIMATE ON SCROLL
  // ========================================
  const animateElements = document.querySelectorAll('.property-card, .service-card, .stat-item, .testimonial-card, .about-feature');
  
  function animateOnScroll() {
    const triggerBottom = window.innerHeight * 0.85;
    
    animateElements.forEach(function(element) {
      const elementTop = element.getBoundingClientRect().top;
      
      if (elementTop < triggerBottom) {
        element.classList.add('animated');
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    });
  }
  
  // Initialize animation styles
  animateElements.forEach(function(element) {
    element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
  });
  
  window.addEventListener('scroll', animateOnScroll, { passive: true });
  animateOnScroll(); // Run once on load
  
  // ========================================
  // STATS COUNTER ANIMATION
  // ========================================
  const statNumbers = document.querySelectorAll('.stat-number');
  
  function animateStats() {
    statNumbers.forEach(function(stat) {
      const target = stat.textContent;
      const hasPlus = target.includes('+');
      const hasK = target.includes('K');
      
      let numericValue = parseInt(target.replace(/[^0-9]/g, ''));
      if (isNaN(numericValue)) return;
      
      let current = 0;
      const increment = numericValue / 50;
      const suffix = hasPlus ? '+' : hasK ? 'K+' : '';
      
      const updateCounter = function() {
        current += increment;
        if (current < numericValue) {
          stat.textContent = Math.floor(current) + suffix;
          setTimeout(updateCounter, 30);
        } else {
          stat.textContent = target;
        }
      };
      
      // Use Intersection Observer
      const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            updateCounter();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(stat);
    });
  }
  
  animateStats();
  
  // ========================================
  // MODAL FUNCTIONALITY
  // ========================================
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }
  
  function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  // Close modal on overlay click
  document.querySelectorAll('.modal-overlay').forEach(function(overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) {
        closeModal(overlay);
      }
    });
  });
  
  // Close modal on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(function(modal) {
        closeModal(modal);
      });
    }
  });
  
  // ========================================
  // IMAGE GALLERY THUMBNAIL CLICK
  // ========================================
  const thumbImages = document.querySelectorAll('.thumb-image');
  const mainImage = document.querySelector('.main-image img');
  
  thumbImages.forEach(function(thumb) {
    thumb.addEventListener('click', function() {
      const thumbImg = this.querySelector('img');
      if (thumbImg && mainImage) {
        // In production, swap the main image source
        mainImage.style.opacity = '0';
        setTimeout(function() {
          mainImage.src = thumbImg.src;
          mainImage.style.opacity = '1';
        }, 300);
      }
    });
  });
  
  // ========================================
  // NOTIFICATION SYSTEM
  // ========================================
  function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
      <span>${getNotificationIcon(type)} ${message}</span>
    `;
    
    const colors = {
      success: { bg: '#10b981', icon: '✓' },
      error: { bg: '#ef4444', icon: '✕' },
      warning: { bg: '#f59e0b', icon: '⚠' },
      info: { bg: '#0f172a', icon: 'ℹ' }
    };
    
    const color = colors[type] || colors.info;
    
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${color.bg};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      z-index: 9999;
      font-weight: 500;
      animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      max-width: 400px;
      display: flex;
      align-items: center;
      gap: 10px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(function() {
      notification.style.animation = 'slideOutRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      setTimeout(function() {
        notification.remove();
      }, 400);
    }, CONFIG.notificationDuration);
  }
  
  function getNotificationIcon(type) {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[type] || icons.info;
  }
  
  // Add notification animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
  
  // ========================================
  // SIGN IN BUTTON
  // ========================================
  document.querySelectorAll('.btn-ghost').forEach(function(btn) {
    if (btn.textContent.includes('Sign In') || btn.textContent.includes('Sign Up')) {
      btn.addEventListener('click', function() {
        showNotification('Sign in feature coming soon!', 'info');
      });
    }
  });
  
  // ========================================
  // GET STARTED BUTTON
  // ========================================
  document.querySelectorAll('.btn-primary').forEach(function(btn) {
    if (btn.textContent.includes('Get Started')) {
      btn.addEventListener('click', function(e) {
        // Scroll to contact section
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          e.preventDefault();
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  });
  
  // ========================================
  // AGENT CONTACT BUTTONS
  // ========================================
  document.querySelectorAll('.contact-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const icon = this.textContent;
      if (icon === '📞') {
        showNotification('Calling agent...', 'info');
        setTimeout(function() {
          showNotification('Call connected!', 'success');
        }, 1000);
      } else if (icon === '✉️') {
        showNotification('Opening email...', 'info');
      } else if (icon === '💬') {
        showNotification('Starting chat...', 'info');
      }
    });
  });
  
  // ========================================
  // SERVICE CARDS CLICK
  // ========================================
  document.querySelectorAll('.service-card').forEach(function(card) {
    card.addEventListener('click', function() {
      const link = this.querySelector('.service-link');
      if (link && link.getAttribute('href')) {
        // Navigate or show info
        const service = this.querySelector('h3')?.textContent || 'Service';
        showNotification(`Learn more about ${service}`, 'info');
      }
    });
  });
  
  // ========================================
  // SOCIAL LINKS
  // ========================================
  document.querySelectorAll('.social-link').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      showNotification('Social media links coming soon!', 'info');
    });
  });
  
  // ========================================
  // FOOTER LINKS
  // ========================================
  document.querySelectorAll('.footer-links a').forEach(function(link) {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === 'javascript:void(0)') {
        e.preventDefault();
        showNotification('Page coming soon!', 'info');
      }
    });
  });
  
  // ========================================
  // PROPERTY DETAIL - REQUEST TOUR BUTTON
  // ========================================
  const requestTourBtn = document.querySelector('.schedule-form button[type="submit"]');
  if (requestTourBtn && !tourForm) {
    requestTourBtn.addEventListener('click', function(e) {
      e.preventDefault();
      showNotification('Tour request sent! Agent will contact you soon.', 'success');
    });
  }
  
  // ========================================
  // CONSOLE WELCOME
  // ========================================
  console.log('%c🏠 Premium Estates', 'font-size: 28px; font-weight: bold; color: #d4af37;');
  console.log('%cProfessional Real Estate UI', 'font-size: 14px; color: #64748b;');
  console.log('%cBuilt with HTML, CSS & JavaScript', 'font-size: 12px; color: #94a3b8;');
  
});

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Format number with commas
function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num);
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { formatCurrency, formatNumber, debounce, throttle };
}
