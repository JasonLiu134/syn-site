let canvas = document.getElementById('canvas-bg');
if (!canvas) {
    const newCanvas = document.createElement('canvas');
    newCanvas.id = 'canvas-bg';
    document.body.insertBefore(newCanvas, document.body.firstChild);
    canvas = newCanvas;
}
const ctx = canvas.getContext('2d');

canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = '-2'; 
canvas.style.pointerEvents = 'none';

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const screenArea = window.innerWidth * window.innerHeight;
const screenDiagonal = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);

let particleCount = Math.floor(screenArea / 8500);
particleCount = Math.min(Math.max(particleCount, 60), 250); 

let maxDistance = Math.floor(screenDiagonal / 14);
maxDistance = Math.min(Math.max(maxDistance, 110), 180); 

const speedFactor = 0.4;
const particles = [];

for (let i = 0; i < particleCount; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speedFactor,
        vy: (Math.random() - 0.5) * speedFactor,
        radius: 2,
        twinkleSpeed: 0.001 + Math.random() * 0.002, 
        twinklePhase: Math.random() * Math.PI * 2    
    });
}

function getActiveThemeColor() {
    const rootStyles = getComputedStyle(document.documentElement);
    const color = rootStyles.getPropertyValue('--current-theme-color-dark').trim();
    
    if (color === '#1a1a1a' || !color) {
        return '255, 255, 255';
    }
    return hexToRgbChannels(color);
}

function hexToRgbChannels(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
        hex = hex.split('').map(s => s + s).join('');
    }
    const num = parseInt(hex, 16);
    return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const rgbBase = getActiveThemeColor();

    particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx = -p.vx;
        if (p.y < 0 || p.y > canvas.height) p.vy = -p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        
        let alpha = 0.4 + Math.sin(Date.now() * p.twinkleSpeed + p.twinklePhase) * 0.3;
        ctx.fillStyle = `rgba(${rgbBase}, ${alpha})`;
        ctx.fill();
    });

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
                
                const opacity = Math.max(0, 1 - distance / maxDistance);
                ctx.strokeStyle = `rgba(${rgbBase}, ${opacity * 0.35})`; 
                ctx.lineWidth = 0.75;
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animate);
}

animate();