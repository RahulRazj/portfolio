'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GiBatMask, GiBatBlade } from 'react-icons/gi';
import { FaTools } from 'react-icons/fa';

export default function Batcave() {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<main className="min-h-screen bg-[#1A1A1A] text-white p-8">
			<div className="max-w-4xl mx-auto">
				<Link
					href="/"
					className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8"
				>
					<GiBatMask className="w-5 h-5" />
					<span>Return to Gotham</span>
				</Link>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="text-center mb-12"
				>
					<h1 className="text-4xl md:text-6xl font-bold mb-4">The Batcave</h1>
					<p className="text-xl text-gray-400">Under Construction</p>
				</motion.div>

				<div className="grid md:grid-cols-2 gap-8">
					<motion.div
						whileHover={{ scale: 1.02 }}
						className="bg-black/30 p-6 rounded-lg border border-gray-800"
					>
						<FaTools className="w-8 h-8 text-yellow-500 mb-4" />
						<h2 className="text-2xl font-bold mb-2">Construction Status</h2>
						<p className="text-gray-400">
							The Batcave is currently being upgraded with new security systems and
							advanced technology. Check back soon for the grand opening!
						</p>
					</motion.div>

					<motion.div
						whileHover={{ scale: 1.02 }}
						className="bg-black/30 p-6 rounded-lg border border-gray-800"
					>
						<GiBatBlade className="w-8 h-8 text-red-500 mb-4" />
						<h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
						<ul className="text-gray-400 list-disc list-inside space-y-2">
							<li>Interactive Bat Computer</li>
							<li>Secret Passageways</li>
							<li>Training Facilities</li>
							<li>Vehicle Hangar</li>
						</ul>
					</motion.div>
				</div>

				<motion.div
					onHoverStart={() => setIsHovered(true)}
					onHoverEnd={() => setIsHovered(false)}
					className="mt-12 text-center"
				>
					<p className="text-gray-500 italic">
						{isHovered
							? "The night is darkest just before the dawn..."
							: "Hover for a secret message..."}
					</p>
				</motion.div>
			</div>
		</main>
	);
} 