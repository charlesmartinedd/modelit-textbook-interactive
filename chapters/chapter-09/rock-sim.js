class RockCycleSim {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        this.time = 0; // 0 to 100 (million years)
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.draw = this.draw.bind(this);
        this.draw();
    }

    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = 400;
        this.draw();
    }

    setTime(t) {
        this.time = t;
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const w = this.canvas.width;
        const h = this.canvas.height;
        const groundY = h - 50;
        
        // Sky
        const skyColor = Math.floor(200 - this.time); // Darkens slightly over eons? No, keep it blue.
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, w, h);

        // 1. Mountain (Erodes over time)
        // Starts high, gets lower
        const mountainHeight = 300 * (1 - (this.time / 100));
        
        this.ctx.fillStyle = '#7f8c8d';
        this.ctx.beginPath();
        this.ctx.moveTo(0, groundY);
        this.ctx.lineTo(w * 0.3, groundY - mountainHeight); // Peak
        this.ctx.lineTo(w * 0.6, groundY);
        this.ctx.fill();

        // 2. Sediment in Ocean/Valley (Builds up)
        const sedimentHeight = 100 * (this.time / 100);
        
        this.ctx.fillStyle = '#e67e22'; // Sand/Sediment
        this.ctx.beginPath();
        this.ctx.moveTo(w * 0.6, groundY);
        this.ctx.lineTo(w, groundY);
        this.ctx.lineTo(w, groundY - sedimentHeight);
        this.ctx.lineTo(w * 0.6, groundY - sedimentHeight * 0.5);
        this.ctx.fill();
        
        // 3. Metamorphic/Magma (Underground)
        // Push up new mountain at the end?
        if (this.time > 80) {
            const newMountainH = 150 * ((this.time - 80) / 20);
            this.ctx.fillStyle = '#c0392b'; // Magma pushing up
            this.ctx.beginPath();
            this.ctx.moveTo(w * 0.8, groundY);
            this.ctx.lineTo(w * 0.9, groundY - newMountainH);
            this.ctx.lineTo(w, groundY);
            this.ctx.fill();
        }

        // Water
        this.ctx.fillStyle = 'rgba(52, 152, 219, 0.5)';
        this.ctx.fillRect(w * 0.6, groundY - 50, w * 0.4, 50);

        // Rain animation hint
        if (this.time < 90) {
             this.ctx.strokeStyle = 'rgba(255,255,255,0.5)';
             this.ctx.beginPath();
             for(let i=0; i<20; i++) {
                 const rx = Math.random() * w * 0.5;
                 const ry = Math.random() * 200;
                 this.ctx.moveTo(rx, ry);
                 this.ctx.lineTo(rx - 5, ry + 10);
             }
             this.ctx.stroke();
        }
        
        // Text Info
        this.ctx.fillStyle = 'black';
        this.ctx.font = 'bold 16px Inter';
        this.ctx.fillText(`${this.time} Million Years`, 20, 30);
        
        if(this.time < 30) this.ctx.fillText("Phase 1: Weathering & Erosion", 20, 60);
        else if(this.time < 70) this.ctx.fillText("Phase 2: Deposition & Sedimentation", 20, 60);
        else this.ctx.fillText("Phase 3: Uplift (New Mountains)", 20, 60);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const sim = new RockCycleSim('rockCanvas');
    
    const slider = document.getElementById('timeSlider');
    if(slider) {
        slider.addEventListener('input', (e) => {
            sim.setTime(parseInt(e.target.value));
        });
    }
});
