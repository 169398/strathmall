/* eslint-disable no-undef */
"use client";

const createToolElement = (emoji: string) => {
  const element = document.createElement('div');
  element.innerHTML = emoji;
  element.style.position = 'fixed';
  element.style.fontSize = '24px';
  element.style.userSelect = 'none';
  element.style.pointerEvents = 'none';
  element.style.zIndex = '9999';
  return element;
};

export const fireToolsConfetti = () => {
  const tools = ["🔧", "🛠️", "⚙️", "🔨", "⛏️", "🪛"];
  const numberOfTools = 50;
  const duration = 3000; // 3 seconds

  for (let i = 0; i < numberOfTools; i++) {
    const tool = createToolElement(tools[Math.floor(Math.random() * tools.length)]);
    document.body.appendChild(tool);

    // Random starting position from two sides
    const startFromLeft = Math.random() < 0.5;
    const startX = startFromLeft ? -50 : window.innerWidth + 50;
    const startY = Math.random() * window.innerHeight;

    // Random ending position
    const endX = 100 + Math.random() * (window.innerWidth - 200);
    const endY = Math.random() * (window.innerHeight - 100);

    // Random rotation
    const rotation = Math.random() * 720 - 360; // -360 to 360 degrees

    // Animation
    tool.style.transition = `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    tool.style.left = `${startX}px`;
    tool.style.top = `${startY}px`;

    // Start animation after a small delay
    setTimeout(() => {
      tool.style.transform = `translate(${endX - startX}px, ${endY - startY}px) rotate(${rotation}deg)`;
      tool.style.opacity = '0';
    }, 50);

    // Clean up
    setTimeout(() => {
      document.body.removeChild(tool);
    }, duration + 100);
  }
}; 