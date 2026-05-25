
import {LucideIcon} from "lucide-react"
type Props = {
    icon: Icons
}
type Icons = {
    value: LucideIcon;
    color:"blue" | "emerald" | "red" | "yellow" | "violet" | "orange";
    rounded?:boolean;
    bgColor?:boolean; 
}

const colorVariants = {
    blue: {
        text: "text-blue-600",
        bg: "bg-blue-200",
    },
    emerald: {
        text: "text-emerald-600",
        bg: "bg-emerald-200",
    },
    red: {
        text: "text-red-600",
        bg: "bg-red-200",
    },
    yellow: {
        text: "text-yellow-600",
        bg: "bg-yellow-200",
    },
    violet: {
        text: "text-violet-600",
        bg: "bg-violet-200",
    }, 
    orange: {
        text: "text-orange-600",
        bg: "bg-orange-200",
    }
}

const CustomIcon = ({icon}: Props) => {
    const Icon = icon.value
    const color = colorVariants[icon.color]
  return (
    <div className={`${icon.bgColor && `${color.bg} shadow `}  p-1 ${icon.rounded ? "rounded-box": ""} z-10`}>
        <Icon className={`${color.text}`}/>
    </div>
  )
}

export default CustomIcon