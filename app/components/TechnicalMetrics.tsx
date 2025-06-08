'use client';

import { motion } from 'framer-motion';

export default function TechnicalMetrics() {
	return (
		<section className="py-20 px-4 bg-gray-900/50">
			<div className="max-w-6xl mx-auto">
				<motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-3xl font-bold mb-12 text-center">
					Impact & Achievements
				</motion.h2>

				<div className="grid grid-cols-1 gap-12">

					{/* System Performance */}
					<div>
						<h3 className="text-xl font-semibold mb-6 text-green-400">System Performance</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<motion.div
								initial={{ opacity: 0, scale: 0.95 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								className="bg-gray-800/50 rounded-lg p-6 border border-gray-700"
							>
								<h4 className="text-lg font-semibold text-gray-300">Data Propagation Engine</h4>
								<ul className="mt-2 space-y-2 text-gray-400">
									<li>• Engineered C# Channels to queue and process system changes</li>
									<li>• Reduced processing lag by 60% via asynchronous background tasks</li>
									<li>• Built resilient retry mechanisms for high fault tolerance</li>
								</ul>
							</motion.div>
							<motion.div
								initial={{ opacity: 0, scale: 0.95 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								className="bg-gray-800/50 rounded-lg p-6 border border-gray-700"
							>
								<h4 className="text-lg font-semibold text-gray-300">Database Optimization</h4>
								<ul className="mt-2 space-y-2 text-gray-400">
									<li>• Reduced query time by 70% with smart indexing strategies</li>
									<li>• Applied compound indexes to optimize frequent access patterns</li>
									<li>• Leveraged aggregation pipelines for efficient data processing</li>
								</ul>
							</motion.div>

						</div>
					</div>

					{/* Infrastructure & DevOps */}
					<div>
						<h3 className="text-xl font-semibold mb-6 text-green-400">Infrastructure & DevOps</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

							<motion.div
								initial={{ opacity: 0, scale: 0.95 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								className="bg-gray-800/50 rounded-lg p-6 border border-gray-700"
							>
								<h4 className="text-lg font-semibold text-gray-300">On-Prem Deployments</h4>
								<ul className="mt-2 space-y-2 text-gray-400">
									<li>• Installed and deployed .NET applications on on-premises servers</li>
									<li>• Handled configuration management, service setup, and monitoring</li>
									<li>• Ensured security and performance tuning for production usage</li>
								</ul>
							</motion.div>
							<motion.div
								initial={{ opacity: 0, scale: 0.95 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								className="bg-gray-800/50 rounded-lg p-6 border border-gray-700"
							>

								<h4 className="text-lg font-semibold text-gray-300">Automated Testing & Deployments</h4>
								<ul className="mt-2 space-y-2 text-gray-400">
									<li>• Enforced test coverage via Husky pre-commit hooks</li>
									<li>• Auto-deployments via GitHub Actions on feature & prod branches</li>
									<li>• Blocked low-quality commits from main branches</li>
								</ul>

							</motion.div>
						</div>
					</div>


					{/* Development & Leadership */}
					<div>
						<h3 className="text-xl font-semibold mb-6 text-green-400">Development & Leadership</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<motion.div
								initial={{ opacity: 0, scale: 0.95 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								className="bg-gray-800/50 rounded-lg p-6 border border-gray-700"
							>
								<h4 className="text-lg font-semibold text-gray-300">Backend Engineering</h4>
								<ul className="mt-2 space-y-2 text-gray-400">
									<li>• Created full-stack solutions using Angular, Node.js, .NET Core</li>
									<li>• Developed internal API services to support business needs</li>
									<li>• Built real-time sync with WebSockets for instant user updates</li>
								</ul>
							</motion.div>
							<motion.div
								initial={{ opacity: 0, scale: 0.95 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								className="bg-gray-800/50 rounded-lg p-6 border border-gray-700"
							>
								<h4 className="text-lg font-semibold text-gray-300">Team Contributions</h4>
								<ul className="mt-2 space-y-2 text-gray-400">
									<li>• Wrote reusable documentation and setup guides for services</li>
									<li>• Collaborated across teams during legacy system migrations</li>
									<li>• Proactively contributed to clean code and design reviews</li>
								</ul>
							</motion.div>
						</div>
					</div>

				</div>
			</div>
		</section>
	);
}
