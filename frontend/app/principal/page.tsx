"use client";

import React, { useState, useEffect } from 'react';
import rawScenes from '../../data/story/story.json'; // raw JSON import
import Navbar from "@/components/header/navbar";

// Define the expected structure of each scene
interface SceneData {
  id: number;
  image: string;
  dialogue: string;
  autoProgress: boolean;
  duration?: number;
}

// Cast the imported JSON as an array of SceneData
const scenes = rawScenes as SceneData[];

interface SceneProps {
  scene: SceneData;
  onNext: () => void;
}

const Scene: React.FC<SceneProps> = ({ scene, onNext }) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (scene.autoProgress && scene.duration) {
      timer = setTimeout(() => {
        onNext();
      }, scene.duration);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [scene, onNext]);

  return (
    <div className="scene-container">
        <Navbar />
      <img src={scene.image} alt="Scene" className="scene-image" />
      <p className="scene-dialogue text-3xl">{scene.dialogue}</p>
      {!scene.autoProgress && (
        <button className="text-lg px-4 py-2" onClick={onNext}>Next</button>
      )}
    </div>
  );
};

const Game: React.FC = () => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);

  const handleNext = () => {
    setCurrentSceneIndex((prev) => Math.min(prev + 1, scenes.length - 1));
  };

  return (
    <div className="game-container">
      <Scene scene={scenes[currentSceneIndex]} onNext={handleNext} />
    </div>
  );
};

export default Game;

