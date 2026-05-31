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
const particleCount = 300;
const maxDistance = 150;
const speedFactor = 0.5;

// Particle array
const particles = [];
for (let i = 0; i < particleCount; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speedFactor,
        vy: (Math.random() - 0.5) * speedFactor,
        radius: 2
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
        
        // Bounce off edges with better edge handling
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
        
        // Draw point
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
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