Exactly right! Supabase would've been a temporary bridge until Envio. Since you'd rather do it properly with Envio later, we'll skip all historical tracking for MVP.

**MVP Focus:**

- ✅ Show current balances and positions (real-time blockchain reads)
- ❌ No transaction history
- ❌ No historical charts
- ❌ No performance tracking over time

**Post-MVP with Envio:**

- All the history/analytics goodness

Let me create your PRD markdown now:

---

# Yield Aggregator DApp - Product Requirements Document

## Project Overview

### Vision

A chain-abstracted yield aggregator that allows users to stake their stablecoins in the highest-yielding protocols across multiple chains without worrying about bridging, swapping, or gas management.

### Core Value Proposition

- **For Users**: "Stake your stablecoins in the best yield with one click, regardless of which chain you're on or which token you hold"
- **Technical Innovation**: Leverages Avail Nexus SDK for true chain abstraction - users see a unified balance and the platform handles all cross-chain complexity

### Target Audience

Everyday DeFi users who want simple, optimized yield without managing multiple chains, bridges, and gas tokens.

### Project Scope

**Timeline**: Weekend MVP (Saturday-Sunday)  
**Focus**: Core functionality with clean UX  
**Philosophy**: Ship something working, iterate later

---

## Tech Stack

### Frontend Framework

**Next.js 14+ (App Router)**

- Reasoning: Server components for better performance, built-in API routes, excellent DX
- File-based routing maps cleanly to our page structure
- RSC for data fetching from DeFi Llama

### UI Components

**ShadCN UI**

- Reasoning: Pre-built accessible components, Tailwind-based, easy to customize
- Consistent design language out of the box
- Copy-paste components = fast development

### State Management

**Zustand**

- Reasoning: Lightweight, minimal boilerplate compared to Redux
- Perfect for: wallet state, user positions, UI state
- Simple hooks-based API

### Chain Abstraction

**Avail Nexus SDK**

- Role: Core infrastructure layer
- Provides:
  - Unified balance view across chains
  - Cross-chain token transfers
  - Smart contract execution (deposit into yield protocols)
  - Intent-based architecture with 10-15 sec execution
- Limitations: Currently supports ETH, USDC, USDT only (perfect for stablecoin yield)

### Yield Discovery

**DeFi Llama API**

- Role: Discovery and data layer
- Provides:
  - List of yield pools with APY, TVL, chain info
  - Protocol risk scores
  - Real-time APY updates
- Does NOT provide: Execution (we handle this separately)

### Yield Execution

**Manual Protocol Integration (2-3 protocols)**

- Aave v3 (lending protocol)
- Compound v3 (lending protocol)
- Optional: One vault protocol (Beefy or Yearn)
- Reasoning:
  - DeFi Llama shows opportunities, but we need smart contract ABIs to execute
  - 2-3 protocols = manageable for weekend
  - Covers majority of stablecoin yield use cases
  - Can expand later

### Wallet Connection

**RainbowKit or ConnectKit**

- Reasoning: Works seamlessly with Avail Nexus SDK
- Modern wallet connection UX
- Supports all major wallets

### Post-MVP: Transaction Indexing

**Envio HyperIndex**

- Role: Historical data layer (Phase 2)
- Provides:
  - Transaction history indexing
  - Historical balance tracking
  - Performance analytics over time
- Why not MVP: Requires setup time (4-6 hours), can add after core functionality works

---

## Feature Breakdown by Page

### 1. Home / Dashboard (`/`)

**Purpose**: Single landing point showing user's unified position and quick actions

**MVP Features**:

- Connect Wallet button (prominent CTA)
- Once connected:
  - Unified balance display (ETH, USDC, USDT across all chains)
  - Breakdown by chain (collapsible)
  - Total USD value
- Quick action cards:
  - "Find Best Yield" (→ opportunities page)
  - "View My Positions" (→ portfolio page)
- Simple APY highlight: "Current best yield: X% on [Protocol]"

**State Required**:

```typescript
{
  isConnected: boolean
  userAddress: string
  unifiedBalances: {
    ETH: { total: number, byChain: Record<chainId, number> }
    USDC: { total: number, byChain: Record<chainId, number> }
    USDT: { total: number, byChain: Record<chainId, number> }
  }
}
```

