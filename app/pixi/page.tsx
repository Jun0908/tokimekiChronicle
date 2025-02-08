'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    PIXI?: any;
    Live2D?: any;
  }
}

export default function PixiPage() {
  useEffect(() => {
    const loadScripts = async () => {
      if (typeof window !== 'undefined') {
        // すでに PIXI & Live2D が読み込まれている場合はスキップ
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
      const cubism4Model =
        'https://cdn.jsdelivr.net/gh/guansss/pixi-live2d-display/test/assets/haru/haru_greeter_t03.model3.json';

      const app = new window.PIXI.Application({
        view: document.getElementById('live2d-canvas') as HTMLCanvasElement,
        autoStart: true,
        resizeTo: window
      });

      const model2 = await window.PIXI.live2d.Live2DModel.from(cubism2Model);
      const model4 = await window.PIXI.live2d.Live2DModel.from(cubism4Model);

      app.stage.addChild(model2);
      app.stage.addChild(model4);

      model2.scale.set(0.3);
      model4.scale.set(0.25);
      model4.x = 300;

      console.log('Live2D models loaded successfully.');
    };

    loadScripts();
  }, []);

  return (
    <main>
      <h1>Live2D Model</h1>
      <canvas id="live2d-canvas"></canvas>
    </main>
  );
}
