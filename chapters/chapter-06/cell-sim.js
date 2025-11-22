class CellSim {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        this.cells = [];
        this.maxCells = 100;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.init();
        this.canvas.addEventListener('click', () => this.divideAll());
        
        this.animate = this.animate.bind(this);
        this.animate();
    }

    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = 400;
        this.init(); // Reset on resize
    }

    init() {
        this.cells = [];
        // Start with one Zygote (Stem Cell)
        this.cells.push({
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            type: 'stem',
            radius: 20,
            vx: 0,
            vy: 0
        });
    }

    divideAll() {
        if(this.cells.length >= this.maxCells) return;
        
        const newCells = [];
        this.cells.forEach(cell => {
            if(cell.type === 'stem' && this.cells.length + newCells.length < this.maxCells) {
                // Divide!
                const offset = Math.random() * Math.PI * 2;
                
                // Original shrinks
                cell.radius = Math.max(8, cell.radius * 0.8);
                
                // New cell
                newCells.push({
                    x: cell.x + Math.cos(offset) * 10,
                    y: cell.y + Math.sin(offset) * 10,
                    type: 'stem',
                    radius: cell.radius,
                    vx: Math.cos(offset),
                    vy: Math.sin(offset)
                });
            }
        });
        
        this.cells = this.cells.concat(newCells);
        this.differentiate();
    }

    differentiate() {
        // Determine type based on position relative to center of mass
        let cx = 0, cy = 0;
        this.cells.forEach(c => { cx += c.x; cy += c.y; });
        cx /= this.cells.length;
        cy /= this.cells.length;
        
        const maxDist = Math.sqrt(this.cells.length) * 10; // Approximate radius
        
        this.cells.forEach(cell => {
            const dist = Math.hypot(cell.x - cx, cell.y - cy);
            
            // Simple Gradient Logic
            if (this.cells.length > 20) {
                if (dist > maxDist * 0.8) {
                    cell.type = 'skin'; // Outer layer
                } else if (dist < maxDist * 0.4) {
                    cell.type = 'bone'; // Inner core
                } else {
                    cell.type = 'muscle'; // Middle
                }
            }
        });
    }

    update() {
        // Physics: Cells push each other apart
        for (let i = 0; i < this.cells.length; i++) {
            for (let j = i + 1; j < this.cells.length; j++) {
                const c1 = this.cells[i];
                const c2 = this.cells[j];
                
                const dx = c2.x - c1.x;
                const dy = c2.y - c1.y;
                const dist = Math.hypot(dx, dy);
                const minDist = c1.radius + c2.radius;
                
                if (dist < minDist) {
                    const force = (minDist - dist) * 0.1; // Repulsion
                    const angle = Math.atan2(dy, dx);
                    
                    const fx = Math.cos(angle) * force;
                    const fy = Math.sin(angle) * force;
                    
                    c1.vx -= fx;
                    c1.vy -= fy;
                    c2.vx += fx;
                    c2.vy += fy;
                }
            }
            
            // Attraction to center (Gravity/Adhesion)
            const cx = this.canvas.width / 2;
            const cy = this.canvas.height / 2;
            const dx = cx - this.cells[i].x;
            const dy = cy - this.cells[i].y;
            
            this.cells[i].vx += dx * 0.001;
            this.cells[i].vy += dy * 0.001;
            
            // Damping
            this.cells[i].vx *= 0.9;
            this.cells[i].vy *= 0.9;
            
            // Move
            this.cells[i].x += this.cells[i].vx;
            this.cells[i].y += this.cells[i].vy;
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.cells.forEach(cell => {
            this.ctx.beginPath();
            this.ctx.arc(cell.x, cell.y, cell.radius, 0, Math.PI * 2);
            
            // Colors based on type
            if(cell.type === 'stem') this.ctx.fillStyle = '#bdc3c7'; // Gray
            if(cell.type === 'skin') this.ctx.fillStyle = '#f1c40f'; // Yellow
            if(cell.type === 'muscle') this.ctx.fillStyle = '#e74c3c'; // Red
            if(cell.type === 'bone') this.ctx.fillStyle = '#ecf0f1'; // White
            
            this.ctx.fill();
            this.ctx.strokeStyle = '#2c3e50';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        });
        
        // Legend
        this.drawLegend();
    }

    drawLegend() {
        const x = 20;
        let y = 20;
        this.ctx.font = "14px Inter";
        this.ctx.fillStyle = "#2c3e50";
        
        const types = [
            {label: "Stem Cell (Undecided)", color: "#bdc3c7"},
            {label: "Skin (Protection)", color: "#f1c40f"},
            {label: "Muscle (Movement)", color: "#e74c3c"},
            {label: "Bone (Structure)", color: "#ecf0f1"}
        ];
        
        types.forEach(t => {
            this.ctx.beginPath();
            this.ctx.arc(x, y, 8, 0, Math.PI*2);
            this.ctx.fillStyle = t.color;
            this.ctx.fill();
            this.ctx.stroke();
            
            this.ctx.fillStyle = "#2c3e50";
            this.ctx.fillText(t.label, x + 20, y + 5);
            y += 25;
        });
        
        // Count
        this.ctx.fillText(`Cells: ${this.cells.length}`, x, y + 10);
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(this.animate);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CellSim('cellCanvas');
});
