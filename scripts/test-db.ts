import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || 'file:./dev.db'
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Testing database connection and data...')
  
  const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } })
  
  console.log('\n=== Projects in Database ===')
  console.log(`Total: ${projects.length}\n`)
  
  for (const project of projects) {
    console.log(`ID: ${project.id}`)
    console.log(`Title: ${project.title}`)
    console.log(`Category: ${project.category}`)
    console.log(`Status: ${project.status}`)
    console.log(`Tags (raw): ${project.tags}`)
    
    try {
      const parsedTags = JSON.parse(project.tags)
      console.log(`Tags (parsed): ${JSON.stringify(parsedTags)}`)
    } catch (error) {
      console.log(`Tags (ERROR): Cannot parse - ${error}`)
    }
    
    console.log(`Image URL: ${project.imageUrl}`)
    console.log(`Demo URL: ${project.demoUrl}`)
    console.log(`Repo URL: ${project.repoUrl}`)
    console.log('---')
  }
  
  await prisma.$disconnect()
  console.log('\nDatabase test complete!')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