**API Calls**:

- Avail Nexus: `sdk.getUnifiedBalances()`
- DeFi Llama: `GET /pools` (for "best yield" card)

**UI Components**:

- `BalanceCard` - Shows token balance with chain breakdown
- `QuickActionCard` - CTA cards
- `WalletConnectButton`

---

### 2. Opportunities / Browse Yields (`/opportunities`)

**Purpose**: Discover and compare yield opportunities across protocols

**MVP Features**:

- **Filter Bar**:
  - Token filter (USDC, USDT, ETH)
  - Chain filter (only show chains supported by Avail Nexus)
  - Protocol filter (Aave, Compound, integrated protocols)
  - Sort by: APY (high to low), TVL, Risk Score
- **Opportunity Cards** (list view):
  - Protocol name + logo
  - APY (prominently displayed)
  - Chain
  - TVL
  - Risk score badge (from DeFi Llama)
  - "Stake" button (primary CTA)
- **Opportunity Detail Modal** (on card click):
  - Full protocol details
  - APY breakdown
  - Historical APY chart (from DeFi Llama, simple line chart)
  - Risk information
  - "Stake [Amount]" form:
    - Token input (dropdown: USDC/USDT/ETH)
    - Amount input (with "Max" button)
    - Source chain auto-detected/selected
    - Target chain (where protocol lives)
    - Estimated yield (calculated)
    - "Confirm Stake" button

**State Required**:

```typescript
{
  opportunities: Array<{
    protocol: string
    apy: number
    tvl: number
    chain: string
    token: string
    riskScore: number
    poolId: string
  }>
  filters: {
    token: string[]
    chain: string[]
    protocol: string[]
    sortBy: 'apy' | 'tvl' | 'risk'
  }
}
```

**API Calls**:

- DeFi Llama: `GET /pools` (with filters)
- Filter client-side to only show protocols we've integrated

**Staking Flow**:

1. User fills form in modal
2. Click "Confirm Stake"
3. Show loading state with steps:
   - "Checking balances..."
   - "Routing assets..." (Avail Nexus handling bridge/swap)
   - "Depositing into [Protocol]..." (executing stake)
   - "Complete!" (show tx hash link)
4. Use Avail Nexus SDK events to track progress:

```typescript
sdk.nexusEvents.on(NEXUS_EVENTS.EXPECTED_STEPS, (steps) => {
  // Show progress bar
});
sdk.nexusEvents.on(NEXUS_EVENTS.STEP_COMPLETE, (step) => {
  // Update progress
});
```

**UI Components**:

- `OpportunityCard` - Individual yield opportunity
- `FilterBar` - Filter/sort controls
- `StakeModal` - Modal with staking form
- `ProgressTracker` - Shows multi-step progress
- `RiskBadge` - Color-coded risk indicator

---

### 3. Portfolio / My Positions (`/portfolio`)

**Purpose**: View active staking positions and current balances

**MVP Features**:

- **Active Positions Section**:
  - Cards for each active position:
    - Protocol name + logo
    - Amount staked
    - Current APY
    - Current value (calculated: staked + estimated earnings)
    - Days staked (calculated from current time)
    - Estimated earnings (approximation based on APY)
    - Chain badge
    - "Withdraw" button (triggers withdrawal flow)
- **Total Overview** (top of page):
  - Total value staked (USD)
  - Total estimated earnings (USD)
  - Average APY across all positions
- **Empty State** (if no positions):
  - "No active positions yet"
  - CTA: "Explore Opportunities"

**State Required**:

```typescript
{
  positions: Array<{
    protocol: string;
    token: string;
    amount: number;
    apy: number;
    chainId: number;
    contractAddress: string;
    depositedAt: number; // timestamp (from when they used the app)
  }>;
}
```

**How Positions are Tracked**:

- **On Stake**: Save to localStorage after successful deposit
- **On Load**: Read actual balances from blockchain contracts
  - Query each protocol's contract: `balanceOf(userAddress)`
  - Calculate earnings: `(currentBalance - stakedAmount)`
