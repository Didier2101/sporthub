"use client";

import { IconType } from "react-icons/lib";

interface FeatureCardProps {
    icon: IconType;
    title: string;
    description: string;
}


export const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => (
    <div className="group relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-gray-100 hover:border-green-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 opacity-0 group-hover:opacity-100 rounded-xl sm:rounded-2xl transition-opacity duration-300"></div>
        <div className="relative">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                <Icon className="text-white text-base sm:text-lg" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">{title}</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
    </div>
);