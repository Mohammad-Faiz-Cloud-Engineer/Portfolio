document.addEventListener('DOMContentLoaded', () => {
    /* =========================================================================
       1. Set Current Year
       ========================================================================= */
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    /* =========================================================================
       2. Sticky Navbar Effect (Optimized)
       ========================================================================= */
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        let isScrolled = false;
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY > 50 && !isScrolled) {
                navbar.classList.add('scrolled');
                isScrolled = true;
            } else if (scrollY <= 50 && isScrolled) {
                navbar.classList.remove('scrolled');
                isScrolled = false;
            }
        }, { passive: true });
    }

    /* =========================================================================
       3. Intersection Observer for Scroll Animations
       ========================================================================= */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    // Fixed: 'observer' parameter shadowing avoided
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    /* =========================================================================
       4. Premium Interactions & Animations Engine
       ========================================================================= */
    
    // A. Custom Cursor Glow Effect
    const cursorGlow = document.querySelector('.cursor-glow');
    if (cursorGlow && window.matchMedia("(pointer: fine)").matches) {
        let currentX = 0;
        let currentY = 0;
        let isTicking = false;

        window.addEventListener('mousemove', (e) => {
            currentX = e.clientX;
            currentY = e.clientY;
            if (!isTicking) {
                window.requestAnimationFrame(() => {
                    cursorGlow.style.transform = `translate(calc(${currentX}px - 50%), calc(${currentY}px - 50%))`;
                    isTicking = false;
                });
                isTicking = true;
            }
        }, { passive: true });

        // Expand glow on clickable elements
        const clickables = document.querySelectorAll('a, button, .project-card, .repo-card');
        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => {   
                cursorGlow.style.width = '600px';
                cursorGlow.style.height = '600px';
                cursorGlow.style.background = 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, rgba(0,0,0,0) 70%)';
            });
            el.addEventListener('mouseleave', () => {
                cursorGlow.style.width = '400px';
                cursorGlow.style.height = '400px';
                cursorGlow.style.background = 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 70%)';
            });
        });
    } else if (cursorGlow) {
        cursorGlow.style.display = 'none'; // Hide on mobile/touch
    }

    // B. Parallax Background Glows
    function initParallaxGlows() {
        const glows = document.querySelectorAll('.bg-glow');
        if(!glows.length || !window.matchMedia("(pointer: fine)").matches) return;
        
        let ticking = false;
        window.addEventListener('mousemove', e => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const x = (e.clientX / window.innerWidth - 0.5) * 60; 
                    const y = (e.clientY / window.innerHeight - 0.5) * 60;
                    
                    if(glows[0]) glows[0].style.transform = `translate(${x * 1.5}px, ${y * 1.5}px)`;
                    if(glows[1]) glows[1].style.transform = `translate(${x * -1.2}px, ${y * -1.2}px)`;
                    if(glows[2]) glows[2].style.transform = `translate(${x * 0.8}px, ${y * 0.8}px)`;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
    
    // C. 3D Tilt Cards effect
    function initTiltCards(mutatingSelector = false) {
        // Find existing cards or ones freshly loaded from API
        const cards = document.querySelectorAll('.project-card, .glass-card, .repo-card, .code-window, .cta-box');
        
        cards.forEach(card => {
            // Avoid re-binding listener if already attached via class
            if(card.classList.contains('tilt-card')) return;
            card.classList.add('tilt-card');
            
            if (window.matchMedia("(pointer: fine)").matches) {
                card.addEventListener('mousemove', e => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const rotateX = ((y - centerY) / centerY) * -4; // Max 4 deg tilt
                    const rotateY = ((x - centerX) / centerX) * 4;
                    
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                    setTimeout(() => {
                        card.style.transition = '';
                    }, 500);
                });
            }
        });
    }

    // D. Magnetic Buttons
    function initMagneticButtons() {
        const buttons = document.querySelectorAll('.btn, .social-links a, .logo');
        if (!window.matchMedia("(pointer: fine)").matches) return;
        
        buttons.forEach(btn => {
            // Apply magnetic physics wrappers
            btn.classList.add('magnetic');
            
            btn.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) * 0.35; // Magnet pull factor
                const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
                
                this.style.transform = `translate(${x}px, ${y}px)`;
            });
            
            btn.addEventListener('mouseleave', function() {
                this.style.transform = `translate(0px, 0px)`;
            });
        });
    }

    // Attach float animations visually to icons
    document.querySelectorAll('.card-icon, .badge').forEach(icon => icon.classList.add('float-anim'));
    
    // Boot up generic interactions
    initParallaxGlows();
    initTiltCards();
    initMagneticButtons();

    /* =========================================================================
       5. GitHub Data Fetching (XSS Protected)
       ========================================================================= */
    const GITHUB_USERNAME = 'Mohammad-Faiz-Cloud-Engineer';
    
    function escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    async function fetchGitHubData() {
        const statsContainer = document.getElementById('github-user-stats');
        const reposContainer = document.getElementById('github-repos-container');
        
        if (!statsContainer || !reposContainer) return;
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
            
            // Phase 1: Stats
            const userResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
                signal: controller.signal
            });
            if (!userResponse.ok) throw new Error(`GitHub user API returned status: ${userResponse.status}`);
            const userData = await userResponse.json();
            
            const followers = Number(userData.followers) || 0;
            const public_repos = Number(userData.public_repos) || 0;
            
            statsContainer.innerHTML = `
                <div class="stats-badge">
                    <i class="ph ph-users text-primary"></i>
                    <span><strong>${escapeHTML(followers)}</strong> Followers</span>
                </div>
                <div class="stats-badge ml-2" style="margin-left:0.5rem">
                    <i class="ph ph-git-branch text-primary"></i>
                    <span><strong>${escapeHTML(public_repos)}</strong> Repositories</span>
                </div>
            `;
            
            // Phase 2: Repos
            const reposResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=10`, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            
            if (!reposResponse.ok) throw new Error(`GitHub repos API returned status: ${reposResponse.status}`);
            let reposData = await reposResponse.json();
            
            if (Array.isArray(reposData)) {
                reposData = reposData.filter(repo => !repo.fork).slice(0, 6);
                renderRepos(reposData, reposContainer);
                
                // IMPORTANT: Re-run Tilt Card init for newly generated DOM cards
                initTiltCards();
                // Ensure intersection observer triggers on new cards
                document.querySelectorAll('#github-repos-container .reveal').forEach(el => observer.observe(el));
            } else {
                throw new Error('Invalid repository data format');
            }
            
        } catch (error) {
            console.error('GitHub API Synchronization Failed:', error.message);
            statsContainer.innerHTML = `<span class="text-secondary">Stats momentarily unavailable</span>`;
            reposContainer.innerHTML = `
                <div class="text-center" style="grid-column: 1 / -1; padding: 2rem; color: var(--text-tertiary);">
                    <i class="ph ph-warning-circle" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                    <p>Unable to synchronize open-source metrics. Please check connection.</p>
                </div>
            `;
        }
    }
    
    function getLanguageColor(lang) {
        const colors = {
            'JavaScript': '#f1e05a',
            'TypeScript': '#3178c6',
            'Python': '#3572A5',
            'HTML': '#e34c26',
            'CSS': '#563d7c',
            'HCL': '#844FBA', 
            'Shell': '#89e051',
            'Go': '#00ADD8',
            'Java': '#b07219',
            'C++': '#f34b7d'
        };
        return colors[lang] || '#8b949e';
    }

    function renderRepos(repos, container) {
        container.innerHTML = ''; 
        
        repos.forEach((repo, index) => {
            const delay = index * 0.1;
            const langColor = getLanguageColor(repo.language);
            
            const safeUrl = escapeHTML(repo.html_url);
            const safeName = escapeHTML(repo.name);
            const safeDesc = escapeHTML(repo.description || 'No description provided.');
            const safeLang = escapeHTML(repo.language);
            const stars = Number(repo.stargazers_count) || 0;
            const forks = Number(repo.forks_count) || 0;
            
            const card = document.createElement('div');
            card.className = 'repo-card reveal';
            card.style.animationDelay = `${delay}s`;
            
            card.innerHTML = `
                <div class="repo-header">
                    <div class="repo-title">
                        <i class="ph ph-book-bookmark text-primary"></i>
                        <a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${safeName}</a>
                    </div>
                    <a href="${safeUrl}" target="_blank" rel="noopener noreferrer" style="color: var(--text-tertiary)">
                        <i class="ph ph-arrow-up-right"></i>
                    </a>
                </div>
                <div class="repo-desc">
                    ${safeDesc}
                </div>
                <div class="repo-footer">
                    ${safeLang ? `
                        <div class="repo-stat">
                            <span class="lang-dot" style="background-color: ${escapeHTML(langColor)}"></span>
                            ${safeLang}
                        </div>
                    ` : ''}
                    <div class="repo-stat" title="Stars">
                        <i class="ph ph-star"></i>
                        ${stars}
                    </div>
                    <div class="repo-stat" title="Forks">
                        <i class="ph ph-git-fork"></i>
                        ${forks}
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    fetchGitHubData();
});
