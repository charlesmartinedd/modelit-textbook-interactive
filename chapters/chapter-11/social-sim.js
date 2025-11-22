class SocialSim {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        this.stock = 100;
        this.maxStock = 100;
        this.shoppers = [];
        this.panicLevel = 0; // 0 to 1
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.init();
        this.animate = this.animate.bind(this);
        this.animate();
    }

    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = 300;
    }

    init() {
        this.shoppers = [];
        // Add shoppers over time
        setInterval(() => this.addShopper(), 500);
        
        // Restock slowly
        setInterval(() => {
            if(this.stock < this.maxStock) this.stock += 5;
            if(this.stock > this.maxStock) this.stock = this.maxStock;
        }, 1000);
    }

    setPanic(level) {
        this.panicLevel = level;
    }

    addShopper() {
        this.shoppers.push({
            x: 0,
            y: 200 + Math.random() * 50,
            vx: 2,
            state: 'shopping', // shopping, buying, leaving
            holding: 0,
            color: '#3498db'
        });
    }

    update() {
        this.shoppers.forEach((s, i) => {
            if (s.state === 'shopping') {
                s.x += s.vx;
                // Reached shelf?
                if (s.x > this.canvas.width - 100) {
                    s.state = 'buying';
                }
            } else if (s.state === 'buying') {
                // Decide how much to buy
                // Panic logic: If stock looks low OR panic level is high
                let want = 1;
                
                if (this.panicLevel > 0.5 || this.stock < 30) {
                    want = 10; // Hoarding
                    s.color = '#e74c3c'; // Red for panic
                }
                
                // Attempt to buy
                if (this.stock >= want) {
                    this.stock -= want;
                    s.holding = want;
                } else {
                    s.holding = this.stock;
                    this.stock = 0;
                }
                
                s.state = 'leaving';
            } else if (s.state === 'leaving') {
                s.x -= s.vx;
                if (s.x < -20) {
                    this.shoppers.splice(i, 1);
                }
            }
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw Shelf
        this.ctx.fillStyle = '#95a5a6';
        this.ctx.fillRect(this.canvas.width - 80, 100, 60, 150);
        
        // Draw Stock (Toilet Paper Rolls)
        this.ctx.fillStyle = 'white';
        this.ctx.strokeStyle = '#bdc3c7';
        const rows = 10;
        const perRow = 10;
        
        for(let i=0; i<this.stock; i++) {
            const r = Math.floor(i / perRow);
            const c = i % perRow;
            const x = this.canvas.width - 75 + (c * 5);
            const y = 240 - (r * 12);
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, 4, 0, Math.PI*2);
            this.ctx.fill();
            this.ctx.stroke();
        }
        
        // Draw Shoppers
        this.shoppers.forEach(s => {
            this.ctx.fillStyle = s.color;
            this.ctx.beginPath();
            this.ctx.arc(s.x, s.y, 10, 0, Math.PI*2);
            this.ctx.fill();
            
            // Draw Bag
            if (s.holding > 0) {
                this.ctx.fillStyle = 'white';
                this.ctx.font = '10px Arial';
                this.ctx.fillText(s.holding, s.x - 3, s.y + 4);
            }
        });
        
        // Labels
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.font = 'bold 20px Inter';
        this.ctx.fillText(`Stock: ${this.stock}`, this.canvas.width - 100, 80);
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(this.animate);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const sim = new SocialSim('socialCanvas');
    
    const panicBtn = document.getElementById('panicBtn');
    if(panicBtn) {
        panicBtn.addEventListener('mousedown', () => {
            sim.setPanic(1.0);
            panicBtn.textContent = "CALM DOWN!";
            panicBtn.style.background = "#e74c3c";
        });
        
        panicBtn.addEventListener('mouseup', () => {
            sim.setPanic(0);
            panicBtn.textContent = "Trigger Panic Rumor";
            panicBtn.style.background = "#f39c12";
        });
    }
});
