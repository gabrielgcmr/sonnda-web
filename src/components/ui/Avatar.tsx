// src/components/ui/Avatar.tsx
import { getInitials } from '../../utils/names'
import './Avatar.css'

function Avatar({ name }: { name: string }) {
  return <span className="avatar" aria-hidden="true">{getInitials(name)}</span>
}

export default Avatar
