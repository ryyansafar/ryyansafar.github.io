'use client';

export interface Project {
  id: string;
  title: string;
  url: string;
  description: string;
  tech: string[];
  liveUrl?: string;
}

interface ProjectCardProps {
  project: Project;
  index: number;
  isActive?: boolean;
}

// Swiss registration grid — crisp SVG, unique per card with different asymmetric layouts
function SwissGridBg({ variant }: { variant: number }) {
  // 3 different asymmetric grid layouts
  const layouts = [
    // Layout A — wide left column
    { vLines: [130, 260, 320, 520, 660, 740], hLines: [85, 170, 215, 340, 420, 465, 505] },
    // Layout B — tight right cluster
    { vLines: [100, 220, 380, 440, 560, 720], hLines: [70, 160, 240, 310, 390, 450, 490] },
    // Layout C — centre-heavy
    { vLines: [110, 300, 360, 480, 600, 730], hLines: [90, 180, 220, 360, 430, 475, 510] },
  ];
  const { vLines, hLines } = layouts[variant % layouts.length];

  // Crosshair registration mark helper
  const mark = (cx: number, cy: number) => (
    <g key={`${cx}-${cy}`} stroke="currentColor" strokeWidth="0.9" fill="none">
      <line x1={cx} y1={cy - 9} x2={cx} y2={cy + 9} />
      <line x1={cx - 9} y1={cy} x2={cx + 9} y2={cy} />
      <circle cx={cx} cy={cy} r="5.5" />
    </g>
  );

  return (
    <svg
      aria-hidden
      className="card-swiss-grid"
      viewBox="0 0 820 520"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Vertical rule lines */}
      {vLines.map((x) => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="520" stroke="currentColor" strokeWidth="0.5" />
      ))}
      {/* Horizontal rule lines */}
      {hLines.map((y) => (
        <line key={`h${y}`} x1="0" y1={y} x2="820" y2={y} stroke="currentColor" strokeWidth="0.5" />
      ))}
      {/* Corner registration crosshairs */}
      {mark(18, 18)}
      {mark(802, 18)}
      {mark(18, 502)}
      {mark(802, 502)}
    </svg>
  );
}

export default function ProjectCard({ project, index, isActive = false }: ProjectCardProps) {
  const projNum = String(index + 1).padStart(2, '0');

  return (
    <div className={`project-card${isActive ? ' project-card--active' : ''}`}>

      {/* Swiss registration grid — unique layout per card */}
      <SwissGridBg variant={index} />

      {/* Large background number — Barrio, very faint */}
      <div className="card-visual-num" aria-hidden>{projNum}</div>

      {/* Top-left: project index */}
      <div className="card-hud-label">
        <span className="card-hud-dot" />
        <span>Project / {projNum}</span>
      </div>

      {/* Top-right: project name (muted) */}
      <div className="card-hud-name">{project.title}</div>

      {/* Corner registration marks */}
      <div className="card-corner card-corner--tl" aria-hidden />
      <div className="card-corner card-corner--tr" aria-hidden />
      <div className="card-corner card-corner--bl" aria-hidden />
      <div className="card-corner card-corner--br" aria-hidden />

      {/* Rule line above bottom strip */}
      <div className="card-rule" aria-hidden />

      {/* Bottom strip — always visible */}
      <div className="card-bottom-strip">
        <div className="card-bottom-title">{project.title}</div>
        <div className="card-bottom-meta">{project.tech.slice(0, 2).join(' · ')}</div>
      </div>

      {/* Hover overlay — dark, full info */}
      <div className="card-overlay">
        <div className="card-title-wrap" data-title={project.title}>
          <h3 className="card-title">{project.title}</h3>
        </div>
        <p className="card-desc">{project.description}</p>
        <div className="card-tags">
          {project.tech.map((t) => (
            <span key={t} className="card-tag">{t}</span>
          ))}
        </div>
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="card-link"
            onClick={(e) => e.stopPropagation()}
          >
            Visit Live →
          </a>
        )}
      </div>

    </div>
  );
}
