import { describe, it, expect } from 'vitest'
import { toComparableValue, isVisible, filterEntity, filterEntities } from '../spoilerFilter'
import type { RawEntity, ReadingPosition } from '../types'

const pos = (book: number, part: number): ReadingPosition => ({ book, part })

/**
 * Basic entity for testing.
 */
const makeCharacter = (overrides: Partial<RawEntity> = {}): RawEntity => ({
  id: 'test-char',
  type: 'character',
  name: 'Test Character',
  aliases: ['TC'],
  first_revealed: pos(1, 1),
  short_description: 'A test character.',
  tags: [],
  sections: [
    { id: 's1', revealed_at: pos(1, 1), content: 'Early content' },
    { id: 's2', revealed_at: pos(2, 3), content: 'Mid-series content' },
    { id: 's3', revealed_at: pos(4, 1), content: 'Late content' },
  ],
  relationships: [
    { entity_id: 'other', revealed_at: pos(1, 1), type: 'ally', description: 'Early relation' },
    { entity_id: 'hidden', revealed_at: pos(3, 2), type: 'rival', description: 'Late relation' },
  ],
  ...overrides,
})

describe('toComparableValue', () => {
  it('converts book 1 part 0 to 10', () => {
    expect(toComparableValue(pos(1, 0))).toBe(10)
  })

  it('converts book 1 part 3 to 13', () => {
    expect(toComparableValue(pos(1, 3))).toBe(13)
  })

  it('converts book 2 part 5 to 25', () => {
    expect(toComparableValue(pos(2, 5))).toBe(25)
  })

  it('converts Edgedancer (book 2.5) to 25', () => {
    expect(toComparableValue(pos(2.5, 0))).toBe(25)
  })

  it('converts Dawnshard (book 3.5) to 35', () => {
    expect(toComparableValue(pos(3.5, 0))).toBe(35)
  })

  it('converts book 3 part 1 to 31', () => {
    expect(toComparableValue(pos(3, 1))).toBe(31)
  })

  it('converts book 5 part 5 to 55', () => {
    expect(toComparableValue(pos(5, 5))).toBe(55)
  })

  it('Convert book 0 part 0 to 0', () => {
    expect(toComparableValue(pos(0, 0))).toBe(0)
  })
})

describe('isVisible', () => {
  it('returns true when revealed_at equals user position', () => {
    expect(isVisible(pos(2, 3), pos(2, 3))).toBe(true)
  })

  it('returns true when revealed_at is less than user position', () => {
    expect(isVisible(pos(1, 1), pos(3, 2))).toBe(true)
  })

  it('returns false when revealed_at is more than user position', () => {
    expect(isVisible(pos(3, 2), pos(2, 5))).toBe(false)
  })

  it('pre-series content (book 0) is always visible', () => {
    expect(isVisible(pos(0, 0), pos(1, 0))).toBe(true)
  })

  it('Edgedancer content hidden at WoR P4', () => {
    expect(isVisible(pos(2.5, 0), pos(2, 4))).toBe(false)
  })

  it('Edgedancer content visible at WoR P5', () => {
    expect(isVisible(pos(2.5, 0), pos(2, 5))).toBe(true)
  })

  it('Edgedancer content visible at OB P1', () => {
    expect(isVisible(pos(2.5, 0), pos(3, 1))).toBe(true)
  })

  it('Dawnshard content visible at OB P5', () => {
    // OB P5 = 35, Dawnshard = 35 → visible
    expect(isVisible(pos(3.5, 0), pos(3, 5))).toBe(true)
  })

  it('Dawnshard content hidden at OB P4', () => {
    expect(isVisible(pos(3.5, 0), pos(3, 4))).toBe(false)
  })
})

