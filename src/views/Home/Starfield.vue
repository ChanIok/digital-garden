<template>
  <canvas ref="universeCanvas"></canvas>
</template>

<script setup lang="ts">
  import { onMounted, ref, onUnmounted } from 'vue';
  import { useStore } from '@/store';

  const store = useStore();
  const universeCanvas = ref<HTMLCanvasElement | null>(null);

  // Constants
  const STAR_COUNT = 0.216;
  const STAR_SPEED = 0.05;
  const GIANT_STAR_CHANCE = 3;
  const COMET_CHANCE = 10;
  const GIANT_STAR_COLOR = '180,184,240';
  const NORMAL_STAR_COLOR = '226,225,142';
  const COMET_COLOR = '226,225,224';

  // Types
  interface Star {
    x: number;
    y: number;
    r: number;
    dx: number;
    dy: number;
    opacity: number;
    opacityTresh: number;
    do: number;
    giant: boolean;
    comet: boolean;
    fadingOut: boolean;
    fadingIn: boolean;
  }

  // Star class
  class StarClass implements Star {
    x: number;
    y: number;
    r: number;
    dx: number;
    dy: number;
    opacity: number;
    opacityTresh: number;
    do: number;
    giant: boolean;
    comet: boolean;
    fadingOut: boolean;
    fadingIn: boolean;

    constructor(canvasWidth: number, canvasHeight: number, isEarlyStage: boolean) {
      this.reset(canvasWidth, canvasHeight, isEarlyStage);
    }

    reset(canvasWidth: number, canvasHeight: number, isEarlyStage: boolean): void {
      this.giant = Math.random() < GIANT_STAR_CHANCE / 100;
      this.comet = !this.giant && !isEarlyStage && Math.random() < COMET_CHANCE / 100;
      this.x = Math.random() * canvasWidth;
      this.y = Math.random() * canvasHeight;
      this.r = Math.random() * 1.5 + 1.1;
      this.dx = (Math.random() * 5 + 1) * STAR_SPEED * (this.comet ? Math.random() * 70 + 50 : 1);
      this.dy = -this.dx;
      this.fadingOut = false;
      this.fadingIn = true;
      this.opacity = 0;
      this.opacityTresh = Math.random() * 0.8 + 0.2 - (this.comet ? 0.4 : 0);
      this.do = Math.random() * 0.0015 + 0.0005 + (this.comet ? 0.001 : 0);
    }

    fadeIn(): void {
      if (this.fadingIn) {
        this.fadingIn = this.opacity < this.opacityTresh;
        this.opacity += this.do;
      }
    }

    fadeOut(): void {
      if (this.fadingOut) {
        this.fadingOut = this.opacity > 0;
        this.opacity -= this.do / 2;
        if (this.x > window.innerWidth || this.y < 0) {
          this.fadingOut = false;
          this.reset(window.innerWidth, window.innerHeight, false);
        }
      }
    }

    draw(ctx: CanvasRenderingContext2D, isDark: boolean): void {
      ctx.beginPath();
      if (this.giant) {
        ctx.fillStyle = `rgba(${GIANT_STAR_COLOR},${this.opacity})`;
        ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI, false);
      } else if (this.comet && isDark) {
        ctx.fillStyle = `rgba(${COMET_COLOR},${this.opacity})`;
        ctx.arc(this.x, this.y, 1.5, 0, 2 * Math.PI, false);
        for (let i = 0; i < 30; i++) {
          ctx.fillStyle = `rgba(${COMET_COLOR},${this.opacity - (this.opacity / 20) * i})`;
          ctx.rect(this.x - (this.dx / 4) * i, this.y - (this.dy / 4) * i - 2, 2, 2);
          ctx.fill();
        }
      } else {
        ctx.fillStyle = `rgba(${NORMAL_STAR_COLOR},${this.opacity})`;
        ctx.rect(this.x, this.y, this.r, this.r);
      }
      ctx.closePath();
      ctx.fill();
    }

    move(canvasWidth: number): void {
      this.x += this.dx;
      this.y += this.dy;
      if (!this.fadingOut && (this.x > canvasWidth - canvasWidth / 4 || this.y < 0)) {
        this.fadingOut = true;
      }
    }
  }

  // Main function
  const initStarryNight = () => {
    if (!universeCanvas.value) return;

    const ctx = universeCanvas.value.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let stars: StarClass[] = [];
    let isEarlyStage = true;

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      if (universeCanvas.value) {
        universeCanvas.value.width = width;
        universeCanvas.value.height = height;
      }
      stars = [];
      initStars();
    };

    const initStars = () => {
      const starCount = Math.floor(width * STAR_COUNT);
      for (let i = 0; i < starCount; i++) {
        stars.push(new StarClass(width, height, isEarlyStage));
      }
    };

    const drawStars = () => {
      ctx.clearRect(0, 0, width, height);
      stars.forEach((star) => {
        star.move(width);
        star.fadeIn();
        star.fadeOut();
        star.draw(ctx, store.isDark);
      });
    };

    const animate = () => {
      drawStars();
      requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener('resize', resizeCanvas);

    setTimeout(() => {
      isEarlyStage = false;
    }, 50);

    onUnmounted(() => {
      window.removeEventListener('resize', resizeCanvas);
    });
  };

  onMounted(() => {
    initStarryNight();
  });
</script>

<style scoped>
  canvas {
    display: block;
    position: fixed;
    box-sizing: border-box;
    padding: 40px 0 0 0;
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
