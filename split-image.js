const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = [];

const mouse = {
  x: null,
  y: null,
  radius: 100,
}

window.addEventListener('mousemove', (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
})

function drawImage() {
  let imageWidth = png.width;
  let imageHeight = png.height;
  const data = ctx.getImageData(0, 0, imageWidth, imageHeight );
  ctx.clearRect(0, 0, canvas.width, canvas.height );

 
  class Particle {
    constructor(x, y, color, size) {
      this.x = x + canvas.width/2 - png.width*2 ;
      this.y = y + canvas.height/2 - png.height*2 ;
      this.color = color;
      this.size = 2;
      this.baseX = x + canvas.width/2 - png.width*2;
      this.baseY = y + canvas.height/2 - png.height*2;
      this.density = Math.random() * 10 + 2;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
      ctx.closePath();
      ctx.fill();
    }
    update() {
      ctx.fillStyle  = this.color;
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx*dx + dy*dy);
      let forceDirectionX = dx/distance;
      let forceDirectionY = dy/distance;

      const maxDistance = 100;
      let force = (maxDistance - distance)/maxDistance;
      if( force < 0 ) force = 0;
      let directionX = (forceDirectionX * force * this.density * 0.6);
      let directionY = (forceDirectionY * force * this.density * 0.6);

      if( distance < mouse.radius + this.size) {
        this.x -= directionX;
        this.y -= directionY;
      }
      else {
        if( this.x !== this.baseX) {
          let dx = this.x - this.baseX;
          this.x -= dx/20;
        }
        if( this.y !== this.baseY) {
          let dy = this.y - this.baseY;
          this.y -= dy/20;
        }
      }
      this.draw()
    }
  }
  function init() {
    particleArray = [];
    for( let y=0, y2 = data.height; y<y2; y++) {
      for( let x=0, x2 = data.width; x<x2; x++) {
        if( data.data[(y*4*data.width)+(x*4)+3]>128) {
          let positionX = x;
          let positionY = y;
          let color = 'rgb(' + data.data[(y*4*data.width)+(x*4)] + ','
                              + data.data[(y*4*data.width)+(x*4)+1] + ','
                                + data.data[(y*4*data.width)+(x*4)+2] +')';
          particleArray.push( new Particle(positionX*4, positionY*4, color))
        }
      }
    }
  }
  function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(0,0,innerWidth, innerHeight);
    for(let i = 0; i < particleArray.length; i++) {
      particleArray[i].update();
    }
  }
  init();
  animate();
  
  window.addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    innerWidth();
  })
}
const png = new Image();
png.src = 'data:image/png;base64,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'
window.addEventListener('load', (e)=>{
  ctx.drawImage(png, 0, 0);
  drawImage();
})