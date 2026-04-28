import { ArrowRight } from 'lucide-react'
import { cn } from '../../lib/cn'
import { formatDateShort } from '../../lib/format'
import type { DeliveryItem } from '../../data/mockActivity'

type DeliveryRowProps = {
  item: DeliveryItem
  isLast?: boolean
}

const statusLabel: Record<DeliveryItem['status'], string> = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  done: 'Done',
  overdue: 'Overdue',
}

const statusClass: Record<DeliveryItem['status'], string> = {
  pending: 'pill-booked',
  'in-progress': 'pill-shooting',
  done: 'pill-delivered',
  overdue: 'bg-rose/10 text-rose pill',
}

export default function DeliveryRow({ item, isLast }: DeliveryRowProps) {
  return (
    <div
      className={cn(
        'group flex items-center gap-4 px-4 py-3.5 cursor-pointer transition-colors duration-400 hover:bg-canvas-deeper',
        !isLast && 'border-b border-muted'
      )}
    >
      {/* Couple name */}
      <div className="w-36 shrink-0">
        <p className="serif font-normal text-[13px] text-ink leading-tight">
          {item.coupleName}
        </p>
      </div>

      {/* Task */}
      <div className="flex-1 min-w-0">
        <p className="font-sans text-[13px] text-ink-soft truncate">{item.task}</p>
      </div>

      {/* Due date */}
      <div className="w-32 shrink-0 text-right">
        <p
          className={cn(
            'serif italic text-[12px]',
            item.isUrgent ? 'text-rose' : 'text-whisper'
          )}
        >
          {formatDateShort(item.dueDate)}
        </p>
      </div>

      {/* Status pill */}
      <div className="w-24 shrink-0 flex justify-center">
        <span className={cn(statusClass[item.status])}>
          {statusLabel[item.status]}
        </span>
      </div>

      {/* Arrow */}
      <ArrowRight
        size={13}
        strokeWidth={1.5}
        className="text-whisper shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-400"
      />
    </div>
  )
}
