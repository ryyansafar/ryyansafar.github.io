'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import type { Project } from '@/components/design/ProjectCard';

const DesignNav        = dynamic(() => import('@/components/design/DesignNav'),        { ssr: false });
const DesignHero       = dynamic(() => import('@/components/design/FisheyeHero'),       { ssr: false });
const HorizontalScroll = dynamic(() => import('@/components/design/HorizontalScroll'),  { ssr: false });
const DesignCursor     = dynamic(() => import('@/components/design/DesignCursor'),      { ssr: false });

// ─── Project Data ───────────────────────────────────────────────────────────
const PROJECTS: Project[] = [
  {
    id: '01',
    title: 'Main Portfolio',
    url: 'https://ryyansafar.github.io',
    description:
      'The main engineering portfolio — Three.js particle hero, GSAP scroll animations, CRT grain, Lanyard physics. Built with Next.js 16.',
    tech: ['Next.js', 'Three.js', 'GSAP', 'Framer Motion', 'Tailwind'],
    liveUrl: 'https://ryyansafar.github.io',
  },
  {
    id: '02',
    title: 'Mis-Communicationator',
    url: 'https://github.com/ryyansafar',
    description:
      'Two LLMs endlessly talking to each other on Raspberry Pi 4. Autonomous AI-to-AI conversation system with thermal management.',
    tech: ['Raspberry Pi', 'StableLM', 'llama.cpp', 'Python'],
    liveUrl: 'https://github.com/ryyansafar',
  },
  {
    id: '03',
    title: 'Smart Glass Mount',
    url: 'https://github.com/ryyansafar',
    description:
      'Assistive computer vision device for the visually impaired. ESP32-CAM + YOLOv5 real-time obstacle detection. HackSus 4.0 Winner.',
    tech: ['ESP32', 'YOLOv5', 'OpenCV', 'TinyML', 'Python'],
    liveUrl: 'https://github.com/ryyansafar',
  },
  {
    id: '04',
    title: 'FPGA Kalman Filter',
    url: 'https://github.com/ryyansafar',
    description:
      'Hardware-accelerated sensor fusion on FPGA. Custom Verilog modules for fixed-point arithmetic fusing IMU + GNSS data.',
    tech: ['Verilog HDL', 'FPGA', 'Kalman Filter', 'UART', 'Signal Processing'],
    liveUrl: 'https://github.com/ryyansafar',
  },
  {
    id: '05',
    title: 'Camera-Only Height Est.',
    url: 'https://github.com/ryyansafar',
    description:
      'LiDAR-to-RGB depth estimation pipeline. UNet architecture trained on KITTI/IDD datasets for monocular height mapping.',
    tech: ['PyTorch', 'LiDAR', 'OpenCV', 'Docker', 'Python'],
    liveUrl: 'https://github.com/ryyansafar',
  },
];

export default function DesignPage() {
  const router = useRouter();

  const handleBackToMain = useCallback(() => {
    router.push('/');
  }, [router]);

  return (
    <div className="design-root">
      <DesignCursor />
      <DesignNav onBackToMain={handleBackToMain} />
      <DesignHero />
      <HorizontalScroll
        projects={PROJECTS}
        onBackToMain={handleBackToMain}
      />
    </div>
  );
}
