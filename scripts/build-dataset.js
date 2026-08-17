import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')

const emptyDataset = {
  characters: [],
  locations: [],
  magic: [],
  spren: [],
  orders: [],
  organizations: [],
  glossary: [],
  events: [],
}

const meta = {
  version: 'dev',
  generated_at: new Date().toISOString(),
  counts: {
    characters: 0,
    locations: 0,
    magic: 0,
    spren: 0,
    orders: 0,
    organizations: 0,
    glossary: 0,
    events: 0,
  },
  total_entities: 0,
}

writeFileSync(join(publicDir, 'dataset.json'), JSON.stringify(emptyDataset, null, 2))
writeFileSync(join(publicDir, 'dataset-meta.json'), JSON.stringify(meta, null, 2))

console.log('✓ Dataset stub generated')
