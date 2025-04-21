document.addEventListener('DOMContentLoaded', function() {
    // Minimal Preloader
    const preloader = document.querySelector('.preloader');
    setTimeout(() => {
        preloader.classList.add('loaded');
        document.body.classList.add('loaded');
    }, 1500);

    // Sophisticated Neural Network Animation
    const canvas = document.getElementById('neuralNetwork');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Neural Network Configuration
    const config = {
        neuronCount: Math.min(50, Math.floor(canvas.width * canvas.height / 20000)),
        maxConnections: 5,
        connectionDistance: 250,
        pulseSpeed: 0.02,
        repulsionRadius: 80,
        attractionForce: 0.01,
        repulsionForce: 0.05
    };

    // Neuron Class
    class Neuron {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.baseSize = this.size;
            this.opacity = 0;
            this.targetOpacity = Math.random() * 0.3 + 0.1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.connections = [];
            this.pulsePhase = Math.random() * Math.PI * 2;
            this.pulseSpeed = Math.random() * 0.02 + 0.01;
        }

        update(neurons) {
            // Apply organic movement
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Boundary behavior with gentle push
            if (this.x < 0) this.speedX = Math.abs(this.speedX) * 0.5;
            if (this.x > canvas.width) this.speedX = -Math.abs(this.speedX) * 0.5;
            if (this.y < 0) this.speedY = Math.abs(this.speedY) * 0.5;
            if (this.y > canvas.height) this.speedY = -Math.abs(this.speedY) * 0.5;
            
            // Neuron interaction forces
            neurons.forEach(neuron => {
                if (neuron !== this) {
                    const dx = neuron.x - this.x;
                    const dy = neuron.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    // Repulsion when too close
                    if (distance < config.repulsionRadius) {
                        const force = config.repulsionForce * (1 - distance / config.repulsionRadius);
                        this.speedX -= (dx / distance) * force;
                        this.speedY -= (dy / distance) * force;
                    }
                }
            });
            
            // Pulse animation
            this.pulsePhase += this.pulseSpeed;
            this.size = this.baseSize * (1 + Math.sin(this.pulsePhase) * 0.2);
            
            // Smooth fade in
            this.opacity += (this.targetOpacity - this.opacity) * 0.02;
        }

        draw() {
            // Neuron glow
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
            const glowGradient = ctx.createRadialGradient(
                this.x, this.y, this.size * 0.5,
                this.x, this.y, this.size * 4
            );
            glowGradient.addColorStop(0, `rgba(100, 150, 255, ${this.opacity * 0.3})`);
            glowGradient.addColorStop(1, 'rgba(100, 150, 255, 0)');
            ctx.fillStyle = glowGradient;
            ctx.fill();
            
            // Neuron core
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Connection Class
    class Connection {
        constructor(source, target) {
            this.source = source;
            this.target = target;
            this.opacity = 0;
            this.active = false;
            this.pulsePhase = Math.random() * Math.PI * 2;
        }

        update() {
            const dx = this.source.x - this.target.x;
            const dy = this.source.y - this.target.y;
            this.distance = Math.sqrt(dx * dx + dy * dy);
            
            // Determine if connection should be active
            const shouldBeActive = this.distance < config.connectionDistance && 
                                 this.source.opacity > 0.05 && 
                                 this.target.opacity > 0.05;
            
            // Smooth transition
            this.opacity += ((shouldBeActive ? 1 : 0) - this.opacity) * 0.05;
            this.active = this.opacity > 0.02;
            
            // Pulse animation
            this.pulsePhase += config.pulseSpeed;
        }

        draw() {
            if (this.active) {
                // Calculate pulse effect
                const pulse = (Math.sin(this.pulsePhase) + 1) * 0.5;
                const lineOpacity = this.opacity * (0.2 + pulse * 0.1) * (1 - this.distance / (config.connectionDistance * 1.5));
                
                if (lineOpacity > 0.01) {
                    // Create gradient for connection
                    const gradient = ctx.createLinearGradient(
                        this.source.x, this.source.y,
                        this.target.x, this.target.y
                    );
                    gradient.addColorStop(0, `rgba(100, 180, 255, ${lineOpacity * 0.8})`);
                    gradient.addColorStop(0.5, `rgba(150, 200, 255, ${lineOpacity})`);
                    gradient.addColorStop(1, `rgba(100, 180, 255, ${lineOpacity * 0.8})`);
                    
                    // Draw connection line
                    ctx.beginPath();
                    ctx.moveTo(this.source.x, this.source.y);
                    ctx.lineTo(this.target.x, this.target.y);
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 0.5 + pulse * 0.5;
                    ctx.lineCap = 'round';
                    ctx.stroke();
                    
                    // Draw connection endpoints
                    if (pulse > 0.9) {
                        ctx.beginPath();
                        ctx.arc(this.source.x, this.source.y, 1 + pulse * 1.5, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(150, 200, 255, ${lineOpacity * 0.8})`;
                        ctx.fill();
                        
                        ctx.beginPath();
                        ctx.arc(this.target.x, this.target.y, 1 + pulse * 1.5, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(150, 200, 255, ${lineOpacity * 0.8})`;
                        ctx.fill();
                    }
                }
            }
        }
    }

    // Create network
    const neurons = Array.from({ length: config.neuronCount }, () => new Neuron());
    const connections = [];

    // Create connections (each neuron connects to a few nearest neighbors)
    neurons.forEach((neuron, i) => {
        // Find nearest neurons
        const neighbors = neurons
            .map((other, j) => ({ index: j, distance: Math.hypot(neuron.x - other.x, neuron.y - other.y) }))
            .filter(item => item.index !== i)
            .sort((a, b) => a.distance - b.distance)
            .slice(0, config.maxConnections);
        
        // Create connections to nearest neighbors
        neighbors.forEach(neighbor => {
            if (!connections.some(c => 
                (c.source === neuron && c.target === neurons[neighbor.index]) || 
                (c.source === neurons[neighbor.index] && c.target === neuron)
            )) {
                connections.push(new Connection(neuron, neurons[neighbor.index]));
            }
        });
    });

    // Animation Loop
    function animate() {
        // Clear with dark background
        ctx.fillStyle = 'hsl(231, 10%, 14%)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw connections first (behind nodes)
        connections.forEach(conn => {
            conn.update();
            conn.draw();
        });
        
        // Update and draw neurons
        neurons.forEach(neuron => {
            neuron.update(neurons);
            neuron.draw();
        });
        
        requestAnimationFrame(animate);
    }

    // Handle resize
    function handleResize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.fillStyle = 'hsl(231, 10%, 14%)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    window.addEventListener('resize', handleResize);

    // Start animation
    animate();

    // Modal Interactions
    const downloadBtn = document.getElementById('downloadBtn');
    const pdfModal = document.getElementById('pdfModal');
    const closePdfModal = document.getElementById('closePdfModal');

    if (downloadBtn) {
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            pdfModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closePdfModal) {
        closePdfModal.addEventListener('click', () => {
            pdfModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    pdfModal.addEventListener('click', (e) => {
        if (e.target === pdfModal) {
            pdfModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Scroll animations
    const animateOnScroll = () => {
        document.querySelectorAll('.gift-header, .gift-content').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                el.classList.add('animate__animated', 'animate__fadeInUp');
            }
        });
    };

    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
});