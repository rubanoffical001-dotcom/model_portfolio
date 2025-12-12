// Header Scroll Effect
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Fade In Animation on Scroll
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add animation classes to elements
function observeElements() {
    document.querySelectorAll('.glass-card, .section-title, .hero-text, .hero-image').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}
observeElements();

// Helper for the animation styles
const style = document.createElement('style');
style.textContent = `
    .fade-in-up {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);


// Form Submission Mock
const form = document.querySelector('form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        const originalText = btn.innerText;

        btn.innerText = 'Sending...';
        btn.style.opacity = '0.7';

        setTimeout(() => {
            btn.innerText = 'Message Sent!';
            btn.style.background = 'var(--neon-green, #00ff88)'; // Fallback or new var
            btn.style.color = '#000';

            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = '';
                btn.style.color = '';
                btn.style.opacity = '1';
                form.reset();
            }, 3000);
        }, 1500);
    });
}

/**
 * ==========================================
 * Project Data Management (CRUD)
 * ==========================================
 */

const defaultProjects = [
    {
        id: 1,
        title: "ERP Application",
        description: "Enterprise Resource Planning Tool",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        link: "#"
    },
    {
        id: 2,
        title: "Restaurant Billing Web App",
        description: "Billing & Inventory System",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        link: "#"
    },
    {
        id: 3,
        title: "Creative Poster Design",
        description: "Graphic Design Collection",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        link: "#"
    }
];

// Load projects from LocalStorage or use defaults
function getProjects() {
    const stored = localStorage.getItem('ruban_projects');
    if (!stored) {
        localStorage.setItem('ruban_projects', JSON.stringify(defaultProjects));
        return defaultProjects;
    }
    return JSON.parse(stored);
}

// Save projects to LocalStorage
function saveProjects(projects) {
    localStorage.setItem('ruban_projects', JSON.stringify(projects));
}

// Render projects to the Portfolio Section (for index.html)
function renderProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return; // Not on index page or container missing

    const projects = getProjects();
    container.innerHTML = '';

    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'glass-card project-card';
        card.innerHTML = `
            <div class="project-bg" style="background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url('${project.image}');"></div>
            <div class="project-overlay">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <a href="${project.link}" class="btn btn-primary" style="padding: 8px 20px; font-size: 0.8rem;">View Details</a>
            </div>
        `;
        container.appendChild(card);
    });

    // Re-run observer for new elements
    observeElements();
}

// Helper for Manage Page (manage.html)
function renderAdminProjects() {
    const container = document.getElementById('admin-projects-list');
    if (!container) return;

    const projects = getProjects();
    container.innerHTML = '';

    projects.forEach(project => {
        const item = document.createElement('div');
        item.className = 'glass-card';
        item.style.padding = '20px';
        item.style.marginBottom = '20px';
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';

        item.innerHTML = `
            <div style="display: flex; align-items: center; gap: 20px;">
                <img src="${project.image}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                <div>
                    <h4 style="margin-bottom: 5px;">${project.title}</h4>
                    <p style="font-size: 0.8rem; color: var(--text-secondary);">${project.description}</p>
                </div>
            </div>
            <button onclick="deleteProject(${project.id})" class="btn" style="background: rgba(255,0,0,0.2); color: #ff4d4d; border: 1px solid #ff4d4d;">Delete</button>
        `;
        container.appendChild(item);
    });
}

function addProject(title, description, image, link) {
    const projects = getProjects();
    const newProject = {
        id: Date.now(),
        title,
        description,
        image: image || "https://via.placeholder.com/800x600",
        link: link || "#"
    };
    projects.push(newProject);
    saveProjects(projects);
    renderAdminProjects();
    alert('Project Added!');
}

window.deleteProject = function (id) {
    if (!confirm('Are you sure?')) return;
    let projects = getProjects();
    projects = projects.filter(p => p.id !== id);
    saveProjects(projects);
    renderAdminProjects();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProjects();
    renderAdminProjects();

    // Handle Add Form
    const addForm = document.getElementById('add-project-form');
    if (addForm) {
        addForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('p-title').value;
            const desc = document.getElementById('p-desc').value;
            const img = document.getElementById('p-img').value;

            addProject(title, desc, img);
            addForm.reset();
        });
    }
});
