// Static sample SMS thread (Day 12 of 30) shown in the hero.
function AgentBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[80%] self-start rounded-2xl rounded-tl-md bg-[#26231C] px-4 py-2.5 text-[13.5px] leading-snug text-[#EDE7DA]">
      {children}
    </div>
  );
}

function UserBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[80%] self-end rounded-2xl rounded-tr-md bg-accent px-4 py-2.5 text-[13.5px] leading-snug text-ink-light">
      {children}
    </div>
  );
}

export function PhoneMock() {
  return (
    <div
      className="mx-auto w-[300px] max-w-full rounded-[34px] border border-white/10 bg-[#0C0B08] p-3 shadow-card"
      aria-hidden="true"
    >
      <div className="flex items-center justify-between px-3 pb-3 pt-1 text-[11px] text-white/40">
        <span>9:41</span>
        <span className="font-600 text-white/60">Be Legendary</span>
        <span>Day 12 / 30</span>
      </div>
      <div className="flex flex-col gap-2 rounded-[22px] bg-[#141210] p-3">
        <AgentBubble>
          Morning. Today&apos;s rep: say the risky thing you&apos;d normally
          soften. You&apos;ve got this.
        </AgentBubble>
        <AgentBubble>It&apos;s 4 p.m. — how&apos;d today go, 1–10?</AgentBubble>
        <UserBubble>8</UserBubble>
        <AgentBubble>An 8 — strong. What made it land today?</AgentBubble>
        <UserBubble>
          Told the board the number I actually believe, not the safe one.
        </UserBubble>
      </div>
    </div>
  );
}
