import { state } from "./common";
import { windowWidth, isDark, manifest } from "@/store";
import { watch } from "vue";

const onLoadManifest = () => {
  window.addEventListener("message", function (e) {
    const { app, event, data } = e.data;

    if (app !== "PlaneOfEuthymia-Pointer") return;

    if (event == "loadManifest") {
      localStorage.setItem("manifest", JSON.stringify(data));
      manifest.value = data;
      state.isLoadManifestCompleted = true;
    }
  });
};

const onResize = () => {
  function setWidth() {
    windowWidth.value =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
  }
  setWidth();
  window.onresize = () => {
    setWidth();
  };
};

const onThemeChange = () => {
  watch(
    () => isDark.value,
    (value) => {
      if (value) {
        localStorage.setItem("theme", "dark");
        window.parent.postMessage(
          { app: "PlaneOfEuthymia", event: "setTheme", data: "dark" },
          "*"
        );
      } else {
        localStorage.setItem("theme", "light");
        window.parent.postMessage(
          { app: "PlaneOfEuthymia", event: "setTheme", data: "light" },
          "*"
        );
      }
    }
  );
};

export const initHandler = () => {
  onLoadManifest();
  onResize();
  onThemeChange();
};
