let canvas = document.getElementById('canvas-bg');
if (!canvas) {
    // Create canvas element
    const newCanvas = document.createElement('canvas');
    newCanvas.id = 'canvas-bg';
    document.body.insertBefore(newCanvas, document.body.firstChild);
    canvas = newCanvas;
}
const ctx = canvas.getContext('2d');

// Resize canvas to window size
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Configuration
// Scale configuration based on screen size
const screenArea = window.innerWidth * window.innerHeight;
const screenDiagonal = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);

// Calculate particle count based on screen area
let particleCount = Math.floor(screenArea / 7000);
particleCount = Math.min(Math.max(particleCount, 80), 400); // Max # of points between 80 and 400 particles

// Calculate max distance based on screen diagonal
let maxDistance = Math.floor(screenDiagonal / 12.5);
maxDistance = Math.min(Math.max(maxDistance, 100), 200); // Max line distance between 100 and 200 pixels

const speedFactor = 0.5;

// Particle array
const particles = [];
for (let i = 0; i < particleCount; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speedFactor,
        vy: (Math.random() - 0.5) * speedFactor,
        radius: 2,
        twinkleSpeed: 0.001 + Math.random() * 0.002, // Random twinkle speed
        twinklePhase: Math.random() * Math.PI * 2    // Random starting phase
    });
}

// Animation loop
function animate() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particles.forEach((p) => {
        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges of screen
        if (p.x < 0) {
            p.x = 0;
            p.vx = -p.vx;
        }
        if (p.x > canvas.width) {
            p.x = canvas.width;
            p.vx = -p.vx;
        }
        if (p.y < 0) {
            p.y = 0;
            p.vy = -p.vy;
        }
        if (p.y > canvas.height) {
            p.y = canvas.height;
            p.vy = -p.vy;
        }

        // Draw points
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        let alpha = 0.5 + Math.sin(Date.now() * p.twinkleSpeed + p.twinklePhase) * 0.4; // Give some twinkle
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
    });

    // Draw lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const p1 = particles[i];
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                // Calculate opacity - brighter when closer
                const opacity = Math.max(0, 1 - distance / maxDistance);
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})`; // Max opacity 0.5 for subtle lines
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }

    // Continue animation
    requestAnimationFrame(animate);
}

// Start animation with requestAnimationFrame for smooth 60fps
animate();