- **Why localStorage**:
  - Need to remember which protocols user used
  - Contracts only show current balance, not deposit time/amount
  - For MVP, acceptable trade-off (data lost on browser clear)
  - Post-MVP: Envio HyperIndex will provide full history

**Withdrawal Flow**:

1. Click "Withdraw" on position
2. Modal opens:
   - Shows current balance + earnings
   - Option: Withdraw all or partial
   - Destination chain selector (optional)
   - Estimated gas cost
   - "Confirm Withdrawal" button
3. Execute withdrawal via Avail Nexus SDK
4. Update local state on success

**API Calls**:

- Read from smart contracts (via ethers.js/viem):
  - `AavePool.balanceOf(userAddress)`
  - `CompoundMarket.balanceOf(userAddress)`
- DeFi Llama: Get current APY for each protocol

**UI Components**:

- `PositionCard` - Individual position display
- `PortfolioOverview` - Total stats
- `WithdrawModal` - Withdrawal form
- `EmptyState` - When no positions

---

### 4. Settings (Optional, if time) (`/settings`)

**Purpose**: User preferences and configuration

**MVP Features** (nice-to-have):

- Slippage tolerance setting
- Default destination chain preference
- Clear cached data button
- Links to:
  - Avail Nexus docs
  - DeFi Llama
  - Integrated protocols

**Can Skip for MVP**: This is lowest priority

---

## Core User Flows

### Flow 1: First-Time User Stakes

```
1. User lands on Home (/)
   → Sees "Connect Wallet" CTA

2. User connects wallet
   → Wallet modal (RainbowKit/ConnectKit)
   → On success: Show unified balances

3. User clicks "Find Best Yield"
   → Navigate to /opportunities

4. User browses opportunities
   → Filters: "USDC only"
   → Sorts: "Highest APY"
   → Sees Aave offering 5.2% on Arbitrum

5. User clicks "Stake" on opportunity
   → Modal opens
   → Form pre-filled: USDC, user's balance
   → User enters amount: 1000 USDC
   → Sees: "Your USDC on Optimism will be bridged to Arbitrum and staked"

6. User clicks "Confirm Stake"
   → Progress tracker shows:
      [✓] Checking balances
      [⟳] Routing assets (Nexus handling bridge)
      [ ] Depositing into Aave
   → After 10-15 seconds: Complete!

7. User navigates to /portfolio
   → Sees new position card
   → Shows: 1000 USDC in Aave on Arbitrum @ 5.2% APY
```

### Flow 2: User Withdraws Position

```
1. User on /portfolio
   → Sees active position: 1000 USDC in Aave
   → Current balance: 1005 USDC (includes earnings)

2. User clicks "Withdraw"
   → Modal opens
   → Shows: "Withdraw from Aave"
   → Pre-filled: Full balance (1005 USDC)
   → Option: Select destination chain

3. User clicks "Confirm Withdrawal"
   → Execute withdrawal
   → Bridge back to user's preferred chain (via Nexus)
   → Update local storage (remove position)

4. Success state
   → Position removed from /portfolio
   → Balance updated on /home
```

---

## State Management Architecture

### Zustand Stores

**`useWalletStore`**

```typescript
{
  address: string | null
  isConnected: boolean
  provider: any
  chainId: number
  connect: () => Promise<void>
  disconnect: () => void
  switchChain: (chainId: number) => Promise<void>
}
```

**`useBalanceStore`**

```typescript
{
  unifiedBalances: {
    ETH: { total: number, byChain: Record<number, number> }
    USDC: { total: number, byChain: Record<number, number> }
    USDT: { total: number, byChain: Record<number, number> }
  }
  isLoading: boolean
  lastUpdated: number
  fetchBalances: () => Promise<void>
  refreshBalances: () => Promise<void>
}
```

**`usePositionStore`**

```typescript
{
  positions: Position[]
  isLoading: boolean
  addPosition: (position: Position) => void
  removePosition: (id: string) => void
  updatePosition: (id: string, updates: Partial<Position>) => void
  fetchPositions: () => Promise<void>
  syncWithBlockchain: () => Promise<void>
}
```

**`useOpportunityStore`**

