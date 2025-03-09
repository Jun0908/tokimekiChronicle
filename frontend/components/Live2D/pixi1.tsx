
import { useEffect } from 'react';

declare global {
  interface Window {
    PIXI?: any;
    Live2D?: any;
  }
}

const Live2DComponent = () => {
  useEffect(() => {
    const loadScripts = async () => {
      if (typeof window !== 'undefined') {
        if (window.PIXI && window.Live2D) {
          console.log('Live2D scripts already loaded.');
          loadLive2DModel();
          return;
        }

        console.log('Loading Live2D scripts...');
        const scripts = [
          'https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js',
          'https://cdn.jsdelivr.net/gh/dylanNew/live2d/webgl/Live2D/lib/live2d.min.js',
          'https://cdn.jsdelivr.net/npm/pixi.js@6.5.2/dist/browser/pixi.min.js',
          'https://cdn.jsdelivr.net/npm/pixi-live2d-display/dist/index.min.js'
        ];

        for (const src of scripts) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
          });
        }

        console.log('Live2D scripts loaded successfully.');
        loadLive2DModel();
      }
    };

    const loadLive2DModel = async () => {
      if (!window.PIXI || !window.PIXI.live2d) {
        console.error('Live2D runtime not available.');
        return;
      }

      const cubism2Model =
        'https://cdn.jsdelivr.net/gh/guansss/pixi-live2d-display/test/assets/shizuku/shizuku.model.json';

      const app = new window.PIXI.Application({
        view: document.getElementById('live2d-canvas') as HTMLCanvasElement,
        autoStart: true,
        resizeTo: window,
        backgroundColor: 0xFFFFFF // 背景を白に設定
      });

      const model2 = await window.PIXI.live2d.Live2DModel.from(cubism2Model);
      app.stage.addChild(model2);

      // モデルのスケールと位置を調整
      model2.scale.set(0.3);
      model2.anchor.set(0.5, 0); // 上基準
      model2.y = 0; // 上部に配置
      model2.x = 700; // もっと右に配置

      console.log('Live2D model loaded successfully.');
    };

    loadScripts();
  }, []);

  return (
    <div className="flex justify-end items-start h-[400px]">
      <canvas id="live2d-canvas" style={{ display: "block", maxHeight: "400px" }} />
    </div>
  );
};

export default Live2DComponent;
