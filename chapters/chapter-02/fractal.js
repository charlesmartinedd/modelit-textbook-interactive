class FractalTree {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Configuration
        this.startLength = 120;
        this.angle = Math.PI / 4;
        this.branchWidth = 10;
        this.depth = 10;
        this.colorStart = '#4a3b2a'; // Trunk color
        this.colorEnd = '#2ecc71';   // Leaf color
        
        // Animation state
        this.targetAngle = Math.PI / 4;
        this.currentAngle = Math.PI / 4;
        this.isAnimating = true;
        
        // Resize handling
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Bind methods
        this.animate = this.animate.bind(this);
        this.draw = this.draw.bind(this);
    }

    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = 500;
        this.draw();
    }

    init() {
        this.animate();
    }

    setAngle(angleInDegrees) {
        this.targetAngle = (angleInDegrees * Math.PI) / 180;
    }

    drawTree(startX, startY, length, angle, branchWidth, depth) {
        this.ctx.beginPath();
        this.ctx.save();
        this.ctx.translate(startX, startY);
        this.ctx.rotate(angle);
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(0, -length);
        
        // Color blending based on depth
        // Simple lerp logic could go here, but for now we switch at a threshold
        if (depth < 3) {
            this.ctx.strokeStyle = this.colorEnd;
        } else {
            this.ctx.strokeStyle = this.colorStart;
        }
        
        this.ctx.lineWidth = branchWidth;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();

        if (depth > 0) {
            // Recursion happen here
            // We scale down the length and width for the next branch
            this.drawTree(0, -length, length * 0.75, this.currentAngle, branchWidth * 0.7, depth - 1);
            this.drawTree(0, -length, length * 0.75, -this.currentAngle, branchWidth * 0.7, depth - 1);
        }
        
        this.ctx.restore();
    }

    update() {
        // Smooth interpolation
        const diff = this.targetAngle - this.currentAngle;
        if (Math.abs(diff) > 0.001) {
            this.currentAngle += diff * 0.1;
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const startX = this.canvas.width / 2;
        const startY = this.canvas.height;
        
        this.drawTree(startX, startY, this.startLength, 0, this.branchWidth, this.depth);
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(this.animate);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const tree = new FractalTree('fractalCanvas');
    tree.init();
    
    // Connect Controls
    const slider = document.getElementById('angleSlider');
    if(slider) {
        slider.addEventListener('input', (e) => {
            tree.setAngle(parseFloat(e.target.value));
            const label = document.getElementById('angleValue');
            if(label) label.textContent = `${e.target.value}°`;
        });
    }
});
