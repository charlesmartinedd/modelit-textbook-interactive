class BodySim {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        this.temp = 37; // Celsius
        this.sugar = 100; // mg/dL
        
        this.targetTemp = 37;
        this.targetSugar = 100;
        
        this.shiverRate = 0;
        this.insulinRate = 0;
        
        this.message = "System Nominal";
        this.statusColor = "#2ecc71"; // Green
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.animate = this.animate.bind(this);
    }

    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = 300;
    }

    init() {
        this.animate();
        
        // Random Events
        setInterval(() => {
            if(Math.random() > 0.7) this.triggerEvent();
        }, 3000);
    }

    triggerEvent() {
        const r = Math.random();
        if (r < 0.25) {
            this.temp -= 2;
            this.message = "⚠️ Entered Cold Room!";
            this.statusColor = "#3498db";
        } else if (r < 0.5) {
            this.temp += 1;
            this.message = "⚠️ Workout Started!";
            this.statusColor = "#e74c3c";
        } else if (r < 0.75) {
            this.sugar += 40;
            this.message = "⚠️ Ate a Donut!";
            this.statusColor = "#f1c40f";
        } else {
            this.sugar -= 20;
            this.message = "⚠️ Skipped Lunch!";
            this.statusColor = "#9b59b6";
        }
        
        setTimeout(() => {
            this.message = "System Nominal";
            this.statusColor = "#2ecc71";
        }, 2000);
    }

    applyAction(action) {
        if(action === 'shiver') this.shiverRate = 0.5;
        if(action === 'sweat') this.temp -= 0.5;
        if(action === 'insulin') this.insulinRate = 1.0;
        if(action === 'eat') this.sugar += 10;
    }

    update() {
        // Physics / Biology Logic
        
        // Natural drifting back to chaos (Entropy)
        // Without regulation, temp drops slowly, sugar drops slowly
        // this.temp -= 0.001;
        // this.sugar -= 0.01;

        // Apply User Actions (Decay over time)
        if(this.shiverRate > 0) {
            this.temp += 0.05;
            this.shiverRate -= 0.01;
        }
        
        if(this.insulinRate > 0) {
            this.sugar -= 0.5;
            this.insulinRate -= 0.01;
        }

        // Natural Homeostasis (The body tries a little bit on its own, but needs help in this game)
        // In reality, this is automatic. Here, we make the user do it to learn.
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw Gauges
        this.drawGauge(this.canvas.width * 0.25, 150, this.temp, 30, 44, "Temp (°C)", "#e74c3c");
        this.drawGauge(this.canvas.width * 0.75, 150, this.sugar, 50, 200, "Sugar (mg/dL)", "#3498db");
        
        // Status Message
        this.ctx.fillStyle = this.statusColor;
        this.ctx.font = "bold 18px Inter";
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.message, this.canvas.width/2, 280);
    }

    drawGauge(x, y, value, min, max, label, color) {
        // Background Arc
        this.ctx.beginPath();
        this.ctx.arc(x, y, 80, Math.PI, 0);
        this.ctx.lineWidth = 20;
        this.ctx.strokeStyle = "#ecf0f1";
        this.ctx.stroke();
        
        // Fill Arc
        const percent = Math.max(0, Math.min(1, (value - min) / (max - min)));
        const angle = Math.PI + (percent * Math.PI);
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, 80, Math.PI, angle);
        this.ctx.strokeStyle = color;
        this.ctx.stroke();
        
        // Text
        this.ctx.fillStyle = "#2c3e50";
        this.ctx.font = "bold 30px Inter";
        this.ctx.fillText(Math.floor(value), x, y - 20);
        
        this.ctx.font = "14px Inter";
        this.ctx.fillStyle = "#7f8c8d";
        this.ctx.fillText(label, x, y + 20);
        
        // Target Marker
        // ...
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(this.animate);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const sim = new BodySim('bodyCanvas');
    sim.init();
    
    document.getElementById('btnShiver').addEventListener('click', () => sim.applyAction('shiver'));
    document.getElementById('btnSweat').addEventListener('click', () => sim.applyAction('sweat'));
    document.getElementById('btnInsulin').addEventListener('click', () => sim.applyAction('insulin'));
    document.getElementById('btnEat').addEventListener('click', () => sim.applyAction('eat'));
});
