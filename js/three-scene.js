/**
 * Three.js Scene for Futuristic Space Travel Website
 * Creates a 3D rotating planet with starry background
 * 
 * Features:
 * - Responsive 3D planet with texture
 * - Dynamic starfield background
 * - Smooth rotation animation
 * - Performance optimized for web
 * - Easy to replace with custom .glb models
 */

class SpaceScene {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.planet = null;
        this.stars = null;
        this.animationId = null;
        this.mouse = { x: 0, y: 0 };
        this.targetRotation = { x: 0, y: 0 };
        
        // Configuration
        this.config = {
            planet: {
                radius: 2,
                segments: 64,
                rotationSpeed: 0.01,
                tiltAngle: 0.2
            },
            camera: {
                fov: 75,
                near: 0.1,
                far: 1000,
                position: { x: 0, y: 0, z: 5 }
            },
            stars: {
                count: 2000,
                spread: 200
            },
            mouse: {
                sensitivity: 0.0003,
                damping: 0.05
            }
        };
        
        this.init();
    }
    
    init() {
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createLighting();
        this.createPlanet();
        this.createStarfield();
        this.setupEventListeners();
        this.animate();
        
        console.log('🚀 Space scene initialized successfully!');
    }
    
    createScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0B1426); // Cosmic blue background
    }
    
    createCamera() {
        const container = document.getElementById('three-container');
        const aspect = container.clientWidth / container.clientHeight;
        
        this.camera = new THREE.PerspectiveCamera(
            this.config.camera.fov,
            aspect,
            this.config.camera.near,
            this.config.camera.far
        );
        
        this.camera.position.set(
            this.config.camera.position.x,
            this.config.camera.position.y,
            this.config.camera.position.z
        );
    }
    
    createRenderer() {
        const container = document.getElementById('three-container');
        
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        container.appendChild(this.renderer.domElement);
    }
    
    createLighting() {
        // Ambient light for overall illumination
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        // Main directional light (sun-like)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        
        // Colored rim light for dramatic effect
        const rimLight = new THREE.DirectionalLight(0x00FFFF, 0.5);
        rimLight.position.set(-5, 2, -5);
        this.scene.add(rimLight);
        
        // Point light for additional glow
        const pointLight = new THREE.PointLight(0xFF006E, 0.8, 10);
        pointLight.position.set(0, 0, 3);
        this.scene.add(pointLight);
    }
    
    createPlanet() {
        // Create planet geometry
        const geometry = new THREE.SphereGeometry(
            this.config.planet.radius,
            this.config.planet.segments,
            this.config.planet.segments
        );
        
        // Load planet texture (fallback to procedural if texture fails)
        const textureLoader = new THREE.TextureLoader();
        
        // Create material with fallback
        const material = this.createPlanetMaterial();
        
        // Create planet mesh
        this.planet = new THREE.Mesh(geometry, material);
        this.planet.castShadow = true;
        this.planet.receiveShadow = true;
        
        // Add initial rotation
        this.planet.rotation.x = this.config.planet.tiltAngle;
        
        // Create planet group for easier manipulation
        this.planetGroup = new THREE.Group();
        this.planetGroup.add(this.planet);
        this.scene.add(this.planetGroup);
        
        // Load texture asynchronously
        this.loadPlanetTexture(textureLoader, material);
        
        console.log('🪐 Planet created successfully!');
    }
    
    createPlanetMaterial() {
        // Create a procedural planet material as fallback
        const material = new THREE.MeshPhongMaterial({
            color: 0x4A90E2,
            shininess: 30,
            transparent: true,
            opacity: 0.9
        });
        
        // Add some visual interest with a simple noise pattern
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const context = canvas.getContext('2d');
        
        // Create a simple gradient texture
        const gradient = context.createLinearGradient(0, 0, 0, 256);
        gradient.addColorStop(0, '#1E3A8A');
        gradient.addColorStop(0.3, '#3B82F6');
        gradient.addColorStop(0.6, '#60A5FA');
        gradient.addColorStop(1, '#93C5FD');
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, 512, 256);
        
        // Add some noise for texture
        for (let i = 0; i < 1000; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 256;
            const size = Math.random() * 3;
            context.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
            context.beginPath();
            context.arc(x, y, size, 0, Math.PI * 2);
            context.fill();
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        material.map = texture;
        
        return material;
    }
    
    loadPlanetTexture(textureLoader, material) {
        // Try to load the planet texture from Unsplash
        textureLoader.load(
            'https://images.unsplash.com/photo-1580428180121-22d88b1e6e03',
            (texture) => {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                material.map = texture;
                material.needsUpdate = true;
                console.log('🌍 Planet texture loaded successfully!');
            },
            (progress) => {
                console.log('Loading planet texture...', (progress.loaded / progress.total * 100) + '%');
            },
            (error) => {
                console.log('⚠️ Could not load planet texture, using procedural texture:', error);
                // Fallback texture is already applied
            }
        );
    }
    
    createStarfield() {
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        
        const starColors = [
            new THREE.Color(0xFFFFFF),
            new THREE.Color(0x00FFFF),
            new THREE.Color(0xFF006E),
            new THREE.Color(0x8B5FBF)
        ];
        
        for (let i = 0; i < this.config.stars.count; i++) {
            // Random position in sphere
            const radius = this.config.stars.spread;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);
            
            positions.push(x, y, z);
            
            // Random color
            const color = starColors[Math.floor(Math.random() * starColors.length)];
            colors.push(color.r, color.g, color.b);
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });
        
        this.stars = new THREE.Points(geometry, material);
        this.scene.add(this.stars);
        
        console.log('⭐ Starfield created with', this.config.stars.count, 'stars!');
    }
    
    setupEventListeners() {
        // Mouse movement for interactive camera
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });
        
        // Window resize handling
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Touch events for mobile
        window.addEventListener('touchmove', (event) => {
            if (event.touches.length === 1) {
                const touch = event.touches[0];
                this.mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
                this.mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
            }
        });
        
        // Visibility change for performance
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
    }
    
    handleResize() {
        const container = document.getElementById('three-container');
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        if (!this.planet) return;
        
        // Planet rotation
        this.planet.rotation.y += this.config.planet.rotationSpeed;
        
        // Mouse interaction
        this.targetRotation.x = this.mouse.y * this.config.mouse.sensitivity;
        this.targetRotation.y = this.mouse.x * this.config.mouse.sensitivity;
        
        // Smooth camera movement
        this.planetGroup.rotation.x += (this.targetRotation.x - this.planetGroup.rotation.x) * this.config.mouse.damping;
        this.planetGroup.rotation.y += (this.targetRotation.y - this.planetGroup.rotation.y) * this.config.mouse.damping;
        
        // Subtle starfield rotation
        if (this.stars) {
            this.stars.rotation.y += 0.0005;
            this.stars.rotation.x += 0.0002;
        }
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
    
    pause() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    resume() {
        if (!this.animationId) {
            this.animate();
        }
    }
    
    destroy() {
        this.pause();
        
        // Clean up geometry and materials
        if (this.planet) {
            this.planet.geometry.dispose();
            this.planet.material.dispose();
        }
        
        if (this.stars) {
            this.stars.geometry.dispose();
            this.stars.material.dispose();
        }
        
        // Remove renderer
        if (this.renderer) {
            const container = document.getElementById('three-container');
            if (container && this.renderer.domElement) {
                container.removeChild(this.renderer.domElement);
            }
            this.renderer.dispose();
        }
        
        console.log('🧹 Space scene cleaned up!');
    }
    
    // Method to replace planet with custom .glb model
    // This is where users can easily swap in their Blender models
    loadCustomPlanetModel(modelPath) {
        console.log('🔄 Loading custom planet model:', modelPath);
        
        // This would require GLTFLoader
        // const loader = new THREE.GLTFLoader();
        // loader.load(modelPath, (gltf) => {
        //     // Remove existing planet
        //     this.planetGroup.remove(this.planet);
        //     
        //     // Add new model
        //     const model = gltf.scene;
        //     model.scale.setScalar(2);
        //     this.planetGroup.add(model);
        //     this.planet = model;
        //     
        //     console.log('✅ Custom planet model loaded!');
        // });
        
        console.log('💡 To use custom .glb models, uncomment the GLTFLoader code above and include THREE.GLTFLoader');
    }
}

// Initialize the space scene when the page loads
let spaceScene;

// Wait for Three.js to load, then initialize
function initSpaceScene() {
    if (typeof THREE !== 'undefined') {
        spaceScene = new SpaceScene();
    } else {
        console.log('⏳ Waiting for Three.js to load...');
        setTimeout(initSpaceScene, 100);
    }
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSpaceScene);
} else {
    initSpaceScene();
}

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (spaceScene) {
        spaceScene.destroy();
    }
});