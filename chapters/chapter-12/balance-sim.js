class SystemBalancer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        this.nodes = [
            {name: "Economy", x: 150, y: 250, val: 50, color: "#3498db", target: 50},
            {name: "Nature", x: 400, y: 150, val: 50, color: "#2ecc71", target: 50},
            {name: "Society", x: 650, y: 250, val: 50, color: "#e67e22", target: 50}
        ];
        
        this.dragging = null;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.canvas.addEventListener('mousedown', (e) => this.handleDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMove(e));
        window.addEventListener('mouseup', () => this.handleUp());
        
        this.animate = this.animate.bind(this);
        this.animate();
    }

    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = 400;
        
        // Recenter
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;
        
        this.nodes[0].x = cx - 200; this.nodes[0].y = cy + 50;
        this.nodes[1].x = cx;       this.nodes[1].y = cy - 100;
        this.nodes[2].x = cx + 200; this.nodes[2].y = cy + 50;
    }

    handleDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        
        this.nodes.forEach(n => {
            const dist = Math.hypot(mx - n.x, my - (400 - n.val * 3)); // Mapping value to Y height
            if(dist < 30) {
                this.dragging = n;
            }
        });
    }

    handleMove(e) {
        if(this.dragging) {
            const rect = this.canvas.getBoundingClientRect();
            const my = e.clientY - rect.top;
            
            // Convert Y back to Value (0-100)
            // y = 400 - val*3  => val = (400-y)/3
            let newVal = (400 - my) / 3;
            newVal = Math.max(0, Math.min(100, newVal));
            
            this.dragging.val = newVal;
            
            // COUPLING LOGIC (The "System" part)
            // If Economy goes UP, Nature goes DOWN
            if (this.dragging.name === "Economy") {
                this.nodes[1].val += (50 - newVal) * 0.1; // Inverse
                this.nodes[2].val += (newVal - 50) * 0.05; // Slight positive
            }
            
            // If Nature goes UP, Economy goes DOWN slightly, Society goes UP
            if (this.dragging.name === "Nature") {
                this.nodes[0].val -= (newVal - 50) * 0.05;
                this.nodes[2].val += (newVal - 50) * 0.1;
            }
        }
    }

    handleUp() {
        this.dragging = null;
    }

    update() {
        // Natural restoring force (rubber band back to 50?)
        // Or maybe just clamp
        this.nodes.forEach(n => {
            n.val = Math.max(0, Math.min(100, n.val));
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw Connections (Springs)
        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = "#bdc3c7";
        this.ctx.setLineDash([10, 10]);
        
        this.ctx.beginPath();
        // Connect all nodes
        const p0 = {x: this.nodes[0].x, y: 400 - this.nodes[0].val*3};
        const p1 = {x: this.nodes[1].x, y: 400 - this.nodes[1].val*3};
        const p2 = {x: this.nodes[2].x, y: 400 - this.nodes[2].val*3};
        
        this.ctx.moveTo(p0.x, p0.y);
        this.ctx.lineTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.lineTo(p0.x, p0.y);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // Draw Nodes
        this.nodes.forEach(n => {
            const y = 400 - n.val * 3;
            
            // Shadow
            this.ctx.fillStyle = "rgba(0,0,0,0.1)";
            this.ctx.beginPath();
            this.ctx.ellipse(n.x, 380, 40, 10, 0, 0, Math.PI*2);
            this.ctx.fill();
            
            // Line
            this.ctx.strokeStyle = n.color;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(n.x, 380);
            this.ctx.lineTo(n.x, y);
            this.ctx.stroke();
            
            // Knob
            this.ctx.fillStyle = n.color;
            this.ctx.beginPath();
            this.ctx.arc(n.x, y, 25, 0, Math.PI*2);
            this.ctx.fill();
            
            // Glow
            this.ctx.shadowColor = n.color;
            this.ctx.shadowBlur = 20;
            this.ctx.stroke();
            this.ctx.shadowBlur = 0;
            
            // Text
            this.ctx.fillStyle = "white";
            this.ctx.font = "bold 16px Inter";
            this.ctx.textAlign = "center";
            this.ctx.fillText(Math.floor(n.val), n.x, y + 6);
            
            // Label
            this.ctx.fillStyle = "#2c3e50";
            this.ctx.font = "bold 18px Inter";
            this.ctx.fillText(n.name, n.x, 395);
        });
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(this.animate);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SystemBalancer('balanceCanvas');
});
