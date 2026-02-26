import { IconType } from "react-icons/lib";

interface StatBadgeProps {
    icon: IconType;
    value: string | number;
    label: string;
}

export const StatBadge = ({ icon: Icon, value, label }: StatBadgeProps) => (
    <div className="flex items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl px-3 py-2 sm:px-4 sm:py-3 border border-gray-200/50">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center">
            <Icon className="text-white text-sm sm:text-base" />
        </div>
        <div>
            <div className="font-bold text-gray-900 text-base sm:text-lg">{value}</div>
            <div className="text-xs text-gray-600">{label}</div>
        </div>
    </div>
);