import React, { useState } from 'react'
import ReactMde from 'react-mde'
import { Content } from './index.ts'
import 'react-mde/lib/styles/css/react-mde-editor.css'
import 'react-mde/lib/styles/css/react-mde-toolbar.css'
import 'react-mde/lib/styles/css/react-mde.css'
import 'react-mde/lib/styles/css/react-mde-suggestions.css'

require('./style.scss')

type EditorTabs = 'write' | 'preview'

type EditContentType = {
  content: string,
  onChange: (content: string) => void,
}

const EditContent = ({ content, onChange }: EditContentType) => {
  const [selectedTab, setSelectedTab] = useState<EditorTabs>('write')
  return (
    <ReactMde
      value={content}
      onChange={onChange}
      selectedTab={selectedTab}
      onTabChange={setSelectedTab}
      generateMarkdownPreview={(markdown) => Promise.resolve(<Content content={markdown} />)}
    />
  )
}

export default EditContent
