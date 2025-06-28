'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { GiBatMask } from 'react-icons/gi';
import { useState, useEffect, useRef } from 'react';
import terminalCommands from '../../data/terminal-commands.json';

interface LinkData {
	display: string;
	url: string;
}

interface CommandLinks {
	[key: string]: LinkData;
}

interface Command {
	name: string;
	aliases: string[];
	description: string;
	usage: string;
	output: string;
	hidden: boolean;
	links?: CommandLinks;
}

export default function Batcave() {
	const [commandHistory, setCommandHistory] = useState<string[]>([]);
	const [currentCommand, setCurrentCommand] = useState('');
	const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
	const [commandIndex, setCommandIndex] = useState(-1);
	const inputRef = useRef<HTMLInputElement>(null);
	const terminalRef = useRef<HTMLDivElement>(null);
	const bottomRef = useRef<HTMLDivElement>(null);

	// Auto-scroll to bottom
	useEffect(() => {
		if (terminalRef.current && currentCommand) {
			setTimeout(() => {
				if (terminalRef.current) {
					terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
				}
			}, 50);
		}
	}, [currentCommand]);

	// Scroll to bottom when output changes
	useEffect(() => {
		if (bottomRef.current) {
			bottomRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [terminalOutput]);

	// Focus input after command execution
	useEffect(() => {
		if (terminalOutput.length > 0) {
			setTimeout(() => {
				if (inputRef.current) {
					inputRef.current.focus();
				}
			}, 100);
		}
	}, [terminalOutput]);

	// Focus input on mount
	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, []);

	const findCommand = (inputCmd: string) => {
		const command = inputCmd.toLowerCase().trim();
		
		// First search in regular commands
		const regularCommand = (terminalCommands.commands as Command[]).find(cmd => 
			cmd.name === command || cmd.aliases.includes(command)
		);
		
		if (regularCommand) {
			return regularCommand;
		}
		
		// If not found in regular commands, search in easter eggs
		const easterEgg = (terminalCommands.b99EasterEggs as any[]).find(cmd => 
			cmd.name === command || cmd.aliases.includes(command)
		);
		
		return easterEgg;
	};

	const executeCommand = (cmd: string) => {
		const command = findCommand(cmd);
		let output = '';

		if (!command) {
			output = `Command not found: ${cmd}. Type 'help' for available commands.`;
		} else {
			switch (command.name) {
				case 'clear':
					setTerminalOutput([]);
					return;
				case 'date':
					output = new Date().toLocaleString();
					break;
				case 'batman':
					const quotes = terminalCommands.batmanQuotes;
					output = quotes[Math.floor(Math.random() * quotes.length)];
					break;
				case 'exit':
				case 'gui':
					window.location.href = '/';
					return;
				case 'help':
					// Dynamically generate help output based on hidden property
					const visibleCommands = terminalCommands.commands.filter(cmd => !cmd.hidden);
					
					// Calculate maximum command name length for padding
					const maxCommandLength = Math.max(...visibleCommands.map(cmd => cmd.name.length));
					
					// Calculate maximum length including aliases for description alignment
					const maxTotalLength = Math.max(...visibleCommands.map(cmd => {
						const aliases = cmd.aliases.length > 0 ? ` (${cmd.aliases.join(', ')})` : '';
						return cmd.name.length + aliases.length;
					}));
					
					const helpLines = visibleCommands.map(cmd => {
						const aliases = cmd.aliases.length > 0 ? ` (${cmd.aliases.join(', ')})` : '';
						// Pad the command name to ensure aliases align
						const paddedName = cmd.name.padEnd(maxCommandLength + 2);
						// Pad the command + aliases to ensure descriptions align
						const commandWithAliases = paddedName + aliases;
						const paddedCommand = commandWithAliases.padEnd(maxTotalLength + 4);
						return `- ${paddedCommand}: ${cmd.description}`;
					});
					output = `Available commands:\n${helpLines.join('\n')}`;
					break;
				default:
					output = command.output;
					// Replace display links with clickable links if links exist
					if (command.links) {
						Object.entries(command.links as CommandLinks).forEach(([, linkData]) => {
							const displayText = linkData.display;
							const url = linkData.url;
							output = output.replace(
								displayText, 
								`<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #60a5fa; text-decoration: underline; cursor: pointer;" onmouseover="this.style.color='#93c5fd'" onmouseout="this.style.color='#60a5fa'">${displayText}</a>`
							);
						});
					}
			}
		}

		setTerminalOutput(prev => [...prev, `<span class="text-green-400 font-semibold">dev@rahul</span><span class="text-white/60 mx-1">:</span><span class="text-blue-400 font-semibold drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]">~</span><span class="text-white/60 mx-1">$</span> ${cmd}`, output]);
		setCommandHistory(prev => [...prev, cmd]);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (currentCommand.trim()) {
			executeCommand(currentCommand);
			setCurrentCommand('');
			setCommandIndex(-1);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (commandIndex < commandHistory.length - 1) {
				const newIndex = commandIndex + 1;
				setCommandIndex(newIndex);
				setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex]);
			}
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (commandIndex > 0) {
				const newIndex = commandIndex - 1;
				setCommandIndex(newIndex);
				setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex]);
			} else if (commandIndex === 0) {
				setCommandIndex(-1);
				setCurrentCommand('');
			}
		}
	};

	return (
		<main 
			className="min-h-screen bg-[#1A1A1A] text-white p-4 font-mono relative cursor-text"
			onClick={() => inputRef.current?.focus()}
		>
			{/* Back Button - Fixed Position */}
			<div className="fixed top-4 left-8 group z-50">
				<div className="absolute top-full left-0 mt-2 w-48 text-white/80 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
					Return to Gotham City... The night calls
				</div>
				<Link
					href="/"
					className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] group-hover:scale-110"
				>
					<GiBatMask className="w-5 h-5" />
					<span>Back to Gotham</span>
				</Link>
			</div>

			{/* Main Content */}
			<div className="max-w-4xl mx-auto h-screen flex flex-col">
				{/* ASCII Art */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="flex flex-col items-center mt-8"
				>
					<pre className="text-white/90 text-xs sm:text-sm md:text-base lg:text-lg whitespace-pre text-center overflow-x-auto">
{`
    ██████╗  █████╗ ████████╗ ██████╗ █████╗ ██╗   ██╗███████╗
    ██╔══██╗██╔══██╗╚══██╔══╝██╔════╝██╔══██╗██║   ██║██╔════╝
    ██████╔╝███████║   ██║   ██║     ███████║██║   ██║█████╗  
    ██╔══██╗██╔══██║   ██║   ██║     ██╔══██║╚██╗ ██╔╝██╔══╝  
    ██████╔╝██║  ██║   ██║   ╚██████╗██║  ██║ ╚████╔╝ ███████╗
    ╚═════╝ ╚═╝  ╚═╝   ╚═╝    ╚═════╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝
`}
					</pre>
					
					{/* CLI Welcome Text */}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
						className="mt-8 text-left w-full"
					>
						<p className="text-white/80 text-base mb-4">
							Welcome to my portfolio CLI! 👋
						</p>
						<p className="text-white/70 text-base mb-6">
							Type &quot;help&quot; or &quot;h&quot; or &quot;?&quot; to see available commands.
						</p>
					</motion.div>
				</motion.div>

				{/* Terminal */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.6 }}
					className="flex-1 pb-8"
				>
					<div 
						ref={terminalRef}
						className="h-full overflow-y-auto space-y-1"
					>
						{/* Command Output */}
						{terminalOutput.map((line, index) => (
							<div key={index} className="text-white/90 whitespace-pre-wrap text-base">
								{line.includes('<span') ? (
									<span dangerouslySetInnerHTML={{ __html: line }} />
								) : line.includes('<a href=') ? (
									<div dangerouslySetInnerHTML={{ __html: line }} />
								) : (
									line
								)}
							</div>
						))}

						{/* Scroll Anchor */}
						<div ref={bottomRef} />

						{/* Command Input */}
						<form onSubmit={handleSubmit} className="flex items-center py-2 cursor-text" onClick={() => inputRef.current?.focus()}>
							<div className="flex items-center text-base">
								<span className="text-green-400 font-semibold hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.8)] transition-all duration-300">dev@rahul</span>
								<span className="text-white/60 mx-1">:</span>
								<span className="text-blue-400 font-semibold drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]">~</span>
								<span className="text-white/60 mx-1">$</span>
							</div>
							<input
								ref={inputRef}
								type="text"
								value={currentCommand}
								onChange={(e) => setCurrentCommand(e.target.value)}
								onKeyDown={handleKeyDown}
								className="flex-1 bg-transparent text-white outline-none border-none ml-2 text-base py-1"
								autoComplete="off"
							/>
						</form>
					</div>
				</motion.div>
			</div>
		</main>
	);
} 