describe('filterEntity', () => {
  it('returns null for locked entity', () => {
    const char = makeCharacter({ first_revealed: pos(3, 1) })
    expect(filterEntity(char, pos(2, 5))).toBeNull()
  })

  it('returns filtered entity for visible entity', () => {
    const char = makeCharacter()
    const result = filterEntity(char, pos(2, 0))
    expect(result).not.toBeNull()
    expect(result!.id).toBe('test-char')
  })

  it('shows only sections up to user position', () => {
    const char = makeCharacter()
    const result = filterEntity(char, pos(2, 0))
    expect(result!.sections).toHaveLength(1)
    expect(result!.sections[0]!.id).toBe('s1')
  })

  it('shows all sections when user has read everything', () => {
    const char = makeCharacter()
    const result = filterEntity(char, pos(5, 5))
    expect(result!.sections).toHaveLength(3)
  })

  it('shows only visible relationships', () => {
    const char = makeCharacter()
    const result = filterEntity(char, pos(2, 0))
    expect(result!.relationships).toHaveLength(1)
    expect(result!.relationships[0]!.entity_id).toBe('other')
  })

  it('sets hasContentAhead true when future sections exist', () => {
    const char = makeCharacter()
    const result = filterEntity(char, pos(2, 0))
    expect(result!.hasContentAhead).toBe(true)
  })

  it('sets hasContentAhead true when only future relationships exist', () => {
    const char = makeCharacter({
      sections: [
        { id: 's1', revealed_at: pos(1, 1), content: 'Early section' },
        { id: 's2', revealed_at: pos(2, 0), content: 'Mid section' },
      ],
      relationships: [
        { entity_id: 'early', revealed_at: pos(1, 1), type: 'ally', description: 'Early' },
        { entity_id: 'late', revealed_at: pos(4, 2), type: 'rival', description: 'Late' },
      ],
    })
    const result = filterEntity(char, pos(3, 0))
    expect(result).not.toBeNull()
    expect(result!.sections).toHaveLength(2)
    expect(result!.relationships).toHaveLength(1)
    expect(result!.hasContentAhead).toBe(true)
  })

  it('sets hasContentAhead false when all content is visible', () => {
    const char = makeCharacter()
    const result = filterEntity(char, pos(5, 5))
    expect(result!.hasContentAhead).toBe(false)
  })

  it('returns entity visible exactly at its first_revealed position', () => {
    const char = makeCharacter({ first_revealed: pos(2, 3) })
    expect(filterEntity(char, pos(2, 3))).not.toBeNull()
  })

  it('never throws on malformed entity, returns null', () => {
    // @ts-expect-error — test volontaire de la robustesse runtime
    expect(() => filterEntity(null, pos(1, 0))).not.toThrow()
    // @ts-expect-error
    expect(filterEntity(null, pos(1, 0))).toBeNull()
  })

  it('never throws on malformed position, returns null', () => {
    const char = makeCharacter()
    // @ts-expect-error — test volontaire de la robustesse runtime
    expect(() => filterEntity(char, null)).not.toThrow()
    // @ts-expect-error
    expect(filterEntity(char, null)).toBeNull()
  })
})

describe('filterEntities', () => {
  it('returns empty array for empty input', () => {
    expect(filterEntities([], pos(1, 1))).toEqual([])
  })

  it('excludes locked entities, keeps visible ones', () => {
    const visible = makeCharacter({ id: 'visible', first_revealed: pos(1, 1) })
    const locked = makeCharacter({ id: 'locked', first_revealed: pos(4, 1) })
    const result = filterEntities([visible, locked], pos(2, 0))
    expect(result).toHaveLength(1)
    expect(result[0]!.id).toBe('visible')
  })

  it('returns all entities when position is max', () => {
    const chars = [
      makeCharacter({ id: 'c1', first_revealed: pos(1, 0) }),
      makeCharacter({ id: 'c2', first_revealed: pos(3, 2) }),
      makeCharacter({ id: 'c3', first_revealed: pos(5, 5) }),
    ]
    const result = filterEntities(chars, pos(5, 5))
    expect(result).toHaveLength(3)
  })

  it('preserves entity order from input array', () => {
    const chars = [
      makeCharacter({ id: 'b', first_revealed: pos(1, 1) }),
      makeCharacter({ id: 'a', first_revealed: pos(1, 1) }),
    ]
    const result = filterEntities(chars, pos(5, 5))
    expect(result[0]!.id).toBe('b')
    expect(result[1]!.id).toBe('a')
  })
})
