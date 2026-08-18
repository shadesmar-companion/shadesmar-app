describe('smoke', () => {
  it('vitest globals work', () => {
    expect(1 + 1).toBe(2)
  })

  it('jsdom environment is active', () => {
    expect(document).toBeDefined()
  })
})
