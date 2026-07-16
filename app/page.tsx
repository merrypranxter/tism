"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Lens = "all" | "dsm" | "lived" | "overlap";

type Signal = {
  id: string;
  number: string;
  clinical: string;
  merry: string;
  lens: Exclude<Lens, "all">;
  strength: "strong" | "probable" | "developing";
  body: string;
  translation: string;
  tags: string[];
};

const signals: Signal[] = [
  {
    id: "masking",
    number: "01",
    clinical: "Social compensation & masking",
    merry: "I LEARNED THE PART. THEN THE PART ATE THE ACTOR.",
    lens: "dsm",
    strength: "strong",
    body:
      "From childhood onward, acceptable social behavior became something to study, perform, and maintain. The ability to look socially capable does not prove the process is effortless; it may prove the camouflage got very, very good.",
    translation:
      "I can run the Normal Human emulator. It just burns an obscene amount of fuel and eventually sends the nervous-system invoice.",
    tags: ["DSM A: social communication", "late-recognized", "camouflaging"],
  },
  {
    id: "patterns",
    number: "02",
    clinical: "Highly focused, systemizing interests",
    merry: "PATTERN HUNGER WITH A GITHUB ACCOUNT",
    lens: "dsm",
    strength: "strong",
    body:
      "Interests do not stay casual. They become ecosystems: shaders, repositories, taxonomies, mathematical structures, biology, psychedelia, visual systems, and tools that breed more tools. The joy is not only making an object; it is building the machine that makes impossible combinations happen.",
    translation:
      "I do not collect hobbies. I open portals, give them file structures, and wake up surrounded by fourteen new repos.",
    tags: ["DSM B3", "monotropism", "systemizing"],
  },
  {
    id: "focus",
    number: "03",
    clinical: "Monotropic attention + ADHD variability",
    merry: "THE ATTENTION SINGULARITY",
    lens: "overlap",
    strength: "strong",
    body:
      "Attention is interest-based, not politely assigned. A compelling system can hold focus for hours and connect wildly distant domains. A low-interest task can remain physically small yet neurologically unreachable. ADHD changes the ignition; autistic monotropism may explain the depth and difficulty switching tracks.",
    translation:
      "My brain has a particle accelerator and no sensible parking lot.",
    tags: ["autism + ADHD", "hyperfocus", "task switching"],
  },
  {
    id: "executive",
    number: "04",
    clinical: "Executive-function friction",
    merry: "THE FIRST STEP HAS LEFT THE BUILDING",
    lens: "overlap",
    strength: "strong",
    body:
      "Knowing exactly what to do and being able to initiate it are separate systems. Transitions, sequences, maintenance tasks, and vague demands can jam the machinery—especially under fatigue, sensory load, hormones, or burnout.",
    translation:
      "The task is not hard. The airlock between thinking and doing is full of raccoons.",
    tags: ["ADHD overlap", "autistic inertia", "transitions"],
  },
  {
    id: "sensory",
    number: "05",
    clinical: "Sensory and interoceptive intensity",
    merry: "THE BODY WEATHER STATION IS HAUNTED",
    lens: "overlap",
    strength: "probable",
    body:
      "Sensory overload, body-signal confusion, frissons, temperature shifts, migraines, low-blood-pressure spells, and a need for strong visual stimulation all belong in the map—but not in one diagnostic bucket. Autism may shape sensory processing while POTS, migraine, hEDS, hormones, sleep, and medication can alter the same signals.",
    translation:
      "Sometimes the body whispers. Mine sends twelve contradictory emergency broadcasts and a laser show.",
    tags: ["DSM B4", "interoception", "POTS/migraine overlap"],
  },
  {
    id: "burnout",
    number: "06",
    clinical: "Autistic burnout & reduced camouflage",
    merry: "THE MASK DIDN'T SLIP. THE FACTORY CLOSED.",
    lens: "lived",
    strength: "strong",
    body:
      "Burnout was not ordinary tiredness. Long-term adaptation stopped being sustainable; old performance layers became less available, the Southern accent returned more strongly, and authenticity became less negotiable. Loss of masking can look like becoming ‘more autistic’ when the costly suppression is what actually changed.",
    translation:
      "I did not suddenly acquire a new personality. The unpaid costume department went on strike.",
    tags: ["burnout", "unmasking", "identity"],
  },
  {
    id: "authenticity",
    number: "07",
    clinical: "Demand for internal coherence",
    merry: "FAKE POLITE LANGUAGE MAKES MY SOUL ITCH",
    lens: "lived",
    strength: "probable",
    body:
      "Generic motivation, corporate performance, canned sentiment, and social scripts that say nothing tend to produce irritation rather than comfort. Clear meaning, intellectual honesty, specificity, humor, and real enthusiasm land better.",
    translation:
      "If a sentence could be printed over a sunset and sold at Hobby Lobby, my nervous system has already rejected it.",
    tags: ["communication style", "authenticity", "not diagnostic alone"],
  },
  {
    id: "art",
    number: "08",
    clinical: "Creative system-building as regulation and cognition",
    merry: "THE ART IS A NERVOUS SYSTEM WITH SHADER SUPPORT",
    lens: "lived",
    strength: "strong",
    body:
      "The art practice externalizes the way the mind already works: recursive, associative, maximalist, mathematical, cross-disciplinary, and alive with controlled accidents. Color, motion, code, taxonomy, and meaning are not separate decorations—they are a thinking environment.",
    translation:
      "The pretty thing is also Weaire–Phelan foam, a fungal network, a cosmology, six repos, and a joke nobody notices until they read the description.",
    tags: ["special interest", "pattern synthesis", "creative regulation"],
  },
];

