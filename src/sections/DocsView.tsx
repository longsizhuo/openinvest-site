import React, { useState, useEffect } from 'react'
import { DOCS_INDEX } from '../data/docsIndex'
import { useI18n } from '../i18n'

interface DocsViewProps {
  activeSlug: string
}

export function DocsView({ activeSlug }: DocsViewProps) {
  const { lang } = useI18n()
  
  const [docBody, setDocBody] = useState<string>('')
  const [docLoading, setDocLoading] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [frontmatter, setFrontmatter] = useState<Record<string, string>>({})

  // Find the currently active document item
  const activeDoc = DOCS_INDEX.find((d) => d.slug === activeSlug) || DOCS_INDEX[0]

  // Fetch document contents and parse frontmatter
  useEffect(() => {
    if (!activeDoc) return
    setDocLoading(true)
    const folder = activeDoc.category === 'wiki' ? 'wiki' : 'wiki/adr'
    
    fetch(`/docs/${folder}/${activeDoc.slug}.md`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load')
        return res.text()
      })
      .then((text) => {
        // Strip and parse frontmatter
        const fmMatch = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n/s)
        let body = text
        let fm: Record<string, string> = {}

        if (fmMatch) {
          body = text.replace(/^---\s*\n([\s\S]*?)\n---\s*\n/s, '')
          const lines = fmMatch[1].split('\n')
          for (const line of lines) {
            const colonIdx = line.indexOf(':')
            if (colonIdx !== -1) {
              const k = line.slice(0, colonIdx).trim()
              let v = line.slice(colonIdx + 1).trim()
              if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
                v = v.slice(1, -1)
              }
              fm[k] = v
            }
          }
        }
        
        setFrontmatter(fm)
        setDocBody(body)
        setDocLoading(false)
      })
      .catch(() => {
        setFrontmatter({})
        setDocBody('Failed to load document content. Please verify that the file exists.')
        setDocLoading(false)
      })
  }, [activeSlug, activeDoc])

  // Filter docs index based on search query
  const filteredDocs = DOCS_INDEX.filter((doc) => {
    const q = searchQuery.toLowerCase()
    return (
      doc.title.toLowerCase().includes(q) ||
      doc.slug.toLowerCase().includes(q) ||
      doc.intent.toLowerCase().includes(q)
    )
  })

  const wikiDocs = filteredDocs.filter((d) => d.category === 'wiki')
  const adrDocs = filteredDocs.filter((d) => d.category === 'adr')

  return (
    <div className="flex min-h-screen bg-white pt-16 text-gray-900">
      {/* Sidebar: Navigation Tree */}
      <aside className="w-80 border-r border-gray-200 bg-gray-50 flex flex-col sticky top-16 h-[calc(100vh-4rem)] select-none">
        {/* Search bar */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="relative">
            <input
              type="text"
              placeholder={lang === 'zh' ? '搜索文档...' : 'Search documentation...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 text-xs px-3 py-2 border border-gray-300 focus:outline-none focus:border-brand font-sans text-gray-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600 text-[10px]"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
          {/* Wiki Section */}
          <div>
            <div className="flex items-center gap-1.5 mb-2 px-1">
              <span className="text-[10px] bg-brand/10 text-brand px-1 py-0.5 font-bold uppercase tracking-wider">Book</span>
              <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                {lang === 'zh' ? 'Wiki 章节' : 'Wiki Chapters'}
              </h4>
            </div>
            {wikiDocs.length === 0 ? (
              <div className="text-[11px] text-gray-400 px-2 italic py-1">No matches</div>
            ) : (
              <div className="flex flex-col border-l border-gray-200 ml-2.5 pl-1.5 space-y-0.5">
                {wikiDocs.map((doc) => {
                  const isSelected = activeSlug === doc.slug
                  return (
                    <button
                      key={doc.slug}
                      onClick={() => {
                        window.location.hash = `#docs/${doc.slug}`
                      }}
                      className={`text-left px-2.5 py-1.5 text-xs transition border-l-2 -ml-[9px] ${
                        isSelected
                          ? 'border-brand bg-brand/5 text-brand font-semibold'
                          : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                      title={doc.intent || doc.title}
                    >
                      <div className="font-mono text-[10px] opacity-75">{doc.slug}</div>
                      <div className="truncate text-xs mt-0.5 text-gray-800">{doc.title}</div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* ADR Section */}
          <div>
            <div className="flex items-center gap-1.5 mb-2 px-1">
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 py-0.5 font-bold uppercase tracking-wider">ADR</span>
              <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                {lang === 'zh' ? '设计决策记录 (ADR)' : 'Architecture Decisions'}
              </h4>
            </div>
            {adrDocs.length === 0 ? (
              <div className="text-[11px] text-gray-400 px-2 italic py-1">No matches</div>
            ) : (
              <div className="flex flex-col border-l border-gray-200 ml-2.5 pl-1.5 space-y-0.5">
                {adrDocs.map((doc) => {
                  const isSelected = activeSlug === doc.slug
                  return (
                    <button
                      key={doc.slug}
                      onClick={() => {
                        window.location.hash = `#docs/${doc.slug}`
                      }}
                      className={`text-left px-2.5 py-1.5 text-xs transition border-l-2 -ml-[9px] ${
                        isSelected
                          ? 'border-brand bg-brand/5 text-brand font-semibold'
                          : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                      title={doc.intent || doc.title}
                    >
                      <div className="font-mono text-[10px] opacity-75">{doc.slug}</div>
                      <div className="truncate text-xs mt-0.5 text-gray-800">{doc.title}</div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Panel: Content viewer */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-4rem)] bg-white flex flex-col">
        {docLoading ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm italic">
            <div className="flex flex-col items-center gap-2">
              <div className="w-5 h-5 border-2 border-brand border-t-transparent animate-spin" />
              <span>{lang === 'zh' ? '加载文档中...' : 'Loading document...'}</span>
            </div>
          </div>
        ) : (
          <div className="flex-1 max-w-4xl w-full mx-auto px-8 md:px-12 py-12">
            {/* Header / Meta */}
            <div className="border-b border-gray-200 pb-6 mb-8">
              <div className="flex items-center gap-2 mb-2 text-xs">
                <span className={`px-2 py-0.5 font-mono font-semibold uppercase tracking-wider text-[10px] ${
                  activeDoc.category === 'wiki' ? 'bg-brand/10 text-brand' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {activeDoc.category}
                </span>
                <span className="text-gray-400 font-mono">{activeDoc.slug}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-sans tracking-tight leading-tight">
                {activeDoc.title}
              </h1>
              {activeDoc.intent && (
                <p className="text-xs text-gray-500 font-mono mt-2 italic">
                  {lang === 'zh' ? '意图: ' : 'Intent: '} {activeDoc.intent}
                </p>
              )}

              {/* Frontmatter metadata block */}
              {Object.keys(frontmatter).length > 0 && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 border border-gray-200/80 p-4 font-mono text-[11px] text-gray-600">
                  {frontmatter.status && (
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{lang === 'zh' ? '状态' : 'Status'}</div>
                      <div className="mt-1 text-gray-900 font-semibold">{frontmatter.status}</div>
                    </div>
                  )}
                  {frontmatter.date && (
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{lang === 'zh' ? '日期' : 'Date'}</div>
                      <div className="mt-1 text-gray-900 font-semibold">{frontmatter.date}</div>
                    </div>
                  )}
                  {frontmatter.tags && (
                    <div className="col-span-2">
                      <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Tags</div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {frontmatter.tags.replace(/[\[\]]/g, '').split(',').map((t, idx) => (
                          <span key={idx} className="bg-gray-200 px-1 py-0.5 text-[9px] text-gray-600">
                            {t.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Document body rendered */}
            <article className="prose max-w-none text-gray-800 text-xs md:text-sm font-sans leading-relaxed">
              {renderMarkdown(docBody)}
            </article>
          </div>
        )}
      </main>
    </div>
  )
}

// Inline formatting token parser
function renderInlineStyles(text: string): React.ReactNode {
  const tokenRegex = /(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g
  const parts = text.split(tokenRegex)
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-gray-900">
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={index} className="font-mono bg-gray-100 text-brand px-1.5 py-0.5 rounded text-[11px] border border-gray-200/50">
          {part.slice(1, -1)}
        </code>
      )
    }
    if (part.startsWith('[') && part.includes('](')) {
      const match = part.match(/\[(.*?)\]\((.*?)\)/)
      if (match) {
        const linkText = match[1]
        const linkUrl = match[2]
        // Handle external vs internal docs link
        const isExternal = linkUrl.startsWith('http') || linkUrl.startsWith('//')
        return (
          <a
            key={index}
            href={isExternal ? linkUrl : '#'}
            onClick={(e) => {
              if (!isExternal) {
                e.preventDefault()
                // extract slug from link, e.g. ./02-agents.md -> 02-agents
                const filename = linkUrl.split('/').pop()?.replace('.md', '')
                if (filename) {
                  window.location.hash = `#docs/${filename}`
                }
              }
            }}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="text-brand hover:underline font-semibold"
          >
            {linkText}
          </a>
        )
      }
    }
    return part
  })
}

// Markdown parser
function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n')
  let inCodeBlock = false
  let codeBlockLines: string[] = []
  let codeLanguage = ''

  const elements: React.ReactNode[] = []

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx]

    // Code block detection
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <div key={`code-container-${idx}`} className="relative my-4">
            {codeLanguage && (
              <span className="absolute right-3 top-2 text-[9px] text-gray-500 uppercase tracking-widest font-mono">
                {codeLanguage}
              </span>
            )}
            <pre className="font-mono text-[11px] bg-gray-950 text-gray-200 p-4 overflow-x-auto whitespace-pre rounded-none">
              {codeBlockLines.join('\n')}
            </pre>
          </div>
        )
        codeBlockLines = []
        inCodeBlock = false
      } else {
        inCodeBlock = true
        codeLanguage = line.slice(3).trim()
      }
      continue
    }

    if (inCodeBlock) {
      codeBlockLines.push(line)
      continue
    }

    // Horizontal Rule
    if (line.trim() === '---' || line.trim() === '***') {
      elements.push(<hr key={idx} className="border-t border-gray-200 my-8" />)
      continue
    }

    // Headings
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={idx} className="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-4 border-b border-gray-200 pb-2">
          {renderInlineStyles(line.slice(2))}
        </h1>
      )
      continue
    }
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={idx} className="text-base md:text-lg font-bold text-gray-900 mt-6 mb-3">
          {renderInlineStyles(line.slice(3))}
        </h2>
      )
      continue
    }
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={idx} className="text-sm md:text-base font-bold text-gray-900 mt-4 mb-2">
          {renderInlineStyles(line.slice(4))}
        </h3>
      )
      continue
    }

    // Blockquotes
    if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={idx} className="border-l-4 border-brand bg-gray-50 px-4 py-3 my-4 text-xs italic text-gray-600">
          {renderInlineStyles(line.slice(2))}
        </blockquote>
      )
      continue
    }

    // Lists (simple check)
    if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <li key={idx} className="ml-5 list-disc text-xs md:text-sm text-gray-700 my-1.5 leading-relaxed">
          {renderInlineStyles(line.slice(2))}
        </li>
      )
      continue
    }

    // Empty lines
    if (line.trim() === '') {
      elements.push(<div key={idx} className="h-3" />)
      continue
    }

    // Standard paragraphs
    elements.push(
      <p key={idx} className="text-xs md:text-sm text-gray-700 leading-relaxed my-3 font-normal">
        {renderInlineStyles(line)}
      </p>
    )
  }

  return elements
}
