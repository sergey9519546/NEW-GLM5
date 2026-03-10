'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useAdminBiosStore } from '@/store'

export function NewsApp() {
  const { news } = useAdminBiosStore()
  const [selectedNews, setSelectedNews] = useState<typeof news[0] | null>(null)
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
  
  return (
    <div className="news-app">
      <div className="news-sidebar">
        <div className="news-list">
          {news.map(item => (
            <div
              key={item.id}
              className={`news-item ${selectedNews?.id === item.id ? 'active' : ''}`}
              onClick={() => setSelectedNews(item)}
            >
              <div className="news-item-date">{formatDate(item.date)}</div>
              <div className="news-item-title">{item.title}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="news-main">
        {selectedNews ? (
          <div className="news-article">
            <div className="news-article-header">
              <h2>{selectedNews.title}</h2>
              <div className="news-article-meta">
                <span>{formatDate(selectedNews.date)}</span>
                {selectedNews.author && <span>by {selectedNews.author}</span>}
              </div>
            </div>
            <div className="news-article-content">
              <ReactMarkdown>{selectedNews.content}</ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className="news-empty">
            <p>Select a news article from the list</p>
          </div>
        )}
      </div>
    </div>
  )
}
