import React from 'react'
import ReactMarkdown from 'react-markdown'

type ContentProps = {
  content?: string,
  className?: string,
}

const Content = ({ content, className }: ContentProps) => (
  <ReactMarkdown className={className} source={content} />
)

Content.defaultProps = {
  bordered: false,
}

export default Content
