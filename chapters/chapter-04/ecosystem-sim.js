class EcosystemSim {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Simulation State
        this.time = 0;
        this.grass = 100;
        this.deer = 20;
        this.wolves = 0; // Start with no wolves
        
        this.history = [];
        this.maxHistory = 300;
        this.running = true;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.animate = this.animate.bind(this);
        this.toggleWolves = this.toggleWolves.bind(this);
    }

    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = 350;
    }

    init() {
        this.animate();
    }

    toggleWolves() {
        if (this.wolves > 0) {
            this.wolves = 0;
        } else {
            this.wolves = 5; // Introduce wolves
        }
    }

    update() {
        // Simplified Lotka-Volterra-ish Logic
        // 1. Grass grows (Logistic growth)
        const grassGrowth = 0.1 * this.grass * (1 - this.grass / 200);
        this.grass += grassGrowth;

        // 2. Deer eat Grass
        const deerEat = 0.02 * this.grass * this.deer;
        this.grass -= deerEat;
        this.deer += deerEat * 0.1; // Deer reproduce based on food
        this.deer -= this.deer * 0.01; // Natural death

        // 3. Wolves eat Deer
        if (this.wolves > 0) {
            const wolvesEat = 0.02 * this.deer * this.wolves;
            this.deer -= wolvesEat;
            this.wolves += wolvesEat * 0.1;
            this.wolves -= this.wolves * 0.02; // Wolves die faster
        } else {
            // If no wolves, deer can overpopulate and crash
             if (this.deer > 100) {
                 this.deer -= this.deer * 0.1; // Starvation crash
             }
        }

        // Limits
        if(this.grass < 0) this.grass = 0;
        if(this.deer < 2) this.deer = 2; // Minimum population to recover
        if(this.wolves < 2 && this.wolves > 0.1) this.wolves = 0; // Extinction

        // Record History
        this.history.push({
            g: this.grass,
            d: this.deer,
            w: this.wolves
        });
        
        if(this.history.length > this.maxHistory) {
            this.history.shift();
        }
        
        this.time++;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw Graph Background
        this.ctx.strokeStyle = '#bdc3c7';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(50, 20);
        this.ctx.lineTo(50, this.canvas.height - 30);
        this.ctx.lineTo(this.canvas.width - 20, this.canvas.height - 30);
        this.ctx.stroke();

        // Draw Lines
        this.drawLine('g', '#2ecc71', 1); // Grass
        this.drawLine('d', '#e67e22', 3); // Deer
        this.drawLine('w', '#e74c3c', 10); // Wolves (Scale up for visibility)

        // Legend
        this.ctx.font = '12px Inter';
        this.ctx.textAlign = 'left';
        
        this.ctx.fillStyle = '#2ecc71';
        this.ctx.fillText(`Grass: ${Math.floor(this.grass)}`, 60, 30);
        
        this.ctx.fillStyle = '#e67e22';
        this.ctx.fillText(`Deer: ${Math.floor(this.deer)}`, 140, 30);
        
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.fillText(`Wolves: ${Math.floor(this.wolves)}`, 220, 30);
    }

    drawLine(key, color, scale) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        
        const step = (this.canvas.width - 70) / this.maxHistory;
        const bottom = this.canvas.height - 30;
        
        this.history.forEach((point, i) => {
            const x = 50 + i * step;
            const y = bottom - (point[key] * scale);
            
            if(i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        });
        
        this.ctx.stroke();
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
    const sim = new EcosystemSim('ecoCanvas');
    sim.init();
    
    const btn = document.getElementById('wolfBtn');
    if(btn) {
        btn.addEventListener('click', () => {
            sim.toggleWolves();
            btn.textContent = sim.wolves > 0 ? "Remove Wolves" : "Introduce Wolves";
            btn.classList.toggle('active');
        });
    }
});
