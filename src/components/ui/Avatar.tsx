// src/components/ui/Avatar.tsx
import { getInitials } from '../../utils/names'

function Avatar({ name }: { name: string }) {
  return (
    <span
      className="grid size-12 shrink-0 place-items-center rounded-2xl border border-[color-mix(in_srgb,var(--app-accent)_28%,transparent)] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--app-accent)_28%,transparent),color-mix(in_srgb,var(--app-accent)_48%,transparent))] font-extrabold tracking-[0.04em] text-(--app-foreground)"
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  )
}

export default Avatar