```typescript
{
  opportunities: Opportunity[]
  filters: FilterState
  isLoading: boolean
  setFilter: (key: string, value: any) => void
  fetchOpportunities: () => Promise<void>
  getFilteredOpportunities: () => Opportunity[]
}
```

---

## Integration Details

### Avail Nexus SDK Integration

**Initialization** (in root layout or provider):

```typescript
const sdk = new NexusSDK({ network: "mainnet" });
await sdk.initialize(walletProvider);
```

**Key Methods Used**:

1. **Get Unified Balances**:

```typescript
const balances = await sdk.getUnifiedBalances();
// Returns balances across all supported chains
```

2. **Execute Deposit (Bridge + Stake)**:

```typescript
const result = await sdk.execute({
  toChainId: 42161, // Arbitrum
  contractAddress: AAVE_POOL_ADDRESS,
  contractAbi: AAVE_POOL_ABI,
  functionName: "supply",
  buildFunctionParams: (
    token,
    amount,
    chainId,
    userAddress
  ) => {
    const decimals = TOKEN_METADATA[token].decimals;
    const amountWei = parseUnits(amount, decimals);
    const tokenAddress =
      TOKEN_CONTRACT_ADDRESSES[token][chainId];
    return {
      functionParams: [
        tokenAddress,
        amountWei,
        userAddress,
        0,
      ],
    };
  },
  tokenApproval: {
    token: "USDC",
    amount: stakeAmount,
  },
});
```

3. **Track Progress**:

```typescript
sdk.nexusEvents.on(NEXUS_EVENTS.EXPECTED_STEPS, (steps) => {
  setProgressSteps(steps.map((s) => s.typeID));
});

sdk.nexusEvents.on(NEXUS_EVENTS.STEP_COMPLETE, (step) => {
  setCompletedSteps((prev) => [...prev, step.typeID]);
  if (step.typeID === "IS") {
    // Intent settled
    onStakeComplete();
  }
});
```

### DeFi Llama API Integration

**Base URL**: `https://yields.llama.fi`

**Endpoints Used**:

1. **Get All Pools**:

```typescript
const response = await fetch('https://yields.llama.fi/pools');
const data = await response.json();

// Response structure:
{
  data: [
    {
      pool: "unique-pool-id"
      chain: "Arbitrum"
      project: "aave-v3"
      symbol: "USDC"
      tvlUsd: 1000000
      apy: 5.2
      apyBase: 4.8
      apyReward: 0.4
      il7d: null // impermanent loss (null for non-LP)
      exposure: "single" // or "multi" for LP
      predictions: {
        predictedClass: "stable"
        binnedConfidence: 2
      }
    }
  ]
}
```

2. **Filter and Process**:

```typescript
// Only show pools from protocols we've integrated
const SUPPORTED_PROTOCOLS = ["aave-v3", "compound-v3"];
const SUPPORTED_CHAINS = [1, 10, 137, 42161, 8453]; // Nexus chains

const filteredPools = data.data.filter(
  (pool) =>
    SUPPORTED_PROTOCOLS.includes(pool.project) &&
    SUPPORTED_CHAINS.includes(getChainId(pool.chain)) &&
    ["USDC", "USDT", "ETH"].includes(pool.symbol) &&
    pool.exposure === "single" // no LP pools for MVP
);
```

3. **Map to Our Data Structure**:

```typescript
const opportunities = filteredPools.map((pool) => ({
  id: pool.pool,
  protocol: pool.project,
  chain: pool.chain,
  token: pool.symbol,
  apy: pool.apy,
  tvl: pool.tvlUsd,
  riskScore: calculateRiskScore(pool), // based on predictions
  contractAddress: getProtocolAddress(
    pool.project,
    pool.chain
  ),
  poolMetadata: pool,
}));
```

### Protocol Integration (Smart Contracts)

**Aave v3**:

```typescript
// Contract addresses per chain
const AAVE_POOLS = {
  1: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2", // Ethereum
  42161: "0x794a61358D6845594F94dc1DB02A252b5b4814aD", // Arbitrum
  // ... other chains
};

// ABI for supply function
const AAVE_POOL_ABI = [
  {
    name: "supply",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "asset", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "onBehalfOf", type: "address" },
      { name: "referralCode", type: "uint16" },
    ],
    outputs: [],
  },
  {
    name: "withdraw",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "asset", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "to", type: "address" },
    ],
    outputs: [],
  },
];

// Check user's balance
const aTokenContract = new Contract(
  aTokenAddress,
  ERC20_ABI,
  provider
);
const balance = await aTokenContract.balanceOf(userAddress);
```

