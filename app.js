document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // 1. Header Scroll Shadow
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Active Navigation Link on Scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // 3. Scroll Triggered Fade-in Animations (Intersection Observer)
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(element => {
        fadeObserver.observe(element);
    });

    // 4. Laminate Explorer Logic
    const layers = {
        pla: {
            name: "Outer PLA Layer",
            description: "Provides the structural skin, stiffness, and external moisture barrier. It ensures the sachet is printable, wear-resistant, and maintains a premium, smooth aesthetic suitable for commercial branding.",
            component: "Polylactic Acid (PLA)",
            function: "Waterproofing & Printability",
            color: "var(--color-pla)"
        },
        tie: {
            name: "Bio-Adhesive Tie Layer",
            description: "A specialized biodegradable adhesive layer that locks the structural outer skin to the elastic sealant barrier, preventing delamination or peeling under high mechanical stress or chemical attack.",
            component: "Bio-Derived Copolyester Adhesive",
            function: "Delamination Prevention",
            color: "var(--color-tie)"
        },
        sealant: {
            name: "ElastoShield Sealant Layer",
            description: "The core chemical innovation. It utilizes a pre-gelatinized starch matrix blended with natural rubber latex and a sacrificial calcium carbonate buffer. It is the only layer in direct contact with the product, providing a tight hermetic heat seal and blocking alkaline chemical migration (pH 11.0).",
            component: "Starch + NRL + CaCO₃ + Glycerol",
            function: "pH 11.0 Barrier & Heat Seal",
            color: "var(--color-sealant)"
        }
    };

    const layerItems = document.querySelectorAll('.laminate-layer-item');
    const detailName = document.getElementById('layer-name');
    const detailDesc = document.getElementById('layer-description');
    const detailComp = document.getElementById('layer-component');
    const detailFunc = document.getElementById('layer-function');
    const detailIndicator = document.getElementById('layer-indicator');

    layerItems.forEach(item => {
        item.addEventListener('click', () => {
            layerItems.forEach(li => li.classList.remove('active'));
            item.classList.add('active');

            const layerKey = item.getAttribute('data-layer');
            const data = layers[layerKey];

            // Update content with a slight fade
            const card = document.getElementById('layer-detail-card');
            card.style.opacity = 0.5;
            card.style.transform = 'translateY(5px)';
            
            setTimeout(() => {
                detailName.innerText = data.name;
                detailDesc.innerText = data.description;
                detailComp.innerText = data.component;
                detailFunc.innerText = data.function;
                detailIndicator.style.backgroundColor = data.color;
                
                card.style.opacity = 1;
                card.style.transform = 'translateY(0)';
            }, 150);
        });
    });

    // 5. Cost & EPR Calculator Logic
    const volumeSlider = document.getElementById('production-volume');
    const volLabel = document.getElementById('calc-vol-label');
    const ingStarch = document.getElementById('ing-starch');
    const ingNrl = document.getElementById('ing-nrl');
    const ingGlycerol = document.getElementById('ing-glycerol');
    const ingCaco3 = document.getElementById('ing-caco3');
    const sumMass = document.getElementById('sum-mass');
    const sumSachetCost = document.getElementById('sum-sachet-cost');
    const sumTotalCost = document.getElementById('sum-total-cost');
    const sumCo2 = document.getElementById('sum-co2');

    const sachetWeight = 1.23; // grams
    const costPerKg = 58.95; // Blended raw material + processing cost per kg in INR

    function updateCalculator(volume) {
        // Calculations
        const totalMassKg = (volume * sachetWeight) / 1000;
        const starchKg = totalMassKg * 0.75;
        const nrlKg = totalMassKg * 0.03;
        const glycerolKg = totalMassKg * 0.12;
        const caco3Kg = totalMassKg * 0.10;
        
        const totalCostINR = totalMassKg * costPerKg;
        const sachetCostINR = totalCostINR / volume;
        const co2SavedMT = (volume / 1000000) * 1.57;

        // UI Updates
        volLabel.innerText = volume.toLocaleString('en-IN') + " sachets";
        ingStarch.innerText = starchKg.toLocaleString('en-IN', {maximumFractionDigits: 1}) + " kg";
        ingNrl.innerText = nrlKg.toLocaleString('en-IN', {maximumFractionDigits: 1}) + " kg";
        ingGlycerol.innerText = glycerolKg.toLocaleString('en-IN', {maximumFractionDigits: 1}) + " kg";
        ingCaco3.innerText = caco3Kg.toLocaleString('en-IN', {maximumFractionDigits: 1}) + " kg";
        
        sumMass.innerHTML = totalMassKg.toLocaleString('en-IN', {maximumFractionDigits: 1}) + " <span>kg</span>";
        sumSachetCost.innerHTML = "₹" + sachetCostINR.toFixed(2) + " <span>(" + Math.round(sachetCostINR * 100) + " Paise / unit)</span>";
        sumTotalCost.innerHTML = "₹" + Math.round(totalCostINR).toLocaleString('en-IN') + " <span>INR</span>";
        sumCo2.innerHTML = co2SavedMT.toFixed(2) + " <span>Metric Tonnes CO₂e</span>";
    }

    volumeSlider.addEventListener('input', (e) => {
        updateCalculator(parseInt(e.target.value));
        
        // Remove active class from preset buttons
        document.querySelectorAll('.btn-preset').forEach(btn => btn.classList.remove('active'));
    });

    // Preset Buttons
    document.querySelectorAll('.btn-preset').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.btn-preset').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const presetVal = parseInt(button.getAttribute('data-val'));
            volumeSlider.value = presetVal;
            updateCalculator(presetVal);
        });
    });

    // Run initial calculator run
    updateCalculator(1000000);

    // 6. Tab Switcher
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            const targetTab = btn.getAttribute('data-tab');
            document.getElementById(`tab-${targetTab}`).classList.add('active');
        });
    });

    // 7. Chart.js Configurations
    // Chart 1: pH Stability (Line)
    const phCtx = document.getElementById('phStabilityChart').getContext('2d');
    const phChart = new Chart(phCtx, {
        type: 'line',
        data: {
            labels: ['0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100', '110', '120'],
            datasets: [
                {
                    label: 'External Slaked Lime Exposure',
                    data: [11.0, 11.0, 11.0, 11.0, 11.0, 11.0, 11.0, 11.0, 11.0, 11.0, 11.0, 11.0, 11.0],
                    borderColor: '#ff5252',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0.1
                },
                {
                    label: 'Control (Unmodified Starch Film)',
                    data: [7.0, 8.2, 9.5, 10.3, 10.8, 11.0, 11.0, 11.0, 11.0, 11.0, 11.0, 11.0, 11.0],
                    borderColor: '#ffd54f',
                    borderWidth: 2.5,
                    fill: false,
                    tension: 0.2
                },
                {
                    label: 'ElastoShield Barrier',
                    data: [7.0, 7.0, 7.1, 7.0, 7.0, 7.1, 7.0, 7.0, 7.0, 7.0, 7.1, 7.0, 7.0],
                    borderColor: '#00e676',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { color: '#9a9fac', font: { family: 'Plus Jakarta Sans', size: 11 } }
                }
            },
            scales: {
                y: {
                    title: { display: true, text: 'pH Level', color: '#9a9fac' },
                    min: 6,
                    max: 12,
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#9a9fac' }
                },
                x: {
                    title: { display: true, text: 'Time Exposure (Minutes)', color: '#9a9fac' },
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#9a9fac' }
                }
            }
        }
    });

    // Chart 2: Material Composition (Doughnut)
    const compCtx = document.getElementById('compositionChart').getContext('2d');
    const compChart = new Chart(compCtx, {
        type: 'doughnut',
        data: {
            labels: ['Industrial Starch (Polymer)', 'Natural Rubber Latex (Elastomer)', 'Glycerol (Plasticizer)', 'Calcium Carbonate (pH Buffer)'],
            datasets: [{
                data: [75, 3, 12, 10],
                backgroundColor: [
                    '#00e676',
                    '#4fc3f7',
                    '#ffd54f',
                    '#ff7043'
                ],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#9a9fac', font: { family: 'Plus Jakarta Sans', size: 11 }, padding: 15 }
                }
            }
        }
    });

    // Chart 3: Biodegradability Rate (Line)
    const bioCtx = document.getElementById('biodegradationChart').getContext('2d');
    const bioChart = new Chart(bioCtx, {
        type: 'line',
        data: {
            labels: ['Day 0', 'Day 30', 'Day 60', 'Day 90', 'Day 120', 'Day 150', 'Day 180'],
            datasets: [
                {
                    label: 'Conventional Multi-Layer Plastic (MLP)',
                    data: [0, 0, 0, 0, 0, 0, 0],
                    borderColor: '#ff5252',
                    borderWidth: 2,
                    fill: false
                },
                {
                    label: 'ElastoShield (Ambient Soil Composting)',
                    data: [0, 15, 38, 62, 85, 96, 100],
                    borderColor: '#00e676',
                    backgroundColor: 'rgba(0, 230, 118, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { color: '#9a9fac', font: { family: 'Plus Jakarta Sans', size: 11 } }
                }
            },
            scales: {
                y: {
                    title: { display: true, text: '% Degradation Completion', color: '#9a9fac' },
                    min: 0,
                    max: 100,
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#9a9fac' }
                },
                x: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#9a9fac' }
                }
            }
        }
    });

    // 8. Before/After Interactive Comparison Slider
    const sliderContainer = document.querySelector('.slider-container');
    const beforeDiv = document.getElementById('slide-before-div');
    const beforeImg = beforeDiv.querySelector('.slide-img');
    const handle = document.getElementById('slider-drag-handle');

    let isResizing = false;

    function setSliderPosition(x) {
        const rect = sliderContainer.getBoundingClientRect();
        let position = ((x - rect.left) / rect.width) * 100;
        
        // Bounds checking
        if (position < 0) position = 0;
        if (position > 100) position = 100;
        
        beforeDiv.style.width = `${position}%`;
        handle.style.left = `${position}%`;
        
        // Set the image width inside the before-container to the exact container width in pixels so it clips instead of squishing
        beforeImg.style.width = `${rect.width}px`;
    }

    function resizeSliderImage() {
        const rect = sliderContainer.getBoundingClientRect();
        beforeImg.style.width = `${rect.width}px`;
    }

    // Run initially (after small delay to ensure rendering completes)
    setTimeout(resizeSliderImage, 100);
    window.addEventListener('resize', resizeSliderImage);

    // Mouse Events
    sliderContainer.addEventListener('mousedown', (e) => {
        isResizing = true;
        setSliderPosition(e.clientX);
    });

    window.addEventListener('mouseup', () => {
        isResizing = false;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        setSliderPosition(e.clientX);
    });

    // Touch Events for Mobile
    sliderContainer.addEventListener('touchstart', (e) => {
        isResizing = true;
        setSliderPosition(e.touches[0].clientX);
    });

    window.addEventListener('touchend', () => {
        isResizing = false;
    });

    window.addEventListener('touchmove', (e) => {
        if (!isResizing) return;
        setSliderPosition(e.touches[0].clientX);
    });
});
