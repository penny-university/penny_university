import React, { useState, useEffect } from 'react'
import ReactMde from 'react-mde'
import ReactMarkdown from 'react-markdown'
import { SaveButton, CancelButton } from '../buttons'
import 'react-mde/lib/styles/css/react-mde-editor.css'
import 'react-mde/lib/styles/css/react-mde-toolbar.css'
import 'react-mde/lib/styles/css/react-mde.css'
import 'react-mde/lib/styles/css/react-mde-suggestions.css'

require('./style.scss')

type EditorTabs = 'write' | 'preview'

type ContentProps = {
  content: string,
  className?: string,
  edit?: boolean,
  saveFollowUp?: (content: string) => void,
  cancelFollowUp?: () => void,
  storageKey?: string,
}

const Content = ({
  content: initialContent, className, edit, storageKey, saveFollowUp, cancelFollowUp: cancelOnPress,
}: ContentProps) => {
  const [selectedTab, setSelectedTab] = useState<EditorTabs>('write')
  const [content, updateContent] = useState(initialContent)
  useEffect(() => {
    if (storageKey) {
      const saved = sessionStorage.getItem(storageKey)
      if (saved !== null) {
        updateContent(saved)
      }
    }
  }, [updateContent, storageKey])
  const cancelFollowUp = () => {
    updateContent(initialContent)
    if (storageKey) {
      sessionStorage.removeItem(storageKey)
    }
    if (cancelOnPress) {
      cancelOnPress()
    }
  }
  const onSave = () => {
    if (saveFollowUp) {
      saveFollowUp(content)
      if (storageKey) {
        sessionStorage.removeItem(storageKey)
      }
    }
  }
  if (edit || initialContent !== content) {
    return (
      <>
        <ReactMde
          value={content}
          onChange={(c) => {
            if (storageKey) {
              sessionStorage.setItem(storageKey, c || '');
            }
            updateContent(c)
          }}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          generateMarkdownPreview={(markdown) => Promise.resolve(<ReactMarkdown source={markdown} />)}
        />
        <div className="mt-2">
          <SaveButton type="Follow Up" onClick={() => (saveFollowUp ? onSave() : null)} />
          <CancelButton className="ml-2" onClick={cancelFollowUp} />
        </div>
      </>
    )
  }
  return <ReactMarkdown className={className} source={content} />
}

Content.defaultProps = {
  bordered: false,
  editMode: false,
}

export default Content
