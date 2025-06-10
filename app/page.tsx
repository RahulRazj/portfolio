'use client';

import Link from 'next/link';
import { GiBatMask } from "react-icons/gi";
import HeroSection from './components/HeroSection';
import SystemArchitecture from './components/SystemArchitecture';
import TechnicalMetrics from './components/TechnicalMetrics';
import ContactSection from './components/ContactSection';

export default function Home() {
	return (
		<main className="min-h-screen bg-[#1A1A1A] text-white overflow-x-hidden">
			<div className="fixed top-9 right-5 md:top-12 md:right-24 z-50 group">
				<div className="absolute -top-8 right-0 w-32 bg-black/90 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
					Enter the Batcave... if you dare
				</div>
				<Link
					href="/batcave"
					className="p-2 text-white/90 hover:text-white transition-all duration-300 block"
					aria-label="Enter Batcave"
				>
					<GiBatMask className="w-6 h-6 md:w-7 md:h-7 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] group-hover:scale-110" />
				</Link>
			</div>
			<HeroSection />
			<SystemArchitecture />
			<TechnicalMetrics />
			<ContactSection />
		</main>
	);
}
