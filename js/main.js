/**
 * Sanghvi Sales Corporation & Mehta Enterprise - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    initProductFiltering();
    initBackToTop();
    initNavbarScroll();
});

// Product Category Filtering
function initProductFiltering() {
    const filterButtons = document.querySelectorAll('.btn-filter');
    const productItems = document.querySelectorAll('.product-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            productItems.forEach(item => {
                const categoryAttr = item.getAttribute('data-category') || '';
                const categories = categoryAttr.split(' ');
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 250);
                }
            });
        });
    });
}

// Function to trigger category from footer
function filterCategory(category) {
    const filterBtn = document.querySelector(`.btn-filter[data-filter="${category}"]`);
    if (filterBtn) {
        filterBtn.click();
    }
}

// Select product and scroll to quote form
function selectProduct(productName) {
    const selectElem = document.getElementById('productSelect');
    if (selectElem) {
        // Find or match option
        for (let i = 0; i < selectElem.options.length; i++) {
            if (selectElem.options[i].value.toLowerCase().includes(productName.toLowerCase()) || 
                productName.toLowerCase().includes(selectElem.options[i].value.toLowerCase())) {
                selectElem.selectedIndex = i;
                break;
            }
        }
    }
    
    // Scroll to contact form
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Product Quick View Modal Trigger with Full-Resolution Image Support
function openProductModal(title, imageSrc, brand, description, fullImgSrc) {
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    const fullImageTarget = fullImgSrc || imageSrc;
    
    document.getElementById('modalProductName').textContent = title;
    const modalImg = document.getElementById('modalProductImg');
    modalImg.src = imageSrc;
    modalImg.alt = `${title} - Sanghvi Sales Corporation & Mehta Enterprise Surat`;
    
    // Full image link in modal
    const fullImgLink = document.getElementById('modalFullImgLink');
    if (fullImgLink) {
        fullImgLink.href = fullImageTarget;
    }
    
    document.getElementById('modalProductBrand').textContent = brand;
    document.getElementById('modalProductDesc').textContent = description;

    // Set WhatsApp link
    const waText = encodeURIComponent(`Hello Sanghvi Sales Corporation & Mehta Enterprise, I am interested in inquiring about ${title} (${brand}). Please provide price & technical specifications.`);
    document.getElementById('modalWhatsAppBtn').href = `https://wa.me/919825760022?text=${waText}`;

    // Set quote button in modal
    const enquireBtn = document.getElementById('modalEnquireBtn');
    enquireBtn.onclick = () => {
        selectProduct(title);
    };

    modal.show();
}

// Form Submission via Web / State feedback
function handleFormSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('clientName').value.trim();
    const company = document.getElementById('companyName').value.trim();
    const phone = document.getElementById('clientPhone').value.trim();
    const product = document.getElementById('productSelect').value;
    const details = document.getElementById('requirementDetails').value.trim();

    const feedback = document.getElementById('formFeedback');
    feedback.innerHTML = `
        <div class="alert alert-success d-flex align-items-center gap-2 p-3 rounded-3 shadow-sm">
            <i class="fa-solid fa-circle-check fs-4"></i>
            <div>
                <strong>Thank you, ${name}!</strong> Your quotation request for <strong>${product}</strong> has been received. Our sales engineer will contact you at <strong>${phone}</strong> shortly.
            </div>
        </div>
    `;

    // Also offer direct WhatsApp redirect
    setTimeout(() => {
        const confirmWa = confirm('Inquiry submitted! Would you also like to send this request directly on WhatsApp for instant 5-minute pricing?');
        if (confirmWa) {
            sendViaWhatsApp();
        }
    }, 800);

    document.getElementById('quickQuoteForm').reset();
}

// Construct and redirect to WhatsApp inquiry
function sendViaWhatsApp() {
    const name = document.getElementById('clientName').value.trim() || 'Valued Customer';
    const company = document.getElementById('companyName').value.trim() || 'N/A';
    const phone = document.getElementById('clientPhone').value.trim() || 'N/A';
    const product = document.getElementById('productSelect').value || 'Industrial Products & Piping';
    const details = document.getElementById('requirementDetails').value.trim() || 'Please share product catalog and bulk price list.';

    const message = `*INQUIRY - SANGHVI SALES CORPORATION & MEHTA ENTERPRISE*\n` +
                    `----------------------------------\n` +
                    `*Name:* ${name}\n` +
                    `*Company:* ${company}\n` +
                    `*Contact Number:* ${phone}\n` +
                    `*Product Needed:* ${product}\n` +
                    `*Requirement/Specs:* ${details}\n` +
                    `----------------------------------\n` +
                    `_Sent via Website Fast Quote Portal_`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/919825760022?text=${encoded}`, '_blank');
}

// Back to Top & Navbar Scroll behavior
function initBackToTop() {
    const topBtn = document.getElementById('backToTopBtn');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 350) {
            topBtn.classList.add('show');
        } else {
            topBtn.classList.remove('show');
        }
    });

    topBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function initNavbarScroll() {
    const navbar = document.getElementById('mainNavbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow');
        } else {
            navbar.classList.remove('shadow');
        }
    });

    // Auto-close mobile navbar on link click
    const navLinks = document.querySelectorAll('#navContent .nav-link, #navContent .btn');
    const navCollapse = document.getElementById('navContent');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navCollapse && navCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navCollapse) || new bootstrap.Collapse(navCollapse, { toggle: false });
                bsCollapse.hide();
            }
        });
    });
}

// 1-Click Copy Email Function for Header Popover
function copyHeaderEmail(btnElement) {
    const email = 'sanghvimehta@yahoo.com';
    const originalText = btnElement.innerHTML;
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(() => {
            btnElement.innerHTML = '<i class="fa-solid fa-check text-success me-1"></i> Copied!';
            setTimeout(() => {
                btnElement.innerHTML = originalText;
            }, 2200);
        }).catch(() => {
            fallbackCopyText(email, btnElement, originalText);
        });
    } else {
        fallbackCopyText(email, btnElement, originalText);
    }
}

function fallbackCopyText(text, btnElement, originalText) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
        document.execCommand('copy');
        btnElement.innerHTML = '<i class="fa-solid fa-check text-success me-1"></i> Copied!';
    } catch (err) {
        btnElement.innerHTML = 'sanghvimehta@yahoo.com';
    }
    document.body.removeChild(textarea);
    setTimeout(() => {
        btnElement.innerHTML = originalText;
    }, 2200);
}
