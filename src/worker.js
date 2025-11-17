function cleanText(text) {
  if (!text || typeof text !== 'string') return ''
  
  text = text.replace(/cite[a-z]*\d+search\d+/g, '')
  text = text.replace(/citeturn\d+search\d+/g, '')
  text = text.replace(/\[\d+\]/g, '')
  text = text.replace(/\s+/g, ' ')
  return text.trim()
}

function slugify(name) {
  if (!name || typeof name !== 'string') return 'conversation'
  
  // Replace invalid filename characters but preserve Unicode letters
  const cleaned = name
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '_')  // Replace actual invalid filename chars
    .replace(/\s+/g, '_')  // Replace spaces with underscores
    .replace(/_{2,}/g, '_')  // Replace multiple underscores with single
    .trim()
  
  const result = cleaned.replace(/^[._-]+|[._-]+$/g, '')
  return result || 'conversation'
}

function extractConversationFromJson(jsonData) {
  const messages = []
  const mapping = jsonData.mapping || {}
  
  if (!mapping || Object.keys(mapping).length === 0) {
    return messages
  }
  
  let currentNode = jsonData.current_node
  if (!currentNode || !mapping[currentNode]) {
    for (const [nodeId, node] of Object.entries(mapping)) {
      if (!node.children || node.children.length === 0) {
        currentNode = nodeId
        break
      }
    }
  }
  
  if (!currentNode) {
    return messages
  }
  
  const conversationPath = []
  let nodeId = currentNode
  
  while (nodeId && mapping[nodeId]) {
    conversationPath.unshift(nodeId)
    const parent = mapping[nodeId].parent
    nodeId = parent
  }
  
  for (const nodeId of conversationPath) {
    if (!mapping[nodeId]) continue
    
    const node = mapping[nodeId]
    const message = node.message
    
    if (!message) continue
    
    const author = message.author || {}
    const role = author.role
    const content = message.content || {}
    
    if (role !== 'user' && role !== 'assistant') {
      continue
    }
    
    const contentType = content.content_type
    
    if (contentType === 'text') {
      const parts = content.parts || []
      if (parts.length > 0 && parts[0] && typeof parts[0] === 'string') {
        const text = cleanText(parts[0].trim())
        if (text) {
          messages.push({ role, content: text })
        }
      }
    }
  }
  
  return messages
}

function convertConversationsToTextFiles(conversations) {
  const files = []
  const seenFilenames = new Set()
  
  for (let idx = 0; idx < conversations.length; idx++) {
    const conversation = conversations[idx]
    const messages = extractConversationFromJson(conversation)
    
    if (messages.length === 0) {
      continue
    }
    
    let title = ''
    if (conversation.title && typeof conversation.title === 'string') {
      title = conversation.title.trim()
    }
    
    if (!title) {
      title = `conversation_${String(idx + 1).padStart(4, '0')}`
    }
    
    let filename = slugify(title)
    let counter = 1
    let finalFilename = filename
    
    while (seenFilenames.has(finalFilename)) {
      counter++
      finalFilename = `${filename}_${String(counter).padStart(2, '0')}`
    }
    
    seenFilenames.add(finalFilename)
    
    const textLines = []
    for (const message of messages) {
      if (message.role === 'user') {
        textLines.push(`User: ${message.content}`)
      } else if (message.role === 'assistant') {
        textLines.push(`ChatGPT: ${message.content}`)
      }
    }
    
    if (textLines.length > 0) {
      files.push({
        filename: `${finalFilename}.txt`,
        content: textLines.join('\n')
      })
    }
  }
  
  return files
}


self.onmessage = async function(event) {
  const { type, data } = event.data
  
  if (type === 'process') {
    try {
      const { content } = data
      
      self.postMessage({
        type: 'progress',
        data: { message: 'Parsing JSON...' }
      })
      
      let conversations
      try {
        const parsed = JSON.parse(content)
        
        if (Array.isArray(parsed)) {
          conversations = parsed
        } else if (parsed && typeof parsed === 'object') {
          conversations = parsed.conversations || 
                         parsed.items || 
                         parsed.data || 
                         [parsed]
        } else {
          throw new Error('Invalid JSON structure')
        }
      } catch (parseError) {
        throw new Error(`Failed to parse JSON: ${parseError.message}`)
      }
      
      if (!Array.isArray(conversations)) {
        throw new Error('Expected an array of conversations')
      }
      
      self.postMessage({
        type: 'progress',
        data: { message: `Processing ${conversations.length} conversations...` }
      })
      
      const files = convertConversationsToTextFiles(conversations)
      
      if (files.length === 0) {
        throw new Error('No valid conversations found in the export')
      }
      
      self.postMessage({
        type: 'success',
        data: {
          files: files,
          conversationCount: files.length,
          message: 'Conversion completed successfully!'
        }
      })
      
    } catch (error) {
      self.postMessage({
        type: 'error',
        data: { message: error.message }
      })
    }
  }
}