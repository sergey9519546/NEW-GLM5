'use client'

import { useInputStore } from '@/store'

interface DesktopIconProps {
  id: string
  title: string
  icon: string
  position: { x: number; y: number }
  onDoubleClick?: () => void
}

export function DesktopIcon({
  id,
  title,
  icon,
  position,
  onDoubleClick,
}: DesktopIconProps) {
  const { selectedIconId, selectIcon } = useInputStore()
  const isSelected = selectedIconId === id
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    selectIcon(id, e.ctrlKey || e.metaKey)
  }
  
  return (
    <div
      className={`desktop-icon ${isSelected ? 'selected' : ''}`}
      style={{ left: position.x, top: position.y }}
      onClick={handleClick}
      onDoubleClick={onDoubleClick}
    >
      <div className="desktop-icon-image">
        <img src={icon} alt={title} draggable={false} />
      </div>
      <div className="desktop-icon-title">
        {title}
      </div>
    </div>
  )
}