**Compound v3**:

```typescript
// Similar structure
const COMPOUND_MARKETS = {
  1: "0xc3d688B66703497DAA19211EEdff47f25384cdc3", // USDC market
  // ... other chains
};

const COMPOUND_ABI = [
  {
    name: "supply",
    type: "function",
    inputs: [
      { name: "asset", type: "address" },
      { name: "amount", type: "uint256" },
    ],
  },
  {
    name: "withdraw",
    type: "function",
    inputs: [
      { name: "asset", type: "address" },
      { name: "amount", type: "uint256" },
    ],
  },
  {
    name: "balanceOf",
    type: "function",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
];
```

---

## Data Persistence Strategy

### MVP (Weekend): localStorage

**What We Store**:

```typescript
// Key: 'yield-aggregator-positions'
{
  [userAddress]: {
    positions: [
      {
        id: 'position-uuid',
        protocol: 'aave-v3',
        token: 'USDC',
        chainId: 42161,
        contractAddress: '0x...',
        amountStaked: '1000',
        depositedAt: 1234567890,
        apy: 5.2
      }
    ],
    lastSynced: 1234567890
  }
}
```

**Why localStorage**:

- ✅ Zero setup time
- ✅ Works offline
- ✅ Fast reads/writes
- ✅ Perfect for MVP
- ⚠️ Lost on browser clear
- ⚠️ Not cross-device
- ⚠️ Can't query historical data

**Sync Strategy**:

```typescript
// On page load
async function syncPositions() {
  const saved = localStorage.getItem(
    "yield-aggregator-positions"
  );
  const positions = JSON.parse(saved)?.[userAddress] || [];

  // Verify each position with blockchain
  for (const position of positions) {
    const actualBalance = await readContractBalance(
      position.contractAddress,
      position.token,
      position.chainId
    );

    if (actualBalance > 0) {
      // Position still active, update amount
      position.currentBalance = actualBalance;
    } else {
      // Position closed externally, remove
      positions = positions.filter(
        (p) => p.id !== position.id
      );
    }
  }

  // Save back
  savePositions(positions);
}
```

### Post-MVP: Envio HyperIndex

**What Gets Indexed**:

- All `Deposit` events from Aave, Compound, etc.
- All `Withdraw` events
- User's balance over time
- Transaction details (hash, timestamp, amounts)

**Why Envio**:

- ✅ Full transaction history
- ✅ Cross-device sync
- ✅ Can build analytics/charts
- ✅ Query historical data
- ✅ Survives browser clears

**Schema Example**:

```yaml
# schema.graphql
type Deposit {
  id: ID!
  user: String!
  protocol: String!
  token: String!
  amount: BigInt!
  chainId: Int!
  timestamp: Int!
  txHash: String!
}

type Withdraw {
  id: ID!
  user: String!
  protocol: String!
  token: String!
  amount: BigInt!
  chainId: Int!
  timestamp: Int!
  txHash: String!
}

type UserPosition {
  id: ID!
  user: String!
  protocol: String!
  token: String!
  currentBalance: BigInt!
  totalDeposited: BigInt!
  totalWithdrawn: BigInt!
  firstDepositAt: Int!
  lastActivityAt: Int!
}
```

---

## MVP vs Post-MVP Feature Matrix

### ✅ MVP (Weekend Project)

**Core Functionality**:

- [x] Wallet connection (RainbowKit/ConnectKit)
- [x] Unified balance view (Avail Nexus SDK)
- [x] Browse yield opportunities (DeFi Llama API)
- [x] Filter/sort opportunities
- [x] Stake into 2-3 protocols (Aave + Compound)
- [x] View current positions (read from blockchain)
- [x] Withdraw from positions
- [x] Progress tracking during transactions
- [x] Basic error handling

**Pages**:

- [x] Home/Dashboard
- [x] Opportunities
- [x] Portfolio

