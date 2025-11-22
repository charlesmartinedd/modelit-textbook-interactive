class TrafficSimulation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.cars = [];
        this.lightState = 'green'; // green, yellow, red
        this.lightTimer = 0;
        this.lightDuration = 200; // frames
        this.queue = 0;
        this.isRunning = false;
        
        // Configuration
        this.speed = 3;
        this.carSize = 30;
        this.stopLine = this.canvas.width - 150;
        
        // Resize handling
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Bind methods
        this.animate = this.animate.bind(this);
        this.toggleLight = this.toggleLight.bind(this);
    }

    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = 300;
        this.stopLine = this.canvas.width / 2;
    }

    init() {
        this.cars = [];
        // Spawn initial cars
        for(let i = 0; i < 5; i++) {
            this.spawnCar(-i * 120);
        }
        this.isRunning = true;
        this.animate();
        
        // Spawn loop
        setInterval(() => {
            if(this.isRunning) this.spawnCar();
        }, 1500);
    }

    spawnCar(x = -50) {
        // Don't spawn if too crowded at start
        const lastCar = this.cars[this.cars.length - 1];
        if (lastCar && lastCar.x < 50) return;

        this.cars.push({
            x: x,
            y: this.canvas.height / 2 + 20,
            speed: this.speed,
            color: `hsl(${Math.random() * 360}, 70%, 50%)`,
            stopped: false
        });
    }

    toggleLight() {
        if (this.lightState === 'green') {
            this.lightState = 'yellow';
            setTimeout(() => {
                this.lightState = 'red';
            }, 1000);
        } else if (this.lightState === 'red') {
            this.lightState = 'green';
        }
    }

    update() {
        // Update cars
        for (let i = 0; i < this.cars.length; i++) {
            let car = this.cars[i];
            let nextCar = this.cars[i - 1]; // Car in front

            // 1. Traffic Light Logic
            if (this.lightState === 'red' || this.lightState === 'yellow') {
                if (car.x < this.stopLine && car.x + this.carSize + 10 > this.stopLine) {
                    car.speed = 0;
                    car.stopped = true;
                }
            } else {
                 // Green light: accelerate if stopped
                 if (car.stopped && (!nextCar || nextCar.x > car.x + this.carSize + 20)) {
                     car.speed += 0.1;
                     if(car.speed > this.speed) car.speed = this.speed;
                     car.stopped = false;
                 }
            }

            // 2. Collision Avoidance (The "System" part)
            if (nextCar) {
                let dist = nextCar.x - car.x;
                if (dist < this.carSize + 20) {
                    car.speed = nextCar.speed; // Match speed
                    if(dist < this.carSize + 5) {
                        car.speed = 0; // Emergency stop
                    }
                } else if (!car.stopped && car.speed < this.speed) {
                    car.speed += 0.1; // Accelerate back to normal
                }
            }

            // Move
            car.x += car.speed;

            // Remove off-screen cars
            if (car.x > this.canvas.width) {
                this.cars.splice(i, 1);
                i--;
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Road
        this.ctx.fillStyle = '#34495e';
        this.ctx.fillRect(0, this.canvas.height/2, this.canvas.width, 60);
        
        // Dashed Line
        this.ctx.strokeStyle = '#f1c40f';
        this.ctx.setLineDash([20, 20]);
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height/2 + 30);
        this.ctx.lineTo(this.canvas.width, this.canvas.height/2 + 30);
        this.ctx.stroke();

        // Draw Stop Line
        this.ctx.setLineDash([]);
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.moveTo(this.stopLine, this.canvas.height/2);
        this.ctx.lineTo(this.stopLine, this.canvas.height/2 + 60);
        this.ctx.stroke();

        // Draw Traffic Light
        this.drawTrafficLight();

        // Draw Cars
        this.cars.forEach(car => {
            this.ctx.fillStyle = car.color;
            // Simple Car Shape
            this.ctx.beginPath();
            this.ctx.roundRect(car.x, car.y - 10, this.carSize, 20, 5);
            this.ctx.fill();
            
            // Windows
            this.ctx.fillStyle = '#add8e6';
            this.ctx.fillRect(car.x + 5, car.y - 8, 10, 16);
            
            // Wheels
            this.ctx.fillStyle = 'black';
            this.ctx.beginPath();
            this.ctx.arc(car.x + 8, car.y + 10, 4, 0, Math.PI*2);
            this.ctx.arc(car.x + 22, car.y + 10, 4, 0, Math.PI*2);
            this.ctx.fill();
        });
    }

    drawTrafficLight() {
        const x = this.stopLine;
        const y = this.canvas.height/2 - 80;
        
        // Pole
        this.ctx.fillStyle = '#7f8c8d';
        this.ctx.fillRect(x - 2, y + 40, 4, 40);
        
        // Box
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(x - 15, y, 30, 50); // Vertical light
        
        // Lights
        this.drawLight(x, y + 10, 'red', this.lightState === 'red');
        this.drawLight(x, y + 25, 'yellow', this.lightState === 'yellow');
        this.drawLight(x, y + 40, 'green', this.lightState === 'green');
    }

    drawLight(x, y, color, isActive) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, 6, 0, Math.PI*2);
        this.ctx.fillStyle = isActive ? color : '#555';
        this.ctx.fill();
        
        if(isActive) {
            this.ctx.shadowColor = color;
            this.ctx.shadowBlur = 10;
            this.ctx.stroke();
            this.ctx.shadowBlur = 0;
        }
    }

    animate() {
        if(!this.isRunning) return;
        this.update();
        this.draw();
        requestAnimationFrame(this.animate);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const sim = new TrafficSimulation('trafficCanvas');
    sim.init();
    
    // Connect Controls
    const btn = document.getElementById('toggleLightBtn');
    if(btn) {
        btn.addEventListener('click', () => {
            sim.toggleLight();
            // Update button text logic
            const status = sim.lightState === 'green' ? 'Turn Red' : 'Turn Green';
             // (Simple toggle text update handled by CSS/JS logic if needed)
        });
    }
});
