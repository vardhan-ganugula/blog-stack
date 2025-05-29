import React from 'react'
import JodEditor from 'jodit-react';


const TextEditor = (
    {
        onChange,
        value = ''
    }
) => {
    const [content, setContent] = React.useState('')
  return (
    <div
        
    >
        <JodEditor value={value}

        style={{ height: '800px', width: '100%' }}
        config={{
            readonly: false, 
            placeholder: 'Start writing your post here...',
            style: {
                height: '600px'
            },
            
        }}
           onChange={ (content) => onChange(content)}
        />
    </div>
  )
}

export default TextEditor