import type { Variants, TargetAndTransition, Easing } from 'motion/react'

// ─── Easing presets ──────────────────────────────────────

const luxuryEase: Easing = [0.16, 1, 0.3, 1]

// ─── Modal ───────────────────────────────────────────────

export const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

export const modalPanel: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.35, ease: luxuryEase },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.25, ease: luxuryEase },
  },
}

export const modalPanelReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

// ─── Card ────────────────────────────────────────────────

export const cardHover: TargetAndTransition = {
  y: -4,
  transition: { duration: 0.25, ease: luxuryEase },
}

export const cardHoverReduced: TargetAndTransition = {
  opacity: 0.95,
  transition: { duration: 0.15 },
}

// ─── Heart bounce ────────────────────────────────────────

export const heartBounce: TargetAndTransition = {
  scale: [1, 1.35, 0.85, 1.15, 1],
  transition: { duration: 0.45, ease: 'easeInOut' as Easing },
}

export const heartBounceReduced: TargetAndTransition = {
  opacity: [0.5, 1],
  transition: { duration: 0.15 },
}