const questions = [
  "What were my earliest sensory rules—clothes, sounds, food, touch, light, motion?",
  "Which social behaviors did I consciously rehearse, copy, or reverse-engineer as a kid?",
  "What happens in my body immediately before a shutdown, meltdown, or vanishing act?",
  "Which routines are true sameness-needs, and which are ADHD scaffolding that keeps the wheels on?",
  "What did adults call dramatic, lazy, bossy, shy, gifted, intense, or too sensitive?",
  "Which movements, sounds, textures, phrases, or repetitions have functioned as stims—even disguised ones?",
];

function NeuralField({ masked }: { masked: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let visible = true;
    let pointerX = -1000;
    let pointerY = -1000;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const phi = (1 + Math.sqrt(5)) / 2;
    const nodes = Array.from({ length: 76 }, (_, index) => ({
      u: (0.5 + Math.cos(index * phi * Math.PI * 2) * (0.14 + (index % 13) / 17)) % 1,
      v: (index * 0.61803398875) % 1,
      phase: index * 0.73,
      size: 0.8 + (index % 5) * 0.42,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const move = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
    };

    const visibility = () => {
      visible = !document.hidden;
      if (visible && !frame) frame = requestAnimationFrame(draw);
    };

    const draw = (time: number) => {
      frame = 0;
      context.clearRect(0, 0, width, height);
      const seconds = reduced ? 0 : time * 0.00012;
      const activeCount = masked ? 38 : nodes.length;
      const positions: { x: number; y: number; d: number }[] = [];

      for (let i = 0; i < activeCount; i += 1) {
        const node = nodes[i];
        const drift = masked ? 0 : Math.sin(seconds * 3 + node.phase) * 16;
        const x = node.u * width + drift;
        const y = node.v * height + Math.cos(seconds * 2 + node.phase) * (masked ? 0 : 22);
        const d = Math.hypot(pointerX - x, pointerY - y);
        positions.push({ x, y, d });
      }

      for (let i = 0; i < positions.length; i += 1) {
        const a = positions[i];
        for (let j = i + 1; j < positions.length; j += 1) {
          const b = positions[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance > (masked ? 105 : 145)) continue;
          const nearPointer = Math.min(a.d, b.d) < 190;
          const alpha = (1 - distance / (masked ? 105 : 145)) * (masked ? 0.055 : nearPointer ? 0.36 : 0.12);
          context.strokeStyle = masked
            ? `rgba(24, 22, 27, ${alpha})`
            : `hsla(${(i * 43 + j * 17 + seconds * 90) % 360}, 100%, 62%, ${alpha})`;
          context.lineWidth = nearPointer && !masked ? 1.7 : 0.72;
          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.stroke();
        }
      }

      positions.forEach((position, index) => {
        const pulse = masked ? 1 : 1 + Math.sin(seconds * 7 + index) * 0.45;
        context.fillStyle = masked
          ? "rgba(24, 22, 27, .16)"
          : `hsla(${(index * 67 + seconds * 110) % 360}, 100%, 60%, ${position.d < 190 ? 0.92 : 0.48})`;
        context.beginPath();
        context.arc(position.x, position.y, nodes[index].size * pulse, 0, Math.PI * 2);
        context.fill();
      });

      if (visible && !reduced) frame = requestAnimationFrame(draw);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    frame = requestAnimationFrame(draw);

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", move);
      document.removeEventListener("visibilitychange", visibility);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [masked]);

  return <canvas ref={canvasRef} className="neural-field" aria-hidden="true" />;
}

function StateConsole() {
  const [state, setState] = useState({ sensory: 72, focus: 91, friction: 66, social: 28 });
  const description = useMemo(() => {
    if (state.sensory > 78 && state.friction > 62)
      return "EVERYTHING IS LOUD AND THE FIRST STEP HAS ESCAPED THE BUILDING.";
    if (state.focus > 82 && state.sensory < 75)
      return "PORTAL OPEN. FOURTEEN REPOS MAY EXIST BY MIDNIGHT.";
    if (state.social < 35 && state.friction > 55)
      return "LANGUAGE AVAILABLE. CUSTOMER-SERVICE PERSONA ABSENT.";
    if (state.social > 75 && state.sensory > 65)
      return "MASK RUNNING HOT. INVOICE PENDING.";
    return "VARIABLE, FUNCTIONAL, AND ABSOLUTELY NOT A SINGLE LINEAR SPECTRUM.";
  }, [state]);

  const controls = [
    ["sensory", "sensory volume"],
    ["focus", "focus gravity"],
    ["friction", "task ignition friction"],
    ["social", "social translation budget"],
  ] as const;

  return (
    <div className="state-console">
      <div className="console-readout" aria-live="polite">
        <span>CURRENT SIMULATION</span>
        <strong>{description}</strong>
      </div>
      <div className="console-controls">
        {controls.map(([key, label]) => (
          <label key={key}>
            <span>{label}</span>
            <output>{state[key]}%</output>
            <input
              type="range"
              min="0"
              max="100"
              value={state[key]}
              aria-label={label}
              onChange={(event) => setState({ ...state, [key]: Number(event.target.value) })}
            />
          </label>
        ))}
      </div>
      <p className="console-note">
        This is an experiential toy, not a test. Move the variables and watch one nervous system become several different Tuesdays.
      </p>
    </div>
  );
}

export default function Home() {
  const [masked, setMasked] = useState(false);
  const [lens, setLens] = useState<Lens>("all");

  const switchMask = () => {
    const next = !masked;
    setMasked(next);
    window.localStorage.setItem("merry-mask-mode", next ? "masked" : "unmasked");
  };

  const visibleSignals = signals.filter((signal) => lens === "all" || signal.lens === lens);

  return (
    <div className={masked ? "site-shell masked" : "site-shell unmasked"}>
      <NeuralField masked={masked} />
      <a className="skip-link" href="#atlas">Skip to the atlas</a>

      <header className="masthead">
        <a href="#top" className="sigil" aria-label="Back to top">M//A</a>
        <nav aria-label="Main navigation">
          <a href="#atlas">patterns</a>
          <a href="#criteria">criteria</a>
          <a href="#overlap">overlap</a>
          <a href="#questions">unknowns</a>
        </nav>
        <button className="mask-switch" type="button" onClick={switchMask} aria-pressed={masked}>
          <span className="switch-light" />
          {masked ? "TAKE THE MASK OFF" : "PUT THE MASK ON"}
        </button>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <p className="eyebrow">A LIVING FIELD GUIDE // SELF-ASSESSMENT // NOT A DIAGNOSIS</p>
          <h1 id="hero-title">
            <span>MY</span>
            <span>AUTISM</span>
          </h1>
          <div className="hero-orbit orbit-one">PATTERN</div>
          <div className="hero-orbit orbit-two">MASK</div>
          <div className="hero-orbit orbit-three">SIGNAL</div>
          <div className="hero-copy">
            <p className="hero-kicker">Merry&apos;s field notes from inside the machine.</p>
            <p>
              Not <em>what is autism?</em> This is: <strong>what does autism appear to be doing in me?</strong> A map of the patterns, overlaps, contradictions, body static, spectacular obsessions, and expensive social special effects.
            </p>
            <a className="enter-link" href="#atlas">ENTER THE PATTERN LATTICE ↓</a>
          </div>
          <div className="hero-stamp" aria-label="Working hypothesis">
            <span>WORKING HYPOTHESIS</span>
            <strong>AuDHD</strong>
            <small>LATE-RECOGNIZED / MASK-WORN / STILL INVESTIGATING</small>
          </div>
        </section>

        <section className="declaration" aria-labelledby="declaration-title">
          <div className="section-mark">00 / READ ME FIRST</div>
          <div>
            <h2 id="declaration-title">I am not collecting cute quirks for a personality horoscope.</h2>
            <p>
              I am looking for one explanation with enough structural integrity to connect decades of masking, intensity, executive dysfunction, sensory weirdness, social translation, burnout, and the way my mind builds entire galaxies around an idea. Autism is not the only possible cause of every item here. It is the lens currently making the most things stop looking random.
            </p>
          </div>
          <aside>
            <strong>THE RULE:</strong>
            <p>Validate the experience. Separate evidence from certainty. Never turn a living person into a checklist carcass.</p>
          </aside>
        </section>

        <section id="atlas" className="atlas" aria-labelledby="atlas-title">
          <header className="section-heading">
            <div>
              <p className="eyebrow">01 / RECURRING SIGNALS</p>
              <h2 id="atlas-title">The Pattern Lattice</h2>
            </div>
            <p>Filter the map. Open a signal. The sterile label and the lived translation are both true; one is simply wearing slacks.</p>
          </header>

          <div className="lens-filter" role="group" aria-label="Filter signals by evidence lens">
            {([
              ["all", "all signals"],
              ["dsm", "DSM anchors"],
              ["lived", "lived experience"],
              ["overlap", "overlap zone"],
            ] as [Lens, string][]).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={lens === value ? "active" : ""}
                aria-pressed={lens === value}
                onClick={() => setLens(value)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="signal-stack">
            {visibleSignals.map((signal) => (
              <details className={`signal signal-${signal.strength}`} key={signal.id} id={signal.id}>
                <summary>
                  <span className="signal-number">{signal.number}</span>
                  <span className="signal-title">
                    <small>{masked ? signal.clinical : signal.merry}</small>
                    <strong>{masked ? signal.merry : signal.clinical}</strong>
                  </span>
                  <span className="signal-strength">{signal.strength}</span>
                  <span className="signal-open" aria-hidden="true">＋</span>
                </summary>
                <div className="signal-body">
                  <p>{signal.body}</p>
                  <blockquote>{signal.translation}</blockquote>
                  <div className="signal-tags">
                    {signal.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="spectrum" aria-labelledby="spectrum-title">
          <div className="section-heading inverse">
            <div>
              <p className="eyebrow">02 / STATE, NOT SCORE</p>
              <h2 id="spectrum-title">The spectrum is a mixing board, not a goddamn line.</h2>
            </div>
            <p>A person can be articulate, overwhelmed, socially skilled, unable to begin a tiny task, and building a computational universe at the same time.</p>
          </div>
          <StateConsole />
        </section>

        <section id="criteria" className="criteria" aria-labelledby="criteria-title">
          <header className="section-heading">
            <div>
              <p className="eyebrow">03 / DSM-5, TRANSLATED</p>
              <h2 id="criteria-title">Evidence, not bingo</h2>
            </div>
            <p>The formal framework matters. So does admitting exactly where the personal evidence is still thin.</p>
          </header>

          <div className="criteria-river">
            <article className="criterion anchored">
              <span>A</span>
              <div><h3>Social communication & interaction</h3><p>Masking, scripted compensation, social performance costs, and post-burnout unmasking strongly justify exploration. More concrete childhood examples are still needed across reciprocity, nonverbal communication, and relationship navigation.</p></div>
              <strong>SUPPORTED / STILL MAPPING</strong>
            </article>
            <article className="criterion anchored">
              <span>B3</span>
              <div><h3>Intense or highly focused interests</h3><p>This is the loudest piece of evidence: unusual depth, sustained absorption, system-building, cross-domain pattern synthesis, and interests that reorganize time, attention, identity, and output.</p></div>
              <strong>STRONG</strong>
            </article>
            <article className="criterion probable">
              <span>B4</span>
              <div><h3>Sensory reactivity or sensory seeking</h3><p>There is meaningful sensory evidence, but the body is a crowded crime scene. Migraine, possible POTS/hEDS, hormones, medication, sleep, and interoception all need to remain in the differential map.</p></div>
              <strong>PROBABLE / OVERLAPPING</strong>
            </article>
            <article className="criterion open">
              <span>B1–2</span>
              <div><h3>Repetition, stimming, sameness & transitions</h3><p>Transition friction and routines are present, but the line between autistic inertia, ADHD scaffolding, preference, and true sameness-needs needs more lived examples. Stims may also have been hidden, socialized, or mislabeled.</p></div>
              <strong>MORE EVIDENCE NEEDED</strong>
            </article>
            <article className="criterion open">
              <span>C–D</span>
              <div><h3>Early development & real-life impact</h3><p>Childhood masking clues and adult burnout support the timeline, while executive strain and sensory load show impact. A fuller developmental history would make the pattern more rigorous.</p></div>
              <strong>PARTIAL / IMPORTANT</strong>
            </article>
          </div>
        </section>

        <section id="overlap" className="overlap" aria-labelledby="overlap-title">
          <div className="overlap-copy">
            <p className="eyebrow">04 / THE CROWDED CONTROL ROOM</p>
            <h2 id="overlap-title">Not every weird thing is autism.</h2>
            <p>That does not make any of it imaginary. It means several systems can produce similar smoke, and useful self-understanding comes from noticing which machine is actually on fire.</p>
          </div>
          <div className="orbit-system" aria-label="Overlapping influences: autism, ADHD, and body variables">
            <div className="orbit orbit-autism"><strong>AUTISM</strong><span>masking<br />sensory processing<br />monotropism<br />social translation</span></div>
            <div className="orbit orbit-adhd"><strong>ADHD</strong><span>activation<br />novelty<br />working memory<br />time blindness</span></div>
            <div className="orbit orbit-body"><strong>BODY STATIC</strong><span>sleep<br />hormones<br />migraine<br />possible POTS/hEDS</span></div>
            <div className="orbit-core">ME<br /><small>one organism,<br />not three folders</small></div>
          </div>
        </section>

        <section className="timeline" aria-labelledby="timeline-title">
          <header className="section-heading inverse">
            <div>
              <p className="eyebrow">05 / MASK ARCHAEOLOGY</p>
              <h2 id="timeline-title">The person did not appear after burnout.</h2>
            </div>
            <p>Burnout can expose the architecture that constant adaptation kept hidden.</p>
          </header>
          <ol>
            <li><span>EARLY</span><strong>Study the room.</strong><p>Learn which versions of intensity, speech, emotion, and behavior are rewarded. Build the role before there is language for the cost.</p></li>
            <li><span>ADAPT</span><strong>Become convincing.</strong><p>Competence and humor make excellent camouflage. External functioning keeps outrunning internal sustainability.</p></li>
            <li><span>CRASH</span><strong>The compensation fails.</strong><p>Energy, social tolerance, speech patterns, executive function, and sensory filtering no longer obey the old production schedule.</p></li>
            <li><span>AFTER</span><strong>Stop calling authenticity damage.</strong><p>The returning accent, bluntness, weirdness, boundaries, and visible needs are not proof of regression. They may be proof that suppression lost its funding.</p></li>
          </ol>
        </section>

        <section id="questions" className="questions" aria-labelledby="questions-title">
          <header className="section-heading">
            <div>
              <p className="eyebrow">06 / OPEN PORTALS</p>
              <h2 id="questions-title">Questions worth following</h2>
            </div>
            <p>This site is a living investigation. Unknown does not mean absent; it means we have found the next place to look.</p>
          </header>
          <ul>
            {questions.map((question, index) => (
              <li key={question}><span>{String(index + 1).padStart(2, "0")}</span>{question}</li>
            ))}
          </ul>
        </section>

        <section className="art-system" aria-labelledby="art-title">
          <p className="eyebrow">07 / THE OUTPUT IS ALSO EVIDENCE</p>
          <h2 id="art-title">I do not make one picture.<br />I cultivate a possibility engine.</h2>
          <p>The repos, shaders, taxonomies, mathematical creatures, psychedelic cosmologies, accidental collaborations, and recursive tools all share one behavior: distant things are dragged into relation until a new system begins breathing. That is art. It is also a fairly accurate scan of the mind that made it.</p>
          <div className="word-swarm" aria-hidden="true">
            <span>GLSL</span><span>FUNGI</span><span>QUASICRYSTALS</span><span>ASCII</span><span>RECURSION</span><span>COLOR</span><span>MCKENNA</span><span>VORONOI</span><span>GLITCH</span><span>COSMOLOGY</span><span>REPOS</span><span>HAPPY ACCIDENTS</span>
          </div>
        </section>
      </main>

      <footer>
        <p><strong>MY AUTISM</strong> is an evolving personal map, not medical advice and not a claim that every autistic person works like Merry.</p>
        <p>Built from lived experience, DSM-5 structure, late-diagnosed perspectives, and a refusal to make the nervous system beige.</p>
        <a href="#top">RETURN TO THE TOP ↑</a>
      </footer>
    </div>
  );
}
