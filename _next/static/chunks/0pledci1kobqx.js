(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,47184,e=>{"use strict";var t=e.i(43476),r=e.i(71645),i=e.i(22016),n=e.i(59487);function a(){let e=(0,r.useRef)(null),i=(0,r.useRef)(null);return(0,r.useEffect)(()=>{let t,r=e.current,n=i.current;if(!r||!n)return;if(window.matchMedia("(pointer: coarse)").matches){r.style.display="none",n.style.display="none";return}let a=window.innerWidth/2,o=window.innerHeight/2,l=a,s=o,p=1,d=1,m=e=>{a=e.clientX,o=e.clientY},c=e=>{e.target.closest("a, button")&&(d=2.2)},g=e=>{e.target.closest("a, button")||(d=1)},f=()=>{l+=(a-l)*.1,s+=(o-s)*.1,p+=(d-p)*.12,r.style.transform=`translate(${a}px,${o}px) translate(-50%,-50%)`,r.style.opacity=p>1.5?"0":"1",n.style.transform=`translate(${l}px,${s}px) translate(-50%,-50%) scale(${p})`,t=requestAnimationFrame(f)};return window.addEventListener("mousemove",m),document.addEventListener("mouseover",c),document.addEventListener("mouseout",g),t=requestAnimationFrame(f),()=>{window.removeEventListener("mousemove",m),document.removeEventListener("mouseover",c),document.removeEventListener("mouseout",g),cancelAnimationFrame(t)}},[]),(0,t.jsxs)("div",{className:"gl-cursor-wrapper",children:[(0,t.jsx)("div",{ref:e,style:{position:"fixed",top:0,left:0,zIndex:9999,width:7,height:7,background:"#fff",borderRadius:"50%",pointerEvents:"none",mixBlendMode:"difference",willChange:"transform",transition:"opacity 0.15s"}}),(0,t.jsx)("div",{ref:i,style:{position:"fixed",top:0,left:0,zIndex:9998,width:38,height:38,border:"1.5px solid #fff",borderRadius:"50%",pointerEvents:"none",mixBlendMode:"difference",willChange:"transform"}})]})}let o=[{id:"01",title:"RYYAN_SAFAR.SITE",category:"PORTFOLIO / ENGINEERING",description:"Main engineering portfolio. Three.js particle field, GSAP scroll animations, Lenis smooth scroll, Lanyard card physics.",tech:["Three.js","GSAP","Next.js 16","Lenis"],url:"https://ryyansafar.site",year:"EST. 2026"},{id:"02",title:"HELP_ME_SURVIVE_COLLEGE",category:"UTILITY / WEB APP",description:"ESE grade planner, attendance tracker, CGPA calculator for KTU students. No login, no ads, terminal-dark aesthetic.",tech:["Next.js","TypeScript","No-auth","KTU"],url:"https://lifesaver.ryyansafar.site",year:"EST. 2026"},{id:"03",title:"TEAMAPT.IN",category:"COMPANY WEBSITE",description:"Designed and shipped the company website for TeamApt — layout, branding, and deployment. Flask REST backend, MySQL.",tech:["HTML","CSS","JavaScript","Multi-page"],url:"https://teamapt.in",year:"EST. 2026"},{id:"04",title:"TINKERSPACE_3D_QUEUE",category:"COMMUNITY TOOL",description:"Community 3D printer queue management for TinkerSpace makerspace. Approval workflow, email notifications, live status.",tech:["Next.js","VercelBlob","Vercel","Firebase"],url:"https://tinkerspace-3d-printing-queue.vercel.app",year:"EST. 2026"},{id:"05",title:"WALLPAPERS_GALLERY",category:"CREATIVE / WALLPAPERS",description:"Custom digital wallpaper gallery. Acid green geometry on obsidian — mobile lock screens, desktop covers, and ultrawide screensavers. All free to download.",tech:["Next.js","Vercel","Space Grotesk","Barrio"],url:"https://wallpapers.ryyansafar.site",year:"EST. 2026"},{id:"06",title:"SMOKE_RYYANSAFAR_SITE",category:"RESTAURANT / WEB DESIGN",description:"Design showcase for a fictional smokehouse restaurant — menu presentation, catering services, and table reservations. Built to explore food brand web design.",tech:["Next.js","Oswald","Plus Jakarta Sans","Custom CSS"],url:"https://smoke.ryyansafar.site",year:"EST. 2026"}];function l({url:e,title:i}){let n=(0,r.useRef)(null),[a,o]=(0,r.useState)(!1);return(0,r.useEffect)(()=>{let e=n.current;if(!e)return;let t=new IntersectionObserver(([e])=>{e.isIntersecting&&(o(!0),t.disconnect())},{rootMargin:"0px 100% 0px 100%"});return t.observe(e),()=>t.disconnect()},[]),(0,t.jsx)("div",{ref:n,style:{position:"absolute",inset:0},children:a?(0,t.jsx)("iframe",{src:e,title:i,sandbox:"allow-scripts allow-same-origin allow-forms",style:{position:"absolute",top:0,left:0,width:"200%",height:"200%",transform:"scale(0.5)",transformOrigin:"top left",border:"none",pointerEvents:"none"}}):(0,t.jsx)("div",{style:{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"},children:(0,t.jsx)("span",{style:{fontFamily:"'Space Grotesk', sans-serif",fontSize:"0.45rem",letterSpacing:"0.14em",color:"rgba(128,128,128,0.3)",textTransform:"uppercase"},children:"LOADING…"})})})}function s({label:e,dark:r}){return(0,t.jsx)("span",{style:{display:"inline-block",border:`1px solid ${r?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.2)"}`,padding:"2px 8px",fontFamily:"'Space Grotesk', sans-serif",fontSize:"0.5625rem",letterSpacing:"0.08em",color:r?"rgba(255,255,255,0.35)":"rgba(27,28,25,0.5)",textTransform:"uppercase"},children:e})}e.s(["default",0,function(){let{navigateTo:e}=(0,n.usePageTransition)(),p=(0,r.useRef)(null),d=(0,r.useRef)(null);return(0,r.useEffect)(()=>{let e=p.current;if(!e)return;let t=t=>{Math.abs(t.deltaY)>Math.abs(t.deltaX)&&e.scrollWidth>e.clientWidth+10&&(t.preventDefault(),e.scrollLeft+=t.deltaY)},r=()=>{let t=d.current;if(!t)return;let r=e.scrollWidth-e.clientWidth,i=r>0?e.scrollLeft/r:0;t.style.width=`${Math.max(4,100*i)}%`};return e.addEventListener("wheel",t,{passive:!1}),e.addEventListener("scroll",r,{passive:!0}),()=>{e.removeEventListener("wheel",t),e.removeEventListener("scroll",r)}},[]),(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("style",{children:`
        @import url('https://fonts.googleapis.com/css2?family=Barrio&family=Epilogue:wght@700;900&family=Space+Grotesk:wght@300;500;700&family=Work+Sans:wght@400;600&display=swap');

        .gl-root, .gl-root * { cursor: none !important; }

        .gl-root {
          background: #fbf9f4;
          color: #1b1c19;
          font-family: 'Work Sans', sans-serif;
          overflow-y: hidden;
          overflow-x: auto;
          scrollbar-width: none;
          height: 100dvh;
        }
        .gl-root::-webkit-scrollbar { display: none; }

        .gl-track {
          display: flex;
          width: 700vw;
          height: 100vh;
        }

        .gl-panel {
          width: 100vw;
          height: 100vh;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
        }

        .gl-grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.04;
          pointer-events: none;
        }

        .gl-open-btn {
          display: inline-block;
          background: #1b1c19;
          color: #fbf9f4;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.6rem 1.25rem;
          text-decoration: none;
          transition: background 0.15s;
        }
        .gl-open-btn:hover { background: #715c00; }

        .gl-open-btn-green {
          display: inline-block;
          background: #a8e060;
          color: #0d0f0a;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.6rem 1.25rem;
          text-decoration: none;
          transition: opacity 0.15s;
        }
        .gl-open-btn-green:hover { opacity: 0.8; }

        .gl-open-btn-gold {
          display: inline-block;
          background: #000;
          color: #f7c533;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.6rem 1.25rem;
          text-decoration: none;
          transition: opacity 0.15s;
        }
        .gl-open-btn-gold:hover { opacity: 0.75; }

        /* Panel 3 bento border */
        .gl-bento-card {
          border-right: 1px solid rgba(27,28,25,0.1);
          padding: 1.5rem 1.75rem;
        }
        .gl-bento-card:last-child { border-right: none; }

        /* Arrow visibility */
        .gl-arrow-mobile { display: none; }

        /* Floating nav chips */
        .gl-nav-chip {
          display: inline-block;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 0.5625rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #1b1c19;
          text-decoration: none;
          background: rgba(251,249,244,0.88);
          -webkit-backdrop-filter: blur(6px);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(27,28,25,0.1);
          padding: 0.3rem 0.65rem;
          pointer-events: auto;
          transition: background 0.15s, color 0.15s;
        }
        .gl-nav-chip:hover {
          background: #1b1c19;
          color: #fbf9f4;
        }

        /* ═══════════════════════════════════════════════════════
           PANEL 0 — baked element positions (desktop)
           ═══════════════════════════════════════════════════════ */
        .gl-p0-poster-wrap  { transform: translate(69px, 96px); width: 664px; }
        .gl-p0-sticky-wrap  { transform: translate(-392px, -134px); }
        .gl-p0-label-wrap   { transform: translate(-170px, 45px); }
        .gl-p0-arrowd-wrap  { transform: translate(377px, -300px) rotate(30deg); }
        .gl-p0-arrowm-wrap  { display: none; }

        /* ═══════════════════════════════════════════════════════
           MOBILE — vertical scroll, stacked columns
           ═══════════════════════════════════════════════════════ */
        @media (max-width: 768px) {
          /* Touch devices get real cursor */
          .gl-root, .gl-root * { cursor: auto !important; }
          .gl-cursor-wrapper { display: none !important; }

          /* Switch from horizontal to vertical */
          .gl-root {
            overflow-y: auto !important;
            overflow-x: hidden !important;
            height: auto !important;
          }
          .gl-track {
            flex-direction: column !important;
            width: 100% !important;
            height: auto !important;
          }
          .gl-panel {
            width: 100% !important;
            height: auto !important;
            min-height: 100svh !important;
          }

          /* Compact fixed header — restore bg on mobile for readability */
          .gl-header {
            padding: 0.875rem 1.25rem !important;
            background: rgba(251,249,244,0.93) !important;
            -webkit-backdrop-filter: blur(10px) !important;
            backdrop-filter: blur(10px) !important;
            pointer-events: auto !important;
            border-bottom: 1px solid rgba(27,28,25,0.06) !important;
          }
          .gl-header nav { gap: 0.4rem !important; }

          /* Hide desktop-only chrome */
          .gl-progress-dots,
          .gl-scroll-hint { display: none !important; }

          /* Swap arrows on mobile */
          .gl-arrow-desktop { display: none !important; }
          .gl-arrow-mobile {
            display: block !important;
            align-self: center !important;
            margin-right: 0 !important;
            margin-top: 1.25rem !important;
          }

          /* Panel 0 — intro */
          .gl-p0-inner {
            padding: 0 1.25rem !important;
            align-items: center !important;
          }
          .gl-intro-box {
            padding: 2rem 2.5rem !important;
            width: calc(100% - 1rem) !important;
            margin-left: 0.75rem !important;
            box-sizing: border-box !important;
            transform: rotate(-1deg) !important;
          }
          .gl-intro-title { font-size: clamp(3.5rem, 13vw, 6rem) !important; }

          /* Panels 1 & 4 — two-col → single-col */
          .gl-panel-split { flex-direction: column !important; }
          .gl-panel-split > div:first-child { flex-direction: column !important; }
          .gl-split-left {
            flex: unset !important;
            width: 100% !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(27,28,25,0.08) !important;
            padding: 5.5rem 1.25rem 2rem !important;
          }
          .gl-split-right {
            flex: unset !important;
            width: 100% !important;
            padding: 1.5rem 1.25rem 2rem !important;
          }
          /* Polaroid slightly smaller, less rotation */
          .gl-polaroid {
            transform: rotate(1deg) scale(0.88) !important;
            transform-origin: top center !important;
          }

          /* Panel 2 — dark terminal */
          .gl-p2 { padding: 5.5rem 1.25rem 2rem !important; }
          .gl-content-row {
            flex-direction: column !important;
            gap: 1.25rem !important;
            flex: unset !important;
            align-items: stretch !important;
          }
          .gl-browser-window {
            flex: unset !important;
            height: 260px !important;
          }
          .gl-meta-col {
            flex: unset !important;
            width: 100% !important;
            align-self: auto !important;
          }

          /* Panel 3 — editorial bento */
          .gl-teamapt-preview {
            flex: unset !important;
            height: 260px !important;
          }
          .gl-bento-row {
            flex-direction: column !important;
            flex: unset !important;
          }
          .gl-bento-card {
            border-right: none !important;
            border-bottom: 1px solid rgba(27,28,25,0.1) !important;
            padding: 0.875rem 1.25rem !important;
            flex: unset !important;
            width: 100% !important;
          }
          .gl-bento-card:last-child { border-bottom: none !important; }

          /* Open buttons — full-width on mobile */
          .gl-open-btn,
          .gl-open-btn-green,
          .gl-open-btn-gold {
            display: block !important;
            text-align: center !important;
          }

          /* Last-panel footer — stack on mobile */
          .gl-panel-footer {
            flex-direction: column !important;
            gap: 0.75rem !important;
            align-items: flex-start !important;
            padding: 1rem 1.25rem 2rem !important;
          }

          /* Panel 0 — mobile position overrides */
          .gl-p0-poster-wrap  { transform: translate(0, 0) rotate(2deg) !important; width: unset !important; }
          .gl-p0-sticky-wrap  { transform: translate(116px, 23px) !important; }
          .gl-p0-label-wrap   { transform: translate(-22px, -1px) rotate(-9deg) !important; }
          .gl-p0-arrowd-wrap  { display: none !important; }
          .gl-p0-arrowm-wrap  { display: block !important; }

          /* Panel 4 (Wallpapers) — stacked like Panel 2 */
          .gl-p-walls { padding: 5.5rem 1.25rem 2rem !important; }
          .gl-walls-content-row {
            flex-direction: column !important;
            gap: 1.25rem !important;
            flex: unset !important;
            align-items: stretch !important;
          }
          .gl-walls-browser { flex: unset !important; height: 260px !important; }
          .gl-walls-meta-col { flex: unset !important; width: 100% !important; align-self: auto !important; }

          /* Panel 5 (Smoke) iframe wrap — taller on mobile */
          .gl-smoke-iframe-wrap {
            width: 100% !important;
            padding-bottom: 100% !important;
          }
        }

        /* ── LANDSCAPE MOBILE ───────────────────────────────────────────
           Targets phones held sideways (short viewport height, moderate width).
           Keeps the vertical-scroll layout from portrait mode but compacts
           panels so they don't need full 100svh to be readable.
        ─────────────────────────────────────────────────────────────── */
        @media (max-height: 500px) and (orientation: landscape) {
          .gl-root, .gl-root * { cursor: auto !important; }
          .gl-cursor-wrapper { display: none !important; }

          /* Vertical scroll (same as portrait) */
          .gl-root {
            overflow-y: auto !important;
            overflow-x: hidden !important;
            height: auto !important;
          }
          .gl-track {
            flex-direction: column !important;
            width: 100% !important;
            height: auto !important;
          }
          .gl-panel {
            width: 100% !important;
            height: auto !important;
            min-height: auto !important;
            padding-top: 4rem !important;
            padding-bottom: 2rem !important;
          }

          /* Compact header */
          .gl-header {
            padding: 0.5rem 1rem !important;
            background: rgba(251,249,244,0.93) !important;
            -webkit-backdrop-filter: blur(10px) !important;
            backdrop-filter: blur(10px) !important;
            pointer-events: auto !important;
            border-bottom: 1px solid rgba(27,28,25,0.06) !important;
          }
          .gl-header nav { gap: 0.3rem !important; }
          .gl-nav-chip { padding: 0.25rem 0.6rem !important; font-size: 0.6rem !important; }

          /* Hide desktop chrome */
          .gl-progress-dots,
          .gl-scroll-hint { display: none !important; }
          .gl-arrow-desktop { display: none !important; }
          .gl-arrow-mobile {
            display: block !important;
            align-self: center !important;
            margin-top: 0.75rem !important;
          }

          /* Panel 0 intro — compact */
          .gl-p0-inner {
            padding: 0 1rem !important;
            align-items: center !important;
          }
          .gl-intro-box {
            padding: 1.25rem 1.75rem !important;
            width: calc(100% - 1rem) !important;
            box-sizing: border-box !important;
            transform: rotate(-1deg) !important;
          }
          .gl-intro-title { font-size: clamp(2.5rem, 10vw, 4rem) !important; }
          .gl-p0-poster-wrap  { transform: translate(0, 0) rotate(2deg) !important; width: unset !important; }
          .gl-p0-sticky-wrap  { display: none !important; }
          .gl-p0-label-wrap   { transform: translate(-22px, -1px) rotate(-9deg) !important; }
          .gl-p0-arrowd-wrap  { display: none !important; }
          .gl-p0-arrowm-wrap  { display: block !important; }

          /* Panels 1 & 4 — two-col → single-col */
          .gl-panel-split { flex-direction: column !important; }
          .gl-panel-split > div:first-child { flex-direction: column !important; }
          .gl-split-left {
            flex: unset !important;
            width: 100% !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(27,28,25,0.08) !important;
            padding: 1rem !important;
          }
          .gl-split-right {
            flex: unset !important;
            width: 100% !important;
            padding: 1rem !important;
          }
          .gl-polaroid { transform: rotate(1deg) scale(0.8) !important; transform-origin: top center !important; }

          /* Panel 2 — dark terminal */
          .gl-p2 { padding: 1rem !important; }
          .gl-content-row {
            flex-direction: column !important;
            gap: 1rem !important;
            flex: unset !important;
            align-items: stretch !important;
          }
          .gl-browser-window { flex: unset !important; height: 200px !important; }
          .gl-meta-col { flex: unset !important; width: 100% !important; align-self: auto !important; }

          /* Panel 3 — bento */
          .gl-teamapt-preview { flex: unset !important; height: 200px !important; }
          .gl-bento-row { flex-direction: column !important; flex: unset !important; }
          .gl-bento-card {
            border-right: none !important;
            border-bottom: 1px solid rgba(27,28,25,0.1) !important;
            padding: 0.75rem 1rem !important;
            flex: unset !important;
            width: 100% !important;
          }
          .gl-bento-card:last-child { border-bottom: none !important; }

          /* Buttons */
          .gl-open-btn,
          .gl-open-btn-green,
          .gl-open-btn-gold {
            display: block !important;
            text-align: center !important;
          }

          /* Last panel footer */
          .gl-panel-footer {
            flex-direction: column !important;
            gap: 0.5rem !important;
            align-items: flex-start !important;
            padding: 0.75rem 1rem 1.5rem !important;
          }

          /* Panel 4 (Wallpapers) — stacked like Panel 2 */
          .gl-p-walls { padding: 1rem !important; }
          .gl-walls-content-row {
            flex-direction: column !important;
            gap: 1rem !important;
            flex: unset !important;
            align-items: stretch !important;
          }
          .gl-walls-browser { flex: unset !important; height: 200px !important; }
          .gl-walls-meta-col { flex: unset !important; width: 100% !important; align-self: auto !important; }

          /* Panel 5 (Smoke) iframe wrap */
          .gl-smoke-iframe-wrap {
            width: 100% !important;
            padding-bottom: 70% !important;
          }
        }
      `}),(0,t.jsx)(a,{}),(0,t.jsxs)("div",{className:"gl-root",ref:p,children:[(0,t.jsx)("div",{className:"gl-grain",style:{position:"fixed",inset:0,zIndex:100}}),(0,t.jsxs)("header",{className:"gl-header",style:{position:"fixed",top:0,left:0,right:0,zIndex:50,display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"1.5rem 2.5rem",pointerEvents:"none"},children:[(0,t.jsx)("a",{href:"/",style:{fontFamily:"Barrio, cursive",fontSize:"1.25rem",textTransform:"uppercase",letterSpacing:"-0.02em",background:"#715c00",color:"#fff",padding:"0.15rem 0.85rem",transform:"rotate(-2deg)",display:"inline-block",boxShadow:"2px 2px 0 rgba(0,0,0,0.15)",textDecoration:"none",pointerEvents:"auto"},children:"DESIGN"}),(0,t.jsxs)("nav",{style:{display:"flex",gap:"0.4rem",alignItems:"flex-start",pointerEvents:"auto"},children:[(0,t.jsx)(i.default,{href:"/",className:"gl-nav-chip",onClick:t=>{t.preventDefault(),e("/")},children:"← MAIN"}),(0,t.jsx)("a",{href:"/design/components",className:"gl-nav-chip",children:"COMPONENTS"}),(0,t.jsx)("a",{href:"https://wallpapers.ryyansafar.site",target:"_blank",rel:"noopener noreferrer",className:"gl-nav-chip",children:"WALLPAPERS ↗"})]})]}),(0,t.jsxs)("div",{className:"gl-scroll-hint",style:{position:"fixed",bottom:"1.75rem",left:"50%",transform:"translateX(-50%)",zIndex:50,display:"flex",alignItems:"center",gap:"0.875rem"},children:[(0,t.jsx)("span",{style:{fontFamily:"'Space Grotesk', sans-serif",fontSize:"0.5rem",fontWeight:700,letterSpacing:"0.3em",color:"rgba(27,28,25,0.25)",textTransform:"uppercase"},children:"SCROLL"}),(0,t.jsx)("div",{style:{width:"10rem",height:"2px",background:"rgba(27,28,25,0.1)",position:"relative"},children:(0,t.jsx)("div",{ref:d,style:{position:"absolute",top:0,left:0,height:"100%",width:"0%",background:"#1b1c19"}})})]}),(0,t.jsxs)("main",{className:"gl-track",children:[(0,t.jsxs)("section",{className:"gl-panel",style:{background:"#fbf9f4",display:"flex",alignItems:"center",justifyContent:"center"},children:[(0,t.jsx)("div",{style:{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Barrio, cursive",fontSize:"22vw",color:"rgba(27,28,25,0.04)",userSelect:"none",pointerEvents:"none",letterSpacing:"-0.02em"},children:"WEB"}),(0,t.jsxs)("div",{className:"gl-p0-inner",style:{position:"relative",zIndex:10,display:"flex",flexDirection:"column",alignItems:"flex-start",padding:"0 3rem"},children:[(0,t.jsx)("div",{className:"gl-p0-label-wrap",style:{marginBottom:"2rem"},children:(0,t.jsx)("span",{style:{fontFamily:"'Space Grotesk', sans-serif",fontSize:"0.625rem",fontWeight:700,letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(27,28,25,0.4)"},children:"// STUFF I SHIPPED WHEN I SHOULD'VE BEEN STUDYING"})}),(0,t.jsx)("div",{className:"gl-p0-poster-wrap",children:(0,t.jsx)("div",{className:"gl-intro-box",style:{background:"#1b1c19",padding:"2.5rem 3rem",transform:"rotate(-1.5deg)",boxShadow:"4px 4px 0 rgba(0,0,0,0.12)"},children:(0,t.jsxs)("h1",{className:"gl-intro-title",style:{fontFamily:"Barrio, cursive",fontSize:"clamp(4rem, 10vw, 8rem)",lineHeight:.9,color:"#f7c533",margin:0,letterSpacing:"-0.01em"},children:["I ALSO",(0,t.jsx)("br",{}),"LIKE",(0,t.jsx)("br",{}),"MAKING",(0,t.jsx)("br",{}),"WEBSITES"]})})}),(0,t.jsx)("div",{className:"gl-p0-sticky-wrap",style:{alignSelf:"flex-start",marginTop:"0.75rem",marginLeft:"0.5rem",marginBottom:"-1.25rem",position:"relative",zIndex:1},children:(0,t.jsx)("div",{style:{background:"#feda5c",padding:"0.2rem 0.75rem",fontFamily:"'Space Grotesk', sans-serif",fontSize:"0.5625rem",fontWeight:700,letterSpacing:"0.12em",color:"#715c00",transform:"rotate(6deg)",boxShadow:"1px 2px 5px rgba(0,0,0,0.13)"},children:"SHIPPED_BY: RYYAN // UNHINGED BUILDER"})}),(0,t.jsx)("div",{className:"gl-p0-arrowd-wrap",style:{marginTop:"2.5rem",alignSelf:"flex-end",marginRight:"-2rem",position:"relative",zIndex:2},children:(0,t.jsx)("div",{className:"gl-arrow-desktop",style:{opacity:.32},children:(0,t.jsx)("svg",{width:"260",height:"195",viewBox:"0 0 200 150",fill:"none",children:(0,t.jsx)("path",{d:"M10 140C40 100 160 140 190 10M190 10L170 20M190 10L180 30",stroke:"#1b1c19",strokeWidth:"2.5",strokeLinecap:"round"})})})}),(0,t.jsx)("div",{className:"gl-p0-arrowm-wrap",style:{alignSelf:"center"},children:(0,t.jsx)("div",{className:"gl-arrow-mobile",style:{opacity:.32},children:(0,t.jsx)("svg",{width:"130",height:"190",viewBox:"0 0 120 165",fill:"none",children:(0,t.jsx)("path",{d:"M60 10C20 55 100 90 60 155M60 155L46 136M60 155L73 133",stroke:"#1b1c19",strokeWidth:"2.5",strokeLinecap:"round"})})})})]}),(0,t.jsx)("div",{style:{position:"absolute",bottom:"4rem",left:"4rem",fontFamily:"Epilogue, sans-serif",fontWeight:900,fontSize:"6rem",color:"rgba(27,28,25,0.06)",lineHeight:1,userSelect:"none"},children:"06"})]}),(0,t.jsxs)("section",{className:"gl-panel gl-panel-split",style:{background:"#f5f3ee",display:"flex"},children:[(0,t.jsxs)("div",{className:"gl-split-left",style:{flex:"0 0 42%",display:"flex",flexDirection:"column",padding:"7rem 3rem 3rem",borderRight:"1px solid rgba(27,28,25,0.07)",position:"relative"},children:[(0,t.jsx)("div",{style:{position:"absolute",bottom:"-1rem",right:"-1.5rem",fontFamily:"Epilogue, sans-serif",fontWeight:900,fontSize:"20vw",lineHeight:1,color:"rgba(27,28,25,0.05)",userSelect:"none",pointerEvents:"none"},children:"01"}),(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"auto"},children:[(0,t.jsx)("span",{style:{fontFamily:"'Space Grotesk', sans-serif",fontSize:"0.5625rem",fontWeight:700,letterSpacing:"0.15em",color:"#715c00",textTransform:"uppercase"},children:"PORTFOLIO / ENGINEERING"}),(0,t.jsx)("span",{style:{background:"#f7c533",color:"#3e2e00",fontFamily:"'Space Grotesk', sans-serif",fontWeight:700,fontSize:"0.5rem",letterSpacing:"0.1em",padding:"2px 8px",transform:"rotate(2deg)",display:"inline-block"},children:"PORTFOLIO_01"})]}),(0,t.jsxs)("h2",{style:{fontFamily:"Epilogue, sans-serif",fontWeight:900,fontSize:"clamp(1.8rem, 4vw, 3.2rem)",lineHeight:.9,letterSpacing:"-0.03em",textTransform:"uppercase",color:"#1b1c19",marginTop:"2.5rem",marginBottom:"1.25rem"},children:["RYYAN_",(0,t.jsx)("br",{}),"SAFAR",(0,t.jsx)("br",{}),".SITE"]}),(0,t.jsx)("p",{style:{fontFamily:"'Work Sans', sans-serif",fontSize:"0.8125rem",color:"rgba(27,28,25,0.55)",lineHeight:1.75,marginBottom:"1.5rem"},children:o[0].description}),(0,t.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:"0.375rem",marginBottom:"2.5rem"},children:o[0].tech.map(e=>(0,t.jsx)(s,{label:e},e))}),(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-end"},children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("div",{style:{fontFamily:"'Space Grotesk', sans-serif",fontSize:"0.5rem",letterSpacing:"0.15em",color:"rgba(27,28,25,0.3)",textTransform:"uppercase",marginBottom:2},children:"YEAR"}),(0,t.jsx)("div",{style:{fontFamily:"'Space Grotesk', sans-serif",fontWeight:700,fontSize:"1rem",color:"#1b1c19"},children:"EST. 2025"})]}),(0,t.jsx)("a",{href:o[0].url,target:"_blank",rel:"noopener noreferrer",className:"gl-open-btn",children:"OPEN [+]"})]})]}),(0,t.jsxs)("div",{className:"gl-split-right",style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"4rem 3rem",background:"#f5f3ee",position:"relative"},children:[(0,t.jsx)("div",{style:{position:"absolute",right:"-10vw",top:"50%",transform:"translateY(-50%)",width:"55vw",height:"55vw",borderRadius:"50%",border:"1px solid rgba(27,28,25,0.06)",pointerEvents:"none"}}),(0,t.jsxs)("div",{className:"gl-polaroid",style:{position:"relative",transform:"rotate(2.5deg)",zIndex:10},children:[(0,t.jsx)("div",{style:{position:"absolute",top:-13,left:"50%",transform:"translateX(-50%) rotate(-1.5deg)",width:72,height:22,background:"rgba(255,255,255,0.55)",backdropFilter:"blur(2px)",border:"1px solid rgba(0,0,0,0.05)",zIndex:20}}),(0,t.jsxs)("div",{style:{background:"#fff",padding:"0.875rem 0.875rem 4rem",boxShadow:"4px 8px 30px rgba(0,0,0,0.14)",width:"clamp(300px, 44vw, 580px)"},children:[(0,t.jsx)("div",{style:{position:"relative",overflow:"hidden",width:"100%",paddingBottom:"75%"},children:(0,t.jsx)(l,{url:o[0].url,title:o[0].title})}),(0,t.jsx)("div",{style:{marginTop:"0.75rem",textAlign:"center"},children:(0,t.jsx)("span",{style:{fontFamily:"'Space Grotesk', sans-serif",fontSize:"0.5rem",fontWeight:700,letterSpacing:"0.12em",color:"rgba(27,28,25,0.35)",textTransform:"uppercase"},children:"LIVE PREVIEW // 01"})})]}),(0,t.jsx)("div",{style:{position:"absolute",top:"3rem",right:"-1rem",background:"#1b1c19",color:"#fbf9f4",fontFamily:"'Space Grotesk', sans-serif",fontSize:"0.5rem",fontWeight:700,letterSpacing:"0.12em",padding:"3px 8px",zIndex:30},children:"● LIVE"})]}),(0,t.jsx)("a",{href:o[0].url,target:"_blank",rel:"noopener noreferrer",style:{position:"absolute",inset:0,zIndex:5},"aria-label":"Open ryyansafar.site"})]}),(0,t.jsx)("div",{style:{position:"absolute",bottom:"2.5rem",left:"3rem",fontFamily:"'Space Grotesk', sans-serif",fontSize:"0.5rem",fontWeight:700,letterSpacing:"0.2em",color:"rgba(27,28,25,0.2)",textTransform:"uppercase"},children:"01 / 06"})]}),(0,t.jsxs)("section",{className:"gl-panel gl-p2",style:{background:"#0d0f0a",display:"flex",flexDirection:"column",padding:"7rem 3rem 3rem"},children:[(0,t.jsx)("div",{style:{position:"absolute",right:"-3rem",top:"50%",transform:"translateY(-50%)",fontFamily:"Epilogue, sans-serif",fontWeight:900,fontSize:"28vw",lineHeight:1,color:"rgba(255,255,255,0.02)",userSelect:"none",pointerEvents:"none",whiteSpace:"nowrap"},children:"TOOL"}),(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"1rem",marginBottom:"1.5rem"},children:[(0,t.jsx)("span",{style:{fontFamily:"'Space Grotesk', sans-serif",fontSize:"0.5625rem",fontWeight:700,letterSpacing:"0.15em",color:"rgba(168,224,96,0.4)",textTransform:"uppercase"},children:"// ENTRY_02"}),(0,t.jsx)("span",{style:{background:"#1a1f14",fontFamily:"'Space Grotesk', sans-serif",fontSize:"0.5rem",fontWeight:700,letterSpacing:"0.1em",color:"rgba(168,224,96,0.35)",textTransform:"uppercase",padding:"2px 10px"},children:"UTILITY / WEB APP"})]}),(0,t.jsxs)("h2",{style:{fontFamily:"Epilogue, sans-serif",fontWeight:900,fontSize:"clamp(1.5rem, 4vw, 3rem)",lineHeight:1,letterSpacing:"-0.02em",textTransform:"uppercase",color:"#a8e060",marginBottom:"2rem"},children:["$ HELP_ME_",(0,t.jsx)("br",{}),"SURVIVE_",(0,t.jsx)("br",{}),"COLLEGE"]}),(0,t.jsxs)("div",{className:"gl-content-row",style:{display:"flex",gap:"3rem",alignItems:"stretch",flex:1,minHeight:0},children:[(0,t.jsxs)("div",{className:"gl-browser-window",style:{flex:1,border:"1px solid #2a3020",background:"#111",position:"relative",display:"flex",flexDirection:"column",overflow:"hidden"},children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem",background:"#1a1f14",padding:"0.5rem 0.75rem",borderBottom:"1px solid #2a3020",flexShrink:0},children:[(0,t.jsx)("div",{style:{width:10,height:10,borderRadius:"50%",background:"#ff5f56"}}),(0,t.jsx)("div",{style:{width:10,height:10,borderRadius:"50%",background:"#ffbd2e"}}),(0,t.jsx)("div",{style:{width:10,height:10,borderRadius:"50%",background:"#27c93f"}}),(0,t.jsx)("span",{style:{fontFamily:"'Space Grotesk', sans-serif",fontSize:"0.5rem",letterSpacing:"0.08em",color:"rgba(168,224,96,0.3)",marginLeft:"0.5rem"},children:"lifesaver.ryyansafar.site"}),(0,t.jsx)("div",{style:{marginLeft:"auto",background:"#a8e060",color:"#0d0f0a",fontFamily:"'Space Grotesk', sans-serif",fontSize:"0.45rem",fontWeight:700,letterSpacing:"0.1em",padding:"2px 6px"},children:"● LIVE"})]}),(0,t.jsxs)("div",{style:{position:"relative",overflow:"hidden",flex:1},children:[(0,t.jsx)(l,{url:o[1].url,title:o[1].title}),(0,t.jsx)("div",{style:{position:"absolute",inset:0,pointerEvents:"none",zIndex:5,backgroundImage:"repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)"}}),(0,t.jsx)("a",{href:o[1].url,target:"_blank",rel:"noopener noreferrer",style:{position:"absolute",inset:0,zIndex:10},"aria-label":"Open lifesaver.ryyansafar.site"})]})]}),(0,t.jsxs)("div",{className:"gl-meta-col",style:{flex:"0 0 220px",display:"flex",flexDirection:"column",gap:"1.25rem",paddingTop:"0.25rem",alignSelf:"flex-start"},children:[(0,t.jsx)("p",{style:{fontFamily:"'Work Sans', sans-serif",fontSize:"0.8rem",color:"rgba(255,255,255,0.35)",lineHeight:1.75,maxWidth:"28ch"},children:o[1].description}),(0,t.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:"0.35rem"},children:o[1].tech.map(e=>(0,t.jsx)(s,{label:e,dark:!0},e))}),(0,t.jsxs)("div",{children:[(0,t.jsx)("div",{style:{fontFamily:"'Space Grotesk', sans-serif",fontSize:"0.5rem",letterSpacing:"0.15em",color:"rgba(255,255,255,0.2)",textTransform:"uppercase",marginBottom:2},children:"YEAR"}),(0,t.jsx)("div",{style:{fontFamily:"'Space Grotesk', sans-serif",fontWeight:700,fontSize:"1.1rem",color:"#a8e060"},children:"EST. 2026"})]}),(0,t.jsx)("a",{href:o[1].url,target:"_blank",rel:"noopener noreferrer",className:"gl-open-btn-green",children:"OPEN [+]"})]})]}),(0,t.jsx)("div",{style:{position:"absolute",bottom:"2.5rem",left:"4rem",fontFamily:"'Space Grotesk', sans-serif",fontSize:"0.5rem",fontWeight:700,letterSpacing:"0.2em",color:"rgba(168,224,96,0.2)",textTransform:"uppercase"},children:"02 / 06"})]}),(0,t.jsxs)("section",{className:"gl-panel",style:{background:"#f5f3ee",display:"flex",flexDirection:"column"},children:[(0,t.jsx)("div",{className:"gl-teamapt-preview",style:{flex:"0 0 58%",position:"relative",overflow:"hidden",borderBottom:"2px solid #1b1c19",backgroundColor:"#d8d4c9",backgroundImage:"radial-gradient(circle, rgba(27,28,25,0.14) 1px, transparent 1px)",backgroundSize:"22px 22px"},children:(0,t.jsxs)("div",{style:{position:"absolute",top:"1.25rem",left:"1.5rem",right:"1.5rem",bottom:0,borderRadius:"10px 10px 0 0",overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.12)",border:"1px solid rgba(27,28,25,0.3)",borderBottom:"none"},children:[(0,t.jsxs)("div",{style:{position:"relative",zIndex:10,background:"#1b1c19",height:"2.75rem",display:"flex",alignItems:"center",padding:"0 1.25rem",gap:"0.5rem"},children:[(0,t.jsxs)("div",{style:{display:"flex",gap:"0.4rem"},children:[(0,t.jsx)("div",{style:{width:9,height:9,borderRadius:"50%",background:"#ff5f57"}}),(0,t.jsx)("div",{style:{width:9,height:9,borderRadius:"50%",background:"#febc2e"}}),(0,t.jsx)("div",{style:{width:9,height:9,borderRadius:"50%",background:"#28c840"}})]}),(0,t.jsx)("div",{style:{flex:1,background:"rgba(255,255,255,0.07)",borderRadius:4,padding:"0.2rem 0.75rem",marginLeft:"0.75rem"},children:(0,t.jsx)("span",{style:{fontFamily:"'Space Grotesk', sans-serif",fontSize:"0.5625rem",color:"rgba(255,255,255,0.35)",letterSpacing:"0.05em"},children:"teamapt.in"})}),(0,t.jsx)("div",{style:{background:"#f7c533",color:"#3e2e00",fontFamily:"'Space Grotesk', sans-serif",fontSize:"0.45rem",fontWeight:700,letterSpacing:"0.1em",padding:"2px 7px",borderRadius:2},children:"● LIVE"})]}),(0,t.jsx)("div",{style:{position:"absolute",top:"2.75rem",left:0,right:0,bottom:0,overflow:"hidden"},children:(0,t.jsx)(l,{url:o[2].url,title:o[2].title})}),(0,t.jsx)("a",{href:o[2].url,target:"_blank",rel:"noopener noreferrer",style:{position:"absolute",top:"2.75rem",left:0,right:0,bottom:0,zIndex:20},"aria-label":"Open teamapt.in"})]})}),(0,t.jsxs)("div",{className:"gl-bento-row",style:{flex:1,display:"flex",background:"#fbf9f4",borderTop:"2px solid #1b1c19"},children:[(0,t.jsxs)("div",{className:"gl-bento-card",style:{flex:"0 0 18%",display:"flex",flexDirection:"column",justifyContent:"space-between"},children:[(0,t.jsx)("div",{style:{fontFamily:"Epilogue, sans-serif",fontWeight:900,fontSize:"clamp(2.5rem,5vw,4.5rem)",lineHeight:1,color:"rgba(27,28,25,0.08)"},children:"03"}),(0,t.jsxs)("span",{style:{fontFamily:"'Space Grotesk', sans-serif",fontSize:"0.5rem",fontWeight:700,letterSpacing:"0.15em",color:"#715c00",textTransform:"uppercase"},children:["COMPANY",(0,t.jsx)("br",{}),"WEBSITE"]})]}),(0,t.jsxs)("div",{className:"gl-bento-card",style:{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",gap:"0.75rem"},children:[(0,t.jsx)("h2",{style:{fontFamily:"Epilogue, sans-serif",fontWeight:900,fontSize:"clamp(1rem, 2vw, 1.75rem)",lineHeight:1,letterSpacing:"-0.02em",textTransform:"uppercase",color:"#1b1c19",margin:0},children:"TEAMAPT.IN"}),(0,t.jsx)("p",{style:{fontFamily:"'Work Sans', sans-serif",fontSize:"0.75rem",color:"rgba(27,28,25,0.5)",lineHeight:1.65,maxWidth:"38ch",margin:0},children:o[2].description})]}),(0,t.jsxs)("div",{className:"gl-bento-card",style:{flex:"0 0 22%",display:"flex",flexDirection:"column",justifyContent:"center",gap:"0.75rem"},children:[(0,t.jsx)("div",{style:{fontFamily:"'Space Grotesk', sans-serif",fontSize:"0.5rem",letterSpacing:"0.15em",color:"rgba(27,28,25,0.3)",textTransform:"uppercase"},children:"STACK"}),(0,t.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:"0.3rem"},children:o[2].tech.map(e=>(0,t.jsx)(s,{label:e},e))})]}),(0,t.jsxs)("div",{className:"gl-bento-card",style:{flex:"0 0 16%",display:"flex",flexDirection:"column",justifyContent:"space-between"},children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("div",{style:{fontFamily:"'Space Grotesk', sans-serif",fontSize:"0.5rem",letterSpacing:"0.15em",color:"rgba(27,28,25,0.3)",textTransform:"uppercase",marginBottom:4},children:"YEAR"}),(0,t.jsx)("div",{style:{fontFamily:"'Space Grotesk', sans-serif",fontWeight:700,fontSize:"1.25rem",color:"#1b1c19"},children:"EST. 2024"})]}),(0,t.jsx)("a",{href:o[2].url,target:"_blank",rel:"noopener noreferrer",className:"gl-open-btn",children:"OPEN [+]"})]})]}),(0,t.jsx)("div",{style:{position:"absolute",bottom:"1rem",left:"1.75rem",fontFamily:"'Space Grotesk', sans-serif",fontSize:"0.5rem",fontWeight:700,letterSpacing:"0.2em",color:"rgba(27,28,25,0.2)",textTransform:"uppercase"},children:"03 / 06"})]}),(0,t.jsxs)("section",{className:"gl-panel gl-p-walls",style:{background:"#07070f",display:"flex",flexDirection:"column",padding:"7rem 3rem 3rem",position:"relative"},children:[(0,t.jsx)("div",{style:{position:"absolute",right:"-3rem",top:"50%",transform:"translateY(-50%)",fontFamily:"Epilogue, sans-serif",fontWeight:900,fontSize:"28vw",lineHeight:1,color:"rgba(255,255,255,0.02)",userSelect:"none",pointerEvents:"none",whiteSpace:"nowrap"},children:"WALLS"}),(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"1rem",marginBottom:"1.5rem"},children:[(0,t.jsx)("span",{style:{fontFamily:"'Space Grotesk', sans-serif",fontSize:"0.5625rem",fontWeight:700,letterSpacing:"0.15em",color:"rgba(180,255,90,0.4)",textTransform:"uppercase"},children:"// ENTRY_04"}),(0,t.jsx)("span",{style:{background:"#0d1208",fontFamily:"'Space Grotesk', sans-serif",fontSize:"0.5rem",fontWeight:700,letterSpacing:"0.1em",color:"rgba(180,255,90,0.35)",textTransform:"uppercase",padding:"2px 10px"},children:"CREATIVE / WALLPAPERS"})]}),(0,t.jsxs)("h2",{style:{fontFamily:"Epilogue, sans-serif",fontWeight:900,fontSize:"clamp(1.5rem, 4vw, 3rem)",lineHeight:1,letterSpacing:"-0.02em",textTransform:"uppercase",color:"#b4ff5a",marginBottom:"2rem"},children:["$ WALLPAPERS_",(0,t.jsx)("br",{}),"GALLERY"]}),(0,t.jsxs)("div",{className:"gl-walls-content-row",style:{display:"flex",gap:"3rem",alignItems:"stretch",flex:1,minHeight:0},children:[(0,t.jsxs)("div",{className:"gl-walls-browser",style:{flex:1,border:"1px solid rgba(180,255,90,0.1)",background:"#0a0a14",position:"relative",display:"flex",flexDirection:"column",overflow:"hidden"},children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"0.5rem",background:"#0d1208",padding:"0.5rem 0.75rem",borderBottom:"1px solid rgba(180,255,90,0.08)",flexShrink:0},children:[(0,t.jsx)("div",{style:{width:10,height:10,borderRadius:"50%",background:"#ff5f56"}}),(0,t.jsx)("div",{style:{width:10,height:10,borderRadius:"50%",background:"#ffbd2e"}}),(0,t.jsx)("div",{style:{width:10,height:10,borderRadius:"50%",background:"#27c93f"}}),(0,t.jsx)("span",{style:{fontFamily:"'Space Grotesk', sans-serif",fontSize:"0.5rem",letterSpacing:"0.08em",color:"rgba(180,255,90,0.3)",marginLeft:"0.5rem"},children:"wallpapers.ryyansafar.site"}),(0,t.jsx)("div",{style:{marginLeft:"auto",background:"#b4ff5a",color:"#07070f",fontFamily:"'Space Grotesk', sans-serif",fontSize:"0.45rem",fontWeight:700,letterSpacing:"0.1em",padding:"2px 6px"},children:"● LIVE"})]}),(0,t.jsxs)("div",{style:{position:"relative",overflow:"hidden",flex:1},children:[(0,t.jsx)(l,{url:o[4].url,title:o[4].title}),(0,t.jsx)("a",{href:o[4].url,target:"_blank",rel:"noopener noreferrer",style:{position:"absolute",inset:0,zIndex:10},"aria-label":"Open wallpapers.ryyansafar.site"})]})]}),(0,t.jsxs)("div",{className:"gl-walls-meta-col",style:{flex:"0 0 220px",display:"flex",flexDirection:"column",gap:"1.25rem",paddingTop:"0.25rem",alignSelf:"flex-start"},children:[(0,t.jsx)("p",{style:{fontFamily:"'Work Sans', sans-serif",fontSize:"0.8rem",color:"rgba(255,255,255,0.35)",lineHeight:1.75,maxWidth:"28ch"},children:o[4].description}),(0,t.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:"0.35rem"},children:o[4].tech.map(e=>(0,t.jsx)(s,{label:e,dark:!0},e))}),(0,t.jsxs)("div",{children:[(0,t.jsx)("div",{style:{fontFamily:"'Space Grotesk', sans-serif",fontSize:"0.5rem",letterSpacing:"0.15em",color:"rgba(255,255,255,0.2)",textTransform:"uppercase",marginBottom:2},children:"YEAR"}),(0,t.jsx)("div",{style:{fontFamily:"'Space Grotesk', sans-serif",fontWeight:700,fontSize:"1.1rem",color:"#b4ff5a"},children:"EST. 2026"})]}),(0,t.jsx)("a",{href:o[4].url,target:"_blank",rel:"noopener noreferrer",style:{display:"inline-block",background:"#b4ff5a",color:"#07070f",fontFamily:"'Space Grotesk', sans-serif",fontWeight:700,fontSize:"0.75rem",letterSpacing:"0.1em",textTransform:"uppercase",padding:"0.6rem 1.25rem",textDecoration:"none",transition:"opacity 0.15s"},children:"OPEN [+]"})]})]}),(0,t.jsx)("div",{style:{position:"absolute",bottom:"2.5rem",left:"4rem",fontFamily:"'Space Grotesk', sans-serif",fontSize:"0.5rem",fontWeight:700,letterSpacing:"0.2em",color:"rgba(180,255,90,0.2)",textTransform:"uppercase"},children:"04 / 06"})]}),(0,t.jsxs)("section",{className:"gl-panel gl-panel-split",style:{background:"#f5ede3",display:"flex"},children:[(0,t.jsxs)("div",{className:"gl-split-left",style:{flex:"0 0 45%",display:"flex",flexDirection:"column",padding:"7rem 3rem 3rem",borderRight:"1px solid rgba(60,20,5,0.1)",position:"relative"},children:[(0,t.jsx)("div",{style:{position:"absolute",bottom:"-2rem",right:"-2rem",fontFamily:"Epilogue, sans-serif",fontWeight:900,fontSize:"20vw",lineHeight:1,color:"rgba(60,20,5,0.04)",userSelect:"none",pointerEvents:"none"},children:"05"}),(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"auto"},children:[(0,t.jsx)("span",{style:{fontFamily:"'Space Grotesk', sans-serif",fontSize:"0.5625rem",fontWeight:700,letterSpacing:"0.15em",color:"#c04b0c",textTransform:"uppercase"},children:"RESTAURANT / WEB DESIGN"}),(0,t.jsx)("span",{style:{background:"#c04b0c",color:"#fff",fontFamily:"'Space Grotesk', sans-serif",fontWeight:700,fontSize:"0.5rem",letterSpacing:"0.1em",padding:"2px 8px",transform:"rotate(2deg)",display:"inline-block"},children:"SMOKE_05"})]}),(0,t.jsxs)("h2",{style:{fontFamily:"Epilogue, sans-serif",fontWeight:900,fontSize:"clamp(1.8rem, 4vw, 3.2rem)",lineHeight:.9,letterSpacing:"-0.03em",textTransform:"uppercase",color:"#2a1206",marginTop:"2.5rem",marginBottom:"1.25rem"},children:["THE",(0,t.jsx)("br",{}),"SMOKE",(0,t.jsx)("br",{}),"HOUSE"]}),(0,t.jsx)("p",{style:{fontFamily:"'Work Sans', sans-serif",fontSize:"0.8125rem",color:"rgba(42,18,6,0.55)",lineHeight:1.75,marginBottom:"1.5rem"},children:o[5].description}),(0,t.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:"0.375rem",marginBottom:"2.5rem"},children:o[5].tech.map(e=>(0,t.jsx)(s,{label:e},e))}),(0,t.jsxs)("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-end"},children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("div",{style:{fontFamily:"'Space Grotesk', sans-serif",fontSize:"0.5rem",letterSpacing:"0.15em",color:"rgba(42,18,6,0.3)",textTransform:"uppercase",marginBottom:2},children:"YEAR"}),(0,t.jsx)("div",{style:{fontFamily:"'Space Grotesk', sans-serif",fontWeight:700,fontSize:"1rem",color:"#2a1206"},children:"EST. 2026"})]}),(0,t.jsx)("a",{href:o[5].url,target:"_blank",rel:"noopener noreferrer",style:{display:"inline-block",background:"#c04b0c",color:"#fff",fontFamily:"'Space Grotesk', sans-serif",fontWeight:700,fontSize:"0.75rem",letterSpacing:"0.1em",textTransform:"uppercase",padding:"0.6rem 1.25rem",textDecoration:"none",transition:"opacity 0.15s"},children:"OPEN [+]"})]})]}),(0,t.jsxs)("div",{className:"gl-split-right",style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"4rem 2.5rem",background:"#ede1d3",position:"relative"},children:[(0,t.jsx)("div",{style:{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle, rgba(42,18,6,0.12) 1px, transparent 1px)",backgroundSize:"20px 20px",pointerEvents:"none"}}),(0,t.jsxs)("div",{style:{position:"relative",zIndex:10,transform:"rotate(1.5deg)",boxShadow:"6px 6px 0 rgba(42,18,6,0.2)"},children:[(0,t.jsxs)("div",{style:{border:"6px solid #2a1206",background:"#2a1206"},children:[(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",padding:"0.4rem 0.75rem",gap:"0.4rem"},children:[(0,t.jsxs)("div",{style:{display:"flex",gap:"0.35rem"},children:[(0,t.jsx)("div",{style:{width:8,height:8,borderRadius:"50%",background:"#ff5f57"}}),(0,t.jsx)("div",{style:{width:8,height:8,borderRadius:"50%",background:"#febc2e"}}),(0,t.jsx)("div",{style:{width:8,height:8,borderRadius:"50%",background:"#28c840"}})]}),(0,t.jsx)("span",{style:{fontFamily:"'Space Grotesk', sans-serif",fontSize:"0.5rem",color:"rgba(255,255,255,0.35)",letterSpacing:"0.05em",flex:1,textAlign:"center"},children:"smoke.ryyansafar.site"}),(0,t.jsx)("span",{style:{background:"#c04b0c",color:"#fff",fontFamily:"'Space Grotesk', sans-serif",fontSize:"0.45rem",fontWeight:700,letterSpacing:"0.1em",padding:"1px 6px"},children:"● LIVE"})]}),(0,t.jsx)("div",{className:"gl-smoke-iframe-wrap",style:{position:"relative",overflow:"hidden",width:"clamp(260px, 38vw, 500px)",paddingBottom:"90%"},children:(0,t.jsx)(l,{url:o[5].url,title:o[5].title})})]}),(0,t.jsx)("a",{href:o[5].url,target:"_blank",rel:"noopener noreferrer",style:{position:"absolute",inset:0,zIndex:10},"aria-label":"Open smoke.ryyansafar.site"})]})]}),(0,t.jsx)("div",{style:{position:"absolute",bottom:"2.5rem",left:"3rem",fontFamily:"'Space Grotesk', sans-serif",fontSize:"0.5rem",fontWeight:700,letterSpacing:"0.2em",color:"rgba(42,18,6,0.2)",textTransform:"uppercase"},children:"05 / 06"})]}),(0,t.jsxs)("section",{className:"gl-panel gl-panel-split",style:{background:"#f7c533",display:"flex",flexDirection:"column"},children:[(0,t.jsxs)("div",{style:{display:"flex",flex:1,minHeight:0},children:[(0,t.jsxs)("div",{className:"gl-split-left",style:{flex:"0 0 50%",display:"flex",flexDirection:"column",justifyContent:"center",padding:"7rem 3rem 3rem",position:"relative",zIndex:10},children:[(0,t.jsx)("div",{style:{position:"absolute",bottom:"-3rem",left:"-2rem",fontFamily:"Epilogue, sans-serif",fontWeight:900,fontSize:"28vw",lineHeight:1,color:"rgba(0,0,0,0.05)",userSelect:"none",pointerEvents:"none"},children:"06"}),(0,t.jsx)("span",{style:{fontFamily:"'Space Grotesk', sans-serif",fontSize:"0.5625rem",fontWeight:700,letterSpacing:"0.15em",color:"rgba(0,0,0,0.4)",textTransform:"uppercase",marginBottom:"1.5rem",display:"block"},children:"COMMUNITY TOOL / EST. 2024"}),(0,t.jsxs)("h2",{style:{fontFamily:"Barrio, cursive",fontSize:"clamp(3.5rem, 7.5vw, 7rem)",lineHeight:.88,color:"#000",letterSpacing:"-0.01em",marginBottom:"2rem"},children:["3D_PRINTER",(0,t.jsx)("br",{}),"QUEUE"]}),(0,t.jsx)("p",{style:{fontFamily:"'Work Sans', sans-serif",fontSize:"0.8125rem",color:"rgba(0,0,0,0.5)",lineHeight:1.75,marginBottom:"1.75rem"},children:o[3].description}),(0,t.jsx)("div",{style:{display:"flex",flexWrap:"wrap",gap:"0.375rem",marginBottom:"2rem"},children:o[3].tech.map(e=>(0,t.jsx)("span",{style:{display:"inline-block",border:"1px solid rgba(0,0,0,0.3)",padding:"2px 8px",fontFamily:"'Space Grotesk', sans-serif",fontSize:"0.5625rem",letterSpacing:"0.08em",color:"rgba(0,0,0,0.5)",textTransform:"uppercase"},children:e},e))}),(0,t.jsxs)("div",{style:{display:"flex",alignItems:"center",gap:"1rem"},children:[(0,t.jsx)("div",{style:{border:"2px solid #000",padding:"0.2rem 0.75rem",fontFamily:"'Space Grotesk', sans-serif",fontWeight:700,fontSize:"0.5rem",letterSpacing:"0.12em",color:"#000",transform:"rotate(-2deg)"},children:"TOOL_06"}),(0,t.jsx)("a",{href:o[3].url,target:"_blank",rel:"noopener noreferrer",className:"gl-open-btn-gold",children:"OPEN [+]"})]})]}),(0,t.jsxs)("div",{className:"gl-split-right",style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"4rem 2.5rem",position:"relative"},children:[(0,t.jsx)("div",{style:{position:"absolute",top:"5.5rem",right:"3.5rem",width:24,height:24,borderTop:"3px solid rgba(0,0,0,0.2)",borderRight:"3px solid rgba(0,0,0,0.2)"}}),(0,t.jsx)("div",{style:{position:"absolute",bottom:"3.5rem",left:"0rem",width:24,height:24,borderBottom:"3px solid rgba(0,0,0,0.2)",borderLeft:"3px solid rgba(0,0,0,0.2)"}}),(0,t.jsxs)("div",{style:{position:"relative",transform:"rotate(-3deg)",boxShadow:"8px 8px 0 rgba(0,0,0,0.2)"},children:[(0,t.jsx)("div",{style:{border:"8px solid #000",background:"#000"},children:(0,t.jsx)("div",{style:{position:"relative",overflow:"hidden",width:"clamp(280px, 38vw, 500px)",paddingBottom:"110%"},children:(0,t.jsx)(l,{url:o[3].url,title:o[3].title})})}),(0,t.jsxs)("div",{style:{background:"#000",padding:"0.4rem 1rem",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[(0,t.jsx)("span",{style:{fontFamily:"'Space Grotesk', sans-serif",fontWeight:700,fontSize:"0.5rem",letterSpacing:"0.12em",color:"rgba(247,197,51,0.5)",textTransform:"uppercase"},children:"PHY_TOOL_06"}),(0,t.jsx)("span",{style:{background:"#f7c533",color:"#000",fontFamily:"'Space Grotesk', sans-serif",fontSize:"0.45rem",fontWeight:700,letterSpacing:"0.1em",padding:"1px 6px"},children:"● LIVE"})]}),(0,t.jsx)("a",{href:o[3].url,target:"_blank",rel:"noopener noreferrer",style:{position:"absolute",inset:0,zIndex:10},"aria-label":"Open Tinkerspace 3D Queue"})]})]})]}),(0,t.jsxs)("div",{className:"gl-panel-footer",style:{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"0.75rem",padding:"1rem 3rem 1.5rem",borderTop:"1px solid rgba(0,0,0,0.1)"},children:[(0,t.jsx)("span",{style:{fontFamily:"'Space Grotesk', sans-serif",fontWeight:700,fontSize:"0.5625rem",letterSpacing:"0.2em",textTransform:"uppercase",color:"rgba(0,0,0,0.25)"},children:"BUILT THIS MYSELF / DON'T ASK HOW LONG IT TOOK / STILL NO BUGS (PROBABLY)"}),(0,t.jsxs)("div",{style:{display:"flex",gap:"1.5rem"},children:[(0,t.jsx)("a",{href:"https://github.com/ryyansafar",target:"_blank",rel:"noopener noreferrer",style:{fontFamily:"'Space Grotesk', sans-serif",fontWeight:700,fontSize:"0.5625rem",letterSpacing:"0.12em",color:"rgba(0,0,0,0.45)",textDecoration:"underline",textDecorationColor:"#715c00"},children:"GITHUB"}),(0,t.jsx)("a",{href:"mailto:safarryyan@gmail.com",style:{fontFamily:"'Space Grotesk', sans-serif",fontWeight:700,fontSize:"0.5625rem",letterSpacing:"0.12em",color:"rgba(0,0,0,0.45)",textDecoration:"none"},children:"CONTACT"}),(0,t.jsx)("a",{href:"https://razorpay.me/@ryyansafar",target:"_blank",rel:"noopener noreferrer",style:{fontFamily:"'Space Grotesk', sans-serif",fontWeight:700,fontSize:"0.5625rem",letterSpacing:"0.12em",color:"rgba(0,0,0,0.45)",textDecoration:"underline",textDecorationColor:"#f7c533"},children:"BUY ME A CHAI"})]})]})]})]})]})]})}])}]);