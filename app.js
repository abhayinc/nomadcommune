/* ==========================================================================
   Nomad Commune - Interaction Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initRealitySlider();
    initVibeScorecard();
    initEmailSignup();
});

/**
 * 1. Mobile Navigation Toggle
 */
function initMobileNav() {
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navDrawer = document.querySelector('.mobile-nav-drawer');
    const drawerLinks = document.querySelectorAll('.mobile-link');

    if (navToggle && navDrawer) {
        navToggle.addEventListener('click', () => {
            const isOpen = navToggle.classList.toggle('active');
            navDrawer.classList.toggle('active', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        drawerLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navDrawer.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

/**
 * 2. Expectation vs Reality Before-After Slider
 */
function initRealitySlider() {
    const sliderInput = document.querySelector('.slider-control-input');
    const imageSlider = document.querySelector('.image-slider');

    if (sliderInput && imageSlider) {
        // Sync slider input changes with CSS variable --clip-pos
        const updateSliderPos = (val) => {
            imageSlider.style.setProperty('--clip-pos', `${val}%`);
        };

        sliderInput.addEventListener('input', (e) => {
            updateSliderPos(e.target.value);
        });

        // Initialize slider animation to give a peek on load
        let peekValue = 50;
        let direction = -1;
        let animationFrame;

        const peekAnimation = () => {
            if (peekValue <= 35) direction = 1;
            if (peekValue >= 65) direction = -1;
            
            peekValue += direction * 0.2;
            updateSliderPos(peekValue);
            sliderInput.value = peekValue;
            
            // Stop animating once user interacts or hovers
            animationFrame = requestAnimationFrame(peekAnimation);
        };

        // Start subtle peek animation
        animationFrame = requestAnimationFrame(peekAnimation);

        const stopPeek = () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
                animationFrame = null;
            }
        };

        sliderInput.addEventListener('mousedown', stopPeek);
        sliderInput.addEventListener('touchstart', stopPeek);
        sliderInput.addEventListener('mouseenter', stopPeek);
    }
}

/**
 * 3. Nomad Vibe Scorecard Dynamic Updates
 */
const LOCATION_DATA = {
    munsiyari: {
        name: 'Munsiyari Mud-house',
        region: 'Uttarakhand / 2,200m Altitude',
        image: 'images/mud_house.png',
        connectivity: {
            value: 'Fiber Web',
            pct: 85,
            desc: 'Dual BSNL & Jio Fiber feeds. Power backup ensures 8-hour desktop runtime. Typical pings: 35-50ms.'
        },
        accommodation: {
            value: 'Kumaoni Mud-house',
            pct: 90,
            desc: 'Traditional thick stone and mud walls providing natural climate control. Cozy wood fire stove heating.'
        },
        vibe: {
            value: 'Rugged Trekking',
            pct: 75,
            desc: 'Surrounded by the majestic Panchachuli peaks. Demanding cold, pristine thin air, and profound quiet.'
        }
    },
    jibhi: {
        name: 'Jibhi River Cabin',
        region: 'Himachal Pradesh / 1,600m Altitude',
        image: 'images/jibhi_cabin.png',
        connectivity: {
            value: 'Local Mesh WiFi',
            pct: 80,
            desc: 'Broadband backed by Jio 4G router. Ideal for video calls. Occasional mountain storm interruptions.'
        },
        accommodation: {
            value: 'Pine Log Cottage',
            pct: 85,
            desc: 'Rustic timber wood panels, sound of the rushing stream. Open balcony and fully functional communal kitchen.'
        },
        vibe: {
            value: 'Forest Murmurs',
            pct: 90,
            desc: 'Lush green cedar forests, crystal streams, waterfalls, and moderate nature walks. High community interaction.'
        }
    },
    khuri: {
        name: 'Khuri Desert Tent',
        region: 'Rajasthan / 240m Altitude',
        image: 'images/desert_camp.png',
        connectivity: {
            value: 'Digital Detox Zone',
            pct: 40,
            desc: 'Muted connectivity. Best suited for deep code writing, offline strategy drafting, or active stargazing.'
        },
        accommodation: {
            value: 'Desert Glamping',
            pct: 80,
            desc: 'Comfortable cotton-canvas desert tents under the dunes. Traditional open-sky courtyard dining.'
        },
        vibe: {
            value: 'Deep Silence',
            pct: 95,
            desc: 'Sweeping sand dunes, zero background noise, bonfire circles, and stargazing sessions away from city lights.'
        }
    },
    orchha: {
        name: 'Orchha Heritage Fort',
        region: 'Madhya Pradesh / 180m Altitude',
        image: 'images/orchha_heritage.png',
        connectivity: {
            value: 'Fiber Backbone',
            pct: 90,
            desc: 'Stably linked local telecom fiber. Low latencies and continuous power coverage via hybrid solar backup.'
        },
        accommodation: {
            value: 'Stone Ruin Balcony',
            pct: 75,
            desc: 'Historic homestay rooms overlooking ancient monuments. Restored stone pillars, rustic wooden shutters.'
        },
        vibe: {
            value: 'Ancient Culture',
            pct: 85,
            desc: 'Working near cenotaphs and temples. Rich local history, historic village markets, and riverside strolls.'
        }
    }
};

function initVibeScorecard() {
    const tabs = document.querySelectorAll('.tab-btn');
    const locName = document.getElementById('location-name');
    const locRegion = document.getElementById('location-region');
    const scorecardImg = document.getElementById('scorecard-image');
    
    const connVal = document.getElementById('metric-conn-value');
    const connBar = document.getElementById('metric-conn-bar');
    const connDesc = document.getElementById('metric-conn-desc');
    
    const accomVal = document.getElementById('metric-accom-value');
    const accomBar = document.getElementById('metric-accom-bar');
    const accomDesc = document.getElementById('metric-accom-desc');
    
    const vibeVal = document.getElementById('metric-vibe-value');
    const vibeBar = document.getElementById('metric-vibe-bar');
    const vibeDesc = document.getElementById('metric-vibe-desc');

    if (tabs.length > 0 && locName) {
        const updateScorecard = (locKey) => {
            const data = LOCATION_DATA[locKey];
            if (!data) return;

            // Animate transition by fading out elements briefly
            scorecardImg.style.opacity = '0.3';
            
            setTimeout(() => {
                // Update Text Content
                locName.textContent = data.name;
                locRegion.textContent = data.region;
                scorecardImg.src = data.image;
                scorecardImg.alt = `${data.name} visual preview`;
                
                connVal.textContent = data.connectivity.value;
                connDesc.textContent = data.connectivity.desc;
                
                accomVal.textContent = data.accommodation.value;
                accomDesc.textContent = data.accommodation.desc;
                
                vibeVal.textContent = data.vibe.value;
                vibeDesc.textContent = data.vibe.desc;

                // Animate bars
                connBar.style.width = '0%';
                accomBar.style.width = '0%';
                vibeBar.style.width = '0%';

                setTimeout(() => {
                    connBar.style.width = `${data.connectivity.pct}%`;
                    accomBar.style.width = `${data.accommodation.pct}%`;
                    vibeBar.style.width = `${data.vibe.pct}%`;
                }, 100);

                scorecardImg.style.opacity = '1';
            }, 300);
        };

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const locationKey = tab.getAttribute('data-location');
                updateScorecard(locationKey);
            });
        });

        // Initialize first run bar widths
        setTimeout(() => {
            const activeTab = document.querySelector('.tab-btn.active');
            if (activeTab) {
                const locKey = activeTab.getAttribute('data-location');
                const data = LOCATION_DATA[locKey];
                if (data) {
                    connBar.style.width = `${data.connectivity.pct}%`;
                    accomBar.style.width = `${data.accommodation.pct}%`;
                    vibeBar.style.width = `${data.vibe.pct}%`;
                }
            }
        }, 500);
    }
}

