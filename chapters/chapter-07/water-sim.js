class WaterCycleSim {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        this.particles = [];
        this.numParticles = 200;
        
        // Zones
        this.oceanLevel = 350;
        this.cloudLevel = 50;
        this.mountainX = 100;
        
        this.temperature = 1.0; // Multiplier
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.init();
        this.animate = this.animate.bind(this);
        this.animate();
    }

    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = 400;
        this.init();
    }

    init() {
        this.particles = [];
        for(let i=0; i<this.numParticles; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: this.canvas.height - 20,
            state: 'ocean', // ocean, evaporation, cloud, rain, river
            speed: Math.random() * 0.5 + 0.2
        };
    }

    setTemp(val) {
        this.temperature = val;
    }

    update() {
        this.particles.forEach(p => {
            switch(p.state) {
                case 'ocean':
                    // Drift in ocean
                    p.x += Math.sin(Date.now() * 0.001 + p.y) * 0.5;
                    p.y = Math.min(this.canvas.height - 5, Math.max(this.oceanLevel, p.y));
                    
                    // Evaporate randomly based on temperature
                    if (Math.random() < 0.002 * this.temperature && p.x > this.canvas.width * 0.4) {
                        p.state = 'evaporation';
                    }
                    break;
                    
                case 'evaporation':
                    p.y -= 1 * this.temperature;
                    p.x += Math.sin(p.y * 0.05) * 0.5;
                    
                    if (p.y < this.cloudLevel + Math.random() * 20) {
                        p.state = 'cloud';
                    }
                    break;
                    
                case 'cloud':
                    p.x -= 0.5; // Wind blows left
                    p.y += Math.sin(Date.now() * 0.002) * 0.2;
                    
                    // Condense/Rain over mountain
                    if (p.x < this.mountainX + 50 && Math.random() < 0.01) {
                        p.state = 'rain';
                    }
                    
                    // Reset if blown off screen
                    if (p.x < 0) p.x = this.canvas.width;
                    break;
                    
                case 'rain':
                    p.y += 3;
                    p.x -= 0.5; // Wind
                    
                    // Hit ground
                    if (p.y > this.canvas.height - 100 && p.x < this.mountainX + 100) {
                        p.state = 'river';
                    }
                    // Hit ocean
                    if (p.y > this.oceanLevel && p.x > this.canvas.width * 0.4) {
                        p.state = 'ocean';
                    }
                    break;
                    
                case 'river':
                    // Flow downhill/right
                    p.x += 1;
                    p.y += 0.5;
                    
                    if (p.x > this.canvas.width * 0.4) {
                        p.state = 'ocean';
                        p.y = this.oceanLevel;
                    }
                    break;
            }
            
            // Bounds check
            if (p.x > this.canvas.width) p.x = 0;
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw Scenery
        // Ocean
        this.ctx.fillStyle = '#3498db';
        this.ctx.fillRect(this.canvas.width * 0.4, this.oceanLevel, this.canvas.width * 0.6, this.canvas.height - this.oceanLevel);
        
        // Land/Mountain
        this.ctx.fillStyle = '#95a5a6';
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height);
        this.ctx.lineTo(0, this.canvas.height - 100);
        this.ctx.lineTo(this.mountainX, 100); // Peak
        this.ctx.lineTo(this.canvas.width * 0.4, this.oceanLevel);
        this.ctx.lineTo(this.canvas.width * 0.4, this.canvas.height);
        this.ctx.fill();

        // Draw Particles
        this.particles.forEach(p => {
            this.ctx.beginPath();
            if (p.state === 'cloud') {
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                this.ctx.arc(p.x, p.y, 8, 0, Math.PI*2);
            } else {
                this.ctx.fillStyle = '#85c1e9';
                this.ctx.arc(p.x, p.y, 3, 0, Math.PI*2);
            }
            this.ctx.fill();
        });
        
        // Labels
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.font = "14px Inter";
        this.ctx.fillText("Evaporation", this.canvas.width * 0.7, 200);
        this.ctx.fillText("Precipitation", 50, 150);
        this.ctx.fillText("Runoff", 150, 300);
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(this.animate);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const sim = new WaterCycleSim('waterCanvas');
    
    const slider = document.getElementById('tempSlider');
    if(slider) {
        slider.addEventListener('input', (e) => {
            sim.setTemp(parseFloat(e.target.value));
        });
    }
});
