import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import "@/styles/index.css";
import App from "./App.vue";

async function bootstrap() {
  const app = createApp(App);

  app.use(createPinia());
  app.use(router);

  await router.isReady();
  app.mount("#app", true);
}

bootstrap();