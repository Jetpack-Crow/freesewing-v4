import fs from 'fs'
import path from 'path'
import { glob } from 'glob'

const prebuild = async () => {
  const blog = await glob('../org/blog/*')
  const showcase = await glob('../org/showcase/*')

  fs.writeFileSync(
    `./sluglist.mjs`,
    `// This file is auto-generated
export const sluglist = {
  blog: ${JSON.stringify(blog.map((slug) => slug.split('/').pop()))},
  showcase: ${JSON.stringify(showcase.map((slug) => slug.split('/').pop()))}
}`
  )
}

prebuild()
