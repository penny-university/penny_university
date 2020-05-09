import React from 'react'
import ReactMarkdown from 'react-markdown'

type ContentProps = {
  source?: string,
  className?: string,
}

const Content = ({ source, className }: ContentProps) => (
  <ReactMarkdown className={className} source={source} />
)

Content.defaultProps = {
  bordered: false,
}

export default Content
