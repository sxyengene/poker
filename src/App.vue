<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { SessionStorage } from "./utils/storage";

onLaunch(() => {
  console.log("App Launch");
  // 设置使用模拟数据，确保在任何环境中都使用相同的数据
  SessionStorage.setUseMockData(true);
});

onShow(() => {
  console.log("App Show");
});

onHide(() => {
  console.log("App Hide");
});
</script>

<style>
/* 全局CSS重置 - 避免使用通配符选择器 */
view, scroll-view, swiper, swiper-item, movableView, cover-view, cover-image,
icon, text, rich-text, progress, button, checkbox, form, input, label, picker,
picker-view, radio, slider, switch, textarea, navigator, image, video, map,
canvas, web-view, ad {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  overflow-x: hidden;
}

#app {
  height: 100%;
  overflow-x: hidden;
}

/* 确保页面内容不会超出视口 */
page {
  height: 100%;
  overflow-x: hidden;
}
</style>