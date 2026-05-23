function toggleTheme() {
  document.body.classList.toggle("dark-mode");
}

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = {
    x: null,
    y: null,
    radius: 120
};

window.addEventListener("mousemove", (e)=>{
    mouse.x = e.x;
    mouse.y = e.y;
});

window.addEventListener("resize", ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

class Particle{
    constructor(x,y,size,speedX,speedY){
        this.x = x;
        this.y = y;
        this.size = size;
        this.speedX = speedX;
        this.speedY = speedY;
    }

    update(){
        this.x += this.speedX;
        this.y += this.speedY;

        // Rebater nas bordas
        if(this.x > canvas.width || this.x < 0){
            this.speedX *= -1;
        }

        if(this.y > canvas.height || this.y < 0){
            this.speedY *= -1;
        }

        // Interação com mouse
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);

        if(distance < mouse.radius){
            this.x -= dx * 0.02;
            this.y -= dy * 0.02;
        }
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
        ctx.fillStyle = "white";

        ctx.shadowBlur = 15;
        ctx.shadowColor = "white";

        ctx.fill();
    }
}

let particlesArray = [];

function init(){
    particlesArray = [];

    for(let i=0;i<120;i++){
        let size = Math.random()*2 + 1;
        let x = Math.random()*canvas.width;
        let y = Math.random()*canvas.height;
        let speedX = (Math.random()-0.5)*1;
        let speedY = (Math.random()-0.5)*1;

        particlesArray.push(
            new Particle(x,y,size,speedX,speedY)
        );
    }
}

function connectParticles(){
    for(let a=0;a<particlesArray.length;a++){
        for(let b=a;b<particlesArray.length;b++){

            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;

            let distance = dx*dx + dy*dy;

            if(distance < 10000){

                ctx.strokeStyle = "rgba(255,255,255,0.15)";
                ctx.lineWidth = 1;

                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    particlesArray.forEach(particle=>{
        particle.update();
        particle.draw();
    });

    connectParticles();

    requestAnimationFrame(animate);
}

init();
animate();