**Data Layer**:

- [x] localStorage for position tracking
- [x] Real-time blockchain reads
- [x] DeFi Llama API for discovery

**UI/UX**:

- [x] Responsive design (desktop-focused)
- [x] Loading states
- [x] Empty states
- [x] Transaction progress indicators
- [x] Basic error messages

### 🔄 Post-MVP (Phase 2)

**Advanced Features**:

- [ ] Transaction history with Envio HyperIndex
- [ ] Historical performance charts
- [ ] Portfolio analytics dashboard
  - [ ] Total earnings over time
  - [ ] APY performance by protocol
  - [ ] Best/worst performing positions
- [ ] Risk management features
  - [ ] Risk scoring with explanations
  - [ ] Diversification recommendations
  - [ ] Protocol risk alerts
- [ ] Auto-compounding (if supported by protocol)
- [ ] More protocol integrations (5-10 total)
- [ ] Advanced filters:
  - [ ] Risk level
  - [ ] Lock period
  - [ ] Withdrawal flexibility
- [ ] Portfolio sharing (public portfolio URLs)
- [ ] Mobile optimization
- [ ] Push notifications (wallet-based)
- [ ] Gas optimization suggestions

**Data Enhancements**:

- [ ] Envio HyperIndex for full history
- [ ] Cross-device position sync
- [ ] Backup/restore functionality
- [ ] Export data (CSV)

**UI/UX Improvements**:

- [ ] Dark/light mode toggle
- [ ] Customizable dashboard
- [ ] Advanced charts (TradingView style)
- [ ] Keyboard shortcuts
- [ ] Onboarding tutorial
- [ ] Tooltips and help system

**Technical Improvements**:

- [ ] Server-side caching (Next.js ISR)
- [ ] Optimistic UI updates
- [ ] WebSocket for real-time updates
- [ ] Better error recovery
- [ ] Retry mechanisms
- [ ] Rate limiting handling

---

## Risk Management Implementation (Post-MVP)

Since you asked about risk management - here's how to implement it later:

### Option 1: DeFi Llama Risk Scores

**Already Available in API**:

```typescript
// From DeFi Llama response
{
  predictions: {
    predictedClass: "stable" | "risky" | "volatile",
    binnedConfidence: 1 | 2 | 3 // 1=low, 2=medium, 3=high
  }
}
```

**Implementation**:

```typescript
function calculateRiskScore(pool): number {
  const classScores = {
    stable: 1,
    risky: 3,
    volatile: 5,
  };

  const baseScore =
    classScores[pool.predictions.predictedClass];
  const confidence = pool.predictions.binnedConfidence;

  // Combine with TVL (higher TVL = lower risk)
  const tvlFactor = pool.tvlUsd > 10_000_000 ? -0.5 : 0;

  return Math.min(5, baseScore - confidence + tvlFactor);
}
```

**Display**:

- 1-2: Green badge "Low Risk"
- 3: Yellow badge "Medium Risk"
- 4-5: Red badge "High Risk"

### Option 2: AI-Enhanced Risk Scoring

**Use Claude API** (if you want to get fancy):

```typescript
async function getAIRiskAssessment(pool) {
  const response = await fetch("/api/risk-assessment", {
    method: "POST",
    body: JSON.stringify({
      protocol: pool.project,
      tvl: pool.tvlUsd,
      apy: pool.apy,
      chain: pool.chain,
      token: pool.symbol,
    }),
  });

  // Returns: { riskScore: number, explanation: string }
}
```

**API Route** (`/api/risk-assessment`):

