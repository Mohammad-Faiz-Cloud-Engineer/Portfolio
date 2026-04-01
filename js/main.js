/* ========================================================================
   MOHAMMAD FAIZ — PORTFOLIO
   Main JavaScript — Animations, GitHub API, Interactions
   ======================================================================== */

(function () {
    'use strict';

    // ── Constants ───────────────────────────────────────────────────────
    const GITHUB_USERNAME = 'Mohammad-Faiz-Cloud-Engineer';
    const GITHUB_API = 'https://api.github.com';

    // ── DOM Cache ───────────────────────────────────────────────────────
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

    const dom = {
        nav: $('#mainNav'),
        navHamburger: $('#navHamburger'),
        navLinks: $$('.nav-link'),
        mobileOverlay: $('#mobileOverlay'),
        mobileLinks: $$('.mobile-link'),
        cursorGlow: $('#cursorGlow'),
        heroStats: {
            repos: $('#statRepos'),
            followers: $('#statFollowers'),
            stars: $('#statStars'),
        },
        github: {
            avatar: $('#ghAvatar'),
            name: $('#ghName'),
            bio: $('#ghBio'),
            repos: $('#ghRepos'),
            followers: $('#ghFollowers'),
            following: $('#ghFollowing'),
            reposContainer: $('#githubRepos'),
        },
    };

    // ── Utilities ───────────────────────────────────────────────────────
    function debounce(fn, ms) {
        let t;
        return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
    }

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    function escapeHTML(str) {
        if (!str) return '';
        return String(str).replace(/[&<>'"]/g, match => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        })[match]);
    }

    // ── Cursor Glow (desktop only) ──────────────────────────────────────
    function initCursorGlow() {
        if (window.matchMedia('(max-width: 768px)').matches) return;
        if (!dom.cursorGlow) return;

        let mx = window.innerWidth / 2;
        let my = window.innerHeight / 2;
        let cx = mx, cy = my;

        document.addEventListener('mousemove', (e) => {
            mx = e.clientX;
            my = e.clientY;
        }, { passive: true });

        function animate() {
            cx = lerp(cx, mx, 0.08);
            cy = lerp(cy, my, 0.08);
            dom.cursorGlow.style.left = cx + 'px';
            dom.cursorGlow.style.top = cy + 'px';
            requestAnimationFrame(animate);
        }
        animate();
    }

    // ── Navigation ──────────────────────────────────────────────────────
    function initNav() {
        // Scroll state
        let lastScroll = 0;

        function onScroll() {
            const scrollY = window.scrollY;
            dom.nav.classList.toggle('scrolled', scrollY > 40);
            lastScroll = scrollY;
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        // Active section tracking
        const sections = $$('section[id]');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id;
                        dom.navLinks.forEach((link) => {
                            link.classList.toggle('active', link.dataset.section === id);
                        });
                    }
                });
            },
            { rootMargin: '-40% 0px -60% 0px' }
        );
        sections.forEach((s) => observer.observe(s));

        // Mobile menu
        if (dom.navHamburger) {
            dom.navHamburger.addEventListener('click', toggleMobileMenu);
        }
        dom.mobileLinks.forEach((link) => {
            link.addEventListener('click', () => closeMobileMenu());
        });
    }

    function toggleMobileMenu() {
        const active = dom.navHamburger.classList.toggle('active');
        dom.mobileOverlay.classList.toggle('active', active);
        document.body.style.overflow = active ? 'hidden' : '';
    }

    function closeMobileMenu() {
        dom.navHamburger.classList.remove('active');
        dom.mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ── Reveal Animations ───────────────────────────────────────────────
    function initReveal() {
        const elements = $$('.reveal-up, .reveal-scale');

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -60px 0px',
            }
        );

        elements.forEach((el) => observer.observe(el));
    }

    // ── Animated Counter ────────────────────────────────────────────────
    function animateCounter(element, target, duration = 1200) {
        if (!element) return;
        const start = performance.now();
        const startVal = 0;

        function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quart
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = Math.round(startVal + (target - startVal) * eased);
            element.textContent = current;
            if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    }

    // ── GitHub API ──────────────────────────────────────────────────────
    async function fetchGitHubData() {
        try {
            const [userRes, reposRes] = await Promise.all([
                fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}`),
                fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`),
            ]);

            if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API rate limited');

            const user = await userRes.json();
            const repos = await reposRes.json();

            updateProfile(user);
            updateRepos(repos);
            updateStats(user, repos);
        } catch (err) {
            console.warn('GitHub API fetch failed, using fallback data:', err.message);
            useFallbackData();
        }
    }

    function updateProfile(user) {
        if (dom.github.avatar) dom.github.avatar.src = user.avatar_url;
        if (dom.github.name) dom.github.name.textContent = user.name || user.login;
        if (dom.github.bio) dom.github.bio.textContent = user.bio || '';
        if (dom.github.repos) dom.github.repos.textContent = user.public_repos;
        if (dom.github.followers) dom.github.followers.textContent = user.followers;
        if (dom.github.following) dom.github.following.textContent = user.following;
    }

    function updateStats(user, repos) {
        const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
        animateCounter(dom.heroStats.repos, user.public_repos);
        animateCounter(dom.heroStats.followers, user.followers);
        animateCounter(dom.heroStats.stars, totalStars);
    }

    function useFallbackData() {
        // Fallback from known data
        animateCounter(dom.heroStats.repos, 26);
        animateCounter(dom.heroStats.followers, 23);
        animateCounter(dom.heroStats.stars, 0);

        // Show fallback repos message
        if (dom.github.reposContainer) {
            dom.github.reposContainer.innerHTML = `
                <div class="repos-loading glass-panel" style="padding: 2rem; text-align: center;">
                    <p style="color: var(--text-tertiary); font-size: 0.85rem;">
                        GitHub API rate limit reached. 
                        <a href="https://github.com/${escapeHTML(GITHUB_USERNAME)}?tab=repositories" 
                           target="_blank" rel="noopener noreferrer"
                           style="color: var(--accent-secondary); text-decoration: underline;">
                            View repositories on GitHub →
                        </a>
                    </p>
                </div>
            `;
        }
    }

    function updateRepos(repos) {
        if (!dom.github.reposContainer) return;

        // Filter and sort — show top repos
        const featured = repos
            .filter((r) => !r.fork)
            .sort((a, b) => {
                const scoreA = (a.stargazers_count * 2) + a.forks_count + (a.description ? 1 : 0);
                const scoreB = (b.stargazers_count * 2) + b.forks_count + (b.description ? 1 : 0);
                return scoreB - scoreA;
            })
            .slice(0, 6);

        const langColors = {
            JavaScript: '#f1e05a',
            TypeScript: '#3178c6',
            Python: '#3572A5',
            Shell: '#89e051',
            HCL: '#844FBA',
            Dockerfile: '#384d54',
            HTML: '#e34c26',
            CSS: '#563d7c',
            Go: '#00ADD8',
            Rust: '#dea584',
            Java: '#b07219',
            'C++': '#f34b7d',
            Ruby: '#701516',
            PHP: '#4F5D95',
            Vue: '#41b883',
            Svelte: '#ff3e00',
            Kotlin: '#A97BFF',
            Swift: '#F05138',
            Dart: '#00B4AB',
        };

        dom.github.reposContainer.innerHTML = featured
            .map((repo) => {
                const safeName = escapeHTML(repo.name);
                const safeDesc = escapeHTML(repo.description || 'No description available');
                const safeLang = escapeHTML(repo.language);
                const langDot = repo.language
                    ? `<span class="repo-lang"><span class="lang-dot" style="background:${langColors[repo.language] || '#8888aa'}"></span>${safeLang}</span>`
                    : '';
                const stars = repo.stargazers_count > 0
                    ? `<span class="repo-stars"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 19.771l-7.416 3.642 1.48-8.279L0 9.306l8.332-1.151z"/></svg>${escapeHTML(repo.stargazers_count)}</span>`
                    : '';
                const forks = repo.forks_count > 0
                    ? `<span class="repo-forks"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3v6m0 0a3 3 0 106 0M6 9a3 3 0 006 0m0 0V3m-3 12a3 3 0 100 6 3 3 0 000-6zm0 0V9"/></svg>${escapeHTML(repo.forks_count)}</span>`
                    : '';

                return `
                    <a href="${escapeHTML(repo.html_url)}" target="_blank" rel="noopener noreferrer" class="repo-card glass-panel reveal-up">
                        <div class="repo-card-header">
                            <span class="repo-name">${safeName}</span>
                            <span class="repo-visibility">${repo.private ? 'Private' : 'Public'}</span>
                        </div>
                        <p class="repo-desc">${safeDesc}</p>
                        <div class="repo-meta">
                            ${langDot}
                            ${stars}
                            ${forks}
                        </div>
                    </a>
                `;
            })
            .join('');

        // Re-observe newly added reveal elements
        initRevealForNew();
    }

    function initRevealForNew() {
        const newElements = $$('.repo-card.reveal-up:not(.revealed)');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );
        newElements.forEach((el, i) => {
            el.style.transitionDelay = `${i * 0.06}s`;
            observer.observe(el);
        });
    }

    // ── Smooth Scroll ───────────────────────────────────────────────────
    function initSmoothScroll() {
        $$('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', (e) => {
                const id = anchor.getAttribute('href');
                if (id === '#') return;
                const target = $(id);
                if (target) {
                    e.preventDefault();
                    const top = target.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            });
        });
    }

    // ── Glass Panel Tilt Effect ─────────────────────────────────────────
    function initGlassTilt() {
        if (window.matchMedia('(max-width: 768px)').matches) return;

        const panels = $$('.project-card, .skill-category, .contact-card');

        panels.forEach((panel) => {
            panel.addEventListener('mousemove', (e) => {
                const rect = panel.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;

                const rotateX = (y - 0.5) * -6;
                const rotateY = (x - 0.5) * 6;

                panel.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });

            panel.addEventListener('mouseleave', () => {
                panel.style.transform = '';
            });
        });
    }

    // ── Typing Effect for Terminal ──────────────────────────────────────
    function initTerminalEffect() {
        const terminal = $('.terminal-body code');
        if (!terminal) return;

        // Add blinking cursor
        const cursor = document.createElement('span');
        cursor.className = 'terminal-cursor';
        cursor.textContent = '▌';
        cursor.style.cssText = `
            color: var(--accent-secondary);
            animation: blink 1s step-end infinite;
            font-weight: 300;
        `;
        terminal.appendChild(cursor);

        // Add blink keyframe
        if (!$('#blinkStyle')) {
            const style = document.createElement('style');
            style.id = 'blinkStyle';
            style.textContent = `
                @keyframes blink {
                    50% { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // ── Glass Refraction on Scroll ──────────────────────────────────────
    function initScrollRefraction() {
        if (window.matchMedia('(max-width: 768px)').matches) return;

        const panels = $$('.glass-panel');

        // Use rAF for scroll events instead of debounce which skips frames
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    panels.forEach((panel) => {
                        const rect = panel.getBoundingClientRect();
                        if (rect.top < window.innerHeight && rect.bottom > 0) {
                            const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                            const offset = progress * 30 - 15;
                            panel.style.setProperty('--refraction-offset', `${offset}%`);
                        }
                    });
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ── Parallax Orbs ───────────────────────────────────────────────────
    function initParallaxOrbs() {
        if (window.matchMedia('(max-width: 768px)').matches) return;

        const orbs = $$('.orb');

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            orbs.forEach((orb, i) => {
                const speed = 0.02 + (i * 0.01);
                orb.style.transform = `translateY(${scrollY * speed}px)`;
            });
        }, { passive: true });
    }

    // ── Initialize ──────────────────────────────────────────────────────
    function init() {
        initCursorGlow();
        initNav();
        initReveal();
        initSmoothScroll();
        initGlassTilt();
        initTerminalEffect();
        initParallaxOrbs();
        fetchGitHubData();
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
