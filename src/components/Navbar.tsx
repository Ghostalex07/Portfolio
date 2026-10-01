import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { List, X, GithubLogo, LinkedinLogo, EnvelopeSimple } from "@phosphor-icons/react";

const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Certs", href: "#certs" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState("");
  const reduce = useReducedMotion();
  const sectionIds = useRef(NAV_ITEMS.map((i) => i.href));
  const { scrollY } = useScroll();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // La direccion se cuenta en *eventos*, no en distancia. Un salto de ancla (o un
  // hash al abrir la pagina) llega como un unico delta enorme y no debe esconder
  // la navegacion; el scroll continuo genera una racha de eventos pequenos. Asi el
  // navbar se esconde scrolleando hacia abajo y vuelve con un solo gesto hacia
  // arriba, sin castigar el click en un enlace de la propia barra.
  const lastY = useRef(0);
  const streak = useRef({ down: 0, up: 0 });
  // Un scroll restaurado por el navegador (F5 a media pagina, volver atras, un
  // ancla con scroll-behavior: smooth) llega como una rafaga de eventos
  // pequeños identica a la de un scroll del usuario, y el contador los leia como
  // "el usuario sigue bajando": la isla se quedaba escondida, con su boton de
  // menu fuera del viewport e inalcanzable hasta que el usuario scrollease
  // arriba. Solo contamos scroll que venga de una intencion del usuario.
  const userScrolled = useRef(false);

  useEffect(() => {
    const mark = () => {
      userScrolled.current = true;
    };
    const opts = { passive: true } as const;
    window.addEventListener("wheel", mark, opts);
    window.addEventListener("touchmove", mark, opts);
    window.addEventListener("keydown", mark);
    return () => {
      window.removeEventListener("wheel", mark);
      window.removeEventListener("touchmove", mark);
      window.removeEventListener("keydown", mark);
    };
  }, []);

  useMotionValueEvent(scrollY, "change", (y) => {
    const delta = y - lastY.current;
    lastY.current = y;

    if (y < 32) {
      setScrolled(false);
      setHidden(false);
      streak.current = { down: 0, up: 0 };
      return;
    }
    setScrolled(true);

    // Sin intencion del usuario no hay racha que contar: el estado "escondida"
    // se mantiene solo durante el scroll que el usuario esta haciendo ahora.
    if (!userScrolled.current) return;

    if (reduce) {
      setHidden(false);
      return;
    }
    if (delta > 0.5) {
      streak.current = { down: streak.current.down + 1, up: 0 };
    } else if (delta < -0.5) {
      streak.current = { down: 0, up: streak.current.up + 1 };
    }
    if (streak.current.down >= 4) setHidden(true);
    if (streak.current.up >= 2) setHidden(false);
  });

  useEffect(() => {
    if (!open) return;

    const focusable = () => {
      const menu = menuRef.current;
      if (!menu) return [] as HTMLElement[];
      return Array.from(
        menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      ).filter((el) => el.offsetParent !== null);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        // Devolver el foco al botón que abrió el menú: si no, cae a <body> y el
        // usuario de teclado pierde su sitio en el documento.
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;

      // Focus trap: sin esto el foco escapa del overlay y aterriza en el contenido
      // de main, que está detrás y no se puede leer con body bloqueado.
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;

      if (e.shiftKey && (current === first || !menuRef.current?.contains(current))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (current === last || !menuRef.current?.contains(current))) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Ninguna sección visible significa que el usuario está en el hero: hay que
        // limpiar active o aria-current se queda obsoleto.
        if (entries.some((entry) => entry.isIntersecting)) {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActive(`#${entry.target.id}`);
          });
        } else if (window.scrollY < 100) {
          setActive("");
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    sectionIds.current.forEach((href) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Esconderse es un desplazamiento del elemento, no un display:none: el trazado
  // tiene que seguir siendo reversible sin volver a medir nada. `inert` lo saca del
  // orden de tabulacion y del arbol de accesibilidad para que un usuario de teclado
  // no aterrice en un boton invisible. Con el menu abierto nunca se esconde: el
  // overlay cuelga de la isla.
  const concealed = hidden && !open && !reduce;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-6 md:pt-5">
        <div
          inert={concealed ? true : undefined}
          className={`mx-auto flex max-w-[80rem] items-center justify-between gap-4 rounded-pill border py-2 pl-5 pr-2 transition-[transform,opacity] duration-500 ease-out-expo md:gap-8 md:px-6 ${
            scrolled ? "nav-glass" : "nav-glass-rest"
          } ${concealed ? "-translate-y-[140%] opacity-0" : "translate-y-0 opacity-100"}`}
        >
          <a
            href="#main"
            className="rounded-pill px-1 font-mono text-lg font-bold tracking-tight text-accent"
          >
            <span className="group inline-block">
              AB
              <span className="inline-block transition-transform duration-300 group-hover:translate-y-[-2px]">_</span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 text-xs font-mono uppercase tracking-widest md:flex">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={active === item.href ? "true" : undefined}
                className={`relative transition-colors hover:text-accent ${
                  active === item.href ? "text-accent" : "text-text-secondary"
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-accent transition-all duration-300 ease-out-expo ${
                    active === item.href ? "w-full" : "w-0"
                  }`}
                />
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <a
              href="https://www.linkedin.com/in/alejandroblancojimenez/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="text-text-secondary transition-colors hover:text-accent"
            >
              <LinkedinLogo className="h-5 w-5" weight="regular" />
            </a>
            <a
              href="https://github.com/Ghostalex07"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="text-text-secondary transition-colors hover:text-accent"
            >
              <GithubLogo className="h-5 w-5" weight="regular" />
            </a>
            <a
              href="mailto:Alejandro.bj007@gmail.com"
              aria-label="Email"
              className="text-text-secondary transition-colors hover:text-accent"
            >
              <EnvelopeSimple className="h-5 w-5" weight="regular" />
            </a>
          </div>

          <button
            ref={toggleRef}
            type="button"
            className="rounded-pill border border-surface-border/70 p-1.5 text-accent transition-colors hover:border-accent/50 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="h-5 w-5" weight="regular" /> : <List className="h-6 w-6" weight="regular" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="nav-glass fixed inset-x-4 bottom-4 top-[4.5rem] z-50 overflow-y-auto rounded-card px-6 py-6 md:hidden"
          >
            <nav className="flex flex-col gap-5 font-mono text-sm uppercase tracking-widest">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="transition-colors hover:text-accent"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="mt-6 flex gap-5 border-t border-surface-border pt-5">
              <a href="https://www.linkedin.com/in/alejandroblancojimenez/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <LinkedinLogo className="h-5 w-5 text-text-secondary" weight="regular" />
              </a>
              <a href="https://github.com/Ghostalex07" target="_blank" rel="noreferrer" aria-label="GitHub">
                <GithubLogo className="h-5 w-5 text-text-secondary" weight="regular" />
              </a>
              <a href="mailto:Alejandro.bj007@gmail.com" aria-label="Email">
                <EnvelopeSimple className="h-5 w-5 text-text-secondary" weight="regular" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}