import type { ReadingPosition, RawEntity, FilteredEntity } from './types'

/**
 * Converts a ReadingPosition into a comparable value.
 */
export function toComparableValue(pos: ReadingPosition): number {
  const isNovella = pos.book % 1 !== 0
  if (isNovella) {
    return Math.floor(pos.book) * 10 + 5
  }
  return pos.book * 10 + pos.part
}

/**
 * Returns true if the content revealed at `revealedAt` is visible to a user at position `userPosition`.
 * If revealed at the exact user position, then visible. If revealed later, then hidden.
 */
export function isVisible(revealedAt: ReadingPosition, userPosition: ReadingPosition): boolean {
  return toComparableValue(revealedAt) <= toComparableValue(userPosition)
}

/**
 * Filters an entity at the user's reading position. Returns null if the entire entity is out of scope.
 */
export function filterEntity(
  entity: RawEntity,
  userPosition: ReadingPosition
): FilteredEntity | null {
  try {
    if (!isVisible(entity.first_revealed, userPosition)) {
      return null // "Locked" state because the entity is outside the scope
    }

    const visibleSections = entity.sections.filter(s => isVisible(s.revealed_at, userPosition))

    const visibleRelationships = entity.relationships.filter(r =>
      isVisible(r.revealed_at, userPosition)
    )

    const hasContentAhead =
      entity.sections.length > visibleSections.length ||
      entity.relationships.length > visibleRelationships.length

    return {
      ...entity,
      sections: visibleSections,
      relationships: visibleRelationships,
      hasContentAhead,
    }
  } catch {
    return null
  }
}

/**
 * Filters a list of entities at the read position. "Locked" (null) entities are silently excluded from the result.
 */
export function filterEntities(
  entities: RawEntity[],
  userPosition: ReadingPosition
): FilteredEntity[] {
  return entities
    .map(e => filterEntity(e, userPosition))
    .filter((e): e is FilteredEntity => e !== null)
}