```typescript
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req) {
  const data = await req.json();

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const message = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Assess the risk of this DeFi yield opportunity:
        Protocol: ${data.protocol}
        APY: ${data.apy}%
        TVL: $${data.tvl}
        Chain: ${data.chain}
        Token: ${data.token}
        
        Provide:
        1. Risk score (1-5, where 1 is lowest risk)
        2. Brief explanation (2-3 sentences)
        
        Consider: protocol maturity, TVL, APY sustainability, smart contract risk, chain risk.`,
      },
    ],
  });

  // Parse response and return structured data
  return Response.json(parseAIResponse(message.content));
}
```

**Benefits**:

- Nuanced risk assessment
- Explains reasoning to user
- Can factor in recent news/events
- Updates as protocols evolve

**Costs**:

- API calls (minimal for this use case)
- Response latency (cache results)

**Recommendation**: Start with DeFi Llama's built-in scores (free, instant), add AI enhancement in Phase 2 if needed.

---

## Error Handling Strategy

### Transaction Errors

**Error Types**:

1. Insufficient balance
2. Network congestion
3. User rejection
4. Contract execution failure
5. Timeout

**Handling**:

```typescript
try {
  const result = await sdk.execute(...);
} catch (error) {
  if (error.code === 'INSUFFICIENT_FUNDS') {
    toast.error('Insufficient balance for this transaction');
  } else if (error.code === 'USER_REJECTED') {
    toast.info('Transaction cancelled');
  } else if (error.code === 'TIMEOUT') {
    toast.error('Transaction timed out. Please try again.');
  } else {
    toast.error('Transaction failed. Please try again.');
    console.error(error);
  }
}
```

### API Errors

**DeFi Llama API**:

```typescript
async function fetchOpportunities() {
  try {
    const response = await fetch(
      "https://yields.llama.fi/pools"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch opportunities");
    }
    return await response.json();
  } catch (error) {
    // Fallback to cached data if available
    const cached = getCachedOpportunities();
    if (cached) {
      toast.warning("Using cached data (API unavailable)");
      return cached;
    }
    toast.error(
      "Unable to load opportunities. Please refresh."
    );
    return [];
  }
}
```

### Blockchain Read Errors

```typescript
async function readPosition(contractAddress, userAddress) {
  try {
    const balance = await contract.balanceOf(userAddress);
    return balance;
  } catch (error) {
    console.error("Failed to read position:", error);
    // Don't fail silently - show stale data with warning
    return lastKnownBalance; // from localStorage
  }
}
```

---

## Performance Considerations

### Optimization Strategies

**1. Caching DeFi Llama Data**:

```typescript
// Cache in Next.js route handler
export async function GET() {
  const cached = await redis.get("defi-llama-pools");
  if (cached) {
    return Response.json(JSON.parse(cached));
  }

  const data = await fetch("https://yields.llama.fi/pools");
  const pools = await data.json();

  // Cache for 5 minutes
  await redis.setex(
    "defi-llama-pools",
    300,
    JSON.stringify(pools)
  );

  return Response.json(pools);
}
```

**2. Parallel Blockchain Reads**:

```typescript
// Don't read positions sequentially
const positions = await Promise.all(
  userPositions.map(async (pos) => {
    const balance = await readBalance(pos.contractAddress);
    return { ...pos, currentBalance: balance };
  })
);
```

**3. Debounce Filter Changes**:

```typescript
const debouncedFilter = useDebouncedCallback(
  (filters) => {
    applyFilters(filters);
  },
  300 // 300ms delay
);
```

**4. Virtualized Lists**:

```typescript
// Use react-window for long opportunity lists
import { FixedSizeList } from "react-window";

<FixedSizeList
  height={600}
  itemCount={opportunities.length}
  itemSize={120}
>
  {({ index, style }) => (
    <OpportunityCard
      style={style}
      opportunity={opportunities[index]}
    />
  )}
</FixedSizeList>;
```

---

## Development Checklist

### Saturday (Day 1)

**Morning (4 hours)**:

- [ ] Project setup (Next.js + ShadCN + Zustand)
- [ ] Install dependencies (Avail Nexus SDK, RainbowKit, etc.)
- [ ] Set up wallet connection
- [ ] Create basic layout + navigation
- [ ] Set up Zustand stores (wallet, balance, position)

**Afternoon (4 hours)**:

- [ ] Implement Home page with unified balance
- [ ] Integrate Avail Nexus SDK (initialize, get balances)
- [ ] Create BalanceCard component
- [ ] Test wallet connection + balance display

### Sunday (Day 2)

**Morning (4 hours)**:

- [ ] Fetch opportunities from DeFi Llama
- [ ] Build Opportunities page with filters
- [ ] Create OpportunityCard component
- [ ] Implement filtering/sorting logic

**Afternoon (4 hours)**:

- [ ] Build staking flow (modal + form)
- [ ] Integrate Avail Nexus execute function
- [ ] Implement progress tracking
- [ ] Build Portfolio page
- [ ] Implement position reading from blockchain
- [ ] Create PositionCard component
- [ ] Test full stake → view position flow

**Evening (2 hours)**:

- [ ] Implement withdrawal flow
- [ ] Polish UI/UX
- [ ] Add loading states, error handling
- [ ] Test end-to-end
- [ ] Deploy to Vercel

---

## Environment Variables

```bash
# .env.local

