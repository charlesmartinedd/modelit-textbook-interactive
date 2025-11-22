class SupplyChainMap {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        this.locations = [
            {name: "Chile", x: 200, y: 250, part: "Battery (Lithium)"},
            {name: "Congo", x: 420, y: 200, part: "Capacitors (Cobalt)"},
            {name: "Taiwan", x: 650, y: 140, part: "Processor (Silicon)"},
            {name: "Japan", x: 700, y: 120, part: "Screen (Glass)"},
            {name: "California", x: 120, y: 130, part: "Design (Software)"},
            {name: "China", x: 600, y: 130, part: "Assembly"}
        ];
        
        this.phoneX = 400;
        this.phoneY = 350;
        
        this.activeLoc = null;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.canvas.addEventListener('mousemove', (e) => this.handleHover(e));
        
        this.draw = this.draw.bind(this);
        this.animate = this.animate.bind(this);
        this.animate();
    }

    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = 400;
        
        // Scale coords roughly to canvas size
        const scaleX = this.canvas.width / 800;
        this.phoneX = this.canvas.width / 2;
    }

    handleHover(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        
        this.activeLoc = null;
        
        // Check locations
        // We need to scale the static coords to the current canvas
        const sx = this.canvas.width / 800;
        const sy = this.canvas.height / 400;
        
        this.locations.forEach(loc => {
            const x = loc.x * sx;
            const y = loc.y * sy;
            const dist = Math.hypot(mx - x, my - y);
            
            if(dist < 20) {
                this.activeLoc = loc;
            }
        });
        
        // Check Phone
        if(Math.hypot(mx - this.phoneX, my - this.phoneY) < 40) {
             // Maybe show all?
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const sx = this.canvas.width / 800;
        const sy = this.canvas.height / 400;
        
        // Draw World Map Background (Abstract)
        this.ctx.fillStyle = '#ecf0f1';
        // Just some blobs for continents
        // Americas
        this.ctx.beginPath();
        this.ctx.ellipse(150*sx, 150*sy, 80*sx, 120*sy, 0, 0, Math.PI*2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.ellipse(200*sx, 300*sy, 60*sx, 100*sy, 0, 0, Math.PI*2);
        this.ctx.fill();
        // Africa
        this.ctx.beginPath();
        this.ctx.ellipse(420*sx, 200*sy, 80*sx, 90*sy, 0, 0, Math.PI*2);
        this.ctx.fill();
        // Eurasia
        this.ctx.beginPath();
        this.ctx.ellipse(550*sx, 120*sy, 150*sx, 80*sy, 0, 0, Math.PI*2);
        this.ctx.fill();

        // Draw Connections
        this.locations.forEach(loc => {
            const x = loc.x * sx;
            const y = loc.y * sy;
            
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            
            // Curve to phone
            this.ctx.quadraticCurveTo(x, this.phoneY, this.phoneX, this.phoneY);
            
            if (this.activeLoc === loc) {
                this.ctx.strokeStyle = '#e74c3c';
                this.ctx.lineWidth = 4;
            } else {
                this.ctx.strokeStyle = '#bdc3c7';
                this.ctx.lineWidth = 1;
            }
            this.ctx.stroke();
            
            // Draw Dot
            this.ctx.fillStyle = this.activeLoc === loc ? '#e74c3c' : '#3498db';
            this.ctx.beginPath();
            this.ctx.arc(x, y, 6, 0, Math.PI*2);
            this.ctx.fill();
        });

        // Draw Phone
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.roundRect(this.phoneX - 20, this.phoneY - 30, 40, 70, 5);
        this.ctx.fill();
        this.ctx.fillStyle = '#34495e';
        this.ctx.fillRect(this.phoneX - 18, this.phoneY - 28, 36, 60);
        
        // Draw Tooltip
        if (this.activeLoc) {
            this.ctx.fillStyle = 'rgba(0,0,0,0.8)';
            this.ctx.roundRect(this.canvas.width/2 - 100, 20, 200, 60, 10);
            this.ctx.fill();
            
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 16px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(this.activeLoc.name, this.canvas.width/2, 50);
            this.ctx.font = '14px Inter';
            this.ctx.fillStyle = '#f1c40f';
            this.ctx.fillText(this.activeLoc.part, this.canvas.width/2, 70);
        } else {
            this.ctx.fillStyle = '#7f8c8d';
            this.ctx.font = '14px Inter';
            this.ctx.textAlign = 'center';
            this.ctx.fillText("Hover over the dots to see components", this.canvas.width/2, 30);
        }
    }

    animate() {
        this.draw();
        requestAnimationFrame(this.animate);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SupplyChainMap('techCanvas');
});
