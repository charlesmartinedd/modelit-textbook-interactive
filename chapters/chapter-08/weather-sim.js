class ChaosSim {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        this.particles = [];
        this.field = [];
        this.cols = 20;
        this.rows = 10;
        this.resolution = 0;
        
        this.running = true;
        this.butterflyEffect = false;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.canvas.addEventListener('mousemove', (e) => this.disturb(e));
        this.canvas.addEventListener('click', (e) => this.butterflyClick(e));
        
        this.init();
        this.animate = this.animate.bind(this);
        this.animate();
    }

    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = 300;
        
        this.resolution = this.canvas.width / this.cols;
        this.rows = Math.ceil(this.canvas.height / this.resolution);
        this.initField();
    }

    init() {
        this.particles = [];
        for(let i=0; i<100; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: 0,
                vy: 0,
                history: []
            });
        }
    }

    initField() {
        this.field = [];
        for(let y=0; y<this.rows; y++) {
            for(let x=0; x<this.cols; x++) {
                // Perlin noise substitute (simple sine waves for demo)
                const angle = Math.cos(y * 0.5) + Math.sin(x * 0.5);
                this.field.push({
                    angle: angle,
                    baseAngle: angle
                });
            }
        }
    }

    disturb(e) {
        // Mouse movement creates temporary wind
        const rect = this.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        
        const col = Math.floor(mx / this.resolution);
        const row = Math.floor(my / this.resolution);
        
        if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
            const index = col + row * this.cols;
            this.field[index].angle += 1; // Spin the vector
        }
    }
    
    butterflyClick(e) {
        // A single click changes ONE vector slightly
        // In a chaotic system, this changes everything eventually
        this.disturb(e);
        
        const label = document.getElementById('chaosLabel');
        if(label) {
            label.textContent = "🦋 Butterfly Flapped! Watch the pattern change.";
            label.style.color = "#e74c3c";
            setTimeout(() => {
                label.textContent = "System evolving...";
                label.style.color = "#7f8c8d";
            }, 2000);
        }
    }

    update() {
        // Evolve the field (weather changes)
        for(let i=0; i<this.field.length; i++) {
            // Neighbor influence (cellular automata-ish)
            const right = (i + 1) % this.field.length;
            const down = (i + this.cols) % this.field.length;
            
            // Vectors nudge each other
            this.field[i].angle += (this.field[right].angle - this.field[i].angle) * 0.01;
            this.field[i].angle += 0.001; // Natural drift
        }

        // Move particles based on field
        this.particles.forEach(p => {
            const col = Math.floor(p.x / this.resolution);
            const row = Math.floor(p.y / this.resolution);
            
            if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
                const index = col + row * this.cols;
                const angle = this.field[index].angle;
                
                p.vx += Math.cos(angle) * 0.1;
                p.vy += Math.sin(angle) * 0.1;
            }
            
            p.vx *= 0.98; // Friction
            p.vy *= 0.98;
            
            p.x += p.vx;
            p.y += p.vy;
            
            // Wrap around
            if(p.x < 0) p.x = this.canvas.width;
            if(p.x > this.canvas.width) p.x = 0;
            if(p.y < 0) p.y = this.canvas.height;
            if(p.y > this.canvas.height) p.y = 0;
            
            // Trail
            p.history.push({x: p.x, y: p.y});
            if(p.history.length > 10) p.history.shift();
        });
    }

    draw() {
        // Fade out effect
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw Vectors (faint)
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.beginPath();
        for(let y=0; y<this.rows; y++) {
            for(let x=0; x<this.cols; x++) {
                const index = x + y * this.cols;
                const px = x * this.resolution;
                const py = y * this.resolution;
                const angle = this.field[index].angle;
                
                this.ctx.moveTo(px + this.resolution/2, py + this.resolution/2);
                this.ctx.lineTo(
                    px + this.resolution/2 + Math.cos(angle) * 10, 
                    py + this.resolution/2 + Math.sin(angle) * 10
                );
            }
        }
        this.ctx.stroke();

        // Draw Particles
        this.ctx.lineWidth = 2;
        this.particles.forEach(p => {
            this.ctx.strokeStyle = '#3498db';
            this.ctx.beginPath();
            if(p.history.length > 0) {
                this.ctx.moveTo(p.history[0].x, p.history[0].y);
                for(let i=1; i<p.history.length; i++) {
                    this.ctx.lineTo(p.history[i].x, p.history[i].y);
                }
            }
            this.ctx.stroke();
        });
    }

    animate() {
        if(this.running) {
            this.update();
            this.draw();
        }
        requestAnimationFrame(this.animate);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ChaosSim('weatherCanvas');
});
