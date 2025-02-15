// pages/index.js
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'
import { format } from 'date-fns'

export default function Home({ posts }) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">My Blog</h1>
          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post.slug} className="border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition">
                <Link href={`/posts/${post.slug}`}>
                  <h2 className="text-2xl font-semibold mb-2 hover:text-blue-400">{post.title}</h2>
                </Link>
                <time className="text-gray-400 text-sm">
                  {format(new Date(post.date), 'MMMM d, yyyy h:mm a')}
                </time>
                <p className="mt-4 text-gray-300">{post.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    )
  }



export async function getStaticProps() {
  const postsDirectory = path.join(process.cwd(), 'posts')
  const filenames = fs.readdirSync(postsDirectory)

  const posts = filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, excerpt } = matter(fileContents, { excerpt: true })

    return {
      slug: filename.replace('.md', ''),
      title: data.title,
      date: data.date,
      excerpt: excerpt
    }
  })

  return {
    props: {
      posts: posts.sort((a, b) => new Date(b.date) - new Date(a.date))
    }
  }
}