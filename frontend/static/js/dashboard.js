 // Mobile drawer
        const menuBtn = document.getElementById('menuBtn');
        const mobileDrawer = document.getElementById('mobileDrawer');
        let drawerOpen = false;

        menuBtn.addEventListener('click', () => {
            drawerOpen = !drawerOpen;
            menuBtn.classList.toggle('active', drawerOpen);
            mobileDrawer.classList.toggle('open', drawerOpen);
            document.body.style.overflow = drawerOpen ? 'hidden' : '';
        });

        function closeDrawer() {
            drawerOpen = false;
            menuBtn.classList.remove('active');
            mobileDrawer.classList.remove('open');
            document.body.style.overflow = '';
        }

        // Header scroll effect
        const header = document.getElementById('header');
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });

        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offset = 76;
                    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            });
        });