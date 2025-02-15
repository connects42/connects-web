// pages/posts/[slug].js
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import markdown from 'markdown-it'
import { format } from 'date-fns'

export default function Post({ frontmatter, content }) {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <article className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">{frontmatter.title}</h1>
        <time className="text-gray-400 text-sm">
          {format(new Date(frontmatter.date), 'MMMM d, yyyy')}
        </time>
        <div 
          className="mt-8 prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </article>
    </div>
  )
}

export async function getStaticPaths() {
  const files = fs.readdirSync(path.join('posts'))
  const paths = files.map(filename => ({
    params: {
      slug: filename.replace('.md', '')
    }
  }))

  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params: { slug } }) {
  const markdownWithMeta = fs.readFileSync(path.join('posts', slug + '.md'), 'utf-8')
  const { data: frontmatter, content } = matter(markdownWithMeta)
  const md = markdown()

  return {
    props: {
      frontmatter,
      slug,
      content: md.render(content)
    }
  }
}