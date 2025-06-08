'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

export default function NotFound() {
	const [easterEggs, setEasterEggs] = useState({
		batSignal: false,
		joker: false,
		riddler: false,
	});

	const toggleEasterEgg = (egg: keyof typeof easterEggs) => {
		setEasterEggs((prev) => ({ ...prev, [egg]: !prev[egg] }));
	};

	return (
		<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 relative overflow-hidden">
			{/* Bat Signal Effect */}
			{easterEggs.batSignal && (
				<div className="absolute inset-0 bg-gradient-to-b from-yellow-500/20 to-transparent animate-pulse" />
			)}

			{/* Joker's Laugh */}
			{easterEggs.joker && (
				<div className="absolute top-4 right-4 text-green-500 font-bold animate-bounce">
					HAHAHA!
				</div>
			)}

			{/* Riddler's Question */}
			{easterEggs.riddler && (
				<div className="absolute bottom-4 left-4 text-green-500 font-bold">
					Riddle me this: What's always coming but never arrives?
				</div>
			)}

			<div className="text-center relative z-10">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<h1 className="text-6xl font-bold mb-4 text-green-400">404</h1>
					<p className="text-2xl mb-8 text-gray-300">Page Not Found</p>
					<p className="text-gray-400 mb-8">
						Looks like this page has been taken to Arkham Asylum.
					</p>
					<Link
						href="/"
						className="inline-block px-6 py-3 bg-green-500/10 text-green-400 rounded-lg border border-green-500/20 hover:bg-green-500/20 transition-colors"
					>
						Return to Gotham
					</Link>
				</motion.div>

				{/* Easter Eggs */}
				<div className="mt-12 space-y-4">
					<p className="text-sm text-gray-500">Find the hidden easter eggs:</p>
					<div className="flex justify-center gap-4">
						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							onClick={() => toggleEasterEgg('batSignal')}
							className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
						>
							🦇
						</motion.button>
						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							onClick={() => toggleEasterEgg('joker')}
							className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
						>
							🎭
						</motion.button>
						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							onClick={() => toggleEasterEgg('riddler')}
							className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
						>
							❓
						</motion.button>
					</div>
				</div>
			</div>

			{/* Background Elements */}
			<div className="absolute inset-0 pointer-events-none">
				<div className="absolute top-1/4 left-1/4 w-32 h-32 border border-gray-700/30 rounded-full animate-pulse" />
				<div className="absolute bottom-1/4 right-1/4 w-32 h-32 border border-gray-700/30 rounded-full animate-pulse delay-1000" />
				<div className="absolute top-1/2 left-1/2 w-32 h-32 border border-gray-700/30 rounded-full animate-pulse delay-2000" />
			</div>
		</div>
	);
} 