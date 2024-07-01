<template>
  <canvas id="starfield" ref="starfield"></canvas>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue';
  import { useStore } from '@/store';

  const store = useStore();
  const starfield = ref<HTMLCanvasElement | null>(null);

  const createStar = (
    canvasWidth: number,
    canvasHeight: number,
    speedFactor: number,
    isGiant: boolean,
    context: CanvasRenderingContext2D,
    colorGiant: string,
    colorStar: string,
    colorComet: string
  ) => {
    const random = (min: number, max: number) => Math.random() * (max - min) + min;
    const chance = (percentage: number) => Math.random() * 100 < percentage;

    return {
      x: random(0, canvasWidth),
      y: random(0, canvasHeight),
      radius: random(1.1, 2.6),
      dx:
        random(speedFactor, 6 * speedFactor) +
        (chance(10) ? 1 : 0) * speedFactor * random(50, 120) +
        2 * speedFactor,
      dy:
        -random(speedFactor, 6 * speedFactor) -
        (chance(10) ? 1 : 0) * speedFactor * random(50, 120),
      opacity: 0,
      opacityThreshold: random(0.2, 1 - 0.4 * (chance(10) ? 1 : 0)),
      opacityIncrement: random(0.0005, 0.002) + 0.001 * (chance(10) ? 1 : 0),
      fadingIn: true,
      fadingOut: false,
      giant: chance(3),
      comet: !chance(3) && !isGiant && chance(10),
      reset() {
        this.x = random(0, canvasWidth - 10);
        this.y = random(0, canvasHeight);
        this.opacity = 0;
        this.fadingIn = true;
        this.fadingOut = false;
      },
      fadeIn() {
        if (this.fadingIn) {
          this.fadingIn = !(this.opacity > this.opacityThreshold);
          this.opacity += this.opacityIncrement;
        }
      },
      fadeOut() {
        if (this.fadingOut) {
          this.fadingOut = !(this.opacity < 0);
          this.opacity -= this.opacityIncrement / 2;
          if (this.x > canvasWidth || this.y < 0) {
            this.fadingOut = false;
            this.reset();
          }
        }
      },
      draw() {
        context.beginPath();
        if (this.giant) {
          context.fillStyle = `rgba(${colorGiant},${this.opacity})`;
          context.arc(this.x, this.y, 2, 0, 2 * Math.PI, false);
        } else if (this.comet && store.isDark) {
          context.fillStyle = `rgba(${colorComet},${this.opacity})`;
          context.arc(this.x, this.y, 1.5, 0, 2 * Math.PI, false);
          for (let t = 0; t < 30; t++) {
            context.fillStyle = `rgba(${colorComet},${this.opacity - (this.opacity / 20) * t})`;
            context.rect(this.x - (this.dx / 4) * t, this.y - (this.dy / 4) * t - 2, 2, 2);
            context.fill();
          }
        } else {
          context.fillStyle = `rgba(${colorStar},${this.opacity})`;
          context.rect(this.x, this.y, this.radius, this.radius);
        }
        context.closePath();
        context.fill();
      },
      move() {
        this.x += this.dx;
        this.y += this.dy;
        if (!this.fadingOut) this.reset();
        if (this.x > canvasWidth - canvasWidth / 4 || this.y < 0) this.fadingOut = true;
      },
    };
  };

  const initStarfield = () => {
    const canvas = starfield.value;
    if (!canvas) return;

    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    const speedFactor = 0.05;
    const numberOfStars = Math.floor(0.216 * canvasWidth);
    const context = canvas.getContext('2d')!;
    const colorGiant = '180,184,240';
    const colorStar = '226,225,142';
    const colorComet = '226,225,224';
    const stars = Array.from({ length: numberOfStars }, () =>
      createStar(
        canvasWidth,
        canvasHeight,
        speedFactor,
        true,
        context,
        colorGiant,
        colorStar,
        colorComet
      )
    );

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const animate = () => {
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      stars.forEach((star) => {
        star.move();
        star.fadeIn();
        star.fadeOut();
        star.draw();
      });
      requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, false);
    animate();
    onUnmounted(() => {
      window.removeEventListener('resize', resizeCanvas, false);
    });
  };

  onMounted(initStarfield);
</script>

<style lang="less">
  #starfield {
    display: block;
    position: fixed;
    box-sizing: border-box;
    padding: 40px 0 0;
    border: 0;
    outline: 0;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 99;
  }
</style>
