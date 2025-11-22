class EnergySim {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        this.levels = [
            { name: 'Sun', energy: 10000, color: '#f1c40f', type: 'source' },
            { name: 'Producers', energy: 0, color: '#2ecc71', type: 'sink' },
            { name: 'Herbivores', energy: 0, color: '#e67e22', type: 'sink' },
            { name: 'Predators', energy: 0, color: '#e74c3c', type: 'sink' }
        ];
        
        this.particles = [];
        this.heatParticles = [];
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.animate = this.animate.bind(this);
        this.handleClick = this.handleClick.bind(this);
        
        this.canvas.addEventListener('click', this.handleClick);
    }

    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = 400;
        
        // Layout calculations
        const padding = 20;
        const width = (this.canvas.width - (padding * 5)) / 4;
        
        this.levels.forEach((level, i) => {
            level.x = padding + (width + padding) * i;
            level.y = this.canvas.height - 50;
            level.width = width;
            level.height = 0; // Dynamic based on energy
            level.targetHeight = 0;
        });
    }

    init() {
        this.animate();
    }

    transferEnergy(fromIndex) {
        if (fromIndex >= this.levels.length - 1) return;
        
        const source = this.levels[fromIndex];
        const dest = this.levels[fromIndex + 1];
        
        if (source.energy < 10) return; // Not enough energy
        
        const transferAmount = source.energy * 0.1; // 10% moves up
        const lossAmount = source.energy * 0.9;     // 90% lost as heat
        
        // Visualize transfer
        for(let i=0; i<10; i++) {
            this.particles.push({
                x: source.x + source.width/2,
                y: this.canvas.height - 100,
                targetX: dest.x + dest.width/2,
                targetY: this.canvas.height - 100,
                progress: 0,
                speed: 0.02 + Math.random() * 0.02,
                color: dest.color
            });
        }

        // Visualize Heat Loss
        for(let i=0; i<20; i++) {
            this.heatParticles.push({
                x: source.x + source.width/2,
                y: this.canvas.height - 100,
                vx: (Math.random() - 0.5) * 2,
                vy: -Math.random() * 3,
                life: 1,
                color: 'rgba(255, 100, 100, 0.5)'
            });
        }

        // Update Logic (simplified for demo)
        // In a real sim we'd wait for particles, but for responsiveness we update numbers now
        // source.energy -= source.energy; // It all moves (converted)
        if (fromIndex === 0) {
             // Sun is infinite source for this demo
             dest.energy += 1000; 
        } else {
             dest.energy += transferAmount;
             source.energy = 0; // Consumed
        }
    }

    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.levels.forEach((level, i) => {
            if (x > level.x && x < level.x + level.width) {
                this.transferEnergy(i);
            }
        });
    }

    update() {
        // Animate Particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
            p.progress += p.speed;
            
            // Parabolic arc
            p.x = p.x + (p.targetX - p.x) * p.speed;
            p.y = p.y + (p.targetY - p.y) * p.speed - Math.sin(p.progress * Math.PI) * 50;

            if (p.progress >= 1) {
                this.particles.splice(i, 1);
            }
        }

        // Animate Heat
        for (let i = this.heatParticles.length - 1; i >= 0; i--) {
            let p = this.heatParticles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.02;
            
            if (p.life <= 0) {
                this.heatParticles.splice(i, 1);
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw Levels
        this.levels.forEach(level => {
            // Base
            this.ctx.fillStyle = '#34495e';
            this.ctx.fillRect(level.x, this.canvas.height - 40, level.width, 10);
            
            // Label
            this.ctx.fillStyle = '#2c3e50';
            this.ctx.font = '14px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(level.name, level.x + level.width/2, this.canvas.height - 10);
            
            // Energy Bar
            let height = Math.min(200, level.energy * 0.05); // Scale for display
            if (level.name === 'Sun') height = 200; // Sun always full

            this.ctx.fillStyle = level.color;
            this.ctx.fillRect(level.x + 10, this.canvas.height - 40 - height, level.width - 20, height);
            
            // Value
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 12px Inter';
            this.ctx.fillText(Math.floor(level.energy), level.x + level.width/2, this.canvas.height - 50);
        });

        // Draw Particles
        this.particles.forEach(p => {
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 5, 0, Math.PI*2);
            this.ctx.fill();
        });

        // Draw Heat
        this.heatParticles.forEach(p => {
            this.ctx.fillStyle = `rgba(231, 76, 60, ${p.life})`;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 3 + (1-p.life)*5, 0, Math.PI*2);
            this.ctx.fill();
            this.ctx.font = '10px Arial';
            this.ctx.fillText("Heat", p.x, p.y);
        });
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(this.animate);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const sim = new EnergySim('energyCanvas');
    sim.init();
});