/**
 * 4. Pre-Launch Email Waitlist Integration
 */
function initEmailSignup() {
    const signupForms = [
        { formId: 'hero-signup', successId: 'signup-success' },
        { formId: 'footer-signup', successId: 'footer-success' }
    ];

    signupForms.forEach(({ formId, successId }) => {
        const form = document.getElementById(formId);
        const successToast = document.getElementById(successId);

        if (form && successToast) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const emailInput = form.querySelector('input[type="email"]');
                const submitBtn = form.querySelector('button[type="submit"]');
                const email = emailInput.value.trim();

                if (!email) return;

                // Visual Feedback: Loading State
                const originalBtnText = submitBtn.textContent;
                submitBtn.disabled = true;
                submitBtn.textContent = 'Verifying...';
                emailInput.disabled = true;

                // Simulate local server delay
                setTimeout(() => {
                    // Store email locally
                    let emailList = [];
                    try {
                        emailList = JSON.parse(localStorage.getItem('nomad_commune_emails') || '[]');
                    } catch (err) {
                        emailList = [];
                    }
                    if (!emailList.includes(email)) {
                        emailList.push(email);
                        localStorage.setItem('nomad_commune_emails', JSON.stringify(emailList));
                    }

                    // Hide form and show success toast
                    form.style.display = 'none';
                    successToast.classList.remove('hidden');
                    
                    console.log(`Saved email to waitlist database: ${email}`);
                }, 1000);
            });
        }
    });
}
