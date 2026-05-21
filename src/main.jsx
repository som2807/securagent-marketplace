import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bot,
  Check,
  CircleDollarSign,
  Clipboard,
  Copy,
  Grid2X2,
  Laptop,
  Lock,
  Megaphone,
  Microscope,
  Palette,
  Play,
  Plus,
  Search,
  Shield,
  Sparkles,
  Star,
  Users,
  Zap,
  Globe2
} from "lucide-react";
import { agents, categories } from "./data";
import "./styles.css";

const icons = {
  BarChart3,
  Bot,
  CircleDollarSign,
  Clipboard,
  Globe2,
  Grid2X2,
  Laptop,
  Lock,
  Megaphone,
  Microscope,
  Palette,
  Search,
  Shield,
  Sparkles,
  Star,
  Users,
  Zap
};

function Icon({ name, ...props }) {
  const Component = icons[name] || Bot;
  return <Component {...props} />;
}

function navigate(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function useRoute() {
  const [path, setPath] = useState(window.location.pathname);
  React.useEffect(() => {
    const update = () => setPath(window.location.pathname);
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);
  return path;
}

function LinkButton({ href, children, className = "", icon: IconComponent }) {
  return (
    <button className={className} onClick={() => navigate(href)}>
      {IconComponent ? <IconComponent size={16} /> : null}
      {children}
    </button>
  );
}

function Navbar({ path }) {
  const links = [
    { href: "/marketplace", label: "Marketplace", icon: Search },
    { href: "/dashboard", label: "Dashboard", icon: Grid2X2 },
    { href: "/publish", label: "Publish", icon: Plus }
  ];

  return (
    <nav className="navbar">
      <button className="brand" onClick={() => navigate("/")}>
        <span className="brandIcon">
          <Bot size={21} />
        </span>
        <span>SecurAgent</span>
      </button>
      <div className="navLinks">
        {links.map((link) => (
          <LinkButton
            key={link.href}
            href={link.href}
            icon={link.icon}
            className={`navLink ${path.startsWith(link.href) ? "active" : ""}`}
          >
            {link.label}
          </LinkButton>
        ))}
      </div>
      <button className="primary small">Sign In</button>
    </nav>
  );
}

function AgentCard({ agent }) {
  return (
    <article className="card agentCard" onClick={() => navigate(`/agent/${agent.id}`)}>
      <div className="cardTop">
        <div className="agentIdentity">
          <span className="agentIcon">
            <Icon name={agent.icon} size={25} />
          </span>
          <div>
            <h3>{agent.name}</h3>
            <p>by {agent.creator}</p>
          </div>
        </div>
        <Shield size={18} className="verified" />
      </div>
      <p className="description">{agent.description}</p>
      <div className="tags">
        {agent.tags.slice(0, 3).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <div className="cardMeta">
        <span>
          <Star size={15} className="star" />
          {agent.rating}
        </span>
        <span>
          <Play size={14} />
          {agent.runs} runs
        </span>
        <strong>{agent.price}</strong>
      </div>
    </article>
  );
}

function Home() {
  return (
    <>
      <section className="hero">
        <div className="pill">
          <Sparkles size={16} />
          The future of AI automation is here
        </div>
        <h1>
          Discover & Deploy <span>AI Agents</span> That Work
        </h1>
        <p>
          The trusted marketplace for autonomous AI agents. Browse verified agents, deploy in one click, and automate anything from marketing to research.
        </p>
        <div className="heroActions">
          <LinkButton href="/marketplace" className="primary" icon={Search}>
            Browse Marketplace
          </LinkButton>
          <LinkButton href="/publish" className="secondary" icon={Plus}>
            Publish an Agent
          </LinkButton>
        </div>
        <div className="stats">
          <span>
            <Bot size={18} />
            <strong>200+</strong>
            AI Agents
          </span>
          <span>
            <Sparkles size={18} />
            <strong>1M+</strong>
            Executions
          </span>
          <span>
            <Shield size={18} />
            <strong>98%</strong>
            Verified
          </span>
        </div>
      </section>

      <section className="sectionHeader">
        <div>
          <h2>Featured Agents</h2>
          <p>Top-rated AI agents trusted by thousands</p>
        </div>
        <LinkButton href="/marketplace" className="ghost" icon={ArrowRight}>
          View all
        </LinkButton>
      </section>
      <div className="grid">
        {agents.slice(0, 6).map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      <section className="steps">
        <div className="sectionHeader centered">
          <div>
            <h2>How It Works</h2>
            <p>Four simple steps to AI-powered automation</p>
          </div>
        </div>
        {["Discover", "Verify", "Deploy", "Monitor"].map((step, index) => (
          <article className="step" key={step}>
            <span>Step {index + 1}</span>
            <h3>{step}</h3>
            <p>
              {[
                "Browse our curated marketplace of AI agents across dozens of categories.",
                "Check verification badges, ratings, and audit trails before deploying.",
                "Run agents instantly with one click. No setup, no infrastructure needed.",
                "Track execution history, outputs, and performance metrics in real time."
              ][index]}
            </p>
          </article>
        ))}
      </section>
    </>
  );
}

function Marketplace() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("popular");
  const visibleAgents = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = agents.filter((agent) => {
      const inCategory = category === "all" || agent.category === category;
      const searchable = `${agent.name} ${agent.creator} ${agent.description} ${agent.tags.join(" ")}`.toLowerCase();
      return inCategory && (!q || searchable.includes(q));
    });
    return filtered.sort((a, b) => (sort === "rating" ? b.rating - a.rating : Number(b.runs.replace(",", "")) - Number(a.runs.replace(",", ""))));
  }, [query, category, sort]);

  return (
    <>
      <PageTitle title="Marketplace" subtitle="Discover verified AI agents ready to automate your workflows" />
      <div className="filters">
        <label className="searchBox">
          <Search size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search agents..." />
        </label>
        <select value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="popular">Most Popular</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>
      <div className="categoryRow">
        {categories.map((item) => (
          <button key={item.id} className={category === item.id ? "active" : ""} onClick={() => setCategory(item.id)}>
            <Icon name={item.icon} size={16} />
            {item.label}
          </button>
        ))}
      </div>
      <p className="count">{visibleAgents.length} agents found</p>
      <div className="grid">
        {visibleAgents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </>
  );
}

function PageTitle({ title, subtitle, action }) {
  return (
    <header className="pageTitle">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {action}
    </header>
  );
}

function Dashboard() {
  const [tabName, setTabName] = useState("agents");
  return (
    <>
      <PageTitle
        title="Dashboard"
        subtitle="Welcome back"
        action={
          <LinkButton href="/publish" className="primary" icon={Plus}>
            Publish Agent
          </LinkButton>
        }
      />
      <div className="metricGrid">
        {[
          ["Published Agents", "0", Bot],
          ["Total Runs", "0", Play],
          ["Avg Rating", "0.0", Star],
          ["Success Rate", "100%", Zap]
        ].map(([label, value, MetricIcon]) => (
          <article className="card metric" key={label}>
            <span className="metricIcon">
              <MetricIcon size={22} />
            </span>
            <strong>{value}</strong>
            <p>{label}</p>
          </article>
        ))}
      </div>
      <div className="tabs">
        <button className={tabName === "agents" ? "active" : ""} onClick={() => setTabName("agents")}>
          My Agents
        </button>
        <button className={tabName === "history" ? "active" : ""} onClick={() => setTabName("history")}>
          Execution History
        </button>
      </div>
      <section className="card emptyState">
        <Bot size={54} />
        <h2>{tabName === "agents" ? "No agents yet" : "No executions yet"}</h2>
        <p>{tabName === "agents" ? "Create your first AI agent and share it with the world" : "Run an agent to see execution history here"}</p>
        <LinkButton href="/publish" className="primary" icon={Plus}>
          Publish Agent
        </LinkButton>
      </section>
    </>
  );
}

function Publish() {
  const [form, setForm] = useState({ name: "", short: "", details: "", category: "other", tag: "", capability: "", pricing: "free", output: "" });
  const [submitted, setSubmitted] = useState(false);
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  return (
    <div className="narrow">
      <PageTitle title="Publish an Agent" subtitle="Share your AI agent with the community" />
      {submitted ? (
        <section className="card emptyState">
          <Check size={54} />
          <h2>Agent draft saved</h2>
          <p>This GitHub-ready copy keeps submissions local. Connect your backend when you are ready to accept real agent listings.</p>
          <button className="secondary" onClick={() => setSubmitted(false)}>
            Edit Draft
          </button>
        </section>
      ) : (
        <form className="publishForm" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
          <FormSection title="Basic Information">
            <label>
              Agent Name *
              <input required placeholder="My Awesome Agent" value={form.name} onChange={update("name")} />
            </label>
            <label>
              Short Description *
              <input required placeholder="Briefly describe what your agent does" value={form.short} onChange={update("short")} />
            </label>
            <label>
              Detailed Description
              <textarea placeholder="Explain capabilities, use cases, and how it works..." value={form.details} onChange={update("details")} />
            </label>
            <label>
              Category *
              <select value={form.category} onChange={update("category")}>
                {categories.filter((item) => item.id !== "all").map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.label === "Dev Tools" ? "Development" : item.label}
                  </option>
                ))}
                <option value="other">Other</option>
              </select>
            </label>
          </FormSection>
          <FormSection title="Tags & Capabilities">
            <label>
              Tags
              <input placeholder="Add a tag" value={form.tag} onChange={update("tag")} />
            </label>
            <label>
              Capabilities
              <input placeholder="e.g. Generate SEO content" value={form.capability} onChange={update("capability")} />
            </label>
          </FormSection>
          <FormSection title="Pricing">
            <label>
              Pricing Model
              <select value={form.pricing} onChange={update("pricing")}>
                <option value="free">Free</option>
                <option value="pay-per-use">Pay Per Use</option>
                <option value="subscription">Subscription</option>
                <option value="one-time">One-Time Purchase</option>
              </select>
            </label>
          </FormSection>
          <FormSection title="Sample Output">
            <label>
              <span className="srOnly">Sample Output</span>
              <textarea placeholder="Paste an example of what your agent outputs..." value={form.output} onChange={update("output")} />
            </label>
          </FormSection>
          <button className="primary full" type="submit">
            Publish Agent
          </button>
        </form>
      )}
    </div>
  );
}

