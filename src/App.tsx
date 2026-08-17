function App() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary font-sans">
      <div className="p-8 space-y-4 max-w-lg mx-auto pt-16">
        <div className="bg-bg-surface rounded-md p-4">
          <h1 className="text-text-primary text-lg font-semibold">Hello Roshar</h1>
          <p className="text-text-secondary text-sm mt-1">Design tokens Shadesmar active</p>
        </div>

        <div className="bg-bg-surface rounded-md p-4 space-y-2">
          <p className="text-stormlight font-medium">Stormlight</p>
          <p className="text-warning text-sm">Warning</p>
          <p className="text-text-muted text-sm">Text muted</p>
        </div>

        <div className="bg-bg-surface rounded-md p-4">
          <p className="text-text-secondary text-xs mb-3 uppercase tracking-wider">Badges entity</p>
          <div className="flex flex-wrap gap-2">
            <span className="bg-badge-character text-bg-primary text-xs px-2 py-0.5 rounded-full font-medium">
              Character
            </span>
            <span className="bg-badge-location text-bg-primary text-xs px-2 py-0.5 rounded-full font-medium">
              Location
            </span>
            <span className="bg-badge-magic text-bg-primary text-xs px-2 py-0.5 rounded-full font-medium">
              Magic
            </span>
            <span className="bg-badge-spren text-bg-primary text-xs px-2 py-0.5 rounded-full font-medium">
              Spren (Spirit)
            </span>
            <span className="bg-badge-organization text-bg-primary text-xs px-2 py-0.5 rounded-full font-medium">
              Organization
            </span>
            <span className="bg-badge-order text-bg-primary text-xs px-2 py-0.5 rounded-full font-medium">
              Order
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
