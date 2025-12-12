import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Shield,
  Globe,
  TrendingUp,
  Lock,
  Search,
} from "lucide-react";
import { useAccount } from "wagmi";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center space-y-8">
            {/* Powered by Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border">
              <span className="text-sm font-medium text-muted-foreground">
                Powered by Avail Nexus SDK
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              Maximize Your DeFi Yields{" "}
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Across All Chains
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Find the best yield opportunities for any
              token on any chain. Execute in one click with
              chain abstraction and account abstraction.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg"
              >
                Start Exploring
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/documentation"
                className="inline-flex items-center gap-2 px-8 py-4 border border-border rounded-lg font-semibold hover:bg-accent transition-all"
              >
                View Documentation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <div className="text-3xl sm:text-4xl font-bold">
                50+
              </div>
              <div className="text-sm text-muted-foreground">
                Chains Supported
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl sm:text-4xl font-bold">
                $2B+
              </div>
              <div className="text-sm text-muted-foreground">
                TVL Tracked
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl sm:text-4xl font-bold">
                1-Click
              </div>
              <div className="text-sm text-muted-foreground">
                Execution
              </div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl sm:text-4xl font-bold">
                $2.4B
              </div>
              <div className="text-sm text-muted-foreground">
                Total Value Locked
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold">
              Built for the Modern DeFi User
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features that make yield farming
              accessible to everyone
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl border border-border bg-card space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">
                Chain Abstraction
              </h3>
              <p className="text-muted-foreground">
                Access yield opportunities across 50+ chains
                without managing multiple wallets or
                bridges.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl border border-border bg-card space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">
                One-Click Execution
              </h3>
              <p className="text-muted-foreground">
                Execute complex cross-chain transactions
                with a single click using account
                abstraction.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl border border-border bg-card space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">
                Real-Time Data
              </h3>
              <p className="text-muted-foreground">
                Live yield rates from DeFi Llama and
                HyperIndex for accurate, up-to-the-second
                information.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-xl border border-border bg-card space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">
                Secure & Audited
              </h3>
              <p className="text-muted-foreground">
                Built with Avail Nexus SDK, audited
                protocols, and battle-tested smart
                contracts.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-xl border border-border bg-card space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">
                Universal Access
              </h3>
              <p className="text-muted-foreground">
                Find yields for tokens you don't own yet or
                on chains you've never used.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-xl border border-border bg-card space-y-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">
                Self-Custodial
              </h3>
              <p className="text-muted-foreground">
                Always in control of your assets. No
                intermediaries, no custodians.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to maximize your yield
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
                1
              </div>
              <h3 className="text-2xl font-semibold">
                Search Any Token
              </h3>
              <p className="text-muted-foreground">
                Enter any token symbol, even if you don't
                own it yet
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
                2
              </div>
              <h3 className="text-2xl font-semibold">
                Compare Yields
              </h3>
              <p className="text-muted-foreground">
                View real-time yields across all chains and
                protocols
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
                3
              </div>
              <h3 className="text-2xl font-semibold">
                Execute in One Click
              </h3>
              <p className="text-muted-foreground">
                Deploy capital with account abstraction
                magic
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl font-bold">
            Ready to Maximize Your Yields?
          </h2>
          <p className="text-xl text-muted-foreground">
            Start exploring yield opportunities across all
            chains today
          </p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg"
          >
            Start Exploring
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