function FormSection({ title, children }) {
  return (
    <section className="card formSection">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function AgentDetail({ id }) {
  const agent = agents.find((item) => item.id === id) || agents[0];
  const [active, setActive] = useState("overview");
  return (
    <div className="detailWrap">
      <button className="back" onClick={() => navigate("/marketplace")}>
        <ArrowLeft size={17} />
        Back to Marketplace
      </button>
      <section className="card detailHero">
        <span className="agentIcon big">
          <Icon name={agent.icon} size={38} />
        </span>
        <div>
          <h1>{agent.name}</h1>
          <p>by {agent.creator}</p>
          <p className="detailDescription">{agent.description}</p>
          <div className="detailStats">
            <span className="badge">
              <Shield size={16} />
              {agent.badge}
            </span>
            <span>
              <Star size={16} className="star" />
              {agent.rating} ({agent.reviews})
            </span>
            <span>
              <Play size={15} />
              {agent.runs} runs
            </span>
            <span>
              <Zap size={15} />
              {agent.success} success
            </span>
            <span>{agent.latency}</span>
          </div>
        </div>
        <strong className="pricePill">{agent.price}</strong>
      </section>

      <div className="tabs">
        {["overview", "run", "reviews"].map((item) => (
          <button key={item} className={active === item ? "active" : ""} onClick={() => setActive(item)}>
            {item === "overview" ? "Overview" : item === "run" ? "Run Agent" : "Reviews"}
          </button>
        ))}
      </div>

      {active === "overview" && (
        <div className="detailGrid">
          <section className="card">
            <h2>About this Agent</h2>
            <p>{agent.details}</p>
          </section>
          <aside className="card facts">
            <h2>Details</h2>
            <dl>
              <dt>Category</dt>
              <dd>{categories.find((item) => item.id === agent.category)?.label || agent.category}</dd>
              <dt>Version</dt>
              <dd>{agent.version}</dd>
              <dt>Pricing</dt>
              <dd>{agent.pricing}</dd>
            </dl>
          </aside>
          <section className="card">
            <h2>Capabilities</h2>
            <ul className="capabilities">
              {agent.capabilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <aside className="card">
            <h2>Tags</h2>
            <div className="tags">
              {agent.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </aside>
          <section className="card output">
            <div className="split">
              <h2>Sample Output</h2>
              <button className="iconButton" title="Copy sample output" onClick={() => navigator.clipboard?.writeText(agent.output)}>
                <Copy size={17} />
              </button>
            </div>
            <pre>{agent.output}</pre>
          </section>
        </div>
      )}
      {active === "run" && (
        <section className="card runPanel">
          <h2>Run {agent.name}</h2>
          <textarea placeholder="Describe the task you want this agent to complete..." />
          <button className="primary" onClick={() => alert("Demo run queued. Connect an API backend to execute real agents.")}>
            <Play size={16} />
            Run Agent
          </button>
        </section>
      )}
      {active === "reviews" && (
        <section className="card reviews">
          <h2>Reviews</h2>
          <p>{agent.name} has a {agent.rating} average rating from {agent.reviews} marketplace reviews.</p>
        </section>
      )}
    </div>
  );
}

function Footer() {
  return (
    <footer>
      <button className="brand" onClick={() => navigate("/")}>
        <span className="brandIcon">
          <Bot size={20} />
        </span>
        <span>SecurAgent</span>
      </button>
      <div>
        <button onClick={() => navigate("/marketplace")}>Marketplace</button>
        <button onClick={() => navigate("/publish")}>Publish</button>
        <button onClick={() => navigate("/dashboard")}>Dashboard</button>
      </div>
      <p>(c) 2026 SecurAgent. All rights reserved.</p>
    </footer>
  );
}

function App() {
  const path = useRoute();
  const agentMatch = path.match(/^\/agent\/([^/]+)/);
  return (
    <div className="app">
      <Navbar path={path} />
      <main>
        {path === "/" && <Home />}
        {path === "/marketplace" && <Marketplace />}
        {path === "/dashboard" && <Dashboard />}
        {path === "/publish" && <Publish />}
        {agentMatch && <AgentDetail id={agentMatch[1]} />}
        {!["/", "/marketplace", "/dashboard", "/publish"].includes(path) && !agentMatch && <Marketplace />}
      </main>
      <Footer />
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
