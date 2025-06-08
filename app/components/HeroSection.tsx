'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';

export default function HeroSection() {
	const name = 'Rahul Chaurasiya';
	const skills = [
		'Node.js',
		'TypeScript',
		'React',
		'Python',
		'Java',
		'SQL',
		'MongoDB',
		'AWS',
		'Docker',
		'Git',
	];

	const positions = useMemo(() => [
		'Software Developer 💻',
		'API Specialist 🔌',
		'Debugging Jedi 🧠',
		'Engineer 🧑‍💻',
		'Batman 🦇',
		'Microservices Architect 🚀',
		'Chief Stack Overflow Officer 💬',
	], []);

	const [displayPosition, setDisplayPosition] = useState(positions[0]);
	const [isDeleting, setIsDeleting] = useState(false);
	const [positionIndex, setPositionIndex] = useState(0);
	const [typingSpeed, setTypingSpeed] = useState(100);

	useEffect(() => {
		const currentPosition = positions[positionIndex] + ' ...';
		const timeout = setTimeout(() => {
			if (!isDeleting) {
				if (displayPosition === currentPosition) {
					setIsDeleting(true);
					setTypingSpeed(50); // Faster backspace
					return;
				}

				// Check if we're about to type an emoji
				const nextChar = currentPosition[displayPosition.length];
				const nextNextChar = currentPosition[displayPosition.length + 1];
				
				// If we're at a space or the next character is an emoji
				if (nextChar === ' ' || nextChar === '.') {
					// Type the space or dot normally
					setDisplayPosition(currentPosition.slice(0, displayPosition.length + 1));
				} else if (nextChar && nextNextChar && 
					(nextChar.charCodeAt(0) > 127 || nextNextChar.charCodeAt(0) > 127)) {
					// Find the next space or end of string
					const nextSpace = currentPosition.indexOf(' ', displayPosition.length);
					const endOfString = currentPosition.length;
					const nextBreak = nextSpace === -1 ? endOfString : nextSpace;
					setDisplayPosition(currentPosition.slice(0, nextBreak));
				} else {
					// Type one character at a time for regular text
					setDisplayPosition(currentPosition.slice(0, displayPosition.length + 1));
				}
				setTypingSpeed(100); // Normal typing speed
			} else {
				if (displayPosition === '') {
					setIsDeleting(false);
					setPositionIndex((prev) => (prev + 1) % positions.length);
					setTypingSpeed(100);
					return;
				}

				// Check if we're about to delete an emoji
				const lastChar = displayPosition[displayPosition.length - 1];
				const secondLastChar = displayPosition[displayPosition.length - 2];
				
				if (lastChar && secondLastChar && 
					(lastChar.charCodeAt(0) > 127 || secondLastChar.charCodeAt(0) > 127)) {
					// Find the last space
					const lastSpace = displayPosition.lastIndexOf(' ');
					if (lastSpace === -1) {
						setDisplayPosition('');
					} else {
						setDisplayPosition(displayPosition.slice(0, lastSpace));
					}
				} else {
					// Delete one character at a time for regular text
					setDisplayPosition(displayPosition.slice(0, displayPosition.length - 1));
				}
			}
		}, typingSpeed);

		return () => clearTimeout(timeout);
	}, [displayPosition, isDeleting, positionIndex, positions, typingSpeed]);

	return (
		<section className="relative min-h-screen flex items-center justify-center overflow-hidden">
			<div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-blue-600/20 opacity-10" />
			<div className="absolute inset-0">
				<div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
			</div>

			<div className="relative z-10 max-w-4xl w-full mx-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="bg-black/50 backdrop-blur-lg rounded-lg border border-gray-800 p-6"
				>
					<div className="flex items-center gap-2 mb-4">
						<div className="w-3 h-3 rounded-full bg-red-500" />
						<div className="w-3 h-3 rounded-full bg-yellow-500" />
						<div className="w-3 h-3 rounded-full bg-green-500" />
					</div>
					<div className="font-mono">
						<p className="text-green-500">$ whoami</p>
						
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
						>
							<h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">{name}</h1>
							<motion.p 
								className="text-2xl md:text-3xl font-semibold mb-2 min-h-[2.5rem] bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent"
								animate={{
									textShadow: [
										"0 0 7px rgba(74, 222, 128, 0.3)",
										"0 0 10px rgba(74, 222, 128, 0.5)",
										"0 0 7px rgba(74, 222, 128, 0.3)"
									]
								}}
								transition={{
									duration: 2,
									repeat: Infinity,
									repeatType: "reverse"
								}}
							>
								{displayPosition}
								<span className="animate-pulse">|</span>
							</motion.p>
						</motion.div>

						<p className="text-green-500 mt-4">$ skills</p>
						<div className="flex flex-wrap gap-2 mt-4">
							{skills.map((skill, index) => (
								<motion.span
									key={skill}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ 
										duration: 0.2,
										delay: index * 0.05,
										ease: "easeOut"
									}}
									whileHover={{
										boxShadow: '0 0 8px rgba(34, 197, 94, 0.5)',
										textShadow: '0 0 8px rgba(34, 197, 94, 0.5)',
									}}
									className="px-3 py-1 bg-green-500/10 text-green-400 rounded-lg border border-green-500/20 hover:bg-green-500/20 transition-all duration-200 cursor-default"
								>
									{skill}
								</motion.span>
							))}
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