# Wallet Connect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Avail Nexus
NEXT_PUBLIC_NEXUS_NETWORK=mainnet # or testnet

# Optional: Cache/Database (post-MVP)
REDIS_URL=your_redis_url

# Optional: AI Risk Assessment (post-MVP)
ANTHROPIC_API_KEY=your_claude_api_key

# RPC URLs (if needed)
NEXT_PUBLIC_ETHEREUM_RPC=https://eth.llamarpc.com
NEXT_PUBLIC_ARBITRUM_RPC=https://arb1.arbitrum.io/rpc
```

---

## Deployment

**Platform**: Vercel (recommended for Next.js)

**Steps**:

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

**Custom Domain** (optional):

- Buy domain (Namecheap, etc.)
- Add to Vercel project
- Update DNS records

---

## Testing Strategy (Post-MVP)

For MVP, manual testing is sufficient. Post-MVP, add:

**Unit Tests** (Vitest):

- Zustand store logic
- Utility functions (calculateRisk, formatNumber, etc.)
- Data transformations

**Integration Tests** (Playwright):

- Wallet connection flow
- Staking flow end-to-end
- Portfolio display

**E2E Tests** (Playwright):

- Full user journey (connect → stake → view → withdraw)

---

## Success Metrics

**MVP Success**:

- [ ] Can connect wallet
- [ ] See unified balance across chains
- [ ] Browse yield opportunities
- [ ] Successfully stake into protocol
- [ ] View position in portfolio
- [ ] Successfully withdraw

**User Experience**:

- [ ] Transaction completes in <30 seconds
- [ ] UI is responsive and intuitive
- [ ] No confusing errors
- [ ] Works on Chrome, Brave, Firefox

**Post-MVP Metrics** (track with analytics):

- Total Value Locked (TVL)
- Number of unique users
- Number of stakes per day
- Average stake amount
- Protocol distribution
- User retention (7-day, 30-day)

---

## Known Limitations (MVP)

**Accept These Trade-offs**:

1. ⚠️ Position data lost if browser clears → Fix with Envio later
2. ⚠️ Only 2-3 protocols supported → Expand post-MVP
3. ⚠️ Only ETH/USDC/USDT supported → Avail Nexus limitation
4. ⚠️ No transaction history → Add with Envio
5. ⚠️ Desktop-only optimization → Mobile later
6. ⚠️ No automated risk management → Add AI later
7. ⚠️ Manual balance refresh (no websockets) → Polling is fine for MVP

**These are OK for weekend scope. Ship it!**

---

## Next Steps After MVP

**Week 2**:

1. Set up Envio HyperIndex
2. Add transaction history page
3. Build historical charts
4. Improve error handling

**Week 3**: 5. Add 3-5 more protocols 6. Implement risk scoring UI 7. Add portfolio analytics 8. Mobile responsive design

**Month 2**: 9. AI risk assessment 10. Auto-compound features 11. Advanced filters 12. Social features (if desired)

---

## Additional Resources

**Documentation Links**:

- Avail Nexus SDK: https://docs.availproject.org/nexus/avail-nexus-sdk
- DeFi Llama API: https://defillama.com/docs/api
- Envio HyperIndex: https://docs.envio.dev/
- Aave v3 Docs: https://docs.aave.com/developers/
- Compound v3 Docs: https://docs.compound.finance/

**Community**:

- Avail Discord: https://discord.gg/avail
- DeFi Llama Discord: https://discord.gg/defillama

---

## Final Notes

**Philosophy**:

- Ship working code over perfect code
- Iterate based on actual usage
- Don't over-engineer for weekend MVP
- Focus on core user value: simplified yield staking
