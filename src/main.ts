import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';
import '@/styles/index.css';
import App from './App.vue';

const addEventListener = () => {
  document.addEventListener('DOMContentLoaded', () => {
    fetch('/', { method: 'HEAD' }).then((response) => {
      const workerDomain = response.headers.get('X-Worker-Domain');
      if (workerDomain) {
        const meta = document.createElement('meta');
        meta.name = 'x-worker-domain';
        meta.content = workerDomain;
        document.head.appendChild(meta);
      }
    });
  });
};

async function bootstrap() {
  addEventListener();

  const app = createApp(App);

  app.use(createPinia());
  app.use(router);

  await router.isReady();
  app.mount('#app', true);
}

bootstrap();
