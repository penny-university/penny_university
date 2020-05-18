import React, { useState } from 'react'
import ReactMde from 'react-mde'
import * as Showdown from 'showdown'
import 'react-mde/lib/styles/css/react-mde-all.css'


type EditorTabs = 'write' | 'preview'

type EditContentType = {
  content: string,
  onChange: (content: string) => void,
}

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
})

const EditContent = ({ content, onChange }: EditContentType) => {
  const [selectedTab, setSelectedTab] = useState<EditorTabs>('write')
  return (
    <ReactMde
      value={content}
      onChange={onChange}
      selectedTab={selectedTab}
      onTabChange={setSelectedTab}
      generateMarkdownPreview={(markdown) => Promise.resolve(converter.makeHtml(markdown))}
    />
  )
}

export default EditContent
